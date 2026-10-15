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
