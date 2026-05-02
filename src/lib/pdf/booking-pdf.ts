/**
 * Marefat Pilgrimage — Booking Pre-Confirmation PDF
 *
 * Luxury-minimal design system:
 *   Background  White (#FFFFFF) / Cream (#FAFAF7) for alternate rows
 *   Gold        #CCAB6B  — all accents, rules, headings
 *   Charcoal    #1D1D1B  — primary text
 *   Mist        #6B6B69  — secondary / label text
 *   Feather     #E8E3D8  — borders, dividers
 *
 * Layout: A4 portrait · 20 mm side margins · centered logo header
 */

import jsPDF from 'jspdf';
import { getHorizontalLogoBase64 } from './logo-loader';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  white:    [255, 255, 255] as [number, number, number],
  cream:    [250, 250, 247] as [number, number, number],
  gold:     [204, 171, 107] as [number, number, number],
  goldDark: [162, 128,  68] as [number, number, number],
  charcoal: [ 29,  29,  27] as [number, number, number],
  mist:     [107, 107, 105] as [number, number, number],
  feather:  [232, 227, 216] as [number, number, number],
  ink:      [ 50,  50,  48] as [number, number, number],
  green:    [ 34, 139,  34] as [number, number, number],
  darkBg:   [ 22,  22,  20] as [number, number, number],
};

// ─── Page geometry ─────────────────────────────────────────────────────────────
const ML = 20;   // left margin mm
const MR = 20;   // right margin mm
const FOOTER_H = 18;

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

// ─── Formatters ─────────────────────────────────────────────────────────────────
const fmtDate = (d?: string | null): string => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return d; }
};
const fmtShortDate = (d?: string | null): string => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return d ?? '—'; }
};
const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

