import {
  type Accessor,
  type Setter,
  batch,
  createMemo,
  createSignal,
} from "solid-js";

type ActionError = {
  message?: string;
};

type TryAction = (
  action: () => Promise<void>,
  onError?: (e: unknown) => void
) => Promise<void>;

export type AsyncAction = {
  /** Pass an async function here */
  try: TryAction;
  state: {
    /** Is async action in progress */
    isInProgress: Accessor<boolean>;
    error: Accessor<ActionError | null>;
  };
  setErrorMessage: Setter<string | undefined>;
  /** Resets progress, error states and error message */
  reset: VoidFunction;
};

export const useAsyncAction = (): AsyncAction => {
  const [isInProgress, setInProgress] = createSignal(false);
  const [isErrored, setErrored] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const tryAsync: TryAction = async (action, onError) => {
    batch(() => {
      setInProgress(true);
      setErrored(false);
    });

    try {
      await action();
    } catch (error) {
      batch(() => {
        setErrored(true);
        onError?.(error);
      });
    } finally {
      setInProgress(false);
    }
  };

  const error = createMemo(() =>
    isErrored() ? { message: errorMessage() } : null
  );

  const reset = () =>
    batch(() => {
      setInProgress(false);
      setErrored(false);
      setErrorMessage(undefined);
    });

  return {
    try: tryAsync,
    state: {
      error,
      isInProgress,
    },
    reset,
    setErrorMessage,
  };
};
