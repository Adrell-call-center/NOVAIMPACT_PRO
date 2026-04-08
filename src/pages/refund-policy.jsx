import RootLayout from "@/components/common/layout/RootLayout";
import Head from "next/head";

export default function RefundPolicy() {
  return (
    <div>
      <Head>
        <title>Refund Policy — Nova Impact</title>
        <meta name="description" content="Refund policy for Nova Impact LTD services and subscriptions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RootLayout>
        <main className="legal-page">
          <div className="container" style={{ maxWidth: "860px", margin: "0 auto", padding: "100px 20px 80px" }}>
            <h1 style={{ marginBottom: "10px" }}>Refund Policy</h1>
            <p style={{ marginBottom: "40px", color: "var(--gray-2)" }}>Last updated: April 5, 2026 — Effective date: April 5, 2026</p>

            <p style={{ marginBottom: "40px" }}>
              This Refund Policy applies to all subscriptions and purchases made through the software-as-a-service products ("Services") operated by NOVA IMPACT LTD, a company registered in England and Wales under company number 16126510, with its registered office at 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
            </p>
            <p style={{ marginBottom: "40px" }}>
              All payments for our Services are processed by Paddle.com Market Limited ("Paddle"), acting as our Merchant of Record. Paddle manages all aspects of payment processing, invoicing, and refund transactions on our behalf.
            </p>

            <section style={{ marginBottom: "40px" }}>
              <h2>1. 14-Day Refund Period for New Subscriptions</h2>
              <p>We offer a 14-day money-back guarantee for all new subscriptions. If you are not satisfied with our Services for any reason, you may request a full refund within 14 days of your initial purchase date.</p>
              <p>To request a refund within this period, please contact us at <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a> with your account email address and order reference number. Refunds requested within the 14-day window will be processed without requiring you to provide a reason.</p>
              <p>This 14-day refund period applies to:</p>
              <ul>
                <li>First-time subscriptions to Bounce Checker</li>
                <li>First-time subscriptions to Smart Sender</li>
                <li>First-time subscriptions to Exif Injector (exifinjector.com)</li>
                <li>First-time subscriptions to Planostra (planostra.com)</li>
                <li>First-time subscriptions to Trusted Pulse (trustedpulse.com)</li>
                <li>Both monthly and annual subscription plans across all products</li>
              </ul>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>2. Refunds After the 14-Day Period</h2>
              <p>After the initial 14-day refund period has expired, subscription payments are generally non-refundable. However, we understand that exceptional circumstances may arise. We will review refund requests on a case-by-case basis in the following situations:</p>
              <ul>
                <li><strong>Service unavailability:</strong> If the Services have been substantially unavailable or non-functional for an extended period due to issues on our end</li>
                <li><strong>Billing errors:</strong> If you have been charged incorrectly or billed for a subscription you did not authorize</li>
                <li><strong>Duplicate charges:</strong> If you have been charged more than once for the same subscription period</li>
              </ul>
              <p>To submit a refund request after the 14-day period, please email us at <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a> with a detailed description of the issue and any relevant documentation.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>3. Subscription Cancellation</h2>
              <p>You may cancel your subscription at any time through your account dashboard or by contacting us at <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a>.</p>
              <p>When you cancel your subscription:</p>
              <ul>
                <li>Your access to the Services will continue until the end of your current billing period</li>
                <li>No further charges will be applied after the current billing period ends</li>
                <li>No partial refunds will be issued for the remaining unused portion of the current billing period</li>
                <li>You will not be charged for subsequent billing periods</li>
              </ul>
              <p>We recommend cancelling at least 48 hours before your next renewal date to ensure the cancellation is processed in time.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>4. Annual Subscription Refunds</h2>
              <p>For annual subscriptions, the 14-day money-back guarantee applies from the date of purchase. If you cancel an annual subscription after the 14-day period, no refund will be issued, but you will retain access to the Services until the end of your annual billing period.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>5. Subscription Renewals</h2>
              <p>Subscriptions renew automatically at the end of each billing cycle. The 14-day refund period does not apply to automatic renewals. If you wish to avoid being charged for a renewal, please cancel your subscription before the renewal date.</p>
              <p>We send renewal reminders via email before each renewal to ensure you are aware of upcoming charges.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>6. Free Trials</h2>
              <p>If you subscribed through a free trial offer, no charges apply during the trial period. If you cancel before the trial ends, no payment will be taken. If the trial converts to a paid subscription, the 14-day refund period begins on the date of the first charge.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>7. How Refunds Are Processed</h2>
              <p>Approved refunds are processed through Paddle and will be returned to the original payment method used at the time of purchase. Please allow:</p>
              <ul>
                <li>5–10 business days for refunds to credit cards or debit cards</li>
                <li>5–10 business days for refunds to PayPal or other payment methods</li>
              </ul>
              <p>The exact processing time may vary depending on your payment provider or financial institution.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>8. Chargebacks</h2>
              <p>We encourage you to contact us directly before initiating a chargeback with your payment provider. We are committed to resolving any billing issues promptly and fairly. Initiating a chargeback without first contacting us may result in the suspension of your account pending investigation.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>9. Changes to This Policy</h2>
              <p>We reserve the right to modify this Refund Policy at any time. Any changes will be posted on this page with an updated "Last updated" date. Changes will apply to purchases made after the updated policy takes effect. Your existing subscription terms at the time of purchase will continue to apply for the duration of that billing period.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>10. Contact Us</h2>
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
