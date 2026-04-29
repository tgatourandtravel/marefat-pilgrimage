"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface StickyBarContextValue {
  offset: number;
  setOffset: (height: number) => void;
  /** When true, FloatingWhatsApp hides itself (e.g. while a bottom sheet is open) */
  floatingHidden: boolean;
  setFloatingHidden: (hidden: boolean) => void;
}

const StickyBarContext = createContext<StickyBarContextValue>({
  offset: 0,
  setOffset: () => {},
  floatingHidden: false,
  setFloatingHidden: () => {},
});

export function StickyBarProvider({ children }: { children: ReactNode }) {
  const [offset, setOffset] = useState(0);
  const [floatingHidden, setFloatingHidden] = useState(false);
  return (
    <StickyBarContext.Provider value={{ offset, setOffset, floatingHidden, setFloatingHidden }}>
      {children}
    </StickyBarContext.Provider>
  );
}

/** Returns the current sticky-bar height (px). 0 when no bar is present. */
export const useStickyBarOffset = () => useContext(StickyBarContext).offset;

/** Returns the setter — call with the bar's height on mount, 0 on unmount. */
export const useSetStickyBarOffset = () => useContext(StickyBarContext).setOffset;

/** Returns whether the floating WhatsApp button should be hidden. */
export const useFloatingHidden = () => useContext(StickyBarContext).floatingHidden;

/** Returns the setter for hiding/showing the floating WhatsApp button. */
export const useSetFloatingHidden = () => useContext(StickyBarContext).setFloatingHidden;
