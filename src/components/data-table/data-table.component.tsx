"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TR,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TableRow, ColumnDef } from "./column-def.type";
import { Search } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export type DataTableProps<T extends TableRow> = {
  data: T[];
  columns: ColumnDef<T>[];
  rowIdKey: keyof T;
  initialSortField?: ColumnDef<T>["id"];
  initialOrder?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  maxHeight?: number;
  children?: React.ReactNode;
  selectSearchOnRender?: boolean;
};

export function DataTable<T extends TableRow>({
  data,
  columns,
  rowIdKey,
  initialSortField,
  initialOrder = "asc",
  onRowClick,
  searchable = false,
  maxHeight,
  children,
  selectSearchOnRender = false,
}: DataTableProps<T>) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [filteredData, setFilteredData] = useState<T[]>(data || []);
  const [sortField, setSortField] = useState<ColumnDef<T>["id"]>(
    initialSortField || columns[0].id
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialOrder);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setFilteredData(
      data.filter((item) => {
        for (let i = 0; i < columns.length; i++) {
          if (
            columns[i].searchableValue &&
            columns[i].searchableValue!(item).includes(searchTerm)
          ) {
            return true;
          }
        }
        return false;
      })
    );
  }, [searchTerm]);

  const sortData = useCallback(
    (list: T[]) => {
      const valueFns: Record<
        ColumnDef<T>["id"],
        ColumnDef<T>["sortableValue"]
      > = {};
      columns.forEach((column) => {
        if (column.sortableValue) {
          valueFns[column.id] = column.sortableValue;
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
    setFilteredData((prev) => sortData(prev));
  }, [sortField, sortOrder]);

  useEffect(() => {
    setFilteredData(sortData(data));
  }, [data]);

  useEffect(() => {
    if (searchRef.current && searchable && selectSearchOnRender) {
      searchRef.current.focus();
    }
  }, []);

  const TableLayout = (
    <Table>
      <TableHeader className="bg-zinc-50">
        <TR>
          {columns.map((column, index) => (
            <TableHead key={index}>
              <span
                className={cn(
                  "flex items-center gap-2 text-base",
                  !!column.sortableValue &&
                    "cursor-pointer hover:text-accent-500",
                  sortField === column.id && "text-secondary-500",
                  column.align === "center" && "justify-center",
                  column.align === "right" && "justify-end"
                )}
                onClick={() => {
                  if (!!column.sortableValue) {
                    setSortField(column.id);
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }
                }}
              >
                {column.renderHeader
                  ? column.renderHeader(column.label)
                  : column.label}
                {!!column.sortableValue && <ChevronsUpDown size={16} />}
              </span>
            </TableHead>
          ))}
        </TR>
      </TableHeader>
      <TableBody>
        {filteredData.map((row) => (
          <TR
            key={row[rowIdKey]}
            onClick={() => !!onRowClick && onRowClick(row)}
            className={cn(!!onRowClick && "cursor-pointer")}
          >
            {columns.map((column, columnIndex) => (
              <TableCell key={columnIndex} className="text-base">
                {column.renderCell(row)}
              </TableCell>
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

  return (
    <>
      <div className="flex justify-between items-end mb-2">
        {searchable && (
          <div className="w-full flex relative justify-start items-center">
            <Search className="text-secondary-500 absolute left-2" size="16" />
            <Input
              ref={searchRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-sm pl-8 pr-2 py-2 text-sm leading-3 h-auto"
              placeholder="Search"
            />
          </div>
        )}
        {!!children && children}
      </div>
      {!!maxHeight ? (
        <ScrollArea className={`h-[${maxHeight}px]`}>{TableLayout}</ScrollArea>
      ) : (
        TableLayout
      )}
    </>
  );
}
