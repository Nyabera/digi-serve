"use client";

import {
  CheckCircle2,
  Keyboard,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

type DemoPresentationFrameProps = {
  readonly controls: ReactNode;
  readonly children: ReactNode;
};

type PresentationStep = {
  readonly eyebrow: string;
  readonly label: string;
};

const DEMO_STORAGE_PREFIX = "faidia.demo-engine.";
const DEMO_STATE_STORAGE_KEY =
  "faidia.demo-engine.state.v1";
const PRESENTATION_STORAGE_KEY =
  "faidia.demo-engine.presentation.v1";

function isInteractiveTarget(
  target: EventTarget | null,
): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      "input, textarea, select, button, a, [contenteditable='true']",
    ),
  );
}

function normalizeControlText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function isPresentationControl(
  element: Element,
): boolean {
  const text = normalizeControlText(
    element.textContent ?? "",
  );
  const label = normalizeControlText(
    element.getAttribute("aria-label") ?? "",
  );

  return (
    text.includes("presentation") ||
    text === "present" ||
    label.includes("presentation") ||
    label === "present"
  );
}

function isResetControl(element: Element): boolean {
  const text = normalizeControlText(
    element.textContent ?? "",
  );
  const label = normalizeControlText(
    element.getAttribute("aria-label") ?? "",
  );

  return (
    text.includes("reset") ||
    label.includes("reset")
  );
}

function presentationStep(
  pathname: string,
): PresentationStep {
  if (pathname === "/demo") {
    return {
      eyebrow: "Step 1",
      label: "Public service portal",
    };
  }

  if (pathname.startsWith("/demo/services/")) {
    return {
      eyebrow: "Step 2",
      label: "Service information",
    };
  }

  if (pathname.startsWith("/demo/sign-up")) {
    return {
      eyebrow: "Step 3",
      label: "Applicant sign-up",
    };
  }

  if (pathname.startsWith("/demo/apply/")) {
    return {
      eyebrow: "Step 4",
      label: "Application and documents",
    };
  }

  if (
    pathname.includes("/confirmation")
  ) {
    return {
      eyebrow: "Step 5",
      label: "Review and submission",
    };
  }

  if (pathname === "/demo/officer") {
    return {
      eyebrow: "Step 6",
      label: "Officer request queue",
    };
  }

  if (
    pathname.startsWith(
      "/demo/officer/requests/",
    )
  ) {
    return {
      eyebrow: "Step 7",
      label: "Officer review and referral",
    };
  }

  if (pathname === "/demo/department") {
    return {
      eyebrow: "Step 8",
      label: "Finance processing",
    };
  }

  if (pathname === "/demo/supervisor") {
    return {
      eyebrow: "Step 9",
      label: "Registrar approval",
    };
  }

  if (
    pathname.startsWith("/demo/outcomes/")
  ) {
    return {
      eyebrow: "Step 10",
      label: "Controlled outcome",
    };
  }

  if (pathname === "/demo/reports") {
    return {
      eyebrow: "Management view",
      label: "Operational reporting",
    };
  }

  if (pathname.startsWith("/demo/track/")) {
    return {
      eyebrow: "Applicant view",
      label: "Request tracking",
    };
  }

  return {
    eyebrow: "FAIDIA demo",
    label: "Service operations journey",
  };
}

