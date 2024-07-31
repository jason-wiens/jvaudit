"use client";

import { use, useEffect, useState, useCallback } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TR,
  TableFooter,
} from "@/components/ui/table";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TableRow, ColumnDef } from "./column-def.type";
import { Value } from "@radix-ui/react-select";

export type DataTableProps<T extends TableRow> = {
  data: T[];
  columns: ColumnDef<T>[];
  initialSortField?: ColumnDef<T>["id"];
  initialOrder?: "asc" | "desc";
  onRowClick?: (row: T) => void;
};

export function DataTable<T extends TableRow>({
  data,
  columns,
  initialSortField,
  initialOrder = "asc",
  onRowClick,
}: DataTableProps<T>) {
  const [sortedData, setSortedData] = useState<T[]>(data || []);
  const [sortField, setSortField] = useState<ColumnDef<T>["id"]>(
    initialSortField || columns[0].id
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialOrder);

  const sortData = useCallback(
    (list: T[]) => {
      const valueFns: Record<ColumnDef<T>["id"], ColumnDef<T>["value"]> = {};
      columns.forEach((column) => {
        if (column.value) {
          valueFns[column.id] = column.value;
        }
      });

      return [...list].sort((a, b) => {
        const firstSortValue = valueFns[sortField]!(a);
        const secondSortValue = valueFns[sortField]!(b);

        // if cell value is a date
        if (firstSortValue instanceof Date && secondSortValue instanceof Date) {
          return sortOrder === "asc"
            ? firstSortValue.getTime() - secondSortValue.getTime()
            : secondSortValue.getTime() - firstSortValue.getTime();
        }

        // if cell value is a string
        if (
          typeof firstSortValue === "string" &&
          typeof secondSortValue === "string"
        ) {
          return sortOrder === "asc"
            ? firstSortValue.toLowerCase() > secondSortValue.toLowerCase()
              ? 1
              : -1
            : firstSortValue.toLowerCase() < secondSortValue.toLowerCase()
            ? 1
            : -1;
        }

        // if cell value is a number
        if (
          typeof firstSortValue === "number" &&
          typeof secondSortValue === "number"
        ) {
          return sortOrder === "asc"
            ? firstSortValue - secondSortValue
            : secondSortValue - firstSortValue;
        }

        // unknown type
        console.log(
          `Unexpected type of cell value, firstValue type: ${typeof firstSortValue}, secondValue type: ${typeof secondSortValue}`
        );
        return 0;
      });
    },
    [sortField, sortOrder]
  );

  useEffect(() => {
    setSortedData((prev) => sortData(prev));
  }, [sortField, sortOrder]);

  useEffect(() => {
    setSortedData(sortData(data));
  }, [data]);

  return (
    <Table>
      <TableHeader>
        <TR>
          {columns.map((column, index) => (
            <TableHead key={index}>
              <span
                className={cn(
                  "flex items-center gap-2 text-base",
                  column.sortable && "cursor-pointer hover:text-accent-500",
                  sortField === column.id && "text-secondary-500",
                  column.align === "center" && "justify-center",
                  column.align === "right" && "justify-end"
                )}
                onClick={() => {
                  if (column.sortable) {
                    setSortField(column.id);
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }
                }}
              >
                {column.renderHeader
                  ? column.renderHeader(column.label)
                  : column.label}
                {column.sortable && <ChevronsUpDown size={16} />}
              </span>
            </TableHead>
          ))}
        </TR>
      </TableHeader>
      <TableBody>
        {sortedData.map((row, rowIndex) => (
          <TR
            key={rowIndex}
            onClick={() => !!onRowClick && onRowClick(row)}
            className={cn(!!onRowClick && "cursor-pointer")}
          >
            {columns.map((column, columnIndex) => (
              <TableCell key={columnIndex}>{column.renderCell(row)}</TableCell>
            ))}
          </TR>
        ))}
      </TableBody>
      <TableFooter>
        <TR>
          {columns.map((column, index) => (
            <TableCell key={index}>
              {column.renderFooter ? column.renderFooter() : null}
            </TableCell>
          ))}
        </TR>
      </TableFooter>
    </Table>
  );
}
