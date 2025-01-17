import { TLanguages } from '../locale/locales';

export type TClientReqContext = {
  language: TLanguages;
}

export type TSession = {
  id: number,
  username: string
} | null

export type TServerActionContext = TClientReqContext & {
  session: TSession,
  t: (value: string) => string | undefined,
}

export type TServerActionError = {
  code: string,
  message: string,
}

export type TServerActionResult<D> = {
  data: D | null;
  error: TServerActionError | null
}

export type TServerActionOptions = {
  isNeedErrorTip?: boolean;
}
