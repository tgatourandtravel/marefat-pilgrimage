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
