import { type Accessor, createEffect, on, onCleanup, type Owner, runWithOwner, getOwner } from "solid-js";

type UsePollingOptions = {
  /**
   * Time interval to call "poll" function
   * @default 3000
   */
  pollingTime?: number;
  enabled?: Accessor<boolean>;
  /**
   * This hook uses setTimeout for polling, so it might be the case when `poll` function triggers reactive things.
   * To make it work correctly pass proper owner for the `poll` function.
   * Otherwise it will be assigned automatically (the owner of the hook will be used)
   */
  owner?: Owner;
};

const DEFAULT_OPTIONS = {
  pollingTime: 3000,
  enabled: () => true,
} satisfies UsePollingOptions;

/**
 *
 * @param readyTrigger Reactive signal that tells that the poll function can now be scheduled
 * @param poll Function
 * @param options {UsePollingOptions}
 */
export const usePolling = (readyTrigger: Accessor<unknown>, poll: VoidFunction, options?: UsePollingOptions) => {
  const { pollingTime, enabled, owner = getOwner() } = Object.assign({}, DEFAULT_OPTIONS, options);

  const pollWithOwner = () => runWithOwner(owner, () => poll());

  // This effect is triggered when the data signal changes
  // Thus, we don't rely on slow network
  createEffect(
    on([readyTrigger, enabled], ([_, isEnabled]) => {
      if (!isEnabled) return;

      const timer = setTimeout(() => pollWithOwner(), pollingTime);

      onCleanup(() => clearTimeout(timer));
    })
  );
};
