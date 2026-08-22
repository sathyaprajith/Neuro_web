import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { CheckIcon } from "../../ui/icons";

const TOPICS = [
  "Research collaboration",
  "Clinical pilot inquiry",
  "Press & speaking",
  "Something else",
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
    if (!name) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That email doesn't look right.";
    if (message.length < 10)
      next.message = "A sentence or two helps us route this well.";
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
          We reply within two business days — usually sooner. No newsletters,
          no drip campaigns.
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
        <Field label="Name" name="name" error={errors.name} />
        <Field label="Email" name="email" type="email" error={errors.email} />
      </div>

      <div className="mt-5 hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-1.5 block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
          Topic
        </span>
        <select
          name="topic"
          defaultValue={TOPICS[0]}
          className="w-full rounded-xl border border-hairline bg-base px-4 py-3 text-sm outline-none transition-colors focus:border-coral"
        >
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-5 block">
        <span className="mb-1.5 block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
          Message
        </span>
        <textarea
          name="message"
          rows={4}
          placeholder="What are you working on?"
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
      <span className="mb-1.5 block font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft">
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
