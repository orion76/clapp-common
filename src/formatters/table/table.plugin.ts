import { injectable } from 'inversify';
import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_FORMATTER_TYPE } from '../../constants';
import type { IPluginFormatterDefinitionData } from '../../types/formatter';
import { PluginFormatterBase } from '../formatter.base';
import { renderTable } from './lib';
import type { ITableData } from './types';

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
