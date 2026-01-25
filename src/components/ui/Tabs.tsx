"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BaseComponentProps } from "@/design-system/types";

// Context for managing tab state
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

// Main Tabs Container
export interface TabsProps extends BaseComponentProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  urlSync?: boolean; // Enable URL query param sync
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  urlSync = false,
  className = "",
  children,
  ...props
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");

  // Initialize state from URL if urlSync is enabled
  const [internalValue, setInternalValue] = useState(
    urlSync && urlTab ? urlTab : defaultValue
  );

  // Use controlled value if provided, otherwise use internal state
  const currentValue = controlledValue ?? internalValue;

  const handleValueChange = (newValue: string) => {
    if (controlledOnValueChange) {
      controlledOnValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }

    // Update URL if urlSync is enabled
    if (urlSync && typeof window !== "undefined") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", newValue);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  // Sync with URL changes
  useEffect(() => {
    if (urlSync && urlTab && urlTab !== currentValue) {
      setInternalValue(urlTab);
    }
  }, [urlTab, urlSync, currentValue]);

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Tabs List (Navigation)
export interface TabsListProps extends BaseComponentProps {}

export const TabsList: React.FC<TabsListProps> = ({
  className = "",
  children,
  ...props
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 overflow-x-auto border-b border-charcoal/10 scrollbar-hide ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Individual Tab Trigger
export interface TabsTriggerProps extends BaseComponentProps {
  value: string;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  const { value: currentValue, onValueChange } = useTabsContext();
  const isActive = currentValue === value;

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors
        ${
          isActive
            ? "text-charcoal border-b-2 border-gold"
            : "text-charcoal/60 hover:text-charcoal border-b-2 border-transparent"
        }
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Tab Content Panel
export interface TabsContentProps extends BaseComponentProps {
  value: string;
  forceMount?: boolean;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  forceMount = false,
  className = "",
  children,
  ...props
}) => {
  const { value: currentValue } = useTabsContext();
  const isActive = currentValue === value;

  if (!isActive && !forceMount) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      aria-hidden={!isActive}
      tabIndex={0}
      className={`
        ${isActive ? "animate-in fade-in-50 duration-200" : "hidden"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
