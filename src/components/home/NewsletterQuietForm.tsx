"use client";

import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterQuietForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError("Please enter a valid email address.");
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setError(undefined);
    // Newsletter backend can be wired later; for now we only validate UX.
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 sm:max-w-md sm:flex-row sm:items-start"
      noValidate
    >
      <div className="min-w-0 flex-1">
        <Input
          ref={inputRef}
          type="email"
          name="quiet-updates-email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(undefined);
          }}
          error={error}
          className="rounded-full"
          aria-label="Email for quiet updates"
        />
      </div>
      <Button type="submit" className="shrink-0 sm:mt-0">
        Join quietly
      </Button>
    </form>
  );
}
