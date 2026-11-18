import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Code2,
  Copy,
  Info,
  Lightbulb,
  PencilLine,
  RefreshCw,
  Settings,
} from 'lucide-react';
import type {
  CalloutKind,
  LessonData,
  NavItem,
  RouteId,
  ToastVariant,
} from '../types/course';
import { LabSlot } from './labs/LabRegistry';

interface LessonViewProps {
  routeId: RouteId;
  lesson: LessonData;
  isDone: boolean;
  prevItem: NavItem | null;
  nextItem: NavItem | null;
  onToggleComplete: (id: RouteId) => void;
  onMarkComplete: (id: RouteId) => void;
  onNavigate: (id: RouteId) => void;
  onToast: (msg: string, variant?: ToastVariant) => void;
  onToggleTheme: () => void;
}

const CALLOUT_STYLES: Record<
  CalloutKind,
  { container: string; labelColor: string; Icon: typeof Info }
> = {
  note: {
    container: 'border-[var(--info)]/30 bg-[var(--info-soft)]',
    labelColor: 'text-[var(--info)]',
    Icon: Info,
  },
  tip: {
    container: 'border-[var(--success)]/30 bg-[var(--success-soft)]',
    labelColor: 'text-[var(--success)]',
    Icon: Check,
  },
  warning: {
    container: 'border-[var(--warning)]/35 bg-[var(--warning-soft)]',
    labelColor: 'text-[var(--warning)]',
    Icon: AlertTriangle,
  },
  hood: {
    container: 'border-[var(--hood)]/30 bg-[var(--hood-soft)]',
    labelColor: 'text-[var(--hood)]',
    Icon: Settings,
  },
  mismatch: {
    container: 'border-[var(--danger)]/30 bg-[var(--danger-soft)]',
    labelColor: 'text-[var(--danger)]',
    Icon: RefreshCw,
  },
  analogy: {
    container: 'border-[var(--line-strong)] bg-[var(--paper-elevated)]',
    labelColor: 'text-[var(--accent-deep)]',
    Icon: Lightbulb,
  },
  exercise: {
    container: 'border-dashed border-[var(--accent)]/60 bg-[var(--paper-elevated)]',
    labelColor: 'text-[var(--accent-deep)]',
    Icon: PencilLine,
  },
};

