"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import { useDemoState } from "@/features/demo/state";

function subscribeToFullscreen(
  callback: () => void,
): () => void {
  document.addEventListener("fullscreenchange", callback);

  return () => {
    document.removeEventListener(
      "fullscreenchange",
      callback,
    );
  };
}

function getFullscreenSnapshot(): boolean {
  return Boolean(document.fullscreenElement);
}

function getServerFullscreenSnapshot(): boolean {
  return false;
}

export function PresentationControls() {
  const router = useRouter();
  const { resetDemo, isHydrated } = useDemoState();

  const isFullscreen = useSyncExternalStore(
    subscribeToFullscreen,
    getFullscreenSnapshot,
    getServerFullscreenSnapshot,
  );

  async function togglePresentationMode() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      // The demo remains usable when fullscreen is unavailable.
    }
  }

  function handleReset() {
    const shouldReset = window.confirm(
      "Reset the complete FAIDIA demonstration to its original synthetic data?",
    );

    if (!shouldReset) {
      return;
    }

    resetDemo();
    router.push("/demo");
  }

  return (
    <div className="flex min-w-max items-center gap-2">
      <button
        type="button"
        disabled={!isHydrated}
        onClick={togglePresentationMode}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isFullscreen
          ? "Exit presentation"
          : "Presentation mode"}
      </button>

      <button
        type="button"
        disabled={!isHydrated}
        onClick={handleReset}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Reset demo
      </button>
    </div>
  );
}
