import Link from "next/link";
import { Container, Section, PageHeader } from "@/components/layout";
import { Card, Button, Input, Select, Textarea } from "@/components/ui";

export default function ContactPage() {
  return (
    <main className="bg-ivory">
      <Section variant="bordered" padding="lg">
        <Container size="md">
          <PageHeader
            badge="Contact"
            title="Quiet, direct access to our team"
            description="Share a few details about your plans and we will respond with a calm, clear proposal — usually within 24–48 hours."
          />
        </Container>
      </Section>

      <Section padding="md">
        <Container size="md">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
            <Card variant="default" padding="md" className="space-y-4">
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="text"
                    label="Full name"
                    placeholder="Your name"
                    required
                    size="sm"
                  />
                  <Input
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    required
                    size="sm"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="tel"
                    label="Phone / WhatsApp"
                    placeholder="+00 …"
                    size="sm"
                  />
                  <Select
                    label="Preferred language"
                    size="sm"
                    options={[
                      "English",
                      "Persian (فارسی)",
                      "German (Deutsch)",
                      "Arabic (العربية)",
                    ]}
                  />
                </div>

                <Select
                  label="Destination"
                  size="sm"
                  options={[
                    "Makkah & Madinah (Umrah)",
                    "Hajj",
                    "Karbala & Najaf",
                    "Mashhad",
                    "Combination",
                    "Not sure yet",
                  ]}
                />

                <Textarea
                  label="Message"
                  placeholder="Share any details about travelers, ages, health, and expectations."
                  rows={4}
                  size="sm"
                />

                <Button type="submit" variant="primary" size="sm" fullWidth>
                  Send message
                </Button>

                <p className="text-[11px] text-charcoal/60">
                  By submitting, you agree that we may contact you regarding your
                  inquiry. We do not send frequent marketing emails.
                </p>
              </form>
            </Card>

            <aside className="space-y-5 text-sm text-charcoal/80">
              <Card variant="default" padding="md">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                  Direct contacts
                </h2>
                <p className="mt-3 text-sm">
                  Phone: <span className="font-medium">+1 (950) 330-8904</span>
                </p>
                <p className="mt-1 text-sm">
                  Email:{" "}
                  <span className="font-medium">
                    info@marefatpilgrimage.com
                  </span>
                </p>
                <Link
                  href="https://wa.me/4917662421747"
                  className="mt-4 block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                  >
                    Open WhatsApp chat
                  </Button>
                </Link>
              </Card>

              <Card variant="default" padding="md">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                  Office
                </h2>
                <p className="mt-3 text-sm">
                404 NW 68th Ave #511
                  <br />
                  Plantation, FL 33317
                  <br />
                  United States
                </p>
                <p className="mt-2 text-xs text-charcoal/60">
                  Meetings are available by appointment only. Video consultation is
                  available for international clients.
                </p>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </main>
  );
}


