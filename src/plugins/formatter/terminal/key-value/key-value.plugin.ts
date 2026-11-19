import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import type { IKeyValueData } from '@clapp/common';
import { PLUGIN_FORMATTER_TYPE, PluginFormatterBase, type IPluginFormatterDefinitionData } from '@clapp/common';

import { renderKeyValue } from './lib';

/**
 * Formatter plugin that renders field data as aligned key-value pairs grouped
 * into titled sections.
 */
@NodePlugin<IPluginFormatterDefinitionData>({
  type: PLUGIN_FORMATTER_TYPE,
  id: 'key-value',
  label: 'Key-value pairs',
})
@injectable()
export class KeyValueFormatterPlugin extends PluginFormatterBase<IKeyValueData> {
  /**
   * Renders the pairs.
   * @param data Key-value data
   * @returns Blocks ready for the terminal
   */
  async format(data: IKeyValueData): Promise<string> {
    return renderKeyValue(data);
  }
}
