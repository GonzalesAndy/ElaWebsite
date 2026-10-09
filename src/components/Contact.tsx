"use client";

import { useState } from "react";
import Rich from "./Rich";
import type { Dictionary } from "@/i18n/getDictionary";

/*
 * The site is static (GitHub Pages), so there is no server to send mail.
 * With NEXT_PUBLIC_FORM_ENDPOINT set (e.g. a Formspree form URL) messages are posted there;
 * otherwise the visitor's email app opens with the message ready to send to CONTACT_EMAIL.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "success" | "error";

export default function Contact({ contact }: { contact: Dictionary["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const pending = status === "sending";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("company")) return setStatus("success"); // honeypot: bots fill this hidden field

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const interest = String(data.get("interest") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !emailPattern.test(email) || message.length < 2) return setStatus("error");

    if (!FORM_ENDPOINT) {
      const body = `${message}\n\n${interest}\n${name} <${email}>`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Aurea: ${interest}`)}&body=${encodeURIComponent(body)}`;
      return setStatus("success");
    }

    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div className="contact-text">
          <p className="eyebrow" data-reveal>
            {contact.eyebrow}
          </p>
          <h2 id="contact-title" className="h2" data-reveal>
            <Rich text={contact.title} />
          </h2>
          <p className="lead" data-reveal>
            {contact.intro}
          </p>
        </div>

        <form className="contact-form" onSubmit={onSubmit} data-reveal>
          {status === "success" ? (
            <p className="form-success" role="status">
              {contact.success}
            </p>
          ) : (
            <>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">{contact.name}</label>
                  <input id="name" name="name" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="email">{contact.email}</label>
                  <input id="email" name="email" type="email" autoComplete="email" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="interest">{contact.interest}</label>
                <select id="interest" name="interest" defaultValue={contact.interestOptions[0]}>
                  {contact.interestOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="message">{contact.message}</label>
                <textarea id="message" name="message" rows={5} required />
              </div>
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="form-footer">
                <p className="form-note">{contact.privacy}</p>
                <button type="submit" className="btn btn--primary" disabled={pending}>
                  {pending ? contact.sending : contact.submit}
                </button>
              </div>
              <p role="status" className="form-error">
                {status === "error" ? contact.error : ""}
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
