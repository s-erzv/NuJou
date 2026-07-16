# Sidebar nav, path roadmap, Prism hero, interactive whiteboard

Status: approved
Date: 2026-07-16

## Context

NuJou is a small Indonesian academic-writing learning app (React + Vite +
Tailwind + Zustand, no backend). The current UI has:

- A top sticky pill navbar (`Layout.tsx`) built on a custom `GlassSurface`
  port, with a mobile hamburger dropdown.
- A vertical stacked-card roadmap on the Dashboard (`<ol>` of full-width
  level cards with a straight connecting line).
- A plain radial-gradient `.hero-glow` behind the Dashboard hero text.
- A raw `<canvas>` pixel-drawing whiteboard (`Whiteboard.tsx`) with a fixed
  pen tool, color/size pickers, and baked-in quick-insert templates that
  draw text directly onto the bitmap (not editable afterward).

This spec covers four changes requested together: a sidebar-style nav, a
game-like roadmap path, an animated Prism hero background, and turning the
whiteboard into a real object-based canvas tool (movable/resizable
shapes, text, sticky notes, zoom/pan).

All four are being built in one pass (explicit user choice, not staged).

## 1. Navigation: icon-only sidebar (desktop) + bottom tab bar (mobile)

**Desktop (≥768px, Tailwind `md`):**
- `Layout.tsx` switches from a top sticky header to a flex-row shell: a
  fixed, full-height left sidebar (~72px wide) + main content.
- Sidebar is a `GlassSurface` panel, icon-only: NuJou mark/badge at top,
  then three icon buttons (Roadmap, Papan Tulis, Ekosistem), vertically
  stacked, roughly centered in the remaining height.
- Active route: filled sky-600 circle, white icon. Inactive: slate-500
  icon, sky-50 hover background.
- Hover reveals a small floating tooltip label to the right of the icon
  (no visible text otherwise — confirmed icon-only direction).
- Main content area gets `pl-[72px]` (or equivalent) so nothing sits
  under the sidebar. `container-academic` inner max-width/centering is
  unaffected.
- New icons needed in `icons.tsx`: a route/map icon for Roadmap, a
  network/nodes icon for Ekosistem. `PenIcon` already exists for Papan
  Tulis.

**Mobile (<768px):**
- Sidebar is hidden. A fixed bottom tab bar (same `GlassSurface`
  treatment, `fixed inset-x-0 bottom-0`) replaces it, same 3 destinations,
  icon + small (~10px) label so it's usable without hover, safe-area
  bottom padding (`env(safe-area-inset-bottom)`).
- A slim plain top strip (not glass, just `bg-white/80 backdrop-blur`)
  shows only the "NuJou" wordmark linking home — no nav controls there.
- Main content gets bottom padding equal to the tab bar's height so
  content isn't obscured.
- The existing hamburger dropdown mobile menu is removed entirely,
  replaced by this bottom bar.

## 2. Roadmap: Duolingo-style winding path

- New `src/components/RoadmapPath.tsx`, used by `Dashboard.tsx` in place
  of the current `<ol className="space-y-5">` block. Level data,
  `isLevelUnlocked`, `progress`, and the `currentId` calculation in
  `Dashboard.tsx` are unchanged — only the rendering changes.
- Each level is a circular node (number, or check icon if passed)
  positioned with a percentage-based `left` offset following a wave:
  `left = 50% + amplitude * sin(index * phase)`, smaller amplitude on
  narrow viewports (e.g. `±22%` mobile vs `±35%` desktop) so nodes never
  crowd the edges.
- A single SVG path element, `viewBox="0 0 100 <total-height>"` with
  percentage coordinates (so it's responsive without a `ResizeObserver`,
  unlike `GlassSurface`), draws a smooth cubic-bezier line connecting node
  centers in order behind the nodes. Completed segments render as a solid
  sky gradient stroke; locked segments render dashed/faded.
- Node status styling reuses existing conventions: passed = gradient
  sky-500→sky-700 fill + `CheckIcon`; unlocked-not-current = light sky
  bg + number; locked = slate/grey + `LockIcon`; current = existing
  `.pulse-ring` animation carried over.
- Only the **current** level gets an attached floating detail card
  (title, subtitle, meta row, CTA button) beside/below its node — this
  is the one place the existing card content (title, subtitle, estimated
  minutes, section count, CTA) lives in full, mirroring how Duolingo
  expands only the "next lesson" bubble.
- Every other node shows a compact, always-visible caption underneath
  (level number + short title, 1–2 lines, truncated) so information isn't
  hidden behind hover-only interaction — hover additionally shows the
  full title in a tooltip on desktop.
