export interface SimpleOptions {
  columnRender: ColumnRender[];
  columnWidthHints:ColumnWidthHint[];
  paging:boolean;
  ordering:boolean;
  autoWidth:boolean;
}
export type ColumnRender = {
    name: string;
    render: string;
  };

export type ColumnWidthHint = {
  name: string;
  width: string;
};
