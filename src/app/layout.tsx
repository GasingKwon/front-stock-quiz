import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "주식 퀴즈 게임",
  description: "주식 관련 퀴즈 게임을 즐겨보세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
