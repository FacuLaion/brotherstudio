"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot, getCard } from "@/lib/gallery";

/**
 * Two jobs in one tiny global component:
 *  1. Renders the coral hand cursor. Its position / visibility / "armed" state
 *     are driven purely by CSS (`--hand-x/--hand-y` + root data-attrs that
 *     GestureControl sets), so this never re-renders on pointer movement.
 *  2. Swipe coordinator: the single place that applies a gesture swipe to the
 *     focused carousel's imperative API. Using a versioned `swipeSeq` means two
 *     identical swipes in a row still register.
 */
export function HandCursor() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const lastSeq = useRef(0);

  useEffect(() => {
    if (snap.swipeSeq === 0 || snap.swipeSeq === lastSeq.current) return;
    lastSeq.current = snap.swipeSeq;
    const card = getCard(snap.swipeId);
    if (!card) return;
    if (snap.swipeDir > 0) card.next();
    else card.prev();
  }, [snap.swipeSeq, snap.swipeId, snap.swipeDir]);

  return <div className="hand-cursor" aria-hidden />;
}
