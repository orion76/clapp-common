import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import type { ITableData } from '@clapp/common';
import { PLUGIN_FORMATTER_TYPE, PluginFormatterBase, type IPluginFormatterDefinitionData } from '@clapp/common';

import { renderTable } from './lib';

/**
 * MCP formatter plugin that renders tabular data as a column-aligned table
 * without terminal styling. It carries the same id as the terminal
 * `table` formatter, but writes for the protocol stream of an MCP server: a host
 * opts into this set by pointing the discovery patterns of `PLUGIN_FORMATTER_TYPE`
 * at the modules of `src/plugins/formatter/mcp`.
 */
@NodePlugin<IPluginFormatterDefinitionData>({
  type: PLUGIN_FORMATTER_TYPE,
  id: 'table',
  label: 'Aligned table',
})
@injectable()
export class MCPTableFormatterPlugin extends PluginFormatterBase<ITableData> {
  /**
   * Renders the table.
   * @param data Table data
   * @returns Table ready for the protocol stream
   */
  async format(data: ITableData): Promise<string> {
    return renderTable(data);
  }
}
