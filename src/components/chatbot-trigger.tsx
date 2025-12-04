import { Button } from "@/components/ui/button";
import { HTMLAttributes } from "react";

export function ChatbotTrigger({
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      variant={"secondary"}
      className="rounded-full size-20  cursor-pointer"
      {...props}
    >
      🤖 問我
    </Button>
  );
}
