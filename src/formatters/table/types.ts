/**
 * Value a table cell may hold. `null` and `undefined` are rendered as an empty
 * cell, everything else through `String(...)`.
 */
export type TTableCell = string | number | boolean | null | undefined;

/**
 * A row given as an ordered list of cells.
 */
export type TTableRow = TTableCell[];

/**
 * A row given as an object; its keys are matched against the table headers.
 */
export type TTableRecordRow = Record<string, TTableCell>;

/**
 * Data accepted by the `table` formatter.
 *
 * Headers may be omitted: object rows then contribute their own keys, while
 * array rows are rendered without a header line.
 */
export interface ITableData {
  /** Column headers. */
  headers?: string[];
  /** Rows: arrays of cells or objects keyed by the headers. */
  rows?: (TTableRow | TTableRecordRow)[];
  /** Number of spaces between columns; two by default. */
  gap?: number;
}
