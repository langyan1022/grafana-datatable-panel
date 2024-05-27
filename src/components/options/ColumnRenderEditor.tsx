import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Box, Button, IconButton, InlineField, Field,Input, Select, Stack,CodeEditor } from '@grafana/ui';
import React from 'react';
import { getDataFramesFields } from 'transformations';
import { ColumnRender } from 'types';

export function ColumnRenderEditor(props: StandardEditorProps<ColumnRender[]>) {
  const { onChange, value = [] } = props;
  const dataFields = getDataFramesFields(props.context.data);
  const availableFields = dataFields.reduce<SelectableValue[]>((acc, field) => {
    // Filter out fields that already have an width
    if (value.find((item) => item.name === field)) {
      return acc;
    }
    acc.push({ value: field, label: field });
    return acc;
  }, []);

  function handleNewColumnRender() {
    onChange([...value, { name: '', render: '' }]);
  }

  function handleRemoveColumnRender(index: number) {
    onChange([...value.slice(0, index), ...value.slice(index + 1)]);
  }

  function handleSelectChange(event: SelectableValue, selectIndex: number) {
    const newRenders = value.map((item: ColumnRender, index: number) => {
      if (index === selectIndex) {
        return { name: event.value, render: item.render };
      }
      return item;
    });
    onChange(newRenders);
  }

  function handleRenderChange(itemName: string, code: string) {
    const newRenders = value.map((item: ColumnRender) => {
        if (item.name === itemName) {
          return { ...item, render: code }; // 更新当前列名的 render 属性
        }
        return item;
      });
      onChange(newRenders); // 调用 onChange 更新状态
  }

  const currentRenders = value.map((item: ColumnRender, index: number) => {
    const options = item.name === '' ? availableFields : [...availableFields, { value: item.name, label: item.name }];
    // TODO: fix the styling so all fields align. Currently
    return (
        <div key={index} style={{ width: '100%' }}>
            <Stack direction="row" alignItems="center" >
            <InlineField label="Column" tooltip="The column to apply render to">
              <Select
                width={25}
                options={options}
                aria-label={`Current selected column ${item.name}`}
                value={item.name || ''}
                onChange={(event) => handleSelectChange(event, index)}
              />
            </InlineField>
            <IconButton name="trash-alt" aria-label="Remove column" onClick={() => handleRemoveColumnRender(index)} />
          </Stack>
          <Field label="The render(function or string template) to apply. ">
            <CodeEditor
              language="javascript" 
              value={item.render || ''}
              height="200px"
              width="100%"
              showLineNumbers
              onBlur={(code)=> handleRenderChange(item.name ,code)}
            />
          </Field>
      </div>      
    );
  });

  return (
    <div>
      {currentRenders}
      <Box marginTop={1}>
        <Button variant="secondary" icon="plus" onClick={handleNewColumnRender}>
          Add Column Render
        </Button>
      </Box>
    </div>
  );
}
