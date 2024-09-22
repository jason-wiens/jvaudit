"use client";

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
import { Skeleton } from "../ui/skeleton";

export type DataTableProps<T extends TableRow> = {
  columns: ColumnDef<T>[];
  numRows?: number;
  searchable?: boolean;
  showFooter?: boolean;
};

export function SkeletonTable<T extends TableRow>({
  columns,
  numRows = 4,
  searchable = false,
  showFooter = false,
}: DataTableProps<T>) {
  return (
    <>
      <div className="flex justify-between items-end mb-2">
        {searchable && (
          <div className="w-full flex relative justify-start items-center">
            <Search className="text-secondary-500 absolute left-2" size="16" />
            <Input
              className="w-full max-w-sm pl-8 pr-2 py-2 text-sm leading-3 h-auto"
              placeholder="Search"
            />
          </div>
        )}
      </div>
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
                    column.align === "center" && "justify-center",
                    column.align === "right" && "justify-end"
                  )}
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
          {Array.from({ length: numRows }, (_, index) => index).map(
            (rowIndex) => (
              <TR key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={columnIndex}>
                    {column.skeleton ? (
                      column.skeleton()
                    ) : (
                      <Skeleton className="w-14 h-6 rounded" />
                    )}
                  </TableCell>
                ))}
              </TR>
            )
          )}
        </TableBody>
        {showFooter && (
          <TableFooter>
            <TR>
              <TableCell colSpan={columns.length}>
                <div className="h-6 w-1 bg-transparent"></div>
              </TableCell>
            </TR>
          </TableFooter>
        )}
      </Table>
    </>
  );
}
