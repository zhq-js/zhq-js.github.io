import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import { Slider } from "@/components/ui/slider";
import { SlidersVertical } from "lucide-react";
import { Document } from "zhq";

export function ControlPanel({
  documents,
  options,
  setOptions,
}: {
  documents: Document[];
  options: { topKCandidates: number; threshold: number };
  setOptions: Dispatch<
    SetStateAction<{ topKCandidates: number; threshold: number }>
  >;
}) {
  return (
    <div className="flex flex-col justify-center gap-3 px-6 h-34 ">
      <div className="flex text-muted-foreground items-center gap-1 border rounded-full py-1 px-3 w-fit bg-black/2">
        <SlidersVertical className="size-4" />
        <p className=" text-sm">參數</p>
      </div>
      <div className="flex w-full">
        <div className="w-1/2 flex flex-col gap-5 pr-3">
          <p className="mx-auto text-sm whitespace-nowrap flex w-full">
            相似值：
            <span className="w-9 font-medium">{options.threshold}%</span>
            <span className="truncate text-muted-foreground">
              （低於此值不會顯示結果）
            </span>
          </p>
          <Slider
            value={[options.threshold]}
            onValueChange={(value) =>
              setOptions((p) => ({ ...p, threshold: value[0] }))
            }
          />
        </div>

        <div className="w-1/2 flex flex-col gap-1 pl-3">
          <p className="mx-auto text-sm whitespace-nowrap flex w-full">
            <span>候選數量：</span>
            <span className="font-medium w-8">{options.topKCandidates}</span>
            <span className="truncate text-muted-foreground">
              (依相似度由高至低)
            </span>
          </p>
          <Input
            type="number"
            value={options.topKCandidates}
            min={0}
            max={documents.length}
            className="w-full"
            onChange={(e) =>
              setOptions((p) => ({
                ...p,
                topKCandidates: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
