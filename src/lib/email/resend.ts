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
}

export async function sendBookingConfirmationEmail({
  to,
  firstName,
  bookingRef,
  tourTitle,
  depositAmount,
  grandTotal,
  expiresAt,
}: SendConfirmationEmailParams) {
  const formattedExpiry = expiresAt.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return resend.emails.send({
    from: 'Marefat Pilgrimage <noreply@marefatpilgrimage.com>',
    to,
    subject: `Booking Confirmed - ${bookingRef} | Marefat Pilgrimage`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #151515; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          .booking-box {
            background: #f7f3eb;
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
          }
          .bank-details {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">&#10003;</div>
            <h1 style="margin: 0; color: #151515;">Booking Confirmed!</h1>
          </div>

          <p>Salam ${firstName},</p>

          <p>Your booking has been confirmed and your reservation is now secured.</p>

          <div class="booking-box">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">Booking Reference</p>
            <p style="margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">${bookingRef}</p>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">Tour</p>
            <p style="margin: 0; font-weight: 600;">${tourTitle}</p>
          </div>

          <h3>Payment Details</h3>
          <p><strong>Deposit Due (30%):</strong> EUR ${depositAmount.toLocaleString()}<br>
          <strong>Total Amount:</strong> EUR ${grandTotal.toLocaleString()}</p>

          <p><em>Your reservation is held until <strong>${formattedExpiry}</strong>. Please complete the deposit payment by this date.</em></p>

          <div class="bank-details">
            <h4 style="margin: 0 0 15px 0;">Bank Transfer Details</h4>
            <p style="margin: 5px 0;"><strong>Bank:</strong> Deutsche Bank</p>
            <p style="margin: 5px 0;"><strong>IBAN:</strong> DE89 3704 0044 0532 0130 00</p>
            <p style="margin: 5px 0;"><strong>BIC:</strong> COBADEFFXXX</p>
            <p style="margin: 5px 0;"><strong>Reference:</strong> ${bookingRef}</p>
          </div>

          <p>Once we receive your deposit, we will send you detailed travel documents and next steps.</p>

          <p>If you have any questions, please contact us at <a href="mailto:info@marefatpilgrimage.com">info@marefatpilgrimage.com</a></p>

          <div class="footer">
            <p>Marefat Pilgrimage<br>
            Premium Umrah, Hajj & Ziyarat Tours</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
