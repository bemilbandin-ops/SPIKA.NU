export function getAbsoluteUrl(path: string): string | null {
  try {
    const url = new URL(path, process.env.NEXT_PUBLIC_SITE_URL);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {}

  console.warn("NEXT_PUBLIC_SITE_URL is missing or invalid.");
  return null;
}

export async function sendNotificationEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("Resend email configuration is missing.");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html
      })
    });

    if (!response.ok) {
      console.error("Resend rejected notification email.", {
        status: response.status
      });
    }

    return response.ok;
  } catch (error) {
    console.error("Failed to send notification email.", {
      message: error instanceof Error ? error.message : String(error)
    });
    return false;
  }
}
