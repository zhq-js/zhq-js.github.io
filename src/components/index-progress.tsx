"use client";

import { Progress } from "@/components/ui/progress";

export default function IndexProgress({ progress = 0 }: { progress: number }) {
  return (
    <div className="w-full ">
      <div className="w-full max-w-md flex flex-col gap-px">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground text-xs w-28">
            {progress < 100 ? "建立索引中..." : "索引建立完畢"}
          </span>
          <span className="font-medium w-12 flex justify-end text-xs">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
}
