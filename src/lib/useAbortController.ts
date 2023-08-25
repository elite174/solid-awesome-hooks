import { onCleanup } from "solid-js";

/**
 * Returns AbortController instance
 * Can be useful inside createResource
 * @param reason - reason for abort on scope cleanup
 */
export const useAbortController = (reason?: any) => {
  const controller = new AbortController();

  onCleanup(() => {
    controller.abort(reason);
  });

  return controller;
};
