# solid-awesome-hooks

🛠 A collection of useful hooks for solid-js 🛠

## Hook list

- [useClickOutside](#useClickOutside)

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
