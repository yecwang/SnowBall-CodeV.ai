export type TProjectItem = {
  id: string;
  name: string;
  description: string;
  path: string;
}

export type IAttribute = {
  elementID: string;
  componentName: string;
  attributes: any;
};

export type IProjectToolbox = {
  toolBoxComponents: {[key: string|number]: {[key: string]: IComponent}};
  comTreeStructure: IComTreeStructure[];
  comStructure: ComStructure;
}
export type IComTreeStructure<R extends {} = { id: string, label: string }> = R & {
  children?: IComTreeStructure<R>[];
};

export type ComStructure = {[key: string]: {parent: string, parentDirection: string, componentName: string, attributes: any, children: string[]}};

export type IProjectAttribute = {
  attributes: {
    [key: string|number]: any
  };
  currentComponentAttr: {
    [key: string|number]: IAttribute | null
  };
  attributesConfig: {
    [key: string|number]: Array<any>
  };
  afterUpdateCurentComponentAttr: IAttribute | null;
  selectedComId: string;
  willInsertLocationComs: Array<string>;
}

export type IComponent = {
  id: string;
  label: string;
  name: string;
  icon: string;
  code: string;
  importCode: string[];
  attributes: any;
  locales: {
    [key: string]: {
      [key: string]: string
    }
  }
}

export type IDragLabelProps = { 
  label: string | undefined,
  code: string | undefined,
  name: string | undefined,
  importCode: Array<string> | undefined,
  attributes: any | undefined
}
export type IDragContainerProps = { 
  code: string | undefined,
  name: string | undefined,
  importCode: Array<string> | undefined,
  attributes: any | undefined,
}

export interface Project {
  id: number;
  name: string;
  // version: string;
  ctime: Date;
  utime: Date;
  description: string;
  status: ProjectStatus;
  path: string | null;
  isLocked: boolean;
  extra: {};
  creatorID: number;
}

export enum ProjectStatus {
  CREATED = 'CREATED',
  DESIGNING = 'DESIGNING',
  RELEASED = 'RELEASED',
}

export interface DashboardOpenModal {
  versionHistory: boolean;
  rename: boolean;
  locked: boolean;
  view?: boolean;
  edit?: boolean;
  export?: boolean;
}