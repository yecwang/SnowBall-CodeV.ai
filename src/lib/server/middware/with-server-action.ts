import { decode } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers'
//
import { JWT_TOKEN_KEY } from 'src/services/config';
import Locale from 'src/locales/langs';
import { TClientReqContext, TServerActionContext, TServerActionResult, TSession } from 'src/types/server/server-action';
import * as ServerAction from 'src/constants/server-action';
import { TLanguages } from 'src/types/locale/locales';
import { UNAUTHORIZED_ERROR, UNKNOWN_ERROR } from 'src/constants/error-code';
import { ServerActionError } from '../error';

// no need auth action
const NO_NEED_AUTH_ACTION = [
  ServerAction.USER_LOGIN,
]

const SESSION_TOKEN_COOKIE_KEY = 'next-auth.session-token';


// TODO:
// --------- common method ---------
const accessRightsValidate = () => {}
const recordAuditTrail = () => {};
const reqLogger = (...args: any) => console.log(`${new Date()} SERVER_ACTION `, ...args);

export const prepareContext = (language: TLanguages)=>{
  const errorTipLanguage:{ [key: string]: string } = Locale[language].translations.error;
  const context: TServerActionContext = {
    language,
    session: null,
    t: (k: string) => errorTipLanguage[k] || k,
  };
  return context
}

// --------- common method ---------
export default function withServerAction<TActionFn extends (...args: any[]) => any>(actionType: string, actionFn: TActionFn) {
  const _verifyToken = async (type: string) => {
    if (NO_NEED_AUTH_ACTION.includes(type)) {
      return null;
    }

    try {
      const reqCookies = cookies();
      const token = reqCookies.get(SESSION_TOKEN_COOKIE_KEY)?.value;
      const tokenInfo = await decode({ token, secret: JWT_TOKEN_KEY as string });
      if (!tokenInfo) {
        throw new ServerActionError(UNAUTHORIZED_ERROR);
      }

      return tokenInfo.user as TSession;
    } catch (error) {
      if (error.code === 'ERR_JWE_INVALID') {
        cookies().delete(SESSION_TOKEN_COOKIE_KEY);
        throw new ServerActionError(UNAUTHORIZED_ERROR);
      }

      throw new ServerActionError(UNKNOWN_ERROR)
    }
  }

  type TActionFnArgs = Parameters<TActionFn> extends [any, ...infer Rest] ? Rest : never;
  type TActionFnResultData = ReturnType<TActionFn>;

  return async (clientContext: TClientReqContext, ...args: TActionFnArgs): Promise<TServerActionResult<TActionFnResultData>> => {
    const reqHeaders = headers();

    const errorTipLanguage:{ [key: string]: string } = Locale[clientContext.language].translations.error;
    const context: TServerActionContext = {
      ...clientContext,
      session: null,
      t: (k: string) => errorTipLanguage[k] || k,
    };

    accessRightsValidate();
  
    try {
      context.session = await _verifyToken(actionType);

      const data = await actionFn(context, ...args);

      return {
        data,
        error: null,
      }
    } catch (error) {
      console.error(error);
      const errorObj = {
        code: error.code,
        message: error.message || errorTipLanguage[error.code] || errorTipLanguage.UNKNOWN_ERROR,
      }
      
      return {
        data: null,
        error: errorObj,
      }
    } finally {
      recordAuditTrail();
      reqLogger(actionType, reqHeaders.get('Next-Action'), context.session?.username);
    }
  }
}
