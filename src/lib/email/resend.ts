import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendOTPEmailParams {
  to: string;
  firstName: string;
  bookingRef: string;
  otpCode: string;
}

export async function sendOTPEmail({
  to,
  firstName,
  bookingRef,
  otpCode,
}: SendOTPEmailParams) {
  return resend.emails.send({
    from: 'Marefat Pilgrimage <noreply@marefatpilgrimage.com>',
    to,
    subject: `Your verification code: ${otpCode} - Booking ${bookingRef}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #151515; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 600; color: #151515; }
          .otp-box {
            background: #f7f3eb;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #151515;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Marefat Pilgrimage</div>
          </div>

          <p>Salam ${firstName},</p>

          <p>Thank you for your booking with Marefat Pilgrimage. Please use the verification code below to confirm your booking.</p>

          <div class="otp-box">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your verification code:</p>
            <div class="otp-code">${otpCode}</div>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #666;">Valid for 10 minutes</p>
          </div>

          <p><strong>Booking Reference:</strong> ${bookingRef}</p>

          <p>If you did not request this code, please ignore this email.</p>

          <div class="footer">
            <p>Marefat Pilgrimage<br>
            Premium Umrah, Hajj & Ziyarat Tours<br>
            info@marefatpilgrimage.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

interface SendConfirmationEmailParams {
  to: string;
  firstName: string;
  bookingRef: string;
  tourTitle: string;
  depositAmount: number;
  grandTotal: number;
  expiresAt: Date;
  paymentMethod?: string;
}

export async function sendBookingConfirmationEmail({
  to,
  firstName,
  bookingRef,
  tourTitle,
  depositAmount,
  grandTotal,
  expiresAt,
  paymentMethod,
}: SendConfirmationEmailParams) {
  const formattedExpiry = expiresAt.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const remainingBalance = grandTotal - depositAmount;

  const isZelle = paymentMethod === 'zelle';
  const isCard = paymentMethod === 'card';

  const wireDetailsHtml = `
    <div style="background:#fff; border:1px solid #e5dcc8; border-radius:10px; padding:20px; margin:20px 0;">
      <h4 style="margin:0 0 14px 0; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#555;">
        Wire Transfer Details
      </h4>
      <table style="width:100%; border-collapse:collapse; font-size:14px; color:#151515;">
        <tr><td style="padding:5px 0; width:160px; color:#777; font-weight:500;">Account Name</td><td style="padding:5px 0;">TGA Tour and Travel LLC</td></tr>
        <tr><td style="padding:5px 0; color:#777; font-weight:500;">Bank</td><td style="padding:5px 0;">JPMorgan Chase Bank, N.A.</td></tr>
        <tr><td style="padding:5px 0; color:#777; font-weight:500;">Routing (Wire)</td><td style="padding:5px 0; font-family:monospace;">021000021</td></tr>
        <tr><td style="padding:5px 0; color:#777; font-weight:500;">Account Number</td><td style="padding:5px 0; font-family:monospace;">2906503801</td></tr>
        <tr><td style="padding:5px 0; color:#777; font-weight:500;">SWIFT / BIC</td><td style="padding:5px 0; font-family:monospace;">CHASUS33</td></tr>
        <tr><td style="padding:5px 0; color:#777; font-weight:500;">Reference</td><td style="padding:5px 0; font-family:monospace; font-weight:700;">${bookingRef}</td></tr>
      </table>
      <div style="margin-top:14px; background:#f7f3eb; border-radius:8px; padding:12px; font-size:12px; color:#555; line-height:1.5;">
        <strong style="color:#151515;">Important:</strong> Please send as a wire transfer (not ACH) and include your booking reference in the payment note to ensure smooth processing.
      </div>
    </div>
  `;

  const zelleDetailsHtml = `
    <div style="background:#fff; border:1px solid #e5dcc8; border-radius:10px; padding:20px; margin:20px 0;">
      <h4 style="margin:0 0 14px 0; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#555;">
        Zelle Transfer Details
      </h4>
      <table style="width:100%; border-collapse:collapse; font-size:14px; color:#151515;">
        <tr><td style="padding:5px 0; width:160px; color:#777; font-weight:500;">Recipient Email</td><td style="padding:5px 0; font-family:monospace;">info@tgatourandtravel.com</td></tr>
        <tr><td style="padding:5px 0; color:#777; font-weight:500;">Recipient Name</td><td style="padding:5px 0;">TGA Tour and Travel LLC</td></tr>
        <tr><td style="padding:5px 0; color:#777; font-weight:500;">Reference</td><td style="padding:5px 0; font-family:monospace; font-weight:700;">${bookingRef}</td></tr>
      </table>
      <div style="margin-top:14px; background:#f7f3eb; border-radius:8px; padding:12px; font-size:12px; color:#555; line-height:1.5;">
        <strong style="color:#151515;">Verification:</strong> Before completing your transfer, confirm the recipient name displayed in Zelle matches <strong style="color:#151515;">TGA Tour and Travel LLC</strong>. Include your booking reference in the payment note. Zelle is available for U.S. bank accounts only.
      </div>
    </div>
  `;

  const cardPaymentHtml = `
    <div style="background:#fff; border:1px solid #e5dcc8; border-radius:10px; padding:20px; margin:20px 0;">
      <h4 style="margin:0 0 10px 0; font-size:13px; font-weight:600; color:#151515;">Online Card Payment (Stripe)</h4>
      <p style="margin:0; font-size:13px; color:#555; line-height:1.6;">
        You selected online card payment. A secure payment link is available on your booking confirmation page.
        Log in with your booking reference and complete the deposit there. Card data is handled by Stripe and
        never stored on our servers.
      </p>
    </div>
  `;

  const paymentDetailsHtml = isCard
    ? cardPaymentHtml
    : isZelle
    ? zelleDetailsHtml
    : wireDetailsHtml;

  return resend.emails.send({
    from: 'Marefat Pilgrimage <noreply@marefatpilgrimage.com>',
    to,
    subject: `Booking Confirmed — ${bookingRef} | Marefat Pilgrimage`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="font-family:system-ui,-apple-system,sans-serif; line-height:1.6; color:#151515; margin:0; padding:0; background:#f5f5f5;">
        <div style="max-width:600px; margin:0 auto; padding:40px 20px;">

          <!-- Header -->
          <div style="text-align:center; margin-bottom:30px;">
            <div style="display:inline-flex; align-items:center; justify-content:center; width:56px; height:56px; background:linear-gradient(135deg,#d4a85440,#e5c97840); border-radius:50%; margin-bottom:12px;">
              <span style="font-size:28px; color:#a07830;">&#10003;</span>
            </div>
            <h1 style="margin:0; font-size:26px; font-weight:700; color:#151515;">Booking Confirmed!</h1>
            <p style="margin:8px 0 0; font-size:14px; color:#666;">Your sacred journey awaits</p>
          </div>

          <!-- Main Card -->
          <div style="background:#ffffff; border-radius:16px; padding:32px; box-shadow:0 1px 4px rgba(0,0,0,0.08);">

            <p style="margin:0 0 20px; font-size:15px;">Salam <strong>${firstName}</strong>,</p>
            <p style="margin:0 0 24px; font-size:14px; color:#444; line-height:1.7;">
              Your booking has been verified and your reservation is now secured. Please complete your deposit payment using the details below.
            </p>

            <!-- Booking Reference -->
            <div style="background:#f7f3eb; border-radius:12px; padding:20px 24px; margin:0 0 24px;">
              <p style="margin:0 0 6px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:#777;">Booking Reference</p>
              <p style="margin:0 0 16px; font-size:26px; font-weight:800; letter-spacing:0.04em; color:#151515;">${bookingRef}</p>
              <p style="margin:0 0 4px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:#777;">Tour Package</p>
              <p style="margin:0; font-size:15px; font-weight:600; color:#151515;">${tourTitle}</p>
            </div>

            <!-- Payment Summary -->
            <h3 style="margin:0 0 12px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#555;">Payment Summary</h3>
            <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:8px;">
              <tr>
                <td style="padding:6px 0; color:#666;">Deposit Due Now (30%)</td>
                <td style="padding:6px 0; text-align:right; font-weight:700; font-size:16px; color:#151515;">USD $${depositAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#666;">Remaining Balance</td>
                <td style="padding:6px 0; text-align:right; color:#151515;">USD $${remainingBalance.toLocaleString()}</td>
              </tr>
              <tr style="border-top:1px solid #eee;">
                <td style="padding:10px 0 6px; font-weight:600; color:#151515;">Total Amount</td>
                <td style="padding:10px 0 6px; text-align:right; font-weight:700; color:#151515;">USD $${grandTotal.toLocaleString()}</td>
              </tr>
            </table>
            <p style="margin:0 0 24px; font-size:12px; color:#888;">
              Remaining balance due no later than 45 days prior to your travel date.
            </p>

            <!-- Payment Terms Notice -->
            <div style="background:#fef9ee; border:1px solid #e5dcc8; border-radius:10px; padding:16px; margin-bottom:24px; font-size:13px; color:#555; line-height:1.6;">
              <strong style="color:#151515;">Reservation deadline:</strong> Please complete the deposit payment by
              <strong style="color:#151515;">${formattedExpiry}</strong> to secure your booking.
              Bookings without a deposit by this date may be released.
            </div>

            <!-- Payment Details -->
            <h3 style="margin:0 0 4px; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:#555;">Payment Details</h3>
            ${paymentDetailsHtml}

            <p style="margin:24px 0 0; font-size:14px; color:#444; line-height:1.7;">
              Once we receive your deposit, we will send you detailed travel documents and next steps.
            </p>

          </div>

          <!-- Footer -->
          <div style="margin-top:32px; text-align:center; font-size:12px; color:#999;">
            <p style="margin:0 0 6px;">Questions? Contact us at
              <a href="mailto:info@marefatpilgrimage.com" style="color:#a07830; text-decoration:none;">info@marefatpilgrimage.com</a>
              or WhatsApp <a href="https://wa.me/19543308904" style="color:#a07830; text-decoration:none;">+1 (954) 330-8904</a>
            </p>
            <p style="margin:0;">Marefat Pilgrimage — Premium Umrah, Hajj &amp; Ziyarat Tours</p>
          </div>

        </div>
      </body>
      </html>
    `,
  });
}

