# Tile
![Tile Banner](./assets/TileBanner.png)



> [!CAUTION]
> `© 2026 Lightframe. All Rights Reserved.` <br>
> **이 Repository의 모든 파일은 소중한 개인 저작권의 보호를 받습니다. 무단 복제 및 도용을 금지합니다.** <br>
> **This repository is NOT open source.** <br>
> ### Tile 서비스는 개인정보 보호와 보안을 기본 원칙으로 다룹니다. <br> 자세한 내용은 [개인정보 보호 및 보안](./SECURITY.md)을 참고하시거나, 상단 Repository 해더에서, `Security` 탭을 확인하세요.

> 학교 일과 관리를 위한 리얼타임 시스템 기반 통합형 크로스플랫폼 TimeTable<br>
> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/JSON-5E5C5C?style=for-the-badge&logo=json&logoColor=white"> <img src="https://img.shields.io/badge/Swift-F05138?style=for-the-badge&logo=swift&logoColor=white"> <br>
> <img src="https://img.shields.io/badge/iOS-Pre_Alpha-orange?style=for-the-badge&logo=apple&logoColor=white&labelColor=000000"> <img src="https://img.shields.io/badge/Android-Planned-3178C6?style=for-the-badge&logo=android&logoColor=white&labelColor=3DDC84"> <img src="https://img.shields.io/badge/Web-Alpha-red?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=4285F4"> <br>
> **Web: [Tile](https://tile0.vercel.app/) | App: Coming Soon**

## 기여자

| 프로필 | GitHub | 역할 | 담당 업무 |
| :---: | :---: | :---: | :--- |
| <img src="https://github.com/justcallmelightt.png" width="80"> | **권율**<br>([@justcallmelightt](https://github.com/justcallmelightt)) | **Creator** [99.50%] | Tile 서비스 기획 및 전반적인 End-to-End 개발 주도<br><details><summary><b>상세 업무 보기 (클릭)</b></summary><blockquote><small><sub>- Tile 서비스 전체 아이디어 기획 및 초기 Product Concept 설계<br>- 서비스 방향성 정의 및 전체 Product Vision 수립<br>- 프로젝트 전체 Frontend Architecture 및 Core System Structure 직접 설계<br>- 핵심 기능 로직 설계 및 주요 Features 대부분 직접 Development<br>- Dynamic Rendering 기반 실시간 UI 업데이트 로직 구현<br>- State Management 및 LocalStorage 기반 사용자 데이터 Persistence 시스템 구현<br>- Modal System, Overlay Logic, Custom Panel 등 Interactive Component Architecture 설계<br>- UI/UX 전체 구조 설계 및 실제 사용 환경 기준 User Flow 지속 개선<br>- Animation, Transition, Motion Interaction 등 세부 Interaction Design 직접 구현 및 최적화<br>- Responsive Layout 설계 및 다양한 Screen Size 환경 대응 구조 설계<br>- Mobile Environment 중심 UX 최적화 및 Device-specific Behavior 직접 구현<br>- Apple Ecosystem (iPhone · iPad · Apple Watch) 기반 Cross-device Experience 설계 및 대응<br>- Apple-like Design Philosophy 기반 Interface Design 및 디테일 조정<br>- 실시간 Timeline, Schedule Tracking, Rolling Clock Animation 등 Live UI System 구현<br>- Performance Optimization 및 불필요한 Re-render 최소화를 위한 구조 개선<br>- 전체 Code Structure 설계 및 Maintainability 고려한 프로젝트 구조 관리<br>- 프로젝트 전반 Development Lifecycle 관리 및 전체 Development Process Lead<br>- 전체 서비스 Architecture 설계부터 Deployment 직전 단계까지 End-to-End Development 주도<br>- 프로젝트 주요 Technical Decision Making 및 전체 기술 스택 방향 결정</sub></small></blockquote></details> |
| <img src="https://github.com/eonpisa.png" width="80"> | **eonpisa**<br>([@eonpisa](https://github.com/eonpisa)) | **Alpha Tester** [0.50%] | - Tile 서비스 Alpha Tester<br>- Custom TimeTable 기능 Tester<br>- 바이브 코딩<br>- Issues 보고 |

**Tile**은 HTML 방과후 수업 시간에 “간단한 시간표를 직접 만들어보자”는 생각에서 시작한 프로젝트입니다.  
처음에는 정적인 형태의 단순한 시간표 페이지였지만, 만들면서 아쉬운 점이 점점 보이기 시작했습니다.  
“지금 몇 교시인지 바로 알 수 있으면 좋겠다”, “남은 시간을 한눈에 볼 수 있으면 좋겠다”, “현재 교실과 진행 상황까지 함께 보이면 훨씬 편하지 않을까” 같은 고민이 쌓이면서, 이 프로젝트는 단순한 표를 넘어서 **실시간 상태를 반영하는 시간표 웹 프로젝트**로 확장되었습니다.

이 과정에서 단순히 정보를 배치하는 수준에 그치지 않고,  
**사용자가 실제로 보기 편한 구조가 무엇인지**,  
**어떤 정보가 가장 먼저 보여야 하는지**,  
**어떻게 하면 사용 경험이 더 좋아질 수 있는지**,  
**현재 상황을 어떻게 더 직관적으로 전달할 수 있는지**를 계속 고민하며 UI와 기능을 다듬었습니다.  
그 결과 Tile은 단순한 HTML 연습물이 아니라,  
**실사용성을 고려한 프론트엔드 프로젝트이자, 직접 기획하고 개선해 나간 성장형 작업물**이 되었습니다.

이 프로젝트는 여기서 끝나지 않습니다.  
추후에는 사용자가 직접 시간표를 입력하고 커스텀할 수 있도록 확장하여,  
### **어떤 학교든, 어떤 학급이든, 누구든 사용할 수 있는 통합형 TimeTable 서비스**로 발전시키는 것을 목표로 하고 있습니다.  
최종적으로는 **웹과 앱을 모두 아우르는 대통합 시간표 플랫폼** 형태로 돌아오는 것을 지향합니다.

---

## 이 프로젝트가 중요한 이유

Tile은 단순한 시간표 페이지를 만드는 데서 끝난 프로젝트가 아닙니다.  
처음에는 학교 HTML 방과후 수업에서 시작한 작은 작업이었지만, 만들면서 실제 사용성을 고려하게 되었고, 그 과정에서 단순한 정적 페이지를 넘어 **실시간성과 직관성, 사용자 경험을 함께 고민한 프로젝트**로 발전했습니다.

이 프로젝트에는 단순히 시간표를 표로 정리하는 것 이상의 요소가 담겨 있습니다.  
현재 시간이 어느 교시에 해당하는지 계산하고, 남은 시간을 표시하며, 현재 교실과 진행 상황을 한눈에 보여주기 위해 조건 분기와 시간 계산 로직을 직접 구현했습니다.  
또한 사용자가 더 편하게 정보를 확인할 수 있도록 카드형 UI, 시각적 타임라인, 다크 모드, 모바일 대응까지 반영했습니다.

즉 Tile은  
- **정적인 데이터를 실시간 정보처럼 보여주는 방식**
- **사용자 중심으로 정보를 재구성하는 과정**
- **웹 UI와 기능을 함께 개선해 나가는 흐름**  
을 담고 있는 프로젝트입니다.

저에게 이 프로젝트는 단순한 수업 결과물이 아니라,  
작은 아이디어를 실제로 사용할 수 있는 형태로 확장해 나가며  
**기획, 구현, 개선의 과정을 직접 경험한 성장형 프론트엔드 작업물**이라는 점에서 의미가 있습니다.

---

## Tile만의 차별점

Tile의 가장 큰 차별점은 단순한 시간표가 아니라,  
현재 시간과 상황에 맞춰 실시간으로 상태가 바뀌는 **자동화 일과표**에 가깝다는 점입니다.

사용자는 단순히 오늘의 과목만 확인하는 것이 아니라,  
**지금 몇 교시인지**, **쉬는시간인지**, **현재 어떤 교실에 있어야 하는지**,  
그리고 이동수업 과목이라면 **어느 교실로 이동해야 하는지**까지 빠르게 파악할 수 있습니다.

또한 현재 진행 중인 교시의 흐름을 시각적 타임라인으로 표현하여,  
**한 교시가 어느 정도 진행되었는지**를 직관적으로 확인할 수 있도록 구현했습니다.  
즉, 단순한 표 형태의 시간표를 넘어  
**실제 학교생활의 흐름을 반영하는 실사용형 시간표 프로젝트**를 목표로 했습니다.

---

## 핵심 기능

- 실시간 현재 교시 / 쉬는시간 판별
- 남은 시간 및 일과 남은 시간 계산
- 현재 교실 / 담당 선생님 정보 표시
- 이동수업 시 이동해야 할 교실 확인 가능
- 시각적 타임라인 바 구현
- 다크 모드 지원
- 모바일 대응

## 주요 기능

### 1. 실시간 시간표 표시
현재 시각을 기준으로 지금이 몇 교시인지, 쉬는시간인지, 일과 시간 외인지 자동으로 판별합니다.

### 2. 남은 시간 표시
- 교시 중일 때: 교시 남은 시간 표시
- 쉬는시간일 때: 남은 쉬는 시간 표시
- 오전 6시 ~ 일과 시작 전: 일과 시작까지 남은 시간 표시
- 일과 종료 후: 일과 시간 아님 표시

### 3. 현재 교실 / 선생님 안내
과목에 따라 현재 사용 중인 교실과 담당 선생님 정보를 함께 표시합니다.

### 4. 이동수업 안내
이동수업 과목일 경우, 사용자가 현재 어느 교실로 가야 하는지를 바로 확인할 수 있도록 구성했습니다.

### 5. 타임라인 바
현재 진행 중인 교시의 위치를 빨간 타임라인 바로 시각적으로 표시하여,  
교시 및 일과의 진행 정도를 직관적으로 확인할 수 있습니다.

### 6. UI / UX
- 가독성 높은 카드형 정보 구조
- 반응형 레이아웃
- 다크 모드 지원

---

## 개인정보 보호 및 보안

Tile은 현재 회원가입이나 로그인을 요구하지 않는 로컬 우선 시간표 서비스입니다.

- 학교명, 학년·반, 직접 입력한 시간표, 과목 정보, 메모, 테마와 화면 설정은 사용 중인 브라우저의 `localStorage`에 저장됩니다.
- 이 데이터는 Tile 서버의 사용자 계정 데이터베이스에 저장되지 않으며, 브라우저의 사이트 데이터를 삭제하면 함께 삭제됩니다.
- NEIS 동기화를 선택한 경우에만 학교 검색 및 시간표·급식 조회에 필요한 학교·학년·반 정보가 Vercel의 `/api/neis` 프록시를 거쳐 NEIS Open API로 전송됩니다.
- 시간표와 메모에는 다른 사람의 개인정보나 민감한 정보를 입력하지 않는 것을 권장합니다.
- 향후 계정, 동기화, 분석 기능을 도입하는 경우에는 수집 항목과 목적, 보관·삭제 방식을 이 문서에 명확히 업데이트합니다.

자세한 내용은 [개인정보 보호 및 보안](./PRIVACY_SECURITY.md)을 참고하세요.

## 배포와 환경 변수

Tile은 GitHub Pages와 Vercel 배포를 함께 고려합니다.

- GitHub Pages는 정적 호스팅이므로 브라우저에서 사용하는 API 키를 완전히 숨길 수 없습니다.
- Vercel 배포판은 `/api/neis` 서버리스 프록시를 통해 NEIS 요청을 보내며, 실제 키는 Vercel Environment Variables의 `NEIS_KEY`에만 저장합니다.
- `config.js`, `.env`, `.env.*`는 `.gitignore`에 포함되어 있으므로 실제 키를 커밋하지 않습니다.
- 공개 저장소에는 `config.public.js`, `config.example.js`, `.env.example`만 포함합니다.

Vercel 환경변수:

```bash
NEIS_KEY=your_neis_open_api_key
```

로컬에서 키를 테스트해야 한다면 `config.example.js`를 참고해 `config.js`를 만들되, 실제 키는 절대 커밋하지 마세요.

GitHub Pages 배포 체크가 `deployment_queued`에서 오래 멈추면 저장소의 **Settings → Pages → Build and deployment**에서 Source를 `GitHub Actions`로 맞춘 뒤, 포함된 `.github/workflows/pages.yml` 워크플로로 배포하세요. Vercel만 정식 배포판으로 쓸 경우 GitHub Pages를 비활성화하면 Pages deploy 체크 자체가 생성되지 않습니다.

---

## 로드맵

- [x] 웹 시간표 구현
- [x] 실시간 현재 교시 감지
- [x] 남은 시간 표시
- [x] 강의실 / 담당 교사 정보
- [x] 다크 모드
- [x] 모바일 반응형 UI
- [x] 앱에서 오프라인 상태일 경우 앱 내장 로컬 HTML로 Fallback (iOS)
- [ ] 사용자 별 맞춤형 학교 시간표 편집기
- [ ] 사용자 별 맞춤형 수업 설정
- [x] 웹 호스팅
- [ ] 웹 서비스 버전
- [x] 앱 제작 (iOS)
- [ ] 앱 서비스 버전
- [ ] 통합 시간표 플랫폼

## 파일 구조

```bash
index.html
style.css
script.js
neis.js                 # TypeScript build output used by the browser
src/neis.ts             # Typed NEIS browser client
src/types.d.ts          # Shared Tile and NEIS types
api/neis.ts             # Vercel NEIS proxy
data/default-timetable.json
package.json
tsconfig.json
README.md
```

## 개발 환경

```bash
npm install
npm run typecheck
npm run build
```

`npm run build` compiles `src/neis.ts` to the browser-compatible `neis.js` file and then runs the full TypeScript type check.
