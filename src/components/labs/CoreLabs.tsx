import React, { useState } from 'react';
import type { ToastVariant } from '../../types/course';

interface LabProps {
  onToast: (msg: string, variant?: ToastVariant) => void;
  onToggleTheme?: () => void;
}

export function UrlDissectorLab() {
  const [urlInput, setUrlInput] = useState(
    'https://api.freeappstore.online/v1/apps/pinboard/kv?prefix=note:'
  );
  const [encInput, setEncInput] = useState('note/1 #a');

  const presets = [
    {
      label: 'OpenWeather URL',
      value: 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=abc123#top',
    },
    {
      label: 'FreeAppStore KV',
      value: 'https://api.freeappstore.online/v1/apps/pinboard/kv?prefix=note:',
    },
    {
      label: 'App + #fragment',
      value: 'https://pinboard.freeappstore.online/settings#fas_session=tok123',
    },
  ];

  let parsedText = '';
  try {
    const u = new URL(urlInput.trim());
    parsedText += `scheme   : ${u.protocol.replace(':', '')}\n`;
    parsedText += `host     : ${u.hostname}\n`;
    parsedText += `port     : ${u.port || `(default: ${u.protocol === 'https:' ? '443' : '80'})`}\n`;
    parsedText += `origin   : ${u.origin}\n`;
    parsedText += `pathname : ${u.pathname}\n`;
    parsedText += `search   : ${u.search || '(none)'}\n`;
    parsedText += `hash     : ${u.hash || '(none — never sent to server!)'}\n`;
  } catch {
    parsedText += 'Invalid URL (include https:// or http://)\n';
  }
  parsedText += `\nencodeURIComponent("${encInput}") → "${encodeURIComponent(encInput)}"`;

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          Interactive URL, Origin &amp; Encoder Lab (Ex 1.2)
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 1</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setUrlInput(p.value)}
            className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)]"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="url-in" className="mb-1 block text-xs font-semibold text-[var(--muted)]">
            URL to parse
          </label>
          <input
            id="url-in"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="min-h-[42px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)]"
          />
        </div>
        <div>
          <label htmlFor="enc-in" className="mb-1 block text-xs font-semibold text-[var(--muted)]">
            Key to encode (<code>encodeURIComponent</code>)
          </label>
          <input
            id="enc-in"
            value={encInput}
            onChange={(e) => setEncInput(e.target.value)}
            className="min-h-[42px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)]"
          />
        </div>
      </div>

      <pre className="font-mono-code mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {parsedText}
      </pre>
    </div>
  );
}

const HTTP_CASES: Record<string, { req: string; res: string }> = {
  '200': {
    req: 'GET /v1/apps/pinboard/db/posts?limit=20 HTTP/1.1\nHost: api.freeappstore.online',
    res: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"documents":[...],"total":3}',
  },
  '204': {
    req: 'PUT /v1/apps/pinboard/kv/note HTTP/1.1\nAuthorization: Bearer eyJ1aWQ...\n\n"Remember the milk"',
    res: 'HTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://pinboard.freeappstore.online',
  },
  '304': {
    req: 'GET /index.html HTTP/1.1\nIf-None-Match: "v12-etag"',
    res: 'HTTP/1.1 304 Not Modified\nCache-Control: public, max-age=60, must-revalidate',
  },
  '401': {
    req: 'GET /v1/apps/pinboard/kv/prefs HTTP/1.1\nAuthorization: Bearer expired',
    res: 'HTTP/1.1 401 Unauthorized\n→ SDK calls handleUnauthorized() and signs user out.',
  },
  '403': {
    req: 'DELETE /v1/apps/pinboard/db/posts/p9 HTTP/1.1\nAuthorization: Bearer userB',
    res: 'HTTP/1.1 403 Forbidden\n→ Only document owner may delete.',
  },
  '413': {
    req: 'PUT /v1/apps/pinboard/kv/big HTTP/1.1',
    res: 'HTTP/1.1 413 Payload Too Large\n→ Over 64 KB value, 1 MB user, or 100 keys.',
  },
  '429': {
    req: 'GET /v1/apps/pinboard/proxy/api.weather.com/...',
    res: 'HTTP/1.1 429 Too Many Requests\n→ Over 10,000 proxy calls/day.',
  },
  '502': {
    req: 'GET /v1/apps/pinboard/proxy/api.bigdata.org/dump',
    res: 'HTTP/1.1 502 Bad Gateway\n→ Upstream response exceeded 100 KB.',
  },
};

