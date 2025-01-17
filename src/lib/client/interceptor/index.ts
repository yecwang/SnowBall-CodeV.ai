// components
import { enqueueSnackbar } from 'src/components/snackbar';
// utils
import { localStorageGetItem } from 'src/lib/client/utils/storage-available';
// routes
import { paths } from 'src/routes/paths';
//
import { TServerActionResult, TServerActionOptions } from 'src/types/server/server-action';
import { ServerActionError } from 'src/lib/server/error';
import languages from 'src/locales/langs';
import { TLanguages } from 'src/types/locale/locales';

type TUnwrapPromise<T> = T extends Promise<infer U> ? TUnwrapPromise<U> : T;

export default function withIntercept<TActionFn extends (...args: any[]) => any>(this: unknown, actionFn: TActionFn) {
  type TActionFnArgs = Parameters<TActionFn> extends [any, ...infer Rest] ? Rest : never
  type TActionFnResult = TUnwrapPromise<ReturnType<TActionFn>>;
  type TActionFnResultData = TUnwrapPromise<TActionFnResult['data']>;

  const defaultServerActionOptions: TServerActionOptions = {
    isNeedErrorTip: true,
  };

  return async (options: TServerActionOptions, ...args: TActionFnArgs): Promise<TActionFnResultData | null> => {
    
    const serverActionOptions = {
      ...defaultServerActionOptions,
      ...options
    }
    const language = localStorageGetItem('i18nextLng', 'cn') as TLanguages;
    const context = {
      language
    };
  
    let result: TServerActionResult<TActionFnResult>
    try {
      result = await actionFn(context, ...args);
    } catch(error) {
      result = {
        error: {
          code: 'UNKNOWN_ERROR',
          message: languages[language].translations.error.UNKNOWN_ERROR,
        },
        data: null
      }
    }
  
    if (result.error) {
      if (serverActionOptions.isNeedErrorTip) {
        enqueueSnackbar(result.error.message, {
          variant: 'error'
        });
      }

      if (result.error.code === 'UNAUTHORIZED_ERROR') {
        window.location.replace(paths.auth.jwt.login);
      }

      throw new ServerActionError(result.error.code, result.error.message)
    }
  
    return result.data;
  }
}
