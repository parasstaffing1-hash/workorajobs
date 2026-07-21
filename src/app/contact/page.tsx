import { Mail, MapPin, MessageCircle } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Card } from "@/components/ui/card";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Contact Us | Sales & Customer Support",
  description:
    "Get in touch with WorkoraJobs team for enterprise sales, candidate support, or partnerships.",
  path: "/contact",
});;

export default function ContactPage() {
  return (
    <>
      <PageHero
        description="Connect with Workora for employer hiring support, candidate questions and strategic partnerships."
        eyebrow="Contact"
        title="Talk to Workora about global hiring."
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email", value: "hello@workorajobs.com" },
            {
              icon: MessageCircle,
              title: "Response",
              value: "Typical reply window: 1-2 business days",
            },
            {
              icon: MapPin,
              title: "Coverage",
              value: "Global remote-first staffing support",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card className="flex gap-4 p-5" key={item.title}>
                <div className="animated-sheen grid h-11 w-11 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.value}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
        <ContactForm />
      </Container>
    </>
  );
}
