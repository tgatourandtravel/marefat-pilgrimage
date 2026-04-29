"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface StickyBarContextValue {
  offset: number;
  setOffset: (height: number) => void;
}

const StickyBarContext = createContext<StickyBarContextValue>({
  offset: 0,
  setOffset: () => {},
});

export function StickyBarProvider({ children }: { children: ReactNode }) {
  const [offset, setOffset] = useState(0);
  return (
    <StickyBarContext.Provider value={{ offset, setOffset }}>
      {children}
    </StickyBarContext.Provider>
  );
}

/** Returns the current sticky-bar height (px). 0 when no bar is present. */
export const useStickyBarOffset = () => useContext(StickyBarContext).offset;

/** Returns the setter — call with the bar's height on mount, 0 on unmount. */
export const useSetStickyBarOffset = () => useContext(StickyBarContext).setOffset;
