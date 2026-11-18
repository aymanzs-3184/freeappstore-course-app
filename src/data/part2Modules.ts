import type { LessonData } from '../types/course';

export const PART2_LESSONS: Record<string, LessonData> = {
  m1: {
    eyebrow: 'Part II · Module 1 · docs.freeappstore.online/',
    title: 'Home',
    subtitle:
      'Unpacking the platform map: PWA store principles, "Build your app on the Shell", AI agent guides (MCP + SKILLS.md), and every public URL.',
    goals: [
      'Understand "free, open-source, MIT-licensed, untracked PWA app store"',
      'Understand why the platform insists on starting with the Shell',
      'Know every address in the Links table (Store, API, VibeCode, Console, MCP, GitHub, npm)',
    ],
    blocks: [
      { type: 'heading', text: 'Every Phrase & Address Explained' },
      {
        type: 'p',
        text: 'Every app gets a <code>yourapp.freeappstore.online</code> subdomain, a repo under <code>github.com/freeappstore-online</code>, and auto-deploy on push to <code>main</code>. Apps must be free forever, MIT-licensed, and free of third-party tracking SDKs.',
      },
      {
        type: 'table',
        headers: ['Resource', 'Address', 'Role'],
        rows: [
          ['Store', '<code>freeappstore.online</code>', 'Static storefront catalogue'],
          ['API', '<code>api.freeappstore.online</code>', 'Backend Worker (<code>/health</code>, <code>/status</code>)'],
          ['Console &amp; VibeCode', '<code>freeappstore.online/app/</code> · <code>/app/build</code>', 'Creator portal &amp; AI app builder (dogfooded Path B app)'],
          ['MCP', '<code>mcp.freeappstore.online/mcp</code>', 'Remote MCP server for AI agents'],
          ['npm packages', '<code>@freeappstore/sdk</code> · <code>@freeappstore/cli</code>', 'Zero-dependency browser SDK &amp; <code>fas</code> CLI'],
        ],
      },
      {
        type: 'callout',
        kind: 'tip',
        title: 'Key Phrase: "Server-enforced"',
        text: 'Whenever docs say a limit is server-enforced, the API Worker refuses invalid requests even if someone bypasses the SDK.',
      },
    ],
    quiz: {
      q: 'What happened to the separate "Publisher" service listed in older notes?',
      options: [
        'It moved to publisher.freeappstore.online',
        'It was decommissioned and folded into the main API (/v1/publish) & Console',
        'It now requires a paid ProAppStore account',
      ],
      answer: 1,
      explain: 'Console and Publisher share freeappstore.online/app/, and publishing calls the API.',
    },
  },

  m2: {
    eyebrow: 'Part II · Module 2 · /getting-started/',
    title: 'Getting Started',
    subtitle:
      'From prerequisites and `fas init` to the 43-line Shell example, templates, compliance checks, and a tour of every file in a new project.',
    goals: [
      'Walk through fas login, fas init, pnpm install && pnpm dev, and fas publish',
      'Understand all 43 lines of the Shell + router starter code',
      'Know the 5 templates (standalone, connected, game-canvas, game-grid, game-3d)',
      'Inspect every generated file (index.html, main.tsx, App.tsx, index.css, CLAUDE.md)',
    ],
    blocks: [
      { type: 'heading', text: 'Create Your App & The 4 Shell Rules' },
      {
        type: 'code',
        lang: 'bash',
        label: 'Getting Started CLI commands',
        code: 'npm i -g @freeappstore/cli\nfas login                 # GitHub device-flow auth → ~/.fas/config.json (0600)\nfas init my-cool-app      # shallow git clone of template + replaces APPNAME\ncd my-cool-app && pnpm install && pnpm dev   # http://localhost:5173',
      },
      {
        type: 'p',
        text: '<strong>The 4 Shell Rules:</strong> (1) Wrap in <code>&lt;Shell&gt;</code> with one <code>nav</code> entry per screen; (2) Start each screen with <code>&lt;PageHeader&gt;</code>; (3) Use <code>useToast()</code> and SDK components; (4) Never build your own header, sidebar, bottom dock, or nested ErrorBoundary.',
      },
      {
        type: 'callout',
        kind: 'mismatch',
        title: 'Docs vs. Code · Templates Table & Check Count',
        text: '1) A paragraph splits the Markdown table in the live docs so the 3 game rows may render as loose text — treat them as rows of the same table.<br>2) The docs list ~5 compliance checks, while CLI v0.4.31 actually runs ~20 checks (MIT LICENSE, no <code>.env.production</code>, no <code>100vh</code>, PWA offline correctness, store link, selectable text, etc.).',
      },
      { type: 'heading', text: 'File-by-File Tour Highlights' },
      {
        type: 'p',
        text: '<code>web/index.html</code> runs an inline pre-paint script setting <code>data-theme="dark"</code> from <code>stores-theme</code> or OS preference, loads Fraunces + Manrope, and loads the platform analytics script. <code>web/src/App.tsx</code> (connected) creates one module-level <code>fas = initApp({ appId })</code>, routes via <code>location.pathname</code>, and reads/writes <code>fas.kv</code>.',
      },
      {
        type: 'callout',
        kind: 'warning',
        title: 'Small Race in the Connected Starter',
        text: 'The starter’s <code>useEffect</code> calling <code>fas.kv.get("note")</code> lacks an <code>AbortController</code> and <code>.catch()</code>. In real apps (and the Pinboard capstone), always pass <code>{ signal }</code> and abort in cleanup.',
      },
    ],
    quiz: {
      q: 'In the connected template, what is the browser tab title on `/account` if Account calls `useDocumentTitle("Me")`?',
      options: ['Account — APPNAME', 'Me', 'APPNAME'],
      answer: 1,
      explain: 'The screen’s useDocumentTitle hook runs after Shell’s nav title effect and overrides it.',
    },
  },

  m3: {
    eyebrow: 'Part II · Module 3 · /sdk/',
    title: 'SDK Reference',
    subtitle:
      'All 11 sub-clients of `initApp`, exact TypeScript signatures from v0.14.35, hidden server behaviors, and choosing where data lives.',
    goals: [
      'Spot the critical SDK docs discrepancies (fas.collections, signInWithEmail, 12 webhook events, room no-echo)',
      'Understand auth.init(), KV prefix namespaces, atomic counters, and collection ownership',
      'Trace WebSocket room tickets, exponential backoff + jitter, and ephemeral fan-out',
      'Pick the right storage tier for any app feature',
    ],
    blocks: [
      { type: 'heading', text: 'Critical Docs-vs-Code Mismatches in SDK' },
      {
        type: 'callout',
        kind: 'mismatch',
        title: '1. fas.db does NOT exist — use fas.collections',
        text: 'SDK & Limits docs write <code>fas.db.collection("posts")</code>, which fails TypeScript and crashes at runtime. The real property in v0.14.35 is <code>fas.collections.collection("posts")</code>.',
      },
      {
        type: 'callout',
        kind: 'mismatch',
        title: '2. fas.auth.signIn("email") throws',
        text: 'In v0.14.35, calling <code>signIn("email")</code> throws <code>"Use signInWithEmail(email)..."</code>. Build your own email input and call <code>fas.auth.signInWithEmail(email)</code>.',
      },
      {
        type: 'callout',
        kind: 'mismatch',
        title: '3. Rooms do NOT echo your own messages',
        text: 'The room server runs <code>broadcast(msg, exceptSender)</code>. Append your own sent messages to React state locally when calling <code>room.send()</code>.',
      },
      {
        type: 'callout',
        kind: 'mismatch',
        title: '4. Webhooks: 12 events (not 8) & app.published rejected',
        text: 'Always call <code>fas.webhooks.list()</code> first and use a name from <code>supported_events</code>.',
      },
      { type: 'heading', text: 'Choosing Where Data Lives' },
      {
        type: 'table',
        headers: ['Need', 'Use', 'Why'],
        rows: [
          ['Device-only, no account', '<code>localStorage</code>', 'Instant, offline, no sign-in'],
          ['Private per-user synced data', '<code>fas.kv</code>', 'Scoped server-side to <code>(appId, userId)</code>'],
          ['Public-read, owner-write items', '<code>fas.collections</code>', 'Queryable across users; returns <code>_owner</code> &amp; <code>_createdAt</code>'],
          ['Shared tally / likes / votes', '<code>fas.counters</code>', 'Atomic SQL upsert; no lost-update race'],
          ['Live ephemeral presence/chat', '<code>fas.rooms</code>', 'Durable Object WebSocket fan-out; max 32 peers'],
          ['Developer API key / User AI key', '<code>fas.proxy</code> / <code>fas.keys</code>', 'Server-side injection; never shipped to browser'],
        ],
      },
      { type: 'lab', id: 'sdk-limits-lab' },
    ],
    quiz: {
      q: 'Why must shared like counts use `fas.counters.increment()` instead of `fas.kv.get()` + `fas.kv.set()`?',
      options: [
        'KV only stores numbers as booleans',
        'Two users liking at once would cause a lost-update race condition; counters perform an atomic SQL upsert',
        'KV is public-read',
      ],
      answer: 1,
      explain: 'Atomic increment performs read-add-write in a single indivisible database step.',
    },
  },

  m4: {
    eyebrow: 'Part II · Module 4 · /ui/',
    title: 'UI Components and the Shell',
    subtitle:
      'Shell anatomy, "What you get" table, props, 7-step migration guide, and all 25+ drop-in components verified against .d.ts declarations.',
    goals: [
      'Understand everything Shell renders (SkipLink, Topbar, Nav, Main, ErrorBoundary, Suspense, Footer, ToastProvider)',
      'Configure Shell props including requireAuth, renderNav, renderError, and onNavigate',
      'Use exact .d.ts props for ProfileMenu, VoiceButton, VoiceTextArea, Badge, and BuildInfo',
    ],
    blocks: [
      { type: 'heading', text: 'Shell Anatomy & Props' },
      {
        type: 'p',
        text: '<code>&lt;Shell app={fas} appName="…" nav={NAV} onNavigate={navigate}&gt;</code> provides the sticky topbar, responsive nav (collapsing to a menu under 640px), active-item matching via <code>activeHref(items, path)</code>, scroll restoration, ErrorBoundary (resetting per path), Suspense spinner, OfflineBanner, and ToastProvider.',
      },
      {
        type: 'callout',
        kind: 'hood',
        title: 'What requireAuth Renders',
        text: 'When <code>requireAuth</code> is set and no user is signed in, Shell hides the nav and shows a centered card with <code>SignInButton</code> (GitHub only). To offer both GitHub and Google, omit <code>requireAuth</code> and render your own sign-in card calling <code>fas.auth.signIn("google")</code>.',
      },
      { type: 'heading', text: 'Docs vs. Code in the Component Catalogue' },
      {
        type: 'table',
        headers: ['Component', 'Docs Say', 'Actual .d.ts Types (v0.14.35)'],
        rows: [
          ['<code>ProfileMenu</code>', '<code>app, user</code>', '<code>app, showThemeToggle?, children?</code> (reads user from <code>app</code>)'],
          ['<code>VoiceButton</code>', '<code>onResult</code>', '<code>voice, disabled?, size?</code> (pass return value of <code>useVoiceInput()</code>)'],
          ['<code>VoiceTextArea</code>', '<code>onVoiceResult</code>', '<code>value, onChange, voice, ...</code>'],
          ['<code>Badge</code>', 'Includes <code>info</code> variant', '<code>"default" | "accent" | "success" | "warning" | "danger"</code>'],
          ['<code>BuildInfo</code>', '"Shows SDK version"', 'Shows app’s <code>VITE_APP_VERSION</code>, commit SHA, build date (tap 5× / Alt-click)'],
        ],
      },
    ],
    quiz: {
      q: 'What error is thrown if a component calls `useToast()` outside `<Shell>`?',
      options: [
        'Cannot read properties of undefined (reading show)',
        'useToast must be used inside <Shell>',
        'ToastContext missing',
      ],
      answer: 1,
      explain: 'useToast checks useContext(ToastContext) and throws an explicit helpful error if null.',
    },
  },

  m5: {
    eyebrow: 'Part II · Module 5 · /cli/',
    title: 'CLI Reference',
    subtitle: 'Every `fas` command (login, doctor, init, check, publish, list, logs, secret, proxy, screencheck, quality) and CI automation.',
    goals: [
      'Use session commands, fas doctor, fas logs, and machine-readable fas list --json',
      'Understand policy-as-code across local fas check, compliance.yml, and weekly audits',
      'Configure secrets and proxy allowlists safely without leaking keys into shell history',
    ],
    blocks: [
      { type: 'heading', text: 'Commands & Policy as Code' },
      {
        type: 'p',
        text: '<code>fas</code> runs as an interactive TUI when attached to a TTY, or prints help when piped. <code>fas check</code> exits non-zero on hard failures (<code>✗</code>) and runs ~20 rules (tracking SDK grep, MIT licence, brand tokens/fonts, no <code>100vh</code>, PWA offline correctness, bundle &lt; 300 KB gzip, viewport &amp; selectable text warnings).',
      },
      { type: 'lab', id: 'fas-check-lab' },
      {
        type: 'callout',
        kind: 'tip',
        title: 'Shell History & Secrets',
        text: 'Running <code>fas secret set KEY val</code> saves the value in <code>~/.bash_history</code> or <code>~/.zsh_history</code>. Prefix with a leading space (<code>HISTCONTROL=ignorespace</code>) or clear that line afterwards.',
      },
    ],
    quiz: {
      q: 'Which command tests your built app across iPhone SE to iPad Pro viewports in headless Chromium?',
      options: ['fas doctor', 'fas quality', 'fas screencheck'],
      answer: 2,
      explain: 'fas screencheck uses Playwright on port 4571 (by default) to verify responsive layout.',
    },
  },

  m6: {
    eyebrow: 'Part II · Module 6 · /publishing/',
    title: 'Publishing',
    subtitle: 'Two-phase publishing: one-time provisioning (`fas publish`) and repeatable Path B deployment (`.github/workflows/deploy.yml`).',
    goals: [
      'Trace the 6 provisioning steps of fas publish (and the 503 GitHub Issue fallback)',
      'Read the 84-line .github/workflows/deploy.yml line by line',
      'Understand Path B hosting: GitHub Actions → wrangler r2 object put (×12) → host Worker',
    ],
    blocks: [
      { type: 'heading', text: 'Provisioning & Path B Deploy Flow' },
      {
        type: 'p',
        text: '<code>fas publish</code> runs <code>fas check</code>, verifies auth, calls the admin Worker via service binding to create an org repo in <code>freeappstore-online</code>, inserts a D1 <code>routes</code> row + storefront entry, writes <code>deploy.yml</code> if missing, and records ownership.',
      },
      {
        type: 'code',
        lang: 'yaml',
        label: 'Key safeguards in .github/workflows/deploy.yml',
        code: 'concurrency:\n  group: deploy-${{ github.repository }}\n  cancel-in-progress: true          # prevents older push overwriting newer push\n# ...\n- run: pnpm install --frozen-lockfile\n- run: pnpm build\n# Verify non-empty ./web/dist, then upload 12 files in parallel:\n# npx --yes wrangler@4 r2 object put "$BUCKET/$PREFIX/${rel}" --file "$f" --remote --content-type "$mime"',
      },
      {
        type: 'callout',
        kind: 'hood',
        title: 'Why --content-type "$mime" Is Mandatory',
        text: 'Wrangler defaults uploaded R2 objects to <code>application/octet-stream</code>. Combined with the host Worker’s <code>X-Content-Type-Options: nosniff</code> header, browsers would download HTML/JS instead of running them.',
      },
    ],
    quiz: {
      q: 'What does `fas publish` do if the auto-provisioning API returns 503?',
      options: [
        'Deletes your local repository',
        'Falls back to opening a prefilled GitHub Issue in the public submissions repository',
        'Publishes to npm instead',
      ],
      answer: 1,
      explain: 'Graceful fallback lets maintainers provision the app manually (also forced with --issue).',
    },
  },

  m7: {
    eyebrow: 'Part II · Module 7 · /proxy-and-keys/',
    title: 'Proxy & Keys',
    subtitle: 'App secret proxy (`fas.proxy`), User API key vault (`fas.keys`), injection modes, host-injection defense, and free keyless APIs.',
    goals: [
      'Configure fas secret + fas proxy allow with query, header, bearer, or oauth2_cc injection',
      'Understand longest-prefix matching, AI host blocking, and the userinfo (@evil.com) guard',
      'Use fas.keys (8 AI/payment providers) and handle 403 no_key gracefully',
      'Prefer keyless free APIs (Open-Meteo, Nominatim, OSM, Leaflet) when possible',
    ],
    blocks: [
      { type: 'heading', text: 'App Secret Proxy vs. User Key Vault' },
      {
        type: 'p',
        text: 'Both systems share one proxy endpoint (<code>/v1/apps/:appId/proxy/:host/*</code>). First the Worker checks your app’s 5-rule allowlist (longest prefix + HTTP method wins). If none matches and the host is one of 8 known providers (OpenAI, Anthropic, Google AI, OpenRouter, Replicate, Stability, ElevenLabs, Stripe), it uses the calling user’s vaulted key (1,000 req/day/user).',
      },
      { type: 'lab', id: 'proxy-security-lab' },
    ],
    quiz: {
      q: 'What HTTP status does the proxy return if the upstream API response exceeds 100 KB?',
      options: ['413 Payload Too Large', '429 Too Many Requests', '502 Bad Gateway'],
      answer: 2,
      explain: '413 is for an oversized request body (>100 KB); 502 Bad Gateway is for an oversized upstream response.',
    },
  },

  m8: {
    eyebrow: 'Part II · Module 8 · /platform-limits/',
    title: 'Platform Limits',
    subtitle: 'Every free-tier quota, `checkKvWrite`, fixed-window rate limiting, what FAS does NOT support (ProAppStore), and designing within limits.',
    goals: [
      'Know the exact limits & status codes for KV, Counters, Collections, Rooms, Proxy, Email, and Webhooks',
      'Understand why ProAppStore exists for file uploads, cron, custom domains, monetization, and server compute',
      'Design pagination, prefix partitioning, debouncing, and friendly error helpers',
    ],
    blocks: [
      { type: 'heading', text: 'Quotas, Status Codes & Unsupported Features' },
      {
        type: 'table',
        headers: ['Resource', 'Limit', 'On Breach'],
        rows: [
          ['<code>fas.kv</code>', '64 KB/value · 1 MB/user · 100 keys/user (UTF-8 bytes)', '<code>413</code>'],
          ['<code>fas.counters</code>', '1,000 keys/app · −1000..+1000 step', '<code>400</code> (step) / <code>413</code> (1001st)'],
          ['<code>fas.collections</code>', '10,000 docs/collection · 64 KB/doc', '<code>413</code>'],
          ['<code>fas.rooms</code>', '32 peers · 100 msg/s · 4 KB/msg · 64 rooms · 24h TTL', '<code>503</code> / dropped / LRU'],
          ['<code>fas.proxy</code>', '5 secrets · 5 rules · 10,000/day · 100 KB req/res', '<code>409</code> / <code>429</code> / <code>413</code> / <code>502</code>'],
          ['<code>fas.email</code> &amp; <code>webhooks</code>', '100/app/day &amp; 50/user/day · 5 webhooks', '<code>429</code> / <code>409</code>'],
        ],
      },
      {
        type: 'p',
        text: '<strong>Not supported on FreeAppStore:</strong> File uploads/R2, Workers AI (app-paid), Cron tasks, Custom domains, Monetization, and custom Server-side compute (per-app Worker + D1).',
      },
    ],
    quiz: {
      q: 'Why does FreeAppStore use a simple fixed-window counter per peer for the 100 msg/s room rate limit?',
      options: [
        'Cloudflare Workers cannot measure milliseconds',
        'It avoids allocating a ring buffer per peer on the hot message path while still bounding abuse',
        'Sliding windows violate WebSocket RFC',
      ],
      answer: 1,
      explain: 'A fixed window allows a brief boundary burst (up to 200 across a clock-second tick) in exchange for zero per-message allocation.',
    },
  },

  m9: {
    eyebrow: 'Part II · Module 9 · /architecture/',
    title: 'Architecture',
    subtitle: 'The complete system diagram (Figure M9.1), 14-folder monorepo, Workers, service bindings, 20-table D1 schema, and cron jobs.',
    goals: [
      'Trace any user or developer request across Clients, Workers, Durable Objects, D1, and R2',
      'Understand why the wildcard host Worker uses service bindings for api. and docs.',
      'Know the 20 tables in D1 database "fas" and the 4 scheduled cron jobs',
    ],
    blocks: [
      { type: 'heading', text: 'Interactive Architecture Tracer (Figure M9.1 & Ex M9.1)' },
      { type: 'lab', id: 'arch-tracer-lab' },
      { type: 'heading', text: 'Monorepo, Companion Repos & Data Model' },
      {
        type: 'p',
        text: '<code>fas/platform/</code> houses <code>packages/*</code> (<code>backend</code>, <code>cli</code>, <code>sdk</code>, <code>compliance</code>, <code>quality</code>, <code>kb-host</code>, <code>e2e</code>), <code>workers/*</code> (<code>admin</code>, <code>agent</code>, <code>host</code>, <code>mcp</code>), <code>sites/console</code>, <code>brand/</code>, and <code>ops/</code>. Four repos remain standalone: <code>freeappstore</code>, <code>submissions</code>, <code>template-connected</code>, and <code>template-standalone</code>.',
      },
    ],
    quiz: {
      q: 'Why does the host Worker on `*.freeappstore.online` hold service bindings to the API and KB Workers?',
      options: [
        'To share localStorage across subdomains',
        'Because the wildcard route catches api. and docs. too, so the host Worker forwards reserved subdomains internally',
        'To compile TypeScript inside D1',
      ],
      answer: 1,
      explain: 'Wildcards match every subdomain, so reserved platform subdomains are forwarded via service bindings.',
    },
  },

  m10: {
    eyebrow: 'Part II · Module 10 · /mcp/',
    title: 'MCP Server',
    subtitle: 'Connecting Claude Code, Codex, and Cursor via Model Context Protocol, the 12 tools, workflow recipes, OAuth 2.1 PKCE, and prompt-injection defenses.',
    goals: [
      'Connect AI coding agents via npx mcp-remote or .mcp.json',
      'Know the 12 tools across Build, VibeCode, Read, and Inspect',
      'Understand MCP security: scoped tokens, dry_run, read-only mode, audit logs, no generic shell',
    ],
    blocks: [
      { type: 'heading', text: 'Setup, 12 Tools & Security Model' },
      {
        type: 'code',
        lang: 'json',
        label: 'Project-local .mcp.json',
        code: '{\n  "mcpServers": {\n    "freeappstore": {\n      "command": "npx",\n      "args": ["mcp-remote", "https://mcp.freeappstore.online/mcp"]\n    }\n  }\n}',
      },
      {
        type: 'table',
        headers: ['Group', 'Tools'],
        rows: [
          ['Build (you write)', '<code>create_app</code>, <code>update_files</code> (supports <code>dry_run: true</code>)'],
          ['Build (VibeCode)', '<code>agent_build</code>, <code>agent_status</code> (uses user’s vaulted AI key)'],
          ['Read (no auth)', '<code>list_files</code>, <code>read_file</code>'],
          ['Inspect', '<code>list_apps</code>, <code>app_info</code>, <code>deploy_status</code>, <code>app_logs</code>, <code>platform_guide</code>, <code>sdk_reference</code>'],
        ],
      },
      {
        type: 'callout',
        kind: 'warning',
        title: 'Prompt Injection & Least Privilege',
        text: 'Send <code>X-FAS-Read-Only: true</code> or <code>?read_only=1</code> when auditing. Deleting apps, changing DNS/billing, or direct D1/KV access are intentionally unsupported via MCP.',
      },
    ],
    quiz: {
      q: 'Which OAuth response mode does the MCP Worker use with deliver-session.ts, and why?',
      options: [
        'URL #fragment mode',
        'One-time code mode with PKCE, because server-side callers log URLs and cannot read #fragments',
        'Legacy ?fas_session= query parameter',
      ],
      answer: 1,
      explain: 'PKCE + POST /v1/auth/session/exchange ensures no reusable token ever appears in a URL.',
    },
  },
};
