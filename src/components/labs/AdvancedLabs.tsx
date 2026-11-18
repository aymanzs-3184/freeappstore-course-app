import React, { useState } from 'react';
import type { ToastVariant } from '../../types/course';

interface LabProps {
  onToast: (msg: string, variant?: ToastVariant) => void;
}

const CRON_MAP: Record<string, string> = {
  '*/15 * * * *': 'Every 15 minutes (UTC) → Platform uptime checks',
  '0 3 * * *': 'Daily at 03:00 UTC → Prune logs (>7d) & expired tokens',
  '0 4 * * *': 'Daily at 04:00 UTC → Backup D1 database to R2 fas-backups',
  '0 6 * * SUN': 'Sundays at 06:00 UTC → Weekly compliance audit',
  '0 * * * *': 'Every hour on the hour (Ex 7.2)',
  '30 9 * * 1-5': '09:30 every weekday (Ex 7.2)',
};

export function CronSqlLab() {
  const [cron, setCron] = useState('*/15 * * * *');

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          Cron Schedule Translator &amp; Prepared SQL
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 7</span>
      </div>

      <label className="block text-xs font-semibold text-[var(--muted)]">
        Select 5-field UTC cron expression
        <select
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          className="font-mono-code mt-1 min-h-[42px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)]"
        >
          {Object.keys(CRON_MAP).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </label>

      <pre className="font-mono-code mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {`Schedule: ${cron}\nMeaning : ${CRON_MAP[cron]}\n\nSafe Prepared SQL (Ex 7.1):\nSELECT key FROM kv WHERE app_id = ? AND user_id = ? AND key LIKE 'note:%';\n-- Bound via .bind('pinboard', 'gh:77') so SQL injection is impossible.`}
      </pre>
    </div>
  );
}

