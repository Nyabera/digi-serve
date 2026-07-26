"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Mail,
  Phone,
  Send,
  UsersRound,
} from "lucide-react";

import styles from "./external-recipient-share-panel.module.css";

type ShareMode = "department" | "external";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim(),
  );
}

function isValidPhone(value: string) {
  return /^\+?[0-9][0-9\s-]{7,}$/.test(
    value.trim(),
  );
}

export function ExternalRecipientSharePanel() {
  const [mode, setMode] =
    useState<ShareMode>("department");
  const [recipientName, setRecipientName] =
    useState("");
  const [recipientValue, setRecipientValue] =
    useState("");
  const [message, setMessage] = useState(
    "Please review the shared case information and provide your response.",
  );
  const [sent, setSent] = useState(false);

  const recipientType = useMemo(() => {
    if (isValidEmail(recipientValue)) {
      return "email";
    }

    if (isValidPhone(recipientValue)) {
      return "phone";
    }

    return null;
  }, [recipientValue]);

  const canSend =
    mode === "external" &&
    recipientName.trim().length > 1 &&
    recipientType !== null;

  function sendExternalShare() {
    if (!canSend) {
      return;
    }

    setSent(true);
  }

  return (
    <section
      className={styles.panel}
      data-external-recipient-share="true"
      aria-labelledby="share-destination-title"
    >
      <div className={styles.heading}>
        <div>
          <h3 id="share-destination-title">
            Share destination
          </h3>
          <p>
            Refer internally or send a controlled case
            link to an email address or phone number.
          </p>
        </div>

        {sent ? (
          <span className={styles.sentBadge}>
            <CheckCircle2 aria-hidden="true" />
            Demo link sent
          </span>
        ) : null}
      </div>

      <div
        className={styles.modeSelector}
        role="group"
        aria-label="Choose share destination"
      >
        <button
          type="button"
          data-active={
            mode === "department"
              ? "true"
              : undefined
          }
          onClick={() => {
            setMode("department");
            setSent(false);
          }}
        >
          <UsersRound aria-hidden="true" />
          College department
        </button>

        <button
          type="button"
          data-active={
            mode === "external"
              ? "true"
              : undefined
          }
          onClick={() => {
            setMode("external");
            setSent(false);
          }}
        >
          <Mail aria-hidden="true" />
          Email or phone number
        </button>
      </div>

      {mode === "department" ? (
        <div className={styles.internalNotice}>
          Continue with the department and officer
          selectors below. Parent ownership remains with
          the current department.
        </div>
      ) : (
        <div className={styles.externalFields}>
          <label>
            <span>Recipient name</span>
            <input
              type="text"
              value={recipientName}
              onChange={(event) => {
                setRecipientName(event.target.value);
                setSent(false);
              }}
              placeholder="e.g. Jane Wanjiku"
            />
          </label>

          <label>
            <span>Email or phone number</span>
            <div className={styles.recipientInput}>
              {recipientType === "phone" ? (
                <Phone aria-hidden="true" />
              ) : (
                <Mail aria-hidden="true" />
              )}
              <input
                type="text"
                inputMode="email"
                value={recipientValue}
                onChange={(event) => {
                  setRecipientValue(event.target.value);
                  setSent(false);
                }}
                placeholder="name@example.com or +254 7..."
              />
            </div>
            {recipientValue &&
            recipientType === null ? (
              <small>
                Enter a valid email address or phone
                number.
              </small>
            ) : null}
          </label>

          <label className={styles.messageField}>
            <span>External share message</span>
            <textarea
              rows={3}
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
            />
          </label>

          <div className={styles.externalActions}>
            <div>
              <strong>Demo access controls</strong>
              <span>
                Read-only link · expires after 7 days ·
                activity logged
              </span>
            </div>

            <button
              type="button"
              disabled={!canSend}
              onClick={sendExternalShare}
            >
              <Send aria-hidden="true" />
              Send secure link
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
