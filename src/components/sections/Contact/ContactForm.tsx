import { useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { CheckIcon } from "../../ui/icons";

const AFFILIATIONS = [
  "Hospital / Clinical Network",
  "Psychiatric or Neurodevelopmental Clinic",
  "Academic / Research Institution",
  "Independent Researcher",
  "Freelance Consultant",
  "Government Body",
  "Other",
] as const;

interface Errors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const company = String(data.get("company") ?? "");

    if (company) return;

    const next: Errors = {};
    if (name.length < 2) next.name = "Name must be at least 2 characters.";
    else if (name.length > 120) next.name = "Name must be 120 characters or fewer.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    else if (email.length > 254) next.email = "Email must be 254 characters or fewer.";
    if (!subject) next.subject = "Subject is required.";
    else if (subject.length > 180) next.subject = "Subject must be 180 characters or fewer.";
    if (message.length < 10)
      next.message = "Message must be at least 10 characters.";
    else if (message.length > 2000) next.message = "Message must be 2000 characters or fewer.";
    setErrors(next);
    setServerError("");
    if (Object.keys(next).length > 0) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, affiliation: data.get("affiliation") }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string; errors?: Errors };
      if (!response.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.message || "Unable to send your message right now.");
      }
      setStatus("sent");
      form.reset();
    } catch (error) {
      setStatus("error");
      setServerError(error instanceof Error ? error.message : "Unable to send your message right now.");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full flex-col items-start justify-center rounded-3xl border border-sage/40 bg-elevated p-8 shadow-card"
        role="status"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-sage-soft text-sage">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h3 className="mt-5 font-display text-xl font-medium">Message received.</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
          Thank you for reaching out. The team reads everything and responds
          as soon as possible — no marketing noise, only signal.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-xs tracking-wide text-coral underline-offset-4 hover:underline"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-hairline bg-elevated p-7 shadow-card sm:p-8"
    >
      <div
        ref={summaryRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="mb-5 rounded-xl border border-coral/40 bg-coral-soft px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral"
        hidden={Object.keys(errors).length === 0 && !serverError}
      >
        <p className="font-medium">Please review the highlighted fields.</p>
        {serverError ? <p className="mt-1">{serverError}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" error={errors.name} />
        <Field label="Email address" name="email" type="email" error={errors.email} />
      </div>

      <Field label="Subject" name="subject" maxLength={180} error={errors.subject} />

      <div className="mt-5 hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-1.5 block font-mono text-xs tracking-[0.22em] uppercase text-ink-soft">
          Affiliation
        </span>
        <select
          name="affiliation"
          defaultValue={AFFILIATIONS[2]}
          className="w-full rounded-xl border border-hairline bg-base px-4 py-3 text-sm outline-none transition-colors focus:border-coral"
        >
          {AFFILIATIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-5 block">
        <span className="mb-1.5 block font-mono text-xs tracking-[0.22em] uppercase text-ink-soft">
          Message
        </span>
        <textarea
          name="message"
          rows={4}
          maxLength={2000}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Tell us about your research interests, partnership inquiry, or anything else..."
          className="w-full resize-none rounded-xl border border-hairline bg-base px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-soft/50 focus:border-coral"
        />
        {errors.message && (
          <span id="message-error" role="alert" className="mt-1 block text-xs text-coral">
            {errors.message}
          </span>
        )}
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:translate-y-0 disabled:opacity-70 sm:w-auto sm:min-w-44"
      >
        {status === "sending" ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  maxLength,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  maxLength?: number;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs tracking-[0.22em] uppercase text-ink-soft">
        {label}
      </span>
      <input
        type={type}
        name={name}
        maxLength={maxLength ?? (name === "name" ? 120 : 254)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full rounded-xl border border-hairline bg-base px-4 py-3 text-sm outline-none transition-colors focus:border-coral"
      />
      {error && (
        <span id={`${name}-error`} role="alert" className="mt-1 block text-xs text-coral">
          {error}
        </span>
      )}
    </label>
  );
}

