import { Card } from "@/components/ui/card";
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
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import {
  Suggestion,
  Suggestions,
} from "@/components/ui/shadcn-io/ai/suggestion";
import { RefObject, useEffect, useRef, useState } from "react";
import { DocItem, ZHQ } from "zhq";

export function Chatbot({
  docItems,
  zhqRef,
}: {
  docItems: DocItem[];
  zhqRef: RefObject<ZHQ | null>;
}) {
  const [input, setInput] = useState("");
  const composingRef = useRef(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  useEffect(() => {
    queueMicrotask(() =>
      setSuggestions(docItems.slice(0, 3).map((d) => d.key)),
    );
  }, [docItems]);

  const [messages, setMessages] = useState<{ value: string; name: string }[]>([
    { value: "哈囉！請問您想要問些什麼？", name: "Assistant" },
  ]);

  const chat = (input: string) => {
    if (!input.trim()) return;
    if (!zhqRef.current) return;

    setMessages((p) => [...p, { name: "Me", value: input }]);
    setInput("");

    const { bestMatch, candidates } = zhqRef.current.query(input, {
      threshold: 0.5,
    });
    if (bestMatch) {
      setMessages((p) => [
        ...p,
        { name: "Assistant", value: bestMatch.content },
      ]);
      setSuggestions(candidates.map((c) => c.key));
    } else {
      setMessages((p) => [
        ...p,
        { name: "Assistant", value: `請問您是否想問：` },
      ]);
      setSuggestions(candidates.map((c) => c.key));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    chat(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    chat(suggestion);
  };

  return (
    <div className="absolute bottom-full right-0 w-96 h-[600px] pb-6 shadow-2xl">
      <Card className="size-full py-0">
        {/* Messages */}
        <Conversation
          className="relative size-full"
          style={{ height: "498px" }}
        >
          <ConversationContent>
            {messages.map(({ value, name }, index) => {
              const isLast = messages.length - 1 === index;
              return (
                <div key={index}>
                  <Message from={index % 2 === 1 ? "user" : "assistant"}>
                    <MessageContent className="whitespace-pre-line">
                      {value}
                    </MessageContent>
                    <MessageAvatar
                      name={name === "Me" ? "Me" : "🤖"}
                      src={""}
                    />
                  </Message>
                  <Suggestions className="ml-10">
                    {isLast &&
                      suggestions.map((suggestion) => (
                        <Suggestion
                          key={suggestion}
                          onClick={handleSuggestionClick}
                          suggestion={suggestion}
                        />
                      ))}
                  </Suggestions>
                </div>
              );
            })}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input */}
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Type your message..."
            onCompositionStart={() => {
              composingRef.current = true;
            }}
            onCompositionEnd={() => {
              composingRef.current = false;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                if (composingRef.current) return;
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <PromptInputToolbar>
            <PromptInputTools></PromptInputTools>
            <PromptInputSubmit disabled={!input.trim()} />
          </PromptInputToolbar>
        </PromptInput>
      </Card>
    </div>
  );
}
