import { type Accessor, createComputed, on } from "solid-js";

/**
 * This hook may be used to sync your state (signals or stores) with props.
 * Basically it's just a shorthand for createComputed(on(source, setter, { defer }))
 * @param source Reactive signal
 * @param setter A function which runs immediately when source changes
 * @param defer A boolean value which is passed to on's defer option. Default - true.
 */
export const useSyncState = <T>(source: Accessor<T>, setter: (value: T) => void, defer = true) =>
  createComputed(on(source, setter, { defer }));
