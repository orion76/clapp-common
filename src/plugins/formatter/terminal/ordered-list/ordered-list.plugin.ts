import { NodePlugin } from '@orion76/node-plugin';
import { injectable } from 'inversify';

import type { IOrderedListData } from '@clapp/common';
import { PLUGIN_FORMATTER_TYPE, PluginFormatterBase, type IPluginFormatterDefinitionData } from '@clapp/common';

import { renderOrderedList } from './lib';

/**
 * Formatter plugin that renders a todo-shaped list: a title, an optional
 * description and numbered or bulleted items.
 */
@NodePlugin<IPluginFormatterDefinitionData>({
  type: PLUGIN_FORMATTER_TYPE,
  id: 'ordered-list',
  label: 'Ordered list',
})
@injectable()
export class OrderedListFormatterPlugin extends PluginFormatterBase<IOrderedListData> {
  /**
   * Renders the list.
   * @param data List data
   * @returns List ready for the terminal
   */
  async format(data: IOrderedListData): Promise<string> {
    return renderOrderedList(data);
  }
}
