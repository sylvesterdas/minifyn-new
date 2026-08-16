import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CensorFyn Terms of Use | MiniFyn",
  description: "Terms governing use of the CensorFyn offline media redaction Android app.",
  alternates: { canonical: "https://www.minifyn.com/censorfyn/legal/terms" },
};

export default function CensorFynTermsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 md:py-24">
      <article className="prose prose-invert mx-auto">
        <h1>CensorFyn Terms of Use</h1>
        <p className="text-muted-foreground">Last updated: August 16, 2026</p>
        <p>
          CensorFyn is an offline media redaction and sanitization utility developed under the <strong>MiniFyn</strong> brand, operated by{" "}
          <strong>Sylvester Kumar Das</strong> (UDYAM-KL-12-0136086). By downloading, accessing, or using CensorFyn, you agree to be bound by these Terms of Use.
        </p>

        <h2>1. Purpose and Permitted Use</h2>
        <p>
          CensorFyn is designed to assist you in detecting and redacting sensitive data (such as faces, personally identifiable text, and barcodes) locally on your device prior to sharing or publishing. You agree to use the application solely for lawful purposes and in compliance with all applicable local, national, and international laws.
        </p>
        <ul>
          <li>You must own or possess all necessary rights, licenses, and permissions for any media you process using CensorFyn.</li>
          <li>You agree not to use the application to tamper with evidence, falsify legal documents, or violate intellectual property or privacy rights of any individual or entity.</li>
        </ul>

        <h2>2. Detection Assistance &amp; User Verification Responsibility</h2>
        <p>
          While CensorFyn utilizes advanced on-device machine learning and heuristic pattern recognition, <strong>automated detection is an assistive tool and cannot guarantee 100% detection of all sensitive information</strong> across diverse image qualities, angles, lighting conditions, or obscure formats.
        </p>
        <ul>
          <li>
            <strong>Manual Review Required:</strong> You are solely responsible for inspecting and verifying all redacted outputs, ensuring that all sensitive information intended for masking has been completely covered before publishing, transmitting, or sharing.
          </li>
          <li>
            <strong>Backup Originals:</strong> CensorFyn performs irreversible pixel destruction on exported copies. Always maintain unredacted backup copies of original files if you require future access to original content.
          </li>
        </ul>

        <h2>3. In-App Purchases &amp; Google Play Billing</h2>
        <ul>
          <li>Any optional in-app purchases, upgrades, or ad-removal products are managed and billed through Google Play.</li>
          <li>Pricing, local taxes, and payment terms are presented by Google Play prior to purchase confirmation.</li>
          <li>Refunds and license restoration are governed by Google Play policies and applicable consumer protection laws.</li>
        </ul>

        <h2>4. Disclaimer of Warranties &amp; Limitation of Liability</h2>
        <p>
          CensorFyn is provided on an <strong>&ldquo;AS IS&rdquo;</strong> and <strong>&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind, whether express, implied, or statutory.
        </p>
        <p>
          To the fullest extent permitted by applicable law, MiniFyn and its operators shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages—including but not limited to loss of data, privacy disclosures resulting from unreviewed exports, or hardware interruptions—arising out of or in connection with your use of the app.
        </p>

        <h2>5. Modifications and Governing Law</h2>
        <p>
          We reserve the right to update these terms at any time. Material changes will be indicated by the &ldquo;Last updated&rdquo; date at the top of this document. These terms are governed by and construed in accordance with the laws of India.
        </p>

        <h2>6. Contact</h2>
        <p>
          For questions regarding these Terms of Use, please reach out via email to{" "}
          <a href="mailto:sylvesterdas.dev@gmail.com" className="underline">
            sylvesterdas.dev@gmail.com
          </a>{" "}
          or visit <Link href="/censorfyn">minifyn.com/censorfyn</Link>.
        </p>
      </article>
    </main>
  );
}
