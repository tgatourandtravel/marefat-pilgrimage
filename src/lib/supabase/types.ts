export type BookingStatus =
  | 'pending_verification'
  | 'verified'
  | 'awaiting_card_payment'
  | 'deposit_paid'
  | 'fully_paid'
  | 'confirmed'
  | 'cancelled'
  | 'expired';

export type PaymentMethod = 'wire' | 'zelle' | 'card';
export type PaymentStatus = 'unpaid' | 'requires_action' | 'paid' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  booking_ref: string;
  tour_slug: string;
  tour_title: string;
  tour_destination: string | null;
  tour_start_date: string | null;
  tour_duration_days: number | null;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  base_price_per_person: number;
  number_of_travelers: number;
  insurance_total: number;
  flight_total: number;
  grand_total: number;
  deposit_amount: number;
  has_insurance: boolean;
  has_flight_booking: boolean;
  preferred_departure_city: string | null;
  preferred_return_city: string | null;
  stripe_payment_intent_id: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_paid_at: string | null;
  status: BookingStatus;
  is_verified: boolean;
  verified_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Traveler {
  id: string;
  booking_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  passport_number: string;
  passport_expiry: string;
  traveler_order: number;
  is_primary_contact: boolean;
  created_at: string;
}

export interface VerificationCode {
  id: string;
  booking_id: string;
  code: string;
  code_type: 'email' | 'sms' | 'whatsapp';
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  attempts: number;
  max_attempts: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Booking, 'id' | 'created_at'>>;
      };
      travelers: {
        Row: Traveler;
        Insert: Omit<Traveler, 'id' | 'created_at'>;
        Update: Partial<Omit<Traveler, 'id' | 'created_at'>>;
      };
      verification_codes: {
        Row: VerificationCode;
        Insert: Omit<VerificationCode, 'id' | 'created_at'>;
        Update: Partial<Omit<VerificationCode, 'id' | 'created_at'>>;
      };
    };
  };
}
