import React from "react";
import { BaseComponentProps, SizeVariant } from "@/design-system/types";

export interface SelectProps
  extends BaseComponentProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: SizeVariant;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string } | string>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      size = "md",
      fullWidth = true,
      className = "",
      id,
      required,
      options,
      ...props
    },
    ref
  ) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    // Minimum height standards for user-friendly selects (matching Input component)
    const sizeStyles: Record<SizeVariant, string> = {
      xs: "px-2.5 py-1.5 text-xs min-h-[32px]",
      sm: "px-3 py-2 text-xs min-h-[36px]",
      md: "px-3 py-2.5 text-sm min-h-[42px]",
      lg: "px-4 py-3 text-base min-h-[48px]",
      xl: "px-5 py-4 text-lg min-h-[56px]",
    };

    const baseStyles =
      "w-full rounded-xl border text-charcoal transition focus:outline-none focus:ring-2 cursor-pointer";

    const borderColor = error
      ? "border-danger bg-danger-light/10 focus:border-danger focus:ring-danger/20"
      : "border-charcoal/10 bg-ivory focus:border-gold focus:ring-gold/20";

    const normalizedOptions = options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option
    );

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-medium text-charcoal"
          >
            {label}
            {required && <span className="ml-1 text-danger">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${sizeStyles[size]} ${borderColor} ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error || helperText
              ? `${inputId}-${error ? "error" : "helper"}`
              : undefined
          }
          required={required}
          {...props}
        >
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-xs text-danger"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-xs text-charcoal/60">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