interface SendPaymentSuccessAdminEmailParams {
  bookingRef: string;
  customerEmail: string;
  amount: number;
  currency: string;
  tourTitle: string;
}

export async function sendPaymentSuccessAdminEmail({
  bookingRef,
  customerEmail,
  amount,
  currency,
  tourTitle,
}: SendPaymentSuccessAdminEmailParams) {
  const adminEmail = process.env.PAYMENT_ADMIN_EMAIL || "info@marefatpilgrimage.com";

  return resend.emails.send({
    from: "Marefat Pilgrimage <noreply@marefatpilgrimage.com>",
    to: adminEmail,
    subject: `Payment received: ${bookingRef}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: system-ui, sans-serif; color: #151515;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="margin: 0 0 16px;">Deposit payment received</h2>
          <p><strong>Booking reference:</strong> ${bookingRef}</p>
          <p><strong>Tour:</strong> ${tourTitle}</p>
          <p><strong>Customer email:</strong> ${customerEmail}</p>
          <p><strong>Amount:</strong> ${currency} ${amount.toLocaleString()}</p>
          <p style="margin-top: 20px;">Please review this booking in your dashboard and continue operations.</p>
        </div>
      </body>
      </html>
    `,
  });
}

interface SendNewBookingAdminEmailParams {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tourTitle: string;
  paymentMethod: string;
  depositAmount: number;
  grandTotal: number;
  numberOfTravelers: number;
  hasFlightBooking: boolean;
  preferredDepartureCity?: string | null;
  preferredReturnCity?: string | null;
}

