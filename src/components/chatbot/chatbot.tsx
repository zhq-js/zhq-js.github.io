import { ChatbotConversation } from "@/components/chatbot/chatbot-conversation";
import { Card } from "@/components/ui/card";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import TypingText from "@/components/ui/shadcn-io/typing-text";
import { cn } from "@/lib/utils";
import { RefObject, useEffect, useRef, useState } from "react";
import { Document, QueryResult, ScoredDocument, ZHQ } from "zhq";

export function Chatbot({
  documents,
  options,
  zhqRef,
}: {
  documents: Document[];
  options: { topKCandidates: number; threshold: number };
  zhqRef: RefObject<ZHQ | null>;
}) {
  const [input, setInput] = useState("");
  const composingRef = useRef(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hint, setHint] = useState<ScoredDocument | undefined>();
  const hintScore = ((hint?.score ?? 0) * 100).toFixed(2);
  const hintMatched = Number(hintScore) > options.threshold;
  const [messages, setMessages] = useState<{ name: string; value: string }[]>([
    { name: "Assistant", value: "哈囉！請問您想要問些什麼？" },
  ]);

  // --- init
  useEffect(() => {
    queueMicrotask(() => {
      setSuggestions(
        documents.slice(0, options.topKCandidates).map((d) => d.text),
      );
      setHint(undefined);
    });
  }, [documents, options.topKCandidates]);

  // --- query
  const query = (input: string): QueryResult | undefined => {
    if (!zhqRef.current) return;
    const result = zhqRef.current.query(input, {
      threshold: options.threshold / 100,
      topKCandidates: options.topKCandidates,
    });
    return result;
  };

  // --- chat
  const chat = (input: string) => {
    if (!input.trim() || !zhqRef.current) return;

    setMessages((p) => [...p, { name: "Me", value: input }]);
    setInput("");

    const result = query(input);
    if (!result) return;
    const { bestMatch, candidates } = result;

    if (bestMatch) {
      setMessages((p) => [
        ...p,
        { name: "Assistant", value: bestMatch.content },
      ]);
      setSuggestions(candidates.map((c) => c.text));
    } else {
      setMessages((p) => [
        ...p,
        { name: "Assistant", value: `請問您是否想問：` },
      ]);
      setSuggestions(candidates.map((c) => c.text));
    }
  };

  // --- submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    chat(input);
    setHint(undefined);
  };

  const [showTyping, setShowTyping] = useState(true);

  return (
    <div className="bottom-full right-0 size-full shadow-2xl">
      <Card className="size-full py-0">
        {/* Messages */}
        <ChatbotConversation
          messages={messages}
          suggestions={suggestions}
          options={options}
          onSuggestionClick={(suggestion) => chat(suggestion)}
        />

        {/* Input */}
        <PromptInput onSubmit={handleSubmit} className="relative">
          <PromptInputTextarea
            value={input}
            className={cn(input.trim() === "" && "animate-pulse")}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setInput(value);
              const result = query(value);
              if (!result) return;
              const { bestMatch, candidates } = result;
              if (value === "") {
                setHint(undefined);
              } else {
                setHint(bestMatch || candidates[0]);
              }
            }}
            placeholder=""
            onCompositionStart={() => (composingRef.current = true)}
            onCompositionEnd={() => (composingRef.current = false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                if (composingRef.current) return;
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onFocus={() => setShowTyping(false)}
            onBlur={() => setShowTyping(input ? false : true)}
          />
          {showTyping && (
            <div className="absolute top-2 left-4">
              <TypingText
                text={[
                  "請輸入訊息...",
                  "例如：ZHQ是？",
                  "例如：場景？",
                  "也可以直接丟一句話試試看",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="text-sm"
                textColors={["#999", "#999", "#999"]}
                variableSpeed={{ min: 60, max: 160 }}
              />
            </div>
          )}
          <PromptInputToolbar className="h-14">
            <PromptInputTools className="border-t border-black/4 flex-1 mr-2 pt-0.5 h-full">
              {hint && (
                <div className="text-sm text-muted-foreground px-2 flex flex-col gap-0.5">
                  <p className="flex">
                    <span className="w-24">最相似選項：</span>
                    <span className="font-medium">{hint.text}</span>
                  </p>
                  <p className={cn("flex", hintMatched && "text-green-600")}>
                    <span className="w-24">相似分數：</span>
                    <span className="font-medium">{hintScore}%</span>
                    <span>（門檻：{options.threshold}%）</span>
                  </p>
                </div>
              )}
            </PromptInputTools>
            <PromptInputSubmit disabled={!input.trim()} className="size-12" />
          </PromptInputToolbar>
        </PromptInput>
      </Card>
    </div>
  );
}
