import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/app/components/Sidebar";

export const metadata: Metadata = {
  title: "Jurnal Manager — Sistem Manajemen & Keuangan Jurnal",
  description:
    "Aplikasi manajemen jurnal akademik dan sistem keuangan untuk pengelolaan honor editor, reviewer, dan pengajuan dana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Sidebar />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
