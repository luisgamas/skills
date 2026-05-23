# Custom Codex Skills

This repository contains a curated set of custom Codex skills designed around my own working preferences, architectural standards, and implementation ideals.

These skills are not generic prompt snippets. Each one is structured as a reusable skill with:

- a focused `SKILL.md`
- machine-readable UI metadata in `agents/openai.yaml`
- domain references in `references/`
- reusable assets when applicable in `assets/`
- helper scripts when automation or auditing is useful in `scripts/`

## Included Skills

### Flutter

- `flutter-clean-arch-architect`
  Designs and refactors Flutter features using strict Clean Architecture with `domain`, `infrastructure`, and `presentation` layers, manual Riverpod dependency injection, offline-first repositories, and Isar-friendly entities.

- `flutter-init-project`
  Bootstraps a Flutter project into a production-ready baseline with Clean Architecture scaffolding, manual Riverpod, GoRouter, Material 3, and reusable bootstrap assets.

- `flutter-material3-uiux-expert`
  Focuses on adaptive Flutter UI implementation with Material Design 3, token-driven styling, responsive layouts, accessibility constraints, and UI auditing support.

- `flutter-riverpod-expert`
  Covers modern Riverpod usage, migration from legacy patterns, notifier-based state management, dependency injection, rebuild optimization, and advanced Riverpod features.

### Odoo

- `odoo-modules-creator`
  Creates and extends Odoo 18 addons using the ORM, views, manifests, security, controllers, wizards, reports, and safe modular extension patterns.

## Repository Structure

Each skill follows the same high-level layout:

```text
skill-name/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── core/
│   └── examples/
├── assets/        # optional
└── scripts/       # optional
```

## Design Principles

These skills were built with a few strong principles in mind:

- preserve high-signal technical guidance
- prefer explicit workflows over vague prompting
- keep architecture and implementation rules enforceable
- separate core instructions from detailed references
- keep reusable templates and scripts close to the skill that needs them
- optimize for real execution, not just description

## Notes

- The skills are intentionally opinionated.
- The architecture and conventions reflect my own standards rather than a generic or framework-neutral style.
- The repository is organized for maintainability and direct reuse in Codex-compatible skill environments.

## GitHub Repository Metadata

Use the following values in the GitHub repository settings to make the project easier to find and understand:

- Description: `Custom Codex skills for Flutter, Riverpod, Material 3, and Odoo, structured from real-world project patterns.`
- Website: leave empty unless you publish a separate docs site.
- Topics:
  - `codex`
  - `skills`
  - `flutter`
  - `riverpod`
  - `material-design-3`
  - `odoo`
  - `ai`
  - `developer-tools`
  - `open-source`

These topics are intentionally broad enough to describe the repository without exposing private project details.

---

## ❤️ Support

If you find these skills useful, consider supporting their maintenance:

<div align="center">
  <a href="https://www.buymeacoffee.com/luisgamas" style="margin: 0 15px;">
    <img src="https://raw.githubusercontent.com/LuisGamas/buttons-design/main/buy_me_a_coffe/buy_me_a_coffe_fill.png" width="220" alt="Buy Me a Coffee" />
  </a>
  <a href="https://www.paypal.com/donate/?hosted_button_id=NYCR5M6QHZ7JC" style="margin: 0 15px;">
    <img src="https://raw.githubusercontent.com/LuisGamas/buttons-design/main/paypal/paypal_fill.png" width="220" alt="Donate via PayPal" />
  </a>
  <a href="https://github.com/sponsors/LuisGamas" style="margin: 0 15px;">
    <img src="https://raw.githubusercontent.com/LuisGamas/buttons-design/main/github_sponsor/github_sponsor_fill.png" width="220" alt="Sponsor on GitHub" />
  </a>
</div>
