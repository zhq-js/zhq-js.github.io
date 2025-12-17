import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: "https://zhq-js.github.io",
  title: "ZHQ | 互動式問答 Chatbot",
  description:
    "基於 BM25 與 Jieba 斷詞 的中文檢索引擎，完全運行於客戶端，適用於 問答、搜尋、內容推薦、文本比對。",
  openGraph: { images: "/og-image.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="size-full">
      <body className={`antialiased size-full`}>{children}</body>
    </html>
  );
}