// ─── Main builder ────────────────────────────────────────────────────────────────
async function buildPDF(data: BookingData): Promise<jsPDF> {
  const logoB64 = await getHorizontalLogoBase64();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W  = doc.internal.pageSize.getWidth();   // 210
  const H  = doc.internal.pageSize.getHeight();  // 297
  const CW = W - ML - MR;                        // 170

  const safeBottom = H - FOOTER_H - 8;
  let y = 0;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const fill  = (c: [number,number,number]) => doc.setFillColor(c[0], c[1], c[2]);
  const draw  = (c: [number,number,number]) => doc.setDrawColor(c[0], c[1], c[2]);
  const color = (c: [number,number,number]) => doc.setTextColor(c[0], c[1], c[2]);

  const hairline = (x1: number, yy: number, x2: number, c: [number,number,number], lw = 0.2) => {
    draw(c); doc.setLineWidth(lw);
    doc.line(x1, yy, x2, yy);
  };

  const ensureSpace = (need: number) => {
    if (y + need > safeBottom) {
      addFooter();
      doc.addPage();
      y = drawHeader(true);
    }
  };

  // ── Page footer ───────────────────────────────────────────────────────────────
  const addFooter = () => {
    const fy = H - FOOTER_H;
    fill(T.darkBg); doc.rect(0, fy, W, FOOTER_H, 'F');

    // Left: contact
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(T.mist);
    doc.text('Ahmad Reshad Tajik  ·  +1 (954) 330-8904  ·  info@marefatpilgrimage.com', ML, fy + 7);

    // Right: website in gold
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    color(T.gold);
    doc.text('www.marefatpilgrimage.com', W - MR, fy + 7, { align: 'right' });

    // Center: generated date
    doc.setFontSize(6); doc.setFont('helvetica', 'normal');
    color([80, 80, 78]);
    doc.text(
      `Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
      W / 2, fy + 13.5, { align: 'center' },
    );
  };

  // ── Page header ───────────────────────────────────────────────────────────────
  const drawHeader = (small = false): number => {
    // Logo
    if (logoB64) {
      // Horizontal logo: viewBox 400×140 → ratio 2.857
      const logoW = small ? 46 : 62;
      const logoH = logoW / 2.857;
      const lx    = small ? W - MR - logoW : W / 2 - logoW / 2;
      doc.addImage(logoB64, 'PNG', lx, small ? 8 : 10, logoW, logoH);
    } else {
      // Fallback text logo
      doc.setFontSize(small ? 12 : 18); doc.setFont('helvetica', 'bold');
      color(T.charcoal);
      doc.text('MAREFAT', W / 2, small ? 20 : 24, { align: 'center' });
      doc.setFontSize(small ? 7 : 9); doc.setFont('helvetica', 'normal');
      color(T.mist);
      doc.text('Pilgrimage', W / 2, small ? 25 : 30, { align: 'center' });
    }

    const ruleY = small ? 22 : 30;
    // Gold rule
    fill(T.gold); doc.rect(0, ruleY, W, 0.8, 'F');
    return ruleY + 7;
  };

  // ── Section heading ──────────────────────────────────────────────────────────
  const sectionHeading = (label: string) => {
    ensureSpace(14);
    y += 5;
    doc.setFontSize(7); doc.setFont('helvetica', 'bold');
    color(T.gold);
    // Letter spacing via individual characters
    const letters = label.toUpperCase().split('');
    let lx = ML;
    letters.forEach((ch) => {
      doc.text(ch, lx, y);
      lx += doc.getTextWidth(ch) + 0.5;
    });
    y += 1.5;
    hairline(ML, y, W - MR, T.feather);
    y += 5;
  };

  // ── Two-column key/value row ─────────────────────────────────────────────────
  const kvRow = (key: string, value: string, shade = false) => {
    const rowH  = 9;
    const keyW  = 50;
    ensureSpace(rowH);

    if (shade) { fill(T.cream); doc.rect(ML, y, CW, rowH, 'F'); }

    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(T.mist);
    doc.text(key, ML + 2, y + 6);

    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(T.charcoal);
    const wrapped = doc.splitTextToSize(value || '—', CW - keyW - 4);
    doc.text(wrapped[0], ML + keyW, y + 6);

    y += rowH;
  };

  // ── Full-width info row (used for travelers) ─────────────────────────────────
  const infoRow = (text: string, shade = false) => {
    const rowH = 8;
    ensureSpace(rowH);
    if (shade) { fill(T.cream); doc.rect(ML, y, CW, rowH, 'F'); }
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(T.charcoal);
    doc.text(text, ML + 2, y + 5.5);
    y += rowH;
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 1  ·  Header → Title → Tour → Booker → Travelers
  // ══════════════════════════════════════════════════════════════════════════════
  y = drawHeader(false);

  // ── Title block ──────────────────────────────────────────────────────────────
  y += 4;
  doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
  color(T.gold);
  doc.text('BOOKING PRE-CONFIRMATION', W / 2, y, { align: 'center', charSpace: 1.2 });
  y += 6;

  doc.setFontSize(19); doc.setFont('helvetica', 'bold');
  color(T.charcoal);
  doc.text(data.tourTitle, W / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  color(T.mist);
  doc.text(`Booking Reference: ${data.bookingRef}`, W / 2, y, { align: 'center' });
  y += 5;

  hairline(ML + 20, y, W - MR - 20, T.feather);
  y += 6;

  // ── Pending note ─────────────────────────────────────────────────────────────
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(T.mist);
  const note = doc.splitTextToSize(
    'Your booking has been received and is awaiting deposit payment. ' +
    'Full confirmation — including hotel assignments and travel documents — will be issued once the deposit is processed.',
    CW,
  );
  doc.text(note, ML, y);
  y += note.length * 4.8 + 6;

  // ── Tour details ─────────────────────────────────────────────────────────────
  sectionHeading('Tour Details');
  kvRow('Tour Package',   data.tourTitle,           false);
  kvRow('Destination',    data.tourDestination,     true);
  kvRow('Travel Date',    fmtDate(data.tourStartDate), false);
  kvRow('Duration',       data.tourDurationDays ? `${data.tourDurationDays} Days` : 'To be confirmed', true);
  kvRow('Travelers',      `${data.numberOfTravelers} ${data.numberOfTravelers === 1 ? 'Person' : 'People'}`, false);
  y += 2;

  // ── Booker details ────────────────────────────────────────────────────────────
  sectionHeading('Booker Details');
  const primary = data.travelers[0];
  kvRow('Full Name',  primary ? `${primary.firstName} ${primary.lastName}` : '—',  false);
  kvRow('Phone',      data.contactPhone,   true);
  kvRow('Email',      data.contactEmail,   false);
  y += 2;

  // ── Travelers ─────────────────────────────────────────────────────────────────
  sectionHeading('Travelers');
  data.travelers.forEach((t, i) => {
    infoRow(`${i + 1}.  ${t.firstName} ${t.lastName}`, i % 2 === 1);
  });
  y += 4;

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 2  ·  Payment Summary → Instructions → Sign-off
  // ══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage();
  y = drawHeader(true);

  // ── Payment summary boxes ─────────────────────────────────────────────────────
  sectionHeading('Payment Summary');

  const balance  = data.grandTotal - data.depositAmount;
  const cellW    = CW / 4;
  const cellH    = 22;

  ensureSpace(cellH + 4);

  const boxes: { sub: string; val: string; valColor: [number,number,number] }[] = [
    { sub: 'Total Package Price', val: usd(data.grandTotal),    valColor: T.charcoal },
    { sub: 'Deposit Due (30%)',   val: usd(data.depositAmount), valColor: T.green    },
    { sub: 'Remaining Balance',   val: usd(balance),            valColor: T.ink      },
    { sub: 'Reservation Expires', val: fmtShortDate(data.expiresAt), valColor: T.charcoal },
  ];

  boxes.forEach(({ sub, val, valColor }, i) => {
    const cx = ML + i * cellW;
    const isAlt = i % 2 === 1;
    fill(isAlt ? T.cream : T.white);
    draw(T.feather); doc.setLineWidth(0.25);
    doc.rect(cx, y, cellW, cellH, 'FD');

    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
    color(T.mist);
    const subLines = doc.splitTextToSize(sub, cellW - 5);
    doc.text(subLines, cx + 3, y + 6);

    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    color(valColor);
    doc.text(val, cx + 3, y + 17);
  });
  y += cellH + 8;

  // Payment method note
  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  color(T.charcoal);
  doc.text('Payment Method:', ML, y);
  doc.setFont('helvetica', 'normal');
  color(T.mist);
  doc.text('  Wire Transfer  ·  Zelle  ·  Check', ML + doc.getTextWidth('Payment Method:'), y);
  y += 6;

  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  color(T.mist);
  const cancelNote = doc.splitTextToSize(
    'Failure to complete the deposit by the reservation expiry date may result in cancellation. ' +
    'A cancellation fee applies per our refund policy.',
    CW,
  );
  doc.text(cancelNote, ML, y);
  y += cancelNote.length * 4.5 + 8;

  // ── Other services included ───────────────────────────────────────────────────
  sectionHeading('Package Includes');

  const services = [
    '5-Star Transportation',
    'Half-Board Meals (Breakfast & Dinner)',
    '5-Star Renowned Hotels',
    'Saudi Visa Application',
    'Religious Lectures',
  ];
  services.forEach((s, i) => {
    ensureSpace(7);
    fill(T.gold);
    doc.circle(ML + 2, y + 2.5, 0.8, 'F');
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(T.charcoal);
    doc.text(s, ML + 6, y + 4.5);
    if (i % 2 === 1) {
      fill(T.cream); doc.rect(ML, y, CW, 7, 'F');
      fill(T.gold); doc.circle(ML + 2, y + 2.5, 0.8, 'F');
      doc.setFontSize(8.5); color(T.charcoal);
      doc.text(s, ML + 6, y + 4.5);
    }
    y += 7;
  });
  y += 4;

  // ── Payment instructions ──────────────────────────────────────────────────────
  sectionHeading('Payment Instructions');

  // Wire Transfer card
  ensureSpace(36);
  draw(T.feather); fill(T.cream); doc.setLineWidth(0.25);
  doc.roundedRect(ML, y, CW, 34, 1.5, 1.5, 'FD');

  // Gold left accent bar
  fill(T.gold); doc.rect(ML, y, 2.5, 34, 'F');

  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  color(T.charcoal);
  doc.text('Bank Wire Transfer — JPMorgan Chase', ML + 7, y + 8);

  const wireRows = [
    ['Account Name', 'TGA Tour and Travel LLC'],
    ['Account #',    '879845787'],
    ['Routing #',    '267084131'],
    ['Memo / Ref',   data.bookingRef],
  ];
  wireRows.forEach(([k, v], i) => {
    const ry = y + 14 + i * 5;
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(T.mist);
    doc.text(k, ML + 7, ry);
    doc.setFont('helvetica', 'bold');
    color(T.charcoal);
    doc.text(v, ML + 40, ry);
  });
  y += 38;

  // Zelle card
  ensureSpace(22);
  draw(T.feather); fill(T.cream); doc.setLineWidth(0.25);
  doc.roundedRect(ML, y, CW, 20, 1.5, 1.5, 'FD');
  fill(T.gold); doc.rect(ML, y, 2.5, 20, 'F');

  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  color(T.charcoal);
  doc.text('Zelle', ML + 7, y + 8);
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  color(T.mist);
  doc.text('Send to:', ML + 7, y + 14);
  doc.setFont('helvetica', 'bold'); color(T.charcoal);
  doc.text('info@marefatpilgrimage.com', ML + 24, y + 14);
  doc.setFont('helvetica', 'normal'); color(T.mist);
  doc.text(`  ·  Memo: ${data.bookingRef}`, ML + 24 + doc.getTextWidth('info@marefatpilgrimage.com'), y + 14);
  y += 24;

  // ── Sign-off ───────────────────────────────────────────────────────────────────
  ensureSpace(32);
  y += 8;
  hairline(ML, y, W - MR, T.feather);
  y += 8;

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  color(T.mist);
  const signOff = doc.splitTextToSize(
    'Thank you for entrusting us to accompany you on this blessed journey. ' +
    "We are honored to guide you, and we pray to share in your spiritual rewards and blessings. " +
    "Should you have any questions before your trip, please don't hesitate to reach out.",
    CW,
  );
  doc.text(signOff, ML, y);
  y += signOff.length * 5 + 6;

  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(T.mist);
  doc.text('Respectfully,', ML, y);
  y += 6;
  doc.setFontSize(10); doc.setFont('helvetica', 'bold');
  color(T.charcoal);
  doc.text('Marefat Pilgrimage', ML, y);
  y += 5;
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  color(T.gold);
  doc.text('Ahmad Reshad Tajik  ·  TGA Tour and Travel LLC', ML, y);

  addFooter();
  return doc;
}

// ─── Public API ────────────────────────────────────────────────────────────────
export async function generateBookingPDFBytes(data: BookingData): Promise<Uint8Array> {
  const doc = await buildPDF(data);
  return new Uint8Array(doc.output('arraybuffer'));
}

/** @deprecated — server-side only; use generateBookingPDFBytes */
export function generateBookingPDF(_data: BookingData): void {
  console.warn('generateBookingPDF is deprecated — use generateBookingPDFBytes (async)');
}
