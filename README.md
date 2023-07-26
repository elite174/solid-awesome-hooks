# solid-awesome-hooks

[![version](https://img.shields.io/npm/v/solid-awesome-hooks?style=for-the-badge)](https://www.npmjs.com/package/solid-awesome-hooks)
![npm](https://img.shields.io/npm/dw/solid-awesome-hooks?style=for-the-badge)

🛠 A collection of useful hooks for solid-js 🛠

## Hook list

- [useClickOutside](#useClickOutside)
- [useModulePreloader](#useModulePreloader)
- [usePinchZoom](#usePinchZoom)
- [useSaveToStorage](#useSaveToStorage)

## useClickOutside

### Definition

```tsx
import { type Accessor, type Setter } from "solid-js";
export declare const useClickOutside: (
  /** Callback to run when click is outside target element */
  callback: (e: MouseEvent) => void,
  options?: {
    /** Boolean signal which will trigger listening to the click event */
    enabled: Accessor<boolean>;
  }
) => Setter<HTMLElement>;
```

### Example

```tsx
const [isListeningEnabled] = createSignal(true);

const setElementRef = useClickOutside((event) => console.log(`Clicked outside: ${e}`, {
    enabled: isListeningEnabled
})

// somewhere in JSX
<section ref={setElementRef}>
    Listen to click outside of this section
</section>
```

## useModulePreloader

This hook preloads modules imported with `lazy` when the browser is idle one by one.

### Definition

```tsx
import { lazy } from "solid-js";
/**
 * Preloads modules imported with `lazy` when the browser is idle one by one
 * @param lazyModules
 */
export declare const useModulePreloader: (
  lazyModules: Array<ReturnType<typeof lazy>>
) => void;
```

### Example

```tsx
import { lazy } from "solid-js";
import { useModulePreloader } from "solid-awesome-hooks";

const LazyPopoverContent = lazy(() => import("./PopoverContent"));

const Component = () => {
  /**
   * Sometimes it's useful to preload components
   * which are hidden from a user (e.g. date pickers, color pickers or some modal content).
   * At the same time we don't want to show suspense fallbacks for lazy components.
   * useModulePreloader hook can preload lazy modules when the browser is idle
   * and the user won't see any suspense fallbacks when the component renders.
   */
  useModulePreloader([LazyPopoverContent]);

  return (
    <Popover
      Content={
        <Suspense>
          <LazyPopoverContent />
        </Suspense>
      }
    />
  );
};
```

## usePinchZoom

This hook detects pinch zoom (with only 2 pointers) on the tracking html element. Under the hood it uses `touchmove` event.
The callbacks `onZoomIn` and `onZoomOut` are fired when `touchmove` event is fired.

### Definition

```tsx
import { type Setter } from "solid-js";

interface UsePinchZoomParams {
  /**
   * Callback to be called on zoom in
   * @param distanceGrowthPX - absolute distance growth between 2 pointers
   */
  onZoomIn?: (distanceGrowthPX: number) => void;
  /**
   * Callback to be called on zoom out
   * @param distanceGrowthPX - absolute distance growth between 2 pointers
   */
  onZoomOut?: (distanceGrowthPX: number) => void;
  options?: {
    /**
     * @default true
     */
    preventTouchMoveEvent?: boolean;
  };
}

export declare const usePinchZoom: ({
  onZoomIn,
  onZoomOut,
  options,
}: UsePinchZoomParams) => Setter<HTMLElement>;
```

### Example

```tsx
const setElementRef = usePinchZoom({
  onZoomIn: (distanceGrowth) => console.log(`onZoomIn: ${distanceGrowth}`),
  onZoomOut: (distanceGrowth) => console.log(`onZoomOut: ${distanceGrowth}`)
})

// somewhere in JSX
<section ref={setElementRef}>
    Listen to pinch zoom in this component
</section>
```

## useSaveToStorage

This hook will save serializable signal data to some storage (default is `localStorage`)

### Definition

```tsx
import { type Accessor } from "solid-js";
type Serializable = number | string | boolean | object;
type SaveToStorageOptions = {
  /** @default localStorage */
  storage?: Storage;
  /**
   * If set to true it will save the data when the browser is idle
   * @default true
   */
  deferred?: boolean;
};
/**
 *
 * @param key - key name in storage
 * @param data - Reactive accessor to the data
 * @param options
 */
export declare const useSaveToStorage: <T extends Serializable>(
  key: string,
  data: Accessor<T>,
  options?: SaveToStorageOptions
) => void;
```

### Example

```tsx
import { createSignal } from "solid-js";
import { useSaveToStorage } from "solid-awesome-hooks";

const Component = () => {
  const [dataToSave] = createSignal("data");

  useSaveToStorage("app:data", dataToSave);

  // ...
};
```
