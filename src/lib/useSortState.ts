import { createMemo, createSignal } from "solid-js";

export enum SortState {
  ASCENDING = 1,
  DESCENDING = -1,
}

export const useSortState = (initialSortState = SortState.ASCENDING) => {
  const [order, setOrder] = createSignal<SortState>(initialSortState);

  const toggleOrder = () =>
    setOrder((state) => (state === SortState.ASCENDING ? SortState.DESCENDING : SortState.ASCENDING));

  const isAscending = createMemo(() => order() === SortState.ASCENDING);

  const isDescending = createMemo(() => order() === SortState.DESCENDING);

  const resetOrder = () => setOrder(initialSortState);

  return {
    order,
    setOrder,
    toggleOrder,
    isAscending,
    isDescending,
    resetOrder,
  };
};
