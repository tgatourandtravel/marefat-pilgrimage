"use client";

import React from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { BaseComponentProps, SizeVariant } from "@/design-system/types";

export interface PhoneInputProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  value: string;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: string;
  size?: SizeVariant;
  id?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      error,
      helperText,
      value,
      onChange,
      onBlur,
      required = false,
      disabled = false,
      placeholder = "+1 234 567 8900",
      defaultCountry = "US",
      size = "md",
      className = "",
      id,
    },
    ref
  ) => {
    const inputId = id || `phone-input-${Math.random().toString(36).substr(2, 9)}`;

    // Size styles matching Input component
    const sizeStyles: Record<SizeVariant, string> = {
      xs: "px-2.5 py-1.5 text-xs min-h-[32px]",
      sm: "px-3 py-2 text-xs min-h-[36px]",
      md: "px-3 py-2.5 text-sm min-h-[42px]",
      lg: "px-4 py-3 text-base min-h-[48px]",
      xl: "px-5 py-4 text-lg min-h-[56px]",
    };

    // استایل‌های سفارشی بر اساس design system ما
    const containerClasses = `
      phone-input-wrapper
      w-full
      ${className}
    `;

    const inputClasses = `
      w-full
      rounded-xl
      border
      ${sizeStyles[size]}
      text-charcoal
      transition
      focus:outline-none
      focus:ring-2
      ${
        error
          ? "border-danger bg-danger-light/10 focus:border-danger focus:ring-danger/20"
          : "border-charcoal/10 bg-ivory focus:border-gold focus:ring-gold/20"
      }
      ${disabled ? "opacity-60 cursor-not-allowed" : ""}
    `;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-medium text-charcoal"
          >
            {label}
            {required && <span className="ml-1 text-danger">*</span>}
          </label>
        )}
        
        <div className={containerClasses}>
          <PhoneInputWithCountry
            id={inputId}
            international
            countryCallingCodeEditable={false}
            defaultCountry={defaultCountry as any}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            className={inputClasses}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error || helperText
                ? `${inputId}-${error ? "error" : "helper"}`
                : undefined
            }
          />
        </div>

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
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-charcoal/60">
            {helperText}
          </p>
        )}

        <style jsx global>{`
          /* استایل‌های سفارشی برای PhoneInput */
          .phone-input-wrapper .PhoneInput {
            display: flex;
            align-items: center;
          }

          .phone-input-wrapper .PhoneInputCountry {
            position: relative;
            align-self: stretch;
            display: flex;
            align-items: center;
            margin-right: 0.5rem;
          }

          .phone-input-wrapper .PhoneInputCountryIcon {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 0.25rem;
            overflow: hidden;
            box-shadow: 0 1px 2px 0 rgba(15, 15, 15, 0.05);
          }

          .phone-input-wrapper .PhoneInputCountryIcon--border {
            background-color: rgba(0, 0, 0, 0.1);
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
          }

          .phone-input-wrapper .PhoneInputCountryIconImg {
            display: block;
            width: 100%;
            height: 100%;
          }

          .phone-input-wrapper .PhoneInputCountrySelect {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1;
            border: 0;
            opacity: 0;
            cursor: pointer;
          }

          .phone-input-wrapper .PhoneInputCountrySelect:focus + .PhoneInputCountryIcon {
            outline: 2px solid #c7a56a;
            outline-offset: 2px;
          }

          .phone-input-wrapper .PhoneInputCountrySelectArrow {
            display: block;
            content: "";
            width: 0.3rem;
            height: 0.3rem;
            margin-left: 0.35rem;
            border-style: solid;
            border-color: #555555;
            border-top-width: 0;
            border-bottom-width: 1px;
            border-left-width: 0;
            border-right-width: 1px;
            transform: rotate(45deg);
            opacity: 0.7;
          }

          .phone-input-wrapper .PhoneInputInput {
            flex: 1;
            min-width: 0;
            border: none;
            background: transparent;
            outline: none;
            padding: 0;
            font-size: 0.875rem;
            line-height: 1.5;
            color: #151515 !important;
            -webkit-text-fill-color: #151515 !important;
          }

          .phone-input-wrapper .PhoneInputInput::placeholder {
            color: rgba(21, 21, 21, 0.4);
            -webkit-text-fill-color: rgba(21, 21, 21, 0.4);
          }

          .phone-input-wrapper .PhoneInputInput:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }

          /* Dark mode support (optional) */
          @media (prefers-color-scheme: dark) {
            .phone-input-wrapper .PhoneInputInput {
              color: #f7f3eb !important;
              -webkit-text-fill-color: #f7f3eb !important;
            }
          }
        `}</style>
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
