import { createSignal } from "solid-js";

export const useVisibleState = (initialState?: boolean) => {
  const [isOpen, setOpen] = createSignal<boolean>(Boolean(initialState));

  const hide = () => setOpen(false);
  const reveal = () => setOpen(true);

  return {
    isOpen,
    setOpen,
    hide,
    reveal,
  };
};