export function DemoPresentationFrame({
  controls,
  children,
}: DemoPresentationFrameProps) {
  const pathname = usePathname();
  const resetTitleId = useId();
  const resetDescriptionId = useId();
  const controlZoneRef =
    useRef<HTMLDivElement>(null);
  const resetDialogRef =
    useRef<HTMLDivElement>(null);
  const resetButtonRef =
    useRef<HTMLButtonElement>(null);

  const [isPresenting, setIsPresenting] =
    useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] =
    useState(false);
  const [hasPresentationControl, setHasPresentationControl] =
    useState(false);
  const [hasResetControl, setHasResetControl] =
    useState(false);
  const [statusMessage, setStatusMessage] =
    useState<string | null>(null);

  const step = presentationStep(pathname);

  const applyPresentationAttribute =
    useCallback((active: boolean) => {
      if (active) {
        document.documentElement.dataset.demoPresentation =
          "true";
        document.body.dataset.demoPresentation =
          "true";
        return;
      }

      delete document.documentElement.dataset
        .demoPresentation;
      delete document.body.dataset.demoPresentation;
    }, []);

  const exitPresentation = useCallback(
    async () => {
      setIsPresenting(false);
      sessionStorage.removeItem(
        PRESENTATION_STORAGE_KEY,
      );
      applyPresentationAttribute(false);

      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // CSS presentation mode remains safely disabled.
        }
      }

      setStatusMessage("Presentation mode closed.");
    },
    [applyPresentationAttribute],
  );

  const enterPresentation = useCallback(
    async () => {
      setIsPresenting(true);
      sessionStorage.setItem(
        PRESENTATION_STORAGE_KEY,
        "true",
      );
      applyPresentationAttribute(true);

      if (
        !document.fullscreenElement &&
        document.documentElement.requestFullscreen
      ) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          // Fullscreen may be blocked; route-scoped presentation
          // styling still provides the clean buyer-facing view.
        }
      }

      setStatusMessage(
        "Presentation mode active. Press Escape to exit.",
      );
    },
    [applyPresentationAttribute],
  );

  const togglePresentation = useCallback(
    () => {
      if (isPresenting) {
        void exitPresentation();
        return;
      }

      void enterPresentation();
    },
    [
      enterPresentation,
      exitPresentation,
      isPresenting,
    ],
  );

  const openResetDialog = useCallback(() => {
    setIsResetDialogOpen(true);
    setStatusMessage(
      "Reset confirmation opened.",
    );
  }, []);

  const closeResetDialog = useCallback(() => {
    setIsResetDialogOpen(false);
    setStatusMessage(
      "Reset cancelled.",
    );
  }, []);

  const resetDemoJourney = useCallback(() => {
    const keysToRemove: string[] = [];

    for (
      let index = 0;
      index < sessionStorage.length;
      index += 1
    ) {
      const key = sessionStorage.key(index);

      if (
        key &&
        key.startsWith(DEMO_STORAGE_PREFIX)
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      sessionStorage.removeItem(key);
    });

    sessionStorage.removeItem(
      DEMO_STATE_STORAGE_KEY,
    );
    sessionStorage.removeItem(
      PRESENTATION_STORAGE_KEY,
    );

    applyPresentationAttribute(false);

    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {
        // Reload still resets the browser-session demo.
      });
    }

    window.location.assign("/demo");
  }, [applyPresentationAttribute]);

  useEffect(() => {
    const restored =
      sessionStorage.getItem(
        PRESENTATION_STORAGE_KEY,
      ) === "true";

    setIsPresenting(restored);
    applyPresentationAttribute(restored);

    return () => {
      applyPresentationAttribute(false);
    };
  }, [applyPresentationAttribute]);

  useEffect(() => {
    const zone = controlZoneRef.current;

    if (!zone) {
      return;
    }

    const controlsInZone = Array.from(
      zone.querySelectorAll(
        "button, a, [role='button']",
      ),
    );

    const presentationControl =
      controlsInZone.find(
        isPresentationControl,
      );
    const resetControl =
      controlsInZone.find(isResetControl);

    if (presentationControl) {
      presentationControl.setAttribute(
        "data-demo-presentation-trigger",
        "true",
      );
      presentationControl.setAttribute(
        "title",
        "Presentation mode · Shift + P",
      );
    }

    if (resetControl) {
      resetControl.setAttribute(
        "data-demo-reset-trigger",
        "true",
      );
      resetControl.setAttribute(
        "title",
        "Reset demo journey · Shift + R",
      );
    }

    setHasPresentationControl(
      Boolean(presentationControl),
    );
    setHasResetControl(
      Boolean(resetControl),
    );

    const interceptControls = (
      event: MouseEvent,
    ) => {
      const target =
        event.target instanceof Element
          ? event.target.closest(
              "button, a, [role='button']",
            )
          : null;

      if (!target || !zone.contains(target)) {
        return;
      }

      if (isPresentationControl(target)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        togglePresentation();
        return;
      }

      if (isResetControl(target)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        openResetDialog();
      }
    };

    zone.addEventListener(
      "click",
      interceptControls,
      true,
    );

    return () => {
      zone.removeEventListener(
        "click",
        interceptControls,
        true,
      );
    };
  }, [
    controls,
    openResetDialog,
    togglePresentation,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        isPresenting &&
        !document.fullscreenElement
      ) {
        setIsPresenting(false);
        sessionStorage.removeItem(
          PRESENTATION_STORAGE_KEY,
        );
        applyPresentationAttribute(false);
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [
    applyPresentationAttribute,
    isPresenting,
  ]);

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent,
    ) => {
      if (
        isInteractiveTarget(event.target) &&
        event.key !== "Escape"
      ) {
        return;
      }

      if (
        event.shiftKey &&
        event.key.toLowerCase() === "p"
      ) {
        event.preventDefault();
        togglePresentation();
        return;
      }

      if (
        event.shiftKey &&
        event.key.toLowerCase() === "r"
      ) {
        event.preventDefault();
        openResetDialog();
        return;
      }

      if (event.key === "Escape") {
        if (isResetDialogOpen) {
          event.preventDefault();
          closeResetDialog();
          return;
        }

        if (isPresenting) {
          event.preventDefault();
          void exitPresentation();
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, [
    closeResetDialog,
    exitPresentation,
    isPresenting,
    isResetDialogOpen,
    openResetDialog,
    togglePresentation,
  ]);

  useEffect(() => {
    if (!isResetDialogOpen) {
      return;
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    resetButtonRef.current?.focus();

    const handleDialogKeydown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key !== "Tab" ||
        !resetDialogRef.current
      ) {
        return;
      }

      const focusable = Array.from(
        resetDialogRef.current.querySelectorAll<HTMLElement>(
          "button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])",
        ),
      );

      const first = focusable[0];
      const last =
        focusable[focusable.length - 1];

      if (!first || !last) {
        return;
      }

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleDialogKeydown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleDialogKeydown,
      );
      previousActiveElement?.focus();
    };
  }, [isResetDialogOpen]);

  function handleBackdropClick(
    event: ReactMouseEvent<HTMLDivElement>,
  ) {
    if (event.target === event.currentTarget) {
      closeResetDialog();
    }
  }

  return (
    <div
      className="demo-presentation-frame"
      data-demo-frame="true"
      data-presentation-active={
        isPresenting ? "true" : "false"
      }
    >
      <div
        ref={controlZoneRef}
        className="demo-control-zone"
        data-demo-control-zone="true"
      >
        {controls}

        {!hasPresentationControl ||
        !hasResetControl ? (
          <div
            className="demo-presentation-fallback-actions"
            aria-label="Demo presentation actions"
          >
            {!hasPresentationControl ? (
              <button
                type="button"
                onClick={togglePresentation}
                className="demo-presentation-action"
              >
                <Maximize2
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                Present
              </button>
            ) : null}

            {!hasResetControl ? (
              <button
                type="button"
                onClick={openResetDialog}
                className="demo-presentation-action demo-presentation-action-danger"
              >
                <RotateCcw
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                Reset demo
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        className="demo-presentation-content"
        data-demo-content="true"
      >
        {children}
      </div>

      {isPresenting ? (
        <>
          <div
            className="demo-presenter-route-label"
            aria-hidden="true"
          >
            <span>{step.eyebrow}</span>
            <strong>{step.label}</strong>
          </div>

          <button
            type="button"
            onClick={() => {
              void exitPresentation();
            }}
            className="demo-presenter-exit"
            aria-label="Exit presentation mode"
          >
            <Minimize2
              aria-hidden="true"
              className="h-4 w-4"
            />
            Exit presentation
            <kbd>Esc</kbd>
          </button>
        </>
      ) : null}

      {!isPresenting ? (
        <div
          className="demo-presentation-shortcut-hint"
          aria-label="Presentation keyboard shortcuts"
        >
          <Keyboard
            aria-hidden="true"
            className="h-4 w-4"
          />
          <span>
            <kbd>Shift</kbd> + <kbd>P</kbd>{" "}
            present
          </span>
          <span>
            <kbd>Shift</kbd> + <kbd>R</kbd>{" "}
            reset
          </span>
        </div>
      ) : null}

      {isResetDialogOpen ? (
        <div
          className="demo-reset-backdrop"
          onMouseDown={handleBackdropClick}
          data-demo-reset-dialog="true"
        >
          <div
            ref={resetDialogRef}
            className="demo-reset-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={resetTitleId}
            aria-describedby={
              resetDescriptionId
            }
          >
            <div className="demo-reset-dialog-icon">
              <RotateCcw
                aria-hidden="true"
                className="h-5 w-5"
              />
            </div>

            <button
              type="button"
              onClick={closeResetDialog}
              className="demo-reset-dialog-close"
              aria-label="Close reset confirmation"
            >
              <X
                aria-hidden="true"
                className="h-4 w-4"
              />
            </button>

            <p className="demo-reset-eyebrow">
              Browser-session reset
            </p>
            <h2 id={resetTitleId}>
              Reset the complete demo journey?
            </h2>
            <p id={resetDescriptionId}>
              This clears applicant details,
              application responses, selected document
              metadata, request processing, Finance
              results, Registrar decisions, issued
              outcomes and presentation state from this
              browser session.
            </p>

            <div className="demo-reset-summary">
              <CheckCircle2
                aria-hidden="true"
                className="h-4 w-4"
              />
              <span>
                Production data and Supabase are not touched.
              </span>
            </div>

            <div className="demo-reset-actions">
              <button
                type="button"
                onClick={closeResetDialog}
                className="demo-reset-cancel"
              >
                Keep current journey
              </button>

              <button
                ref={resetButtonRef}
                type="button"
                onClick={resetDemoJourney}
                className="demo-reset-confirm"
              >
                Reset and return home
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessage}
      </p>
    </div>
  );
}
