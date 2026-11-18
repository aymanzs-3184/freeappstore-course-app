import { COURSE_META } from '../data/courseMeta';
import type { RouteId } from '../types/course';

interface HomeViewProps {
  completed: Record<string, boolean>;
  onNavigate: (id: RouteId) => void;
}

export function HomeView({ completed, onNavigate }: HomeViewProps) {
  const trackable = COURSE_META.navGroups
    .flatMap((g) => g.items)
    .filter((i) => i.id !== 'home' && !i.id.startsWith('app'));
  const doneCount = trackable.filter((i) => completed[i.id]).length;

  const cards: { part: string; title: string; desc: string; target: RouteId }[] = [
    {
      part: 'Part I',
      title: '9 Foundations Chapters',
      desc: 'Web, Browser, TypeScript, React, Toolbox, PWA, Cloud, Security, Accessibility.',
      target: 'ch1',
    },
    {
      part: 'Part II',
      title: '10 Docs Modules',
      desc: 'Every page of docs.freeappstore.online, line-by-line + 16 Docs-vs-Code fixes.',
      target: 'm1',
    },
    {
      part: 'Part III',
      title: 'Pinboard Capstone & Debug',
      desc: 'Interactive Pinboard simulator, Debugging Detective, and next steps.',
      target: 'ch10',
    },
    {
      part: 'Appendices',
      title: 'A–E Reference & Flashcards',
      desc: 'Docs vs. Code table, Coverage Map, Cheat Sheets, SDK Ref, Glossary.',
      target: 'appA',
    },
  ];

  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--line)] pb-6">
        <div className="mb-2 text-xs font-bold text-[var(--accent-deep)]">
          Before You Begin · Edition 1 · October 2026
        </div>
        <h1 className="font-display m-0 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
          {COURSE_META.title}
        </h1>
        <p className="mt-3 mb-0 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
          {COURSE_META.subtitle}
        </p>
      </header>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-5">
        <div>
          <div className="tabular-nums text-base font-bold text-[var(--ink)]">
            Your Progress: {doneCount} of {trackable.length} lessons completed
          </div>
          <p className="mt-1 mb-0 text-sm text-[var(--muted)]">
            Covers <code>@freeappstore/sdk</code> v0.14.35, <code>@freeappstore/cli</code> v0.4.31,
            templates, and Cloudflare Workers backend.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('ch1')}
          className="min-h-[44px] shrink-0 cursor-pointer whitespace-nowrap rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          {doneCount > 0 ? 'Continue Learning →' : 'Start Chapter 1 →'}
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <button
            key={c.target}
            type="button"
            onClick={() => onNavigate(c.target)}
            className="flex cursor-pointer flex-col items-start rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-5 text-left transition-transform duration-150 hover:-translate-y-0.5 hover:border-[var(--accent)]"
          >
            <span className="text-xs font-extrabold text-[var(--accent-deep)]">{c.part}</span>
            <h2 className="font-display mt-1 mb-1.5 text-xl font-semibold text-[var(--ink)]">
              {c.title}
            </h2>
            <p className="m-0 text-sm text-[var(--muted)]">{c.desc}</p>
          </button>
        ))}
      </section>

      <section>
        <h2 className="font-display mt-0 mb-3 text-2xl font-semibold">
          Suggested 8+ Week Pace
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
          <table className="w-full border-collapse bg-[var(--paper-elevated)] text-left text-sm">
            <thead>
              <tr className="bg-[var(--surface-subtle)]">
                <th className="border-b border-[var(--line)] px-4 py-3 font-bold">Weeks</th>
                <th className="border-b border-[var(--line)] px-4 py-3 font-bold">Read</th>
                <th className="border-b border-[var(--line)] px-4 py-3 font-bold">Do</th>
              </tr>
            </thead>
            <tbody>
              {COURSE_META.pacing.map((p) => (
                <tr key={p.weeks} className="border-b border-[var(--line)] last:border-b-0">
                  <td className="tabular-nums px-4 py-3 font-bold whitespace-nowrap">
                    {p.weeks}
                  </td>
                  <td className="px-4 py-3">{p.read}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{p.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
