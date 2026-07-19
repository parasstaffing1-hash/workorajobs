"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notification } from "@/components/ui/notification";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <form
      className="glass-panel space-y-5 rounded-lg border border-border/70 p-6 shadow-premium"
      onSubmit={onSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          First name
          <Input name="firstName" required autoComplete="given-name" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Last name
          <Input name="lastName" required autoComplete="family-name" />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium">
        Work email
        <Input name="email" required type="email" autoComplete="email" />
      </label>
      <label className="space-y-2 text-sm font-medium">
        I am interested in
        <Select name="interest" required defaultValue="">
          <option disabled value="">
            Select one
          </option>
          <option>Hiring talent</option>
          <option>Finding a role</option>
          <option>Partnerships</option>
          <option>Press or media</option>
        </Select>
      </label>
      <label className="space-y-2 text-sm font-medium">
        Message
        <Textarea
          name="message"
          placeholder="Tell us what you are planning."
          required
        />
      </label>
      <Button className="w-full sm:w-auto" type="submit">
        Send message
      </Button>
      {submitted ? (
        <Notification
          message="Message captured. The Workora team will use this inquiry context to follow up."
          onDismiss={() => setSubmitted(false)}
          tone="success"
        />
      ) : null}
    </form>
  );
}
