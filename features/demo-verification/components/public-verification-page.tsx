"use client";

import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Ban,
  CheckCircle2,
  Clock3,
  Copy,
  Info,
  Landmark,
  LockKeyhole,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {  useState } from "react";

import {
  type DemoPublicVerificationRecordConfig,
  type DemoPublicVerificationStatus,
  useDemoPack,
} from "@/features/demo-engine/config";

import {
  createPublicVerificationLink,
  findPublicVerificationRecord,
} from "../lib/public-verification";
import styles from "./public-verification-page.module.css";

type LookupState =
  | { readonly kind: "idle" }
  | { readonly kind: "found"; readonly record: DemoPublicVerificationRecordConfig }
  | { readonly kind: "not-found"; readonly query: string };

type StatusPresentation = {
  readonly label: string;
  readonly title: string;
  readonly icon: LucideIcon;
  readonly className: string;
};

const presentations: Record<DemoPublicVerificationStatus, StatusPresentation> = {
  valid: { label: "VALID", title: "Certificate verified", icon: BadgeCheck, className: styles.valid },
  revoked: { label: "REVOKED", title: "Certificate revoked", icon: Ban, className: styles.revoked },
  expired: { label: "EXPIRED", title: "Certificate expired", icon: Clock3, className: styles.expired },
  replaced: { label: "REPLACED", title: "Certificate replaced", icon: RefreshCw, className: styles.replaced },
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "Africa/Nairobi",
  }).format(new Date(value));
}

function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Nairobi",
    timeZoneName: "short",
  }).format(date);
}

export function PublicVerificationPage({
  initialCode,
}: {
  readonly initialCode?: string;
}) {
  const pack = useDemoPack();
  const verification = pack.verification;
  const requestedCode = initialCode?.trim();
  const startingCode =
    requestedCode || verification.defaultCode;

  const startingRecord = findPublicVerificationRecord(
    verification,
    startingCode,
  );

  const [code, setCode] = useState(startingCode);
  const [lookup, setLookup] = useState<LookupState>(
    startingRecord
      ? {
          kind: "found",
          record: startingRecord,
        }
      : requestedCode
        ? {
            kind: "not-found",
            query: requestedCode,
          }
        : { kind: "idle" },
  );
  const [feedback, setFeedback] = useState("");


  const verify = (value = code) => {
    const query = value.trim();
    if (!query) {
      setLookup({ kind: "idle" });
      setFeedback("Enter a certificate number or verification code.");
      return;
    }
    const record = findPublicVerificationRecord(verification, query);
    setLookup(record ? { kind: "found", record } : { kind: "not-found", query });
    setFeedback(record ? "Controlled institutional record retrieved." : "No matching institutional record was found.");
  };

  const scanDemoQr = () => {
    setCode(verification.defaultCode);
    verify(verification.defaultCode);
    setFeedback("Demo QR code scanned.");
  };

  const copyLink = async (record: DemoPublicVerificationRecordConfig) => {
    const link = createPublicVerificationLink(window.location.origin, record.verificationCode);
    try {
      await navigator.clipboard.writeText(link);
      setFeedback("Verification link copied.");
    } catch {
      setFeedback("The browser could not copy the link automatically.");
    }
  };

  const reset = () => {
    setCode("");
    setLookup({ kind: "idle" });
    setFeedback("");
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/demo" className={styles.brand}>
            <span className={styles.brandMark}>{pack.organization.initials}</span>
            <span>{pack.organization.name}</span>
          </Link>
          <nav className={styles.nav} aria-label="Public navigation">
            <Link href="/demo">Home</Link>
            <Link href="/demo#services">Services</Link>
            <Link href="/demo/track">Track a Request</Link>
            <Link href="/demo/verify-certificate" aria-current="page">Verify Certificate</Link>
            <Link href="/demo#help">Help</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <p>Public institutional verification</p>
          <h1>Verify a certificate</h1>
          <span>Confirm that a certificate or qualification was issued by {pack.organization.name}.</span>
        </section>

        <section className={styles.content}>
          <form className={styles.searchPanel} onSubmit={(event) => { event.preventDefault(); verify(); }}>
            <label htmlFor="verification-code">Certificate number or verification code</label>
            <div className={styles.searchRow}>
              <div className={styles.inputWrap}>
                <Search aria-hidden="true" size={20} />
                <input
                  id="verification-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Enter certificate number or verification code"
                  autoComplete="off"
                />
              </div>
              <button type="button" className={styles.secondaryButton} onClick={scanDemoQr}>
                <QrCode aria-hidden="true" size={19} />
                Scan QR code
              </button>
              <button type="submit" className={styles.primaryButton}>Verify certificate</button>
            </div>
            <div className={styles.searchMeta}>
              <span>Demo code: {verification.defaultCode}</span>
              <span aria-live="polite">{feedback}</span>
            </div>
          </form>

          {lookup.kind === "found" ? (
            <ResultCard
              record={lookup.record}
              privacyNotice={verification.privacyNotice}
              disclaimer={verification.disclaimer}
              onCopy={() => copyLink(lookup.record)}
              onReset={reset}
            />
          ) : null}

          {lookup.kind === "not-found" ? (
            <NotFoundCard
              query={lookup.query}
              privacyNotice={verification.privacyNotice}
              disclaimer={verification.disclaimer}
              onReset={reset}
            />
          ) : null}

          <section className={styles.trustStrip} aria-label="Verification safeguards">
            <div><Landmark aria-hidden="true" size={24} /><span>Official institutional record</span></div>
            <div><CheckCircle2 aria-hidden="true" size={24} /><span>Current validity status</span></div>
            <div><LockKeyhole aria-hidden="true" size={24} /><span>Privacy protected</span></div>
          </section>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© 2026 {pack.organization.name}. All rights reserved.</span>
        <nav><Link href="/demo#privacy">Privacy Policy</Link><Link href="/demo#terms">Terms of Use</Link><Link href="/demo#contact">Contact Us</Link></nav>
      </footer>
    </div>
  );
}

