import { type Accessor, createDeferred, createEffect } from "solid-js";

type Serializable = number | string | boolean | object;

type SaveToStorageOptions = {
  /** @default localStorage */
  storage?: Storage;

  /**
   * If set to true it will save the data when the browser is idle
   * @default true
   */
  deferred?: boolean;
};

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
  const isDeferred = options?.deferred ?? true;
  const storage = options?.storage ?? localStorage;

  const dataToSave = isDeferred ? createDeferred(data) : data;

  createEffect(() => {
    const rawData = dataToSave();

    storage.setItem(
      key,
      typeof rawData === "object" ? JSON.stringify(rawData) : String(rawData)
    );
  });
};
