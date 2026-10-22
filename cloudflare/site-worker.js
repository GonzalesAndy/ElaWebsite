/**
 * Runs only for the paths in run_worker_first (wrangler.toml); every other request is a static file.
 *   /             → redirect to the visitor's language (a real redirect, so search engines see it too)
 *   /api/contact  → the contact form: emails the message to Elena through Cloudflare Email Routing
 */
import { EmailMessage } from "cloudflare:email";

const LOCALES = ["en", "de", "sk", "it"];
const FROM = "website@elarepka.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") return languageRedirect(request, url);
    if (url.pathname === "/api/contact") return contact(request, env);
    return env.ASSETS.fetch(request);
  },
};

function languageRedirect(request, url) {
  const wanted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => part.trim().slice(0, 2).toLowerCase());
  const locale = wanted.find((l) => LOCALES.includes(l)) ?? "en";
  return new Response(null, {
    status: 302,
    headers: { location: `/${locale}/${url.search}`, vary: "accept-language" },
  });
}

async function contact(request, env) {
  const json = (data, status = 200) => Response.json(data, { status });
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

  const data = await request.formData().catch(() => null);
  if (!data) return json({ error: "bad request" }, 400);
  if (data.get("company")) return json({ ok: true }); // honeypot: bots fill the hidden field

  const field = (name, max) => String(data.get(name) ?? "").trim().slice(0, max);
  const name = field("name", 200).replace(/[\r\n]+/g, " ");
  const email = field("email", 200);
  const interest = field("interest", 200).replace(/[\r\n]+/g, " ");
  const message = field("message", 10000);
  const locale = field("locale", 5);
  if (!name || !emailPattern.test(email) || /[\r\n]/.test(email) || message.length < 2) {
    return json({ error: "invalid" }, 400);
  }

  const text = [
    message,
    "",
    "—",
    `Name: ${name}`,
    `Email: ${email}`,
    `Interest: ${interest}`,
    `Site language: ${locale.toUpperCase()}`,
    "",
    "Reply to this email to answer directly.",
  ].join("\n");

  const raw = [
    `From: "Aurea website" <${FROM}>`,
    `To: ${env.CONTACT_TO}`,
    `Reply-To: ${displayName(name)} <${email}>`,
    `Subject: ${encodeWord(`Aurea: ${name} · ${interest}`)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@elarepka.com>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64(text).replace(/.{76}/g, "$&\r\n"),
  ].join("\r\n");

  try {
    await env.MAIL.send(new EmailMessage(FROM, env.CONTACT_TO, raw));
    return json({ ok: true });
  } catch (error) {
    console.error("contact form send failed", error);
    return json({ error: "send failed" }, 502);
  }
}

function base64(text) {
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

const ascii = (text) => /^[\x20-\x7e]*$/.test(text);

/** RFC 2047 header encoding, so subjects and names with accents survive. */
function encodeWord(text) {
  return ascii(text) ? text : `=?UTF-8?B?${base64(text)}?=`;
}

function displayName(text) {
  return ascii(text) ? `"${text.replace(/["\\]/g, "")}"` : encodeWord(text);
}
