import { type Accessor, createDeferred, createEffect, on } from "solid-js";

type Serializable = number | string | boolean | object;

type SaveToStorageOptions = {
  /** @default localStorage */
  storage?: Storage;
  /**
   * If set to true it will save the data when the browser is idle
   * @default true
   */
  saveWhenIdle?: boolean;
  /**
   * If set to true it will save the data only after first change
   * (it passed to solid's `on` `defer` option)
   * @default true
   */
  defer?: boolean;
};

const DEFAULT_OPTIONS = {
  storage: localStorage,
  saveWhenIdle: true,
  defer: true,
} satisfies SaveToStorageOptions;

/**
 *
 * @param key - key name in storage
 * @param data - Reactive accessor to the data
 * @param options
 */
export const useSaveToStorage = <T extends Serializable>(
  key: string,
  data: Accessor<T>,
  options?: SaveToStorageOptions
) => {
  const resolvedOptions = Object.assign({}, DEFAULT_OPTIONS, options);

  const dataToSave = resolvedOptions.saveWhenIdle ? createDeferred(data) : data;

  createEffect(
    on(
      dataToSave,
      (rawData) =>
        resolvedOptions.storage.setItem(
          key,
          typeof rawData === "object"
            ? JSON.stringify(rawData)
            : String(rawData)
        ),
      { defer: resolvedOptions.defer }
    )
  );
};
