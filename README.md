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
- [useScrollTo](#useScrollTo)
- [useVisibleState](#useVisibleState)

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

type ActionState = "pending" | "resolved" | "errored" | "ready";

type TryAction = (
  action: () => Promise<void>,
  options?: {
    catchHandler?: (e: unknown) => unknown | Promise<unknown>;
    finallyHandler?: () => unknown | Promise<unknown>;
  }
) => Promise<void>;

export type AsyncAction = {
  /** Pass an async function here */
  try: TryAction;
  state: Accessor<ActionState>;
  errorMessage: Accessor<string | undefined>;
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

        if (Math.random() > 0.5) throw new Error();

        // handle ssomthing with data
      },
      {
        catchHandler: (error) => action.setErrorMessage("Fetch failed"),
        finallyHandler: () => console.log("log from `finally` block!"),
      }
    );
  };

  return (
    <section>
      <button onClick={handleClick} disabled={action.state() === "pending"}>
        click
      </button>
      <button onClick={action.reset} disabled={action.state() !== "errored"}>
        ResetError
      </button>
      <Show when={action.errorMessage()}>{(errorMessage) => <p>{errorMessage()}</p>}</Show>
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
export declare const useContextStrict: <T>(context: Context<T>, errorMessage?: string) => NonNullable<T>;
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
  <SomeContext.Provider value={{ text: "Some text" }}>{props.children}</SomeContext.Provider>
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
export declare const useModulePreloader: (lazyModules: Array<ReturnType<typeof lazy>>) => void;
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

export declare const usePinchZoom: ({ onZoomIn, onZoomOut, options }: UsePinchZoomParams) => Setter<HTMLElement>;
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

## useScrollTo

This hook comes in handy when you need to scroll some element on some trigger

### Definition

```tsx
import { type Accessor } from "solid-js";

interface Params extends ScrollOptions, ScrollToOptions {
  scrollTrigger: Accessor<unknown>;
  /**
   * if set to true scrolling will be skipped on initial rendering
   * @default true
   */
  defer?: boolean;
}

export declare const useScrollTo: <T extends HTMLElement>(params: Params) => import("solid-js").Setter<T>;
```

### Example

```tsx
import { useScrollTo } from "solid-awesome-hooks";

const Component = () => {
  // Get search params from the router
  const [searchParams] = useSearchParams();

  // scroll page content to the top when changing videos page
  const setScrollableElement = useScrollTo({
    scrollTrigger: () => searchParams.page,
    behavior: "smooth",
    top: 0,
  });

  return <div ref={setScrollableElement}>{/** Some content here */}</div>;
};
```

## useVisibleState

This hook is useful when you work with dropdowns or popovers. These things might be controlled by boolean state, so you don't need to write it every time.

### Definition

```tsx
export declare const useVisibleState: (initialState?: boolean) => {
  isOpened: import("solid-js").Accessor<boolean>;
  setOpened: import("solid-js").Setter<boolean>;
  hide: () => false;
  reveal: () => true;
};
```

### Example

```tsx
import { Popover } from "some-lib";
import { useVisibleState } from "solid-awesome-hooks";

const Component = () => {
  const popover = useVisibleState();

  return (
    <Popover
      open={popover.isOpen()}
      onOpenChange={popover.setOpen}
      trigger={<button type="button">Popover trigger</button>}
      content={
        <div>
          <p>Some content</p>
          <button type="button" onClick={popover.close}>
            Close popover
          </button>
        </div>
      }
    />
  );
};
```
