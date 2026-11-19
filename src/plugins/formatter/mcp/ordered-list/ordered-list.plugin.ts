import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import type { IOrderedListData } from '@clapp/common';
import { PLUGIN_FORMATTER_TYPE, PluginFormatterBase, type IPluginFormatterDefinitionData } from '@clapp/common';

import { renderOrderedList } from './lib';

/**
 * MCP formatter plugin that renders a todo-shaped list — a title, an optional
 * description and numbered or bulleted items — without terminal styling. It
 * carries the same id as the terminal `ordered-list` formatter, but
 * writes for the protocol stream of an MCP server.
 */
@NodePlugin<IPluginFormatterDefinitionData>({
  type: PLUGIN_FORMATTER_TYPE,
  id: 'ordered-list',
  label: 'Ordered list',
})
@injectable()
export class MCPOrderedListFormatterPlugin extends PluginFormatterBase<IOrderedListData> {
  /**
   * Renders the list.
   * @param data List data
   * @returns List ready for the protocol stream
   */
  async format(data: IOrderedListData): Promise<string> {
    return renderOrderedList(data);
  }
}
