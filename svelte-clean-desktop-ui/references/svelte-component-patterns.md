# Svelte Component Patterns

## General Rules

- Preserve existing public component APIs unless the task explicitly includes migration.
- Use `$props`, `$bindable`, `$derived`, and snippets consistently with current Svelte 5 code.
- Use `cn` from `$lib/utils`.
- Use `tailwind-variants` for primitives with variants and sizes.
- Keep shadcn-svelte/Bits UI compatibility. Do not introduce React Radix.

## Button Primitive

Target feel:

- compact, rounded-md, crisp focus ring;
- default command button is dark/primary;
- outline button has subtle background and hover border, not a heavy box;
- ghost button has no visible chrome until hover;
- icon buttons are stable squares.

Recommended class direction:

```ts
base: "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
```

Recommended variants:

- `default`: `bg-primary text-primary-foreground hover:bg-primary/90`
- `outline`: `border border-border bg-background text-foreground shadow-xs hover:border-muted-foreground/35 hover:bg-accent`
- `secondary`: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- `ghost`: `text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:bg-accent/50`
- `destructive`: `text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/20`
- `link`: `text-primary underline-offset-4 hover:underline`

Recommended sizes:

- `xs`: `h-6 px-2 text-xs`, icon 12px.
- `sm`: `h-8 px-3`, icon 14px.
- `default`: `h-9 px-4`.
- `icon-xs`: `size-6`, icon 12px.
- `icon-sm`: `size-8`, icon 14-16px.
- `icon`: `size-9`, icon 16px.

## Card Primitive

Default cards should be less mechanical than a full ring:

```txt
flex flex-col gap-5 rounded-xl border border-border/50 bg-card py-5 text-card-foreground shadow-xs
```

Use smaller dense cards:

```txt
gap-3 rounded-lg py-3
```

Do not use cards to frame entire page sections unless the section is a contained tool. Settings body surfaces can be rounded bordered bands, but avoid cards inside those bands.

## Sidebar Row

Use for navigation, project rows, worktree rows, settings nav:

```txt
group flex min-h-7 w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium tracking-tight transition-colors
```

Inactive:

```txt
text-sidebar-foreground/60 hover:bg-foreground/[0.055] hover:text-sidebar-foreground
```

Active:

```txt
bg-[var(--ux-sidebar-accent)] text-sidebar-foreground
```

Icon:

```txt
size-4 shrink-0 text-sidebar-foreground/35 group-hover:text-sidebar-foreground/55
```

Active icon:

```txt
text-sidebar-foreground
```

## Project / Worktree Card

Use a row-card hybrid. It should read like a selectable item in a sidebar, not a floating marketing card.

Outer:

```txt
overflow-hidden rounded-lg border border-sidebar-border/60 bg-sidebar-foreground/[0.025] transition-colors
```

Header:

```txt
group flex min-h-11 items-center gap-1.5 px-2 py-1.5 transition-colors hover:bg-foreground/[0.045]
```

Active:

```txt
bg-[var(--ux-sidebar-accent)] ring-1 ring-inset ring-sidebar-border/80
```

Actions:

- keep primary contextual action visible if needed;
- reveal secondary actions on pointer hover with `opacity-0 can-hover:group-hover:opacity-100` only if the `can-hover` variant exists;
- otherwise use `opacity-60 hover:opacity-100`.

Metadata:

```txt
truncate text-[11px] leading-4 text-muted-foreground
```

## Settings Section Component

When refactoring settings, create a reusable section wrapper similar to:

```svelte
<section class={cn("scroll-mt-8 space-y-6", className)}>
  <div class="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5">
    <div class="min-w-0 space-y-2">
      <h2 class="text-2xl font-semibold leading-tight text-foreground">{title}</h2>
      <p class="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    {#if headerAction}{@render headerAction()}{/if}
  </div>
  <div class="rounded-xl border border-border/50 bg-card/50 px-7 py-6 shadow-xs">
    {@render children?.()}
  </div>
</section>
```

Settings rows:

```txt
grid gap-1.5 py-3 first:pt-0 last:pb-0
```

Settings row with action/control:

```txt
grid gap-3 py-3 md:grid-cols-[1fr_auto] md:items-center
```

Use dividers between rows for dense sections:

```txt
divide-y divide-border/60
```

## Tabs

Segmented tabs:

- list: `inline-flex h-9 w-fit items-center rounded-lg bg-muted p-[3px] text-muted-foreground`
- trigger: `inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-foreground/60 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm`

Line tabs:

- use transparent list;
- active trigger gets a 2px underline, not a filled pill.

## Menus And Popovers

Content:

```txt
z-50 min-w-40 overflow-hidden rounded-lg border border-border/70 bg-popover p-1 text-popover-foreground shadow-md
```

Item:

```txt
relative flex min-h-7 cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50
```

Label:

```txt
px-2 py-1.5 text-[11px] font-medium text-muted-foreground
```

Separator:

```txt
-mx-1 my-1 h-px bg-border/70
```

## Inputs And Selects

Input:

```txt
h-8 rounded-md border border-input bg-background px-2.5 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
```

Search:

```txt
h-7 rounded-md border border-sidebar-border/70 bg-sidebar-foreground/5 pl-7 pr-2 text-[12px] font-medium text-sidebar-foreground/60
```

Select trigger:

```txt
h-8 rounded-md border border-input bg-background px-2.5 text-sm shadow-xs hover:bg-accent focus:ring-[3px] focus:ring-ring/50
```

