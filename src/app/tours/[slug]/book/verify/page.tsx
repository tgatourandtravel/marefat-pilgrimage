"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export default function VerifyBookingPage({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get("ref") || "";
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP input
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only last digit
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    // Focus the last filled input or the next empty one
    const lastIndex = Math.min(pastedData.length, 3);
    inputRefs.current[lastIndex]?.focus();
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Verify code
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length !== 4) {
      setError("Please enter the complete 4-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch("/api/bookings/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingRef,
          email,
          code: fullCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed");
        setCode(["", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      // Success - redirect to success page
      router.push(`/tours/${params.slug}/book/success?ref=${bookingRef}&verified=true`);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend code
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError("");

    try {
      const response = await fetch("/api/bookings/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingRef, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.waitSeconds) {
          setResendCooldown(data.waitSeconds);
        }
        setError(data.error || "Failed to resend code");
        return;
      }

      setResendCooldown(60);
      setCode(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  // Mask email for display
  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (local.length <= 2) return email;
    return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
  };

  return (
    <main className="min-h-screen bg-ivory">
      <section className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-2xl border border-charcoal/5 bg-ivory p-8 shadow-soft">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <svg className="h-8 w-8 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="font-display text-2xl font-semibold text-charcoal">
              Verify Your Booking
            </h1>
            <p className="mt-3 text-sm text-charcoal/70">
              We&apos;ve sent a 4-digit code to<br />
              <span className="font-medium text-charcoal">{maskEmail(email)}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-8">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-14 w-14 rounded-xl border-2 border-charcoal/10 bg-ivory text-center text-2xl font-bold text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <p className="mt-4 text-center text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isVerifying || code.some(d => !d)}
              className="mt-6 w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify Booking"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-charcoal/60">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="mt-2 text-sm font-medium text-charcoal transition hover:text-gold disabled:opacity-50"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : isResending
                ? "Sending..."
                : "Resend Code"}
            </button>
          </div>

          <div className="mt-8 border-t border-charcoal/5 pt-6 text-center">
            <p className="text-xs text-charcoal/60">
              Booking Reference: <span className="font-mono font-medium">{bookingRef}</span>
            </p>
            <Link
              href={`/tours/${params.slug}`}
              className="mt-3 inline-block text-xs text-charcoal/60 transition hover:text-charcoal"
            >
              Cancel and return to tour
            </Link>
          </div>
        </div>

        {/* Help section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-charcoal/60">
            Having trouble? Contact us at{" "}
            <a href="mailto:info@marefatpilgrimage.com" className="text-charcoal underline">
              info@marefatpilgrimage.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
