
export type TListMarker = 'number' | 'bullet';

export interface IOrderedListItem {
  /** Item text. */
  text: string;
  /** Completion flag: rendered as a checked box with the text dimmed and struck through. */
  done?: boolean;
}

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