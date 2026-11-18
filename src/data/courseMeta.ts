import type { NavGroup, PacingItem } from '../types/course';

export const COURSE_META: {
  title: string;
  subtitle: string;
  navGroups: NavGroup[];
  pacing: PacingItem[];
} = {
  title: 'Web Development, Page by Page',
  subtitle:
    'From "I know basic JavaScript and React" to understanding every part of a real, published web application — taught through every page of the FreeAppStore platform documentation.',
  navGroups: [
    {
      title: 'Before You Begin',
      items: [{ id: 'home', label: 'Course Overview & Pacing' }],
    },
    {
      title: 'Part I · Foundations',
      items: [
        { id: 'ch1', label: '1 · How the Web Works' },
        { id: 'ch2', label: '2 · The Browser Platform' },
        { id: 'ch3', label: '3 · JS to TypeScript' },
        { id: 'ch4', label: '4 · React in Depth' },
        { id: 'ch5', label: '5 · Developer’s Toolbox' },
        { id: 'ch6', label: '6 · Progressive Web Apps' },
        { id: 'ch7', label: '7 · Cloud & Deployment' },
        { id: 'ch8', label: '8 · Security & Identity' },
        { id: 'ch9', label: '9 · Accessibility & UI' },
      ],
    },
    {
      title: 'Part II · The 10 Docs Pages',
      items: [
        { id: 'm1', label: 'M1 · Home' },
        { id: 'm2', label: 'M2 · Getting Started' },
        { id: 'm3', label: 'M3 · SDK Reference' },
        { id: 'm4', label: 'M4 · UI & the Shell' },
        { id: 'm5', label: 'M5 · CLI Reference' },
        { id: 'm6', label: 'M6 · Publishing' },
        { id: 'm7', label: 'M7 · Proxy & Keys' },
        { id: 'm8', label: 'M8 · Platform Limits' },
        { id: 'm9', label: 'M9 · Architecture' },
        { id: 'm10', label: 'M10 · MCP Server' },
      ],
    },
    {
      title: 'Part III · Build & Ship',
      items: [
        { id: 'ch10', label: '10 · Capstone: Pinboard' },
        { id: 'ch11', label: '11 · Debugging Handbook' },
        { id: 'ch12', label: '12 · Where to Go Next' },
      ],
    },
    {
      title: 'Appendices & Tools',
      items: [
        { id: 'appA', label: 'A · Docs vs. Code (16)' },
        { id: 'appB', label: 'B · Coverage Map' },
        { id: 'appC', label: 'C · Cheat Sheets' },
        { id: 'appD', label: 'D · SDK Quick Ref' },
        { id: 'appE', label: 'E · Glossary & Cards' },
      ],
    },
  ],
  pacing: [
    {
      weeks: '1–2',
      read: 'Chapters 1–3 (Web, Browser, TypeScript)',
      action: 'URL & Event Loop labs; inspect DevTools on every site',
    },
    {
      weeks: '3',
      read: 'Chapters 4–5 (React, Toolbox)',
      action: 'StrictMode lab; scaffold Vite + React + TS project',
    },
    {
      weeks: '4',
      read: 'Chapters 6–9 (PWA, Cloud, Security, A11y)',
      action: 'HMAC token tamper lab; keyboard-only navigation test',
    },
    {
      weeks: '5',
      read: 'Modules 1–3 (Home, Getting Started, SDK)',
      action: 'Explore fas.kv, fas.collections, fas.counters',
    },
    {
      weeks: '6',
      read: 'Modules 4–6 (UI/Shell, CLI, Publishing)',
      action: 'Build 2 Shell screens; test fas check compliance lab',
    },
    {
      weeks: '7',
      read: 'Modules 7–10 (Proxy, Limits, Arch, MCP)',
      action: 'Test proxy allowlist & trace Figure M9.1 flows',
    },
    {
      weeks: '8+',
      read: 'Part III (Capstone, Debugging, Next)',
      action: 'Run Pinboard simulator & diagnose planted bugs',
    },
  ],
};
