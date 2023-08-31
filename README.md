# solid-awesome-hooks

[![version](https://img.shields.io/npm/v/solid-awesome-hooks?style=for-the-badge)](https://www.npmjs.com/package/solid-awesome-hooks)
![npm](https://img.shields.io/npm/dw/solid-awesome-hooks?style=for-the-badge)

🛠 A collection of useful hooks for solid-js 🛠

## Hook list

- [useAbortController](#useAbortController)
- [useAsyncAction](#useAsyncAction)
- [useClickOutside](#useClickOutside)
- [useContextStrict](#useContextStrict)
- [useModulePreloader](#useModulePreloader)
- [usePinchZoom](#usePinchZoom)
- [useSaveToStorage](#useSaveToStorage)

## useAbortController

### Definition

```tsx
/**
 * Returns AbortController instance
 * Can be useful inside createResource
 * @param reason - reason for abort on scope cleanup
 */
export declare const useAbortController: (reason?: any) => AbortController;
```

### Example

```tsx
import { onMount } from "solid-js";
import { useAbortController } from "solid-awesome-hooks";

const Component = () => {
  onMount(() => {
    // The controller will call `abort` on cleanup
    const controller = useAbortController();

    fetch("some api endpont", { signal: controller.signal });
  });

  return null;
};
```

## useAsyncAction

### Definition

```tsx
import { type Accessor, type Setter } from "solid-js";

type ActionError = {
  message?: string;
};

type TryAction = (
  action: () => Promise<void>,
  onError?: (e: unknown) => void
) => Promise<void>;

export type AsyncAction = {
  /** Pass an async function here */
  try: TryAction;
  state: {
    /** Is async action in progress */
    isInProgress: Accessor<boolean>;
    error: Accessor<ActionError | null>;
  };
  setErrorMessage: Setter<string | undefined>;
  /** Resets progress, error states and error message */
  reset: VoidFunction;
};

export declare const useAsyncAction: () => AsyncAction;
```

### Example

```tsx
import { Show } from "solid-js";
import { useAsyncAction } from "solid-awesome-hooks";

const Component = () => {
  const action = useAsyncAction();

  const handleClick = async () => {
    action.try(
      async () => {
        const data = await someFetch();

        // handle ssomthing with data
      },
      (error) => action.setErrorMessage("Fetch failed")
    );
  };

  return (
    <section>
      <button onClick={handleClick} disabled={action.state.isInProgress()}>
        click
      </button>
      <button onClick={action.reset} disabled={!action.state.error()}>
        ResetError
      </button>
      <Show when={action.state.error()?.message}>
        {(errorMessage) => <p>{errorMessage()}</p>}
      </Show>
    </section>
  );
};
```

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

## useContextStrict

### Definition

```tsx
import { type Context } from "solid-js";
/**
 * Same as solid's useContext, but it throws an error if there's no context value
 * @param context
 * @param errorMessage
 */
export declare const useContextStrict: <T>(
  context: Context<T>,
  errorMessage?: string
) => T;
```

### Example

```tsx
import { createContext } from "solid-js";
import { useContextStrict } from "solid-awesome-hooks";

type ContextType = {
  text: string;
};

const SomeContext = createContext<ContextType>();

const SomeService = (props) => (
  <SomeContext.Provider value={{ text: "Some text" }}>
    {props.children}
  </SomeContext.Provider>
);

// ... somewhere in the component

const Component = () => {
  // No TS error!
  const { text } = useContextStrict(SomeContext);

  // ...
};
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
    saveWhenIdle?: boolean;
    /**
     * If set to true it will save the data only after first change
     * (it passed to solid's `on` `defer` option)
     * @default true
     */
    defer?: boolean;
    /**
     * If set to true it will remove the key from storage if the data is null or undefined
     * @default false
     */
    clearOnEmpty?: boolean;
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
