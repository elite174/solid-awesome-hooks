import { Context, useContext as useContextBase } from "solid-js";

/**
 * Same as solid's useContext, but it throws an error if there's no context value
 * @param context
 * @param errorMessage
 */
export const useContextStrict = <T>(
  context: Context<T>,
  errorMessage = `Cannot get ${context} context`
) => {
  const currentContext = useContextBase(context);

  if (!currentContext) throw new Error(errorMessage);

  return currentContext;
};
