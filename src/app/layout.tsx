import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "SB 悬赏平台",
  description: "悬赏任务 + 八卦社区",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 min-h-screen">
        <TopNav />
        <div className="max-w-7xl mx-auto flex">
          <Sidebar />
          <main className="flex-1 min-w-0 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
