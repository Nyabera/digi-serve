"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useSyncExternalStore,
  type Dispatch,
  type ReactNode,
} from "react";

import { demoStateReducer } from "@/features/demo/state/demo-reducer";
import { createDemoSeedState } from "@/features/demo/state/demo-seed";
import type {
  DemoEngineState,
  DemoStateAction,
} from "@/types/demo/demo-state";

export const DEMO_STATE_STORAGE_KEY =
  "faidia.demo-engine.state.v1";

type DemoStateContextValue = {
  readonly state: DemoEngineState;
  readonly dispatch: Dispatch<DemoStateAction>;
  readonly resetDemo: () => void;
  readonly isHydrated: boolean;
};

const DemoStateContext =
  createContext<DemoStateContextValue | undefined>(undefined);

/**
 * Hydration is treated as an external browser condition rather than
 * component state. This avoids synchronously calling setState inside
 * an effect.
 */
function subscribeToHydration(): () => void {
  return () => undefined;
}

function getClientHydrationSnapshot(): boolean {
  return true;
}

function getServerHydrationSnapshot(): boolean {
  return false;
}

function isDemoEngineState(
  value: unknown,
): value is DemoEngineState {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<DemoEngineState>;

  return (
    candidate.schemaVersion === 1 &&
    typeof candidate.clientSlug === "string" &&
    typeof candidate.activeRequestId === "string" &&
    typeof candidate.activeHandoffId === "string" &&
    Array.isArray(candidate.requests) &&
    Array.isArray(candidate.workItems) &&
    Array.isArray(candidate.handoffs) &&
    Array.isArray(candidate.notifications) &&
    Array.isArray(candidate.timelineEvents)
  );
}

function readStoredDemoState(): DemoEngineState | null {
  try {
    const storedValue = window.sessionStorage.getItem(
      DEMO_STATE_STORAGE_KEY,
    );

    if (!storedValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    return isDemoEngineState(parsedValue)
      ? parsedValue
      : null;
  } catch {
    return null;
  }
}

export function DemoStateProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    demoStateReducer,
    undefined,
    createDemoSeedState,
  );

  const skipNextPersistenceRef = useRef(false);

  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  useEffect(() => {
    const storedState = readStoredDemoState();

    if (storedState) {
      /*
       * Prevent the initial seeded state from overwriting the stored
       * state before the hydration action has been applied.
       */
      skipNextPersistenceRef.current = true;

      dispatch({
        type: "HYDRATE_DEMO_STATE",
        state: storedState,
      });
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (skipNextPersistenceRef.current) {
      skipNextPersistenceRef.current = false;
      return;
    }

    try {
      window.sessionStorage.setItem(
        DEMO_STATE_STORAGE_KEY,
        JSON.stringify(state),
      );
    } catch {
      // The demo remains usable when browser storage is unavailable.
    }
  }, [isHydrated, state]);

  const resetDemo = useCallback(() => {
    try {
      window.sessionStorage.removeItem(
        DEMO_STATE_STORAGE_KEY,
      );
    } catch {
      // Reset still proceeds through reducer state.
    }

    dispatch({ type: "RESET_DEMO" });
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      resetDemo,
      isHydrated,
    }),
    [isHydrated, resetDemo, state],
  );

  return (
    <DemoStateContext.Provider value={contextValue}>
      {children}
    </DemoStateContext.Provider>
  );
}

export function useDemoState(): DemoStateContextValue {
  const context = useContext(DemoStateContext);

  if (!context) {
    throw new Error(
      "useDemoState must be used inside DemoStateProvider.",
    );
  }

  return context;
}