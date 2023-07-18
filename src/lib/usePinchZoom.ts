import { createEffect, createSignal, onCleanup } from "solid-js";

interface UsePinchZoomParams {
  /**
   * Callback to be called on zoom in
   * @param distanceGrowthPX - absolute distance growth between event calls
   */
  onZoomIn?: (distanceGrowthPX: number) => void;
  /**
   * Callback to be called on zoom out
   * @param distanceGrowthPX - absolute distance growth between event calls
   */
  onZoomOut?: (distanceGrowthPX: number) => void;
  options?: {
    /**
     * @default true
     */
    preventTouchMoveEvent?: boolean;
  };
}

const getDistance = (event1: Touch, event2: Touch) =>
  Math.hypot(event2.pageX - event1.pageX, event2.pageY - event1.pageY);

const DEFAULT_OPTIONS: UsePinchZoomParams["options"] = {
  preventTouchMoveEvent: true,
};

export const usePinchZoom = ({
  onZoomIn,
  onZoomOut,
  options = DEFAULT_OPTIONS,
}: UsePinchZoomParams) => {
  const [elementRef, setElementRef] = createSignal<HTMLElement>();

  createEffect(() => {
    const element = elementRef();

    if (!element) return;

    let prevDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        prevDistance = getDistance(e.touches[1], e.touches[0]);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        if (options.preventTouchMoveEvent) e.preventDefault();
        // Calculate the distance between the two pointers
        const currentPointDistance = getDistance(e.touches[1], e.touches[0]);

        let shouldUpdatePrevDistance = false;

        const distanceGrowthPX = Math.abs(currentPointDistance - prevDistance);

        if (currentPointDistance - prevDistance > 0) {
          onZoomIn?.(distanceGrowthPX);

          shouldUpdatePrevDistance = true;
        }

        if (prevDistance - currentPointDistance > 0) {
          onZoomOut?.(distanceGrowthPX);

          shouldUpdatePrevDistance = true;
        }

        if (shouldUpdatePrevDistance) {
          prevDistance = currentPointDistance;
        }
      }
    };

    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);

    onCleanup(() => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
    });
  });

  return setElementRef;
};