function ResultCard({
  record,
  privacyNotice,
  disclaimer,
  onCopy,
  onReset,
}: {
  readonly record: DemoPublicVerificationRecordConfig;
  readonly privacyNotice: string;
  readonly disclaimer: string;
  readonly onCopy: () => void;
  readonly onReset: () => void;
}) {
  const presentation = presentations[record.status];
  const StatusIcon = presentation.icon;

  return (
    <article className={`${styles.resultCard} ${presentation.className}`} aria-live="polite">
      <div className={styles.resultHeading}>
        <div className={styles.statusIcon}><StatusIcon aria-hidden="true" size={42} /></div>
        <div>
          <div className={styles.titleRow}><h2>{presentation.title}</h2><span>{presentation.label}</span></div>
          <p>{record.publicNote}</p>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <Detail label="Institution" value={record.institution} />
        <Detail label="Issuing office" value={record.issuingOffice} />
        <Detail label="Certificate or qualification" value={record.documentType} />
        <Detail label="Awarded to" value={record.maskedHolderName} />
        <Detail label="Certificate reference" value={record.certificateReference} />
        <Detail label="Award or issuance date" value={formatDate(record.issuedAt)} />
        <Detail label="Current status" value={presentation.label} />
        {record.replacementReference ? <Detail label="Replacement reference" value={record.replacementReference} /> : null}
      </div>

      <div className={styles.resultFooter}>
        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onCopy}><Copy aria-hidden="true" size={18} />Copy verification link</button>
          <button type="button" className={styles.secondaryButton} onClick={onReset}><RefreshCw aria-hidden="true" size={18} />Verify another</button>
        </div>
        <div className={styles.notice}><ShieldCheck aria-hidden="true" size={19} />{privacyNotice}</div>
        <div className={styles.notice}><Clock3 aria-hidden="true" size={19} />Verified {formatTimestamp(record.verifiedAt)}</div>
      </div>
      <div className={styles.disclaimer}><Info aria-hidden="true" size={18} />{disclaimer}</div>
    </article>
  );
}

function NotFoundCard({ query, privacyNotice, disclaimer, onReset }: {
  readonly query: string;
  readonly privacyNotice: string;
  readonly disclaimer: string;
  readonly onReset: () => void;
}) {
  return (
    <article className={`${styles.resultCard} ${styles.notFound}`} aria-live="polite">
      <div className={styles.resultHeading}>
        <div className={styles.statusIcon}><XCircle aria-hidden="true" size={42} /></div>
        <div><div className={styles.titleRow}><h2>Verification record not found</h2><span>NOT FOUND</span></div><p>No controlled institutional record matched “{query}”.</p></div>
      </div>
      <div className={styles.guidance}><TriangleAlert aria-hidden="true" size={22} /><p>A missing record does not by itself prove fraud. Recheck the code and contact the issuing office through an independently verified channel.</p></div>
      <div className={styles.resultFooter}>
        <button type="button" className={styles.secondaryButton} onClick={onReset}><RefreshCw aria-hidden="true" size={18} />Verify another</button>
        <div className={styles.notice}><ShieldCheck aria-hidden="true" size={19} />{privacyNotice}</div>
      </div>
      <div className={styles.disclaimer}><Info aria-hidden="true" size={18} />{disclaimer}</div>
    </article>
  );
}

function Detail({ label, value }: { readonly label: string; readonly value: string }) {
  return <div className={styles.detail}><span>{label}</span><strong>{value}</strong></div>;
}
