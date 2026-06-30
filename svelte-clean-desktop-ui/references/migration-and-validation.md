# Migration And Validation

## Recommended Redesign Sequence

### Phase 1: Foundations

1. Update `src/app.css` with expanded surface variables, font stack, `can-hover` variant, and improved scrollbars.
2. Update `src/lib/design.ts` with role tokens for panels, rows, controls, focus, and elevation.
3. Align primitive components:
   - `ui/button/button.svelte`
   - `ui/card/card.svelte`
   - `ui/input/input.svelte`
   - `ui/select/select-trigger.svelte`
   - `ui/tabs/*`
   - `ui/dropdown-menu/*`
   - `ui/dialog/*`
   - `ui/popover/*`

### Phase 2: High-Impact Screens

1. `LeftSidebar.svelte`
2. `ProjectCard.svelte`
3. `WorktreeRow.svelte`
4. `AgentSpace.svelte`
5. `RightPanel.svelte`
6. `TerminalArea.svelte` and tab chrome
7. `Settings.svelte` section shell and rows

### Phase 3: Dense Surfaces

1. File tree.
2. Changes panel.
3. Diff view and inline comments.
4. Browser panel toolbar.
5. Orchestration console.
6. Dialogs and command palette.

## Safety Rules

- Do not rewrite app state while styling.
- Do not change keyboard shortcuts or command behavior unless requested.
- Do not introduce React dependencies.
- Do not replace Bits UI with Radix UI.
- Do not remove accessibility attributes.
- Do not hide actions that are needed on touch devices.
- Do not use one-off colors when a token exists.

## Code Review Checklist

For each changed component:

- Is the component still keyboard accessible?
- Does focus-visible render clearly?
- Are disabled states non-interactive and visibly muted?
- Do all labels and paths truncate correctly with `min-w-0`?
- Does resizing sidebars preserve layout?
- Does the component work in dark and light themes?
- Are hover and active states subtle but discoverable?
- Are icons sized by role?
- Are destructive actions localized to text/icon/button color?
- Did the change avoid card-in-card layouts?

## Visual QA Checklist

Inspect at these widths when possible:

- 1280x800 desktop baseline.
- 1440x900 comfortable desktop.
- Narrow left sidebar at min width.
- Right/browser sidebars open simultaneously.
- Settings screen at normal and narrow widths.

Check states:

- empty sidebar;
- many projects;
- expanded project with child worktrees;
- active project plus unread/dirty status;
- long repo names and long paths;
- terminal tabs overflow;
- settings nav active state;
- open dropdown/select/popover/dialog;
- light and dark mode.

## Test Commands

Use the target project's equivalent commands. Common Svelte desktop commands:

```powershell
npm run check
npm run test
npm run dev
```

Run `npm run test` when behavior or state-dependent rendering changes. For pure class/token changes, `npm run check` plus visual inspection is usually enough.

## Acceptance Criteria

The redesign is acceptable when:

- the app feels like one coherent desktop product rather than generated shadcn defaults;
- the left sidebar has a quiet neutral texture with clear hierarchy;
- active and hover states are visible without loud tinting;
- settings feel structured and professional;
- primitive controls feel consistent across screens;
- dense work surfaces remain efficient;
- there is no text overlap, clipping, or layout shift during hover/state changes;
- no interaction behavior regresses.
