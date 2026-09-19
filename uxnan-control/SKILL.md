---
name: uxnan-control
description: Operate a running Uxnan Desktop from a shell or from an agent through its control surface — the `uxnan-cli` console client and the MCP tools Uxnan injects into the agents it launches. Use to read the projects, worktrees, terminals, agents and orchestration runs Uxnan holds, to show the person a file or a diff, to bring the window forward, and to drive the integrated browser, with stable `--json` output and documented exit codes. Selectors (`current`, `id:`, `path:`, `branch:`, `name:`) name things without copying ids.
---

# Uxnan control surface

## Purpose

Use this skill when **Uxnan Desktop** is running on the machine and you need to
read or operate it: which projects and worktrees it holds, which terminals are
open and which agents run in them (and their live state), what an orchestration
run captured; or to show the person a file or a diff, focus the window, or
preview a page in the integrated browser.

If Uxnan launched you, you already have these entries as **MCP tools**
(`uxnan_status`, `project_list`, `worktree_show`, `terminal_list`, `file_diff`,
`browser_open`, …) — call `uxnan_status` first and skip the CLI. This skill is
for the other case: you run in a shell Uxnan did not launch, or you have no
MCP, and you reach the app through **`uxnan-cli`**. Both are one catalog: an
MCP tool `worktree_list` and `uxnan-cli worktree ls` are the same entry.

## First Reads

Load only what the task needs:

- For every entry with its arguments and result, and the capability groups:
  read `references/catalog.md` (generated from the app's own catalog — it
  cannot describe something the app does not do).
- For calling the app **without** the CLI (a script in any language: discovery
  file, JSON-RPC envelope, headers, error codes): read `references/protocol.md`.
- For recipes — show the person a diff, find your own worktree, tell which agents
  are busy, handle a missing app: read `references/workflows.md`.

## Commands

```
uxnan-cli status
uxnan-cli project ls | show <project>
uxnan-cli worktree ls [--project <project>] | show <worktree>
uxnan-cli terminal ls [--worktree <worktree>] | show <terminal> | reveal <terminal>
uxnan-cli agent ls
uxnan-cli run ls | show <run-id>
uxnan-cli app focus
uxnan-cli file open <path> [--worktree <worktree>]
uxnan-cli file diff <path> [--worktree <worktree>] [--staged]
uxnan-cli browser open <url> | navigate <url> | reload | back | forward | status
uxnan-cli rpc <method> [--params '<json>']      # any catalog entry, raw
uxnan-cli skills get control [--full]           # this guide / the catalog reference
Global: --json (stable machine output), --timeout <seconds>
```

## Selectors

- `current` — your own terminal, and from it your worktree and project. Works
  inside a terminal Uxnan launched (it knows `UXNAN_AGENT_ID`); from another
  shell, use an explicit form.
- `id:<id>` — a project id or a terminal id (from `ls`).
- `path:<absolute path>` — a project or worktree folder. A bare absolute path is
  accepted too.
- `branch:<name>` — a worktree by its branch.
- `name:<project name>` — a project by its name (must be unique).

A bare word is refused, not guessed: a branch and a project name can collide.

## Rules

- Prefer `--json`; parse the result object, never the human text. Fields may be
  added over time, never renamed or removed without a protocol bump.
- Branch on the **exit status**, not on the message:

  | Exit | Meaning |
  |---|---|
  | 0 | success |
  | 1 | the app failed while carrying the request out |
  | 2 | usage: unknown method, bad or missing argument, malformed selector |
  | 3 | Uxnan Desktop is not running, or its window did not answer |
  | 4 | the app and the CLI speak different protocol versions (or the app predates the control surface) |
  | 5 | denied: the capability group is switched off, or the token was refused |
  | 6 | timed out |
  | 7 | the selector named nothing |
  | 8 | the target is busy |

- Never pass long content as an argument; today no entry takes free text into a
  terminal, and the ones that will (the `converse` group) take a file.
- `current` only means something inside a terminal Uxnan launched. Elsewhere,
  list first (`project ls --json`, `worktree ls --json`, `terminal ls --json`)
  and use `id:` / `path:` / `branch:` / `name:`.
- On exit 3 or 4, say so and stop; do not try to reach the app another way. The
  surface has no shell, no raw terminal input, no destructive git or filesystem
  entry — by construction, not by convention.
- The token is never printed and never needs to be handled: the CLI finds it
  (the environment inside a Uxnan terminal; a private `control.json` elsewhere).

## Capability groups

`read` and `ui` ship today; `create` (worktrees, terminals, saved runs),
`converse` (send a message to an agent, wait for its state, read its screen) and
`orchestrate` (tasks, inbox, questions) follow. `uxnan-cli status --json` says
which groups the running app has enabled — check it before assuming an entry.
