import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for the Workora Jobs public frontend.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        description="A public-facing privacy policy framework for Workora Jobs. Legal review should be completed before production launch."
        eyebrow="Privacy"
        title="Privacy Policy"
      />
      <Container className="prose prose-slate py-16 dark:prose-invert">
        <h2>Information we collect</h2>
        <p>
          Workora Jobs may collect account, company, candidate profile,
          application, communication and usage information needed to operate
          staffing workflows.
        </p>
        <h2>How information may be used</h2>
        <p>
          Submitted information may be used to respond to inquiries, improve
          services, secure the platform and support recruitment workflows.
          Production launch requires jurisdiction-specific legal approval.
        </p>
        <h2>Contact</h2>
        <p>Questions about privacy can be directed to hello@workorajobs.com.</p>
      </Container>
    </>
  );
}
