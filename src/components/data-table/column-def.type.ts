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

// type SortableColumnDef<T extends TableRow> = BaseColumnDef<T> & {
//   sortable: true;
//   searchable?: boolean;
//   value: (row: T) => SortableCellValue;
// };

// type NonSortableColumnDef<T extends TableRow> = BaseColumnDef<T> & {
//   sortable?: false;
//   value?: never;
// };

// type SearchableColumnDef<T extends TableRow> = BaseColumnDef<T> & {
//   searchable: true;
//   value: (row: T) => String;
// };

// type NonSearchableColumnDef<T extends TableRow> = BaseColumnDef<T> & {
//   searchable?: false;
//   value?: never;
// };

// export type ColumnDef<T extends TableRow> =
//   | SortableColumnDef<T>
//   | NonSortableColumnDef<T>
//   | SearchableColumnDef<T>
//   | NonSearchableColumnDef<T>;
