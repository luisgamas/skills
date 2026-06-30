// Starter replacement/extension for a Svelte 5 desktop app design token module.
// Keep role-based tokens so density and polish can be adjusted centrally.

export const icon = {
  button: "size-3.5",
  nav: "size-4",
  decorative: "size-3",
  empty: "size-7",
} as const;

export const iconButton = {
  xs: "size-6",
  sm: "size-7",
  action: "size-6",
  toolbar: "size-8",
} as const;

export const text = {
  pageTitle: "font-title text-2xl font-semibold leading-tight",
  heading: "font-title text-sm font-semibold tracking-tight",
  subheading: "text-[13px] font-medium",
  title: "font-title text-[13px] font-medium tracking-tight",
  body: "text-xs",
  bodyStrong: "text-xs font-medium",
  meta: "text-[11px] leading-4 text-muted-foreground",
  menu: "text-xs",
  menuLabel: "text-[11px] font-medium text-muted-foreground",
  section: "text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground",
  indicator: "text-[10px]",
} as const;

export const surface = {
  shell: "bg-[var(--ux-shell)] text-foreground",
  sidebar: "bg-sidebar text-sidebar-foreground",
  panel: "bg-[var(--ux-panel)] text-foreground",
  panelMuted: "bg-[var(--ux-panel-muted)]",
  elevated: "border border-border/70 bg-[var(--ux-elevated)] shadow-md",
  active: "bg-[var(--ux-sidebar-accent)] text-sidebar-foreground ring-1 ring-inset ring-sidebar-border/80",
  activeNested: "bg-foreground/[0.055] text-foreground",
  tab: "bg-background text-foreground shadow-sm ring-1 ring-border/70",
} as const;

export const row = {
  sidebar:
    "group flex min-h-7 w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium tracking-tight transition-colors",
  sidebarInactive:
    "text-sidebar-foreground/60 hover:bg-foreground/[0.055] hover:text-sidebar-foreground dark:hover:bg-foreground/[0.065]",
  sidebarActive: "bg-[var(--ux-sidebar-accent)] text-sidebar-foreground",
  list:
    "group flex min-h-8 w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors",
  listInactive: "text-muted-foreground hover:bg-accent hover:text-foreground",
  listActive: "bg-accent text-accent-foreground",
} as const;

export const field = {
  input:
    "h-8 rounded-md border border-input bg-background px-2.5 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  search:
    "h-7 rounded-md border border-sidebar-border/70 bg-sidebar-foreground/5 pl-7 pr-2 text-[12px] font-medium text-sidebar-foreground/60 transition-colors hover:border-sidebar-border hover:bg-sidebar-foreground/8",
} as const;

export const panel = {
  settingsBody: "rounded-xl border border-border/50 bg-card/50 px-7 py-6 shadow-xs",
  sectionHeader: "flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5",
  card: "rounded-xl border border-border/50 bg-card shadow-xs",
  sidebarCard: "overflow-hidden rounded-lg border border-sidebar-border/60 bg-sidebar-foreground/[0.025]",
} as const;

export const focus = {
  ring: "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
} as const;
