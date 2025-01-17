export interface TProjectPages {
  [key: string]: string | TProjectPages;
}

export type TProjectInfo = {
  name: string,
  description: string,
}

export type TProject = {
  id: number,
  name: string,
  description: string,
  setting: TSetting,
  pages: TProjectPages,
  functions: TFunction[],
  variables: any,
  metadata: any,
  texts: any,
  newPages?: []
};

export type TProjectSetPage = {
  id: string,
  content: string
}

export type TMap = {
  [key: string]: any;
};

export type TVariable = {
  kind: "let" | "const",
  key: string,
  name: string,
  value: any,
  description: string|null,
  type: "string" | "number" | "boolean" | "Array<any>" | "object",
};

export type TActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type TFunction = {
  description: string;
  name: string;
  code?: string;
  isReturn: boolean;
  // serializationLoad?: any;
  flowNodes?: any;
  flowEdges?: any;
  parameters?: Array<{
    name: string;
    type: string;
  }>;
}

export enum FunctionCallSource {
  Page = 'Page',
  Function = 'Function',
}
export type TFunctionReferences = {
  [functionName: string]: {
    callSource: FunctionCallSource;
    paths: string[];
  }[];
}

// -------setting-------
export enum PageConfigType {
  Directory = "directory",
  Page = 'page'
}
export type TPageConfig = {
  type: PageConfigType;
  path: string;
  name: string;
}
export type TPagesConfig = {
  [key: string]: TPageConfig
}
export type TSetting = {
  pages: TPagesConfig;
  entryPage: string;
}