export async function sendNewBookingAdminEmail({
  bookingRef,
  customerName,
  customerEmail,
  customerPhone,
  tourTitle,
  paymentMethod,
  depositAmount,
  grandTotal,
  numberOfTravelers,
  hasFlightBooking,
  preferredDepartureCity,
  preferredReturnCity,
}: SendNewBookingAdminEmailParams) {
  const adminEmail = process.env.PAYMENT_ADMIN_EMAIL || 'info@marefatpilgrimage.com';

  const flightHtml = hasFlightBooking ? `
    <tr>
      <td style="padding:8px 0; color:#777; font-weight:500; width:160px;">Flight Request</td>
      <td style="padding:8px 0; color:#c7a56a; font-weight:600;">
        ✈ ${preferredDepartureCity || '—'} → ${preferredReturnCity || '—'}
      </td>
    </tr>
  ` : '';

  return resend.emails.send({
    from: 'Marefat Pilgrimage <noreply@marefatpilgrimage.com>',
    to: adminEmail,
    subject: `New ${paymentMethod.toUpperCase()} booking — ${bookingRef} | Action needed`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family:system-ui,sans-serif; color:#151515; margin:0; padding:0; background:#f5f5f5;">
        <div style="max-width:600px; margin:0 auto; padding:40px 20px;">

          <div style="background:#fff; border-radius:16px; padding:32px; box-shadow:0 1px 4px rgba(0,0,0,0.08);">

            <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
              <div style="background:#fef9ee; border:1px solid #e5dcc8; border-radius:8px; padding:8px 14px; font-size:12px; font-weight:700; color:#a07830; text-transform:uppercase; letter-spacing:0.08em;">
                Action Needed
              </div>
            </div>

            <h2 style="margin:0 0 6px; font-size:22px; font-weight:700; color:#151515;">
              New ${paymentMethod.toUpperCase()} Booking
            </h2>
            <p style="margin:0 0 24px; font-size:14px; color:#666;">
              A new booking has been verified and is awaiting payment confirmation.
            </p>

            <div style="background:#f7f3eb; border-radius:12px; padding:20px 24px; margin-bottom:24px;">
              <p style="margin:0 0 4px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:#777;">Booking Reference</p>
              <p style="margin:0; font-size:24px; font-weight:800; letter-spacing:0.04em; color:#151515;">${bookingRef}</p>
            </div>

            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="padding:8px 0; color:#777; font-weight:500; width:160px; border-bottom:1px solid #f0f0f0;">Customer</td>
                <td style="padding:8px 0; font-weight:600; color:#151515; border-bottom:1px solid #f0f0f0;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#777; font-weight:500; border-bottom:1px solid #f0f0f0;">Email</td>
                <td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">
                  <a href="mailto:${customerEmail}" style="color:#a07830; text-decoration:none;">${customerEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#777; font-weight:500; border-bottom:1px solid #f0f0f0;">Phone</td>
                <td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#777; font-weight:500; border-bottom:1px solid #f0f0f0;">Tour</td>
                <td style="padding:8px 0; font-weight:600; border-bottom:1px solid #f0f0f0;">${tourTitle}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#777; font-weight:500; border-bottom:1px solid #f0f0f0;">Travelers</td>
                <td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${numberOfTravelers} person${numberOfTravelers > 1 ? 's' : ''}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#777; font-weight:500; border-bottom:1px solid #f0f0f0;">Payment Method</td>
                <td style="padding:8px 0; font-weight:700; text-transform:uppercase; border-bottom:1px solid #f0f0f0;">${paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#777; font-weight:500; border-bottom:1px solid #f0f0f0;">Deposit Due</td>
                <td style="padding:8px 0; font-size:18px; font-weight:800; color:#151515; border-bottom:1px solid #f0f0f0;">$${depositAmount.toLocaleString('en-US')}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#777; font-weight:500; border-bottom:1px solid #f0f0f0;">Grand Total</td>
                <td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">$${grandTotal.toLocaleString('en-US')}</td>
              </tr>
              ${flightHtml}
            </table>

            <div style="margin-top:24px; padding:16px; background:#fef9ee; border:1px solid #e5dcc8; border-radius:10px; font-size:13px; color:#555; line-height:1.6;">
              Once you receive the ${paymentMethod} transfer, mark this booking as paid in the
              <a href="https://marefatpilgrimage.com/admin/bookings" style="color:#a07830; font-weight:600; text-decoration:none;">Admin Dashboard</a>.
            </div>

          </div>

          <div style="margin-top:24px; text-align:center; font-size:12px; color:#999;">
            Marefat Pilgrimage — Internal Notification
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

interface HotelDetails {
  name: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  meal: string;
  address?: string;
}

interface SendBookingConfirmedEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  bookingRef: string;
  tourTitle: string;
  grandTotal: number;
  depositAmount: number;
  paymentMethod: string;
  balanceDueDate: string;
  travelers: string[];
  hotelMedina: HotelDetails;
  hotelMecca: HotelDetails;
  notes?: string;
  pdfAttachment?: Buffer;
}

export async function sendBookingConfirmedEmail({
  to, firstName, lastName, phone, email, bookingRef, tourTitle,
  grandTotal, depositAmount, paymentMethod, balanceDueDate,
  travelers, hotelMedina, hotelMecca, notes, pdfAttachment,
}: SendBookingConfirmedEmailParams) {
  const balanceDue = grandTotal - depositAmount;
  const methodLabel = paymentMethod === 'zelle' ? 'Zelle' : paymentMethod === 'wire' ? 'Bank Transfer' : 'Credit Card';
  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }); } catch { return d; } };
  const travelersHtml = travelers.map((name, i) => { if (i % 2 !== 0) return ''; const right = travelers[i + 1]; return `<tr><td style="padding:5px 0;width:50%">${i+1}. ${name}</td><td style="padding:5px 0">${right ? `${i+2}. ${right}` : ''}</td></tr>`; }).filter(Boolean).join('');
  const hotelBlock = (city: string, h: HotelDetails) => `<div style="margin-bottom:20px"><p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#c7a56a">${city}</p><table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5dcc8"><tr style="border-bottom:1px solid #e5dcc8"><td style="padding:9px 12px;color:#666;width:160px;background:#fdfbf7">Name of Hotel</td><td style="padding:9px 12px;font-weight:600">${h.name}</td><td style="padding:9px 12px;color:#666;width:140px;background:#fdfbf7">Check-in</td><td style="padding:9px 12px">${formatDate(h.checkIn)}</td></tr><tr style="border-bottom:1px solid #e5dcc8"><td style="padding:9px 12px;color:#666;background:#fdfbf7">Address</td><td style="padding:9px 12px">${h.address||'—'}</td><td style="padding:9px 12px;color:#666;background:#fdfbf7">Check-out</td><td style="padding:9px 12px">${formatDate(h.checkOut)}</td></tr><tr><td style="padding:9px 12px;color:#666;background:#fdfbf7">Meal</td><td style="padding:9px 12px">${h.meal||'—'}</td><td style="padding:9px 12px;color:#666;background:#fdfbf7">Room Type</td><td style="padding:9px 12px">${h.roomType||'—'}</td></tr></table></div>`;

  return resend.emails.send({
    from: 'Marefat Pilgrimage <noreply@marefatpilgrimage.com>',
    to,
    subject: `Registration Confirmation — ${bookingRef} | Marefat Pilgrimage`,
    attachments: pdfAttachment ? [{ filename: `Marefat-Confirmation-${bookingRef}.pdf`, content: pdfAttachment }] : undefined,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head><body style="font-family:system-ui,sans-serif;color:#151515;margin:0;padding:0;background:#f5f5f5"><div style="max-width:650px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border-radius:12px 12px 0 0;padding:28px 32px;border-bottom:3px solid #c7a56a"><p style="margin:0 0 2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#888">Marefat Pilgrimage</p><h1 style="margin:0;font-size:22px;font-weight:800;color:#c7a56a">Registration Confirmation</h1><p style="margin:4px 0 0;font-size:13px;color:#666">${tourTitle}</p></div><div style="background:#fff;padding:28px 32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px"><h3 style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;color:#555">Booker Details</h3><table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5dcc8;margin-bottom:24px"><tr style="border-bottom:1px solid #e5dcc8"><td style="padding:9px 12px;color:#666;width:120px;background:#fdfbf7">Full Name</td><td style="padding:9px 12px;font-weight:600">${firstName} ${lastName}</td><td style="padding:9px 12px;color:#666;width:120px;background:#fdfbf7">E-mail</td><td style="padding:9px 12px">${email}</td></tr><tr><td style="padding:9px 12px;color:#666;background:#fdfbf7">Phone</td><td style="padding:9px 12px" colspan="3">${phone}</td></tr></table><p style="margin:0 0 24px;font-size:14px;line-height:1.75;color:#444">Thank you for entrusting us to accompany you on this blessed journey. We're honored to guide you, and we pray to share in your spiritual rewards and blessings.</p><h3 style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;color:#555">Travelers</h3><table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:28px">${travelersHtml}</table><h3 style="margin:0 0 16px;font-size:13px;font-weight:700;text-transform:uppercase;color:#555">Hotel</h3>${hotelBlock('Medina',hotelMedina)}${hotelBlock('Mecca',hotelMecca)}<div style="background:#f7f3eb;border-radius:8px;padding:14px 16px;margin-bottom:28px;font-size:13px;color:#555;line-height:1.6"><strong style="color:#151515">Transportation:</strong> Package transportation is available within Saudi Arabia for airport pickup and drop-off.</div><h3 style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;color:#555">Payment Summary</h3><table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e5dcc8;margin-bottom:8px"><tr style="border-bottom:1px solid #e5dcc8"><td style="padding:9px 14px;color:#666;background:#fdfbf7">Total Price</td><td style="padding:9px 14px;font-weight:700">USD $${grandTotal.toLocaleString()}</td><td style="padding:9px 14px;color:#666;background:#fdfbf7">Amount Paid</td><td style="padding:9px 14px;font-weight:700;color:#16a34a">USD $${depositAmount.toLocaleString()}</td></tr><tr><td style="padding:9px 14px;color:#666;background:#fdfbf7">Balance Due</td><td style="padding:9px 14px;font-weight:700">USD $${balanceDue.toLocaleString()}</td><td style="padding:9px 14px;color:#666;background:#fdfbf7">Balance Due Date</td><td style="padding:9px 14px;font-weight:700">${formatDate(balanceDueDate)}</td></tr></table><p style="margin:0 0 6px;font-size:13px;color:#444"><strong>Payment Method:</strong> ${methodLabel}</p>${notes?`<div style="background:#fef9ee;border:1px solid #e5dcc8;border-radius:8px;padding:14px 16px;margin-bottom:24px;font-size:13px;color:#555"><strong style="color:#151515">Notes:</strong> ${notes}</div>`:''}<p style="margin:24px 0 4px;font-size:14px;color:#444;line-height:1.7">If you have any inquiries or require assistance before your trip, please feel free to contact us.</p><p style="margin:0 0 4px;font-size:14px;color:#444">Respectfully,</p><p style="margin:0;font-size:14px;font-weight:700;color:#151515">Marefat Pilgrimage Team</p></div><div style="margin-top:24px;background:#151515;border-radius:10px;padding:18px 28px"><a href="https://www.marefatpilgrimage.com" style="color:#c7a56a;text-decoration:none;font-size:13px;font-weight:600">www.marefatpilgrimage.com</a></div></div></body></html>`,
  });
}