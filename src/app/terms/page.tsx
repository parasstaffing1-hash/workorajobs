import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Terms of Service & Platform Usage Conditions",
  description:
    "Review terms of service, conditions of use, and legal disclaimers for WorkoraJobs.",
  path: "/terms",
});;

export default function TermsPage() {
  return (
    <>
      <PageHero
        description="Terms for using Workora Jobs. Final production terms should be reviewed by counsel before launch."
        eyebrow="Terms"
        title="Terms of Use"
      />
      <Container className="prose prose-slate py-16 dark:prose-invert">
        <h2>Use of the website</h2>
        <p>
          Workora Jobs provides public website and platform experiences for
          staffing, recruitment and hiring operations. Use of production
          services may be subject to additional agreements.
        </p>
        <h2>Content</h2>
        <p>
          Jobs, companies, testimonials and metrics shown on the public website
          may be representative unless explicitly stated otherwise.
        </p>
        <h2>Changes</h2>
        <p>
          Workora may update public website content, product surfaces and terms
          as the platform evolves.
        </p>
      </Container>
    </>
  );
}
