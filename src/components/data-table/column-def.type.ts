export type SortableCellValue = number | string | Date;
export type Field = string;
export type TableRow = Record<Field, any>;

export type ColumnDef<T extends TableRow> = {
  id: string;
  label: string;
  renderHeader?: (label: string) => JSX.Element;
  renderFooter?: () => JSX.Element;
  skeleton?: () => JSX.Element;
  align?: "left" | "center" | "right";
  renderCell: (row: T) => JSX.Element | null;
  searchableValue?: (row: T) => String;
  sortableValue?: (row: T) => SortableCellValue;
};
