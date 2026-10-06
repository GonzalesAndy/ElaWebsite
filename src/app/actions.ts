"use server";

export type ContactState = { status: "idle" | "success" | "error" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const interest = String(formData.get("interest") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  // Honeypot: real visitors never fill this hidden field.
  if (formData.get("company")) return { status: "success" };

  if (!name || !emailPattern.test(email) || message.length < 2) {
    return { status: "error" };
  }

  // TODO: deliver the message (e.g. Resend, Postmark or Formspree).
  // Until an email provider is connected, submissions are only logged on the server.
  console.log("[contact]", { name, email, interest, message });

  return { status: "success" };
}
