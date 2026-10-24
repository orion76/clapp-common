import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import type { ITableData } from '@clapp/common';
import { PLUGIN_FORMATTER_TYPE, PluginFormatterBase, type IPluginFormatterDefinitionData } from '@clapp/common';

import { renderTable } from './lib';

/**
 * Formatter plugin that renders tabular data as a column-aligned table.
 */
@NodePlugin<IPluginFormatterDefinitionData<'table'>>({
  type: PLUGIN_FORMATTER_TYPE,
  id: 'table',
  label: 'Aligned table',
  kind: 'table',
})
@injectable()
export class TableFormatterPlugin extends PluginFormatterBase<ITableData> {
  /**
   * Renders the table.
   * @param data Table data
   * @returns Table ready for the terminal
   */
  async format(data: ITableData): Promise<string> {
    return renderTable(data);
  }
}
