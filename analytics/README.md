# Tile 이용 흐름 집계

`metrics.js`는 운영 주소에서만 브라우저별 무작위 ID와 탭 세션 ID를 만들고,
허용된 단계 이름과 오류 범주만 `/api/metrics`에 보냅니다. 서버는 출처와 값을
검증하고 Supabase `tile_usage_events`에 저장합니다. 학교·학급·과목·메모·이메일,
IP 주소, 원문 오류 메시지, URL 쿼리와 공유 내용은 이벤트에 넣지 않습니다.

이 수치는 **사람 수가 아니라 브라우저 수**입니다. 같은 사람이 브라우저나
기기를 바꾸면 다시 셉니다. `auth_session_seen`은 해당 탭에서 로그인 상태를
확인했다는 뜻이며, 이 이벤트가 없는 탭을 비회원으로 확정하지 않습니다.
GA4의 방문자 수와 수집 차단·광고 차단 설정에 따라 차이가 날 수 있습니다.
운영자 테스트와 자동화 요청은 별도로 제외되지 않으므로 초기 데이터 해석에
반영해야 합니다. 브라우저가 직접 보내는 이벤트는 위조 가능하므로 과금이나
보안 판단에 사용하지 않습니다.

## 28일 집계

```sql
select event_name,
       count(*) as events,
       count(distinct visitor_id) as browsers,
       count(distinct session_id) as tab_sessions
from public.tile_usage_events
where recorded_at >= now() - interval '28 days'
group by event_name
order by events desc;
```

## 학교 설정에서 마지막으로 확인된 단계

```sql
with school_events as (
  select session_id, event_name, recorded_at, id,
         row_number() over (partition by session_id order by recorded_at desc, id desc) as latest
  from public.tile_usage_events
  where recorded_at >= now() - interval '28 days'
    and event_name in ('school_setup_view', 'school_search_empty',
      'school_search_error', 'school_selected', 'class_entered',
      'school_preview_ready', 'school_setup_complete', 'school_setup_closed',
      'school_setup_error', 'school_times_view', 'school_times_complete')
)
select event_name as last_observed_step,
       count(*) as tab_sessions
from school_events
where latest = 1
group by event_name
order by tab_sessions desc;
```

`school_setup_closed`는 사용자가 설정을 닫은 경우입니다. 페이지 이탈이나
네트워크 장애는 마지막 관측 단계까지만 알 수 있고, 이탈 이유를 단정하지
않습니다. `school_setup_error`의 `failure_reason`은 `validation`, `network`,
`provider`, `storage`, `unknown` 중 하나입니다.

## 학교 설정 단계별 도달 수

```sql
select event_name as step,
       count(distinct session_id) as tab_sessions
from public.tile_usage_events
where recorded_at >= now() - interval '28 days'
  and event_name in ('start_choices_view', 'school_setup_view',
    'school_selected', 'class_entered', 'school_preview_ready',
    'school_setup_complete', 'school_times_view', 'school_times_complete')
group by event_name
order by case event_name
  when 'start_choices_view' then 1
  when 'school_setup_view' then 2
  when 'school_selected' then 3
  when 'class_entered' then 4
  when 'school_preview_ready' then 5
  when 'school_setup_complete' then 6
  when 'school_times_view' then 7
  when 'school_times_complete' then 8
end;
```

각 행은 해당 단계에 도달한 탭 수입니다. 사용자가 단계를 건너뛰거나 여러 번
시작할 수 있으므로 앞 행과 뒷 행의 단순 차이를 이탈 인원으로 계산하지
않습니다. 위의 마지막 관측 단계 표와 오류 범주를 함께 확인합니다.

## 로그인 확인 여부

```sql
with sessions as (
  select session_id,
         bool_or(event_name = 'auth_session_seen') as signed_in_observed
  from public.tile_usage_events
  where recorded_at >= now() - interval '28 days'
  group by session_id
)
select signed_in_observed, count(*) as tab_sessions
from sessions
group by signed_in_observed;
```

마이그레이션은 최근 90일만 보관하도록 Supabase Cron 작업을 등록합니다.
운영 환경 적용 후 `cron.job`과 실제 이벤트 유입을 확인해야 합니다.
