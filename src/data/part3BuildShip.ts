import type { LessonData } from '../types/course';

export const PART3_LESSONS: Record<string, LessonData> = {
  ch10: {
    eyebrow: 'Part III · Chapter 10',
    title: 'Capstone: Pinboard',
    subtitle:
      'A complete multi-screen app exercising collections, atomic counters, realtime rooms, KV + AbortController, lazy loading, Shell, and zero-warning compliance.',
    goals: [
      'Build and test all 4 screens: Board (/), Live (/live), Settings (/settings), Account (/account)',
      'Share one SDK instance (lib/fas.ts) and custom useRouter() hook (lib/router.ts)',
      'Fix the two inherited connected-template warnings in Step 8 so fas check passes with 0 warnings',
    ],
    blocks: [
      { type: 'heading', text: 'Interactive Pinboard Capstone Simulator' },
      {
        type: 'p',
        text: 'Try the full simulated Pinboard app below before reading the production TypeScript source files:',
      },
      { type: 'lab', id: 'pinboard-sim' },
      { type: 'heading', text: 'Steps 1–4 · Scaffold, Shared Modules, Types & App.tsx' },
      {
        type: 'code',
        lang: 'ts',
        label: 'web/src/types.ts',
        code: 'export type Pin = { title: string; body: string; author: string }\nexport type StoredPin = Pin & { id: string; _owner?: string; _createdAt?: number }\nexport type Prefs = { displayName: string; compact: boolean }',
      },
      {
        type: 'code',
        lang: 'tsx',
        label: 'web/src/App.tsx',
        code: 'import { lazy } from \'react\'\nimport { type NavItem, Shell } from \'@freeappstore/sdk/ui\'\nimport { fas } from \'./lib/fas\'\nimport { useRouter } from \'./lib/router\'\nimport Board from \'./screens/Board\'\n\nconst Live = lazy(() => import(\'./screens/Live\'))\nconst Settings = lazy(() => import(\'./screens/Settings\'))\nconst Account = lazy(() => import(\'./screens/Account\'))\n\nconst NAV: NavItem[] = [\n  { label: \'Board\', href: \'/\', title: \'Pinboard\' },\n  { label: \'Live\', href: \'/live\', title: \'Live — Pinboard\' },\n  { label: \'Settings\', href: \'/settings\', title: \'Settings — Pinboard\' },\n  { label: \'Account\', href: \'/account\', title: \'Account — Pinboard\' },\n]\n\nexport default function App() {\n  const { path, navigate } = useRouter()\n  let screen\n  switch (path) {\n    case \'/live\': screen = <Live />; break\n    case \'/settings\': screen = <Settings />; break\n    case \'/account\': screen = <Account />; break\n    default: screen = <Board />\n  }\n  return (\n    <Shell app={fas} appName="Pinboard" nav={NAV} onNavigate={navigate}>\n      <div className="mx-auto w-full max-w-3xl p-4 sm:p-8">{screen}</div>\n      <p className="pb-8 text-center text-sm text-[var(--muted)]">\n        Pinboard is a free app on <a className="underline" href="https://freeappstore.online">FreeAppStore</a>.\n      </p>\n    </Shell>\n  )\n}',
      },
      { type: 'heading', text: 'Steps 5–7 · Board, Live, Settings & Account Highlights' },
      {
        type: 'p',
        text: '<strong>Board.tsx</strong> loads <code>pins.query({ limit: 20, orderBy: "created_at", order: "desc" })</code> and <code>fas.counters.list({ prefix: "likes:" })</code> via <code>Promise.all</code>, uses <code>ConfirmDialog</code> before delete, and adds <code>aria-label={`Like ${pin.title}`}</code>.<br><strong>Live.tsx</strong> keeps <code>Room</code> in <code>useRef</code>, wires <code>onPeers</code>/<code>onConnectionState</code>/<code>onMessage</code>, closes on cleanup, and appends sent messages locally.<br><strong>Settings.tsx</strong> uses <code>AbortController</code> + <code>{ ...DEFAULTS, ...saved }</code>.',
      },
      { type: 'heading', text: 'Steps 8–10 · Passing Every Compliance Check & Extending' },
      {
        type: 'code',
        lang: 'css',
        label: 'Step 8 Fix in web/src/index.css & manifest.json',
        code: '/* Remove user-select: none from body, and scope it to controls: */\nbutton, a, nav, [role="button"], label {\n  -webkit-user-select: none;\n  user-select: none;\n}\n/* In web/public/manifest.json: add "min_viewport_width": 360 */',
      },
      {
        type: 'p',
        text: '<strong>8 Extension Challenges:</strong> (1) Compact board mode via Context, (2) <code>offset</code> pagination, (3) Edit modal with <code>pins.update</code>, (4) One like per user tracked in KV, (5) Persist chat history in a collection, (6) Throttled typing indicator, (7) Lazy-loaded Leaflet map with <code>bbox</code>, (8) <code>SearchInput</code> + <code>useMemo</code> filter.',
      },
    ],
    quiz: {
      q: 'In Live.tsx, why is `room` stored in `useRef<Room | null>(null)` instead of `useState`?',
      options: [
        'useState cannot hold class instances',
        'We need room inside send() without triggering a React re-render when the reference changes',
        'useRef automatically closes WebSockets on unmount',
      ],
      answer: 1,
      explain: 'useRef provides a mutable box that survives renders without scheduling re-renders.',
    },
  },

  ch11: {
    eyebrow: 'Part III · Chapter 11',
    title: 'The Debugging Handbook',
    subtitle: 'A 6-step debugging method, rubber-ducking, the 10-layer tools map, stack trace reading, full problem catalogues, and a worked debugging session.',
    goals: [
      'Apply the 6-step method: Reproduce → Read all → Locate layer → One hypothesis → Fix cause → Document',
      'Pick the right tool across Build, Console, Network/WS, React DevTools, Application, App Logs, and Actions',
      'Diagnose real bugs using simulated DevTools tabs',
    ],
    blocks: [
      { type: 'heading', text: 'Reading a Stack Trace & Locating the Layer' },
      {
        type: 'code',
        lang: 'text',
        label: 'Worked stack trace from Board.tsx',
        code: "TypeError: Cannot read properties of undefined (reading 'collection')\n    at Board (Board.tsx:11:30)\n    at renderWithHooks (react-dom.development.js:…)\n// Line 1: what broke. Line 2: exact file/line/col (fas.db was undefined!). Skip React internals below.",
      },
      { type: 'heading', text: 'Interactive Debugging Detective (Worked Session & Ex 11.1)' },
      { type: 'lab', id: 'debug-detective-lab' },
      { type: 'heading', text: 'Quick Problem Catalogue' },
      {
        type: 'table',
        headers: ['Symptom', 'Cause', 'Fix'],
        rows: [
          ['<code>useToast must be used inside &lt;Shell&gt;</code>', 'Called above <code>&lt;Shell&gt;</code> in <code>App</code>', 'Move inside a screen child of <code>&lt;Shell&gt;</code>'],
          ['Infinite loop of API requests', 'Effect depends on non-memoised inline function/object', 'Wrap in <code>useCallback</code> / <code>useMemo</code>'],
          ['UI shows stale list after mutation', 'Mutated state array in place (<code>items.push()</code>)', 'Return new array: <code>setItems(prev =&gt; [...prev, x])</code>'],
          ['Pushed, but live site unchanged', 'Deploy failed or cached service worker', 'Run <code>fas logs &lt;id&gt;</code>; DevTools → SW → Update'],
        ],
      },
    ],
    quiz: {
      q: 'In the worked debugging session ("Likes don’t update"), DevTools Network showed `POST /counters/likes:p3 → 200 {"value":5}`. What did that prove?',
      options: [
        'The D1 database crashed',
        'The server worked; the bug was on the client state update (writing key `likes` instead of `[`likes:${id}`]`)',
        'CORS blocked the request',
      ],
      answer: 1,
      explain: 'Checking Network splits client vs. server problems in seconds.',
    },
  },

  ch12: {
    eyebrow: 'Part III · Chapter 12',
    title: 'Where to Go Next',
    subtitle: 'Eight graded practice projects, ten advanced topics beyond the platform, reading real codebases, and contributing open-source docs fixes.',
    goals: [
      'Pick your next project from the 8-step ladder (Unit Converter → AI Writing Helper)',
      'Map next topics: Vitest/Playwright, React Router/TanStack Query, Workers+D1, OWASP Top 10, WCAG 2.2',
      'Read packages/sdk/src and packages/backend/src/routes confidently',
    ],
    blocks: [
      { type: 'heading', text: '8 Graded Practice Projects' },
      {
        type: 'table',
        headers: ['#', 'Project', 'Template', 'Skills Practised'],
        rows: [
          ['1', 'Unit converter', 'standalone', '<code>Shell</code>, controlled inputs, <code>localStorage</code>'],
          ['2', 'Pomodoro timer', 'standalone', '<code>setInterval</code> cleanup, toasts, PWA <code>useStandalone</code>'],
          ['3', 'Habit tracker', 'connected', 'KV design under 100-key limit, <code>requireAuth</code>, <code>ProfilePage</code>'],
          ['4', 'Class poll', 'connected', 'Collections + atomic counters + one-vote-per-user in KV'],
          ['5', 'Weather dashboard', 'connected', 'Open-Meteo vs proxy, Recharts, lazy loading, caching'],
          ['6', 'Shared whiteboard', 'connected', 'Rooms with throttled strokes, <code>&lt;canvas&gt;</code>, sharded rooms'],
          ['7', 'AI writing helper', 'connected', '<code>fas.keys</code>, <code>KeyPrompt</code>, <code>no_key</code>, <code>useVoiceInput</code>'],
          ['8', 'Your own idea', 'either', 'Everything — and shipping to real users!'],
        ],
      },
      {
        type: 'callout',
        kind: 'tip',
        title: 'Keeping Docs & Code Honest',
        text: 'You now know 16 places where docs and shipped software differ (Appendix A). Opening an issue or PR against <code>docs/</code> in <code>freeappstore-online/platform</code> is a great first open-source contribution.',
      },
    ],
    quiz: {
      q: 'Which library removes most hand-written data-fetching effects, caching, and cancellation boilerplate in larger React apps?',
      options: ['Tailwind CSS', 'TanStack Query', 'Workbox'],
      answer: 1,
      explain: 'TanStack Query manages server state, caching, refetching, and cancellation automatically.',
    },
  },
};