export function HttpExplorerLab() {
  const [selected, setSelected] = useState('204');
  const current = HTTP_CASES[selected];

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          HTTP Request &amp; Status Code Simulator
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 1 · Module 8</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.keys(HTTP_CASES).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setSelected(code)}
            className={`tabular-nums min-h-9 cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
              selected === code
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)]'
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      <pre className="font-mono-code mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {`>>> REQUEST\n${current.req}\n\n<<< RESPONSE\n${current.res}`}
      </pre>
    </div>
  );
}

export function ThemeTokenLab({ onToast, onToggleTheme }: LabProps) {
  const [accent, setAccent] = useState('#c85a32');

  const handleColor = (val: string) => {
    setAccent(val);
    document.documentElement.style.setProperty('--accent', val);
    document.documentElement.style.setProperty('--accent-deep', val);
  };

  const handleReset = () => {
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-deep');
    setAccent('#c85a32');
    onToast('Accent token reset to default', 'success');
  };

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          Live CSS Design Token Playground
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 2 · Module 4</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <span>Accent Color:</span>
          <input
            type="color"
            value={accent}
            onChange={(e) => handleColor(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded border border-[var(--line-strong)] bg-transparent p-0.5"
          />
        </label>
        <button
          type="button"
          onClick={handleReset}
          className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
        >
          Reset Default
        </button>
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
          >
            Toggle Page Light / Dark
          </button>
        )}
      </div>

      <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-subtle)] p-4">
        <strong className="block text-sm">Preview SDK Card</strong>
        <p className="my-1.5 text-sm text-[var(--muted)]">
          Every SDK component reads <code>var(--accent)</code>, <code>var(--ink)</code>, and{' '}
          <code>var(--paper-elevated)</code> from <code>index.css</code>.
        </p>
        <button
          type="button"
          onClick={() => onToast('Accent token applied to primary CTA!', 'success')}
          className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
        >
          Primary Action
        </button>
      </div>
    </div>
  );
}

const EVENT_LOOP_STEPS = [
  { line: "console.log('a')", stack: "['log(a)']", micro: '[]', macro: '[]', out: 'a' },
  {
    line: "Promise.resolve().then(() => console.log('b'))",
    stack: "['Promise.then']",
    micro: "['cb(b)']",
    macro: '[]',
    out: 'a',
  },
  {
    line: "setTimeout(() => console.log('c'), 0)",
    stack: "['setTimeout']",
    micro: "['cb(b)']",
    macro: "['timer(c)']",
    out: 'a',
  },
  { line: "console.log('d')", stack: "['log(d)']", micro: "['cb(b)']", macro: "['timer(c)']", out: 'a, d' },
  {
    line: 'Sync call stack empty → drain Microtasks!',
    stack: "['cb(b)']",
    micro: '[]',
    macro: "['timer(c)']",
    out: 'a, d, b',
  },
  {
    line: 'Microtasks empty → run next Macrotask!',
    stack: "['timer(c)']",
    micro: '[]',
    macro: '[]',
    out: 'a, d, b, c',
  },
];

export function EventLoopLab() {
  const [idx, setIdx] = useState(0);
  const s = EVENT_LOOP_STEPS[idx];

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          Event Loop Stepper (Exercise 2.2)
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 2</span>
      </div>

      <p className="mb-3 text-sm text-[var(--muted)]">
        Predict the console output of:{' '}
        <code>
          log(&apos;a&apos;); Promise.resolve().then(()=&gt;log(&apos;b&apos;));
          setTimeout(()=&gt;log(&apos;c&apos;)); log(&apos;d&apos;);
        </code>
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIdx((prev) => (prev + 1) % EVENT_LOOP_STEPS.length)}
          className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
        >
          Next Step
        </button>
        <button
          type="button"
          onClick={() => setIdx(0)}
          className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
        >
          Reset
        </button>
      </div>

      <pre className="font-mono-code overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {`Step ${idx + 1}/${EVENT_LOOP_STEPS.length}: ${s.line}\nCall Stack : ${s.stack}\nMicrotasks : ${s.micro}\nMacrotasks : ${s.macro}\nConsole    : ${s.out}`}
      </pre>
    </div>
  );
}

export function TsPlaygroundLab() {
  const [shape, setShape] = useState<'type' | 'interface'>('type');
  const [provider, setProvider] = useState<'github' | 'google' | 'gihub'>('github');
  const [dbCall, setDbCall] = useState<'collections' | 'db'>('collections');

  const errs: string[] = [];
  if (shape === 'interface') {
    errs.push("TS2344: Type 'Pin' does not satisfy the constraint 'Record<string, unknown>'. Use `type Pin = { ... }`.");
  }
  if (provider === 'gihub') {
    errs.push("TS2345: Argument of type '\"gihub\"' is not assignable to parameter of type \"'github' | 'google' | 'apple'\".");
  }
  if (dbCall === 'db') {
    errs.push("TS2339: Property 'db' does not exist on type 'FreeAppStore'. Did you mean 'collections'?");
  }

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          TypeScript Compiler Checker Simulator (Ex 3.2)
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 3</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-xs font-semibold text-[var(--muted)]">
          Pin shape
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value as 'type' | 'interface')}
            className="mt-1 min-h-[40px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-2.5 text-sm text-[var(--ink)]"
          >
            <option value="type">type Pin = &#123; title: string &#125;</option>
            <option value="interface">interface Pin &#123; title: string &#125;</option>
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          Provider
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'github' | 'google' | 'gihub')}
            className="mt-1 min-h-[40px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-2.5 text-sm text-[var(--ink)]"
          >
            <option value="github">&apos;github&apos;</option>
            <option value="google">&apos;google&apos;</option>
            <option value="gihub">&apos;gihub&apos; (typo!)</option>
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--muted)]">
          DB call
          <select
            value={dbCall}
            onChange={(e) => setDbCall(e.target.value as 'collections' | 'db')}
            className="mt-1 min-h-[40px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-2.5 text-sm text-[var(--ink)]"
          >
            <option value="collections">fas.collections.collection(&apos;pins&apos;)</option>
            <option value="db">fas.db.collection(&apos;pins&apos;)</option>
          </select>
        </label>
      </div>

      <pre className="font-mono-code mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {errs.length > 0
          ? `✗ tsc -b failed:\n\n${errs.join('\n')}`
          : '✓ tsc -b: 0 errors! Ready for vite build.'}
      </pre>
    </div>
  );
}

export function ReactLifecycleLab() {
  const [strict, setStrict] = useState(true);
  const [hasCleanup, setHasCleanup] = useState(true);
  const [mounts, setMounts] = useState(0);
  const [activeSockets, setActiveSockets] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleMount = () => {
    const nextMount = mounts + 1;
    let sockets = activeSockets + 1;
    const nextLogs = [...logs, `[Mount #${nextMount}] setup → room.join('lobby') (open: ${sockets})`];

    if (strict) {
      if (hasCleanup) {
        sockets = Math.max(0, sockets - 1);
        nextLogs.push(`[StrictMode] cleanup → room.close() (open: ${sockets})`);
      } else {
        nextLogs.push(`[StrictMode] no cleanup! socket leaked (open: ${sockets})`);
      }
      sockets += 1;
      nextLogs.push(`[StrictMode remount] setup → room.join('lobby') (open: ${sockets})`);
    }

    setMounts(nextMount);
    setActiveSockets(sockets);
    setLogs(nextLogs.slice(-8));
  };

  const handleUnmount = () => {
    if (hasCleanup && activeSockets > 0) {
      const next = Math.max(0, activeSockets - 1);
      setActiveSockets(next);
      setLogs((prev) => [...prev, `[Unmount] cleanup → room.close() (open: ${next})`].slice(-8));
    } else {
      setLogs((prev) =>
        [...prev, `[Unmount] skipped cleanup — socket stays open (${activeSockets})`].slice(-8)
      );
    }
  };

  return (
    <div className="my-6 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3">
        <h3 className="font-display m-0 text-lg font-semibold">
          StrictMode &amp; Effect Cleanup Simulator (Ex 4.1)
        </h3>
        <span className="text-xs font-semibold text-[var(--muted)]">Chapter 4</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={strict}
            onChange={(e) => setStrict(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <span>&lt;StrictMode&gt; (dev double-mount)</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={hasCleanup}
            onChange={(e) => setHasCleanup(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <span>
            Return cleanup (<code>room.close()</code>)
          </span>
        </label>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleMount}
          className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
        >
          Mount &lt;Live /&gt;
        </button>
        <button
          type="button"
          onClick={handleUnmount}
          className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
        >
          Unmount / Leave
        </button>
        <button
          type="button"
          onClick={() => {
            setMounts(0);
            setActiveSockets(0);
            setLogs([]);
          }}
          className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
        >
          Reset
        </button>
      </div>

      <pre className="font-mono-code tabular-nums overflow-x-auto whitespace-pre-wrap rounded-lg bg-[var(--code-bg)] p-3.5 text-xs leading-relaxed text-[var(--code-ink)]">
        {`Active WebSockets: ${activeSockets} ${activeSockets > 1 ? '▲ LEAK DETECTED' : '● NOMINAL'}\n\n${
          logs.length > 0 ? logs.join('\n') : 'Click "Mount <Live />" to trace effect setup & cleanup.'
        }`}
      </pre>
    </div>
  );
}
