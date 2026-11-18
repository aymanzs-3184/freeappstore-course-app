export type RouteId =
  | 'home'
  | 'ch1'
  | 'ch2'
  | 'ch3'
  | 'ch4'
  | 'ch5'
  | 'ch6'
  | 'ch7'
  | 'ch8'
  | 'ch9'
  | 'm1'
  | 'm2'
  | 'm3'
  | 'm4'
  | 'm5'
  | 'm6'
  | 'm7'
  | 'm8'
  | 'm9'
  | 'm10'
  | 'ch10'
  | 'ch11'
  | 'ch12'
  | 'appA'
  | 'appB'
  | 'appC'
  | 'appD'
  | 'appE';

export interface NavItem {
  id: RouteId;
  label: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface PacingItem {
  weeks: string;
  read: string;
  action: string;
}

export type CalloutKind =
  | 'note'
  | 'tip'
  | 'warning'
  | 'hood'
  | 'mismatch'
  | 'analogy'
  | 'exercise';

export type LessonBlock =
  | { type: 'heading'; text: string }
  | { type: 'p'; text: string }
  | { type: 'callout'; kind: CalloutKind; title: string; text: string }
  | { type: 'code'; lang?: string; label?: string; code: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'lab'; id: LabId };

export type LabId =
  | 'url-dissector'
  | 'http-explorer'
  | 'theme-token-lab'
  | 'event-loop-lab'
  | 'ts-playground'
  | 'react-lifecycle-lab'
  | 'cron-sql-lab'
  | 'security-token-lab'
  | 'sdk-limits-lab'
  | 'fas-check-lab'
  | 'proxy-security-lab'
  | 'arch-tracer-lab'
  | 'pinboard-sim'
  | 'debug-detective-lab';

export interface LessonQuiz {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface LessonData {
  eyebrow: string;
  title: string;
  subtitle: string;
  goals?: string[];
  blocks: LessonBlock[];
  quiz?: LessonQuiz;
}

export interface DocsVsCodeEntry {
  id: number;
  page: string;
  docs: string;
  truth: string;
  fix: string;
}

export interface CoverageMapEntry {
  page: string;
  section: string;
  routes: RouteId[];
}

export type ToastVariant = 'default' | 'success' | 'error';
