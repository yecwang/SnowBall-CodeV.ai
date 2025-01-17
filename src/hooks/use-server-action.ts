import { useState } from 'react';
import { TServerActionError, TServerActionOptions } from 'src/types/server/server-action';

type TUnwrapPromise<T> = T extends Promise<infer U> ? TUnwrapPromise<U> : T;

export default function useServerAction<TActionFn extends (...args: any[]) => any>(this: unknown, actionFn: TActionFn, options?: TServerActionOptions) {
  type TActionFnArgs = Parameters<TActionFn> extends [any, ...infer Rest] ? Rest : never
  type TActionFnResult = TUnwrapPromise<ReturnType<TActionFn>>;

  const [error, setError] = useState<TServerActionError | null>(null);
  const [data, setData] = useState<TActionFnResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  if (!options) {
    options = {};
  }

  return {
    error,
    data,
    isLoading,
    run: async (...args: TActionFnArgs): Promise<{ data: TActionFnResult | null, error: TServerActionError | null }> => {
      try {
        setIsLoading(true);
        const result: TActionFnResult = await actionFn(options, ...args);
        setData(result);
        return { data: result, error: null };
      } catch (error) {
        setError(error);
        return { data: null, error }
      } finally {
        setIsLoading(false);
      }
    }
  }
}
