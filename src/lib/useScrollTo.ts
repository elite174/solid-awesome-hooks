import { type Accessor, createEffect, createSignal, on } from "solid-js";

interface Params extends ScrollOptions, ScrollToOptions {
  scrollTrigger: Accessor<unknown>;
  /**
   * if set to true scrolling will be skipped on initial rendering
   * @default true
   */
  defer?: boolean;
}

export const useScrollTo = <T extends HTMLElement>({ scrollTrigger, defer = true, ...scrollOptions }: Params) => {
  const [scrollableElement, setScrollableElement] = createSignal<T>();

  createEffect(
    on(
      [scrollableElement, scrollTrigger],
      ([scrollableElementRef]) => {
        scrollableElementRef?.scrollTo(scrollOptions);
      },
      { defer }
    )
  );

  return setScrollableElement;
};
