"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTourBySlug } from "@/data/tours";
import { validateTravelerFields, validateBookerFields } from "@/lib/utils/validation";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { FormErrorBanner } from "@/components/ui/FormErrorBanner";
import { StepProgress } from "@/components/booking/StepProgress";
import { LegalConsent } from "@/components/booking/LegalConsent";
import { ONLINE_PAYMENT_ENABLED } from "@/lib/config/features";

// Booker: The person making the reservation and payment
type BookerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

// Traveler: Person traveling (no email/phone needed)
type TravelerInfo = {
  id: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  passportExpiry: string;
  dateOfBirth: string;
};

type Step = 1 | 2 | 3 | 4;

// Get tour data from central data file
const getTourData = (slug: string) => {
  const tour = getTourBySlug(slug);

  if (tour) {
    return {
      title: tour.title,
      destination: tour.destination,
      duration: `${tour.durationDays} days`,
      basePrice: tour.priceFrom,
      flightIncluded: tour.flightIncluded,
      image: tour.images?.[0] || "/api/placeholder/400/300",
    };
  }

  // Fallback for tours not found
  return {
    title: "Premium Pilgrimage Tour",
    destination: "Sacred Sites",
    duration: "Multiple days",
    basePrice: 2500,
    flightIncluded: true,
    image: "/api/placeholder/400/300",
  };
};

type Props = {
  params: { slug: string };
};

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal transition hover:bg-charcoal/10"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

function WireTransferDetails({ copyText }: { copyText: string }) {
  return (
    <div className="space-y-3">
      <div className="relative rounded-xl border border-gold/30 bg-ivory/90 p-5">
        <div className="absolute right-4 top-4">
          <CopyButton text={copyText} />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal/70">
          Wire Transfer Details
        </p>
        <div className="space-y-2.5 text-sm text-charcoal">
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">Account Name</span>
            <span>TGA Tour and Travel LLC</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">Bank</span>
            <span>JPMorgan Chase Bank, N.A.</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">Routing (Wire)</span>
            <span className="font-mono">021000021</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">Account Number</span>
            <span className="font-mono">2906503801</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">SWIFT / BIC</span>
            <span className="font-mono">CHASUS33</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">Reference</span>
            <span className="italic text-charcoal/60">Your Booking Reference</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-charcoal/5 bg-ivory/60 p-4">
        <p className="text-xs leading-relaxed text-charcoal/70">
          <strong className="font-semibold text-charcoal">Important:</strong> Please send as a{" "}
          <strong className="text-charcoal">wire transfer</strong> (not ACH) and include your booking reference
          in the payment note to ensure smooth processing.
        </p>
      </div>
    </div>
  );
}

function ZelleDetails({ copyText }: { copyText: string }) {
  return (
    <div className="space-y-3">
      <div className="relative rounded-xl border border-gold/30 bg-ivory/90 p-5">
        <div className="absolute right-4 top-4">
          <CopyButton text={copyText} />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal/70">
          Zelle Transfer Details
        </p>
        <div className="space-y-2.5 text-sm text-charcoal">
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">Recipient Email</span>
            <span className="font-mono">info@tgatourandtravel.com</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">Recipient Name</span>
            <span>TGA Tour and Travel LLC</span>
          </div>
          <div className="flex gap-2">
            <span className="w-36 shrink-0 font-medium text-charcoal/70">Reference</span>
            <span className="italic text-charcoal/60">Your Booking Reference</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-charcoal/5 bg-ivory/60 p-4">
        <p className="text-xs leading-relaxed text-charcoal/70">
          <strong className="font-semibold text-charcoal">Verification:</strong> Before completing your transfer,
          confirm the recipient name displayed in Zelle matches{" "}
          <strong className="text-charcoal">TGA Tour and Travel LLC</strong>. Include your booking reference in the
          payment note. Zelle is available for U.S. bank accounts only.
        </p>
      </div>
    </div>
  );
}

