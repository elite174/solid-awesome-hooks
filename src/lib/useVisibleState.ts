import { createSignal } from "solid-js";

export const useVisibleState = (initialState?: boolean) => {
  const [isOpened, setOpened] = createSignal<boolean>(Boolean(initialState));

  const hide = () => setOpened(false);
  const reveal = () => setOpened(true);

  return {
    isOpened,
    setOpened,
    hide,
    reveal,
  };
};
