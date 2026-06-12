"use server";

import { redirect } from "next/navigation";

import {
  isCorrectAdminPassword,
  setAdminSessionCookie
} from "@/lib/adminAuth";

export async function loginAction(formData: FormData): Promise<void> {
  const password = formData.get("password");

  if (
    typeof password !== "string" ||
    !isCorrectAdminPassword(password) ||
    !(await setAdminSessionCookie())
  ) {
    redirect("/admin/login?error=invalid");
  }

  redirect("/admin");
}