function toBase64Url(obj: unknown): string {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function SecurityTokenLab() {
  const [uid, setUid] = useState('gh:4242');
  const origSig = 'Zk3x9Qm8R2vLpA7tYw';
  const payload = { uid, roles: ['user'], iat: 1791000000, exp: 1793592000 };
  const body = toBase64Url(payload);
  const valid = uid === 'gh:4242';

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          HMAC Session Token Decoder &amp; Tamper Lab (Ex 8.1)
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 8</span>
      </div>

      <div className="mb-3 flex flex-wrap items-end gap-3">
        <label className="text-xs font-semibold text-[var(--muted)]">
          Edit <code>uid</code> claim
          <input
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="mt-1 block min-h-[40px] w-48 rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)]"
          />
        </label>
        <button
          type="button"
          onClick={() => setUid('gh:4242')}
          className="min-h-[40px] cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
        >
          Restore gh:4242
        </button>
      </div>

      <pre className="font-mono-code overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {`Token (body.signature):\n${body}.${origSig}\n\nDecoded JSON (anyone can read with atob — NOT encrypted!):\n${JSON.stringify(
          payload,
          null,
          2
        )}\n\nServer HMAC-SHA256 Check (timingSafeEqual):\n${
          valid
            ? '✓ 200 OK — Signature matches! Authenticated as gh:4242.'
            : '✗ 401 Unauthorized — Signature mismatch! Changing uid invalidates the HMAC.'
        }`}
      </pre>
    </div>
  );
}

export function SdkLimitsLab() {
  const [kvText, setKvText] = useState('Hello Pinboard 📌');
  const [kvTotal, setKvTotal] = useState(1048000);
  const [kvKeys, setKvKeys] = useState(99);
  const [attempt, setAttempt] = useState(2);

  const bytes = new TextEncoder().encode(JSON.stringify(kvText)).length;
  const projected = kvTotal + bytes;

  let kvResult = '✓ 204 OK';
  if (bytes > 65536) kvResult = '✗ 413: Exceeds 64 KB per value';
  else if (projected > 1048576) kvResult = '✗ 413: Exceeds 1 MB per user';
  else if (kvKeys >= 100) kvResult = '✗ 413: Exceeds 100 keys per user';

  const baseWait = Math.min(30, Math.pow(2, attempt));

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          KV Quota Checker (<code>checkKvWrite</code>) &amp; Room Backoff Calculator
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Module 3 · Module 8</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-[var(--muted)]">
            Test KV value (UTF-8 bytes, emoji = 4B)
            <input
              value={kvText}
              onChange={(e) => setKvText(e.target.value)}
              className="mt-1 min-h-[40px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)]"
            />
          </label>
          <label className="block text-xs font-semibold text-[var(--muted)]">
            Existing total bytes (max 1,048,576)
            <input
              type="number"
              value={kvTotal}
              onChange={(e) => setKvTotal(Number(e.target.value) || 0)}
              className="tabular-nums mt-1 min-h-[40px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)]"
            />
          </label>
          <label className="block text-xs font-semibold text-[var(--muted)]">
            Existing keys (max 100)
            <input
              type="number"
              value={kvKeys}
              onChange={(e) => setKvKeys(Number(e.target.value) || 0)}
              className="tabular-nums mt-1 min-h-[40px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)]"
            />
          </label>
        </div>

        <div className="flex flex-col justify-between">
          <label className="block text-xs font-semibold text-[var(--muted)]">
            Room Reconnect Attempt: <span className="tabular-nums text-[var(--ink)]">#{attempt}</span> (range 0–6)
            <input
              type="range"
              min={0}
              max={6}
              value={attempt}
              onChange={(e) => setAttempt(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--accent)]"
            />
          </label>

          <pre className="font-mono-code tabular-nums mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
            {`KV UTF-8 size : ${bytes} bytes\nProjected user: ${projected.toLocaleString()} / 1,048,576 B\nResult        : ${kvResult}\n\nRoom Attempt #${attempt}: wait ${baseWait}s + 0–1s random jitter\n(capped at 30s at attempt 5+)`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function FasCheckLab() {
  const [checks, setChecks] = useState({
    appname: false,
    tracker: false,
    vh100: false,
    size: false,
    select: true,
    viewport: true,
  });

  const toggle = (k: keyof typeof checks) =>
    setChecks((prev) => ({ ...prev, [k]: !prev[k] }));

  const hard: string[] = [];
  const warn: string[] = [];
  if (checks.appname) hard.push('✗ No template placeholders: APPNAME found');
  if (checks.tracker) hard.push('✗ No tracking SDKs: mixpanel detected');
  if (checks.vh100) hard.push('✗ No unsafe 100vh: use 100dvh');
  if (checks.size) hard.push('✗ Bundle size: 320 KB >= 300 KB limit');
  if (checks.select) warn.push('! Text selectable: user-select: none on body');
  if (checks.viewport) warn.push('! Viewport support: manifest.min_viewport_width missing');

  const summary = [
    hard.length ? hard.join('\n') : '✓ All hard checks passed (exit code 0)',
    warn.length ? warn.join('\n') : '✓ 0 warnings (Pinboard Step 8 clean!)',
  ].join('\n');

  const items: { key: keyof typeof checks; label: React.ReactNode }[] = [
    { key: 'appname', label: <>Leave <code>APPNAME</code> placeholder</> },
    { key: 'tracker', label: <>Import <code>mixpanel</code></> },
    { key: 'vh100', label: <>Use <code>100vh</code></> },
    { key: 'size', label: 'Main bundle 320 KB gzipped' },
    { key: 'select', label: <><code>user-select: none</code> on body</> },
    { key: 'viewport', label: <>Missing <code>min_viewport_width</code></> },
  ];

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          <code>fas check</code> Compliance Gate Simulator
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Module 5 · Chapter 10</span>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <label key={item.key} className="flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={checks[item.key]}
              onChange={() => toggle(item.key)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>

      <pre className="font-mono-code overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {summary}
      </pre>
    </div>
  );
}

const PROXY_TESTS = {
  ok: {
    label: 'Valid Weather GET',
    url: 'api.openweathermap.org/data/2.5/weather?q=London',
    method: 'GET',
    out: '✓ 200 OK: Matched allowlist https://api.openweathermap.org/ → injected ?appid=<OPENWEATHER_KEY> server-side.',
  },
  post: {
    label: 'Disallowed POST',
    url: 'api.openweathermap.org/data/2.5/weather?q=Paris',
    method: 'POST',
    out: '✗ 403 Forbidden: POST is not in the rule’s default --methods GET list.',
  },
  userinfo: {
    label: '@evil.com Spoof Attack',
    url: 'api.openweathermap.org@evil.com/steal',
    method: 'GET',
    out: '✗ 403 Blocked by Host-Injection Guard: parsed host is evil.com, not api.openweathermap.org!',
  },
  ai: {
    label: 'OpenAI Vault Fallback',
    url: 'api.openai.com/v1/chat/completions',
    method: 'POST',
    out: '✗ 403 {"error":"no_key","provider":"openai"} → No app allowlist match; vault lookup found no user key → call fas.keys.manage("openai").',
  },
};

