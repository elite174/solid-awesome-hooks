# solid-awesome-hooks

[![version](https://img.shields.io/npm/v/solid-awesome-hooks?style=for-the-badge)](https://www.npmjs.com/package/solid-awesome-hooks)
![npm](https://img.shields.io/npm/dw/solid-awesome-hooks?style=for-the-badge)

🛠 A collection of useful hooks for solid-js 🛠

## Hook list

- [useClickOutside](#useClickOutside)
- [usePinchZoom](#usePinchZoom)

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

### Usage

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

### Usage

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
