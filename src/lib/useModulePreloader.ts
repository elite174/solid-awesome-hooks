import {
  createDeferred,
  createSignal,
  lazy,
  createEffect,
  onMount,
} from "solid-js";

/**
 * Preloads modules imported with `lazy` when the browser is idle one by one
 * @param lazyModules 
 */
export const useModulePreloader = (
  lazyModules: Array<ReturnType<typeof lazy>>
) => {
  const [isLoadingStarted, setLoadingStarted] = createSignal(false);
  const [moduleIndex, setModuleIndex] = createSignal(0);

  const deferredModuleIndex = createDeferred(moduleIndex);
  const deferredStarted = createDeferred(isLoadingStarted);

  onMount(() => setLoadingStarted(true));

  createEffect(() => {
    if (!deferredStarted()) return;

    createEffect(() => {
      if (deferredModuleIndex() >= lazyModules.length) return;

      const module = lazyModules[deferredModuleIndex()];

      module.preload();
      setModuleIndex((index) => index + 1);
    });
  });
};
