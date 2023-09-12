import { type Accessor, type Setter, createSignal, batch } from "solid-js";

type ActionState = "pending" | "resolved" | "errored" | "ready";

type TryAction = (
  action: () => Promise<void>,
  options?: {
    /* The function which will be executed in `catch` block */
    catchHandler?: (e: unknown, setErrorMessage: Setter<string>) => unknown | Promise<unknown>;
    /* The function which will be executed in `finally` block */
    finallyHandler?: () => unknown | Promise<unknown>;
  }
) => Promise<void>;

export type AsyncAction = {
  /** Pass an async function here */
  try: TryAction;
  state: Accessor<ActionState>;
  errorMessage: Accessor<string | undefined>;
  /** Resets progress, error states and error message */
  reset: VoidFunction;
};

export const useAsyncAction = (): AsyncAction => {
  const [actionState, setActionState] = createSignal<ActionState>("ready");
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const tryAsync: TryAction = async (action, options) => {
    batch(() => {
      setActionState("pending");
      setErrorMessage(undefined);
    });

    try {
      await action();

      setActionState("resolved");
    } catch (error) {
      setActionState("errored");

      await options?.catchHandler?.(error, setErrorMessage);
    } finally {
      await options?.finallyHandler?.();
    }
  };

  const reset = () =>
    batch(() => {
      setActionState("ready");
      setErrorMessage(undefined);
    });

  return {
    try: tryAsync,
    state: actionState,
    errorMessage,
    reset,
  };
};
