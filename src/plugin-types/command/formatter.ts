import type { IPluginCommandDefinitionData } from './plugin';

/**
 * Identifier of a formatter available to commands. The identifier matches the id
 * of the formatter plugin (`table`, `ordered-list`, `key-value`) provided by the
 * host application, so the core looks it up in the formatter plugin manager
 * before printing the result of a command that declares a `formatter`.
 */
export type UFormatterKind = 'table' | 'ordered-list' | 'key-value';

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

/**
 * Marker style of a list: ordinal numbers or bullets.
 */
export type TListMarker = 'number' | 'bullet';

/**
 * A list item.
 */
export interface IOrderedListItem {
  /** Item text. */
  text: string;
  /** Completion flag: rendered as a checked box with the text dimmed and struck through. */
  done?: boolean;
}

/**
 * Data accepted by the `ordered-list` formatter. Shaped for todo lists: a
 * title, an optional description and the items themselves.
 */
export interface IOrderedListData {
  /** List title. */
  title?: string;
  /** Optional description rendered under the title. */
  description?: string;
  /** Items: plain strings or objects carrying a completion flag. */
  items?: (string | IOrderedListItem)[];
  /** Marker style; ordinal numbers by default. */
  marker?: TListMarker;
}

/**
 * Value of a key-value pair. `null` and `undefined` are treated as "no value"
 * (see {@link IKeyValuePair.value}), everything else is rendered through
 * `String(...)`.
 */
export type TKeyValuePairValue = string | number | boolean;

/**
 * A single `key — value` pair. The value is optional: a pair without one renders
 * as a lone key, which marks a present but valueless field.
 */
export interface IKeyValuePair {
  /** Pair key rendered in the left column. */
  key: string;
  /** Pair value rendered in the right column; omitted for a lone key. */
  value?: TKeyValuePairValue | null;
}

/**
 * A titled block of key-value pairs. Sections let a command group pairs under a
 * heading, for example one `dependencies (N)` section per dependency kind.
 */
export interface IKeyValueSection {
  /** Section heading rendered above its pairs. */
  title?: string;
  /** Pairs of the section. */
  pairs?: IKeyValuePair[];
}

/**
 * Data accepted by the `key-value` formatter. Shaped for field reports: an
 * optional title with a description, top-level pairs and titled sections.
 */
export interface IKeyValueData {
  /** Title rendered above everything else. */
  title?: string;
  /** Optional description rendered under the title. */
  description?: string;
  /** Top-level pairs rendered before the sections. */
  pairs?: IKeyValuePair[];
  /** Sections, each with its own title and pairs. */
  sections?: IKeyValueSection[];
}

/**
 * Map of a formatter kind to the data its formatter renders. It is the single
 * place where the available kinds and their data shapes are paired, so a new
 * kind cannot be added without declaring the type of data it accepts.
 */
export interface IFormatterDataMap {
  table: ITableData;
  'ordered-list': IOrderedListData;
  'key-value': IKeyValueData;
}

/**
 * Data type rendered by the formatter of the given kind. Command authors use it
 * to type the `data` they return, for example
 * `Promise<ICommandResult<TFormatterData<'table'>>>`.
 * @template K Formatter kind
 */
export type TFormatterData<K extends UFormatterKind> = IFormatterDataMap[K];

/**
 * Authoring-time command definition with a strict formatter identifier.
 *
 * `IPluginCommandDefinitionData` types `formatter` as a plain string, because
 * `@clapp/common` must not depend on the list of formatters. This variant
 * narrows the field to `UFormatterKind`, so a definition declares its formatter
 * with compile-time checking; the field stays optional, commands without a
 * formatter keep printing their output themselves.
 * @template A Command arguments
 */
export type IFormatterCommandDefinitionData<A = {}, C = {}> = Omit<IPluginCommandDefinitionData<A, C>, 'formatter'> & {
  formatter?: UFormatterKind;
};
