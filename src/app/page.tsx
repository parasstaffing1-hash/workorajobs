import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  differentiators,
  faqs,
  industries,
  logos,
  processSteps,
  services,
  stats,
  testimonials,
} from "@/data/marketing";
import { siteConfig } from "@/lib/site";

const Accordion = dynamic(
  () => import("@/components/ui/accordion").then((mod) => mod.Accordion),
  {
    loading: () => (
      <div className="h-64 rounded-lg border border-border bg-secondary" />
    ),
  },
);
const NewsletterForm = dynamic(
  () =>
    import("@/components/marketing/newsletter-form").then(
      (mod) => mod.NewsletterForm,
    ),
  {
    loading: () => (
      <div className="mx-auto h-12 max-w-xl rounded-md bg-secondary" />
    ),
  },
);

export default function HomePage() {
  return (
    <>
      <section className="premium-mesh relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:56px_56px] opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="pointer-events-none absolute right-[-14%] top-16 h-96 w-2/3 rotate-[-10deg] bg-gradient-to-l from-primary/15 via-[hsl(var(--violet)/0.10)] to-transparent blur-3xl" />
        <Container className="relative grid gap-12 py-20 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-28">
          <Reveal distance={24}>
            <Badge>AI-powered global staffing</Badge>
            <h1 className="premium-text-gradient mt-6 max-w-4xl text-balance pb-2 text-4xl font-semibold leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Workora Jobs for elite global hiring.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              A premium recruitment platform for companies that need sharper
              talent signals, trusted candidate journeys and borderless hiring
              confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/employers" size="lg" variant="accent">
                Hire talent
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/jobs" size="lg" variant="outline">
                Explore jobs
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Globe2, label: "Global reach" },
                { icon: ShieldCheck, label: "Trust-first workflows" },
                { icon: Sparkles, label: "AI-ready foundation" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    className="glass-panel flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-sm text-muted-foreground shadow-sm"
                    key={item.label}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                    {item.label}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {stats.slice(0, 3).map((stat) => (
                <div
                  className="rounded-lg border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-xl"
                  key={stat.label}
                >
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="relative" delay={0.12} distance={28}>
            <div className="absolute -inset-3 -z-10 rotate-2 rounded-lg bg-gradient-to-br from-primary/15 via-[hsl(var(--violet)/0.10)] to-accent/10 blur-2xl" />
            <div className="glass-panel animated-sheen overflow-hidden rounded-lg border border-border/70 shadow-premium">
              <Image
                alt="Hiring team collaborating around laptops"
                className="h-64 w-full object-cover saturate-[1.04] transition-transform duration-700 hover:scale-[1.015] sm:h-80"
                height={720}
                priority
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85"
                width={1200}
              />
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                {["Talent map", "Shortlist", "Offer ready"].map(
                  (label, index) => (
                    <div
                      className="rounded-md border border-border/70 bg-background/70 p-4 shadow-sm backdrop-blur-xl"
                      key={label}
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        0{index + 1}
                      </p>
                      <p className="mt-2 font-semibold">{label}</p>
                      <div className="mt-4 h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-primary to-[hsl(var(--violet))]"
                          style={{ width: `${52 + index * 18}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-border/70 bg-background/70 py-8 backdrop-blur-xl">
        <Container>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Built for the hiring standards of modern global teams
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center text-sm font-semibold text-muted-foreground sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((logo) => (
              <div
                className="rounded-md border border-border/70 bg-card/70 px-4 py-3 shadow-sm backdrop-blur-xl transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-foreground"
                key={logo}
              >
                {logo}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section
        description="A structured service foundation for companies that need recruiting quality, market intelligence and candidate trust in one system."
        eyebrow="Services"
        title="From hiring strategy to offer readiness."
      >
        <FeatureGrid features={services} />
      </Section>

      <Section
        className="bg-secondary/40"
        description="Workora is positioned for specialized, cross-functional hiring across high-trust operating environments."
        eyebrow="Industries"
        title="Staffing support for talent-dense sectors."
      >
        <FeatureGrid features={industries} />
      </Section>

      <Section
        description="The Workora brand is built around signal quality, operational maturity and candidate respect."
        eyebrow="Why Workora"
        title="Recruitment infrastructure that feels enterprise from day one."
      >
        <FeatureGrid features={differentiators} />
      </Section>

      <section className="relative overflow-hidden border-y border-border/70 bg-[hsl(var(--navy))] py-16 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:48px_48px] opacity-10" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <Container>
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal
                className="rounded-lg border border-white/10 bg-white/5 p-6 shadow-premium backdrop-blur-xl"
                delay={index * 0.06}
                key={stat.label}
              >
                <p className="text-4xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Section
        description="A clear hiring motion gives every stakeholder the same language for quality, speed and accountability."
        eyebrow="Hiring process"
        title="A repeatable path from role brief to accepted offer."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <Card className="p-6" key={step.title}>
              <div className="animated-sheen grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--violet))] text-sm font-semibold text-primary-foreground shadow-premium">
                {index + 1}
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        className="bg-secondary/40"
        eyebrow="Testimonials"
        title="Trusted by hiring leaders and candidates."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card className="p-6" key={testimonial.name}>
              <p className="text-lg leading-8">"{testimonial.quote}"</p>
              <div className="mt-6 border-t border-border/70 pt-4">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        description="Clear answers for Workora's product positioning and hiring experience."
        eyebrow="FAQs"
        title="What this foundation includes."
      >
        <div className="mx-auto max-w-3xl">
          <Accordion items={faqs} />
        </div>
      </Section>

      <section className="luxury-section border-y border-border/70 bg-secondary/40 py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <CheckCircle2
              aria-hidden="true"
              className="mx-auto h-8 w-8 text-primary drop-shadow"
            />
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight">
              Get the Workora hiring brief.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Receive product updates, hiring insight and global talent
              briefings from Workora.
            </p>
          </div>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </Container>
      </section>

      <CtaBand />

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteConfig.url}/jobs?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </>
  );
}