export function ProxySecurityLab() {
  const [selected, setSelected] = useState<keyof typeof PROXY_TESTS>('ok');
  const test = PROXY_TESTS[selected];

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          Proxy Allowlist &amp; Attack Simulator (Ex M7.2)
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Module 7</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(PROXY_TESTS) as (keyof typeof PROXY_TESTS)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSelected(k)}
            className={`min-h-9 cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              selected === k
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)]'
            }`}
          >
            {PROXY_TESTS[k].label}
          </button>
        ))}
      </div>

      <pre className="font-mono-code mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {`fas.proxy.fetch('${test.url}', { method: '${test.method}' })\n\n${test.out}`}
      </pre>
    </div>
  );
}

const ARCH_NODES = [
  'Browser / CLI',
  'GitHub',
  'host Worker',
  'api Worker',
  'admin Worker',
  'Room DO',
  'D1 (fas)',
  'R2 (fas-apps)',
];

const ARCH_FLOWS = {
  open: {
    label: '1. Open App',
    active: ['Browser / CLI', 'host Worker', 'D1 (fas)', 'R2 (fas-apps)'],
    desc: '1) Visitor opens pinboard.freeappstore.online → wildcard DNS hits host Worker → resolves route in D1 → streams index.html & hashed assets from R2 fas-apps.',
  },
  like: {
    label: '2. Like Pin',
    active: ['Browser / CLI', 'api Worker', 'D1 (fas)'],
    desc: '2) Signed-in user clicks Like → POST /v1/apps/pinboard/counters/likes:p1 → api Worker verifies HMAC token & runs atomic upsert in D1 counters table.',
  },
  chat: {
    label: '3. Live Chat',
    active: ['Browser / CLI', 'api Worker', 'Room DO'],
    desc: '3) Live chat → POST /rooms/lobby/ticket on api Worker → opens wss:// routed to single Room Durable Object → fans out in memory (never written to D1!).',
  },
  pub: {
    label: '4. fas publish',
    active: ['Browser / CLI', 'api Worker', 'admin Worker', 'D1 (fas)', 'GitHub'],
    desc: '4) Developer runs fas publish → CLI hits api Worker → service binding to admin Worker → creates repo in freeappstore-online + D1 routes/apps rows.',
  },
  push: {
    label: '5. git push',
    active: ['GitHub', 'R2 (fas-apps)'],
    desc: '5) git push main → GitHub Actions runs deploy.yml → pnpm build → wrangler r2 object put (×12) uploads web/dist to R2 fas-apps.',
  },
};

