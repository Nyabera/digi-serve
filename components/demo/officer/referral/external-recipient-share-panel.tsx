"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./external-recipient-share-panel.module.css";

type RecipientMode = "department" | "external";
type ExternalChannel = "email" | "phone";

function normalizedText(element: Element | null) {
  return (
    element?.textContent
      ?.replace(/\s+/g, " ")
      .trim()
      .toLowerCase() ?? ""
  );
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhone(value: string) {
  return /^\+?[0-9][0-9\s()-]{7,18}$/.test(value.trim());
}

function nearestFieldContainer(
  start: Element | null,
  requiredSelector: string,
) {
  let current =
    start instanceof HTMLElement ? start : start?.parentElement ?? null;

  for (let depth = 0; current && depth < 7; depth += 1) {
    const controls = current.querySelectorAll(requiredSelector);
    const text = normalizedText(current);

    if (controls.length === 1 && text.length < 360) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function findLeafText(
  pattern: RegExp,
  root: ParentNode = document,
) {
  const candidates = Array.from(
    root.querySelectorAll(
      "label, h1, h2, h3, h4, p, span, strong, legend",
    ),
  );

  return (
    candidates.find((element) => {
      if (element.closest("[data-external-recipient-panel='true']")) {
        return false;
      }

      return pattern.test(normalizedText(element));
    }) ?? null
  );
}

function locateMessageField() {
  const messageLabel = findLeafText(/^message\s+to\s+officer\b/i);

  if (messageLabel) {
    const field = nearestFieldContainer(
      messageLabel,
      "textarea, [contenteditable='true']",
    );

    if (field) {
      return field;
    }
  }

  const textareas = Array.from(
    document.querySelectorAll("textarea"),
  ) as HTMLTextAreaElement[];

  const likelyTextarea =
    textareas.find((textarea) => {
      const placeholder = textarea.placeholder.toLowerCase();
      const hostText = normalizedText(textarea.parentElement);

      return (
        placeholder.includes("payment reference") ||
        placeholder.includes("confirm whether") ||
        textarea.maxLength >= 900 ||
        hostText.includes("message to officer")
      );
    }) ?? null;

  if (likelyTextarea) {
    return (
      nearestFieldContainer(likelyTextarea, "textarea") ??
      likelyTextarea.parentElement
    );
  }

  return null;
}

function locateExpectedOutputField() {
  const expectedLabel = findLeafText(/^expected\s+output\b/i);

  if (!expectedLabel) {
    return null;
  }

  return nearestFieldContainer(
    expectedLabel,
    "input, textarea, select, [role='textbox'], [role='combobox']",
  );
}

function locateWorkflowCard() {
  const heading = findLeafText(/share\s*\/\s*refer\s+workflow/i);

  if (!heading) {
    return null;
  }

  let current: HTMLElement | null =
    heading instanceof HTMLElement
      ? heading
      : heading.parentElement;

  for (let depth = 0; current && depth < 8; depth += 1) {
    const text = normalizedText(current);
    const hasAction =
      text.includes("start review") ||
      text.includes("expected output") ||
      text.includes("what will be shared");

    if (hasAction && current.children.length >= 2) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function findInternalRecipientFields(
  host: HTMLElement,
) {
  const labels = Array.from(
    host.querySelectorAll("label, legend, span, p"),
  );

  const marked = new Set<HTMLElement>();

  labels.forEach((label) => {
    if (label.closest("[data-external-recipient-panel='true']")) {
      return;
    }

    const text = normalizedText(label);
    const matches =
      text.includes("share with") ||
      text === "department" ||
      text === "officer" ||
      text.startsWith("officer ");

    if (!matches) {
      return;
    }

    const field = nearestFieldContainer(
      label,
      "select, input, [role='combobox']",
    );

    if (field) {
      marked.add(field);
    }
  });

  return Array.from(marked);
}

export function ExternalRecipientSharePanel() {
  const [portalTarget, setPortalTarget] =
    useState<HTMLElement | null>(null);
  const [mode, setMode] =
    useState<RecipientMode>("department");
  const [channel, setChannel] =
    useState<ExternalChannel>("email");
  const [recipientName, setRecipientName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const hostRef = useRef<HTMLElement | null>(null);
  const markedFieldsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    let mount: HTMLDivElement | null = null;
    let observer: MutationObserver | null = null;
    let cancelled = false;

    const install = () => {
      if (cancelled || mount?.isConnected) {
        return Boolean(mount?.isConnected);
      }

      const messageField = locateMessageField();
      const expectedField = locateExpectedOutputField();
      const workflowCard = locateWorkflowCard();

      let parent: HTMLElement | null = null;
      let before: Element | null = null;

      if (messageField?.parentElement) {
        parent = messageField.parentElement;
        before = messageField;
      } else if (expectedField?.parentElement) {
        parent = expectedField.parentElement;
        before = expectedField;
      } else if (workflowCard) {
        parent = workflowCard;
        before = workflowCard.children.item(1);
      }

      if (!parent) {
        return false;
      }

      mount = document.createElement("div");
      mount.dataset.externalRecipientPortalTarget = "true";
      mount.className = styles.portalTarget;

      if (before) {
        parent.insertBefore(mount, before);
      } else {
        parent.appendChild(mount);
      }

      hostRef.current =
        workflowCard ??
        parent.closest<HTMLElement>(
          "section, article, form, [class*='panel'], [class*='card']",
        ) ??
        parent;

      markedFieldsRef.current = findInternalRecipientFields(
        hostRef.current,
      );

      setPortalTarget(mount);
      return true;
    };

    if (!install()) {
      observer = new MutationObserver(() => {
        if (install()) {
          observer?.disconnect();
          observer = null;
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      cancelled = true;
      observer?.disconnect();

      markedFieldsRef.current.forEach((field) => {
        field.hidden = false;
        delete field.dataset.internalRecipientField;
      });

      if (hostRef.current) {
        delete hostRef.current.dataset.recipientMode;
      }

      mount?.remove();
      setPortalTarget(null);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const markedFields = markedFieldsRef.current;

    if (host) {
      host.dataset.recipientMode = mode;
    }

    markedFields.forEach((field) => {
      field.dataset.internalRecipientField = "true";
      field.hidden = mode === "external";
    });

    return () => {
      markedFields.forEach((field) => {
        field.hidden = false;
      });
    };
  }, [mode, portalTarget]);

  const validRecipient = useMemo(
    () =>
      channel === "email"
        ? isEmail(recipient)
        : isPhone(recipient),
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
      `Demo referral link prepared for ${
        recipientName.trim() || recipient.trim()
      }. No message was sent outside the browser.`,
    );
  };

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <section
      className={styles.panel}
      data-external-recipient-panel="true"
    >
      <div className={styles.heading}>
        <h3>Choose recipient</h3>
        <p>
          Refer to a department or officer, or share a secure demo link
          using an email address or phone number.
        </p>
      </div>

      <div
        aria-label="Choose referral recipient type"
        className={styles.modeSelector}
        role="group"
      >
        <button
          data-active={
            mode === "department" ? "true" : undefined
          }
          onClick={() => {
            setMode("department");
            setStatus("");
          }}
          type="button"
        >
          Department or officer
        </button>

        <span aria-hidden="true" className={styles.orLabel}>
          or
        </span>

        <button
          data-active={
            mode === "external" ? "true" : undefined
          }
          onClick={() => {
            setMode("external");
            setStatus("");
          }}
          type="button"
        >
          Email or phone number
        </button>
      </div>

      {mode === "department" ? (
        <p className={styles.internalNotice}>
          Use the department and officer fields below.
        </p>
      ) : (
        <div className={styles.externalFields}>
          <div className={styles.field}>
            <label htmlFor="external-recipient-channel">
              Share through
            </label>
            <select
              id="external-recipient-channel"
              onChange={(event) => {
                setChannel(
                  event.target.value as ExternalChannel,
                );
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
              onChange={(event) =>
                setRecipientName(event.target.value)
              }
              placeholder="Enter the recipient’s name"
              value={recipientName}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="external-recipient-value">
              {channel === "email"
                ? "Email address"
                : "Phone number"}
            </label>
            <input
              aria-invalid={
                recipient.length > 0 && !validRecipient
              }
              id="external-recipient-value"
              inputMode={
                channel === "email" ? "email" : "tel"
              }
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

          <div
            className={`${styles.field} ${styles.messageField}`}
          >
            <label htmlFor="external-recipient-message">
              Message to recipient <span>Optional</span>
            </label>
            <textarea
              id="external-recipient-message"
              onChange={(event) =>
                setMessage(event.target.value)
              }
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
    </section>,
    portalTarget,
  );
}
