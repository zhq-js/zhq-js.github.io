import IndexProgress from "@/components/index-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FilePlus } from "lucide-react";
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Document, ZHQ } from "zhq";

export function Add({
  zhqRef,
  progress,
  documents,
  setDocuments,
}: {
  zhqRef: RefObject<ZHQ | null>;
  progress: number;
  documents: Document[];
  setDocuments: Dispatch<SetStateAction<Document[]>>;
}) {
  const [newDoc, setNewDoc] = useState<Document>({ text: "", content: "" });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (newDoc.text.trim() === "" || newDoc.content.trim() === "") return;
    if (documents.some((d) => d.text === newDoc.text)) return;
    setDocuments((p) => {
      const newDocs = [...p, newDoc];
      zhqRef.current?.buildIndexAsync(newDocs); // build index
      return newDocs;
    });
    setNewDoc({ text: "", content: "" });
  };

  async function handleImportXlsx(file: File) {
    const XLSX = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });
    const importedDocs: Document[] = rows
      .map((row) => {
        const [text, content] = row ?? [];
        if (typeof text !== "string" || typeof content !== "string") {
          return null;
        }
        return { text: text.trim(), content: content.trim() };
      })
      .filter(
        (d): d is Document =>
          !!d &&
          d.text !== "" &&
          d.content !== "" &&
          !documents.some((existing) => existing.text === d.text),
      );
    if (importedDocs.length > 0)
      setDocuments(() => {
        zhqRef.current?.buildIndexAsync(importedDocs); // build index
        return importedDocs;
      });
  }

  return (
    <div className="flex flex-col px-6 gap-3 h-28 justify-center">
      <div className="flex gap-4 items-center">
        <div className="flex text-muted-foreground items-center gap-1 border rounded-full py-1 px-3 w-fit bg-black/2">
          <FilePlus className="size-4" />
          <p className=" text-sm">新增</p>
        </div>
        <div>
          <IndexProgress progress={progress} />
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <form onSubmit={handleAdd} className="flex gap-3 flex-1 max-lg:hidden">
          <Input
            placeholder="問題"
            value={newDoc.text}
            onChange={(e) => setNewDoc((p) => ({ ...p, text: e.target.value }))}
          />
          <Input
            placeholder="回答"
            value={newDoc.content}
            onChange={(e) =>
              setNewDoc((p) => ({ ...p, content: e.target.value }))
            }
          />
          <Button className="ml-auto">新增</Button>
        </form>

        <Separator orientation="vertical" className="max-lg:hidden" />

        <Button variant={"outline"} onClick={() => inputRef.current?.click()}>
          上傳 Excel (.xlsx)
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            handleImportXlsx(file);
            e.currentTarget.value = "";
          }}
        />
      </div>
    </div>
  );
}
