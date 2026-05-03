import React from "react";
import { ButtonVariant, ButtonSize, BaseComponentProps } from "@/design-system/types";

export interface ButtonProps
  extends BaseComponentProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-charcoal text-ivory shadow-soft hover:bg-charcoal/90 focus:ring-charcoal/20",
  secondary:
    "bg-gold text-charcoal shadow-sm hover:bg-gold-dark focus:ring-gold/20",
  outline:
    "border-2 border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal/40 hover:bg-charcoal/5 focus:ring-charcoal/20",
  ghost:
    "bg-transparent text-charcoal hover:bg-charcoal/5 focus:ring-charcoal/20",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-2.5 text-sm min-h-[44px]",
  lg: "px-8 py-3 text-base min-h-[44px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ivory disabled:opacity-50 disabled:cursor-not-allowed";
    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