export function ArchTracerLab() {
  const [flow, setFlow] = useState<keyof typeof ARCH_FLOWS>('open');
  const current = ARCH_FLOWS[flow];

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          Figure M9.1 Architecture Tracer (Ex M9.1)
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Module 9</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(ARCH_FLOWS) as (keyof typeof ARCH_FLOWS)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFlow(k)}
            className={`min-h-9 cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              flow === k
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)]'
            }`}
          >
            {ARCH_FLOWS[k].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {ARCH_NODES.map((node) => {
          const isActive = current.active.includes(node);
          return (
            <div
              key={node}
              className={`rounded-lg border px-3 py-2.5 text-xs font-bold transition-transform duration-150 ${
                isActive
                  ? '-translate-y-0.5 border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-deep)]'
                  : 'border-[var(--line)] bg-[var(--paper)] text-[var(--muted)]'
              }`}
            >
              <div>{node}</div>
              <div className="mt-1 text-[10px] font-semibold">
                {isActive ? '● ACTIVE' : '○ IDLE'}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 mb-0 text-sm text-[var(--ink)]">{current.desc}</p>
    </div>
  );
}

interface SimPin {
  id: string;
  title: string;
  body: string;
  author: string;
  owner: string;
  likes: number;
}

export function PinboardSimLab({ onToast }: LabProps) {
  const [signedIn, setSignedIn] = useState(false);
  const [screen, setScreen] = useState<'board' | 'live' | 'settings' | 'account'>('board');
  const [displayName, setDisplayName] = useState('Ayman');
  const [compact, setCompact] = useState(false);
  const [pins, setPins] = useState<SimPin[]>([
    {
      id: 'p1',
      title: 'Study group Friday',
      body: 'Room 204, bring the React notes.',
      author: 'ayman',
      owner: 'gh:42',
      likes: 4,
    },
    {
      id: 'p2',
      title: 'Lost: blue umbrella',
      body: 'Left near library entrance.',
      author: 'mira',
      owner: 'gh:77',
      likes: 1,
    },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [chat, setChat] = useState([{ from: 'mira', text: 'Welcome to Pinboard Live!', mine: false }]);
  const [chatMsg, setChatMsg] = useState('');
  const [draftName, setDraftName] = useState('Ayman');
  const [draftCompact, setDraftCompact] = useState(false);

  const handleSignIn = () => {
    setSignedIn(true);
    onToast('Signed in via GitHub OAuth!', 'success');
  };

  const handleAddPin = (e: React.FormEvent) => {
    e.preventDefault();
    const t = newTitle.trim();
    if (!t) return;
    setPins((prev) => [
      {
        id: 'p' + Date.now(),
        title: t,
        body: newBody.trim(),
        author: displayName.toLowerCase(),
        owner: 'gh:42',
        likes: 0,
      },
      ...prev,
    ]);
    setNewTitle('');
    setNewBody('');
    onToast('Pinned!', 'success');
  };

  const handleLike = (id: string) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  const handleConfirmDelete = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
    onToast('Pin deleted', 'success');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const m = chatMsg.trim();
    if (!m) return;
    setChat((prev) => [...prev, { from: displayName.toLowerCase(), text: m, mine: true }]);
    setChatMsg('');
  };

  const handleSaveSettings = () => {
    setDisplayName(draftName.trim() || 'Ayman');
    setCompact(draftCompact);
    onToast('Settings saved (204 No Content)', 'success');
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--paper)] shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--paper-elevated)] px-4 py-2.5">
        <strong className="text-sm">Pinboard</strong>
        <div className="flex flex-wrap gap-1">
          {(['board', 'live', 'settings', 'account'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setScreen(tab)}
              className={`min-h-8 cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                screen === tab
                  ? 'bg-[var(--accent-soft)] text-[var(--accent-deep)]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSignedIn((s) => !s)}
          className="ml-auto min-h-8 cursor-pointer rounded-md border border-[var(--line-strong)] bg-[var(--paper)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]"
        >
          {signedIn ? `@${displayName.toLowerCase()}` : 'Sign in'}
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {screen === 'board' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="m-0 text-base font-bold">Board</h4>
              <span className="tabular-nums text-xs font-semibold text-[var(--muted)]">
                {pins.length} pins
              </span>
            </div>

            {signedIn ? (
              <form
                onSubmit={handleAddPin}
                className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-3.5"
              >
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  Title
                  <input
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Note title"
                    className="mt-1 min-h-[38px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)]"
                  />
                </label>
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  Note
                  <input
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="Details"
                    className="mt-1 min-h-[38px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)]"
                  />
                </label>
                <button
                  type="submit"
                  className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Pin it
                </button>
              </form>
            ) : (
              <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-3.5">
                <p className="mt-0 mb-2 text-sm text-[var(--muted)]">
                  Sign in to add pins and like them. Reading is open to everyone.
                </p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Sign in with GitHub
                </button>
              </div>
            )}

            {pins.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] ${
                  compact ? 'px-3.5 py-2.5' : 'p-4'
                }`}
              >
                <strong className="text-sm">{p.title}</strong>
                {p.body && <p className="my-1 text-sm text-[var(--muted)]">{p.body}</p>}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <small className="text-xs text-[var(--muted)]">by @{p.author}</small>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!signedIn}
                      onClick={() => handleLike(p.id)}
                      aria-label={`Like ${p.title}`}
                      className="tabular-nums min-h-8 cursor-pointer rounded-md border border-[var(--line-strong)] bg-[var(--paper)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ♥ {p.likes}
                    </button>
                    {signedIn && p.owner === 'gh:42' && (
                      confirmDeleteId === p.id ? (
                        <span className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(p.id)}
                            className="min-h-8 cursor-pointer rounded-md bg-[var(--danger)] px-2.5 py-1 text-xs font-bold text-white"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="min-h-8 cursor-pointer rounded-md border border-[var(--line-strong)] px-2 py-1 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(p.id)}
                          className="min-h-8 cursor-pointer rounded-md border border-[var(--line-strong)] px-2.5 py-1 text-xs font-semibold text-[var(--danger)]"
                        >
                          Delete
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {screen === 'live' && (
          <div className="space-y-3">
            {signedIn ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="m-0 text-base font-bold">Live</h4>
                  <span className="text-xs font-bold text-[var(--success)]">● OPEN</span>
                </div>
                <p className="m-0 text-xs text-[var(--muted)]">
                  Online: @{displayName.toLowerCase()}, @mira
                </p>
                <div className="space-y-1.5 rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-3.5 text-sm">
                  {chat.map((c, i) => (
                    <div key={i} className={c.mine ? 'text-right' : 'text-left'}>
                      <strong>@{c.from}</strong> {c.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    placeholder="Say hello..."
                    className="min-h-[38px] flex-1 rounded-lg border border-[var(--line-strong)] bg-[var(--paper-elevated)] px-3 text-sm text-[var(--ink)]"
                  />
                  <button
                    type="submit"
                    className="min-h-[38px] cursor-pointer rounded-lg bg-[var(--accent)] px-4 text-xs font-bold text-white"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-4">
                <p className="mt-0 mb-2 text-sm">Live chat needs an account.</p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Sign in with GitHub
                </button>
              </div>
            )}
          </div>
        )}

        {screen === 'settings' && (
          <div className="space-y-3">
            {signedIn ? (
              <div className="space-y-3 rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-4">
                <h4 className="m-0 text-base font-bold">
                  Settings (<code>fas.kv</code>)
                </h4>
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  Display name
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="mt-1 min-h-[38px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 text-sm text-[var(--ink)]"
                  />
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draftCompact}
                    onChange={(e) => setDraftCompact(e.target.checked)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  <span>Compact board layout</span>
                </label>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-4">
                <p className="mt-0 mb-2 text-sm">Sign in to edit KV preferences.</p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
                >
                  Sign in with GitHub
                </button>
              </div>
            )}
          </div>
        )}

        {screen === 'account' && (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-4">
            <h4 className="mt-0 mb-2 text-base font-bold">Account</h4>
            <p className="mt-0 mb-3 text-sm">
              {signedIn ? (
                <>
                  Signed in as <strong>@{displayName.toLowerCase()}</strong> (gh:42)
                </>
              ) : (
                'Not signed in.'
              )}
            </p>
            {signedIn ? (
              <button
                type="button"
                onClick={() => setSignedIn(false)}
                className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)]"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
              >
                Sign in with GitHub
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const BUG_CASES = {
  likes: {
    label: 'Worked Session',
    title: 'Worked Session: Likes don’t update on click',
    console: '(no errors logged)',
    network: 'POST /v1/apps/pinboard/counters/likes:p3 → 200 OK {"value":5}',
    diagnosis:
      'Server returned 5, so the bug is client-side state! Code wrote `{ ...prev, likes: value }` instead of computed key `{ ...prev, [`likes:${id}`]: value }`.',
  },
  db: {
    label: 'Ex 11.1 (3)',
    title: 'Ex 11.1 (3): White screen / crash on Board',
    console: "TypeError: Cannot read properties of undefined (reading 'collection') at Board.tsx:11:30",
    network: '(no requests sent)',
    diagnosis:
      'Docs-vs-Code mismatch: `fas.db` is undefined in SDK v0.14.35. Change to `fas.collections.collection("pins")`.',
  },
  prevent: {
    label: 'Ex 11.1 (2)',
    title: 'Ex 11.1 (2): Clicking "Pin it" reloads the whole page',
    console: '(console wiped on page reload!)',
    network: 'GET /? (full HTML page reload)',
    diagnosis: 'Missing `e.preventDefault()` inside `addPin` form `onSubmit` handler.',
  },
  ws: {
    label: 'Ex 11.1 (1)',
    title: 'Ex 11.1 (1): Duplicate peers / sockets after switching screens',
    console: '(no error)',
    network: 'WS tab shows 2+ open wss://.../rooms/lobby connections',
    diagnosis: 'Missing `return () => room.close()` in `useEffect` cleanup.',
  },
};

export function DebugDetectiveLab() {
  const [bugKey, setBugKey] = useState<keyof typeof BUG_CASES>('likes');
  const [revealed, setRevealed] = useState(false);

  const current = BUG_CASES[bugKey];

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          Debugging Detective: Locate the Layer
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 11</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(BUG_CASES) as (keyof typeof BUG_CASES)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setBugKey(k);
              setRevealed(false);
            }}
            className={`min-h-9 cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              bugKey === k
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)]'
            }`}
          >
            {BUG_CASES[k].label}
          </button>
        ))}
      </div>

      <pre className="font-mono-code mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {`Report : ${current.title}\nConsole: ${current.console}\nNetwork: ${current.network}`}
      </pre>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
        >
          Reveal Root Cause &amp; Fix
        </button>
      </div>

      {revealed && (
        <p className="mt-3 mb-0 rounded-lg border border-[var(--line)] bg-[var(--success-soft)] p-3 text-sm font-semibold text-[var(--ink)]">
          {current.diagnosis}
        </p>
      )}
    </div>
  );
}
