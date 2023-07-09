import {
  type Accessor,
  type Setter,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";

export const useClickOutside = (
  /** Callback to run when click is outside target element */
  callback: (e: MouseEvent) => void,
  /** Hook options */
  options?: {
    /** Boolean signal which will trigger listening to the click event */
    enabled: Accessor<boolean>;
  }
): Setter<HTMLElement> => {
  const [elementRef, setElementRef] = createSignal<HTMLElement>();

  const listenToEvent = () => options?.enabled() ?? true;

  createEffect(() => {
    const element = elementRef();

    if (!listenToEvent() || !element) return;

    const handleClick = (e: MouseEvent) => {
      if (!e.composedPath().includes(element)) callback(e);
    };

    document.addEventListener("click", handleClick);

    onCleanup(() => {
      document.removeEventListener("click", handleClick);
    });
  });

  return setElementRef;
};
