"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  clearAdminSessionCookie,
  hasValidAdminSession
} from "@/lib/adminAuth";
import { softDeleteEvent } from "@/lib/data/events";
import { validateUuid } from "@/lib/validation";

async function requireAdminSession() {
  if (!(await hasValidAdminSession())) {
    redirect("/admin/login");
  }
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireAdminSession();

  const eventId = formData.get("eventId");
  const validation = typeof eventId === "string"
    ? validateUuid(eventId, "Planerings-ID")
    : { ok: false as const, error: "Ogiltigt planerings-ID." };

  if (!validation.ok) {
    redirect("/admin");
  }

  await softDeleteEvent(validation.value);
  revalidatePath("/admin");
  revalidatePath(`/event/${validation.value}`);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
