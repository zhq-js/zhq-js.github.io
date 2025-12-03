// generate-large-docitems.ts
import fs from "node:fs";
import path from "node:path";

const COUNT = 1000; // 想要幾筆就自己改
const outputPath = path.join(process.cwd(), "docItems_10000.json");

function createDocItem(id: number) {
  return {
    key: `這是自動產生的問題 #${id}`,
    content: `這是自動產生的回答內容 #${id}，主要用來測試 zhq 容量與效能。`,
  };
}

const all = [];
for (let i = 1; i <= COUNT; i++) {
  all.push(createDocItem(i));
}

fs.writeFileSync(outputPath, JSON.stringify(all, null, 2), "utf-8");

console.log(`已成功建立 ${COUNT} 筆 Q&A，輸出於：${outputPath}`);
