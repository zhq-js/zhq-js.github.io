import { Button } from "@/components/ui/button";
import { HTMLAttributes } from "react";

export function ChatbotTrigger({
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant={"secondary"}
      className="rounded-full size-20 shadow-[0_0_12px_-1px_var(--color-amber-400)] cursor-pointer"
      {...props}
    >
      🤖 問我
    </Button>
  );
}
