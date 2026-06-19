"use server";

import { redirect } from "next/navigation";

import { unsubscribeFromEventNotifications } from "@/lib/data/subscribers";
import { getValidatedValue, validateUuid } from "@/lib/validation";

export async function unsubscribeAction(formData: FormData): Promise<never> {
  const id = getValidatedValue(
    validateUuid(String(formData.get("id") ?? ""), "Prenumerations-ID")
  );

  await unsubscribeFromEventNotifications(id);
  redirect(`/notifications/unsubscribe/${id}?done=1`);
}
