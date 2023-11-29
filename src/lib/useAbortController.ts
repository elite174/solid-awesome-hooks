import { type Owner, onCleanup, runWithOwner, getOwner } from "solid-js";
import { isServer } from "solid-js/web";

type Options = {
  // Reason is passed to abort() function when owner scope cleanups
  reason?: any;
  // If there's no current owner, onCleanup will be registered with fallbackOwner instead
  fallbackOwner?: Owner | null;
};

/**
 * Returns AbortController instance
 * Can be useful inside createResource
 * If there's no owner scope abort() won't be called
 */
export const useAbortController = ({ reason, fallbackOwner }: Options = {}) => {
  if (isServer)
    return {
      abort: () => {},
      signal: {} as AbortSignal,
    } satisfies AbortController;

  const controller = new AbortController();

  const owner = getOwner() ?? fallbackOwner;

  if (owner) {
    // register cleanup with owner
    runWithOwner(owner, () => {
      onCleanup(() => {
        runWithOwner(owner, () => controller.abort(reason));
      });
    });
  }

  return controller;
};
