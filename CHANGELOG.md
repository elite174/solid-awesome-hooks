# 1.9.0

- Added `withAction` function wrapper for `useVisibleState`
- Added `callLimit` option for `usePolling` hook which limits the number of calls
- Changed some param names for `usePolling`

# 1.8.0

- Added `useSyncState` hook
- Improved `useAbortController`: now there's no memory leak because onCleanup won't be registered without proper owner. Also you can pass optional fallback owner
- Improved `usePolling` hook: now you can pass an owner to the hook
- Changed function names for `useVisibleState` hook

# 1.7.0

- Added `usePolling` hook
- Improved `useAsyncAction` hook: now it's a promise which can return a value!
- Fixed types for `useClickOutside`

# 1.6.1

- Fixed types for `useSaveToStorage` (`null` and `undefined` are supported)

# 1.6.0

- added `useSortState`

# 1.5.0

- added `useScrollTo` hook
- `useAsyncAction`: action now exposes `setErrorMessage` function
- `useContextString`: fixed types

# 1.4.0

- added `useVisibleState` hook

# 1.3.2

- Reworked `useAsyncAction` hook. Added support for `finally` block.

# 1.3.1

- added `clearOnEmpty` option for `useSaveToStorage`

# 1.3.0

## BREAKING CHANGES

- `useSaveToStorage`: `isDeferred` option changed to `saveWhenIdle`, also added `defer` option

## New hooks

- useAbortController
- useAsyncAction
- useContextStrict

# 1.2.0

- NEW useModulePreloader
- NEW useSaveToStorage

# 1.1.0

- Added usePinchZoom

# 1.0.1

- Added useClickOutside
