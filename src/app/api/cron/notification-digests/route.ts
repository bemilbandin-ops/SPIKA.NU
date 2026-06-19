import { sendDueNotificationDigests } from "@/lib/notifications/digests";

export async function handleDigestCron(
  request: Request,
  send = sendDueNotificationDigests
): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return Response.json(await send());
  } catch (error) {
    console.error("Failed to process notification digests.", error);
    return Response.json({ error: "Digest processing failed" }, { status: 500 });
  }
}

export function GET(request: Request): Promise<Response> {
  return handleDigestCron(request);
}
