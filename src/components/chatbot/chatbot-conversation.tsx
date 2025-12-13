import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/shadcn-io/ai/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/shadcn-io/ai/message";
import {
  Suggestion,
  Suggestions,
} from "@/components/ui/shadcn-io/ai/suggestion";
import { cn } from "@/lib/utils";

export function ChatbotConversation({
  messages,
  suggestions,
  options,
  onSuggestionClick,
}: {
  messages: { name: string; value: string }[];
  suggestions: string[];
  options: { topKCandidates: number; threshold: number };
  onSuggestionClick: (suggestion: string) => void;
}) {
  return (
    <Conversation className="relative size-full" style={{ height: "498px" }}>
      <ConversationContent>
        {messages.map(({ name, value }, index) => {
          const isLast = messages.length - 1 === index;
          return (
            <div key={index}>
              <Message
                from={index % 2 === 1 ? "user" : "assistant"}
                className="py-2.5"
              >
                <MessageContent className="whitespace-pre-line">
                  {value}
                </MessageContent>
                <MessageAvatar
                  name={name === "Me" ? "Me" : "🤖"}
                  src={""}
                  className={cn(
                    isLast && name === "Assistant" && "animate-bounce ",
                  )}
                />
              </Message>
              {isLast && (
                <Suggestions className="flex h-8">
                  <p className="w-8 text-sm text-muted-foreground/50 flex justify-center">
                    {options.topKCandidates}
                  </p>
                  {isLast &&
                    suggestions.map((suggestion, index) => (
                      <Suggestion
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        suggestion={suggestion}
                      />
                    ))}
                </Suggestions>
              )}
            </div>
          );
        })}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
