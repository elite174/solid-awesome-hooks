import { type Accessor, createEffect, on, onCleanup } from "solid-js";

type UsePollingOptions = {
  /**
   * Time interval to call "refetch" function
   * @default 3000
   */
  pollingTime?: number;
  enabled?: Accessor<boolean>;
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
  const { pollingTime, enabled } = Object.assign({}, DEFAULT_OPTIONS, options);

  // This effect is triggered when the data signal changes
  // Thus, we don't rely on slow network
  createEffect(
    on([readyTrigger, enabled], ([_, isEnabled]) => {
      if (!isEnabled) return;

      const timer = setTimeout(() => poll(), pollingTime);

      onCleanup(() => clearTimeout(timer));
    })
  );
};
