import type { LessonData } from '../types/course';

export const PART1_LESSONS: Record<string, LessonData> = {
  ch1: {
    eyebrow: 'Part I · Chapter 1',
    title: 'How the Web Works',
    subtitle:
      'Every feature on FreeAppStore — sign-in, storage, real-time rooms, deployment — is built from URLs, DNS, HTTP, status codes, JSON, and TLS.',
    goals: [
      'Trace what happens between typing a URL and seeing a rendered page',
      'Understand domains, subdomains, wildcard DNS (*.freeappstore.online), and origins',
      'Read HTTP methods, headers, JSON bodies, and status codes (200–503)',
      'Understand stateless sessions, HTTPS/TLS, and Cache-Control + ETag caching',
    ],
    blocks: [
      { type: 'heading', text: 'Clients, Servers & URL Anatomy' },
      {
        type: 'p',
        text: 'A <strong>client</strong> asks for things (browser, <code>fas</code> CLI, <code>fetch()</code>). A <strong>server</strong> waits for requests and returns responses. One machine can be both: when FreeAppStore’s API Worker calls OpenWeather for you, it becomes a client of OpenWeather.',
      },
      {
        type: 'callout',
        kind: 'analogy',
        title: 'Analogy: A Restaurant',
        text: 'The client is a diner, the server is the kitchen, and HTTP is the order slip. You hand over a structured order and get back a plate plus a status note ("here you go", "out of that", "not allowed in VIP").',
      },
      {
        type: 'code',
        lang: 'js',
        label: 'URL encoding in SDK kv.js',
        code: "new URL(`/v1/apps/${encodeURIComponent(this.appId)}/kv/${encodeURIComponent(key)}`, this.apiBase)\n// Prevents keys like 'note/1' from becoming extra path segments (%2F)",
      },
      { type: 'lab', id: 'url-dissector' },
      { type: 'heading', text: 'Domains, Subdomains, Wildcard DNS & Origins' },
      {
        type: 'p',
        text: 'Domain names read right-to-left: <code>pinboard.freeappstore.online</code> → TLD (<code>.online</code>) → domain (<code>freeappstore</code>) → per-app subdomain (<code>pinboard</code>). A wildcard DNS record <code>*.freeappstore.online</code> routes every app subdomain to the <strong>host Worker</strong>.',
      },
      {
        type: 'callout',
        kind: 'note',
        title: 'Origins & Same-Origin Policy (SOP)',
        text: 'An origin is <code>scheme + host + port</code>. <code>https://pinboard.freeappstore.online</code> and <code>https://api.freeappstore.online</code> are different origins, so <code>localStorage</code> is isolated and the API must explicitly allow calls via CORS.',
      },
      { type: 'heading', text: 'HTTP Methods, Headers, JSON & Status Codes' },
      {
        type: 'table',
        headers: ['Method', 'Meaning', 'FreeAppStore Examples'],
        rows: [
          ['<code>GET</code>', 'Read resource (no mutation)', '<code>kv.get</code>, <code>counters.list</code>, <code>collection.query</code>'],
          ['<code>POST</code>', 'Create or trigger action', '<code>collection.create</code>, <code>counters.increment</code>, email, room ticket'],
          ['<code>PUT</code>', 'Create-or-replace at exact path', '<code>kv.set</code>, <code>collection.update</code>'],
          ['<code>PATCH</code>', 'Partially modify', '<code>auth.setDateOfBirth</code>'],
          ['<code>DELETE</code>', 'Remove resource', '<code>kv.delete</code>, <code>collection.delete</code>, <code>auth.deleteAccount</code>'],
          ['<code>OPTIONS</code>', 'CORS preflight check', 'Automatic before cross-origin <code>PUT</code> or <code>Authorization</code>'],
        ],
      },
      {
        type: 'callout',
        kind: 'warning',
        title: 'JSON.stringify(undefined) Trap',
        text: 'JSON supports strings, numbers, booleans, <code>null</code>, arrays, and objects — no functions or <code>undefined</code>. <code>JSON.stringify(undefined)</code> returns <code>undefined</code> (not a string), which is why <code>fas.kv.set(key, undefined)</code> throws up front.',
      },
      { type: 'lab', id: 'http-explorer' },
      { type: 'heading', text: 'Stateless Sessions, HTTPS/TLS & Caching' },
      {
        type: 'p',
        text: 'HTTP is <strong>stateless</strong>, so every authenticated call carries a signed session token in <code>Authorization: Bearer &lt;token&gt;</code>. <strong>TLS</strong> adds Encryption, Integrity, and Certificate Authentication. Caching uses <code>Cache-Control: public, max-age=31536000, immutable</code> for hashed assets (<code>index-DPEzKwt0.js</code>) and <code>max-age=60, must-revalidate</code> + <code>ETag</code> (<code>304 Not Modified</code>) for <code>index.html</code>.',
      },
      {
        type: 'callout',
        kind: 'exercise',
        title: 'Exercise 1.1 & 1.2 · Watch & Dissect',
        text: 'Use the URL Dissector above with <code>https://api.freeappstore.online/v1/apps/pinboard/kv?prefix=note:</code> and inspect <code>host</code>, <code>pathname</code>, and <code>encodeURIComponent("note/1 #a")</code>.',
      },
    ],
    quiz: {
      q: 'Why does the host Worker cache hashed JS bundles for 1 year (immutable) while index.html caches for only 60 seconds?',
      options: [
        'Browsers refuse to cache HTML files longer than 60 seconds',
        'Hashed filenames change whenever code changes, while index.html keeps the same filename',
        'JSON files cannot use ETags',
      ],
      answer: 1,
      explain:
        'If index-DPEzKwt0.js changes, its filename hash changes so index.html requests the new URL immediately.',
    },
  },

  ch2: {
    eyebrow: 'Part I · Chapter 2',
    title: 'The Browser Platform',
    subtitle:
      'Your React code runs inside a browser providing the DOM, modern CSS tokens, an asynchronous event loop, storage, history, WebSockets, and Web Crypto.',
    goals: [
      'Read every tag in the template index.html (viewport-fit=cover, lang, manifest, module script)',
      'Use CSS custom properties (--ink, --accent), @layer, 100dvh, env(safe-area-inset-*), and Tailwind',
      'Master the JS event loop, Promises, async/await, and fetch error handling',
      'Know the 7 browser APIs the SDK wraps plus window.onerror & unhandledrejection',
    ],
    blocks: [
      { type: 'heading', text: 'HTML Document, Semantic Tags & The DOM' },
      {
        type: 'code',
        lang: 'html',
        label: 'Template index.html core',
        code: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />\n  <meta name="theme-color" content="#000000" id="theme-color" />\n  <link rel="manifest" href="/manifest.json" />\n  <title>APPNAME — FreeAppStore</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>',
      },
      {
        type: 'p',
        text: "React takes control via a single DOM call: <code>createRoot(document.getElementById('root')!).render(&lt;App /&gt;)</code>. Semantic tags (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;h1&gt;</code>, <code>&lt;button&gt;</code>) give screen readers and browsers structure automatically.",
      },
      { type: 'heading', text: 'Modern CSS: Tokens, Dark Mode, @layer & dvh' },
      {
        type: 'p',
        text: 'SDK components style themselves with tokens on <code>:root</code> (<code>--paper</code>, <code>--ink</code>, <code>--accent</code>). Dark mode keys off <code>:root[data-theme="dark"]</code> rather than only <code>prefers-color-scheme</code> so the Shell’s toggle always works. <code>100dvh</code> adjusts for mobile browser bars (unlike unsafe <code>100vh</code>), and <code>@layer base</code> lets Tailwind utilities override base styles cleanly.',
      },
      { type: 'lab', id: 'theme-token-lab' },
      { type: 'heading', text: 'Event Loop, Promises & Async/Await' },
      {
        type: 'callout',
        kind: 'warning',
        title: 'fetch() does NOT reject on 404 or 500',
        text: '<code>fetch</code> only rejects on network failures (offline, DNS, CORS). HTTP 404/500 is a fulfilled Promise — you must check <code>if (!res.ok)</code>. Also, <code>Promise.allSettled</code> lets <code>kv.getMany</code> succeed even if one key returns 404.',
      },
      { type: 'lab', id: 'event-loop-lab' },
      { type: 'heading', text: 'Browser APIs Behind the SDK' },
      {
        type: 'table',
        headers: ['Browser API', 'Used By'],
        rows: [
          ['<code>fetch</code> &amp; <code>AbortController</code>', 'All REST SDK modules + <code>{ signal }</code> cancellation in effects'],
          ['<code>URL</code> &amp; <code>URLSearchParams</code>', 'Safe query encoding in SDK &amp; OAuth redirects'],
          ['<code>localStorage</code>', '<code>fas:session</code>, <code>stores-theme</code>, 500-entry log ring, standalone apps (wrapped in <code>try/catch</code>)'],
          ['History API (<code>pushState</code>, <code>replaceState</code>, <code>popstate</code>)', 'Client-side routing + wiping <code>#fas_session=</code> from URL'],
          ['<code>WebSocket</code> (<code>wss://</code>)', '<code>fas.rooms</code> real-time channels'],
          ['<code>navigator.onLine</code> + events', 'Shell offline banner &amp; <code>useOnline()</code>'],
          ['Web Crypto (<code>crypto.subtle</code>)', 'Backend HMAC session signing &amp; AES-256-GCM encryption'],
        ],
      },
    ],
    quiz: {
      q: 'Why does the FreeAppStore template wrap localStorage calls in try/catch?',
      options: [
        'localStorage is asynchronous and returns a rejected promise',
        'localStorage.setItem can throw in private browsing or when storage is full/disabled',
        'localStorage only works on localhost',
      ],
      answer: 1,
      explain: 'Defensive try/catch ensures restricted browsers still let the app run cleanly.',
    },
  },

  ch3: {
    eyebrow: 'Part I · Chapter 3',
    title: 'From JavaScript to TypeScript',
    subtitle: 'TypeScript adds static types checked by tsc and erased before the browser runs your JavaScript.',
    goals: [
      'Understand type erasure (tsc -b && vite build) and inference',
      'Know when type vs interface matters (collections Record<string, unknown> constraint)',
      'Read unions, literal types, narrowing, generics (<T = unknown>), and .d.ts files',
      'Understand every key option in web/tsconfig.app.json',
    ],
    blocks: [
      { type: 'heading', text: 'Type vs Interface, Unions, Narrowing & Generics' },
      {
        type: 'callout',
        kind: 'hood',
        title: 'Subtlety: type vs interface for Collections',
        text: 'The SDK declares <code>create&lt;T extends Record&lt;string, unknown&gt;&gt;(doc: T)</code>. An <code>interface</code> is NOT assignable to <code>Record&lt;string, unknown&gt;</code> because interfaces support declaration merging, whereas a <code>type Pin = { ... }</code> alias works.',
      },
      {
        type: 'callout',
        kind: 'warning',
        title: 'Generics are a promise, not runtime validation',
        text: '<code>fas.kv.get&lt;{ color: string }&gt;("theme")</code> tells TypeScript what shape to expect, but does not validate server JSON at runtime. Merge with defaults like <code>{ ...DEFAULTS, ...saved }</code>.',
      },
      {
        type: 'code',
        lang: 'ts',
        label: 'Real .d.ts excerpt (QueryOptions)',
        code: "export interface QueryOptions {\n  owner?: string\n  limit?: number\n  offset?: number          // pagination (not shown on SDK docs page!)\n  orderBy?: string\n  order?: 'asc' | 'desc'\n  bbox?: GeoBBox           // geo bounding box filter (also discovered in .d.ts)\n}",
      },
      { type: 'lab', id: 'ts-playground' },
      { type: 'heading', text: 'Templates tsconfig.app.json Highlights' },
      {
        type: 'table',
        headers: ['Option', 'Effect'],
        rows: [
          ['<code>"target": "es2023"</code>, <code>"lib": ["ES2023", "DOM"]</code>', 'Modern JS + browser DOM APIs'],
          ['<code>"verbatimModuleSyntax": true</code>', 'Requires <code>import type</code> or inline <code>type</code> for types'],
          ['<code>"noEmit": true</code>', '<code>tsc</code> only type-checks; Vite emits the JS'],
          ['<code>"erasableSyntaxOnly": true</code>', 'Forbids runtime TS constructs like <code>enum</code>'],
          ['<code>"noUnusedLocals"</code> / <code>"noUnusedParameters"</code>', 'Unused imports/variables fail the build'],
        ],
      },
    ],
    quiz: {
      q: 'Why does the Pinboard capstone define `export type Pin = { ... }` instead of `interface Pin`?',
      options: [
        'Interfaces cannot be exported across files',
        'Interfaces are not assignable to Record<string, unknown> in pins.create<T>()',
        'Types run faster at runtime',
      ],
      answer: 1,
      explain: 'TypeScript allows interfaces to be extended later, so it rejects them for Record<string, unknown> constraints.',
    },
  },

  ch4: {
    eyebrow: 'Part I · Chapter 4',
    title: 'React in Depth',
    subtitle:
      'How rendering, useEffect cleanup, StrictMode, refs, memoization, Context, custom hooks, Error Boundaries, and Suspense power FreeAppStore apps.',
    goals: [
      'Internalize React’s rendering model and functional state updaters',
      'Write leak-free useEffect hooks with AbortController and proper dependencies',
      'Understand why StrictMode mounts twice and why useToast() must be inside <Shell>',
      'Distinguish ErrorBoundary (render errors) from try/catch (event & async errors)',
    ],
    blocks: [
      { type: 'heading', text: 'Rendering, Effects & StrictMode' },
      {
        type: 'p',
        text: 'Every render is a fresh function call and state updates are scheduled. When new state depends on previous state, use the updater form: <code>setItems(prev => [newItem, ...prev])</code>. In development, <code>&lt;StrictMode&gt;</code> mounts → unmounts → remounts every component to expose missing effect cleanups.',
      },
      {
        type: 'callout',
        kind: 'warning',
        title: 'What Error Boundaries do NOT catch',
        text: 'An <code>ErrorBoundary</code> catches errors thrown during rendering. It never catches errors inside <code>onClick</code> handlers, <code>async/await</code>, or timers — always wrap those in <code>try/catch</code> and call <code>toast.show(...)</code>.',
      },
      { type: 'lab', id: 'react-lifecycle-lab' },
      { type: 'heading', text: 'Context, Custom Hooks & 10-Line Router' },
      {
        type: 'code',
        lang: 'tsx',
        label: 'SDK useAuth adapter & 10-line router pattern',
        code: 'export function useAuth(app: FreeAppStore) {\n  const [user, setUser] = useState(app.auth.user)\n  const [loading, setLoading] = useState(true)\n  useEffect(() => {\n    app.auth.init().finally(() => setLoading(false))\n    return app.auth.onChange(setUser) // returns Unsubscribe cleanup!\n  }, [app])\n  // ...\n}',
      },
    ],
    quiz: {
      q: 'What happens if an async save() click handler throws an uncaught error inside <Shell>?',
      options: [
        'Shell’s ErrorBoundary catches it and shows "Try again"',
        'ErrorBoundary ignores event/async errors; you must handle it with try/catch + toast',
        'React automatically retries the request',
      ],
      answer: 1,
      explain: 'Error boundaries only catch render-phase errors; async handlers require explicit try/catch.',
    },
  },

  ch5: {
    eyebrow: 'Part I · Chapter 5',
    title: 'The Developer’s Toolbox',
    subtitle: 'Terminal commands, Node 22+, npm/pnpm/npx, package.json, semver lockfiles, monorepo workspaces, Git remotes, and Vite builds.',
    goals: [
      'Parse CLI commands, flags, exit codes, and environment variables',
      'Read root, web, and SDK package.json fields (exports, peerDependencies, sideEffects)',
      'Understand semver (^ vs ~), pnpm-lock.yaml (--frozen-lockfile), and Git remotes',
      'Understand Vite dev server (localhost:5173, HMR) and production gzipped bundles (<300 KB)',
    ],
    blocks: [
      { type: 'heading', text: 'package.json, Exports & Semver' },
      {
        type: 'p',
        text: 'The SDK’s <code>package.json</code> declares three <code>exports</code> subpaths (<code>.</code>, <code>./hooks</code>, <code>./ui</code>), marks <code>react</code> as an <strong>optional peerDependency</strong> (so non-React apps can use core <code>fas.kv</code> without React), and sets <code>"sideEffects": false</code> for tree-shaking.',
      },
      {
        type: 'table',
        headers: ['Range', 'Accepts', 'Example in Templates'],
        rows: [
          ['<code>^0.14.30</code>', '<code>0.14.30</code> up to <code>&lt;0.15.0</code>', '<code>@freeappstore/sdk</code>'],
          ['<code>^19.2.5</code>', 'Any React <code>19.x</code>', '<code>react</code>, <code>react-dom</code>'],
          ['<code>~6.0.2</code>', 'Patch updates only (<code>6.0.x</code>)', '<code>typescript</code>'],
        ],
      },
      {
        type: 'callout',
        kind: 'mismatch',
        title: 'Docs vs. Code · git push upstream vs origin',
        text: 'Getting Started says <code>git push upstream main</code>, while template <code>CLAUDE.md</code> says <code>git push origin main</code>. Both are just remote names — push to whichever remote name <code>fas publish</code> outputs (check <code>git remote -v</code>).',
      },
      { type: 'heading', text: 'Vite Build & VITE_* Variables' },
      {
        type: 'p',
        text: '<code>pnpm build</code> runs <code>tsc -b && vite build</code>, producing content-hashed chunks in <code>web/dist/</code>. Only variables starting with <code>VITE_</code> enter browser code via <code>import.meta.env</code> — never store API secrets there.',
      },
    ],
    quiz: {
      q: 'Why does CI run `pnpm install --frozen-lockfile`?',
      options: [
        'To automatically upgrade all dependencies to latest',
        'To install exact versions from pnpm-lock.yaml and fail if package.json disagrees',
        'To skip downloading devDependencies',
      ],
      answer: 1,
      explain: 'Frozen lockfiles guarantee what was tested locally is identical to what ships in CI.',
    },
  },

  ch6: {
    eyebrow: 'Part I · Chapter 6',
    title: 'Progressive Web Apps',
    subtitle: 'FreeAppStore is a PWA store: every app must be installable, offline-capable, and fast via manifest.json and a Workbox service worker.',
    goals: [
      'Configure web/public/manifest.json (including maskable icons and min_viewport_width)',
      'Understand the 5 service worker lifecycle stages and 4 caching strategies',
      'Read every line of the template’s VitePWA configuration',
      'Handle standalone mode, 100dvh, safe-area insets, and the SDK Footer',
    ],
    blocks: [
      { type: 'heading', text: 'Manifest & Service Worker Lifecycle' },
      {
        type: 'p',
        text: 'A service worker is a programmable proxy between your page and the network: <strong>Register → Install → Waiting → Activate → Fetch</strong>. Using <code>vite-plugin-pwa</code> with <code>registerType: "autoUpdate"</code>, <code>skipWaiting: true</code>, and <code>clientsClaim: true</code> ensures users receive new deploys without stale caches.',
      },
      {
        type: 'callout',
        kind: 'note',
        title: 'navigateFallback & iPhone Home Screen',
        text: '<code>navigateFallback: "/index.html"</code> (with <code>navigateFallbackDenylist: [/^\\/api/, /^\\/v1/]</code>) ensures opening <code>/settings</code> from an iPhone home screen works offline instead of showing a blank page.',
      },
      {
        type: 'callout',
        kind: 'tip',
        title: 'Precache vs. Your Data',
        text: 'Service workers cache your app’s JS/CSS/HTML — not <code>fas.kv</code> cloud data. Design connected apps for network failure using toasts and Shell’s automatic offline banner.',
      },
    ],
    quiz: {
      q: 'Why does the SDK Footer component render only in standalone mode?',
      options: [
        'Browsers block <footer> elements in normal tabs',
        'In standalone mode there is no browser toolbar, so Footer adds bottom safe-area padding above the iPhone home swipe bar',
        'To hide FreeAppStore branding in desktop browsers',
      ],
      answer: 1,
      explain: 'It prevents bottom buttons from accidentally triggering iOS home gestures or Siri.',
    },
  },

  ch7: {
    eyebrow: 'Part I · Chapter 7',
    title: 'Backends, the Cloud and Deployment',
    subtitle: 'Understanding "Cloudflare Workers + D1 + Durable Objects + R2", Hono routing, prepared SQL, CORS, GitHub Actions, and cron jobs.',
    goals: [
      'Map REST endpoints to Hono routes and Cloudflare Workers bindings',
      'Read SQL upserts, prepared statements (? placeholders), and D1 migrations',
      'Understand R2 object prefixes and Durable Object WebSocket fan-out',
      'Read GitHub Actions workflows and 5-field UTC cron expressions',
    ],
    blocks: [
      { type: 'heading', text: 'Cloudflare Workers, Hono & D1 SQL' },
      {
        type: 'p',
        text: 'FreeAppStore runs on Cloudflare’s edge network. Workers expose a <code>fetch</code> handler and a <code>scheduled</code> cron handler, receiving <code>env.DB</code> (D1 SQLite), <code>env.APPS</code> (R2 bucket), and secrets via configuration bindings.',
      },
      {
        type: 'code',
        lang: 'sql',
        label: 'KV upsert & quota aggregation in D1',
        code: 'INSERT INTO kv (app_id, user_id, key, value, value_size_bytes, updated_at)\nVALUES (?, ?, ?, ?, ?, ?)\nON CONFLICT(app_id, user_id, key) DO UPDATE SET\n  value = excluded.value, value_size_bytes = excluded.value_size_bytes, updated_at = excluded.updated_at;',
      },
      {
        type: 'callout',
        kind: 'hood',
        title: 'Prepared Statements & Regex Validation',
        text: 'All values use <code>?</code> placeholders with <code>.bind(...)</code> to prevent SQL injection. For dynamic JSON field names in collections queries, the backend validates names with a strict regex first.',
      },
      { type: 'heading', text: 'CORS, Durable Objects & Cron Schedules' },
      {
        type: 'p',
        text: 'Each realtime room maps to one <strong>Durable Object</strong> worldwide keeping WebSockets in memory. CORS middleware allows <code>*.freeappstore.online</code>, sister stores, and <code>localhost</code>/<code>127.0.0.1</code>.',
      },
      { type: 'lab', id: 'cron-sql-lab' },
    ],
    quiz: {
      q: 'Why does a realtime chat room use a Durable Object instead of a regular Worker?',
      options: [
        'Regular Workers cannot open HTTPS connections',
        'Workers are stateless across edge nodes, whereas one Durable Object instance per room holds all connected WebSockets in memory',
        'Durable Objects have unlimited free storage',
      ],
      answer: 1,
      explain: 'All peers in a room must connect to the exact same stateful instance to fan out messages.',
    },
  },

  ch8: {
    eyebrow: 'Part I · Chapter 8',
    title: 'Security and Identity',
    subtitle: 'Signed session tokens, OAuth 2.0/2.1 + PKCE, device flow, AES-256-GCM envelope encryption, webhook HMACs, RBAC, and CSP.',
    goals: [
      'Distinguish Authentication (401) from Authorization (403)',
      'Inspect FreeAppStore’s HMAC-SHA256 session token format (body.sig)',
      'Trace OAuth 2.0 browser flow, CLI device flow, and OAuth 2.1 PKCE',
      'Understand AES-256-GCM envelope encryption (DEK + KEK) and timingSafeEqual',
    ],
    blocks: [
      { type: 'heading', text: 'Signed Tokens (Signed ≠ Encrypted)' },
      {
        type: 'p',
        text: 'Session tokens last 30 days and look like <code>base64url(payload).hmac_sha256_sig</code>. Anyone can decode the payload with <code>atob()</code>, so never store secrets inside. Changing a single character invalidates the HMAC signature.',
      },
      { type: 'lab', id: 'security-token-lab' },
      { type: 'heading', text: 'Envelope Encryption, Webhooks & RBAC' },
      {
        type: 'p',
        text: 'Stored proxy/vault secrets use <strong>envelope encryption</strong>: each secret gets a random 256-bit DEK (AES-GCM + 12-byte IV), and the DEK is wrapped with a Worker master KEK (<code>APP_SECRET_KEK</code>). Webhook deliveries sign the raw body with <code>X-FAS-Signature</code> and verify via <code>timingSafeEqual</code>.',
      },
      {
        type: 'callout',
        kind: 'warning',
        title: 'Client-side Role Checks Are UX Only',
        text: 'The server enforces collection document ownership and owner-only role assignment. Checking <code>fas.roles.check("moderator")</code> in React only hides UI buttons — never trust browser-only permission rules for sensitive actions.',
      },
    ],
    quiz: {
      q: 'Why does the SDK exchange a session token for a short-lived ticket before opening a WebSocket room?',
      options: [
        'WebSocket URLs are too short for 30-day tokens',
        'Browsers cannot send Authorization headers on WebSockets, so putting a 30-day token in the URL would leak it to server/proxy logs',
        'Tickets compress JSON messages faster',
      ],
      answer: 1,
      explain: 'A short-lived room ticket limits exposure if the wss:// URL is logged.',
    },
  },

  ch9: {
    eyebrow: 'Part I · Chapter 9',
    title: 'Accessibility and Interface Quality',
    subtitle: 'Landmarks, single <h1>, ARIA attributes, permanent live regions, focus management on navigation, 44px touch targets, and selectable text.',
    goals: [
      'Understand the accessibility tree and landmark elements (<header>, <nav>, <main>, <footer>)',
      'Learn why Shell’s toast live region is mounted empty from the start',
      'Keep keyboard focus management, skip links, labels, and 44px touch targets intact',
      'Fix the connected template’s body user-select: none warning',
    ],
    blocks: [
      { type: 'heading', text: 'Landmarks, ARIA & Live Regions' },
      {
        type: 'table',
        headers: ['Feature', 'Implementation in Shell'],
        rows: [
          ['Skip link', 'First focusable element, jumps to <code>&lt;main id="main" tabindex="-1"&gt;</code>'],
          ['Headings', 'One <code>&lt;h1&gt;</code> per screen via <code>&lt;PageHeader&gt;</code>; Shell moves focus here on route change'],
          ['Nav ARIA', '<code>&lt;nav aria-label="Main"&gt;</code>, <code>aria-current="page"</code>, <code>aria-expanded</code> + <code>aria-controls</code> on mobile'],
          ['Live region', 'Toast container is rendered empty on mount so screen readers register it before the first toast'],
          ['Touch &amp; Text', '44×44px min targets, <code>:focus-visible</code> outline, <code>touch-action: manipulation</code>'],
        ],
      },
      {
        type: 'callout',
        kind: 'warning',
        title: 'user-select: none Warning',
        text: 'The connected template’s <code>index.css</code> puts <code>user-select: none</code> on <code>body</code>, breaking text copying and triggering a <code>fas check</code> warning. Scope it only to <code>button, a, nav, [role="button"], label</code>.',
      },
    ],
    quiz: {
      q: 'Why does the Shell render its aria-live="polite" toast container empty on initial page load?',
      options: [
        'CSS animations require an empty initial div',
        'Screen readers often miss announcements if a live region is created at the exact same moment as its first text',
        'React Context requires an empty DOM node',
      ],
      answer: 1,
      explain: 'Assistive tech must already be observing the live region before text is inserted.',
    },
  },
};