export default function TourBookingPage({ params }: Props) {
  const router = useRouter();
  const tour = getTourData(params.slug);
  const fullTourData = getTourBySlug(params.slug);
  const formRef = useRef<HTMLDivElement>(null);
  const stepProgressRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>(1);

  // Booker information (person making the reservation)
  const [booker, setBooker] = useState<BookerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isBookerTraveling, setIsBookerTraveling] = useState(true);

  // Travelers information
  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(1);
  const [travelers, setTravelers] = useState<TravelerInfo[]>([
    {
      id: "traveler-1",
      firstName: "",
      lastName: "",
      passportNumber: "",
      nationality: "",
      passportExpiry: "",
      dateOfBirth: "",
    }
  ]);

  // Booker errors
  const [bookerErrors, setBookerErrors] = useState<Record<string, string>>({});

  // Error tracking state: travelerIndex -> fieldName -> errorMessage
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  // Touched fields tracking: travelerIndex -> Set of field names
  const [touchedFields, setTouchedFields] = useState<Record<number, Set<string>>>({});

  const [addons, setAddons] = useState({
    insurance: false,
    flightBooking: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<"wire" | "zelle" | "card">("wire");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top of page when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Update booker field
  const updateBooker = (field: keyof BookerInfo, value: string) => {
    setBooker(prev => ({ ...prev, [field]: value }));

    // If booker is traveling, sync name to first traveler
    if (isBookerTraveling && (field === "firstName" || field === "lastName")) {
      const updated = [...travelers];
      updated[0] = { ...updated[0], [field]: value };
      setTravelers(updated);
    }
  };

  // Handle booker traveling toggle
  const handleBookerTravelingChange = (isTraveling: boolean) => {
    setIsBookerTraveling(isTraveling);

    if (isTraveling) {
      // Sync booker name to first traveler
      const updated = [...travelers];
      updated[0] = {
        ...updated[0],
        firstName: booker.firstName,
        lastName: booker.lastName,
      };
      setTravelers(updated);
    }
  };

  // Update individual traveler data
  const updateTraveler = (index: number, field: keyof TravelerInfo, value: string) => {
    const updated = [...travelers];
    const oldValue = updated[index][field];
    
    // Check if value actually changed
    if (oldValue === value) {
      return;
    }
    
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);

    // If field was previously touched, validate on change
    if (touchedFields[index]?.has(field)) {
      validateField(index, field, value);
    }
  };

  // Validate a single field
  const validateField = (index: number, field: keyof TravelerInfo, value: string) => {
    const traveler = { ...travelers[index], [field]: value };
    const tourStartDate = fullTourData?.startDate;
    const skipNameValidation = index === 0 && isBookerTraveling;
    const fieldErrors = validateTravelerFields(traveler, tourStartDate, skipNameValidation);

    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: fieldErrors[field] || '',
      }
    }));
  };

  // Handle field blur - mark as touched and validate
  const handleFieldBlur = (index: number, field: keyof TravelerInfo) => {
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [index]: new Set([...(prev[index] || []), field])
    }));

    // Validate the field
    validateField(index, field, travelers[index][field]);
  };

  // Validation - only called when user clicks Continue button
  const validateStep = (currentStep: Step): boolean => {
    if (currentStep === 1) {
      const tourStartDate = fullTourData?.startDate;
      let hasErrors = false;

      // 1. Validate booker first
      const bookerFieldErrors = validateBookerFields(booker);
      if (Object.keys(bookerFieldErrors).length > 0) {
        hasErrors = true;
        setBookerErrors(bookerFieldErrors);
      } else {
        setBookerErrors({});
      }

      // 2. Validate all travelers
      const newErrors: Record<number, Record<string, string>> = {};
      travelers.forEach((traveler, index) => {
        // For traveler 1 when booker is traveling, skip name validation (comes from booker)
        const skipNameValidation = index === 0 && isBookerTraveling;
        const travelerToValidate = skipNameValidation
          ? { ...traveler, firstName: booker.firstName, lastName: booker.lastName }
          : traveler;

        const fieldErrors = validateTravelerFields(travelerToValidate, tourStartDate, skipNameValidation);
        if (Object.keys(fieldErrors).length > 0) {
          hasErrors = true;
          newErrors[index] = fieldErrors;
        }
      });

      // Update errors state ONLY if there are errors
      if (hasErrors) {
        setErrors(newErrors);

        // Mark all fields as touched
        setTouchedFields(prev => {
          const updated = { ...prev };
          travelers.forEach((_, index) => {
            updated[index] = new Set(['firstName', 'lastName', 'passportNumber', 'nationality', 'passportExpiry', 'dateOfBirth']);
          });
          return updated;
        });
        
        // Scroll to top so user sees errors from the beginning
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
        
        return false;
      }

      // Only clear errors if there were previously errors
      if (Object.keys(errors).length > 0) {
        setErrors({});
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(4, s + 1) as Step);
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1) as Step);
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    if (!termsAccepted) {
      setTermsError(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourSlug: params.slug,
          tourTitle: tour.title,
          tourDestination: tour.destination,
          tourStartDate: fullTourData?.startDate || null,
          tourDurationDays: fullTourData?.durationDays || null,
          // Booker information (contact for booking)
          booker: {
            firstName: booker.firstName,
            lastName: booker.lastName,
            email: booker.email,
            phone: booker.phone,
            isTraveling: isBookerTraveling,
          },
          // Travelers with passport info
          travelers: travelers.map((t, index) => ({
            // If booker is traveler 1, use booker's name
            firstName: (index === 0 && isBookerTraveling) ? booker.firstName : t.firstName,
            lastName: (index === 0 && isBookerTraveling) ? booker.lastName : t.lastName,
            passportNumber: t.passportNumber,
            nationality: t.nationality,
            passportExpiry: t.passportExpiry,
            dateOfBirth: t.dateOfBirth,
          })),
          hasInsurance: addons.insurance,
          hasFlightBooking: addons.flightBooking,
          flightIncludedInTour: tour.flightIncluded,
          basePricePerPerson: tour.basePrice,
          insuranceCostPerPerson: 99,
          flightCostPerPerson: 450,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || "Failed to create booking";
        throw new Error(errorMsg);
      }

      // Redirect to verification page
      router.push(
        `/tours/${params.slug}/book/verify?ref=${data.bookingRef}&email=${encodeURIComponent(data.email)}`
      );
    } catch (error) {
      console.error("Booking error:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const baseTotal = tour.basePrice * numberOfTravelers;
  const insuranceCost = addons.insurance ? 99 * numberOfTravelers : 0;
  const flightCost = addons.flightBooking ? 450 * numberOfTravelers : 0;
  const grandTotal = baseTotal + insuranceCost + flightCost;
  const depositAmount = Math.floor(grandTotal * 0.3);

  return (
    <main className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="border-b border-charcoal/5 bg-ivory/90">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          <Link
            href={`/tours/${params.slug}`}
            className="inline-flex items-center text-xs text-charcoal/60 transition hover:text-charcoal"
          >
            <svg className="mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to tour details
          </Link>
          <h1 className="mt-3 font-display text-2xl tracking-tight text-charcoal sm:text-3xl">
            Book Your Journey
          </h1>
          <p className="mt-2 text-sm text-charcoal/70">
            {tour.title} • {tour.destination}
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left: Form */}
          <div ref={formRef} className="space-y-6">
            {/* Progress Steps */}
            <StepProgress
              ref={stepProgressRef}
              step={step}
              steps={["Traveler Info", "Add-ons", "Payment", "Review"]}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Booker & Traveler Information */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Booker Information Card */}
                  <Card variant="elevated" padding="lg" className="space-y-4">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-charcoal">
                        Contact Information
                      </h2>
                      <p className="mt-2 text-xs text-charcoal/60">
                        Person responsible for this booking. We'll send confirmation and updates to this contact.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="First Name"
                        type="text"
                        value={booker.firstName}
                        onChange={(e) => updateBooker("firstName", e.target.value)}
                        error={bookerErrors.firstName}
                        required
                      />
                      <Input
                        label="Last Name"
                        type="text"
                        value={booker.lastName}
                        onChange={(e) => updateBooker("lastName", e.target.value)}
                        error={bookerErrors.lastName}
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Email"
                        type="email"
                        value={booker.email}
                        onChange={(e) => updateBooker("email", e.target.value)}
                        error={bookerErrors.email}
                        helperText={!bookerErrors.email ? "For booking confirmation and updates" : undefined}
                        required
                      />
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={booker.phone}
                        onChange={(e) => updateBooker("phone", e.target.value)}
                        error={bookerErrors.phone}
                        placeholder="+1 (234) 567-8900"
                        helperText={!bookerErrors.phone ? "Include country code" : undefined}
                        required
                      />
                    </div>

                    {/* Booker traveling checkbox */}
                    <div className="mt-4 rounded-xl border border-charcoal/10 bg-ivory/50 p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBookerTraveling}
                          onChange={(e) => handleBookerTravelingChange(e.target.checked)}
                          className="h-4 w-4 rounded border-charcoal/30 text-gold transition focus:ring-2 focus:ring-gold/70"
                        />
                        <div>
                          <p className="text-sm font-medium text-charcoal">
                            I am also traveling on this trip
                          </p>
                          <p className="text-xs text-charcoal/60">
                            {isBookerTraveling
                              ? "Your name will be added as Traveler 1"
                              : "You are booking for others only"}
                          </p>
                        </div>
                      </label>
                    </div>
                  </Card>

                  {/* Traveler Count & List */}
                  <Card variant="elevated" padding="lg">
                    <h2 className="font-display text-lg font-semibold text-charcoal">
                      Traveler Information
                    </h2>
                    <p className="mt-2 text-xs text-charcoal/60">
                      Passport details for all travelers
                    </p>

                    {/* Number of Travelers Selector */}
                    <div className="mt-6 rounded-xl border border-charcoal/10 bg-ivory/50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-charcoal">
                            Number of Travelers
                          </label>
                          <p className="mt-0.5 text-xs text-charcoal/60">
                            Add or remove travelers for this booking
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (numberOfTravelers > 1) {
                                const newCount = numberOfTravelers - 1;
                                setNumberOfTravelers(newCount);
                                setTravelers(travelers.slice(0, newCount));
                              }
                            }}
                            disabled={numberOfTravelers <= 1}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/15 bg-ivory text-charcoal transition hover:bg-charcoal/5 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-12 text-center text-lg font-semibold text-charcoal">
                            {numberOfTravelers}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (numberOfTravelers < 10) {
                                const newCount = numberOfTravelers + 1;
                                setNumberOfTravelers(newCount);
                                setTravelers([
                                  ...travelers,
                                  {
                                    id: `traveler-${newCount}`,
                                    firstName: "",
                                    lastName: "",
                                    passportNumber: "",
                                    nationality: "",
                                    passportExpiry: "",
                                    dateOfBirth: "",
                                  }
                                ]);
                              }
                            }}
                            disabled={numberOfTravelers >= 10}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-charcoal transition hover:bg-gold-dark disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {numberOfTravelers >= 10 && (
                        <p className="mt-2 text-xs text-charcoal/60">
                          Maximum 10 travelers per booking. For larger groups, please <a href="/contact" className="text-gold-dark underline">contact us</a>.
                        </p>
                      )}
                    </div>
                  </Card>

                  {/* Traveler Forms */}
                  {travelers.map((traveler, index) => {
                    const isFirstTravelerAndBooker = index === 0 && isBookerTraveling;

                    return (
                      <Card
                        key={traveler.id}
                        variant="elevated"
                        padding="lg"
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-charcoal/70">
                            Traveler {index + 1}
                          </h3>
                          {isFirstTravelerAndBooker && (
                            <span className="rounded-full bg-gold/20 px-3 py-1 text-[10px] font-semibold text-gold-dark">
                              Booker
                            </span>
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            label="First Name"
                            type="text"
                            value={isFirstTravelerAndBooker ? booker.firstName : traveler.firstName}
                            onChange={(e) => {
                              if (isFirstTravelerAndBooker) {
                                updateBooker("firstName", e.target.value);
                              } else {
                                updateTraveler(index, "firstName", e.target.value);
                              }
                            }}
                            onBlur={() => handleFieldBlur(index, "firstName")}
                            error={errors[index]?.firstName}
                            disabled={isFirstTravelerAndBooker}
                            required
                          />
                          <Input
                            label="Last Name"
                            type="text"
                            value={isFirstTravelerAndBooker ? booker.lastName : traveler.lastName}
                            onChange={(e) => {
                              if (isFirstTravelerAndBooker) {
                                updateBooker("lastName", e.target.value);
                              } else {
                                updateTraveler(index, "lastName", e.target.value);
                              }
                            }}
                            onBlur={() => handleFieldBlur(index, "lastName")}
                            error={errors[index]?.lastName}
                            disabled={isFirstTravelerAndBooker}
                            required
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <Input
                            label="Passport Number"
                            type="text"
                            value={traveler.passportNumber}
                            onChange={(e) => updateTraveler(index, "passportNumber", e.target.value)}
                            onBlur={() => handleFieldBlur(index, "passportNumber")}
                            error={errors[index]?.passportNumber}
                            required
                          />
                          <Input
                            label="Nationality"
                            type="text"
                            value={traveler.nationality}
                            onChange={(e) => updateTraveler(index, "nationality", e.target.value)}
                            onBlur={() => handleFieldBlur(index, "nationality")}
                            error={errors[index]?.nationality}
                            required
                          />
                          <Input
                            label="Date of Birth"
                            type="date"
                            value={traveler.dateOfBirth}
                            onChange={(e) => updateTraveler(index, "dateOfBirth", e.target.value)}
                            onBlur={() => handleFieldBlur(index, "dateOfBirth")}
                            error={errors[index]?.dateOfBirth}
                            required
                          />
                        </div>

                        <Input
                          label="Passport Expiry Date"
                          type="date"
                          value={traveler.passportExpiry}
                          onChange={(e) => updateTraveler(index, "passportExpiry", e.target.value)}
                          onBlur={() => handleFieldBlur(index, "passportExpiry")}
                          error={errors[index]?.passportExpiry}
                          helperText={!errors[index]?.passportExpiry ? "Must be valid for at least 6 months from travel date" : undefined}
                          required
                        />
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Step 2: Add-ons */}
              {step === 2 && (
                <Card variant="elevated" padding="lg" className="space-y-6">
                  <h2 className="font-display text-lg font-semibold text-charcoal">
                    Enhance Your Journey
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 rounded-xl border border-charcoal/7 bg-ivory/90 p-4 transition hover:border-charcoal/15 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addons.insurance}
                        onChange={(e) => setAddons({ ...addons, insurance: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-charcoal/30 text-charcoal transition focus:ring-2 focus:ring-gold/70"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-charcoal">
                          Travel Insurance
                        </p>
                        <p className="text-xs text-charcoal/60">
                          Comprehensive coverage for peace of mind • $99 per traveler
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-charcoal">$99</span>
                    </label>

                    <label className={`flex items-start gap-3 rounded-xl border p-4 transition ${
                      tour.flightIncluded
                        ? "border-charcoal/7 bg-ivory/50 opacity-60 cursor-not-allowed"
                        : "border-charcoal/7 bg-ivory/90 hover:border-charcoal/15 cursor-pointer"
                    }`}>
                      <input
                        type="checkbox"
                        checked={tour.flightIncluded || addons.flightBooking}
                        disabled={tour.flightIncluded}
                        onChange={(e) => !tour.flightIncluded && setAddons({ ...addons, flightBooking: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-charcoal/30 text-charcoal transition focus:ring-2 focus:ring-gold/70 disabled:opacity-60"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-charcoal">
                          Flight Booking {tour.flightIncluded && "(Included)"}
                        </p>
                        <p className="text-xs text-charcoal/60">
                          {tour.flightIncluded
                            ? "Round-trip flights are included in this package"
                            : "Let us arrange your round-trip flights • $450 per traveler"
                          }
                        </p>
                      </div>
                      {!tour.flightIncluded && (
                        <span className="text-sm font-semibold text-charcoal">$450</span>
                      )}
                    </label>
                  </div>
                </Card>
              )}

              {/* Step 4: Review & Confirmation */}
              {step === 4 && (
                <div className="space-y-6">
                  <Card variant="elevated" padding="lg">
                    <h2 className="font-display text-lg font-semibold text-charcoal">
                      Review Your Booking
                    </h2>
                    <p className="mt-2 text-xs text-charcoal/60">
                      Please review all details carefully before confirming your booking
                    </p>
                  </Card>

                  {/* Tour Details */}
                  <Card variant="elevated" padding="md">
                    <h3 className="border-b border-charcoal/5 pb-3 text-sm font-semibold text-charcoal">
                      Tour Details
                    </h3>
                    <div className="mt-4 space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Tour Package</span>
                        <span className="font-medium text-charcoal">{tour.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Destination</span>
                        <span className="text-charcoal">{tour.destination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Duration</span>
                        <span className="text-charcoal">{tour.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Number of Travelers</span>
                        <span className="font-medium text-charcoal">{numberOfTravelers} {numberOfTravelers === 1 ? "person" : "people"}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Contact Information (Booker) */}
                  <Card variant="elevated" padding="md">
                    <div className="flex items-center justify-between border-b border-charcoal/5 pb-3">
                      <h3 className="text-sm font-semibold text-charcoal">
                        Contact Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-charcoal/70 transition hover:bg-charcoal/5"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <div className="mt-4 rounded-xl bg-ivory/50 p-4 border border-charcoal/5">
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
                          Booking Contact
                        </p>
                        {isBookerTraveling && (
                          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-semibold text-gold-dark">
                            Also Traveling
                          </span>
                        )}
                      </div>
                      <div className="grid gap-3 text-xs sm:grid-cols-2">
                        <div>
                          <p className="text-charcoal/60">Full Name</p>
                          <p className="mt-0.5 font-medium text-charcoal">{booker.firstName} {booker.lastName}</p>
                        </div>
                        <div>
                          <p className="text-charcoal/60">Email</p>
                          <p className="mt-0.5 text-charcoal">{booker.email}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-charcoal/60">Phone Number</p>
                          <p className="mt-0.5 text-charcoal">{booker.phone}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Traveler Information */}
                  <Card variant="elevated" padding="md">
                    <div className="flex items-center justify-between border-b border-charcoal/5 pb-3">
                      <h3 className="text-sm font-semibold text-charcoal">
                        Traveler Details
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-charcoal/70 transition hover:bg-charcoal/5"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <div className="mt-4 space-y-4">
                      {travelers.map((traveler, index) => {
                        const isFirstAndBooker = index === 0 && isBookerTraveling;
                        const displayFirstName = isFirstAndBooker ? booker.firstName : traveler.firstName;
                        const displayLastName = isFirstAndBooker ? booker.lastName : traveler.lastName;

                        return (
                          <div key={traveler.id} className="rounded-xl bg-ivory/50 p-4 border border-charcoal/5">
                            <div className="flex items-center gap-2 mb-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/70">
                                Traveler {index + 1}
                              </p>
                              {isFirstAndBooker && (
                                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-semibold text-gold-dark">
                                  Booker
                                </span>
                              )}
                            </div>
                            <div className="grid gap-3 text-xs sm:grid-cols-2">
                              <div>
                                <p className="text-charcoal/60">Full Name</p>
                                <p className="mt-0.5 font-medium text-charcoal">{displayFirstName} {displayLastName}</p>
                              </div>
                              <div>
                                <p className="text-charcoal/60">Date of Birth</p>
                                <p className="mt-0.5 text-charcoal">
                                  {traveler.dateOfBirth ? new Date(traveler.dateOfBirth).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }) : "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-charcoal/60">Passport Number</p>
                                <p className="mt-0.5 font-mono text-charcoal">{traveler.passportNumber}</p>
                              </div>
                              <div>
                                <p className="text-charcoal/60">Nationality</p>
                                <p className="mt-0.5 text-charcoal">{traveler.nationality}</p>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="text-charcoal/60">Passport Expiry</p>
                                <p className="mt-0.5 text-charcoal">
                                  {traveler.passportExpiry ? new Date(traveler.passportExpiry).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }) : "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Add-ons & Extras */}
                  <Card variant="elevated" padding="md">
                    <div className="flex items-center justify-between border-b border-charcoal/5 pb-3">
                      <h3 className="text-sm font-semibold text-charcoal">
                        Add-ons & Extras
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-charcoal/70 transition hover:bg-charcoal/5"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <div className="mt-4 space-y-2.5 text-sm">
                      {addons.insurance ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20">
                              <svg className="h-3 w-3 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-charcoal">Travel Insurance</span>
                          </div>
                          <span className="font-medium text-charcoal">${insuranceCost}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-charcoal/60">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-xs">No travel insurance selected</span>
                        </div>
                      )}

                      {tour.flightIncluded ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20">
                              <svg className="h-3 w-3 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-charcoal">Flight Booking (Included)</span>
                          </div>
                          <span className="text-xs text-charcoal/60">Included in package</span>
                        </div>
                      ) : addons.flightBooking ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20">
                              <svg className="h-3 w-3 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-charcoal">Flight Booking</span>
                          </div>
                          <span className="font-medium text-charcoal">${flightCost}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-charcoal/60">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-xs">Flight booking not selected</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Payment Method */}
                  <Card variant="elevated" padding="md">
                    <div className="flex items-center justify-between border-b border-charcoal/5 pb-3">
                      <h3 className="text-sm font-semibold text-charcoal">
                        Payment Method
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-charcoal/70 transition hover:bg-charcoal/5"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                        <svg className="h-5 w-5 text-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {paymentMethod === "card" ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {paymentMethod === "card"
                            ? "Online Card Payment"
                            : paymentMethod === "zelle"
                            ? "Zelle Transfer"
                            : "Bank Wire Transfer"}
                        </p>
                        <p className="text-xs text-charcoal/60">
                          {paymentMethod === "card"
                            ? "Secure online payment via Stripe"
                            : paymentMethod === "zelle"
                            ? "Zelle to info@tgatourandtravel.com (US only)"
                            : "Wire transfer to JPMorgan Chase"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Price Summary */}
                  <Card variant="bordered" padding="md" className="border-gold/30 bg-gradient-to-br from-gold/5 to-gold-soft/10">
                    <h3 className="mb-4 text-sm font-semibold text-charcoal">
                      Price Summary
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Tour Package × {numberOfTravelers}</span>
                        <span className="text-charcoal">${baseTotal.toLocaleString()}</span>
                      </div>
                      {addons.insurance && (
                        <div className="flex justify-between">
                          <span className="text-charcoal/70">Travel Insurance</span>
                          <span className="text-charcoal">${insuranceCost.toLocaleString()}</span>
                        </div>
                      )}
                      {addons.flightBooking && !tour.flightIncluded && (
                        <div className="flex justify-between">
                          <span className="text-charcoal/70">Flight Booking</span>
                          <span className="text-charcoal">${flightCost.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-charcoal/10 pt-2.5">
                        <div className="flex justify-between">
                          <span className="font-semibold text-charcoal">Total Amount</span>
                          <span className="text-lg font-bold text-charcoal">${grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-xs">
                          <span className="text-charcoal/70">Deposit Due Now (30%)</span>
                          <span className="font-semibold text-gold-dark">${depositAmount.toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-xs text-charcoal/60">
                          Remaining balance of ${(grandTotal - depositAmount).toLocaleString()} due 45 days before departure
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Legal Consent — must be the last element before submit */}
                  <LegalConsent
                    accepted={termsAccepted}
                    error={termsError}
                    onChange={(checked) => {
                      setTermsAccepted(checked);
                      if (checked) setTermsError(false);
                    }}
                  />
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <Card variant="elevated" padding="lg" className="space-y-6">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-charcoal">
                      Payment Method
                    </h2>
                    <p className="mt-1 text-xs text-charcoal/60">
                      Select how you would like to pay your deposit
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Wire Transfer */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("wire")}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 transition ${
                        paymentMethod === "wire"
                          ? "border-gold bg-gold/5"
                          : "border-charcoal/7 bg-ivory/90 hover:border-charcoal/15"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "wire"}
                        readOnly
                        className="mt-0.5"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-charcoal">Bank Wire Transfer</p>
                        <p className="text-xs text-charcoal/60">
                          Secure wire transfer via JPMorgan Chase Bank — US &amp; International
                        </p>
                      </div>
                    </button>

                    {/* Zelle */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("zelle")}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 transition ${
                        paymentMethod === "zelle"
                          ? "border-gold bg-gold/5"
                          : "border-charcoal/7 bg-ivory/90 hover:border-charcoal/15"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "zelle"}
                        readOnly
                        className="mt-0.5"
                      />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-charcoal">Zelle</p>
                          <span className="rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px] font-medium text-charcoal/60">
                            US Only
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/60">
                          Instant bank-to-bank transfer for U.S. accounts
                        </p>
                      </div>
                    </button>

                    {/* Online Card Payment (Stripe) */}
                    {ONLINE_PAYMENT_ENABLED && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex w-full items-start gap-3 rounded-xl border p-4 transition ${
                          paymentMethod === "card"
                            ? "border-gold bg-gold/5"
                            : "border-charcoal/7 bg-ivory/90 hover:border-charcoal/15"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={paymentMethod === "card"}
                          readOnly
                          className="mt-0.5"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-charcoal">Online Card Payment</p>
                          <p className="text-xs text-charcoal/60">
                            Credit or debit card via Stripe — available after booking verification
                          </p>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Wire Transfer Details */}
                  {paymentMethod === "wire" && (
                    <WireTransferDetails copyText={`Account Name: TGA Tour and Travel LLC\nBank: JPMorgan Chase Bank, N.A.\nRouting Number (Wire): 021000021\nAccount Number: 2906503801\nSWIFT/BIC: CHASUS33\nReference: Your Booking Reference`} />
                  )}

                  {/* Zelle Details */}
                  {paymentMethod === "zelle" && (
                    <ZelleDetails copyText={`Zelle Recipient: info@tgatourandtravel.com\nRecipient Name: TGA Tour and Travel LLC\nReference: Your Booking Reference`} />
                  )}

                  {/* Online Card Payment Info */}
                  {paymentMethod === "card" && (
                    <div className="rounded-xl border border-charcoal/10 bg-ivory/80 p-5">
                      <div className="flex items-start gap-3">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-charcoal/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-charcoal">Secure Online Payment via Stripe</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-charcoal/70">
                            Card payment is processed securely by Stripe. Your card details are never stored on our servers.
                            The payment link will be activated on your booking confirmation page after OTP verification.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Terms */}
                  <div className="rounded-xl bg-gold/10 p-4 space-y-2">
                    <p className="text-xs font-semibold text-charcoal">Payment Terms</p>
                    <p className="text-xs leading-relaxed text-charcoal/75">
                      A deposit of <strong className="text-charcoal">${depositAmount.toLocaleString()}</strong> (30% of total) is required to secure your booking.
                      Please complete the deposit within <strong className="text-charcoal">7 days</strong> of your booking request.
                      The remaining balance of <strong className="text-charcoal">${(grandTotal - depositAmount).toLocaleString()}</strong> is due no later than{" "}
                      <strong className="text-charcoal">45 days</strong> prior to your travel date.
                    </p>
                    <p className="text-xs text-charcoal/60">
                      Please review our{" "}
                      <a href="/refund-policy" target="_blank" className="font-medium underline hover:text-charcoal">
                        Refund Policy
                      </a>{" "}
                      before completing your payment.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-ivory/80 p-4">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-charcoal/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-xs text-charcoal/70">
                      Your payment information is handled securely and never stored on our servers
                    </p>
                  </div>
                </Card>
              )}

              {/* Error Display */}
              <FormErrorBanner message={submitError || null} />

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="text-sm font-medium text-charcoal/70 transition hover:text-charcoal disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Back
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-charcoal px-8 py-3 text-sm font-medium text-ivory shadow-soft transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-charcoal shadow-soft transition hover:bg-gold-dark disabled:cursor-wait disabled:opacity-70"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Order Summary (Sticky) */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-5 rounded-2xl border border-charcoal/5 bg-ivory p-6 shadow-soft">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
                <h2 className="font-display text-lg font-semibold text-charcoal">
                  Order Summary
                </h2>
                <span className="rounded-full bg-charcoal/5 px-2.5 py-1 text-xs font-medium text-charcoal/70">
                  {numberOfTravelers} {numberOfTravelers === 1 ? "traveler" : "travelers"}
                </span>
              </div>

              {/* Tour Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-charcoal">
                  {tour.title}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Destination</span>
                    <span className="font-medium text-charcoal/80">{tour.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Duration</span>
                    <span className="font-medium text-charcoal/80">{tour.duration}</span>
                  </div>
                  {fullTourData?.startDate && (
                    <div className="flex justify-between">
                      <span className="text-charcoal/60">Travel Date</span>
                      <span className="font-medium text-charcoal/80">
                        {new Date(fullTourData.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-charcoal/10 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/70">
                    Base Price × {numberOfTravelers}
                  </span>
                  <span className="font-medium text-charcoal">
                    ${baseTotal.toLocaleString()}
                  </span>
                </div>

                {addons.insurance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Travel Insurance</span>
                    <span className="font-medium text-charcoal">
                      ${insuranceCost}
                    </span>
                  </div>
                )}

                {addons.flightBooking && !tour.flightIncluded && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Flight Booking</span>
                    <span className="font-medium text-charcoal">
                      ${flightCost}
                    </span>
                  </div>
                )}

                {tour.flightIncluded && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Flight</span>
                    <span className="text-xs font-medium text-gold-dark">Included</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="space-y-3 border-t border-charcoal/10 pt-4">
                <div className="flex justify-between">
                  <span className="font-display text-base font-semibold text-charcoal">
                    Total
                  </span>
                  <span className="font-display text-lg font-bold text-charcoal">
                    ${grandTotal.toLocaleString()}
                  </span>
                </div>

                {/* Deposit Info */}
                <div className="rounded-lg bg-gold/10 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-charcoal/80">Deposit Due Now (30%)</span>
                    <span className="font-semibold text-charcoal">${depositAmount.toLocaleString()}</span>
                  </div>
                  <p className="mt-1.5 text-[10px] text-charcoal/60">
                    Remaining balance due 45 days before departure
                  </p>
                </div>
              </div>
            </div>

            {/* Help section */}
            <div className="mt-4 rounded-xl bg-ivory/90 p-4 text-center">
              <p className="text-xs text-charcoal/70">
                Need assistance?
              </p>
              <Link
                href="/contact"
                className="mt-2 inline-flex items-center text-xs font-medium text-charcoal transition hover:text-gold"
              >
                Contact our team →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
