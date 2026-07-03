(function () {
  const BASE_URL = "https://open.neis.go.kr/hub";
  const DEFAULT_CONFIG = {
    apiKey: typeof NEIS_KEY !== "undefined" ? NEIS_KEY : "",
    apiBase: "",
    schoolName: "미림마이스터고등학교",
    officeCode: "",
    schoolCode: "",
    grade: "1",
    className: "2"
  };

  const config = { ...DEFAULT_CONFIG, ...(window.TILE_NEIS_CONFIG || {}) };
  const syncButton = document.getElementById("neisSync");
  const statusEl = document.getElementById("neisStatus");
  const isLocalHost = ["localhost", "127.0.0.1", "::1", ""].includes(window.location.hostname);
  const isGitHubPages = window.location.hostname.endsWith("github.io");
  const proxyBase = config.apiBase || (!config.apiKey && !isLocalHost && !isGitHubPages ? "/api/neis" : "");

  function setStatus(message) {
    if (statusEl) statusEl.textContent = message;
  }

  function hasNeisTransport() {
    return true;
  }

  function formatYmd(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/\([^)]*\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function formatMealMenu(value) {
    return String(value || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .split("\n")
      .map((item) => item.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join("\n");
  }

  function createUrl(endpoint, params = {}, options = {}) {
    const useProxy = proxyBase && !options.forceDirect;
    const url = useProxy
      ? new URL(proxyBase, window.location.origin)
      : new URL(`${BASE_URL}/${endpoint}`);
    const requestParams = {
      ...(useProxy ? { endpoint } : {}),
      Type: "json",
      pIndex: "1",
      pSize: "100",
      ...params
    };

    if (config.apiKey) requestParams.KEY = config.apiKey;

    Object.entries(requestParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });

    return url;
  }

  async function readErrorMessage(response) {
    try {
      const text = await response.text();
      if (!text) return "";
      try {
        const data = JSON.parse(text);
        return data.error || data.message || data.RESULT?.MESSAGE || text;
      } catch (error) {
        return text;
      }
    } catch (error) {
      return "";
    }
  }

  function readResultMessage(data, rowKey) {
    const head = data?.[rowKey]?.[0]?.head || data?.RESULT;
    const result = Array.isArray(head) ? head.find((item) => item.RESULT)?.RESULT : head;
    return result || null;
  }

  function getRows(data, rowKey) {
    const rows = data?.[rowKey]?.[1]?.row;
    return Array.isArray(rows) ? rows : [];
  }

  async function request(endpoint, params, rowKey) {
    let response = await fetch(createUrl(endpoint, params));
    if (!response.ok) {
      const message = await readErrorMessage(response);
      if (proxyBase && message.includes("NEIS_KEY")) {
        response = await fetch(createUrl(endpoint, params, { forceDirect: true }));
        if (response.ok) {
          const data = await response.json();
          const rows = getRows(data, rowKey);
          if (rows.length > 0) return rows;

          const result = readResultMessage(data, rowKey);
          if (result?.CODE === "INFO-200") return [];
          throw new Error(result?.MESSAGE || "NEIS 응답에 데이터가 없습니다.");
        }
      }
      const hint = message.includes("NEIS_KEY")
        ? "Vercel 환경변수 NEIS_KEY가 설정되지 않았고 직접 NEIS 요청도 실패했습니다."
        : message;
      throw new Error(hint || `NEIS 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const rows = getRows(data, rowKey);
    if (rows.length > 0) return rows;

    const result = readResultMessage(data, rowKey);
    if (result?.CODE === "INFO-200") return [];
    throw new Error(result?.MESSAGE || "NEIS 응답에 데이터가 없습니다.");
  }

  async function searchSchool(name) {
    if (!hasNeisTransport()) throw new Error("NEIS 연동 설정이 없습니다.");
    const rows = await request("schoolInfo", { SCHUL_NM: name }, "schoolInfo");
    return rows.map((school) => ({
      name: school.SCHUL_NM,
      code: school.SD_SCHUL_CODE,
      office: school.ATPT_OFCDC_SC_CODE
    }));
  }

  async function resolveSchool(user) {
    if (user?.school?.office && user?.school?.code) {
      return user.school;
    }

    if (config.officeCode && config.schoolCode) {
      return {
        name: config.schoolName,
        office: config.officeCode,
        code: config.schoolCode
      };
    }

    const schoolName = user?.school?.name || config.schoolName;
    const schools = await searchSchool(schoolName);
    const school = schools.find((item) => item.name === schoolName) || schools[0];
    if (!school) throw new Error("학교 정보를 찾지 못했습니다.");
    return school;
  }

  function getUserConfig(user) {
    return {
      school: user?.school || null,
      grade: user?.grade || config.grade,
      classNum: user?.classNum || config.className
    };
  }

  async function getMeal(user) {
    const currentUser = getUserConfig(user);
    const school = await resolveSchool(currentUser);
    const rows = await request(
      "mealServiceDietInfo",
      {
        ATPT_OFCDC_SC_CODE: school.office,
        SD_SCHUL_CODE: school.code,
        MLSV_YMD: formatYmd()
      },
      "mealServiceDietInfo"
    );

    return rows.map((row) => ({
      type: row.MMEAL_SC_NM,
      menu: formatMealMenu(row.DDISH_NM),
      rawMenu: String(row.DDISH_NM || "")
    }));
  }

  async function getTimetable(user) {
    const currentUser = getUserConfig(user);
    const school = await resolveSchool(currentUser);
    return request(
      "hisTimetable",
      {
        ATPT_OFCDC_SC_CODE: school.office,
        SD_SCHUL_CODE: school.code,
        GRADE: currentUser.grade,
        CLASS_NM: currentUser.classNum,
        ALL_TI_YMD: formatYmd()
      },
      "hisTimetable"
    );
  }

  function applyTimetable(rows) {
    const day = new Date().getDay();
    if (!(day >= 1 && day <= 5)) return 0;

    let applied = 0;
    rows
      .slice()
      .sort((a, b) => Number(a.PERIO || 0) - Number(b.PERIO || 0))
      .forEach((row) => {
        const period = `${Number(row.PERIO)}교시`;
        const subject = cleanText(row.ITRT_CNTNT);
        if (!subject) return;

        const targetRow = document.querySelector(`tbody tr[data-period="${period}"]`);
        const targetCell = targetRow?.querySelectorAll("td")[day - 1];
        if (!targetCell || targetCell.hasAttribute("colspan")) return;

        window.TileApp?.renderSubjectCell(targetCell, subject);
        if (row.CLRM_NM) {
          window.TileApp?.setSubjectInfo(subject, { room: cleanText(row.CLRM_NM) });
        }
        applied += 1;
      });

    window.TileApp?.refresh();
    return applied;
  }

  function applyMeals(meals) {
    meals.forEach((meal) => {
      if (meal.type === "조식" || meal.type === "중식" || meal.type === "석식") {
        window.TileApp?.setMeal(meal.type, meal.menu, meal.rawMenu);
      }
    });
  }

  async function syncNeis(options = {}) {
    const user = options.user || JSON.parse(localStorage.getItem("tile_user") || "null");

    if (!hasNeisTransport()) {
      setStatus("NEIS 설정 필요");
      if (!options.silent) alert("Vercel에는 NEIS_KEY 환경변수를 설정하고, 로컬 테스트는 config.js에 키를 넣어주세요.");
      return;
    }

    syncButton?.setAttribute("disabled", "true");
    setStatus("불러오는 중...");

    try {
      const [timetableRows, meals] = await Promise.all([
        getTimetable(user),
        getMeal(user)
      ]);

      const appliedCount = applyTimetable(timetableRows);
      applyMeals(meals);
      setStatus(`연결됨 · ${appliedCount}개 반영됨`);
    } catch (error) {
      console.error(error);
      setStatus("연동 실패");
      if (!options.silent) alert(error.message || "NEIS 연동 중 오류가 발생했습니다.");
    } finally {
      syncButton?.removeAttribute("disabled");
    }
  }

  syncButton?.addEventListener("click", () => syncNeis());

  window.searchSchool = searchSchool;
  window.getMeal = getMeal;
  window.getTimetable = getTimetable;
  window.syncNeis = syncNeis;
  window.TileNeis = {
    searchSchool,
    getMeal,
    getTimetable,
    sync: syncNeis
  };
})();
