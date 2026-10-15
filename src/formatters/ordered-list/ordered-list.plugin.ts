import { injectable } from 'inversify';
import { NodePlugin } from '@orion76/node-plugin';

import { PLUGIN_FORMATTER_TYPE } from '../../constants';
import type { IPluginFormatterDefinitionData } from '../../types/formatter';
import { PluginFormatterBase } from '../formatter.base';
import { renderOrderedList } from './lib';
import type { IOrderedListData } from './types';

/**
 * Formatter plugin that renders a todo-shaped list: a title, an optional
 * description and numbered or bulleted items.
 */
@NodePlugin<IPluginFormatterDefinitionData<'ordered-list'>>({
  type: PLUGIN_FORMATTER_TYPE,
  id: 'ordered-list',
  label: 'Ordered list',
  kind: 'ordered-list',
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
