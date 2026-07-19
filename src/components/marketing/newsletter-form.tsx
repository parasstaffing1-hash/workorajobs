"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notification } from "@/components/ui/notification";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="mx-auto max-w-xl">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="newsletter-email">
          Work email
        </label>
        <Input
          id="newsletter-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          required
          type="email"
          value={email}
        />
        <Button type="submit">
          <Send aria-hidden="true" className="h-4 w-4" />
          Subscribe
        </Button>
      </form>
      {submitted ? (
        <div className="mt-4">
          <Notification
            message="Thanks. Your interest has been captured in this preview experience."
            onDismiss={() => setSubmitted(false)}
            tone="success"
          />
        </div>
      ) : null}
    </div>
  );
}
