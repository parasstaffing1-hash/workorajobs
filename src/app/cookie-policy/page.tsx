import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Cookie Policy",
  description: "Cookie policy for the Workora Jobs public frontend.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        description="A clear cookie policy page for the public website foundation."
        eyebrow="Cookies"
        title="Cookie Policy"
      />
      <Container className="prose prose-slate py-16 dark:prose-invert">
        <h2>Current cookie use</h2>
        <p>
          Workora may use local storage for theme preference and essential
          product settings. Production analytics or session cookies should be
          governed by clear consent controls.
        </p>
        <h2>Future updates</h2>
        <p>
          If analytics, personalization or authentication settings change, this
          policy should be updated with regional compliance guidance.
        </p>
      </Container>
    </>
  );
}
