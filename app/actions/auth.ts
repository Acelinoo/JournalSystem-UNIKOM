"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

const COOKIE_NAME = "admin_session";

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, message: "Username dan password harus diisi." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return { success: false, message: "Username atau password salah." };
    }

    // Encode user info as Base64 JSON string for the session token
    const sessionData = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
      editorId: user.editorId,
      reviewerId: user.reviewerId
    };
    const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    
    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true, message: "Login successful", role: user.role };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat login." };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