- Locked nodes are inert (`cursor-not-allowed`) with a tooltip/caption
  explaining which exam to pass first (existing copy: "Lulus Ujian Level
  X dulu untuk membuka level ini.").
- Clicking an unlocked node still navigates to `/level/:slug` exactly as
  today (`Link`, no behavior change to routing).
- `useReveal` scroll-reveal + staggered `transitionDelay` per node is
  preserved from the current implementation.

## 3. Prism hero background

- New dependency: `ogl` (confirmed with user — this component is not
  dependency-free like the four existing reactbits ports).
- `src/components/reactbits/Prism.tsx`: TypeScript port of react-bits'
  `Prism.jsx`, kept close to the upstream WebGL/shader implementation
  (this is intricate GLSL — minimize logic changes, only adapt typing and
  our prop defaults).
- Mounted only behind the Dashboard hero section (`absolute inset-x-0
  top-0`, contained to hero height, `overflow-hidden`, low z-index behind
  the heading/paragraph), replacing/supplementing the current
  `.hero-glow` div.
- Tuned defaults: hue shifted toward sky/cyan (not full rainbow), `glow`
  and `bloom` turned down from upstream defaults for subtlety against a
  white/light background, `transparent: true`.
- A CSS radial mask fades the canvas toward transparent at the center
  where the heading/paragraph sit, so the effect frames the hero rather
  than rendering directly under dense text — protects legibility without
  needing a separate scrim.
- Respects `prefers-reduced-motion`: the component checks the media query
  and, when reduced motion is requested, doesn't mount the WebGL canvas
  at all — Dashboard falls back to the existing static `.hero-glow`
  gradient. This matches the reduced-motion handling already present in
  `index.css` for the other animated utilities.
- `dpr` capped at `Math.min(2, devicePixelRatio)` (upstream default
  behavior) — acceptable perf tradeoff, accepted by user knowing the risk
  on lower-end mobile devices.

## 4. Whiteboard: object-based canvas via Konva

- New dependencies: `konva` + `react-konva` (confirmed with user).
- `Whiteboard.tsx` is substantially rewritten: the raw `<canvas>` +
  manual pointer-event drawing is replaced by a `react-konva`
  `Stage`/`Layer` setup with a small tool-mode state machine.
- **Tools:**
  - **Select** — click an object to attach a Konva `Transformer` (resize
    handles + rotate handle) and enable drag-move. Clicking empty canvas
    deselects.
  - **Pen** — freehand strokes recorded as Konva `Line` objects (kept
    ink-like: not resizable, but selectable/deletable as discrete
    objects, unlike the old flat bitmap).
  - **Text** — click to place an editable text node (in-place edit via a
    temporary HTML `<textarea>` overlay, the standard Konva text-editing
    pattern, committed back to a Konva `Text` node on blur).
  - **Sticky note** — colored rounded `Rect` + editable `Text`, reusing
    the existing `COLORS` palette as note tint options.
  - **Shapes** — rectangle and ellipse, drag to draw, then selectable and
    transformable like any other object.
  - **Zoom/pan** — mouse wheel zooms the `Stage` around the cursor
    position (standard Konva zoom-to-point recipe); explicit `+`/`−`/
    "Reset view" buttons in the toolbar; drag-to-pan on empty canvas
    while Select tool is active; two-touch pinch-to-zoom for mobile.
- Existing quick-insert templates (Kerangka IMRaD / Esai / Proposal)
  become a batch of pre-positioned Konva `Text`/`Rect` nodes added to the
  layer instead of pixels baked into a bitmap — so inserted template text
  is editable/movable afterward like anything else.
- "Bersihkan" clears all objects from the layer. "Unduh PNG" uses Konva's
  built-in `stage.toDataURL()` (simpler than the current manual
  `canvas.toDataURL()` + manual redraw-preservation code).
- Color and size pickers apply to the active tool's default style (pen
  stroke color/width, new-shape fill/stroke, sticky-note tint) rather
  than to a global canvas context state.
- Touch support comes largely for free from Konva's pointer-event model;
  pinch-to-zoom needs a small custom two-touch distance handler on the
  `Stage`.
- This is the largest single piece of implementation work in this spec.

## Out of scope

- Persisting whiteboard content across sessions (still ephemeral, as
  today — "Unduh PNG" remains the only save mechanism).
- Any change to the level data model, XP/progress logic, or assessment
  flow.
- Dark mode (project is light-only; `color-scheme: light` stays as-is).
- Staging/splitting this work into separate PRs — user explicitly chose
  to do all four pieces in one pass.

## Risks / tradeoffs (acknowledged by user)

- `ogl`, `konva`, and `react-konva` are three new dependencies, breaking
  from the "dependency-free" pattern the four existing reactbits ports
  (`GlassSurface`, `ShinyText`, `SpotlightCard`, `ClickSpark`) follow.
  Accepted as necessary for WebGL shaders and real object
  drag/resize/rotate respectively.
- Prism's WebGL canvas has real cost on low-end mobile; mitigated by
  reduced-motion opt-out and capped `dpr`, but not eliminated.
- Rewriting Whiteboard from raw canvas to Konva is a full replacement,
  not an incremental patch — existing "Bersihkan"/"Unduh PNG"/template
  behavior needs to be re-verified end-to-end after the rewrite.
