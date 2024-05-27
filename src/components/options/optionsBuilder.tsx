import { PanelOptionsEditorBuilder, StandardEditorContext } from '@grafana/data';
import { SimpleOptions } from 'types';
import { ColumnWidthHintsEditor } from './ColumnWidthHintsEditor';
import { ColumnRenderEditor } from './ColumnRenderEditor';

export async function optionsBuilder(
  builder: PanelOptionsEditorBuilder<SimpleOptions>,
  builderContext: StandardEditorContext<SimpleOptions>
) {
  builder.addBooleanSwitch({
    category: ['Table'],
    path: 'paging',
    name: 'Paging(分页)',
    defaultValue: true
  });
  builder.addBooleanSwitch({
    category: ['Table'],
    path: 'ordering',
    name: 'Ordering(排序)',
    defaultValue: true
  });
  builder.addBooleanSwitch({
    category: ['Table'],
    path: 'autoWidth',
    name: 'AutoWidth(自动宽度)',
    defaultValue: true
  });
  builder.addCustomEditor({
    category: ['Column Width Hints'],
    path: 'columnWidthHints',
    id: 'columnWidthHints',
    name: 'Column Width Hints',
    editor: ColumnWidthHintsEditor,
  });

  builder.addCustomEditor({
    category: ['Column Render'],
    path: 'columnRender',
    id: 'columnRender',
    name: 'Column Render',
    editor: ColumnRenderEditor,
  });

}
