"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./external-recipient-share-panel.module.css";

type RecipientMode = "department" | "external";
type ExternalChannel = "email" | "phone";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhone(value: string) {
  return /^\+?[0-9][0-9\s()-]{7,18}$/.test(value.trim());
}

export function ExternalRecipientSharePanel() {
  const panelRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<RecipientMode>("department");
  const [channel, setChannel] = useState<ExternalChannel>("email");
  const [recipientName, setRecipientName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    let host: HTMLElement | null = panel.parentElement;
    let labels: HTMLLabelElement[] = [];

    while (host) {
      labels = Array.from(host.querySelectorAll("label"));
      const hasRecipientFields = labels.some((label) => {
        const value = label.textContent?.trim().toLowerCase() ?? "";
        return (
          value.includes("share with") ||
          value === "officer" ||
          value.startsWith("officer ")
        );
      });

      if (hasRecipientFields) {
        break;
      }

      host = host.parentElement;
    }

    if (!host) {
      return;
    }

    host.dataset.recipientHost = "true";
    host.dataset.recipientMode = mode;

    const recipientLabels = labels.filter((label) => {
      const value = label.textContent?.trim().toLowerCase() ?? "";
      return (
        value.includes("share with") ||
        value === "officer" ||
        value.startsWith("officer ")
      );
    });

    const marked = recipientLabels
      .map((label) => {
        const candidate = label.closest(
          "[class*='field'], [class*='Field'], div, section, fieldset",
        );
        return candidate === host ? label.parentElement : candidate;
      })
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    marked.forEach((element) => {
      element.dataset.internalRecipientFields = "true";
    });

    return () => {
      delete host.dataset.recipientHost;
      delete host.dataset.recipientMode;
      marked.forEach((element) => {
        delete element.dataset.internalRecipientFields;
      });
    };
  }, [mode]);

  const validRecipient = useMemo(
    () => (channel === "email" ? isEmail(recipient) : isPhone(recipient)),
    [channel, recipient],
  );

  const prepareShare = () => {
    if (!validRecipient) {
      setStatus(
        channel === "email"
          ? "Enter a valid email address."
          : "Enter a valid phone number, including the country code.",
      );
      return;
    }

    setStatus(
      `Demo referral link prepared for ${recipientName.trim() || recipient.trim()}. No message was sent outside the browser.`,
    );
  };

  return (
    <section
      className={styles.panel}
      data-external-recipient-panel="true"
      ref={panelRef}
    >
      <header className={styles.header}>
        <div>
          <h3>Recipient type</h3>
          <p>
            Refer internally to a department or share a secure demo link with
            an external email address or phone number.
          </p>
        </div>
      </header>

      <div
        aria-label="Choose referral recipient type"
        className={styles.modeSelector}
        role="group"
      >
        <button
          data-active={mode === "department" ? "true" : undefined}
          onClick={() => {
            setMode("department");
            setStatus("");
          }}
          type="button"
        >
          Department or officer
        </button>
        <button
          data-active={mode === "external" ? "true" : undefined}
          onClick={() => {
            setMode("external");
            setStatus("");
          }}
          type="button"
        >
          Email or phone number
        </button>
      </div>

      <input name="recipientMode" type="hidden" value={mode} />

      {mode === "department" ? (
        <p className={styles.internalNotice}>
          Use the department and officer inputs below.
        </p>
      ) : (
        <div className={styles.externalFields}>
          <div className={styles.field}>
            <label htmlFor="external-recipient-channel">Share through</label>
            <select
              id="external-recipient-channel"
              name="externalRecipientChannel"
              onChange={(event) => {
                setChannel(event.target.value as ExternalChannel);
                setRecipient("");
                setStatus("");
              }}
              value={channel}
            >
              <option value="email">Email address</option>
              <option value="phone">Phone number</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="external-recipient-name">
              Recipient name <span>Optional</span>
            </label>
            <input
              id="external-recipient-name"
              name="externalRecipientName"
              onChange={(event) => setRecipientName(event.target.value)}
              placeholder="Enter the recipient’s name"
              value={recipientName}
            />
          </div>

          <div className={`${styles.field} ${styles.recipientField}`}>
            <label htmlFor="external-recipient-value">
              {channel === "email" ? "Email address" : "Phone number"}
            </label>
            <input
              aria-invalid={recipient.length > 0 && !validRecipient}
              id="external-recipient-value"
              inputMode={channel === "email" ? "email" : "tel"}
              name="externalRecipient"
              onChange={(event) => {
                setRecipient(event.target.value);
                setStatus("");
              }}
              placeholder={
                channel === "email"
                  ? "name@example.com"
                  : "+254 7XX XXX XXX"
              }
              type={channel === "email" ? "email" : "tel"}
              value={recipient}
            />
          </div>

          <div className={`${styles.field} ${styles.messageField}`}>
            <label htmlFor="external-recipient-message">
              Message to recipient <span>Optional</span>
            </label>
            <textarea
              id="external-recipient-message"
              name="externalRecipientMessage"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Explain why the workflow is being shared and what response is needed."
              value={message}
            />
          </div>

          <div className={styles.externalActions}>
            <p role="status">{status}</p>
            <button onClick={prepareShare} type="button">
              Prepare secure link
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
