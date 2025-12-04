"use client";

import { Chatbot } from "@/components/chatbot";
import { ChatbotTrigger } from "@/components/chatbot-trigger";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Activity, FormEvent, useEffect, useRef, useState } from "react";
import { createZhq, DocItem, ZHQ } from "zhq";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Github, MousePointer2, Pointer, X } from "lucide-react";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";

const DEFAULT_DOC_ITEMS: DocItem[] = [
  {
    key: "ZHQ是什麼?",
    content: "ZHQ 是一個完全運行於客戶端的中文檢索引擎",
  },
  {
    key: "ZHQ如何索引文檔?",
    content: "呼叫 buildIndex(docItems) 即可建立索引。",
  },
  { key: "ZHQ查詢方式?", content: "使用 query(text) 方法返回最相似的文檔。" },
  {
    key: "ZHQ適合什麼場景?",
    content: "ZHQ 適用於問答、搜尋、推薦、文本比對。",
  },
];

export default function Home() {
  const [isOpenChatBot, setIsOpenChatBot] = useState(false);

  const [docItems, setDocItems] = useState<DocItem[]>(DEFAULT_DOC_ITEMS);
  const [newDoc, setNewDoc] = useState({ key: "", content: "" });
  const [options, setOptions] = useState({ topKCandidates: 3, threshold: 60 });

  const zhqRef = useRef<ZHQ>(null);

  useEffect(() => {
    (async () => (zhqRef.current = await createZhq(docItems)))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (newDoc.key.trim() === "" || newDoc.content.trim() === "") return;
    if (docItems.some((d) => d.key === newDoc.key)) return;
    setDocItems((p) => [...p, newDoc]);
    setNewDoc({ key: "", content: "" });
  };

  return (
    <div className="w-full h-full bg-primary pt-12 flex justify-center overflow-y-auto">
      <div className="relative flex flex-col gap-12 items-center max-w-3xl w-[90vw]">
        <div className="flex flex-col items-center text-primary-foreground gap-4">
          <h1 className="w-fit text-4xl">ZHQ</h1>
          <Link
            href={"https://github.com/yiming-liao/zhq"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:animate-spin"
          >
            <Github />
          </Link>
          <p className="text-primary-foreground/75 font-medium">
            問答 Chatbot 範例
          </p>
        </div>

        <div className="w-full flex max-md:flex-col gap-6 items-end">
          <Card className="w-full">
            <p className="mx-auto text-muted-foreground text-sm px-6">
              新增或修改文檔後，重新開啟 Chatbot，ZHQ 就會自動重建索引。
            </p>
            <form onSubmit={handleAdd} className="flex flex-col gap-3 px-6">
              <Input
                placeholder="問題"
                value={newDoc.key}
                onChange={(e) =>
                  setNewDoc((p) => ({ ...p, key: e.target.value }))
                }
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

            <Separator />

            <div className="flex gap-6 px-6">
              <div className="flex-1 flex flex-col gap-5">
                <p className="text-muted-foreground text-sm">
                  相似值：{options.threshold}
                  （最相近的結果需要超過這個值才會回應）
                </p>
                <Slider
                  value={[options.threshold]}
                  onValueChange={(value) =>
                    setOptions((p) => ({ ...p, threshold: value[0] }))
                  }
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p className="text-muted-foreground text-sm">
                  最相似候選數量：{options.topKCandidates}
                  （回傳幾個最相似的候選 / 建議）
                </p>
                <Input
                  type="number"
                  value={options.topKCandidates}
                  min={0}
                  onChange={(e) =>
                    setOptions((p) => ({
                      ...p,
                      topKCandidates: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <Separator />

            {/* List */}
            <div className="flex flex-col gap-2 max-h-96 overflow-hidden px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20"></TableHead>
                    <TableHead>問題</TableHead>
                    <TableHead>回答</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docItems.map(({ key, content }, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Button
                          disabled={docItems.length === 1}
                          size={"icon-sm"}
                          className="cursor-pointer"
                          onClick={() => {
                            setDocItems((p) =>
                              p.filter((el) => el.key !== key),
                            );
                          }}
                        >
                          <X />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{content}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Chat bot */}
          <div className="relative flex items-center ">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2  text-white">
              <Pointer className="opacity-75 size-5 animate-bounce" />
            </div>
            <div className="relative">
              <Activity mode={isOpenChatBot ? "visible" : "hidden"}>
                <Chatbot
                  docItems={docItems}
                  options={options}
                  zhqRef={zhqRef}
                />
              </Activity>
              <ChatbotTrigger
                onClick={() => {
                  if (!isOpenChatBot) {
                    zhqRef.current?.buildIndex(docItems);
                  }
                  setIsOpenChatBot((p) => !p);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
