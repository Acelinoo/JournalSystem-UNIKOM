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
  const token = cookieStore.get("admin_session")?.value;
  
  let role = "ADMIN";
  let nama = "Pengelola";
  
  if (token) {
    try {
      const jsonString = Buffer.from(token, 'base64').toString('utf-8');
      const user = JSON.parse(jsonString);
      role = user.role || "ADMIN";
      nama = user.nama || "Pengelola";
    } catch (e) {
      // Ignore
    }
  }

  return (
    <html lang="id">
      <body>
        {token && <Sidebar role={role} nama={nama} />}
        <main className={token ? "main-content" : "w-full min-h-screen"}>{children}</main>
      </body>
    </html>
  );
}
