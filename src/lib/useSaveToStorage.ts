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
  /**
   * If set to true it will remove the key from storage if the data is null or undefined
   * @default false
   */
  clearOnEmpty?: boolean;
};

const DEFAULT_OPTIONS = {
  storage: localStorage,
  saveWhenIdle: true,
  defer: true,
  clearOnEmpty: false,
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
      (rawData) => {
        if (resolvedOptions.clearOnEmpty && (rawData === null || rawData === undefined))
          resolvedOptions.storage.removeItem(key);
        else
          resolvedOptions.storage.setItem(key, typeof rawData === "object" ? JSON.stringify(rawData) : String(rawData));
      },
      { defer: resolvedOptions.defer }
    )
  );
};
