import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { siteUrl } from "@/lib/format";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Class Deadline Hub", template: "%s | Class Deadline Hub" },
  description: "Cổng tra cứu deadline của lớp: bài tập, báo cáo, kiểm tra của 4 môn học.",
  openGraph: { siteName: "Class Deadline Hub", locale: "vi_VN", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
