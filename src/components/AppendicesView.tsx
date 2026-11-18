import { useState } from 'react';
import { APPENDICES_DATA } from '../data/appendices';
import type { NavItem, RouteId } from '../types/course';

interface AppendicesViewProps {
  routeId: RouteId;
  prevItem: NavItem | null;
  nextItem: NavItem | null;
  onNavigate: (id: RouteId) => void;
}

export function AppendicesView({
  routeId,
  prevItem,
  nextItem,
  onNavigate,
}: AppendicesViewProps) {
  const [appAFilter, setAppAFilter] = useState('');
  const [glossaryFilter, setGlossaryFilter] = useState('');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const renderBody = () => {
    if (routeId === 'appA') {
      const q = appAFilter.toLowerCase().trim();
      const rows = APPENDICES_DATA.docsVsCode.filter(
        (r) => !q || JSON.stringify(r).toLowerCase().includes(q)
      );
      return (
        <>
          <header className="border-b border-[var(--line)] pb-5">
            <div className="mb-1.5 text-xs font-bold text-[var(--accent-deep)]">Appendix A</div>
            <h1 className="font-display m-0 text-3xl font-bold sm:text-4xl">
              Docs vs. Code (16 Real Discrepancies)
            </h1>
            <p className="mt-2.5 mb-0 text-base text-[var(--muted)]">
              When documentation and shipped SDK v0.14.35 / CLI v0.4.31 disagree, the type
              declarations and running code win.
            </p>
          </header>

          <input
            value={appAFilter}
            onChange={(e) => setAppAFilter(e.target.value)}
            placeholder="Filter by page, symbol, or fix (e.g. fas.db, VoiceButton, webhook)…"
            aria-label="Filter Docs vs Code discrepancies"
            className="min-h-[44px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper-elevated)] px-3.5 text-sm text-[var(--ink)]"
          />

          <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
            <table className="w-full border-collapse bg-[var(--paper-elevated)] text-left text-sm">
              <thead>
                <tr className="bg-[var(--surface-subtle)]">
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">#</th>
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">Page</th>
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                    Docs Say
                  </th>
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                    Actually True
                  </th>
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                    What to Do
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="tabular-nums px-3.5 py-2.5 font-bold">{r.id}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">{r.page}</td>
                    <td className="px-3.5 py-2.5">{r.docs}</td>
                    <td className="px-3.5 py-2.5">{r.truth}</td>
                    <td className="px-3.5 py-2.5">
                      <code>{r.fix}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (routeId === 'appB') {
      return (
        <>
          <header className="border-b border-[var(--line)] pb-5">
            <div className="mb-1.5 text-xs font-bold text-[var(--accent-deep)]">Appendix B</div>
            <h1 className="font-display m-0 text-3xl font-bold sm:text-4xl">Coverage Map</h1>
            <p className="mt-2.5 mb-0 text-base text-[var(--muted)]">
              Click any chapter or module button to jump straight to where that docs section is
              taught.
            </p>
          </header>

          <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
            <table className="w-full border-collapse bg-[var(--paper-elevated)] text-left text-sm">
              <thead>
                <tr className="bg-[var(--surface-subtle)]">
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                    Docs Page
                  </th>
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                    Sections
                  </th>
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                    Taught In
                  </th>
                </tr>
              </thead>
              <tbody>
                {APPENDICES_DATA.coverageMap.map((c) => (
                  <tr key={c.page} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="px-3.5 py-2.5 font-bold whitespace-nowrap">{c.page}</td>
                    <td className="px-3.5 py-2.5">{c.section}</td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {c.routes.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => onNavigate(r)}
                            className="cursor-pointer rounded-md border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-bold text-[var(--accent-deep)] uppercase hover:bg-[var(--accent)] hover:text-white"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (routeId === 'appC') {
      return (
        <>
          <header className="border-b border-[var(--line)] pb-5">
            <div className="mb-1.5 text-xs font-bold text-[var(--accent-deep)]">Appendix C</div>
            <h1 className="font-display m-0 text-3xl font-bold sm:text-4xl">Cheat Sheets</h1>
            <p className="mt-2.5 mb-0 text-base text-[var(--muted)]">
              Daily CLI commands and HTTP status codes at a glance.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-display m-0 text-2xl font-semibold">CLI Commands</h2>
            <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
              <table className="w-full border-collapse bg-[var(--paper-elevated)] text-left text-sm">
                <thead>
                  <tr className="bg-[var(--surface-subtle)]">
                    <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">Task</th>
                    <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                      Command
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {APPENDICES_DATA.commands.map(([task, cmd]) => (
                    <tr key={task} className="border-b border-[var(--line)] last:border-b-0">
                      <td className="px-3.5 py-2.5 font-medium whitespace-nowrap">{task}</td>
                      <td className="px-3.5 py-2.5">
                        <code>{cmd}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display m-0 text-2xl font-semibold">Status Codes</h2>
            <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
              <table className="w-full border-collapse bg-[var(--paper-elevated)] text-left text-sm">
                <thead>
                  <tr className="bg-[var(--surface-subtle)]">
                    <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">Code</th>
                    <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">Name</th>
                    <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {APPENDICES_DATA.statusCodes.map(([code, name, meaning]) => (
                    <tr key={code} className="border-b border-[var(--line)] last:border-b-0">
                      <td className="tabular-nums px-3.5 py-2.5 font-bold">{code}</td>
                      <td className="px-3.5 py-2.5 font-medium whitespace-nowrap">{name}</td>
                      <td className="px-3.5 py-2.5">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      );
    }

    if (routeId === 'appD') {
      return (
        <>
          <header className="border-b border-[var(--line)] pb-5">
            <div className="mb-1.5 text-xs font-bold text-[var(--accent-deep)]">Appendix D</div>
            <h1 className="font-display m-0 text-3xl font-bold sm:text-4xl">
              SDK Quick Reference (v0.14.35)
            </h1>
            <p className="mt-2.5 mb-0 text-base text-[var(--muted)]">
              Verified signatures from <code>@freeappstore/sdk</code> type declarations.
            </p>
          </header>

          <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
            <table className="w-full border-collapse bg-[var(--paper-elevated)] text-left text-sm">
              <thead>
                <tr className="bg-[var(--surface-subtle)]">
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                    Module
                  </th>
                  <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                    Members
                  </th>
                </tr>
              </thead>
              <tbody>
                {APPENDICES_DATA.sdkQuickRef.map(([mod, members]) => (
                  <tr key={mod} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <code>{mod}</code>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <code>{members}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    // Appendix E: Glossary & Flashcards
    const [term, def] = APPENDICES_DATA.glossary[cardIdx];
    const gq = glossaryFilter.toLowerCase().trim();
    const filteredGlossary = APPENDICES_DATA.glossary.filter(
      ([t, d]) => !gq || t.toLowerCase().includes(gq) || d.toLowerCase().includes(gq)
    );

    return (
      <>
        <header className="border-b border-[var(--line)] pb-5">
          <div className="mb-1.5 text-xs font-bold text-[var(--accent-deep)]">Appendix E</div>
          <h1 className="font-display m-0 text-3xl font-bold sm:text-4xl">
            Glossary &amp; Flashcards
          </h1>
          <p className="mt-2.5 mb-0 text-base text-[var(--muted)]">
            Study key terms interactively or filter the complete glossary below.
          </p>
        </header>

        <section className="rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] p-5">
          <div
            role="button"
            tabIndex={0}
            aria-label="Flip flashcard"
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped((f) => !f);
              }
            }}
            className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-xl border border-[var(--line-strong)] bg-[var(--paper)] px-6 py-8 text-center transition-colors hover:border-[var(--accent)]"
          >
            <div className="tabular-nums text-xs font-bold text-[var(--accent-deep)]">
              {flipped ? 'Definition' : 'Term'} · {cardIdx + 1} / {APPENDICES_DATA.glossary.length}
            </div>
            {flipped ? (
              <p className="mt-3 mb-0 max-w-lg text-lg text-[var(--ink)]">{def}</p>
            ) : (
              <>
                <div className="font-display mt-2 text-2xl font-bold sm:text-3xl">{term}</div>
                <small className="mt-2 text-xs text-[var(--muted)]">
                  Click or press Flip to reveal definition
                </small>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCardIdx(
                  (prev) =>
                    (prev - 1 + APPENDICES_DATA.glossary.length) % APPENDICES_DATA.glossary.length
                );
                setFlipped(false);
              }}
              className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-bold text-[var(--ink)]"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className="min-h-9 cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white"
            >
              Flip Card
            </button>
            <button
              type="button"
              onClick={() => {
                setCardIdx((prev) => (prev + 1) % APPENDICES_DATA.glossary.length);
                setFlipped(false);
              }}
              className="min-h-9 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-bold text-[var(--ink)]"
            >
              Next →
            </button>
          </div>
        </section>

        <input
          value={glossaryFilter}
          onChange={(e) => setGlossaryFilter(e.target.value)}
          placeholder="Search glossary terms…"
          aria-label="Search glossary terms"
          className="min-h-[44px] w-full rounded-lg border border-[var(--line-strong)] bg-[var(--paper-elevated)] px-3.5 text-sm text-[var(--ink)]"
        />

        <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
          <table className="w-full border-collapse bg-[var(--paper-elevated)] text-left text-sm">
            <thead>
              <tr className="bg-[var(--surface-subtle)]">
                <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">Term</th>
                <th className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold">
                  Definition
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGlossary.map(([t, d]) => (
                <tr key={t} className="border-b border-[var(--line)] last:border-b-0">
                  <td className="px-3.5 py-2.5 font-bold whitespace-nowrap">{t}</td>
                  <td className="px-3.5 py-2.5">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {renderBody()}
      <nav
        aria-label="Appendix pagination"
        className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5"
      >
        {prevItem ? (
          <button
            type="button"
            onClick={() => onNavigate(prevItem.id)}
            className="min-h-[44px] cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper-elevated)] px-4 py-2 text-sm font-bold text-[var(--ink)] hover:border-[var(--accent)]"
          >
            ← {prevItem.label}
          </button>
        ) : (
          <span />
        )}
        {nextItem ? (
          <button
            type="button"
            onClick={() => onNavigate(nextItem.id)}
            className="min-h-[44px] cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            {nextItem.label} →
          </button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
