"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState, Suspense } from "react";
import { Input } from "@/components/ui/Input";
import { focusFirstInvalidField } from "@/lib/focusFirstInvalidField";

type Step = 1 | 2 | 3 | 4 | 5;

function BookingContent() {
  const params = useSearchParams();
  const preselectedTour = params.get("tour") ?? "";

  const [step, setStep] = useState<Step>(1);
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [selectedDate, setSelectedDate] = useState("");

  const [traveler, setTraveler] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passportNumber: "",
    nationality: "",
    passportExpiry: "",
  });

  const [addons, setAddons] = useState({
    insurance: false,
    extraNights: false,
    privateTransfer: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validateStep = (currentStep: Step) => {
    const nextErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!selectedDate) {
        nextErrors.selectedDate = "Please choose a preferred start date.";
      }
      setFieldErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }
    if (currentStep === 2) {
      if (!traveler.firstName.trim()) nextErrors.firstName = "First name is required.";
      if (!traveler.lastName.trim()) nextErrors.lastName = "Last name is required.";
      if (!traveler.email.trim()) nextErrors.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.email.trim())) {
        nextErrors.email = "Please enter a valid email address.";
      }
      if (!traveler.phone.trim()) nextErrors.phone = "Phone number is required.";
      if (!traveler.passportNumber.trim())
        nextErrors.passportNumber = "Passport number is required.";
      if (!traveler.nationality.trim()) nextErrors.nationality = "Nationality is required.";
      if (!traveler.passportExpiry) nextErrors.passportExpiry = "Passport expiry is required.";
      setFieldErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }
    setFieldErrors({});
    return true;
  };

  const validateStepOrFocus = () => {
    const ok = validateStep(step);
    if (!ok) focusFirstInvalidField(formRef.current);
    return ok;
  };

  const handleNext = () => {
    if (!validateStepOrFocus()) return;
    setFieldErrors({});
    setStep((s) => (Math.min(5, s + 1) as Step));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStepOrFocus()) return;
    setIsSubmitting(true);

    // Placeholder: here you would call an API route / server action
    // to save the booking and create a Stripe payment intent or
    // provide bank transfer instructions.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsComplete(true);
    setStep(5);
  };

  return (
    <main className="bg-ivory">
      <section className="border-b border-charcoal/5 bg-ivory/90">
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Online booking
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-charcoal sm:text-3xl">
            Reserve your pilgrimage
          </h1>
          <p className="mt-2 text-sm text-charcoal/70">
            A calm, guided form to collect your details. No payment is charged
            until a Marefat advisor confirms availability and shares the next
            steps with you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        {/* Steps indicator */}
        <ol className="mb-8 flex flex-wrap items-center gap-4 text-xs text-charcoal/70">
          {[
            "Package & date",
            "Traveler info",
            "Add‑ons",
            "Payment",
            "Confirmation",
          ].map((label, index) => {
            const current = (index + 1) as Step;
            const isActive = step === current;
            const isDone = step > current;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                    isDone
                      ? "bg-charcoal text-ivory"
                      : isActive
                      ? "bg-gold text-charcoal"
                      : "bg-charcoal/7 text-charcoal/60"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={
                    isActive || isDone ? "font-medium text-charcoal" : ""
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-charcoal/5 bg-ivory p-5 shadow-sm shadow-charcoal/5"
          noValidate
        >
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-charcoal">
                1. Select package &amp; preferred date
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: "economy", label: "Economy", note: "Smart 4★ hotels" },
                  {
                    id: "standard",
                    label: "Standard",
                    note: "Our usual recommendation",
                  },
                  { id: "vip", label: "VIP", note: "Suites & private options" },
                ].map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`flex flex-col rounded-xl border px-3 py-3 text-left text-xs transition ${
                      selectedPackage === pkg.id
                        ? "border-charcoal bg-ivory"
                        : "border-charcoal/10 bg-ivory/80 hover:border-charcoal/30"
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                      {pkg.label}
                    </span>
                    <span className="mt-1 text-charcoal/70">{pkg.note}</span>
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Input
                    label="Preferred start date"
                    id="booking-selected-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (fieldErrors.selectedDate) {
                        setFieldErrors((prev) => {
                          const { selectedDate: _, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    error={fieldErrors.selectedDate}
                    size="sm"
                    className="text-xs"
                    required
                  />
                  <p className="mt-1 text-[11px] text-charcoal/60">
                    Your advisor will confirm exact flight and hotel dates.
                  </p>
                </div>
                <div>
                  <Input
                    label="Selected tour (optional)"
                    type="text"
                    defaultValue={preselectedTour}
                    readOnly={!!preselectedTour}
                    placeholder="If you know the exact tour name, add it here"
                    size="sm"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-charcoal">
                2. Traveler information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First name"
                  id="booking-first-name"
                  type="text"
                  value={traveler.firstName}
                  onChange={(e) => {
                    setTraveler({ ...traveler, firstName: e.target.value });
                    if (fieldErrors.firstName)
                      setFieldErrors(({ firstName: _, ...r }) => r);
                  }}
                  error={fieldErrors.firstName}
                  size="sm"
                  className="text-xs"
                  required
                />
                <Input
                  label="Last name"
                  id="booking-last-name"
                  type="text"
                  value={traveler.lastName}
                  onChange={(e) => {
                    setTraveler({ ...traveler, lastName: e.target.value });
                    if (fieldErrors.lastName)
                      setFieldErrors(({ lastName: _, ...r }) => r);
                  }}
                  error={fieldErrors.lastName}
                  size="sm"
                  className="text-xs"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Email"
                  id="booking-email"
                  type="email"
                  value={traveler.email}
                  onChange={(e) => {
                    setTraveler({ ...traveler, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors(({ email: _, ...r }) => r);
                  }}
                  error={fieldErrors.email}
                  size="sm"
                  className="text-xs"
                  required
                />
                <Input
                  label="Phone (with country code)"
                  id="booking-phone"
                  type="tel"
                  value={traveler.phone}
                  onChange={(e) => {
                    setTraveler({ ...traveler, phone: e.target.value });
                    if (fieldErrors.phone) setFieldErrors(({ phone: _, ...r }) => r);
                  }}
                  error={fieldErrors.phone}
                  size="sm"
                  className="text-xs"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Passport number"
                  id="booking-passport"
                  type="text"
                  value={traveler.passportNumber}
                  onChange={(e) => {
                    setTraveler({ ...traveler, passportNumber: e.target.value });
                    if (fieldErrors.passportNumber)
                      setFieldErrors(({ passportNumber: _, ...r }) => r);
                  }}
                  error={fieldErrors.passportNumber}
                  size="sm"
                  className="text-xs"
                  required
                />
                <Input
                  label="Nationality"
                  id="booking-nationality"
                  type="text"
                  value={traveler.nationality}
                  onChange={(e) => {
                    setTraveler({ ...traveler, nationality: e.target.value });
                    if (fieldErrors.nationality)
                      setFieldErrors(({ nationality: _, ...r }) => r);
                  }}
                  error={fieldErrors.nationality}
                  size="sm"
                  className="text-xs"
                  required
                />
                <Input
                  label="Passport expiry"
                  id="booking-passport-expiry"
                  type="date"
                  value={traveler.passportExpiry}
                  onChange={(e) => {
                    setTraveler({ ...traveler, passportExpiry: e.target.value });
                    if (fieldErrors.passportExpiry)
                      setFieldErrors(({ passportExpiry: _, ...r }) => r);
                  }}
                  error={fieldErrors.passportExpiry}
                  size="sm"
                  className="text-xs"
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-charcoal">
                3. Add‑ons &amp; preferences
              </h2>
              <div className="space-y-3 text-sm text-charcoal/80">
                <label className="flex items-start gap-2 rounded-xl border border-charcoal/7 bg-ivory/90 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={addons.insurance}
                    onChange={(e) =>
                      setAddons({ ...addons, insurance: e.target.checked })
                    }
                    className="mt-[3px] h-3.5 w-3.5 rounded border-charcoal/30 text-charcoal focus:ring-gold/70"
                  />
                  <span>
                    Travel insurance assistance{" "}
                    <span className="text-xs text-charcoal/60">
                      (recommended)
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-2 rounded-xl border border-charcoal/7 bg-ivory/90 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={addons.extraNights}
                    onChange={(e) =>
                      setAddons({ ...addons, extraNights: e.target.checked })
                    }
                    className="mt-[3px] h-3.5 w-3.5 rounded border-charcoal/30 text-charcoal focus:ring-gold/70"
                  />
                  <span>Extra nights before or after the core program</span>
                </label>
                <label className="flex items-start gap-2 rounded-xl border border-charcoal/7 bg-ivory/90 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={addons.privateTransfer}
                    onChange={(e) =>
                      setAddons({
                        ...addons,
                        privateTransfer: e.target.checked,
                      })
                    }
                    className="mt-[3px] h-3.5 w-3.5 rounded border-charcoal/30 text-charcoal focus:ring-gold/70"
                  />
                  <span>Private airport transfers</span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-charcoal">
                4. Payment preference
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col rounded-xl border px-3 py-3 text-left text-xs transition ${
                    paymentMethod === "card"
                      ? "border-charcoal bg-ivory"
                      : "border-charcoal/10 bg-ivory/80 hover:border-charcoal/30"
                  }`}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                    Online card payment
                  </span>
                  <span className="mt-1 text-charcoal/70">
                    Stripe‑ready integration – secure payment link sent after
                    confirmation.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex flex-col rounded-xl border px-3 py-3 text-left text-xs transition ${
                    paymentMethod === "bank"
                      ? "border-charcoal bg-ivory"
                      : "border-charcoal/10 bg-ivory/80 hover:border-charcoal/30"
                  }`}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/70">
                    Bank transfer
                  </span>
                  <span className="mt-1 text-charcoal/70">
                    You will receive invoice and account details for a
                    traditional bank transfer.
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-charcoal/60">
                A full booking summary will be emailed to you before any
                transaction is processed.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-charcoal">
                5. Confirmation
              </h2>
              {isComplete ? (
                <>
                  <p className="text-sm text-charcoal/75">
                    Thank you. Your request has been received. A confirmation
                    email and next steps will be shared shortly by a Marefat
                    advisor.
                  </p>
                  <p className="text-xs text-charcoal/60">
                    For urgent questions, you may contact us via WhatsApp or
                    phone using the details in the footer.
                  </p>
                </>
              ) : (
                <p className="text-sm text-charcoal/75">
                  When you click &ldquo;Submit booking request&rdquo;, your
                  details will be securely sent to our team and a summary will
                  be emailed to you.
                </p>
              )}
            </div>
          )}

          {/* Live summary */}
          <div className="rounded-2xl border border-charcoal/5 bg-ivory/90 p-4 text-xs text-charcoal/75">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-charcoal">Summary</p>
              <span className="rounded-full bg-charcoal/8 px-3 py-1 text-[11px] text-charcoal/70">
                Draft
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <p>
                Package: <strong className="font-medium">{selectedPackage}</strong>
              </p>
              <p>
                Preferred date:{" "}
                <strong className="font-medium">
                  {selectedDate || "Not set"}
                </strong>
              </p>
              <p>
                Payment: <strong className="font-medium">{paymentMethod}</strong>
              </p>
              <p>
                Add‑ons:{" "}
                <strong className="font-medium">
                  {Object.entries(addons)
                    .filter(([, v]) => v)
                    .map(([k]) => k.replace(/([A-Z])/g, " $1").toLowerCase())
                    .join(", ") || "None"}
                </strong>
              </p>
              <p>
                Traveler:{" "}
                <strong className="font-medium">
                  {traveler.firstName && traveler.lastName
                    ? `${traveler.firstName} ${traveler.lastName}`
                    : "Not set"}
                </strong>
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => (Math.max(1, s - 1) as Step))}
              className="text-xs font-medium text-charcoal/70 disabled:opacity-40"
            >
              Back
            </button>

            {step < 4 && (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-full bg-charcoal px-5 py-2 text-xs font-medium text-ivory shadow-soft transition hover:bg-charcoal/90"
              >
                Next step
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-charcoal px-5 py-2 text-xs font-medium text-ivory shadow-soft transition hover:bg-charcoal/90 disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? "Submitting…" : "Submit booking request"}
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-ivory">
          <section className="border-b border-charcoal/5 bg-ivory/90">
            <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Online booking
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-charcoal sm:text-3xl">
                Reserve your pilgrimage
              </h1>
            </div>
          </section>
          <section className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:px-8 lg:px-12">
            <div className="rounded-2xl border border-charcoal/5 bg-ivory/90 p-8 text-center">
              <p className="text-sm text-charcoal/70">Loading booking form...</p>
            </div>
          </section>
        </main>
      }
    >
      <BookingContent />
    </Suspense>
  );
}


