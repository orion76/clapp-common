export type TTableCell = string | number | boolean | null | undefined;

export type TTableRow = TTableCell[];

export type TTableRecordRow = Record<string, TTableCell>;

export interface ITableData {
  /** Column headers. */
  headers?: string[];
  /** Rows: arrays of cells or objects keyed by the headers. */
  rows?: (TTableRow | TTableRecordRow)[];
  /** Number of spaces between columns; two by default. */
  gap?: number;
}
