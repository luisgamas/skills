# Before & After — Flutter Init Project

## Before (Default Flutter Project)

```
lib/
└── main.dart              ← Counter app boilerplate

test/
└── widget_test.dart       ← Default counter test

pubspec.yaml               ← Only flutter SDK dependency
```

## After (Initialized Baseline — Modular App)

```
lib/
├── config/
│   ├── constants/
│   │   └── environment.dart
│   ├── router/
│   │   └── app_router.dart
│   ├── theme/
│   │   ├── app_config.dart        ← Design tokens (spacing, radius, colors, shadows, durations, icon sizes)
│   │   └── app_theme.dart         ← Material 3 theme with ColorScheme.fromSeed
│   └── config.dart                ← Barrel: exports router + theme
│
├── modules/                       ← Feature modules (created as needed)
│   └── <feature_name>/
│       ├── domain/
│       │   ├── datasources/
│       │   ├── entities/
│       │   └── repositories/
│       ├── infrastructure/
│       │   ├── datasources/
│       │   ├── mappers/
│       │   ├── models/
│       │   └── repositories/
│       └── presentation/
│           ├── providers/
│           ├── screens/
│           └── widgets/
│
├── shared/
│   ├── exceptions/
│   │   └── exceptions.dart
│   ├── services/                  ← Cross-feature services (Dio, SharedPreferences, etc.)
│   └── widgets/
│       ├── views/
│       │   └── page_not_found_view.dart
│       └── widgets.dart           ← Barrel
│
└── main.dart                      ← Minimal: ProviderScope + MaterialApp.router

pubspec.yaml                       ← flutter_riverpod, go_router, google_fonts
```

## After (Initialized Baseline — Flat App)

For smaller apps that do not need feature modules:

```
lib/
├── config/
│   ├── constants/
│   │   └── environment.dart
│   ├── router/
│   │   └── app_router.dart
│   ├── theme/
│   │   ├── app_config.dart
│   │   └── app_theme.dart
│   └── config.dart
│
├── domain/
│   ├── datasources/
│   ├── entities/
│   └── repositories/
│
├── infrastructure/
│   ├── datasources/
│   ├── mappers/
│   ├── models/
│   └── repositories/
│
├── presentation/
│   ├── providers/
│   ├── screens/
│   └── widgets/
│
├── shared/
│   ├── exceptions/
│   ├── services/
│   └── widgets/
│
└── main.dart

pubspec.yaml
```
