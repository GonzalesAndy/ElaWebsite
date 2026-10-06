"use client";

import { useActionState } from "react";
import Rich from "./Rich";
import { sendContact, type ContactState } from "@/app/actions";
import type { Dictionary } from "@/i18n/getDictionary";

const initialState: ContactState = { status: "idle" };

export default function Contact({ contact }: { contact: Dictionary["contact"] }) {
  const [state, formAction, pending] = useActionState(sendContact, initialState);

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

        <form className="contact-form" action={formAction} data-reveal>
          {state.status === "success" ? (
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
                {state.status === "error" ? contact.error : ""}
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
