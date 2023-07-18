# solid-awesome-hooks

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

### Definition

```tsx
import { type Setter } from "solid-js";

interface UsePinchZoomParams {
  /**
   * Callback to be called on zoom in
   * @param distanceGrowthPX - absolute distance growth between event calls
   */
  onZoomIn?: (distanceGrowthPX: number) => void;
  /**
   * Callback to be called on zoom out
   * @param distanceGrowthPX - absolute distance growth between event calls
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
    Listen to click outside of this section
</section>
```
