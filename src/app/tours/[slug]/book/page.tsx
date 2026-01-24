"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTourBySlug } from "@/data/tours";

type TravelerInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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

export default function TourBookingPage({ params }: Props) {
  const router = useRouter();
  const tour = getTourData(params.slug);
  const formRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(1);
  const [travelers, setTravelers] = useState<TravelerInfo[]>([
    {
      id: "traveler-1",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      passportNumber: "",
      nationality: "",
      passportExpiry: "",
      dateOfBirth: "",
    }
  ]);

  const [addons, setAddons] = useState({
    insurance: false,
    flightBooking: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<"bank">("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top when step changes
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  // Initialize travelers array when number changes
  const handleTravelerCountChange = (count: number) => {
    setNumberOfTravelers(count);
    const newTravelers: TravelerInfo[] = [];
    for (let i = 0; i < count; i++) {
      newTravelers.push({
        id: `traveler-${i + 1}`,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passportNumber: "",
        nationality: "",
        passportExpiry: "",
        dateOfBirth: "",
      });
    }
    setTravelers(newTravelers);
  };

  // Update individual traveler data
  const updateTraveler = (index: number, field: keyof TravelerInfo, value: string) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);
  };

  // Validation
  const validateStep = (currentStep: Step): boolean => {
    if (currentStep === 1) {
      return travelers.every(t =>
        t.firstName &&
        t.lastName &&
        t.email &&
        t.phone &&
        t.passportNumber &&
        t.nationality &&
        t.passportExpiry &&
        t.dateOfBirth
      );
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Generate booking reference
    const bookingRef = `MAR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    // Redirect to success page with booking reference
    router.push(`/tours/${params.slug}/book/success?ref=${bookingRef}`);
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
            <div className="flex items-center justify-between rounded-2xl border border-charcoal/5 bg-ivory/90 p-6">
              {["Traveler Info", "Add-ons", "Payment", "Review"].map((label, idx) => {
                const stepNum = (idx + 1) as Step;
                const isActive = step === stepNum;
                const isDone = step > stepNum;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition ${
                        isDone
                          ? "bg-charcoal text-ivory"
                          : isActive
                          ? "bg-gold text-charcoal"
                          : "bg-charcoal/5 text-charcoal/40"
                      }`}
                    >
                      {isDone ? "✓" : stepNum}
                    </div>
                    <span
                      className={`hidden text-xs sm:inline ${
                        isActive || isDone ? "font-medium text-charcoal" : "text-charcoal/50"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Traveler Information (Dynamic) */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-charcoal/5 bg-ivory p-6 shadow-sm">
                    <h2 className="font-display text-lg font-semibold text-charcoal">
                      Traveler Information
                    </h2>
                    <p className="mt-2 text-xs text-charcoal/60">
                      Please provide details for all travelers
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
                                    email: "",
                                    phone: "",
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
                  </div>

                  {/* Traveler Forms */}
                  {travelers.map((traveler, index) => (
                    <div
                      key={traveler.id}
                      className="space-y-4 rounded-2xl border border-charcoal/5 bg-ivory p-6 shadow-sm"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-charcoal/70">
                        Traveler {index + 1}
                      </h3>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-charcoal">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={traveler.firstName}
                            onChange={(e) => updateTraveler(index, "firstName", e.target.value)}
                            required
                            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-charcoal">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={traveler.lastName}
                            onChange={(e) => updateTraveler(index, "lastName", e.target.value)}
                            required
                            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-charcoal">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={traveler.email}
                            onChange={(e) => updateTraveler(index, "email", e.target.value)}
                            required
                            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-charcoal">
                            Phone (with country code) *
                          </label>
                          <input
                            type="tel"
                            value={traveler.phone}
                            onChange={(e) => updateTraveler(index, "phone", e.target.value)}
                            required
                            placeholder="+49 123 456 789"
                            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-charcoal">
                            Passport Number *
                          </label>
                          <input
                            type="text"
                            value={traveler.passportNumber}
                            onChange={(e) => updateTraveler(index, "passportNumber", e.target.value)}
                            required
                            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-charcoal">
                            Nationality *
                          </label>
                          <input
                            type="text"
                            value={traveler.nationality}
                            onChange={(e) => updateTraveler(index, "nationality", e.target.value)}
                            required
                            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-charcoal">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            value={traveler.dateOfBirth}
                            onChange={(e) => updateTraveler(index, "dateOfBirth", e.target.value)}
                            required
                            className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-charcoal">
                          Passport Expiry Date *
                        </label>
                        <input
                          type="date"
                          value={traveler.passportExpiry}
                          onChange={(e) => updateTraveler(index, "passportExpiry", e.target.value)}
                          required
                          className="w-full rounded-xl border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                        />
                        <p className="mt-1.5 text-xs text-charcoal/60">
                          Must be valid for at least 6 months from travel date
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Add-ons */}
              {step === 2 && (
                <div className="space-y-6 rounded-2xl border border-charcoal/5 bg-ivory p-6 shadow-sm">
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
                          Comprehensive coverage for peace of mind • €99 per traveler
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-charcoal">€99</span>
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
                            : "Let us arrange your round-trip flights • €450 per traveler"
                          }
                        </p>
                      </div>
                      {!tour.flightIncluded && (
                        <span className="text-sm font-semibold text-charcoal">€450</span>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Confirmation */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-charcoal/5 bg-ivory p-6 shadow-sm">
                    <h2 className="font-display text-lg font-semibold text-charcoal">
                      Review Your Booking
                    </h2>
                    <p className="mt-2 text-xs text-charcoal/60">
                      Please review all details carefully before confirming your booking
                    </p>
                  </div>

                  {/* Tour Details */}
                  <div className="rounded-2xl border border-charcoal/5 bg-ivory p-5 shadow-sm">
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
                  </div>

                  {/* Traveler Information */}
                  <div className="rounded-2xl border border-charcoal/5 bg-ivory p-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-charcoal/5 pb-3">
                      <h3 className="text-sm font-semibold text-charcoal">
                        Traveler Information
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
                      {travelers.map((traveler, index) => (
                        <div key={traveler.id} className="rounded-xl bg-ivory/50 p-4 border border-charcoal/5">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal/70">
                            Traveler {index + 1}
                          </p>
                          <div className="grid gap-3 text-xs sm:grid-cols-2">
                            <div>
                              <p className="text-charcoal/60">Full Name</p>
                              <p className="mt-0.5 font-medium text-charcoal">{traveler.firstName} {traveler.lastName}</p>
                            </div>
                            <div>
                              <p className="text-charcoal/60">Date of Birth</p>
                              <p className="mt-0.5 text-charcoal">
                                {new Date(traveler.dateOfBirth).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
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
                            <div>
                              <p className="text-charcoal/60">Passport Expiry</p>
                              <p className="mt-0.5 text-charcoal">
                                {new Date(traveler.passportExpiry).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-charcoal/60">Email</p>
                              <p className="mt-0.5 text-charcoal">{traveler.email}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-charcoal/60">Phone Number</p>
                              <p className="mt-0.5 text-charcoal">{traveler.phone}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons & Extras */}
                  <div className="rounded-2xl border border-charcoal/5 bg-ivory p-5 shadow-sm">
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
                          <span className="font-medium text-charcoal">€{insuranceCost}</span>
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
                          <span className="font-medium text-charcoal">€{flightCost}</span>
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
                  </div>

                  {/* Payment Method */}
                  <div className="rounded-2xl border border-charcoal/5 bg-ivory p-5 shadow-sm">
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">Bank Transfer</p>
                        <p className="text-xs text-charcoal/60">Direct transfer to business account</p>
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-gold-soft/10 p-5 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-charcoal">
                      Price Summary
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal/70">Tour Package × {numberOfTravelers}</span>
                        <span className="text-charcoal">€{baseTotal.toLocaleString()}</span>
                      </div>
                      {addons.insurance && (
                        <div className="flex justify-between">
                          <span className="text-charcoal/70">Travel Insurance</span>
                          <span className="text-charcoal">€{insuranceCost.toLocaleString()}</span>
                        </div>
                      )}
                      {addons.flightBooking && !tour.flightIncluded && (
                        <div className="flex justify-between">
                          <span className="text-charcoal/70">Flight Booking</span>
                          <span className="text-charcoal">€{flightCost.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-charcoal/10 pt-2.5">
                        <div className="flex justify-between">
                          <span className="font-semibold text-charcoal">Total Amount</span>
                          <span className="text-lg font-bold text-charcoal">€{grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 flex justify-between text-xs">
                          <span className="text-charcoal/70">Deposit Due Now (30%)</span>
                          <span className="font-semibold text-gold-dark">€{depositAmount.toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-xs text-charcoal/60">
                          Remaining balance of €{(grandTotal - depositAmount).toLocaleString()} due 30 days before departure
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms Acceptance */}
                  <div className="rounded-2xl border border-charcoal/5 bg-ivory p-5 shadow-sm">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        className="mt-0.5 h-4 w-4 rounded border-charcoal/30 text-charcoal transition focus:ring-2 focus:ring-gold/70"
                      />
                      <p className="text-xs leading-relaxed text-charcoal/70">
                        I confirm that all the information provided above is accurate and complete. I have reviewed all details and agree to the{" "}
                        <a href="/terms" target="_blank" className="font-medium text-charcoal underline hover:text-gold">
                          Terms & Conditions
                        </a>
                        {" "}and{" "}
                        <a href="/privacy" target="_blank" className="font-medium text-charcoal underline hover:text-gold">
                          Privacy Policy
                        </a>
                        {" "}of Marefat Pilgrimage.
                      </p>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <div className="space-y-6 rounded-2xl border border-charcoal/5 bg-ivory p-6 shadow-sm">
                  <h2 className="font-display text-lg font-semibold text-charcoal">
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    <button
                      type="button"
                      disabled
                      className="flex w-full items-start gap-3 rounded-xl border border-charcoal/7 bg-charcoal/3 p-4 opacity-40 cursor-not-allowed"
                    >
                      <input
                        type="radio"
                        disabled
                        className="mt-0.5"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-charcoal">
                          Online Payment
                        </p>
                        <p className="text-xs text-charcoal/60">
                          Credit/Debit card or PayPal • Coming soon
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bank")}
                      className={`flex w-full items-start gap-3 rounded-xl border p-4 transition ${
                        paymentMethod === "bank"
                          ? "border-gold bg-gold/5"
                          : "border-charcoal/7 bg-ivory/90 hover:border-charcoal/15"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "bank"}
                        readOnly
                        className="mt-0.5"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-charcoal">
                          Bank Transfer
                        </p>
                        <p className="text-xs text-charcoal/60">
                          Direct transfer to our business account
                        </p>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === "bank" && (
                    <div className="relative rounded-xl border border-gold/30 bg-ivory/90 p-5">
                      <button
                        type="button"
                        onClick={() => {
                          const bankDetails = `Bank: Deutsche Bank\nIBAN: DE89 3704 0044 0532 0130 00\nBIC: COBADEFFXXX\nReference: Your booking ID`;
                          navigator.clipboard.writeText(bankDetails);
                        }}
                        className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal transition hover:bg-charcoal/10"
                        title="Copy bank details"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal/70">
                        Bank Details
                      </p>
                      <div className="space-y-2 text-sm text-charcoal">
                        <div className="flex">
                          <span className="w-24 font-medium">Bank:</span>
                          <span>Deutsche Bank</span>
                        </div>
                        <div className="flex">
                          <span className="w-24 font-medium">IBAN:</span>
                          <span className="font-mono">DE89 3704 0044 0532 0130 00</span>
                        </div>
                        <div className="flex">
                          <span className="w-24 font-medium">BIC:</span>
                          <span className="font-mono">COBADEFFXXX</span>
                        </div>
                        <div className="flex">
                          <span className="w-24 font-medium">Reference:</span>
                          <span>Your booking ID</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl bg-gold/10 p-4">
                    <p className="text-xs leading-relaxed text-charcoal/75">
                      <strong className="font-semibold text-charcoal">Payment Terms:</strong> A 30% deposit
                      (€{depositAmount.toLocaleString()}) is due now to confirm your booking. The remaining balance
                      is due 30 days before departure. Full payment details and invoice will be sent to your email.
                    </p>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-ivory/80 p-4">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-charcoal/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-xs text-charcoal/70">
                      Your payment information is secure and encrypted
                    </p>
                  </div>
                </div>
              )}

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
                    disabled={!validateStep(step)}
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
            <div className="space-y-6 rounded-2xl border border-charcoal/5 bg-ivory p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold text-charcoal">
                Order Summary
              </h2>

              {/* Tour image */}
              <div className="h-40 w-full overflow-hidden rounded-xl bg-gradient-to-tr from-charcoal/80 via-charcoal/40 to-gold-soft/70" />

              <div>
                <h3 className="text-sm font-semibold text-charcoal">
                  {tour.title}
                </h3>
                <p className="mt-1 text-xs text-charcoal/60">
                  {tour.destination} • {tour.duration}
                </p>
                <p className="mt-1 text-xs text-charcoal/60">
                  {numberOfTravelers} {numberOfTravelers === 1 ? "Traveler" : "Travelers"}
                </p>
              </div>

              <div className="space-y-3 border-t border-charcoal/5 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/70">
                    Base Price × {numberOfTravelers} {numberOfTravelers === 1 ? "traveler" : "travelers"}
                  </span>
                  <span className="font-medium text-charcoal">
                    €{baseTotal.toLocaleString()}
                  </span>
                </div>

                {addons.insurance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Travel Insurance</span>
                    <span className="font-medium text-charcoal">
                      €{insuranceCost}
                    </span>
                  </div>
                )}

                {(tour.flightIncluded || addons.flightBooking) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">
                      Flight Booking {tour.flightIncluded && "(Included)"}
                    </span>
                    <span className="font-medium text-charcoal">
                      {tour.flightIncluded ? "—" : `€${flightCost}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t border-charcoal/5 pt-4">
                <div className="flex justify-between">
                  <span className="font-display text-base font-semibold text-charcoal">
                    Total
                  </span>
                  <span className="font-display text-lg font-bold text-charcoal">
                    €{grandTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-charcoal/60">
                  30% deposit (€{depositAmount.toLocaleString()}) due now
                </p>
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
