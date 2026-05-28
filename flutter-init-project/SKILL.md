---
name: flutter-init-project
description: >-
  Initialize or reset a Flutter project into a production-ready baseline
  aligned with this repository's real Flutter projects: manual Riverpod setup,
  GoRouter routing, Material 3 configuration, shared services, shared widgets,
  design tokens, and either modular `lib/modules/` scaffolding or a simpler
  root-level `domain/infrastructure/presentation` structure when the app does
  not need feature modules. Use when bootstrapping a new project, replacing the
  default counter app, or standardizing an app foundation before feature
  development.
---

# Flutter Init Project

Turn a raw Flutter app into a repeatable project foundation that is aligned with your architectural preferences.

## Skill Profile

- Architecture target: Clean Architecture foundation
- State management target: manual Riverpod without code generation
- Navigation target: GoRouter
- UI target: Material 3 with centralized tokens
- Main entry philosophy: minimal `main.dart`
- Project style options:
  - modular apps with `lib/modules/`
  - simpler apps with root `lib/domain`, `lib/infrastructure`, `lib/presentation`
- Dependency policy preserved from previous iteration: `flutter_riverpod`, `go_router`, `google_fonts`
- Skill version preserved from previous iteration: `2.1.0`

## Required Resource Map

Read these reference files before editing project files:

1. [`references/core/rules.md`](references/core/rules.md)
   Use for architectural constraints, dependency limits, and cleanup rules.
2. [`references/core/specs.md`](references/core/specs.md)
   Use for the target directory tree and design-token schema.
3. [`references/examples/before-after.md`](references/examples/before-after.md)
   Use to see the expected transformation from default Flutter project to initialized baseline.

Use these template assets as the canonical bootstrap base:

- [`assets/bootstrap-template/pubspec.yaml`](assets/bootstrap-template/pubspec.yaml)
- [`assets/bootstrap-template/lib/config/theme/app_config.dart`](assets/bootstrap-template/lib/config/theme/app_config.dart)
- [`assets/bootstrap-template/lib/config/theme/app_theme.dart`](assets/bootstrap-template/lib/config/theme/app_theme.dart)
- [`assets/bootstrap-template/lib/config/router/app_router.dart`](assets/bootstrap-template/lib/config/router/app_router.dart)
- [`assets/bootstrap-template/lib/config/config.dart`](assets/bootstrap-template/lib/config/config.dart)
- [`assets/bootstrap-template/lib/main.dart`](assets/bootstrap-template/lib/main.dart)

## Operating Procedure

### 1. Environment Verification
- Confirm you are at the root of a Flutter project.
- Check the current `pubspec.yaml` state.

### 2. Normalize Dependencies
- Apply the baseline dependency set from [`assets/bootstrap-template/pubspec.yaml`](assets/bootstrap-template/pubspec.yaml).
- Run `flutter pub get` immediately to sync the project.

### 3. Remove Starter Boilerplate
- Delete `lib/main.dart` content.
- Delete `test/widget_test.dart` (or refactor it if it's strictly required).

### 4. Scaffold the Project Structure
- Create the folder structure as defined in [`references/core/specs.md`](references/core/specs.md).
- Choose the structure intentionally:
  - modular apps: `lib/modules/<feature_name>/...`
  - simpler apps: root `lib/domain`, `lib/infrastructure`, `lib/presentation`

### 5. Generate Configuration
- **Design Tokens**: Generate `lib/config/theme/app_config.dart` (refer to [`assets/bootstrap-template/lib/config/theme/app_config.dart`](assets/bootstrap-template/lib/config/theme/app_config.dart)).
- **App Theme**: Generate `lib/config/theme/app_theme.dart` (refer to [`assets/bootstrap-template/lib/config/theme/app_theme.dart`](assets/bootstrap-template/lib/config/theme/app_theme.dart)).
- **App Router**: Generate `lib/config/router/app_router.dart` (refer to [`assets/bootstrap-template/lib/config/router/app_router.dart`](assets/bootstrap-template/lib/config/router/app_router.dart)).
- **Router Bridge**: If auth-driven redirects are needed, add a dedicated router notifier/provider instead of pushing redirect logic into widgets.
- **Barrel Files**: Create `lib/config/config.dart` to export the theme and router modules.

### 6. Rebuild the App Entry Point
- Generate the new `lib/main.dart` connecting `ProviderScope` and `MaterialApp.router` (refer to [`assets/bootstrap-template/lib/main.dart`](assets/bootstrap-template/lib/main.dart)).

### 7. Validate the Baseline
- Run `flutter analyze` to ensure no syntax or import errors exist.
- Verify that basic routing (initial location) is functional.

## Non-Negotiable Rules

- Do not introduce Riverpod code generation packages for this bootstrap skill.
- Keep routing logic out of `main.dart`.
- Keep theming logic out of `main.dart`.
- Use tokenized spacing, radius, colors, shadows, durations, and icon sizes instead of magic numbers.
- Create the `lib/config/config.dart` barrel and ensure it exports theme and router modules.
- Use `ThemeData(useMaterial3: true)`.
- Do not force `lib/modules/` into small projects that are clearer with a flatter root architecture.

## Output Expectations

When using this skill, deliver a foundation that is ready for later feature modules:

- `lib/config/` exists and is coherent.
- Either `lib/modules/` exists for modular apps or a flat root architecture exists for small apps.
- `lib/shared/` exists for reusable cross-feature code.
- The entry point is minimal and maintainable.
- The project no longer contains the default Flutter starter structure.
