import React from "react";
import { BaseComponentProps, SizeVariant } from "@/design-system/types";

export interface InputProps
  extends BaseComponentProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: SizeVariant;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Minimum height standards for user-friendly inputs
    const sizeStyles: Record<SizeVariant, string> = {
      xs: "px-2.5 py-1.5 text-xs min-h-[32px]",
      sm: "px-3 py-2 text-xs min-h-[36px]",
      md: "px-3 py-2.5 text-sm min-h-[42px]",
      lg: "px-4 py-3 text-base min-h-[48px]",
      xl: "px-5 py-4 text-lg min-h-[56px]",
    };

    const baseStyles =
      "w-full rounded-xl border text-charcoal placeholder:text-charcoal/40 transition focus:outline-none focus:ring-2";

    const borderColor = error
      ? "border-danger bg-danger-light/10 focus:border-danger focus:ring-danger/20"
      : "border-charcoal/10 bg-ivory focus:border-gold focus:ring-gold/20";

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
        <input
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
        />
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

Input.displayName = "Input";
