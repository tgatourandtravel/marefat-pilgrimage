/**
 * Booking Pre-Confirmation PDF
 * Generated immediately after the customer verifies their booking (before admin confirmation).
 * Uses the same Marefat Registration Confirmation template design.
 * Hotel details are not yet available at this stage — they are filled in by the admin.
 */

import jsPDF from 'jspdf';
import { getLogoBase64 } from './logo-loader';

// ─── Palette (matches registration-confirmation-pdf.ts) ─────────────────────
const C = {
  white:     [255, 255, 255] as [number, number, number],
  ivory:     [247, 243, 235] as [number, number, number],
  border:    [220, 210, 190] as [number, number, number],
  gold:      [199, 165, 106] as [number, number, number],
  charcoal:  [ 30,  30,  28] as [number, number, number],
  gray:      [ 85,  85,  85] as [number, number, number],
  lightGray: [140, 140, 140] as [number, number, number],
  green:     [ 22, 163,  74] as [number, number, number],
  footerBg:  [ 30,  30,  28] as [number, number, number],
};

export interface BookingData {
  bookingRef: string;
  tourTitle: string;
  tourDestination: string;
  tourStartDate?: string;
  tourDurationDays?: number;
  numberOfTravelers: number;
  travelers: Array<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passportNumber: string;
    nationality: string;
    passportExpiry: string;
    dateOfBirth: string;
  }>;
  basePricePerPerson: number;
  insuranceTotal: number;
  flightTotal: number;
  grandTotal: number;
  depositAmount: number;
  hasInsurance: boolean;
  hasFlightBooking: boolean;
  contactEmail: string;
  contactPhone: string;
  createdAt?: string;
  expiresAt?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d?: string): string => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch { return d; }
};

const usd = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

