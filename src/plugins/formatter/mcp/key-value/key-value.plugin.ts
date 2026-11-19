import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import type { IKeyValueData } from '@clapp/common';
import { PLUGIN_FORMATTER_TYPE, PluginFormatterBase, type IPluginFormatterDefinitionData } from '@clapp/common';

import { renderKeyValue } from './lib';

/**
 * MCP formatter plugin that renders field data as aligned key-value pairs
 * grouped into titled sections, without terminal styling. It carries the same
 * id as the terminal `key-value` formatter, but writes for the protocol
 * stream of an MCP server.
 */
@NodePlugin<IPluginFormatterDefinitionData>({
  type: PLUGIN_FORMATTER_TYPE,
  id: 'key-value',
  label: 'Key-value pairs',
})
@injectable()
export class MCPKeyValueFormatterPlugin extends PluginFormatterBase<IKeyValueData> {
  /**
   * Renders the pairs.
   * @param data Key-value data
   * @returns Blocks ready for the protocol stream
   */
  async format(data: IKeyValueData): Promise<string> {
    return renderKeyValue(data);
  }
}
