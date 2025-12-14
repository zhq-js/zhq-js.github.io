"use client";

import { Chatbot } from "@/components/chatbot/chatbot";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { createZhq, Document, ZHQ } from "zhq";
import { Add } from "@/components/add";
import { Header } from "@/components/header";
import { ControlPanel } from "@/components/control-panel";
import { DocumentsTable } from "@/components/documents-table";
import { ChatbotTrigger } from "@/components/chatbot/chatbot-trigger";
import { cn } from "@/lib/utils";

const DOCUMENTS: Document[] = [
  {
    text: "ZHQ是什麼?",
    content: "ZHQ 是一個完全運行於客戶端的中文檢索引擎",
  },
  {
    text: "ZHQ如何索引文檔?",
    content: "呼叫 buildIndex(documents) 即可建立索引。",
  },
  {
    text: "ZHQ查詢方式?",
    content: "使用 query(text) 方法返回最相似的文檔。",
  },
  {
    text: "ZHQ適合什麼場景?",
    content: "ZHQ 適用於問答、搜尋、推薦、文本比對。",
  },
];

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>(DOCUMENTS);
  const [options, setOptions] = useState({ topKCandidates: 3, threshold: 60 });
  const [progress, setProgress] = useState(100);
  const zhqRef = useRef<ZHQ>(null);
  useEffect(() => {
    (async () => {
      const zhq = await createZhq(DOCUMENTS);
      zhqRef.current = zhq;
      zhq.onProgress = (p) => setProgress(Math.round(p * 100));
    })();
  }, []);

  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="w-screen h-dvh bg-primary flex justify-center overflow-hidden">
      <div className="relative flex flex-col items-center size-full">
        {/* Header */}
        <Header />

        <div className="max-w-7xl w-full flex lg:pb-12 px-6 h-[calc(100%-160px)] max-lg:h-[calc(100%-100px)] max-lg:pb-6">
          {/* Left */}
          <Card className="lg:max-w-3/5 flex-1 gap-0 p-0 h-full max-lg:w-full">
            <Add
              zhqRef={zhqRef}
              progress={progress}
              documents={documents}
              setDocuments={setDocuments}
            />
            <Separator />
            <ControlPanel
              options={options}
              setOptions={setOptions}
              documents={documents}
            />
            <Separator />
            <DocumentsTable
              zhqRef={zhqRef}
              documents={documents}
              setDocuments={setDocuments}
            />
          </Card>

          {/* Right */}
          <div
            className={cn(
              !openChat
                ? "max-lg:opacity-0 max-lg:pointer-events-none max-lg:translate-y-24 max-lg:translate-x-8 max-lg:scale-75"
                : "max-lg:opacity-100 max-lg:pointer-events-auto",
              "max-lg:absolute max-lg:top-6 left-0 max-lg:w-full max-lg:px-6 max-lg:h-[calc(100dvh-24px)] max-lg:pb-24 duration-200",
              "lg:max-w-2/5 flex-1 lg:relative flex items-center h-full pl-6",
            )}
          >
            <Chatbot documents={documents} options={options} zhqRef={zhqRef} />
          </div>

          <div className="absolute bottom-4 right-4 lg:hidden shadow-[0_0_9px_3px_rgba(100,100,100,0.35)] rounded-full">
            <ChatbotTrigger onClick={() => setOpenChat((p) => !p)} />
          </div>
        </div>
      </div>
    </div>
  );
}
