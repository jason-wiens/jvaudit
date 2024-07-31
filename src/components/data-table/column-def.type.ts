export type SortableCellValue = number | string | Date;
export type Field = string;
export type TableRow = Record<Field, any>;

type BaseColumnDef<T extends TableRow> = {
  id: string;
  label: string;
  renderHeader?: (label: string) => JSX.Element;
  renderFooter?: () => JSX.Element;
  skeleton?: () => JSX.Element;
  searchable?: boolean;
  align?: "left" | "center" | "right";
  renderCell: (row: T) => JSX.Element | null;
};

type SortableColumnDef<T extends TableRow> = BaseColumnDef<T> & {
  sortable: true;
  value: (row: T) => SortableCellValue;
};

type NonSortableColumnDef<T extends TableRow> = BaseColumnDef<T> & {
  sortable?: false;
  value?: never;
};

export type ColumnDef<T extends TableRow> =
  | SortableColumnDef<T>
  | NonSortableColumnDef<T>;
