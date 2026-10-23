
export type TKeyValuePairValue = string | number | boolean;

export interface IKeyValuePair {
  /** Pair key rendered in the left column. */
  key: string;
  /** Pair value rendered in the right column; omitted for a lone key. */
  value?: TKeyValuePairValue | null;
}

export interface IKeyValueSection {
  /** Section heading rendered above its pairs. */
  title?: string;
  /** Pairs of the section. */
  pairs?: IKeyValuePair[];
}

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