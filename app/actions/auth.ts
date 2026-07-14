"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    return { success: false, message: "Server misconfiguration: Admin credentials not set in .env" };
  }

  if (username === validUsername && password === validPassword) {
    // Generate a simple token (in production, use a secure JWT or signed session)
    const token = Buffer.from(`${username}:${new Date().getTime()}`).toString('base64');
    
    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true, message: "Login successful" };
  }

  return { success: false, message: "Username atau password salah." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
