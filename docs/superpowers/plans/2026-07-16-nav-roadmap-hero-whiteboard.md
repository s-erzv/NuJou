# Sidebar nav, path roadmap, Prism hero, interactive whiteboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the top navbar with an icon-only left sidebar (desktop) / bottom tab bar (mobile), turn the Dashboard roadmap into a Duolingo-style winding path, add an animated Prism WebGL background behind the Dashboard hero, and rebuild the whiteboard as an object-based canvas (movable/resizable shapes, text, sticky notes, zoom/pan) using Konva.

**Architecture:** Four mostly-independent feature slices layered onto the existing React + Vite + Tailwind + Zustand app, built in one pass. Nav and roadmap changes are pure UI/markup rewrites reusing existing state/logic. Prism and the whiteboard rewrite each introduce one new runtime dependency and a dedicated component.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, react-router-dom, Zustand (unchanged) + new: `ogl` (WebGL, for Prism), `konva` + `react-konva` (canvas, for the whiteboard).

## Global Constraints

- Package manager is `pnpm` everywhere (`pnpm add <pkg>`, `pnpm dev`, `pnpm lint`) — never npm/yarn.
- This codebase has **no test framework** — only `tsc --noEmit` via `pnpm lint`. Every task's "verify" step is: run `pnpm lint` (must pass with zero errors) and manually check the result in the browser via `pnpm dev` (screenshot or direct viewing). Do not introduce a test framework as part of this plan.
- `tsconfig.json` has `"noUnusedLocals": true` and `"noUnusedParameters": true` — any import, variable, or parameter that becomes unused after an edit **must** be removed, or `pnpm lint` fails.
- Tailwind breakpoint convention already used in this repo: `sm` = 640px, `md` = 768px. The new sidebar/bottom-bar split uses `md` (768px) as the desktop/mobile boundary.
- Existing conventions to preserve: sky-blue palette (`tailwind.config.js` `sky` scale), `font-serif` = Lora / `font-sans` = Inter (already set up), `.reveal`/`useReveal` scroll-in animation, `GlassSurface` component (`src/components/reactbits/GlassSurface.tsx`) for any "glass" panel, Indonesian UI copy throughout.
- No dark mode (project is light-only; don't add `dark:` variants).
- Whiteboard content stays ephemeral (no persistence) — "Unduh PNG" remains the only save mechanism.

---

### Task 1: Icon-only sidebar (desktop) + bottom tab bar (mobile)

**Files:**
- Modify: `src/components/icons.tsx` (add `MapIcon`, `EcosystemIcon`)
- Modify: `src/components/Layout.tsx` (full rewrite)

**Interfaces:**
- Produces: `MapIcon`, `EcosystemIcon` — same shape as existing icons in this file (`({ className = 'h-5 w-5' }: P) => JSX.Element`).
- Consumes: `GlassSurface` from `./reactbits/GlassSurface` (props: `borderRadius`, `width`, `height`, `className`, `children` — already implemented, no changes needed here).

- [ ] **Step 1: Add the two new nav icons**

Open `src/components/icons.tsx` and append after the existing `XIcon` export:

```tsx
export const MapIcon = ({ className = 'h-5 w-5' }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 20 3.5 17.5V6L9 4m0 16 6-2M9 20V4m6 14 5.5 2V8.5L15 6m0 12V6m0 0L9 4" />
  </svg>
);

export const EcosystemIcon = ({ className = 'h-5 w-5' }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5 15.4 17M15.4 7 8.6 10.5" />
  </svg>
);
```

- [ ] **Step 2: Rewrite Layout.tsx**

Replace the entire contents of `src/components/Layout.tsx` with:

```tsx
import { NavLink, Outlet, Link } from 'react-router-dom';
import GlassSurface from './reactbits/GlassSurface';
import { MapIcon, PenIcon, EcosystemIcon } from './icons';

const navLinks = [
  { to: '/', label: 'Roadmap', end: true, icon: MapIcon },
  { to: '/papan-tulis', label: 'Papan Tulis', end: false, icon: PenIcon },
  { to: '/ekosistem', label: 'Ekosistem', end: false, icon: EcosystemIcon },
];

export default function Layout() {
  return (
    <div className="min-h-full bg-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-4 left-4 z-20 hidden md:block">
        <GlassSurface borderRadius={28} width={72} height="100%">
          <div className="flex h-full flex-col items-center py-5">
            <Link
              to="/"
              aria-label="NuJou — beranda"
              className="mb-6 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-600 font-serif text-sm font-bold text-white"
            >
              N
            </Link>
            <nav className="flex flex-1 flex-col items-center gap-2">
              {navLinks.map(({ to, label, end, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `group relative grid h-11 w-11 place-items-center rounded-full transition ${
                      isActive ? 'bg-sky-600 text-white' : 'text-slate-500 hover:bg-sky-50 hover:text-sky-700'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                    {label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        </GlassSurface>
      </aside>

      {/* Mobile top strip (brand only, no nav controls) */}
      <header className="fixed inset-x-0 top-0 z-20 flex h-12 items-center justify-center bg-white/80 backdrop-blur md:hidden">
        <Link to="/" className="font-serif text-lg font-bold tracking-tight text-slate-900">
          NuJou
        </Link>
      </header>

      <div className="flex min-h-full flex-col pb-24 pt-12 md:pb-0 md:pl-28 md:pt-0">
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="hidden border-t border-sky-100 bg-sky-50/40 md:block">
          <div className="container-academic py-6 text-center text-sm text-slate-500">
            created by claude n nuza
          </div>
        </footer>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="fixed inset-x-4 z-20 md:hidden"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <GlassSurface borderRadius={24}>
          <div className="flex h-16 items-center justify-around px-2">
            {navLinks.map(({ to, label, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-semibold transition ${
                    isActive ? 'text-sky-700' : 'text-slate-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full transition ${
                        isActive ? 'bg-sky-600 text-white' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </GlassSurface>
      </nav>
    </div>
  );
}
```

This removes the old sticky top header and hamburger dropdown entirely (no more `useState`/`useEffect`/`useLocation` needed in this file).

- [ ] **Step 3: Verify**

Run: `pnpm lint`
Expected: no errors.

Run `pnpm dev`, open the app:
- At ≥768px width: left sidebar visible with 3 icon buttons, "N" badge at top, hover shows tooltip label to the right of each icon, active route icon is filled sky-600, page content is not covered by the sidebar.
- At <768px width: sidebar is gone, a small "NuJou" strip sits at the very top, a bottom tab bar with 3 icon+label destinations is fixed at the bottom (respecting safe-area), page content isn't hidden behind either bar, footer is hidden.
- Clicking each of the 3 destinations (desktop and mobile) navigates correctly and updates the active state.

- [ ] **Step 4: Commit**

```bash
git add src/components/icons.tsx src/components/Layout.tsx
git commit -m "Replace top navbar with icon-only sidebar (desktop) and bottom tab bar (mobile)"
```

---

### Task 2: RoadmapPath component (Duolingo-style winding path)

**Files:**
- Create: `src/components/RoadmapPath.tsx`

**Interfaces:**
- Consumes: `Level` and `LevelProgress` types from `../types` (fields: `Level.id/slug/title/subtitle/estimatedMinutes/sections`; `LevelProgress.read/quiz?/exam?`, `AssessmentResult.passed`). `CheckIcon`, `LockIcon`, `BookIcon`, `ArrowIcon` from `./icons` (already exist, unchanged).
- Produces: `export default function RoadmapPath(props: RoadmapPathProps)` where

```ts
interface RoadmapPathProps {
  levels: Level[];
  progress: Record<number, LevelProgress>;
  isLevelUnlocked: (levelId: number) => boolean;
  currentId: number | undefined;
}
```

This is consumed by Task 3 (`Dashboard.tsx`), which already computes all four of these values today.

- [ ] **Step 1: Create the file**

Create `src/components/RoadmapPath.tsx`:

```tsx
import { Link } from 'react-router-dom';
import type { Level, LevelProgress } from '../types';
import { CheckIcon, LockIcon, BookIcon, ArrowIcon } from './icons';

interface RoadmapPathProps {
  levels: Level[];
  progress: Record<number, LevelProgress>;
  isLevelUnlocked: (levelId: number) => boolean;
  currentId: number | undefined;
}

const ROW_HEIGHT = 168;
const AMPLITUDE = 30;

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function NodeCircle({
  passed,
  current,
  locked,
  label,
}: {
  passed: boolean;
  current: boolean;
  locked?: boolean;
  label: number;
}) {
  return (
    <div
      className={`grid h-16 w-16 place-items-center rounded-full text-lg font-bold ring-4 ring-white transition ${
        passed
          ? 'bg-gradient-to-br from-sky-500 to-sky-700 text-white'
          : locked
            ? 'bg-slate-100 text-slate-400'
            : 'bg-sky-100 text-sky-700'
      } ${current ? 'pulse-ring' : ''}`}
    >
      {passed ? <CheckIcon className="h-6 w-6" /> : locked ? <LockIcon className="h-5 w-5" /> : label}
    </div>
  );
}

function CurrentLevelCard({ level, read }: { level: Level; read: boolean }) {
  return (
    <div className="w-64 rounded-2xl border border-sky-200 bg-white p-4 text-left shadow-lift sm:w-72">
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-2 py-0.5 text-xs font-semibold text-white">
        Lanjutkan di sini
      </span>
      <h3 className="mt-2 text-lg font-bold text-slate-900">{level.title}</h3>
      <p className="text-sm text-slate-500">{level.subtitle}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <BookIcon className="h-3.5 w-3.5" /> ~{level.estimatedMinutes} menit
        </span>
        <span className="text-slate-300">·</span>
        <span>{level.sections.length} bagian materi</span>
        {read && <span className="text-sky-600">· ✓ Sudah dibaca</span>}
      </div>
      <Link
        to={`/level/${level.slug}`}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:underline"
      >
        Mulai belajar <ArrowIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function RoadmapPath({ levels, progress, isLevelUnlocked, currentId }: RoadmapPathProps) {
  const passedCount = levels.filter((l) => progress[l.id]?.exam?.passed).length;

  const nodePoints = levels.map((_level, idx) => ({
    x: 50 + Math.sin(idx * 1.1) * AMPLITUDE,
    y: idx * ROW_HEIGHT + ROW_HEIGHT / 2,
  }));

  const totalHeight = levels.length * ROW_HEIGHT;
  const solidPath = buildPath(nodePoints.slice(0, passedCount + 1));
  const dashedPath = buildPath(nodePoints.slice(passedCount));
  const currentIdx = levels.findIndex((l) => l.id === currentId);

  return (
    <div
      className="relative mx-auto max-w-2xl"
      style={{ height: totalHeight + (currentIdx >= 0 ? 190 : 30) }}
    >
      <svg
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height: totalHeight }}
        viewBox={`0 0 100 ${totalHeight}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={dashedPath} fill="none" stroke="#bae6fd" strokeWidth="1.2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <path d={solidPath} fill="none" stroke="#0284c7" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>

      {levels.map((level, idx) => {
        const passed = Boolean(progress[level.id]?.exam?.passed);
        const unlocked = isLevelUnlocked(level.id);
        const isCurrent = level.id === currentId;
        const point = nodePoints[idx];

        return (
          <div
            key={level.id}
            className="reveal absolute -translate-x-1/2"
            style={{ left: `${point.x}%`, top: point.y - 32, transitionDelay: `${idx * 70}ms` }}
          >
            {unlocked ? (
              <Link to={`/level/${level.slug}`} className="group flex flex-col items-center gap-2">
                <NodeCircle passed={passed} current={isCurrent} label={level.id} />
                <span className="max-w-[6.5rem] text-center text-xs font-semibold leading-tight text-slate-500 group-hover:text-sky-700">
                  {level.title}
                </span>
              </Link>
            ) : (
              <div
                className="flex cursor-not-allowed flex-col items-center gap-2"
                title={`Lulus Ujian Level ${level.id - 1} dulu untuk membuka level ini.`}
              >
                <NodeCircle passed={false} current={false} locked label={level.id} />
                <span className="max-w-[6.5rem] text-center text-xs font-semibold leading-tight text-slate-300">
                  {level.title}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {currentIdx >= 0 && (
        <div
          className="reveal absolute left-1/2 -translate-x-1/2"
          style={{ top: nodePoints[currentIdx].y + 60 }}
        >
          <CurrentLevelCard
            level={levels[currentIdx]}
            read={Boolean(progress[levels[currentIdx].id]?.read)}
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint`
Expected: no errors (this file isn't wired up yet, so nothing renders it — this step just confirms it compiles standalone).

- [ ] **Step 3: Commit**

```bash
git add src/components/RoadmapPath.tsx
git commit -m "Add RoadmapPath: Duolingo-style winding roadmap component"
```

---

### Task 3: Wire RoadmapPath into Dashboard

**Files:**
- Modify: `src/pages/Dashboard.tsx`

**Interfaces:**
- Consumes: `RoadmapPath` from `../components/RoadmapPath` (Task 2).

- [ ] **Step 1: Update the icon import**

In `src/pages/Dashboard.tsx`, find:

```tsx
import { LockIcon, CheckIcon, ArrowIcon, BookIcon } from '../components/icons';
```

Replace with:

```tsx
import { CheckIcon } from '../components/icons';
```

(`LockIcon`, `ArrowIcon`, `BookIcon` are now only used inside `RoadmapPath.tsx`; `CheckIcon` is still used by the "Lencana Kelulusan" stat card.)

- [ ] **Step 2: Import RoadmapPath and drop the now-unused CSSProperties import**

Find:

```tsx
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { levels } from '../data';
```

Replace with:

```tsx
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { levels } from '../data';
import RoadmapPath from '../components/RoadmapPath';
```

- [ ] **Step 3: Replace the roadmap section markup**

Find the whole `<section>` block that starts with:

```tsx
        {/* Roadmap */}
        <section className="relative mx-auto max-w-3xl">
          <h2 className="reveal mb-6 text-center font-serif text-2xl font-bold text-slate-900">
            Peta Perjalanan Belajar
          </h2>

          {/* Animated timeline connector */}
          <div aria-hidden className="pointer-events-none absolute left-[27px] top-24 bottom-6 hidden w-1 rounded-full bg-sky-100 sm:block">
            <div
              className="w-full rounded-full bg-gradient-to-b from-sky-400 to-sky-700 transition-all duration-1000"
              style={{ height: `${(done / total) * 100}%` }}
            />
          </div>

          <ol className="space-y-5">
```

... all the way down to the matching closing:

```tsx
          </ol>
        </section>
```

Replace that entire block (from `{/* Roadmap */}` through the closing `</section>`) with:

```tsx
        {/* Roadmap */}
        <section className="relative mx-auto max-w-3xl pb-16">
          <h2 className="reveal mb-6 text-center font-serif text-2xl font-bold text-slate-900">
            Peta Perjalanan Belajar
          </h2>
          <RoadmapPath
            levels={levels}
            progress={progress}
            isLevelUnlocked={isLevelUnlocked}
            currentId={currentId}
          />
        </section>
```

- [ ] **Step 4: Delete the now-unused CardWrapper function**

Find and delete the entire `CardWrapper` function at the bottom of the file (from `function CardWrapper({` through its closing `}`) — it was only used by the old roadmap `<ol>` markup you just removed. Leave `StatCard` untouched (it's still used by the stat cards above the roadmap).

- [ ] **Step 5: Verify**

Run: `pnpm lint`
Expected: no errors (this also confirms no leftover unused imports/locals from `CSSProperties` or `LockIcon`/`ArrowIcon`/`BookIcon`).

Run `pnpm dev`, open `/`:
- The roadmap renders as a winding path of circular nodes instead of stacked cards.
- Level 1's node shows the "Lanjutkan di sini" expanded card with title/subtitle/meta/CTA.
- Locked levels (2-6, until level 1's exam is passed) show a lock icon and a `title` tooltip on hover; clicking does nothing.
- Clicking the level 1 node/CTA navigates to `/level/fundamental` exactly as before.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "Use RoadmapPath instead of the stacked-card roadmap on Dashboard"
```

---

### Task 4: Prism hero background

**Files:**
- Modify: `package.json` / `pnpm-lock.yaml` (via `pnpm add ogl`)
- Create: `src/components/reactbits/Prism.tsx`
- Create: `src/components/reactbits/Prism.css`
- Modify: `src/pages/Dashboard.tsx` (mount Prism behind the hero)
- Modify: `src/index.css` (add `.hero-prism` mask utility)

**Interfaces:**
- Produces: `export default function Prism(props: PrismProps)` — a self-mounting WebGL canvas that fills its parent (`width:100%; height:100%` via `Prism.css`). No other component needs to know its internals.

- [ ] **Step 1: Add the `ogl` dependency**

Run: `pnpm add ogl`
Expected: `ogl` appears in `package.json` `dependencies`.

- [ ] **Step 2: Create Prism.css**

Create `src/components/reactbits/Prism.css`:

```css
.prism-container {
  position: relative;
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 3: Create Prism.tsx**

Create `src/components/reactbits/Prism.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';
import './Prism.css';

type AnimationType = 'rotate' | 'hover' | '3drotate';

interface PrismProps {
  height?: number;
  baseWidth?: number;
  animationType?: AnimationType;
  glow?: number;
  offset?: { x: number; y: number };
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  suspendWhenOffscreen?: boolean;
  timeScale?: number;
}

/**
 * React Bits "Prism" background: a rotating glass-pyramid raymarch shader
 * rendered via `ogl`. Ported to TypeScript close to the upstream
 * implementation — the GLSL/math logic is left as-is on purpose.
 */
export default function Prism({
  height = 3.5,
  baseWidth = 5.5,
  animationType = 'rotate',
  glow = 1,
  offset = { x: 0, y: 0 },
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = false,
  timeScale = 0.5,
}: PrismProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;
    const GLOW = Math.max(0.0, glow);
    const NOISE = Math.max(0.0, noise);
    const offX = offset?.x ?? 0;
    const offY = offset?.y ?? 0;
    const SAT = transparent ? 1.5 : 1;
    const SCALE = Math.max(0.001, scale);
    const HUE = hueShift || 0;
    const CFREQ = Math.max(0.0, colorFrequency || 1);
    const BLOOM = Math.max(0.0, bloom || 1);
    const RSX = 1;
    const RSY = 1;
    const RSZ = 1;
    const TS = Math.max(0, timeScale || 1);
    const HOVSTR = Math.max(0, hoverStrength || 1);
    const INERT = Math.max(0, Math.min(1, inertia || 0.12));

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const renderer = new Renderer({ dpr, alpha: transparent, antialias: false });
    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    Object.assign(gl.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block',
    });
    container.appendChild(gl.canvas);

    const vertex = /* glsl */ `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258;
      }

      float sdPyramidUpInv(vec3 p){
        float oct = sdOctaAnisoInv(p);
        float halfSpace = -p.y;
        return max(oct, halfSpace);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        float d = 0.0;

        vec3 p;
        vec4 o = vec4(0.0);

        float centerShift = uCenterShift;
        float cf = uColorFreq;

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0);
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0);
        }

        const int STEPS = 100;
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;
          vec3 q = p;
          q.y += centerShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        if(abs(uHueShift) > 0.0001){
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        gl_FragColor = vec4(col, o.a);
      }
    `;

    const geometry = new Triangle(gl);
    const iResBuf = new Float32Array(2);
    const offsetPxBuf = new Float32Array(2);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },
        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },
        uUseBaseWobble: { value: 1 },
        uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
        uGlow: { value: GLOW },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: NOISE },
        uSaturation: { value: SAT },
        uScale: { value: SCALE },
        uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ },
        uBloom: { value: BLOOM },
        uCenterShift: { value: H * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },
        uPxScale: { value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE) },
        uTimeScale: { value: TS },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;
      offsetPxBuf[0] = offX * dpr;
      offsetPxBuf[1] = offY * dpr;
      program.uniforms.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const rotBuf = new Float32Array(9);
    const setMat3FromEuler = (yawY: number, pitchX: number, rollZ: number, out: Float32Array) => {
      const cy = Math.cos(yawY);
      const sy = Math.sin(yawY);
      const cx = Math.cos(pitchX);
      const sx = Math.sin(pitchX);
      const cz = Math.cos(rollZ);
      const sz = Math.sin(rollZ);
      const r00 = cy * cz + sy * sx * sz;
      const r01 = -cy * sz + sy * sx * cz;
      const r02 = sy * cx;
      const r10 = cx * sz;
      const r11 = cx * cz;
      const r12 = -sx;
      const r20 = -sy * cz + cy * sx * sz;
      const r21 = sy * sz + cy * sx * cz;
      const r22 = cy * cx;
      out[0] = r00;
      out[1] = r10;
      out[2] = r20;
      out[3] = r01;
      out[4] = r11;
      out[5] = r21;
      out[6] = r02;
      out[7] = r12;
      out[8] = r22;
      return out;
    };

    const NOISE_IS_ZERO = NOISE < 1e-6;
    let raf = 0;
    const t0 = performance.now();
    const startRAF = () => {
      if (raf) return;
      raf = requestAnimationFrame(render);
    };
    const stopRAF = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const rnd = () => Math.random();
    const wX = (0.3 + rnd() * 0.6) * RSX;
    const wY = (0.2 + rnd() * 0.7) * RSY;
    const wZ = (0.1 + rnd() * 0.5) * RSZ;
    const phX = rnd() * Math.PI * 2;
    const phZ = rnd() * Math.PI * 2;

    let yaw = 0;
    let pitch = 0;
    let roll = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const pointer = { x: 0, y: 0, inside: true };
    const onMove = (e: PointerEvent) => {
      const ww = Math.max(1, window.innerWidth);
      const wh = Math.max(1, window.innerHeight);
      const cx = ww * 0.5;
      const cy = wh * 0.5;
      const nx = (e.clientX - cx) / (ww * 0.5);
      const ny = (e.clientY - cy) / (wh * 0.5);
      pointer.x = Math.max(-1, Math.min(1, nx));
      pointer.y = Math.max(-1, Math.min(1, ny));
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    const onBlur = () => {
      pointer.inside = false;
    };

    let onPointerMove: ((e: PointerEvent) => void) | null = null;
    if (animationType === 'hover') {
      onPointerMove = (e) => {
        onMove(e);
        startRAF();
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('mouseleave', onLeave);
      window.addEventListener('blur', onBlur);
      program.uniforms.uUseBaseWobble.value = 0;
    } else if (animationType === '3drotate') {
      program.uniforms.uUseBaseWobble.value = 0;
    } else {
      program.uniforms.uUseBaseWobble.value = 1;
    }

    const render = (t: number) => {
      const time = (t - t0) * 0.001;
      program.uniforms.iTime.value = time;

      let continueRAF = true;

      if (animationType === 'hover') {
        const maxPitch = 0.6 * HOVSTR;
        const maxYaw = 0.6 * HOVSTR;
        targetYaw = (pointer.inside ? -pointer.x : 0) * maxYaw;
        targetPitch = (pointer.inside ? pointer.y : 0) * maxPitch;
        const prevYaw = yaw;
        const prevPitch = pitch;
        const prevRoll = roll;
        yaw = lerp(prevYaw, targetYaw, INERT);
        pitch = lerp(prevPitch, targetPitch, INERT);
        roll = lerp(prevRoll, 0, 0.1);
        program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);

        if (NOISE_IS_ZERO) {
          const settled =
            Math.abs(yaw - targetYaw) < 1e-4 && Math.abs(pitch - targetPitch) < 1e-4 && Math.abs(roll) < 1e-4;
          if (settled) continueRAF = false;
        }
      } else if (animationType === '3drotate') {
        const tScaled = time * TS;
        yaw = tScaled * wY;
        pitch = Math.sin(tScaled * wX + phX) * 0.6;
        roll = Math.sin(tScaled * wZ + phZ) * 0.5;
        program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);
        if (TS < 1e-6) continueRAF = false;
      } else {
        rotBuf.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        program.uniforms.uRot.value = rotBuf;
        if (TS < 1e-6) continueRAF = false;
      }

      renderer.render({ scene: mesh });
      if (continueRAF) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };

    let io: IntersectionObserver | null = null;
    if (suspendWhenOffscreen) {
      io = new IntersectionObserver((entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis) startRAF();
        else stopRAF();
      });
      io.observe(container);
      startRAF();
    } else {
      startRAF();
    }

    return () => {
      stopRAF();
      ro.disconnect();
      if (animationType === 'hover') {
        if (onPointerMove) window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('blur', onBlur);
      }
      io?.disconnect();
      if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
    };
  }, [
    height,
    baseWidth,
    animationType,
    glow,
    noise,
    offset?.x,
    offset?.y,
    scale,
    transparent,
    hueShift,
    colorFrequency,
    timeScale,
    hoverStrength,
    inertia,
    bloom,
    suspendWhenOffscreen,
  ]);

  return <div className="prism-container" ref={containerRef} />;
}
```

- [ ] **Step 4: Add the hero mask utility**

In `src/index.css`, find:

```css
  .hero-glow {
    background: radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.18), transparent 60%);
  }
```

Add immediately after it:

```css

  .hero-prism {
    opacity: 0.85;
    mask-image: radial-gradient(ellipse 60% 55% at 50% 35%, transparent 35%, black 78%);
    -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 35%, transparent 35%, black 78%);
  }
```

- [ ] **Step 5: Mount Prism behind the Dashboard hero**

In `src/pages/Dashboard.tsx`, add a value import for React hooks (this file currently only has a `type`-only import from `'react'`). Find:

```tsx
import type { ReactNode } from 'react';
```

Replace with:

```tsx
import { useEffect, useState, type ReactNode } from 'react';
```

Then add the Prism import next to the other component imports, e.g. right after:

```tsx
import { useSpotlight } from '../components/reactbits/useSpotlight';
```

add:

```tsx
import Prism from '../components/reactbits/Prism';
```

Then, inside `export default function Dashboard() {`, right after the existing `const reveal = useReveal<HTMLDivElement>();` line, add:

```tsx
  const [motionOk, setMotionOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionOk(!mq.matches);
  }, []);
```

Finally, find:

```tsx
    <div ref={reveal} className="relative">
      {/* Soft background wash */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[380px]" />
```

Replace with:

```tsx
    <div ref={reveal} className="relative">
      {/* Animated hero backdrop (Prism), falls back to a static glow under reduced-motion */}
      <div aria-hidden className="hero-prism pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        {motionOk ? (
          <Prism
            height={3.2}
            baseWidth={5.5}
            animationType="rotate"
            glow={0.7}
            bloom={0.8}
            hueShift={0.9}
            colorFrequency={1}
            timeScale={0.35}
            scale={3.4}
          />
        ) : (
          <div className="hero-glow absolute inset-0" />
        )}
      </div>
```

- [ ] **Step 6: Verify**

Run: `pnpm lint`
Expected: no errors.

Run `pnpm dev`, open `/`:
- A softly-animated, blue/cyan-leaning rotating shape is visible behind the hero heading, faded toward the center so the heading/paragraph stay fully legible.
- Resize the window — the effect should resize smoothly with no console errors.
- In Chrome DevTools, enable "Emulate CSS prefers-reduced-motion: reduce" (Rendering tab) and reload — the Prism canvas should not mount at all; the plain `.hero-glow` gradient should show instead.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/reactbits/Prism.tsx src/components/reactbits/Prism.css src/pages/Dashboard.tsx src/index.css
git commit -m "Add Prism WebGL hero background to Dashboard, with reduced-motion fallback"
```

---

### Task 5: Whiteboard foundations — Konva Stage + Select & Pen tools

**Files:**
- Modify: `package.json` / `pnpm-lock.yaml` (via `pnpm add konva react-konva`)
- Create: `src/components/whiteboard/types.ts`
- Modify: `src/pages/Whiteboard.tsx` (full rewrite)

**Interfaces:**
- Produces (from `types.ts`): `ToolMode`, `CanvasObject` (union of `LineObject | TextObject | StickyObject | RectObject | EllipseObject`), `createId(prefix: string): string`. Tasks 6-9 all import from this file and extend the same union — the exact field names below must not change.

- [ ] **Step 1: Add Konva dependencies**

Run: `pnpm add konva react-konva`
Expected: both appear in `package.json` `dependencies`.

- [ ] **Step 2: Create the shared object-model types**

Create `src/components/whiteboard/types.ts`:

```ts
export type ToolMode = 'select' | 'pen' | 'text' | 'sticky' | 'rect' | 'ellipse';

interface BaseObject {
  id: string;
  x?: number;
  y?: number;
  rotation?: number;
}

export interface LineObject extends BaseObject {
  kind: 'line';
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface TextObject extends BaseObject {
  kind: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
  width: number;
}

export interface StickyObject extends BaseObject {
  kind: 'sticky';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  text: string;
}

export interface RectObject extends BaseObject {
  kind: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
}

export interface EllipseObject extends BaseObject {
  kind: 'ellipse';
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill: string;
  stroke: string;
}

export type CanvasObject = LineObject | TextObject | StickyObject | RectObject | EllipseObject;

let counter = 0;
export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}
```

- [ ] **Step 3: Rewrite Whiteboard.tsx (base: Select + Pen only)**

Replace the entire contents of `src/pages/Whiteboard.tsx` with:

```tsx
import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Transformer } from 'react-konva';
import type Konva from 'konva';
import { PenIcon } from '../components/icons';
import { useReveal } from '../lib/useReveal';
import ClickSpark from '../components/reactbits/ClickSpark';
import { createId } from '../components/whiteboard/types';
import type {
  CanvasObject,
  LineObject,
  TextObject,
  StickyObject,
  RectObject,
  EllipseObject,
  ToolMode,
} from '../components/whiteboard/types';

const COLORS = ['#0f172a', '#0284c7', '#0ea5e9', '#38bdf8', '#ef4444', '#16a34a', '#f59e0b'];
const SIZES = [2, 4, 8, 16];

/**
 * A loose "patch" shape covering every optional field across all
 * CanvasObject variants. Plain `Partial<CanvasObject>` doesn't work here:
 * TypeScript's `keyof` on a union only keeps keys common to every member,
 * so it would drop variant-specific fields like `width` or `text` entirely.
 */
type ObjectPatch = Partial<LineObject> &
  Partial<TextObject> &
  Partial<StickyObject> &
  Partial<RectObject> &
  Partial<EllipseObject>;

export default function Whiteboard() {
  const reveal = useReveal<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const nodesRef = useRef<Record<string, Konva.Node | null>>({});
  const isDrawing = useRef(false);

  const [size, setSize] = useState({ width: 800, height: 520 });
  const [tool, setTool] = useState<ToolMode>('pen');
  const [color, setColor] = useState(COLORS[1]);
  const [strokeWidth, setStrokeWidth] = useState(SIZES[1]);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = width < 640 ? 360 : 520;
      setSize({ width, height });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!trRef.current) return;
    const selectedObj = objects.find((o) => o.id === selectedId);
    if (selectedObj && selectedObj.kind !== 'line' && selectedId && nodesRef.current[selectedId]) {
      trRef.current.nodes([nodesRef.current[selectedId]!]);
    } else {
      trRef.current.nodes([]);
    }
    trRef.current.getLayer()?.batchDraw();
  }, [selectedId, objects]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setObjects((prev) => prev.filter((o) => o.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId]);

  const registerNode = (id: string, node: Konva.Node | null) => {
    nodesRef.current[id] = node;
  };

  const handleObjectChange = (id: string, attrs: ObjectPatch) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? ({ ...obj, ...attrs } as CanvasObject) : obj)));
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const clickedOnEmpty = e.target === stage;

    if (tool === 'pen') {
      isDrawing.current = true;
      const pos = stage.getPointerPosition();
      if (!pos) return;
      const newLine: LineObject = {
        id: createId('line'),
        kind: 'line',
        points: [pos.x, pos.y],
        stroke: color,
        strokeWidth,
      };
      setObjects((prev) => [...prev, newLine]);
      return;
    }

    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const handleStageMouseMove = () => {
    if (tool !== 'pen' || !isDrawing.current) return;
    const stage = stageRef.current;
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    setObjects((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.kind !== 'line') return prev;
      const updated: LineObject = { ...last, points: [...last.points, pos.x, pos.y] };
      return [...prev.slice(0, -1), updated];
    });
  };

  const handleStageMouseUp = () => {
    isDrawing.current = false;
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setObjects((prev) => prev.filter((o) => o.id !== selectedId));
    setSelectedId(null);
  };

  const clearAll = () => {
    setObjects([]);
    setSelectedId(null);
  };

  const download = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `nujou-outline-${Date.now()}.png`;
    link.href = uri;
    link.click();
  };

  return (
    <div ref={reveal} className="container-academic py-10">
      <header className="reveal mb-6">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-sky-600">
          <PenIcon className="h-4 w-4" /> Papan Tulis
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-slate-900">
          Brainstorm & Kerangka Tulisan
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Gunakan kanvas ini untuk memetakan gagasan, menyusun outline, atau menggambar diagram
          IMRaD sebelum menulis. Gambaran kasar sering kali melahirkan struktur yang jernih.
        </p>
      </header>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTool('select')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'select' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Pilih
          </button>
          <button
            onClick={() => setTool('pen')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'pen' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Pena
          </button>
        </div>

        <div className="h-6 w-px bg-sky-200" />

        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Warna ${c}`}
              className={`h-7 w-7 rounded-full ring-2 ring-offset-2 transition ${
                color === c ? 'ring-sky-500' : 'ring-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-sky-200" />

        <div className="flex items-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setStrokeWidth(s)}
              aria-label={`Ukuran ${s}`}
              className={`grid h-8 w-8 place-items-center rounded-md border transition ${
                strokeWidth === s ? 'border-sky-500 bg-white' : 'border-transparent hover:bg-white'
              }`}
            >
              <span className="rounded-full bg-slate-800" style={{ width: s, height: s }} />
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {selectedId && (
            <button
              onClick={deleteSelected}
              className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Hapus
            </button>
          )}
          <button onClick={clearAll} className="btn-ghost px-4 py-1.5 text-sm">
            Bersihkan
          </button>
          <ClickSpark>
            <button onClick={download} className="btn-primary px-4 py-1.5 text-sm">
              Unduh PNG
            </button>
          </ClickSpark>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="reveal relative overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-card"
      >
        <Stage
          ref={stageRef}
          width={size.width}
          height={size.height}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchStart={handleStageMouseDown}
          onTouchMove={handleStageMouseMove}
          onTouchEnd={handleStageMouseUp}
        >
          <Layer>
            {objects.map((obj) => {
              if (obj.kind !== 'line') return null;
              return (
                <Line
                  key={obj.id}
                  id={obj.id}
                  x={obj.x ?? 0}
                  y={obj.y ?? 0}
                  points={obj.points}
                  stroke={obj.stroke}
                  strokeWidth={obj.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                  draggable={tool === 'select'}
                  onClick={() => tool === 'select' && setSelectedId(obj.id)}
                  onTap={() => tool === 'select' && setSelectedId(obj.id)}
                  onDragEnd={(e) =>
                    handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                  }
                  ref={(node) => registerNode(obj.id, node)}
                />
              );
            })}
            <Transformer ref={trRef} rotateEnabled />
          </Layer>
        </Stage>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">
        Catatan: gambar tidak tersimpan otomatis. Gunakan "Unduh PNG" untuk menyimpan karya Anda.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `pnpm lint`
Expected: no errors.

Run `pnpm dev`, open `/papan-tulis`:
- "Pena" tool (default) lets you draw freehand strokes with the mouse/touch.
- Switching to "Pilih" and clicking a stroke selects it (no resize handles expected yet — lines intentionally don't get a Transformer); dragging it moves it.
- Pressing Delete/Backspace with a stroke selected removes it; the "Hapus" button appears only when something is selected and does the same.
- "Bersihkan" clears the canvas. "Unduh PNG" downloads a PNG of the current drawing.
- Canvas resizes to a shorter height (360px) below 640px viewport width, as before.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/whiteboard/types.ts src/pages/Whiteboard.tsx
git commit -m "Rebuild whiteboard on Konva: object model, Select and Pen tools"
```

---

### Task 6: Text & sticky-note tools with in-place editing

**Files:**
- Create: `src/components/whiteboard/TextEditorOverlay.tsx`
- Modify: `src/pages/Whiteboard.tsx`

**Interfaces:**
- Produces: `export default function TextEditorOverlay(props: TextEditorOverlayProps)` where

```ts
interface TextEditorOverlayProps {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  value: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}
```

- [ ] **Step 1: Create the overlay component**

Create `src/components/whiteboard/TextEditorOverlay.tsx`:

```tsx
import { useEffect, useRef } from 'react';

interface TextEditorOverlayProps {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  value: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

export default function TextEditorOverlay({
  x,
  y,
  width,
  fontSize,
  value,
  onCommit,
  onCancel,
}: TextEditorOverlayProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  return (
    <textarea
      ref={ref}
      defaultValue={value}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width,
        fontSize,
        fontFamily: 'Inter, sans-serif',
        border: '1px solid #38bdf8',
        borderRadius: 6,
        padding: 4,
        background: 'white',
        color: '#0f172a',
        resize: 'none',
        outline: 'none',
        zIndex: 50,
      }}
      onBlur={(e) => onCommit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          onCommit((e.target as HTMLTextAreaElement).value);
        }
      }}
    />
  );
}
```

- [ ] **Step 2: Wire it into Whiteboard.tsx**

In `src/pages/Whiteboard.tsx`, update the react-konva import to add `Text` and `Group`/`Rect`:

Find:

```tsx
import { Stage, Layer, Line, Transformer } from 'react-konva';
```

Replace with:

```tsx
import { Stage, Layer, Line, Text, Group, Rect, Transformer } from 'react-konva';
```

`TextObject` and `StickyObject` are already imported (Task 5 imports every `CanvasObject` variant up front), so no import change is needed here.

Add the overlay import right after the react-konva import:

```tsx
import TextEditorOverlay from '../components/whiteboard/TextEditorOverlay';
```

Add an `editingId` state next to the other `useState` calls:

```tsx
  const [editingId, setEditingId] = useState<string | null>(null);
```

Add a helper right after `registerNode`:

```tsx
  const getEditorRect = (id: string) => {
    const stage = stageRef.current;
    const node = nodesRef.current[id];
    if (!stage || !node) return null;
    return node.getClientRect({ relativeTo: stage });
  };
```

In `handleStageMouseDown`, add two new branches right before the `if (clickedOnEmpty)` check (i.e. after the existing `if (tool === 'pen') { ... return; }` block):

```tsx
    if (tool === 'text') {
      const pos = stage.getPointerPosition();
      if (!pos) return;
      const id = createId('text');
      const newText: TextObject = {
        id,
        kind: 'text',
        x: pos.x,
        y: pos.y,
        text: 'Ketik di sini',
        fontSize: 20,
        fill: color,
        width: 220,
      };
      setObjects((prev) => [...prev, newText]);
      setTool('select');
      setSelectedId(id);
      setEditingId(id);
      return;
    }

    if (tool === 'sticky') {
      const pos = stage.getPointerPosition();
      if (!pos) return;
      const id = createId('sticky');
      const newSticky: StickyObject = {
        id,
        kind: 'sticky',
        x: pos.x,
        y: pos.y,
        width: 180,
        height: 140,
        fill: color,
        text: 'Catatan...',
      };
      setObjects((prev) => [...prev, newSticky]);
      setTool('select');
      setSelectedId(id);
      setEditingId(id);
      return;
    }
```

Add two toolbar buttons next to "Pena" (inside the same `<div className="flex items-center gap-1">` block):

Find:

```tsx
          <button
            onClick={() => setTool('pen')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'pen' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Pena
          </button>
        </div>
```

Replace with:

```tsx
          <button
            onClick={() => setTool('pen')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'pen' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Pena
          </button>
          <button
            onClick={() => setTool('text')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'text' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Teks
          </button>
          <button
            onClick={() => setTool('sticky')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'sticky' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Sticky Note
          </button>
        </div>
```

In the `<Layer>`, right after the `{objects.map((obj) => { if (obj.kind !== 'line') return null; ... })}` block, add rendering for text and sticky objects. Find the line:

```tsx
            <Transformer ref={trRef} rotateEnabled />
```

Replace with:

```tsx
            {objects.map((obj) => {
              if (obj.kind === 'text') {
                return (
                  <Text
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    text={obj.text}
                    fontSize={obj.fontSize}
                    fontFamily="Inter, sans-serif"
                    fill={obj.fill}
                    width={obj.width}
                    rotation={obj.rotation ?? 0}
                    draggable={tool === 'select'}
                    visible={editingId !== obj.id}
                    onClick={() => tool === 'select' && setSelectedId(obj.id)}
                    onTap={() => tool === 'select' && setSelectedId(obj.id)}
                    onDblClick={() => {
                      setSelectedId(obj.id);
                      setEditingId(obj.id);
                    }}
                    onDblTap={() => {
                      setSelectedId(obj.id);
                      setEditingId(obj.id);
                    }}
                    onDragEnd={(e) =>
                      handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      node.scaleX(1);
                      node.scaleY(1);
                      handleObjectChange(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(40, node.width() * scaleX),
                        rotation: node.rotation(),
                      });
                    }}
                    ref={(node) => registerNode(obj.id, node)}
                  />
                );
              }

              if (obj.kind === 'sticky') {
                return (
                  <Group
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    rotation={obj.rotation ?? 0}
                    draggable={tool === 'select'}
                    visible={editingId !== obj.id}
                    onClick={() => tool === 'select' && setSelectedId(obj.id)}
                    onTap={() => tool === 'select' && setSelectedId(obj.id)}
                    onDblClick={() => {
                      setSelectedId(obj.id);
                      setEditingId(obj.id);
                    }}
                    onDblTap={() => {
                      setSelectedId(obj.id);
                      setEditingId(obj.id);
                    }}
                    onDragEnd={(e) =>
                      handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      handleObjectChange(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(80, obj.width * scaleX),
                        height: Math.max(60, obj.height * scaleY),
                        rotation: node.rotation(),
                      });
                    }}
                    ref={(node) => registerNode(obj.id, node)}
                  >
                    <Rect
                      width={obj.width}
                      height={obj.height}
                      fill={obj.fill}
                      cornerRadius={10}
                      shadowColor="rgba(15, 23, 42, 0.25)"
                      shadowBlur={10}
                      shadowOffset={{ x: 0, y: 4 }}
                    />
                    <Text
                      text={obj.text}
                      width={obj.width}
                      height={obj.height}
                      padding={12}
                      fontSize={16}
                      fontFamily="Inter, sans-serif"
                      fill="#0f172a"
                    />
                  </Group>
                );
              }

              return null;
            })}
            <Transformer ref={trRef} rotateEnabled />
```

Right after the closing `</Stage>` tag (still inside the canvas container `<div>`), add the overlay render:

```tsx
        </Stage>
        {editingId &&
          (() => {
            const obj = objects.find((o) => o.id === editingId);
            const rect = getEditorRect(editingId);
            if (!obj || !rect || (obj.kind !== 'text' && obj.kind !== 'sticky')) return null;
            return (
              <TextEditorOverlay
                x={rect.x}
                y={rect.y}
                width={obj.kind === 'sticky' ? obj.width - 16 : obj.width}
                fontSize={obj.kind === 'sticky' ? 16 : obj.fontSize}
                value={obj.text}
                onCommit={(value) => {
                  handleObjectChange(editingId, { text: value });
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            );
          })()}
```

- [ ] **Step 3: Verify**

Run: `pnpm lint`
Expected: no errors.

Run `pnpm dev`, open `/papan-tulis`:
- Selecting "Teks" and clicking the canvas places an editable text box in edit mode immediately (textarea overlay, pre-selected "Ketik di sini") — typing and clicking away (blur) commits the text and shows it as a Konva `Text` node.
- Selecting "Sticky Note" and clicking places a colored rounded note (using the currently selected color) in edit mode the same way.
- Double-clicking an existing text or sticky note re-opens the editor with its current text.
- Switching to "Pilih" lets you drag/select/resize (Transformer handles appear) text and sticky notes; Delete/Backspace or the "Hapus" button removes the selected one.

- [ ] **Step 4: Commit**

```bash
git add src/components/whiteboard/TextEditorOverlay.tsx src/pages/Whiteboard.tsx
git commit -m "Add Text and Sticky Note tools with in-place editing to the whiteboard"
```

---

### Task 7: Shape tools (rectangle, ellipse) + resize for all objects

**Files:**
- Modify: `src/pages/Whiteboard.tsx`

- [ ] **Step 1: Extend imports and refs**

Find:

```tsx
import { Stage, Layer, Line, Text, Group, Rect, Transformer } from 'react-konva';
```

Replace with:

```tsx
import { Stage, Layer, Line, Text, Group, Rect, Ellipse, Transformer } from 'react-konva';
```

`RectObject` and `EllipseObject` are already imported (Task 5 imports every `CanvasObject` variant up front), so no import change is needed here.

Add two refs next to `isDrawing`:

```tsx
  const shapeStart = useRef<{ x: number; y: number } | null>(null);
  const drawingShapeId = useRef<string | null>(null);
```

- [ ] **Step 2: Handle shape creation in the pointer handlers**

In `handleStageMouseDown`, add a new branch right before the `if (tool === 'text')` block:

```tsx
    if (tool === 'rect' || tool === 'ellipse') {
      const pos = stage.getPointerPosition();
      if (!pos) return;
      const id = createId(tool);
      shapeStart.current = pos;
      drawingShapeId.current = id;
      if (tool === 'rect') {
        const newRect: RectObject = {
          id,
          kind: 'rect',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fill: `${color}33`,
          stroke: color,
        };
        setObjects((prev) => [...prev, newRect]);
      } else {
        const newEllipse: EllipseObject = {
          id,
          kind: 'ellipse',
          x: pos.x,
          y: pos.y,
          radiusX: 0,
          radiusY: 0,
          fill: `${color}33`,
          stroke: color,
        };
        setObjects((prev) => [...prev, newEllipse]);
      }
      return;
    }
```

In `handleStageMouseMove`, replace the whole function body. Find:

```tsx
  const handleStageMouseMove = () => {
    if (tool !== 'pen' || !isDrawing.current) return;
    const stage = stageRef.current;
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    setObjects((prev) => {
      const last = prev[prev.length - 1];
      if (!last || last.kind !== 'line') return prev;
      const updated: LineObject = { ...last, points: [...last.points, pos.x, pos.y] };
      return [...prev.slice(0, -1), updated];
    });
  };
```

Replace with:

```tsx
  const handleStageMouseMove = () => {
    const stage = stageRef.current;

    if (tool === 'pen' && isDrawing.current) {
      const pos = stage?.getPointerPosition();
      if (!pos) return;
      setObjects((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.kind !== 'line') return prev;
        const updated: LineObject = { ...last, points: [...last.points, pos.x, pos.y] };
        return [...prev.slice(0, -1), updated];
      });
      return;
    }

    if ((tool === 'rect' || tool === 'ellipse') && drawingShapeId.current && shapeStart.current) {
      const pos = stage?.getPointerPosition();
      if (!pos) return;
      const start = shapeStart.current;
      const id = drawingShapeId.current;
      setObjects((prev) =>
        prev.map((obj) => {
          if (obj.id !== id) return obj;
          if (obj.kind === 'rect') {
            return {
              ...obj,
              x: Math.min(start.x, pos.x),
              y: Math.min(start.y, pos.y),
              width: Math.abs(pos.x - start.x),
              height: Math.abs(pos.y - start.y),
            };
          }
          if (obj.kind === 'ellipse') {
            return {
              ...obj,
              x: (start.x + pos.x) / 2,
              y: (start.y + pos.y) / 2,
              radiusX: Math.abs(pos.x - start.x) / 2,
              radiusY: Math.abs(pos.y - start.y) / 2,
            };
          }
          return obj;
        }),
      );
    }
  };
```

Find:

```tsx
  const handleStageMouseUp = () => {
    isDrawing.current = false;
  };
```

Replace with:

```tsx
  const handleStageMouseUp = () => {
    isDrawing.current = false;
    if (drawingShapeId.current) {
      const id = drawingShapeId.current;
      setTool('select');
      setSelectedId(id);
    }
    drawingShapeId.current = null;
    shapeStart.current = null;
  };
```

- [ ] **Step 3: Render rect/ellipse objects**

In the `<Layer>`, find the `return null;` that ends the `objects.map` block just before `<Transformer ref={trRef} rotateEnabled />`, i.e.:

```tsx
              return null;
            })}
            <Transformer ref={trRef} rotateEnabled />
```

Replace with:

```tsx
              if (obj.kind === 'rect') {
                return (
                  <Rect
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    width={obj.width}
                    height={obj.height}
                    fill={obj.fill}
                    stroke={obj.stroke}
                    strokeWidth={2}
                    cornerRadius={6}
                    rotation={obj.rotation ?? 0}
                    draggable={tool === 'select'}
                    onClick={() => tool === 'select' && setSelectedId(obj.id)}
                    onTap={() => tool === 'select' && setSelectedId(obj.id)}
                    onDragEnd={(e) =>
                      handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      handleObjectChange(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(20, node.width() * scaleX),
                        height: Math.max(20, node.height() * scaleY),
                        rotation: node.rotation(),
                      });
                    }}
                    ref={(node) => registerNode(obj.id, node)}
                  />
                );
              }

              if (obj.kind === 'ellipse') {
                return (
                  <Ellipse
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    radiusX={obj.radiusX}
                    radiusY={obj.radiusY}
                    fill={obj.fill}
                    stroke={obj.stroke}
                    strokeWidth={2}
                    rotation={obj.rotation ?? 0}
                    draggable={tool === 'select'}
                    onClick={() => tool === 'select' && setSelectedId(obj.id)}
                    onTap={() => tool === 'select' && setSelectedId(obj.id)}
                    onDragEnd={(e) =>
                      handleObjectChange(obj.id, { x: e.target.x(), y: e.target.y() })
                    }
                    onTransformEnd={(e) => {
                      const node = e.target as Konva.Ellipse;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      handleObjectChange(obj.id, {
                        x: node.x(),
                        y: node.y(),
                        radiusX: Math.max(10, node.radiusX() * scaleX),
                        radiusY: Math.max(10, node.radiusY() * scaleY),
                        rotation: node.rotation(),
                      });
                    }}
                    ref={(node) => registerNode(obj.id, node)}
                  />
                );
              }

              return null;
            })}
            <Transformer ref={trRef} rotateEnabled />
