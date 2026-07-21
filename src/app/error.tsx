"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[400px] flex-col items-center justify-center py-24 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-6">
          An unexpected server error occurred while processing this request. Please try reloading or contact support.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={() => reset()} variant="primary" className="rounded-full px-6">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="outline" className="rounded-full px-6">
            Go home
          </Button>
        </div>
      </div>
    </Container>
  );
}
