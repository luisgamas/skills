# Architecture & Design Patterns — Riverpod 3.x

## 1. Injection Chain (Repository Pattern)

Implement the following flow for all features, but keep local and remote concerns separable when the project already does so:

```text
SERVICES (shared/services/)
    ↓ Provider<T> (Dio, SharedPreferences, Isar)
DATASOURCE (infrastructure/)
    ↓ ref.watch() injects services
REPOSITORY (infrastructure/)
    ↓ ref.watch() injects datasources
NOTIFIER (presentation/)
    ↓ ref.read() injects repositories (in mutation methods)
    ↓ ref.watch() injects repositories (in build method)
UI WIDGET (presentation/screens/)
    ↓ ref.watch() observes notifiers
```

Common real-world variants from the reference projects:

```text
StreamProvider<User?> → AuthStateNotifier
StreamProvider<User?> → GoRouter ChangeNotifier bridge
RepositoryProvider → AuthOperationsNotifier
RepositoryProvider → AsyncNotifier.family for remote collections
LocalStorageRepositoryProvider → local persistence providers
```

---

## 2. Widget Type Selection

| Widget Type | Use Case |
|---|---|
| `ConsumerWidget` | **Default.** Pure UI, no internal state, no controllers. |
| `ConsumerStatefulWidget` | Use ONLY for: `TextEditingController`, `ScrollController`, `AnimationController`, `FocusNode`, `initState/dispose` lifecycle. |

---

## 3. Notifier Mutability Pattern

Always use **Immutable State** with `AsyncValue.guard()` for async operations:

```dart
class MyNotifier extends AsyncNotifier<T> {
  @override
  Future<T> build() async => ref.watch(repoProvider).fetch();

  Future<void> update() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(repoProvider).update();
      return await ref.read(repoProvider).fetch();
    });
  }
}
```

---

## 4. Personal Riverpod Structure

Prefer splitting providers by responsibility:

- datasource providers
- repository providers
- auth stream or status providers
- operation providers
- state synchronization providers
- form providers
- router bridge providers

Do not force everything into one notifier if the feature becomes less understandable.

---

## 5. Router Bridge Pattern

When route refresh must follow auth changes immediately, a dedicated `ChangeNotifier` bridge is acceptable:

```dart
class GoRouterNotifier extends ChangeNotifier {
  final Ref ref;

  GoRouterNotifier(this.ref) {
    ref.listen(authStateStreamProvider, (previous, next) {
      notifyListeners();
    }, fireImmediately: true);
  }
}
```

Use this only for framework interoperability such as `GoRouter.refreshListenable`, not as a general application state pattern.

---

## 6. Testing (Riverpod 3.0)

### Unit Tests — ProviderContainer.test()

Always use `ProviderContainer.test()` for unit tests. It handles disposal automatically at the end of the test.

```dart
test('fetches products from repository', () async {
  final container = ProviderContainer.test(
    overrides: [
      productRepositoryProvider.overrideWithValue(MockProductRepository()),
    ],
  );

  final repo = container.read(productRepositoryProvider);
  expect(repo, isA<MockProductRepository>());

  final products = await container.read(productListProvider.future);
  expect(products, isNotEmpty);
});
```

### Testing AsyncNotifier State Transitions

Verify the full lifecycle: `AsyncLoading` → `AsyncData` or `AsyncError`.

```dart
test('notifier transitions from loading to data', () async {
  final container = ProviderContainer.test(
    overrides: [
      productRepositoryProvider.overrideWithValue(MockProductRepository()),
    ],
  );

  final states = <AsyncValue<List<ProductEntity>>>[];
  container.listen(
    productNotifierProvider,
    (prev, next) => states.add(next),
    fireImmediately: true,
  );

  await container.read(productNotifierProvider.future);

  expect(states.first, isA<AsyncLoading<List<ProductEntity>>>());
  expect(states.last, isA<AsyncData<List<ProductEntity>>>());
});
```

### Testing Notifier Mutations

```dart
test('deleteProduct removes item from state', () async {
  final container = ProviderContainer.test(
    overrides: [
      productRepositoryProvider.overrideWithValue(MockProductRepository()),
    ],
  );

  await container.read(productNotifierProvider.future);
  await container.read(productNotifierProvider.notifier).deleteProduct('id-1');

  final result = container.read(productNotifierProvider).requireValue;
  expect(result.any((p) => p.id == 'id-1'), isFalse);
});
```

### Testing Error States

```dart
test('notifier surfaces repository errors as AsyncError', () async {
  final container = ProviderContainer.test(
    overrides: [
      productRepositoryProvider.overrideWithValue(FailingProductRepository()),
    ],
  );

  final states = <AsyncValue<List<ProductEntity>>>[];
  container.listen(
    productNotifierProvider,
    (prev, next) => states.add(next),
    fireImmediately: true,
  );

  await expectLater(
    container.read(productNotifierProvider.future),
    throwsA(isA<Exception>()),
  );

  expect(states.last, isA<AsyncError<List<ProductEntity>>>());
});
```

### Partial Notifier Overrides — overrideWithBuild

Mock only the initialization (build) while keeping the original mutation methods intact for integration-style tests.

```dart
final container = ProviderContainer.test(
  overrides: [
    productNotifierProvider.overrideWithBuild(
      (ref, notifier) => [ProductEntity(id: '1', name: 'Mocked')],
    ),
  ],
);

// notifier.deleteProduct() still runs real logic against the mocked initial state
await container.read(productNotifierProvider.notifier).deleteProduct('1');
```

### Widget Tests

```dart
testWidgets('shows product list', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        productRepositoryProvider.overrideWithValue(MockProductRepository()),
      ],
      child: const MaterialApp(home: ProductsScreen()),
    ),
  );

  await tester.pumpAndSettle();
  expect(find.text('Product 1'), findsOneWidget);
});
```

Access the container directly when needed:

```dart
final container = tester.container;
```

### Mock Repository Pattern

Use abstract repository classes from the domain layer as the mock contract:

```dart
class MockProductRepository implements ProductRepository {
  @override
  Future<List<ProductEntity>> fetchAll() async => [
    ProductEntity(id: '1', name: 'Product 1', price: 99.0),
  ];

  @override
  Future<void> delete(String id) async {}
}

class FailingProductRepository implements ProductRepository {
  @override
  Future<List<ProductEntity>> fetchAll() async => throw Exception('Network error');

  @override
  Future<void> delete(String id) async => throw Exception('Network error');
}
