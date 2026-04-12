import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal";

export const metadata: Metadata = {
  title: "Cookie Policy | Marefat Pilgrimage",
  description:
    "Cookie Policy for TGA Tour and Travel LLC (DBA Marefat Pilgrimage): how we use cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      subtitle="TGA Tour and Travel LLC — DBA: Marefat Pilgrimage"
    >
      <h2>1. Introduction</h2>
      <p>
        This Cookie Policy explains how TGA Tour and Travel LLC (&quot;Company&quot;,
        &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) uses cookies and similar technologies
        on our website.
      </p>
      <p>
        Cookies that are not strictly necessary will only be used with your explicit consent.
      </p>
      <p>
        You will be given the option to accept or reject non-essential cookies through a cookie
        consent banner when you first visit the website.
      </p>

      <h2>2. What are cookies</h2>
      <p>
        Cookies are small text files that are stored on your device when you visit a website. They
        help websites function properly, improve user experience, and provide analytical
        information.
      </p>

      <h2>3. Types of cookies we use</h2>
      <h3 className="text-base font-semibold text-charcoal">Essential cookies</h3>
      <p>
        These cookies are necessary for the operation of our website and cannot be disabled.
      </p>
      <p>They include functions such as:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Website security</li>
        <li>Session management</li>
        <li>Booking and contact form functionality</li>
      </ul>

      <h3 className="text-base font-semibold text-charcoal">Performance and analytics cookies</h3>
      <p>These cookies help us understand how visitors interact with our website.</p>
      <p>They may collect information such as:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Pages visited</li>
        <li>Time spent on the website</li>
        <li>Navigation behavior</li>
      </ul>
      <p>
        We may use third-party analytics tools such as Google Analytics to collect this
        information.
      </p>

      <h3 className="text-base font-semibold text-charcoal">Functional cookies</h3>
      <p>
        These cookies allow the website to remember user preferences and provide enhanced
        functionality.
      </p>
      <p>Examples include:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Language preferences</li>
        <li>Saved settings</li>
      </ul>

      <h3 className="text-base font-semibold text-charcoal">Marketing and advertising cookies</h3>
      <p>
        These cookies are used to deliver relevant advertisements and measure the effectiveness of
        marketing campaigns.
      </p>
      <p>They may be set by third-party providers such as:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Google Ads</li>
        <li>Meta (Facebook / Instagram)</li>
      </ul>
      <p>These cookies may track browsing behavior across different websites.</p>

      <h2>4. Third-party cookies</h2>
      <p>Some cookies on our website may be placed by third-party service providers.</p>
      <p>These providers may include:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Analytics providers</li>
        <li>Advertising platforms</li>
        <li>Embedded service providers</li>
      </ul>
      <p>
        We do not control these cookies directly, and their use is governed by the respective
        third parties&apos; privacy policies.
      </p>

      <h2>5. Cookie duration</h2>
      <p>Cookies may be stored on your device for different periods of time:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong className="text-charcoal">Session cookies</strong> – deleted when you close your
          browser
        </li>
        <li>
          <strong className="text-charcoal">Persistent cookies</strong> – remain on your device for
          a defined period or until deleted
        </li>
      </ul>

      <h2>6. Your choices and control</h2>
      <p>You have the right to control and manage cookies.</p>
      <p>You can:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Modify your browser settings to block or delete cookies</li>
        <li>Restrict or disable certain types of cookies</li>
        <li>
          Manage cookie preferences through the cookie consent banner available on the website
        </li>
      </ul>
      <p>Please note that disabling cookies may affect the functionality and performance of the website.</p>
      <p>Users may also configure their browser settings to refuse or delete cookies at any time.</p>

      <h2>7. Legal basis for processing (GDPR)</h2>
      <p>If you are located in the European Economic Area (EEA) or the United Kingdom:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Essential cookies are processed based on our legitimate interest in operating a secure
          and functional website.
        </li>
        <li>Non-essential cookies are processed only with your consent.</li>
      </ul>
      <p>
        You may withdraw or modify your consent at any time through the cookie settings or consent
        banner available on the website.
      </p>

      <h2>8. Updates to this policy</h2>
      <p>
        TGA Tour and Travel LLC reserves the right to update or modify this Cookie Policy at any
        time.
      </p>
      <p>Any changes will be published on this page.</p>
      <p>Continued use of the website constitutes acceptance of the updated policy.</p>

      <h2>9. Contact information</h2>
      <p>If you have any questions regarding this Cookie Policy, you may contact:</p>
      <p>
        <strong className="text-charcoal">TGA Tour and Travel LLC</strong>
        <br />
        Email:{" "}
        <a
          href="mailto:info@tgatourandtravel.com"
          className="text-charcoal underline underline-offset-2"
        >
          info@tgatourandtravel.com
        </a>
      </p>
      <p>
        This Cookie Policy should be read together with our{" "}
        <Link href="/privacy" className="text-charcoal underline underline-offset-2">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-charcoal underline underline-offset-2">
          Terms and Conditions
        </Link>
        , which explain how we process personal data and provide our services.
      </p>
    </LegalPageShell>
  );
}