export function LessonView({
  routeId,
  lesson,
  isDone,
  prevItem,
  nextItem,
  onToggleComplete,
  onMarkComplete,
  onNavigate,
  onToast,
  onToggleTheme,
}: LessonViewProps) {
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setPickedIdx(null);
  }, [routeId]);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedKey(key);
    onToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedKey((cur) => (cur === key ? null : cur)), 1500);
  };

  const handleQuizClick = (idx: number) => {
    if (!lesson.quiz) return;
    setPickedIdx(idx);
    if (idx === lesson.quiz.answer && !isDone) {
      onMarkComplete(routeId);
    }
  };

  return (
    <article className="space-y-6">
      <header className="border-b border-[var(--line)] pb-5">
        <div className="mb-1.5 text-xs font-bold text-[var(--accent-deep)]">
          {lesson.eyebrow}
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display m-0 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <button
            type="button"
            onClick={() => onToggleComplete(routeId)}
            className={`min-h-[44px] shrink-0 cursor-pointer whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-bold transition-colors ${
              isDone
                ? 'border-[var(--success)] bg-[var(--success)] text-white'
                : 'border-[var(--line-strong)] bg-[var(--paper-elevated)] text-[var(--ink)] hover:border-[var(--accent)]'
            }`}
          >
            {isDone ? '✓ Completed' : 'Mark Complete'}
          </button>
        </div>
        <p className="mt-3 mb-0 text-base text-[var(--muted)]">{lesson.subtitle}</p>
      </header>

      {lesson.goals && lesson.goals.length > 0 && (
        <section className="rounded-xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-5">
          <h2 className="mt-0 mb-2 text-xs font-extrabold tracking-wide text-[var(--accent-deep)]">
            You will learn
          </h2>
          <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-[var(--ink)]">
            {lesson.goals.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="space-y-4">
        {lesson.blocks.map((block, idx) => {
          if (block.type === 'heading') {
            return (
              <h2
                key={idx}
                className="font-display mt-8 mb-2 text-2xl font-semibold tracking-tight"
              >
                {block.text}
              </h2>
            );
          }

          if (block.type === 'p') {
            return (
              <p
                key={idx}
                className="my-3 text-[15px] leading-relaxed text-[var(--ink)]"
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            );
          }

          if (block.type === 'callout') {
            const style = CALLOUT_STYLES[block.kind] || CALLOUT_STYLES.note;
            const Icon = style.Icon;
            return (
              <div
                key={idx}
                className={`my-4 rounded-xl border p-4 ${style.container}`}
              >
                <div
                  className={`mb-1.5 flex items-center gap-2 text-sm font-extrabold ${style.labelColor}`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{block.title}</span>
                </div>
                <div
                  className="text-sm leading-relaxed text-[var(--ink)]"
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              </div>
            );
          }

          if (block.type === 'code') {
            const key = `${routeId}-${idx}`;
            return (
              <div
                key={idx}
                className="my-4 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--code-bg)] text-[var(--code-ink)]"
              >
                <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-3.5 py-2 text-xs text-slate-300">
                  <span className="font-mono-code flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {block.label || block.lang || 'code'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(block.code, key)}
                    className="flex min-h-7 cursor-pointer items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent)]"
                  >
                    <Copy className="h-3 w-3" aria-hidden="true" />
                    <span>{copiedKey === key ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono-code m-0 overflow-x-auto p-4 text-[13px] leading-relaxed">
                  <code>{block.code}</code>
                </pre>
              </div>
            );
          }

          if (block.type === 'table') {
            return (
              <div key={idx} className="my-4 overflow-x-auto rounded-xl border border-[var(--line)]">
                <table className="w-full border-collapse bg-[var(--paper-elevated)] text-left text-sm">
                  <thead>
                    <tr className="bg-[var(--surface-subtle)]">
                      {block.headers.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          className="border-b border-[var(--line)] px-3.5 py-2.5 font-bold text-[var(--ink)]"
                          dangerouslySetInnerHTML={{ __html: h }}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-[var(--line)] last:border-b-0">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="px-3.5 py-2.5 align-top text-[var(--ink)]"
                            dangerouslySetInnerHTML={{ __html: cell }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          if (block.type === 'lab') {
            return (
              <LabSlot
                key={idx}
                id={block.id}
                onToast={onToast}
                onToggleTheme={onToggleTheme}
              />
            );
          }

          return null;
        })}
      </div>

      {lesson.quiz && (
        <section
          aria-label="Knowledge check"
          className="mt-8 rounded-xl border border-[var(--line-strong)] bg-[var(--paper-elevated)] p-5"
        >
          <h3 className="font-display mt-0 mb-2 text-lg font-semibold">Quick Check</h3>
          <p className="mt-0 mb-3 text-sm font-bold text-[var(--ink)]">{lesson.quiz.q}</p>
          <div className="space-y-2">
            {lesson.quiz.options.map((opt, idx) => {
              const isPicked = pickedIdx === idx;
              const isCorrect = idx === lesson.quiz!.answer;
              let stateCls =
                'border-[var(--line)] bg-[var(--paper)] hover:border-[var(--accent)]';
              if (isPicked) {
                stateCls = isCorrect
                  ? 'border-[var(--success)] bg-[var(--success-soft)]'
                  : 'border-[var(--danger)] bg-[var(--danger-soft)]';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuizClick(idx)}
                  className={`flex min-h-[44px] w-full cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm text-[var(--ink)] transition-colors ${stateCls}`}
                >
                  <span className="font-mono-code font-bold text-[var(--muted)]">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
          {pickedIdx !== null && (
            <p
              aria-live="polite"
              className={`mt-3 mb-0 text-sm font-semibold ${
                pickedIdx === lesson.quiz.answer
                  ? 'text-[var(--success)]'
                  : 'text-[var(--danger)]'
              }`}
            >
              {pickedIdx === lesson.quiz.answer ? '✓ Correct! ' : '✗ Try again. '}
              <span className="font-normal text-[var(--ink)]">{lesson.quiz.explain}</span>
            </p>
          )}
        </section>
      )}

      <nav
        aria-label="Lesson pagination"
        className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5"
      >
        {prevItem ? (
          <button
            type="button"
            onClick={() => onNavigate(prevItem.id)}
            className="min-h-[44px] cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--paper-elevated)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--accent)]"
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
            className="min-h-[44px] cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {nextItem.label} →
          </button>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
