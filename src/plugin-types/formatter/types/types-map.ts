import { IKeyValueData } from "./formatters/key-value";
import { IOrderedListData } from "./formatters/ordered-list";
import { ITableData } from "./formatters/table";

export type UFormatterKind = 'table' | 'ordered-list' | 'key-value';

export interface IFormatterDataMap {
  table: ITableData;
  'ordered-list': IOrderedListData;
  'key-value': IKeyValueData;
}

export type TFormatterData<K extends UFormatterKind> = IFormatterDataMap[K];
