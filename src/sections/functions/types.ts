export type TFunctionTableFilters = {
  searchKeyword: string;
  selectedFunctionNames: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type TFunctionTableFilterValue = string | string[] | Date | null;

export enum FunctionDeleteType {
  DELETE_ALL = 'DELETE_ALL',
  DELETE_SINGLE = 'DELETE_SINGLE',
}