// ─── Builder ─────────────────────────────────────────────────────────────────
async function buildBookingPDF(data: BookingData): Promise<jsPDF> {
  const logoB64 = await getLogoBase64();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W  = doc.internal.pageSize.getWidth();
  const H  = doc.internal.pageSize.getHeight();
  const ML = 16;
  const MR = 16;
  const CW = W - ML - MR;
  const FOOTER_H   = 16;
  const SAFE_BOTTOM = H - FOOTER_H - 6;

  let y = 0;

  const fill  = (c: [number,number,number]) => doc.setFillColor(c[0], c[1], c[2]);
  const draw  = (c: [number,number,number]) => doc.setDrawColor(c[0], c[1], c[2]);
  const color = (c: [number,number,number]) => doc.setTextColor(c[0], c[1], c[2]);

  // ── Footer ─────────────────────────────────────────────────────────────────
  const addFooter = () => {
    const fy = H - FOOTER_H;
    fill(C.footerBg);
    doc.rect(0, fy, W, FOOTER_H, 'F');

    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(C.lightGray);
    doc.text('Ahmad Reshad Tajik  ·  +1 (954) 330-8904  ·  info@marefatpilgrimage.com', ML, fy + 6.5);

    doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    color(C.gold);
    doc.text('www.marefatpilgrimage.com', W - MR, fy + 6.5, { align: 'right' });

    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
    color([100, 100, 100]);
    doc.text(
      `Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
      W / 2, fy + 12.5, { align: 'center' },
    );
  };

  // ── Page header (logo + gold rule) ─────────────────────────────────────────
  const addPageHeader = (rightSide = false): number => {
    const logoW = 28;
    const logoH = 28;

    if (logoB64) {
      if (rightSide) {
        doc.addImage(logoB64, 'PNG', W - MR - logoW, 6, logoW, logoH);
      } else {
        doc.addImage(logoB64, 'PNG', ML, 6, logoW, logoH);
        doc.setFontSize(14); doc.setFont('helvetica', 'bold');
        color(C.charcoal);
        doc.text('MAREFAT', ML + logoW + 4, 16);
        doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
        color(C.lightGray);
        doc.text('Pilgrimage', ML + logoW + 4, 22);
      }
    } else {
      fill(C.gold);
      doc.circle(ML + 7, 18, 7, 'F');
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      color(C.white);
      doc.text('M', ML + 4.5, 20.5);
      doc.setFontSize(14); doc.setFont('helvetica', 'bold');
      color(C.charcoal);
      doc.text('MAREFAT', ML + 17, 16);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      color(C.lightGray);
      doc.text('Pilgrimage', ML + 17, 22);
    }

    fill(C.gold);
    doc.rect(0, 36, W, 1.2, 'F');
    return 42;
  };

  // ── Guard ──────────────────────────────────────────────────────────────────
  const ensureSpace = (need: number) => {
    if (y + need > SAFE_BOTTOM) {
      addFooter();
      doc.addPage();
      y = addPageHeader(true);
    }
  };

  // ── Section heading ────────────────────────────────────────────────────────
  const sectionHeading = (label: string) => {
    ensureSpace(12);
    y += 4;
    doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    color(C.charcoal);
    doc.text(label, ML, y);
    y += 2;
    draw(C.border); doc.setLineWidth(0.25);
    doc.line(ML, y + 0.5, W - MR, y + 0.5);
    y += 5;
  };

  // ── Table row ──────────────────────────────────────────────────────────────
  const tableRow = (cols: { label: string; value: string; width: number }[]) => {
    const rowH  = 10;
    const labelW = 26;
    let x = ML;

    cols.forEach(({ label, value, width }) => {
      if (width === 0) return;
      fill(C.ivory); draw(C.border); doc.setLineWidth(0.2);
      doc.rect(x, y, labelW, rowH, 'FD');
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      color(C.lightGray);
      doc.text(label, x + 2.5, y + 6.5);

      const vw = width - labelW;
      fill(C.white);
      doc.rect(x + labelW, y, vw, rowH, 'FD');
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
      color(C.charcoal);
      const lines = doc.splitTextToSize(value || '—', vw - 4);
      doc.text(lines[0], x + labelW + 3, y + 6.5);
      x += width;
    });
    y += rowH;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1 – Header / Booking Info / Booker / Travelers
  // ══════════════════════════════════════════════════════════════════════════
  y = addPageHeader(false);

  doc.setFontSize(20); doc.setFont('helvetica', 'bold');
  color(C.gold);
  doc.text('Booking Pre-Confirmation', W / 2, y + 4, { align: 'center' });
  y += 10;

  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  color(C.gray);
  doc.text('Umrah Pilgrimage Package', W / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text(`Booking Confirmation: ${data.tourTitle} — Ref. ${data.bookingRef}`, ML, y);
  y += 6;

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  color(C.gray);
  const pendingNote = doc.splitTextToSize(
    'Your booking has been received and is pending deposit payment. Full confirmation and hotel details will follow after deposit is processed.',
    CW,
  );
  doc.text(pendingNote, ML, y);
  y += pendingNote.length * 5 + 5;

  // ── Booker Details ──────────────────────────────────────────────────────────
  sectionHeading('Booker Details:');

  const half  = CW / 2;
  const third = CW / 3;

  tableRow([
    { label: 'Full Name', value: `${data.travelers[0]?.firstName ?? ''} ${data.travelers[0]?.lastName ?? ''}`.trim(), width: third },
    { label: 'Address',   value: '—', width: third },
    { label: 'City / State / Zip', value: '—', width: CW - third * 2 },
  ]);
  tableRow([
    { label: 'Phone',  value: data.contactPhone, width: half },
    { label: 'E-mail', value: data.contactEmail, width: CW - half },
  ]);
  y += 4;

  // ── Thank you ──────────────────────────────────────────────────────────────
  ensureSpace(18);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  color(C.gray);
  const thankYou = doc.splitTextToSize(
    "Thank you for entrusting us to accompany you on this blessed journey. We're honored to guide you, and we pray to share in your spiritual rewards and blessings.",
    CW,
  );
  doc.text(thankYou, ML, y);
  y += thankYou.length * 5 + 6;

  // ── Travelers ──────────────────────────────────────────────────────────────
  sectionHeading('Travelers:');

  const colW = CW / 2;
  for (let i = 0; i < data.travelers.length; i += 2) {
    ensureSpace(7);
    doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
    color(C.charcoal);
    const t0 = data.travelers[i];
    const t1 = data.travelers[i + 1];
    doc.text(`${i + 1}.  ${t0.firstName} ${t0.lastName}`, ML, y);
    if (t1) doc.text(`${i + 2}.  ${t1.firstName} ${t1.lastName}`, ML + colW, y);
    y += 6;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 2 – Tour Details / Payment Summary
  // ══════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage();
  y = addPageHeader(true);

  // ── Tour Details ───────────────────────────────────────────────────────────
  sectionHeading('Tour Details:');

  tableRow([
    { label: 'Tour Package', value: data.tourTitle,       width: half },
    { label: 'Destination',  value: data.tourDestination, width: CW - half },
  ]);
  tableRow([
    { label: 'Travel Date', value: fmtDate(data.tourStartDate),                                             width: half },
    { label: 'Duration',    value: data.tourDurationDays ? `${data.tourDurationDays} days` : '—', width: CW - half },
  ]);
  tableRow([
    { label: 'Travelers', value: `${data.numberOfTravelers}`,                    width: half },
    { label: 'Booking Ref', value: data.bookingRef,  width: CW - half },
  ]);
  y += 4;

  // ── Other Services ─────────────────────────────────────────────────────────
  sectionHeading('Other Services:');

  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  color(C.charcoal);
  doc.text('Saudi Visa Application.', ML, y);
  y += 5;

  color(C.gray);
  const visaLines = doc.splitTextToSize(
    'Please note that Visa fee for the nationalities of the USA, Canada and European Union is included in the package price. For other nationalities extra Visa fee may apply.',
    CW,
  );
  doc.text(visaLines, ML, y);
  y += visaLines.length * 5 + 6;

  // ── Payment Summary ────────────────────────────────────────────────────────
  sectionHeading('Payment Summary:');

  const balance = data.grandTotal - data.depositAmount;
  const cellW   = CW / 4;
  const cellH   = 18;

  ensureSpace(cellH + 4);
  const boxes = [
    { label: 'Total Price',     value: usd(data.grandTotal),    vc: C.charcoal },
    { label: 'Deposit Due Now (30%)', value: usd(data.depositAmount), vc: C.green },
    { label: 'Balance Due',     value: usd(balance),            vc: C.charcoal },
    { label: 'Reservation Expires', value: fmtDate(data.expiresAt), vc: C.charcoal },
  ] as const;

  boxes.forEach(({ label, value, vc }, i) => {
    const cx = ML + i * cellW;
    fill(i % 2 === 0 ? C.ivory : C.white);
    draw(C.border); doc.setLineWidth(0.2);
    doc.rect(cx, y, cellW, cellH, 'FD');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(C.lightGray);
    doc.text(label, cx + 3, y + 6);
    doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    color(vc as [number,number,number]);
    doc.text(value, cx + 3, y + 13);
  });
  y += cellH + 5;

  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text(`Payment Method: (${data.hasFlightBooking ? 'Wire Transfer / Zelle' : 'Bank Transfer, Zelle, Card, Crypto'})`, ML, y);
  y += 6;

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  color(C.gray);
  const cancelNote = doc.splitTextToSize(
    'Please note failure of payment by the reservation expiry date may result in cancellation with an applied cancellation fee according to our refund policy.',
    CW,
  );
  doc.text(cancelNote, ML, y);
  y += cancelNote.length * 5 + 8;

  // ── Wire/Zelle payment instructions ────────────────────────────────────────
  sectionHeading('Payment Instructions:');

  ensureSpace(30);
  fill(C.ivory); draw(C.border); doc.setLineWidth(0.2);
  doc.roundedRect(ML, y, CW, 28, 2, 2, 'FD');

  doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text('Bank Wire Transfer — JPMorgan Chase', ML + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  color(C.gray);
  const wireLines = [
    'Account Name: TGA Tour and Travel LLC',
    'Account #: 879845787    Routing #: 267084131',
    `Memo / Reference: ${data.bookingRef}`,
  ];
  wireLines.forEach((line, i) => {
    doc.setFontSize(8.5);
    doc.text(line, ML + 4, y + 14 + i * 5.5);
  });
  y += 32;

  ensureSpace(20);
  fill(C.ivory); draw(C.border); doc.setLineWidth(0.2);
  doc.roundedRect(ML, y, CW, 16, 2, 2, 'FD');
  doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text('Zelle', ML + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  color(C.gray);
  doc.text(`Send to: info@marefatpilgrimage.com  ·  Memo: ${data.bookingRef}`, ML + 4, y + 13);
  y += 20;

  // ── Sign-off ───────────────────────────────────────────────────────────────
  ensureSpace(28);
  y += 6;
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
  color(C.gray);
  const signOff = doc.splitTextToSize(
    "If you have any inquiries or require assistance before your trip, please feel free to contact us. We're looking forward to providing you with an unforgettable experience.",
    CW,
  );
  doc.text(signOff, ML, y);
  y += signOff.length * 5.5 + 4;
  doc.text('Respectfully', ML, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text('Marefat Pilgrimage Team', ML, y);

  addFooter();
  return doc;
}

// ─── Public exports ───────────────────────────────────────────────────────────
export async function generateBookingPDFBytes(data: BookingData): Promise<Uint8Array> {
  const doc = await buildBookingPDF(data);
  return new Uint8Array(doc.output('arraybuffer'));
}

/** @deprecated Use generateBookingPDFBytes instead */
export function generateBookingPDF(_data: BookingData): void {
  console.warn('generateBookingPDF is deprecated — use generateBookingPDFBytes');
}
