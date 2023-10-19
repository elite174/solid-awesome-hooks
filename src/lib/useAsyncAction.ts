import { type Accessor, type Setter, createSignal, batch } from "solid-js";

type ActionState = "pending" | "resolved" | "errored" | "ready";

type TryAction = <T>(action: () => Promise<T>) => Promise<T>;

export type AsyncAction = {
  /** Pass an async function here */
  try: TryAction;
  state: Accessor<ActionState>;
  errorMessage: Accessor<string | undefined>;
  setErrorMessage: Setter<string | undefined>;
  /** Resets progress, error states and error message */
  reset: VoidFunction;
};

export const useAsyncAction = (): AsyncAction => {
  const [actionState, setActionState] = createSignal<ActionState>("ready");
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const tryAsync: TryAction = async (action) => {
    batch(() => {
      setActionState("pending");
      setErrorMessage(undefined);
    });

    try {
      const data = await action();

      setActionState("resolved");

      return data;
    } catch (error) {
      setActionState("errored");

      throw error;
    }
  };

  const reset = () =>
    batch(() => {
      setActionState("ready");
      setErrorMessage(undefined);
    });

  return {
    setErrorMessage,
    try: tryAsync,
    state: actionState,
    errorMessage,
    reset,
  };
};
