import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { APPENDICES_DATA } from '../data/appendices';
import type { LessonData, RouteId } from '../types/course';

interface SearchModalProps {
  open: boolean;
  lessons: Record<string, LessonData>;
  onClose: () => void;
  onSelect: (route: RouteId) => void;
}

interface SearchHit {
  route: RouteId;
  title: string;
  sub: string;
  text: string;
}

export function SearchModal({ open, lessons, onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo<SearchHit[]>(() => {
    const items: SearchHit[] = [];
    Object.entries(lessons).forEach(([id, l]) => {
      items.push({
        route: id as RouteId,
        title: l.title,
        sub: l.eyebrow,
        text: (l.subtitle + ' ' + JSON.stringify(l.blocks)).toLowerCase(),
      });
    });
    APPENDICES_DATA.docsVsCode.forEach((d) => {
      items.push({
        route: 'appA',
        title: `Docs vs Code #${d.id}: ${d.fix}`,
        sub: d.page,
        text: JSON.stringify(d).toLowerCase(),
      });
    });
    APPENDICES_DATA.glossary.forEach(([term, def]) => {
      items.push({
        route: 'appE',
        title: `Glossary: ${term}`,
        sub: def,
        text: (term + ' ' + def).toLowerCase(),
      });
    });
    return items;
  }, [lessons]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  if (!open) return null;

  const term = query.toLowerCase().trim();
  const hits = (
    term
      ? index.filter((i) => i.title.toLowerCase().includes(term) || i.text.includes(term))
      : index.slice(0, 10)
  ).slice(0, 14);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-16 backdrop-blur-xs"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] shadow-xl">
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-3.5 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-[var(--muted)]" aria-hidden="true" />
          <h2 id="search-modal-title" className="sr-only">
            Search Course
          </h2>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. fas.collections, 413, PKCE, StrictMode, deploy.yml…"
            aria-label="Search topics, SDK methods, CLI commands, status codes, or glossary terms"
            className="min-h-[40px] flex-1 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[60dvh] overflow-y-auto p-2">
          {hits.length > 0 ? (
            hits.map((h, i) => (
              <button
                key={`${h.route}-${i}`}
                type="button"
                onClick={() => {
                  onSelect(h.route);
                  onClose();
                }}
                className="block w-full cursor-pointer rounded-lg px-3.5 py-2.5 text-left transition-colors hover:bg-[var(--accent-soft)]"
              >
                <strong className="block text-sm text-[var(--ink)]">{h.title}</strong>
                <div className="truncate text-xs text-[var(--muted)]">{h.sub}</div>
              </button>
            ))
          ) : (
            <p className="p-4 text-sm text-[var(--muted)]">No matching topics found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
