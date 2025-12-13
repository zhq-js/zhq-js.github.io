import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function ChatbotTrigger({
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant={"secondary"}
      className={cn(className, "rounded-full size-16 cursor-pointer")}
      {...props}
    >
      <span className="scale-150">🤖</span>
    </Button>
  );
}
