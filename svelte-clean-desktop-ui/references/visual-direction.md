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

Use DM Sans for primary UI text. In t3code, web and desktop preview surfaces use `"DM Sans Variable", "DM Sans"` with system fallbacks, marketing imports Google Fonts DM Sans weights 400/500/600, and mobile uses Expo families `DMSans_400Regular`, `DMSans_500Medium`, and `DMSans_700Bold`.

For Svelte desktop webviews, prefer:

```css
--ux-font-body: "DM Sans Variable", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
--ux-font-title: var(--ux-font-body);
--ux-font-mono: "SF Mono", "SFMono-Regular", "JetBrains Mono", Consolas, "Liberation Mono", Menlo, monospace;
```

Recommended application:

- install/import `@fontsource-variable/dm-sans` when bundling fonts locally is desired;
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
- Search/settings buttons often look too heavy when they should read as compact field-like controls.
- Settings pages become hard to scan when they are long collections of ad hoc groups instead of section surfaces with consistent row recipes.
- Resize handles should be quiet until hover; use wider hit targets with thinner visible lines.

## Design Strategy

1. Add semantic surface tokens.
2. Replace saturated selection states with sidebar and panel accents.
3. Make primitives feel polished through tighter state classes.
4. Use reusable Svelte section and row patterns.
5. Keep compact desktop efficiency while polishing rhythm and texture.
