import { useState, type FormEvent } from "react";
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
  message?: string;
}

export function ContactForm() {
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const company = String(data.get("company") ?? "");

    if (company) return;

    const next: Errors = {};
    if (name.length < 2) next.name = "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (message.length < 10)
      next.message = "Message must be at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    window.setTimeout(() => {
      setStatus("sent");
      form.reset();
    }, reduced ? 200 : 1100);
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" error={errors.name} />
        <Field label="Email address" name="email" type="email" error={errors.email} />
      </div>

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
          placeholder="Tell us about your research interests, partnership inquiry, or anything else..."
          className="w-full resize-none rounded-xl border border-hairline bg-base px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-soft/50 focus:border-coral"
        />
        {errors.message && (
          <span role="alert" className="mt-1 block text-xs text-coral">
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
  error,
}: {
  label: string;
  name: string;
  type?: string;
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
        className="w-full rounded-xl border border-hairline bg-base px-4 py-3 text-sm outline-none transition-colors focus:border-coral"
      />
      {error && (
        <span role="alert" className="mt-1 block text-xs text-coral">
          {error}
        </span>
      )}
    </label>
  );
}

