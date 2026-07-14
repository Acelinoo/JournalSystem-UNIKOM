import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/app/components/Sidebar";

export const metadata: Metadata = {
  title: "Jurnal Manager — Sistem Manajemen & Keuangan Jurnal",
  description:
    "Aplikasi manajemen jurnal akademik dan sistem keuangan untuk pengelolaan honor editor, reviewer, dan pengajuan dana.",
};

import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("admin_session");

  return (
    <html lang="id">
      <body>
        {isAuthenticated && <Sidebar />}
        <main className={isAuthenticated ? "main-content" : "w-full min-h-screen"}>{children}</main>
      </body>
    </html>
  );
}
