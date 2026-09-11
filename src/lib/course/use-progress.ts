"use client";

import { useSyncExternalStore } from "react";

const KEY = "ct101:completed";

// Module-level store so the sidebar, reader, and landing stay in sync and
// hydration is stable (server + first client render both see EMPTY).
const EMPTY: ReadonlySet<string> = new Set();
let state: ReadonlySet<string> = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...state]));
  } catch {
    /* ignore */
  }
}

function load() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    state = new Set();
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!hydrated) {
    load();
    emit();
  }
  return () => listeners.delete(cb);
}

export function markDone(slug: string) {
  if (state.has(slug)) return;
  state = new Set(state).add(slug);
  persist();
  emit();
}

export function resetProgress() {
  state = new Set();
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}

/** Reactive, localStorage-backed chapter completion. */
export function useProgress() {
  const done = useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
  return { done, ready: hydrated, markDone, reset: resetProgress };
}
