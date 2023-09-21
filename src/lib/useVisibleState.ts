import { createSignal } from "solid-js";

export const useVisibleState = () => {
  const [isOpened, setOpened] = createSignal();

  const hide = () => setOpened(false);
  const reveal = () => setOpened(true);

  return {
    isOpened,
    setOpened,
    hide,
    reveal,
  };
};
