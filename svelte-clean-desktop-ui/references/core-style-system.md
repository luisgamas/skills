# Core Style System

## Design Keywords

Clean, quiet, precise, dense, breathable, tool-like, neutral, stable.

## Color Tokens

Keep the existing shadcn-compatible variables, then add semantic desktop variables. Suggested mapping:

```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #ffffff;
  --popover: #ffffff;
  --primary: #171717;
  --secondary: #f5f5f5;
  --muted: #f5f5f5;
  --accent: #f5f5f5;
  --border: #e5e5e5;
  --ring: #a1a1a1;

  --ux-shell: #ffffff;
  --ux-sidebar: #f7f7f7;
  --ux-sidebar-accent: #ececec;
  --ux-sidebar-hover: rgb(10 10 10 / 0.055);
  --ux-panel: #ffffff;
  --ux-panel-muted: #fafafa;
  --ux-editor-surface: #ffffff;
  --ux-elevated: #ffffff;
  --ux-subtle-border: rgb(10 10 10 / 0.09);
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #171717;
  --popover: #171717;
  --primary: #e5e5e5;
  --secondary: #262626;
  --muted: #262626;
  --accent: #353535;
  --border: rgb(255 255 255 / 0.07);
  --ring: #737373;

  --ux-shell: #0a0a0a;
  --ux-sidebar: #171717;
  --ux-sidebar-accent: #262626;
  --ux-sidebar-hover: rgb(255 255 255 / 0.065);
  --ux-panel: #111111;
  --ux-panel-muted: #171717;
  --ux-editor-surface: #1e1e1e;
  --ux-elevated: #171717;
  --ux-subtle-border: rgb(255 255 255 / 0.08);
}
```

Principles:

- Use grayscale as the default visual language.
- Use primary color for final commands, selected toolbar toggles, high-signal badges, and focus markers.
- Use semantic colors only for real status: success, warning, danger, modified, added, deleted.
- Do not use large tinted backgrounds for routine active states.

## Typography

Preferred stack — lead with **Geist**, a humanist low-contrast variable sans that
renders softer and lighter than a geometric face at dense UI sizes (the texture lever;
see `visual-direction.md` §3):

```css
--ux-font-body: "Geist Variable", "Geist", "DM Sans Variable", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
--ux-font-title: var(--ux-font-body);
--ux-font-mono: "SF Mono", "SFMono-Regular", "JetBrains Mono", Consolas, "Liberation Mono", Menlo, monospace;
```

For local bundling, use `@fontsource-variable/geist` and import it once in the application entry or app stylesheet (it exposes the `"Geist Variable"` family). If the font is not bundled yet, keep the fallback stack intact.

Set the font-rendering hints once on `body` so the face stays light and even rather than heavy:

```css
body {
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Type roles:

- App title / settings page title: 20-24px, `font-semibold`, tight line-height.
- Panel heading: 14px, `font-semibold`.
- Row title: 13px, `font-medium`.
- Body/control text: 12-13px, `font-medium` for interactive controls, regular for content.
- Metadata: 11-12px, muted, regular.
- Badges/counters: 10-11px, medium/semibold.
- Avoid negative letter spacing. Slight positive letter spacing can help tiny labels, e.g. `tracking-[0.03em]`.

## Spacing And Radius

Use an 8px mental grid, with half steps for dense desktop controls.

- App shell padding: 8-12px.
- Sidebar nav row: `px-2 py-1.5`, height about 28px.
- Toolbar icon button: 24px or 28px.
- Standard button: 32-36px depending on context.
- Dialog/content padding: 16-24px.
- Settings section body: 24-28px horizontal, 20-24px vertical.
- List/card gaps: 4-8px.
- Radius: 6px for rows/buttons, 8px for cards/popovers, 12px for large section surfaces.

Avoid inflating spacing globally. Add breathing room between groups, not inside every row.

## Borders And Elevation

Default:

- Use `border-border/50` for cards and section bodies.
- Use `border-border/60` for dividers — including the **structural** ones (panel top bands, status bar, toolbar seams). Do not apply these at full strength (`border-border`): a full-strength hairline reads as a hard, crisp line and is a top cause of a "noisy"/robotic shell. When you need an even quieter seam, use `color-mix(in srgb, var(--border) 60-72%, transparent)`.
- Use foreground-mixed borders for elevated overlays when Tailwind arbitrary values are practical.
- Use `shadow-xs` or `shadow-sm` only for elevated cards, popovers, dialogs, and floating controls.

Desktop shell surfaces should usually be flat. Popovers and dialogs may use stronger shadow:

```txt
shadow-[0_10px_32px_rgb(0_0_0/0.12),0_4px_12px_rgb(0_0_0/0.08)]
dark:shadow-[0_10px_32px_rgb(0_0_0/0.30),0_4px_16px_rgb(0_0_0/0.20)]
```

## State Recipes

Hover:

```txt
hover:bg-foreground/[0.055] dark:hover:bg-foreground/[0.065]
```

Active sidebar/nav:

```txt
bg-[var(--ux-sidebar-accent)] text-foreground
```

Subordinate active row:

```txt
bg-foreground/[0.055] text-foreground
```

Focus visible:

```txt
focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50
```

Disabled:

```txt
disabled:pointer-events-none disabled:opacity-50
```

Destructive:

```txt
text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20
```

## Scrollbars

Use sleek scrollbars on panels and popovers. Keep gutter stable where content is dense.

- General panels: 10-12px scrollbar with transparent track and padded thumb.
- Sidebars: 8px scrollbar, transparent until hover when possible.
- Editors/terminal: keep dedicated editor/terminal scrollbar treatment.

Do not let scrollbar thumbs overlay labels in horizontal tab strips.

## Motion

Use short transitions: 100-150ms for colors, background, opacity, border, shadow. Avoid layout animations for dense desktop controls unless they clarify state.

Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto;
  }
}
```
