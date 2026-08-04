"use client";

import { useDemoState } from "@/features/demo/state";

export function RequestSwitcher() {
  const { state, dispatch, isHydrated } = useDemoState();

  function selectRequest(requestId: string) {
    dispatch({
      type: "SET_ACTIVE_REQUEST",
      requestId,
      at: new Date().toISOString(),
    });
  }

  return (
    <label className="flex min-w-max items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">
        Request
      </span>

      <select
        value={state.activeRequestId}
        disabled={!isHydrated}
        onChange={(event) =>
          selectRequest(event.target.value)
        }
        className="h-9 max-w-64 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 outline-none transition hover:border-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.requests.map((request) => (
          <option key={request.id} value={request.id}>
            {request.reference} — {request.publicStatus}
          </option>
        ))}
      </select>
    </label>
  );
}
