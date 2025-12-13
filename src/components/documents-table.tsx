"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Files, Sparkles, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Document } from "zhq";
import * as XLSX from "xlsx";
import { Separator } from "@/components/ui/separator";

export function DocumentsTable({
  documents,
  setDocuments,
}: {
  documents: Document[];
  setDocuments: Dispatch<SetStateAction<Document[]>>;
}) {
  function exportDocumentsToXlsx(
    documents: { text: string; content: string }[],
    filename = "zhq-documents.xlsx",
  ) {
    const worksheet = XLSX.utils.json_to_sheet(documents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");
    XLSX.writeFile(workbook, filename);
  }

  return (
    <div className="flex flex-col gap-2 overflow-hidden px-6 h-[calc(100%-250px)]">
      <div className="relative flex text-muted-foreground items-center gap-1 pt-4">
        <Separator className="max-w-9 ml-1 mr-2" />
        <Files className="size-4" />
        <p className=" text-sm">文檔</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20"></TableHead>
            <TableHead>問題</TableHead>
            <TableHead>回答</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map(({ text, content }, index) => (
            <TableRow key={index}>
              <TableCell>
                <Button
                  disabled={documents.length === 1}
                  size={"icon-sm"}
                  variant={"outline"}
                  onClick={() => {
                    setDocuments((p) => p.filter((el) => el.text !== text));
                  }}
                >
                  <X />
                </Button>
              </TableCell>
              <TableCell className="font-medium">{text}</TableCell>
              <TableCell>{content}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex text-muted-foreground mt-auto mx-auto py-4 mb-1 border-t w-full gap-3">
        <Button size={"sm"} onClick={() => exportDocumentsToXlsx(documents)}>
          <Download />
          下載
        </Button>
        <p className="text-sm flex gap-1 items-center opacity-75 w-fit">
          <Sparkles className="size-3 animate-bounce" />
          <span className="line-clamp-1 flex-1">
            您可以下載目前的 Excel 檔案(.xlsx)，並依照既有格式編輯後再重新上傳。
          </span>
        </p>
      </div>
    </div>
  );
}
