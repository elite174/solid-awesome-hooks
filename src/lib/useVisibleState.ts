import { createSignal } from "solid-js";

type Action = "hide" | "reveal";

export const useVisibleState = (initialState?: boolean) => {
  const [isOpen, setOpen] = createSignal<boolean>(Boolean(initialState));

  const hide = () => setOpen(false);
  const reveal = () => setOpen(true);

  const withAction =
    <T extends any[], U>(action: Action, callback?: (...args: T) => U) =>
    (...args: T) => {
      const result = callback?.(...args);

      if (action === "hide") hide();
      else reveal();

      return result;
    };

  return {
    isOpen,
    setOpen,
    hide,
    reveal,
    withAction,
  };
};
