type NeisEndpoint = "schoolInfo" | "mealServiceDietInfo" | "hisTimetable";

type QueryValue = string | number | null | undefined;
type QueryParams = Record<string, QueryValue>;

interface TileSchool {
  name: string;
  code?: string;
  office?: string;
  officeName?: string;
  foundation?: string;
  kind?: string;
  highSchoolType?: string;
  specialPurpose?: string;
  generalType?: string;
  industrySpecialized?: string;
  location?: string;
}

interface TileUserConfig {
  school?: TileSchool | null;
  grade?: string | number;
  classNum?: string | number;
}

interface ResolvedTileUser {
  school: TileSchool | null;
  grade: string;
  classNum: string;
}

interface NeisConfig {
  apiKey: string;
  apiBase: string;
  schoolName: string;
  officeCode: string;
  schoolCode: string;
  grade: string;
  className: string;
}

interface NeisResult {
  CODE?: string;
  MESSAGE?: string;
}

interface NeisSchoolRow {
  SCHUL_NM: string;
  SD_SCHUL_CODE: string;
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM?: string;
  FOND_SC_NM?: string;
  SCHUL_KND_SC_NM?: string;
  HS_SC_NM?: string;
  SPCLY_PURPS_HS_ORD_NM?: string;
  HS_GNRL_BUSNS_SC_NM?: string;
  INDST_SPECL_CCCCL_EXST_YN?: string;
  LCTN_SC_NM?: string;
}

interface NeisTimetableRow {
  ALL_TI_YMD?: string;
  TI_YMD?: string;
  PERIO?: string | number;
  ITRT_CNTNT?: string;
  CLRM_NM?: string;
  DDDEP_NM?: string;
}

interface NeisMealRow {
  MMEAL_SC_NM?: string;
  DDISH_NM?: string;
}

interface TileMeal {
  type: string;
  menu: string;
  rawMenu: string;
}

interface SyncOptions {
  user?: TileUserConfig | null;
  silent?: boolean;
}

interface ApplyTimetableOptions {
  preserveExisting?: boolean;
}

interface NeisRequestOptions {
  forceDirect?: boolean;
}

interface ReadRowsOptions extends NeisRequestOptions {
  allowPartial?: boolean;
}

interface TileAppBridge {
  renderRollingText?: (element: HTMLElement, text: string, key: string) => void;
  renderSubjectCell?: (cell: HTMLTableCellElement, subject: string) => void;
  setCellInfoByCell?: (
    cell: HTMLTableCellElement,
    info: { room: string; teacher: string }
  ) => void;
  refresh?: () => void;
  setMeal?: (type: string, menu: string, rawMenu: string) => void;
  setSchoolDetails?: (school: TileSchool) => void;
  setSchoolDepartment?: (department: string) => void;
}

interface TileNeisBridge {
  searchSchool: (name: string) => Promise<TileSchool[]>;
  getMeal: (user?: TileUserConfig | null) => Promise<TileMeal[]>;
  getTimetable: (user?: TileUserConfig | null) => Promise<NeisTimetableRow[]>;
  sync: (options?: SyncOptions) => Promise<boolean | undefined>;
}

interface Window {
  TILE_NEIS_CONFIG?: Partial<NeisConfig>;
  TileApp?: TileAppBridge;
  TileNeis?: TileNeisBridge;
  searchSchool: TileNeisBridge["searchSchool"];
  getMeal: TileNeisBridge["getMeal"];
  getTimetable: TileNeisBridge["getTimetable"];
  syncNeis: TileNeisBridge["sync"];
}

declare const NEIS_KEY: string | undefined;
