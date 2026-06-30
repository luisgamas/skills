# Screen Patterns

## App Shell

Goal: a stable desktop workbench where chrome recedes and content feels organized.

Recommended shell roles:

- root: `bg-[var(--ux-shell)] text-foreground`;
- sidebars: `bg-sidebar text-sidebar-foreground`;
- center work area: `bg-background`;
- editor: `bg-[var(--ux-editor-surface)]`;
- status bar: `h-7 border-t border-border/60 px-2 text-xs text-muted-foreground`.

Resize handles:

```txt
w-px shrink-0 cursor-col-resize bg-border/60 transition-colors hover:bg-ring/70
```

For easier grabbing without visual weight, wrap a thin visible line in a wider hit target:

```svelte
<div class="group w-2 cursor-col-resize" role="separator">
  <div class="mx-auto h-full w-px bg-border/50 group-hover:bg-ring/70"></div>
</div>
```

## Left Sidebar

Structure:

1. top nav/search/action block;
2. project/worktree section header;
3. scrollable list with stable gutter;
4. empty state.

Search button should be compact and field-like:

```txt
group relative flex h-7 w-full items-center rounded-md border border-sidebar-border/70 bg-sidebar-foreground/5 pl-7 pr-1.5 text-left text-[12px] font-medium text-sidebar-foreground/45 transition-colors hover:border-sidebar-border hover:bg-sidebar-foreground/8 hover:text-sidebar-foreground/60
```

Section header:

```txt
flex h-8 items-center gap-1 px-2 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground
```

List:

```txt
min-h-0 flex-1 overflow-y-auto px-2 pb-2 pt-1 scrollbar-sleek worktree-sidebar-scrollbar
```

Empty state:

- Keep compact.
- Use one icon at 28px max.
- Provide the next action.
- Avoid large marketing copy.

## Project Cards

Preferred hierarchy:

- project name and status indicators first;
- path metadata second;
- actions to the right;
- child worktrees nested under a quieter surface.

Outer surface:

```txt
overflow-hidden rounded-lg border border-sidebar-border/60 bg-sidebar-foreground/[0.025]
```

Expanded child area:

```txt
border-t border-sidebar-border/60 bg-background/35 py-1 pl-3 pr-1
```

Collapsed count:

```txt
px-2.5 pb-1.5 text-[10px] text-muted-foreground
```

Unread or dirty state:

- Use tiny dots/counters.
- Avoid turning the whole card red/amber.
- Keep status color localized.

## Right Panel

Use a quieter version of the sidebar:

- tabs at top with either segmented or line style;
- content scroll area with consistent padding;
- file tree and changes rows should use the same row recipe as project rows;
- no heavy cards around every panel section.

When content is data-dense, use row dividers over card grids.

## Terminal And Editor Shell

Terminal/editor controls should be stable and low-chrome.

Tab strip:

- explicit height, usually 32-36px;
- hide horizontal native scrollbar;
- use fade masks for overflow if implemented;
- active tab should use background lift and subtle border, not primary tint.

Pane title/toolbar:

- icon buttons 24-28px;
- muted labels, active pane slightly stronger;
- avoid saturated backgrounds over terminal content.

Editor/diff inline comments:

- use rounded 8px cards;
- border foreground mixed at 10-14%;
- shadow only enough to lift from editor surface;
- body text 13-13.5px with 1.45-1.5 line-height.

## Settings

Preferred structure:

- full content area overlays are acceptable when long-lived work surfaces stay mounted underneath;
- left settings nav `w-56` is fine;
- content max width should grow from current `max-w-2xl` to `max-w-3xl` or `max-w-4xl` for complex settings;
- section header should be clear and spacious;
- controls live in a soft body surface.

Settings nav item:

```txt
flex h-8 items-center gap-2 rounded-md px-2 text-left text-[13px] font-medium tracking-tight transition-colors
```

Active:

```txt
bg-accent text-accent-foreground
```

Content area:

```txt
scrollbar-sleek min-h-0 flex-1 overflow-y-auto px-8 py-7
```

Section body:

```txt
rounded-xl border border-border/50 bg-card/50 px-7 py-6 shadow-xs
```

Control rows:

- label left/top;
- description below label;
- control aligned right on wide screens;
- stack on narrow windows.

## Dialogs

Dialog content:

```txt
rounded-xl border border-border/70 bg-popover p-0 shadow-[0_16px_48px_rgb(0_0_0/0.18)]
```

Header:

```txt
border-b border-border/60 px-5 py-4
```

Body:

```txt
px-5 py-4
```

Footer:

```txt
border-t border-border/60 px-5 py-3
```

Keep destructive confirmations visually calm until the destructive action button.

## Command Palette

Use a focused elevated surface:

- max width 640-720px;
- rounded-xl;
- border subtle;
- search input no heavy border inside shell;
- rows 32-40px;
- keyboard shortcuts as tiny keycaps;
- selected row foreground-mixed hover/active.

## Onboarding Or Empty Views

Even for empty states, build the app experience first. Use:

- relevant icon or small visual;
- one short title;
- one concise description;
- one primary action and optional secondary action.

Avoid large hero/marketing composition inside the desktop tool.
