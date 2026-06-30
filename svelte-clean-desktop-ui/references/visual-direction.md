# Visual Direction

## Feasibility

A Svelte 5 desktop app can reach a clean, modern, professional UI without changing libraries. Bits UI and shadcn-svelte provide enough interaction primitives; Tailwind v4 provides enough styling control. The visual quality comes from:

- tokenized neutral surfaces;
- compact but deliberate spacing;
- contextual typography;
- subtle borders and shadows;
- careful hover/active/focus states;
- stable desktop layout constraints.

The redesign should focus on tokens, class recipes, primitive wrappers, and screen composition instead of framework migration.

## Core Traits

### 1. Layered Neutral Surfaces

Separate app canvas, sidebars, popovers, cards, editors, terminals, and elevated overlays with small neutral deltas. Avoid loud color fields. Light mode should use white and near-neutral grays; dark mode should use several distinct black/neutral layers rather than one flat dark slab.

Recommended application:

- introduce separate variables for shell canvas, sidebar, sidebar accent, editor surface, elevated surface, and active surface;
- reduce large primary-tinted active states;
- use `bg-foreground/[0.03-0.08]` style fills for hover and selected navigation.

### 2. Density With Breathing Room

Rows should often use 28-36px heights, 8px horizontal rhythm, 12-13px text, and icons at 12-16px. The interface feels spacious because alignment and grouping are clean, not because everything is large.

Recommended application:

- keep sidebar nav rows at `h-7` or `py-1.5`;
- use `gap-1.5` or `gap-2` consistently;
- avoid mixing many text sizes inside one row;
- constrain metadata lines to one line with truncation.

### 3. Typography

The UI face is the single highest-impact lever on how soft or how robotic the whole
interface reads. Use **Geist** (a humanist, low-contrast variable sans, weight range
100-900) for primary UI text. Avoid rigid geometric sans faces (DM Sans, Poppins,
Montserrat) for dense desktop chrome: their uniform strokes and round, tightly-spaced
bowls render heavy and "mechanical" at 12-13px, which is exactly the noisy/robotic
texture this skill exists to remove. A humanist face opens the letter rhythm and keeps
small UI text light and even.

For Svelte desktop webviews, prefer:

```css
--ux-font-body: "Geist Variable", "Geist", "DM Sans Variable", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
--ux-font-title: var(--ux-font-body);
--ux-font-mono: "SF Mono", "SFMono-Regular", "JetBrains Mono", Consolas, "Liberation Mono", Menlo, monospace;
```

Geist leads; DM Sans and the system UI stack stay in the chain as graceful fallbacks.

Recommended application:

- install/import `@fontsource-variable/geist` when bundling fonts locally is desired (it exposes the `"Geist Variable"` family);
- set the rendering hints on `body` so the face stays light and even, not heavy: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; letter-spacing: 0.01em;`
- keep body at 12-13px;
- use `font-medium` for interactive labels, `font-semibold` for section titles, muted regular text for metadata;
- avoid excessive uppercase.

### 4. State Behavior

States should be restrained:

- inactive icons often sit at 30-60% foreground opacity;
- hover fills are foreground-mixed at about 5-8%;
- active sidebar rows use the sidebar accent surface, not saturated color;
- focus rings are visible but soft, often `ring-[3px] ring-ring/50`;
- secondary controls may reveal on hover when touch access remains available.

Recommended application:

- replace broad primary-tinted selection with role-specific active surfaces;
- keep primary color for true command emphasis, badges, or selected toolbar toggles only;
- use hover opacity instead of strong background shifts.

### 5. Settings Layout

Settings should use a clear sidebar plus a focused content area. A section header has strong title and description, then body content sits in a rounded, softly bordered surface. This makes settings feel organized without many nested cards.

Recommended application:

- create a reusable settings section shell;
- body surfaces should be `rounded-xl border border-border/50 bg-card/50 px-6/7 py-5/6 shadow-xs`;
- rows inside sections should use dividers or row gaps, not individual cards for every field.

## Common Problems To Fix

- Generic shadcn neutral tokens often lack enough surface roles for desktop shell depth.
- Compact text tokens can skew too small if they do not define panels, rows, controls, elevation, and focus as a complete system.
- Strong borders and broad primary-tinted active states feel mechanical; use neutral sidebar accents instead.
- Full-strength hairlines are a top cause of a "noisy" shell: a structural divider applied as `border-border` (e.g. `border-b border-border` on a top band or status bar) reads as a hard, crisp line. Soften every structural divider to `border-border/50`-`/60`, or a `color-mix(in srgb, var(--border) 60-72%, transparent)` line, so separators stay quiet against the content.
- A geometric UI face (DM Sans, Poppins, Montserrat) makes the whole interface read heavier and more robotic than the same layout in a humanist variable face (Geist). When an interface "feels noisy" with no obvious layout fault, check the typeface first.
- Search/settings buttons often look too heavy when they should read as compact field-like controls.
- Settings pages become hard to scan when they are long collections of ad hoc groups instead of section surfaces with consistent row recipes.
- Resize handles should be quiet until hover; use wider hit targets with thinner visible lines.

## Design Strategy

1. Add semantic surface tokens.
2. Replace saturated selection states with sidebar and panel accents.
3. Make primitives feel polished through tighter state classes.
4. Use reusable Svelte section and row patterns.
5. Keep compact desktop efficiency while polishing rhythm and texture.