```

- [ ] **Step 4: Add toolbar buttons**

Find the "Sticky Note" button added in Task 6 and add two more right after it, still inside the same tool-group `<div>`:

```tsx
          <button
            onClick={() => setTool('rect')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'rect' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Kotak
          </button>
          <button
            onClick={() => setTool('ellipse')}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              tool === 'ellipse' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Lingkaran
          </button>
```

- [ ] **Step 5: Verify**

Run: `pnpm lint`
Expected: no errors.

Run `pnpm dev`, open `/papan-tulis`:
- "Kotak"/"Lingkaran": drag on the canvas to draw a rectangle/ellipse of the size you drag; releasing switches to "Pilih" with the new shape selected and its Transformer handles visible.
- Resizing via the handles updates the shape's stored width/height (or radiusX/radiusY) — dragging a handle and releasing keeps the new size (no snap-back).
- Rotate handle works and persists rotation.
- Text/sticky notes from Task 6 still work unaffected.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Whiteboard.tsx
git commit -m "Add rectangle/ellipse shape tools with resize and rotate to the whiteboard"
```

---

### Task 8: Zoom & pan

**Files:**
- Modify: `src/pages/Whiteboard.tsx`

- [ ] **Step 1: Add zoom/pan state and handlers**

Add state next to `size`:

```tsx
  const [stageTransform, setStageTransform] = useState({ scale: 1, x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);
```

Add these functions right after `handleStageMouseUp`:

```tsx
  const zoomBy = (factor: number) => {
    setStageTransform((prev) => {
      const newScale = Math.min(4, Math.max(0.4, prev.scale * factor));
      const center = { x: size.width / 2, y: size.height / 2 };
      const mousePointTo = { x: (center.x - prev.x) / prev.scale, y: (center.y - prev.y) / prev.scale };
      return {
        scale: newScale,
        x: center.x - mousePointTo.x * newScale,
        y: center.y - mousePointTo.y * newScale,
      };
    });
  };

  const resetView = () => setStageTransform({ scale: 1, x: 0, y: 0 });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const oldScale = stageTransform.scale;
    const mousePointTo = {
      x: (pointer.x - stageTransform.x) / oldScale,
      y: (pointer.y - stageTransform.y) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.05;
    const newScale = Math.min(4, Math.max(0.4, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy));
    setStageTransform({
      scale: newScale,
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const getTouchDistance = (touches: TouchList) => {
    const a = touches[0];
    const b = touches[1];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleTouchStartWrapped = (e: Konva.KonvaEventObject<TouchEvent>) => {
    if (e.evt.touches.length === 2) {
      lastPinchDist.current = getTouchDistance(e.evt.touches);
      return;
    }
    handleStageMouseDown(e);
  };

  const handleTouchMoveWrapped = (e: Konva.KonvaEventObject<TouchEvent>) => {
    if (e.evt.touches.length === 2) {
      e.evt.preventDefault();
      const dist = getTouchDistance(e.evt.touches);
      if (lastPinchDist.current != null) {
        zoomBy(dist / lastPinchDist.current);
      }
      lastPinchDist.current = dist;
      return;
    }
    handleStageMouseMove();
  };

  const handleTouchEndWrapped = () => {
    lastPinchDist.current = null;
    handleStageMouseUp();
  };
```

- [ ] **Step 2: Update `getEditorRect` for zoom**

Find:

```tsx
  const getEditorRect = (id: string) => {
    const stage = stageRef.current;
    const node = nodesRef.current[id];
    if (!stage || !node) return null;
    return node.getClientRect({ relativeTo: stage });
  };
```

Replace with:

```tsx
  const getEditorRect = (id: string) => {
    const stage = stageRef.current;
    const node = nodesRef.current[id];
    if (!stage || !node) return null;
    const scale = stage.scaleX();
    const box = node.getClientRect({ relativeTo: stage });
    return {
      x: stage.x() + box.x * scale,
      y: stage.y() + box.y * scale,
      width: box.width * scale,
      height: box.height * scale,
    };
  };
```

- [ ] **Step 3: Apply the transform to the Stage and swap in the wrapped touch handlers**

Find:

```tsx
        <Stage
          ref={stageRef}
          width={size.width}
          height={size.height}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchStart={handleStageMouseDown}
          onTouchMove={handleStageMouseMove}
          onTouchEnd={handleStageMouseUp}
        >
```

Replace with:

```tsx
        <Stage
          ref={stageRef}
          width={size.width}
          height={size.height}
          scaleX={stageTransform.scale}
          scaleY={stageTransform.scale}
          x={stageTransform.x}
          y={stageTransform.y}
          draggable={tool === 'select'}
          onWheel={handleWheel}
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setStageTransform((prev) => ({ ...prev, x: e.target.x(), y: e.target.y() }));
            }
          }}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchStart={handleTouchStartWrapped}
          onTouchMove={handleTouchMoveWrapped}
          onTouchEnd={handleTouchEndWrapped}
        >
```

- [ ] **Step 4: Add zoom toolbar controls**

Find the `<div className="ml-auto flex items-center gap-2">` block and add zoom controls before the "Hapus" button. Find:

```tsx
        <div className="ml-auto flex items-center gap-2">
          {selectedId && (
```

Replace with:

```tsx
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => zoomBy(0.85)} className="btn-ghost px-3 py-1.5 text-sm" aria-label="Perkecil">
            −
          </button>
          <span className="w-12 text-center text-xs font-semibold text-slate-500">
            {Math.round(stageTransform.scale * 100)}%
          </span>
          <button onClick={() => zoomBy(1.15)} className="btn-ghost px-3 py-1.5 text-sm" aria-label="Perbesar">
            +
          </button>
          <button onClick={resetView} className="btn-ghost px-3 py-1.5 text-sm">
            Reset
          </button>
          {selectedId && (
```

- [ ] **Step 5: Verify**

Run: `pnpm lint`
Expected: no errors.

Run `pnpm dev`, open `/papan-tulis`:
- Scrolling the mouse wheel over the canvas zooms in/out centered on the cursor; the `%` readout in the toolbar updates.
- `+`/`−`/"Reset" buttons work as expected.
- With "Pilih" active, dragging empty canvas pans the view; dragging an existing object still moves just that object (not the whole canvas).
- On a touchscreen (or Chrome DevTools device toolbar with touch emulation), two-finger pinch zooms.
- Double-clicking a text/sticky note to edit it still positions the textarea correctly after zooming/panning.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Whiteboard.tsx
git commit -m "Add wheel/button/pinch zoom and drag-to-pan to the whiteboard"
```

---

### Task 9: Quick-insert templates as Konva nodes

**Files:**
- Modify: `src/pages/Whiteboard.tsx`

- [ ] **Step 1: Add the template data and insertion function**

Add this near the top of the file, after the `SIZES` constant:

```tsx
const TEMPLATES: Record<string, { title: string; items: string[] }> = {
  imrad: {
    title: 'Kerangka IMRaD',
    items: [
      'Introduction — latar belakang, celah, tujuan',
      'Methods — desain, sampel, instrumen',
      'Results — temuan (angka/tabel)',
      'Discussion — makna, keterbatasan, saran',
    ],
  },
  esai: {
    title: 'Kerangka Esai',
    items: [
      'Pendahuluan — kalimat tesis (pendirian + alasan)',
      'Isi 1 — argumen + bukti',
      'Isi 2 — argumen + bukti',
      'Penutup — tegaskan tesis & simpulan',
    ],
  },
  proposal: {
    title: 'Kerangka Proposal',
    items: [
      'Latar belakang — ideal vs kenyataan (gap)',
      'Rumusan masalah — pertanyaan inti',
      'Tujuan — jawaban yang dicari',
      'Metode — populasi, sampel, analisis',
    ],
  },
};
```

Add the insertion function inside the component, right after `deleteSelected`:

```tsx
  const insertTemplate = (key: keyof typeof TEMPLATES) => {
    const tpl = TEMPLATES[key];
    const baseX = 40;
    const baseY = 40;
    const newObjects: CanvasObject[] = [
      {
        id: createId('text'),
        kind: 'text',
        x: baseX,
        y: baseY,
        text: tpl.title,
        fontSize: 24,
        fill: '#0369a1',
        width: 360,
      },
      {
        id: createId('rect'),
        kind: 'rect',
        x: baseX,
        y: baseY + 40,
        width: 320,
        height: 2,
        fill: '#bae6fd',
        stroke: '#bae6fd',
      },
      ...tpl.items.map((item, i) => ({
        id: createId('text'),
        kind: 'text' as const,
        x: baseX + 8,
        y: baseY + 64 + i * 34,
        text: `•  ${item}`,
        fontSize: 16,
        fill: '#0f172a',
        width: 420,
      })),
    ];
    setObjects((prev) => [...prev, ...newObjects]);
  };
```

- [ ] **Step 2: Add the quick-insert row above the toolbar**

Find:

```tsx
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
```

Replace with:

```tsx
      {/* Quick templates */}
      <div className="reveal mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">Sisipkan kerangka:</span>
        {Object.entries(TEMPLATES).map(([key, tpl]) => (
          <button
            key={key}
            onClick={() => insertTemplate(key as keyof typeof TEMPLATES)}
            className="rounded-full border border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            {tpl.title}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-sky-50/50 p-3">
```

- [ ] **Step 3: Verify**

Run: `pnpm lint`
Expected: no errors.

Run `pnpm dev`, open `/papan-tulis`:
- Clicking "Kerangka IMRaD"/"Kerangka Esai"/"Kerangka Proposal" adds a title + divider + bulleted outline near the top-left of the canvas.
- Switching to "Pilih", the inserted title and each bullet line are individually selectable, draggable, and editable (double-click to edit text) — not baked-in pixels.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Whiteboard.tsx
git commit -m "Reimplement whiteboard quick-insert templates as editable Konva objects"
```

---

### Task 10: Full verification pass

**Files:** none (verification only, fix forward in the relevant file if something's broken)

- [ ] **Step 1: Full typecheck**

Run: `pnpm lint`
Expected: zero errors across the whole project.

- [ ] **Step 2: Full production build**

Run: `pnpm build`
Expected: build succeeds with no errors (this also catches anything `tsc --noEmit` alone might miss, e.g. Vite/Rollup resolution issues with the new dependencies).

- [ ] **Step 3: Manual walkthrough — nav**

Run `pnpm dev`. At ≥768px and at a mobile width (e.g. 390px):
- Every route (`/`, `/level/:slug`, `/level/:slug/quiz`, `/level/:slug/exam`, `/papan-tulis`, `/ekosistem`) is reachable from both the sidebar and the bottom tab bar, and the correct destination is highlighted as active on each page.
- No page's content is visually clipped by the sidebar, the mobile top strip, or the bottom tab bar.

- [ ] **Step 4: Manual walkthrough — roadmap + hero**

On `/`:
- The winding path renders correctly for the current progress state; try resetting progress ("Reset progres") and confirm all levels but #1 show as locked with the path mostly dashed.
- Pass level 1's exam (or otherwise progress) if feasible, and confirm the solid portion of the path grows and the "current" card moves to the next node.
- Confirm the Prism background animates smoothly and text stays legible; confirm the reduced-motion fallback (DevTools emulation) still works after all other changes.

- [ ] **Step 5: Manual walkthrough — whiteboard**

On `/papan-tulis`, exercise every tool once: draw with Pen, add Text, add a Sticky Note, draw a Kotak and a Lingkaran, select and resize/rotate/move each, delete one via keyboard and one via the "Hapus" button, zoom with the wheel and with +/−/Reset, pan by dragging empty canvas, pinch-zoom if a touch device/emulator is available, insert one quick-insert template and confirm its pieces are individually editable, then "Bersihkan" and finally "Unduh PNG" and confirm a PNG downloads with the current content.

- [ ] **Step 6: Fix forward**

If any of the above steps surface a bug, fix it in the relevant file (from Tasks 1-9) and re-run the specific check that failed. Do not introduce new features while fixing — only correct the defect.

- [ ] **Step 7: Final commit (only if fixes were needed)**

```bash
git add -A
git commit -m "Fix issues found in full verification pass"
```
