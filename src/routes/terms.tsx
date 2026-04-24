import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MenuMenu" },
      { name: "description", content: "Read our Terms of Service before using the MenuMenu marketplace platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" subtitle="Last updated: April 2026" />
      <section className="section">
        <div className="container-mm max-w-4xl">
          <div className="card-mm space-y-8 p-8 md:p-12">

            <Notice title="Agreement to Terms">
              By accessing or using MenuMenu, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, please do not use our platform.
            </Notice>

            <Section title="1. The Platform">
              <p>MenuMenu is an online marketplace that connects customers with independent food vendors ("Kitchens"). We facilitate transactions but are not a party to the agreement between the customer and vendor for the supply of food.</p>
            </Section>

            <Section title="2. User Accounts">
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>You must be 18 years or older to create an account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
                <li>You may not use another person's account without authorisation.</li>
                <li>We reserve the right to terminate accounts that violate our policies.</li>
              </ul>
            </Section>

            <Section title="3. Vendor Obligations">
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Vendors must ensure all food is prepared hygienically and complies with applicable Nigerian food safety laws.</li>
                <li>Vendors are solely responsible for the accuracy of their menu, pricing, and availability.</li>
                <li>Vendors must honour confirmed orders or notify the customer promptly if unable to fulfil them.</li>
                <li>MenuMenu takes a platform commission on each successful transaction as outlined in the Vendor Agreement.</li>
              </ul>
            </Section>

            <Section title="4. Customer Orders">
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>All orders are subject to vendor availability and acceptance.</li>
                <li>Refunds are handled on a case-by-case basis. See our Refund Policy for details.</li>
                <li>Delivery times are estimates and not guaranteed.</li>
                <li>Customers must provide accurate delivery information.</li>
              </ul>
            </Section>

            <Section title="5. Prohibited Activities">
              <p className="mb-3">You may not use MenuMenu to:</p>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>Engage in fraudulent transactions or chargebacks.</li>
                <li>Post false reviews or manipulate ratings.</li>
                <li>Harass vendors, customers, or MenuMenu staff.</li>
                <li>Attempt to reverse-engineer or scrape the platform.</li>
              </ul>
            </Section>

            <Section title="6. Limitation of Liability">
              <p>MenuMenu is not liable for: food quality or safety issues arising from vendor preparation; delays due to third-party logistics; losses caused by account security breaches on your part; or any indirect, incidental, or consequential damages.</p>
            </Section>

            <Section title="7. Changes to Terms">
              <p>We may update these terms at any time. Continued use of the platform after changes constitutes your acceptance of the new terms. We will notify users of material changes via email or in-app notification.</p>
            </Section>

            <Section title="8. Contact">
              <p>For questions about these Terms, contact us at{" "}
                <a href="mailto:legal@menumenu.app" className="font-bold text-primary hover:underline">legal@menumenu.app</a>
              </p>
            </Section>

            <div className="flex flex-wrap gap-4 border-t border-border pt-6">
              <Link to="/privacy" className="btn-ghost">Privacy Policy →</Link>
              <Link to="/" className="btn-ghost">Back to home</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-xl font-black">{title}</h2>
      <div className="space-y-2 text-sm font-medium leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
      <p className="mb-2 text-xs font-black uppercase tracking-widest text-primary">{title}</p>
      <p className="text-sm font-medium leading-relaxed text-foreground">{children}</p>
    </div>
  );
}
