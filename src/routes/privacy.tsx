import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MenuMenu" },
      { name: "description", content: "Learn how MenuMenu collects, uses and protects your personal data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: April 2026" />
      <section className="section">
        <div className="container-mm max-w-4xl">
          <div className="card-mm space-y-8 p-8 md:p-12">

            <Notice title="Your Privacy Matters">
              MenuMenu is committed to protecting your personal information. This policy explains what data we collect, why we collect it, and how you can control it.
            </Notice>

            <Section title="1. Data We Collect">
              <p className="mb-3">We collect the following categories of data:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Account data:</strong> Name, email address, password (hashed).</li>
                <li><strong>Order data:</strong> Delivery address, payment method (not card numbers), order history.</li>
                <li><strong>Communication data:</strong> Messages sent between customers and vendors via the platform.</li>
                <li><strong>Usage data:</strong> Pages visited, search queries, device type, and browser information.</li>
                <li><strong>Vendor data:</strong> Business name, CAC number, bank details (for payouts), menu content.</li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Data">
              <ul className="list-disc space-y-2 pl-5">
                <li>To process and fulfil your orders.</li>
                <li>To facilitate communication between customers and vendors.</li>
                <li>To send transactional notifications (order updates, receipts).</li>
                <li>To improve the platform's performance and personalise your experience.</li>
                <li>To detect and prevent fraud and abuse.</li>
                <li>To comply with applicable laws and regulations.</li>
              </ul>
            </Section>

            <Section title="3. Data Sharing">
              <p className="mb-3">We do not sell your personal data. We may share data with:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Vendors:</strong> Your delivery address and name when you place an order.</li>
                <li><strong>Payment processors:</strong> For secure payment handling (we never see your card details).</li>
                <li><strong>Service providers:</strong> Cloud hosting, analytics, and email services under strict data processing agreements.</li>
                <li><strong>Law enforcement:</strong> If required by law or to protect users' safety.</li>
              </ul>
            </Section>

            <Section title="4. Data Retention">
              <p>We retain your account data for as long as your account is active. Order data is retained for 7 years for accounting purposes. You may request deletion of your personal data by contacting us (see Section 7).</p>
            </Section>

            <Section title="5. Cookies & Tracking">
              <p>MenuMenu uses essential cookies to maintain your session and preferences. We do not use third-party advertising cookies. You can disable cookies in your browser settings, though this may affect platform functionality.</p>
            </Section>

            <Section title="6. Your Rights">
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Access</strong> the personal data we hold about you.</li>
                <li><strong>Correct</strong> inaccurate data via your account settings.</li>
                <li><strong>Delete</strong> your account and associated data (subject to legal obligations).</li>
                <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format.</li>
                <li><strong>Opt out</strong> of marketing communications at any time.</li>
              </ul>
            </Section>

            <Section title="7. Contact & Data Requests">
              <p>
                For privacy inquiries or to exercise your rights, contact our Data Protection Officer at{" "}
                <a href="mailto:privacy@menumenu.app" className="font-bold text-primary hover:underline">privacy@menumenu.app</a>.
                {" "}We will respond within 30 days.
              </p>
            </Section>

            <div className="flex flex-wrap gap-4 border-t border-border pt-6">
              <Link to="/terms" className="btn-ghost">Terms of Service →</Link>
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
