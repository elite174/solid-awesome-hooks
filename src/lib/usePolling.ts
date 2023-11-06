import { type Accessor, createEffect, on, onCleanup, type Owner, runWithOwner, getOwner } from "solid-js";

type UsePollingOptions = {
  /**
   * Time interval to call "poll" function
   * @default 3000
   */
  timeInterval?: number;
  enabled?: Accessor<boolean>;
  /**
   * The maximum number of function calls
   * When request count exceeds this limit, polling stops
   * Pass Infinity to avoid this behavior if necessary
   * @default 10
   */
  callLimit?: number;
  /**
   * This hook uses setTimeout for polling, so it might be the case when `poll` function triggers reactive things.
   * To make it work correctly pass proper owner for the `poll` function.
   * Otherwise it will be assigned automatically (the owner of the hook will be used)
   */
  owner?: Owner | null;
};

const DEFAULT_OPTIONS = {
  timeInterval: 3000,
  enabled: () => true,
  callLimit: 10,
} satisfies UsePollingOptions;

/**
 *
 * @param readyTrigger Reactive signal that tells that the poll function can now be scheduled
 * @param poll Function
 * @param options {UsePollingOptions}
 */
export const usePolling = (readyTrigger: Accessor<unknown>, poll: VoidFunction, options?: UsePollingOptions) => {
  const { timeInterval, enabled, owner = getOwner(), callLimit } = Object.assign({}, DEFAULT_OPTIONS, options);
  const pollWithOwner = () => runWithOwner(owner, () => poll());

  let remainingCalls = callLimit;

  // This effect is triggered when the data signal changes
  // Thus, we don't rely on slow network
  createEffect(
    on([readyTrigger, enabled], ([_, isEnabled]) => {
      if (!isEnabled) return;

      const timer = setTimeout(() => {
        if (remainingCalls <= 0) {
          clearTimeout(timer);
          return;
        }

        pollWithOwner();

        remainingCalls -= 1;
      }, timeInterval);

      onCleanup(() => clearTimeout(timer));
    })
  );
};
