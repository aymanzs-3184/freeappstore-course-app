import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { COURSE_META } from './data/courseMeta';
import { PART1_LESSONS } from './data/part1Foundations';
import { PART2_LESSONS } from './data/part2Modules';
import { PART3_LESSONS } from './data/part3BuildShip';
import { HomeView } from './components/HomeView';
import { LessonView } from './components/LessonView';
import { AppendicesView } from './components/AppendicesView';
import { SearchModal } from './components/SearchModal';
import type { LessonData, RouteId, ToastVariant } from './types/course';

const PROGRESS_KEY = 'fas-course-progress';
const ALL_LESSONS: Record<string, LessonData> = {
  ...PART1_LESSONS,
  ...PART2_LESSONS,
  ...PART3_LESSONS,
};

interface ToastItem {
  id: number;
  msg: string;
  variant: ToastVariant;
}

export default function App() {
  const allItems = useMemo(
    () => COURSE_META.navGroups.flatMap((g) => g.items),
    []
  );
  const trackableItems = useMemo(
    () => allItems.filter((i) => i.id !== 'home' && !i.id.startsWith('app')),
    [allItems]
  );

  const parseHash = useCallback((): RouteId => {
    const raw = window.location.hash.replace(/^#\/?/, '') || 'home';
    const match = allItems.find((i) => i.id === raw);
    return match ? match.id : 'home';
  }, [allItems]);

  const [routeId, setRouteId] = useState<RouteId>(parseHash);
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const mainRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);

  const toast = useCallback((msg: string, variant: ToastVariant = 'default') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const navigate = useCallback((id: RouteId) => {
    const targetHash = `#/${id}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setRouteId(id);
    }
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRouteId(parseHash());
      setMenuOpen(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [parseHash]);

  useEffect(() => {
    const lesson = ALL_LESSONS[routeId];
    let title = 'Web Development, Page by Page';
    if (routeId === 'home') {
      title = 'Course Overview & Pacing — Web Development, Page by Page';
    } else if (routeId.startsWith('app')) {
      const navMatch = allItems.find((i) => i.id === routeId);
      if (navMatch) title = `${navMatch.label} — Web Development, Page by Page`;
    } else if (lesson) {
      title = `${lesson.title} — Web Development, Page by Page`;
    }
    document.title = title;
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [routeId, allItems]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
    } catch {
      // Ignore storage quota / private mode errors
    }
  }, [completed]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('fas-course-theme', next);
      } catch {
        // Ignore storage errors
      }
      toast(`Theme: ${next}`, 'success');
      return next;
    });
  }, [toast]);

  const cycleTextSize = useCallback(() => {
    const sizes = ['default', 'lg', 'sm'] as const;
    const cur = (document.documentElement.dataset.text || 'default') as (typeof sizes)[number];
    const next = sizes[(sizes.indexOf(cur) + 1) % sizes.length];
    if (next === 'default') delete document.documentElement.dataset.text;
    else document.documentElement.dataset.text = next;
    try {
      localStorage.setItem('fas-course-text-size', next);
    } catch {
      // Ignore storage errors
    }
    toast(`Text size: ${next}`);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        else if (menuOpen) {
          setMenuOpen(false);
          menuToggleRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => menuCloseRef.current?.focus(), 10);
    }
  }, [menuOpen]);

  const handleToggleComplete = useCallback(
    (id: RouteId) => {
      setCompleted((prev) => {
        const nextVal = !prev[id];
        toast(nextVal ? 'Marked complete!' : 'Marked incomplete', 'success');
        return { ...prev, [id]: nextVal };
      });
    },
    [toast]
  );

  const handleMarkComplete = useCallback((id: RouteId) => {
    setCompleted((prev) => ({ ...prev, [id]: true }));
  }, []);

  const doneCount = trackableItems.filter((i) => completed[i.id]).length;
  const progressPct = Math.round((doneCount / trackableItems.length) * 100);

  const currentIdx = allItems.findIndex((i) => i.id === routeId);
  const prevItem = currentIdx > 0 ? allItems[currentIdx - 1] : null;
  const nextItem = currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <a
        href="#main"
        className="fixed -top-16 left-4 z-50 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white transition-[top] focus:top-3"
      >
        Skip to content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--paper-elevated)]/90 px-4 py-2.5 backdrop-blur-md sm:px-6"
      >
        <div className="flex items-center gap-2.5">
          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open course navigation"
            aria-expanded={menuOpen}
            aria-controls="course-sidebar"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <a
            href="#/home"
            onClick={(e) => {
              e.preventDefault();
              navigate('home');
            }}
            className="font-display flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap text-lg font-bold tracking-tight text-[var(--ink)] no-underline"
          >
            <BookOpen className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
            <span>
              Web Dev, <em className="italic text-[var(--accent)]">Page by Page</em>
            </span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search course (Ctrl+K)"
          className="flex min-h-11 max-w-md flex-1 cursor-pointer items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 text-sm text-[var(--muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden truncate sm:inline">Search chapters, SDK, errors…</span>
          </span>
          <kbd className="font-mono-code hidden rounded border border-[var(--line)] bg-[var(--paper-elevated)] px-1.5 py-0.5 text-[11px] sm:inline">
            Ctrl K
          </kbd>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <div
            title="Overall course completion"
            className="tabular-nums hidden items-center gap-2.5 px-2 text-xs font-bold text-[var(--ink)] sm:flex"
          >
            <span>
              {doneCount} / {trackableItems.length}
            </span>
            <span
              aria-hidden="true"
              className="block h-1.5 w-14 overflow-hidden rounded-full bg-[var(--line)]"
            >
              <span
                className="block h-full bg-[var(--accent)] transition-[width] duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </span>
          </div>

          <button
            type="button"
            onClick={cycleTextSize}
            aria-label="Cycle text size"
            title="Text size (default / large / small)"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--paper)] text-sm font-bold text-[var(--ink)] hover:border-[var(--accent)]"
          >
            A
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light or dark theme"
            title="Toggle theme"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--accent)]"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 lg:grid-cols-[290px_minmax(0,1fr)]">
        {menuOpen && (
          <div
            onClick={() => {
              setMenuOpen(false);
              menuToggleRef.current?.focus();
            }}
            className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          />
        )}

        <aside
          id="course-sidebar"
          aria-label="Course contents"
          className={`fixed inset-y-0 left-0 z-50 w-[min(320px,86vw)] overflow-y-auto border-r border-[var(--line)] bg-[var(--paper-elevated)] px-3.5 py-4 transition-transform duration-200 lg:sticky lg:top-[65px] lg:z-10 lg:block lg:h-[calc(100dvh-65px)] lg:w-auto lg:translate-x-0 lg:bg-transparent ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-3 flex items-center justify-between border-b border-[var(--line)] pb-3 lg:hidden">
            <strong className="font-display text-base">Course Map</strong>
            <button
              ref={menuCloseRef}
              type="button"
              onClick={() => {
                setMenuOpen(false);
                menuToggleRef.current?.focus();
              }}
              aria-label="Close navigation"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Main" className="space-y-5 pb-8">
            {COURSE_META.navGroups.map((group) => (
              <div key={group.title}>
                <div className="px-2.5 py-1.5 text-xs font-extrabold tracking-wide text-[var(--muted)]">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = item.id === routeId;
                    return (
                      <a
                        key={item.id}
                        href={`#/${item.id}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.id);
                        }}
                        className={`flex min-h-[42px] items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-sm no-underline transition-colors ${
                          active
                            ? 'bg-[var(--accent-soft)] font-bold text-[var(--accent-deep)]'
                            : 'font-medium text-[var(--ink)] hover:bg-[var(--surface-subtle)]'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {completed[item.id] && (
                          <span
                            aria-label="Completed"
                            className="shrink-0 text-xs font-extrabold text-[var(--success)]"
                          >
                            ✓
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main
          id="main"
          ref={mainRef}
          tabIndex={-1}
          className="min-w-0 px-4 py-7 outline-none sm:px-8 sm:py-10"
        >
          <div className="mx-auto max-w-[880px]">
            {routeId === 'home' ? (
              <HomeView completed={completed} onNavigate={navigate} />
            ) : routeId.startsWith('app') ? (
              <AppendicesView
                routeId={routeId}
                prevItem={prevItem}
                nextItem={nextItem}
                onNavigate={navigate}
              />
            ) : (
              <LessonView
                routeId={routeId}
                lesson={ALL_LESSONS[routeId]}
                isDone={!!completed[routeId]}
                prevItem={prevItem}
                nextItem={nextItem}
                onToggleComplete={handleToggleComplete}
                onMarkComplete={handleMarkComplete}
                onNavigate={navigate}
                onToast={toast}
                onToggleTheme={toggleTheme}
              />
            )}
          </div>
        </main>
      </div>

      <footer
        role="contentinfo"
        className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-6 py-4 text-xs text-[var(--muted)]"
      >
        <span>
          Web Development, Page by Page · Edition 1 (Oct 2026) · Covers SDK v0.14.35 &amp; CLI
          v0.4.31
        </span>
        <span>
          Built from{' '}
          <a
            href="https://docs.freeappstore.online"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent-deep)] underline"
          >
            docs.freeappstore.online
          </a>
        </span>
      </footer>

      <SearchModal
        open={searchOpen}
        lessons={ALL_LESSONS}
        onClose={() => setSearchOpen(false)}
        onSelect={navigate}
      />

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg ${
              t.variant === 'success'
                ? 'bg-[var(--success)]'
                : t.variant === 'error'
                  ? 'bg-[var(--danger)]'
                  : 'bg-[var(--code-bg)]'
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
