import RootLayout from "@/components/common/layout/RootLayout";
import Head from "next/head";

export default function TermsOfService() {
  return (
    <div>
      <Head>
        <title>Terms of Service — Nova Impact</title>
        <meta name="description" content="Terms of Service governing access to and use of Nova Impact LTD services." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RootLayout>
        <main className="legal-page">
          <div className="container" style={{ maxWidth: "860px", margin: "0 auto", padding: "100px 20px 80px" }}>
            <h1 style={{ marginBottom: "10px" }}>Terms of Service</h1>
            <p style={{ marginBottom: "40px", color: "var(--gray-2)" }}>Last updated: April 5, 2026 — Effective date: April 5, 2026</p>

            <p style={{ marginBottom: "40px" }}>
              These Terms of Service ("Terms") govern your access to and use of the software-as-a-service products ("Services") provided by NOVA IMPACT LTD, a company registered in England and Wales under company number 16126510, with its registered office at 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom ("Company", "we", "us", or "our").
            </p>
            <p style={{ marginBottom: "40px" }}>
              By creating an account, subscribing to, or using any of our Services, you ("User", "you", or "your") agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our Services.
            </p>

            <section style={{ marginBottom: "40px" }}>
              <h2>1. Description of Services</h2>
              <p>NOVA IMPACT LTD operates and provides the following SaaS products (collectively referred to as the "Services"):</p>
              <ul>
                <li><strong>Bounce Checker</strong> (novaimpact.io) — An email verification and validation tool that enables users to verify the deliverability of email addresses in bulk or individually.</li>
                <li><strong>Smart Sender</strong> (novaimpact.io) — An email campaign management platform that allows users to create, schedule, and send email campaigns.</li>
                <li><strong>Exif Injector</strong> (exifinjector.com) — An AI-powered image metadata management tool that enables users to inject, view, and remove EXIF, IPTC, and XMP metadata from images in bulk.</li>
                <li><strong>Planostra</strong> (planostra.com) — An AI-powered social media management platform that enables users to schedule posts, create content with AI assistance, and manage multiple social media accounts.</li>
                <li><strong>Trusted Pulse</strong> (trustedpulse.com) — A customer review collection and management platform that enables businesses to gather, manage, and display authentic customer reviews and testimonials.</li>
              </ul>
              <p>We reserve the right to modify, update, or discontinue any feature of the Services at any time. We will provide reasonable notice of any material changes that affect your use of the Services.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>2. Account Registration</h2>
              <p>To access our Services, you must create an account and provide accurate, complete, and current information. You are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access or security breach</li>
              </ul>
              <p>You must be at least 18 years of age to use our Services. By registering, you represent that you meet this requirement.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>3. Subscription Plans and Payment</h2>
              <p>Our Services are available on a subscription basis, offered as monthly or annual plans. Pricing details are available on our website at <a href="https://novaimpact.io">https://novaimpact.io</a>.</p>
              <p><strong>Billing:</strong> All payments are processed securely by Paddle.com Market Limited ("Paddle"), acting as our Merchant of Record. By purchasing a subscription, you agree to Paddle's terms of service and privacy policy.</p>
              <p><strong>Recurring payments:</strong> Subscriptions automatically renew at the end of each billing cycle unless cancelled before the renewal date.</p>
              <p><strong>Price changes:</strong> We reserve the right to modify our pricing. Any price changes will be communicated at least 30 days in advance.</p>
              <p><strong>Taxes:</strong> All prices are exclusive of applicable taxes unless stated otherwise. Paddle will calculate and collect the appropriate sales tax or VAT based on your location.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>4. Free Trials</h2>
              <p>We may offer free trial periods for certain Services. At the end of the trial period, your subscription will automatically convert to a paid plan unless you cancel before the trial ends.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>5. Cancellation</h2>
              <p>You may cancel your subscription at any time through your account dashboard or by contacting us at <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a>.</p>
              <p>Upon cancellation:</p>
              <ul>
                <li>Your subscription will remain active until the end of the current billing period</li>
                <li>You will retain access to the Services until the end of the paid period</li>
                <li>No further charges will be applied after the current billing period ends</li>
                <li>Your data will be retained for 30 days after the end of your subscription, after which it may be permanently deleted</li>
              </ul>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>6. Acceptable Use</h2>
              <p>You agree to use our Services only for lawful purposes and in compliance with all applicable laws and regulations. You must not:</p>
              <ul>
                <li>Use the Services to send unsolicited bulk emails (spam) or violate any anti-spam legislation</li>
                <li>Upload, transmit, or distribute content that is illegal, harmful, threatening, abusive, or defamatory</li>
                <li>Use the Services to harvest or store personal data without proper legal basis or consent</li>
                <li>Attempt to gain unauthorized access to any part of the Services</li>
                <li>Interfere with or disrupt the integrity or performance of the Services</li>
                <li>Reverse engineer, decompile, or disassemble the Services</li>
                <li>Resell, sublicense, or redistribute the Services without our prior written consent</li>
                <li>Use the Services to engage in any fraudulent, deceptive, or misleading activity</li>
              </ul>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>7. Intellectual Property</h2>
              <p>All content, features, and functionality of the Services are the exclusive property of NOVA IMPACT LTD and are protected by international copyright, trademark, and other intellectual property laws.</p>
              <p>Your subscription grants you a limited, non-exclusive, non-transferable, revocable licence to access and use the Services for your internal business purposes during the term of your subscription.</p>
              <p>You retain ownership of all data and content you upload to the Services ("User Content"). By using the Services, you grant us a limited licence to process your User Content solely for the purpose of providing the Services to you.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>8. Data Protection and Privacy</h2>
              <p>We are committed to protecting your personal data. Our collection, use, and processing of personal information is governed by our Privacy Policy.</p>
              <p>When using our Services to process email addresses or personal data of third parties, you act as the data controller and are responsible for ensuring that you have the appropriate legal basis for processing such data.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>9. Service Availability and Support</h2>
              <p>We strive to maintain a high level of service availability. However, we do not guarantee uninterrupted or error-free access to the Services.</p>
              <p>Technical support is available via email at <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a> during business hours (Monday to Friday, 9:00 AM – 6:00 PM GMT). We aim to respond to support requests within 24 business hours.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>10. Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable law:</p>
              <ul>
                <li>The Services are provided on an "as is" and "as available" basis, without warranties of any kind</li>
                <li>NOVA IMPACT LTD shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Our total aggregate liability shall not exceed the total amount you have paid to us in the twelve (12) months preceding the claim</li>
                <li>We are not liable for any loss of data, revenue, profits, or business opportunities</li>
              </ul>
              <p>Nothing in these Terms shall exclude or limit liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded under applicable law.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>11. Indemnification</h2>
              <p>You agree to indemnify and hold harmless NOVA IMPACT LTD, its directors, officers, employees, and agents from and against any claims, liabilities, damages, losses, costs, and expenses arising out of or related to your use of the Services, your violation of these Terms, or your violation of any applicable laws or third-party rights.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>12. Modifications to the Terms</h2>
              <p>We reserve the right to update or modify these Terms at any time. Material changes will be communicated via email or through a notice on our website at least 30 days before they take effect. Your continued use of the Services after such changes constitutes acceptance of the updated Terms.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>13. Termination</h2>
              <p>We may suspend or terminate your access to the Services immediately and without prior notice if you breach any provision of these Terms, fail to pay applicable fees, or we are required to do so by law.</p>
              <p>Upon termination, your right to access the Services ceases immediately. Provisions relating to intellectual property, limitation of liability, and indemnification shall survive termination.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>14. Governing Law and Dispute Resolution</h2>
              <p>These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
              <p>Before initiating any formal proceedings, both parties agree to attempt to resolve any dispute through good-faith negotiation for a period of at least 30 days.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>15. Severability</h2>
              <p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>16. Entire Agreement</h2>
              <p>These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and NOVA IMPACT LTD regarding your use of the Services.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>17. Contact Us</h2>
              <address style={{ fontStyle: "normal", lineHeight: "1.8" }}>
                NOVA IMPACT LTD<br />
                71-75 Shelton Street, Covent Garden<br />
                London, WC2H 9JQ, United Kingdom<br />
                Email: <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a><br />
                Website: <a href="https://novaimpact.io">https://novaimpact.io</a>
              </address>
            </section>
          </div>
        </main>
      </RootLayout>
    </div>
  );
}
