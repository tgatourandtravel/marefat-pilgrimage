/**
 * Marefat Pilgrimage — Booking Pre-Confirmation PDF
 *
 * Design mirrors the website / email confirmation aesthetic:
 *   Page background  Warm cream  #F5F1EA
 *   Cards / rows     White       #FFFFFF
 *   Gold accent      #CCAB6B
 *   Charcoal text    #2C2C2A
 *   Muted label      #6B6B69
 *   Border           #E8E3D8
 *   Footer           Light — no dark band
 */

import jsPDF from 'jspdf';
import { getLogoBase64 } from './logo-loader';

// ─── Palette ────────────────────────────────────────────────────────────────────
const P = {
  pageBg:   [245, 241, 234] as [number,number,number],   // #F5F1EA
  white:    [255, 255, 255] as [number,number,number],
  cardBg:   [255, 255, 255] as [number,number,number],
  altRow:   [250, 248, 244] as [number,number,number],   // very light cream
  gold:     [204, 171, 107] as [number,number,number],   // #CCAB6B
  charcoal: [ 44,  44,  42] as [number,number,number],   // #2C2C2A
  gray:     [107, 107, 105] as [number,number,number],   // #6B6B69
  border:   [224, 219, 208] as [number,number,number],   // #E0DBD0
  green:    [ 34, 127,  60] as [number,number,number],
  footerBd: [210, 204, 192] as [number,number,number],
};

const ML = 20;
const MR = 20;

export interface BookingData {
  bookingRef: string;
  tourTitle: string;
  tourDestination: string;
  tourStartDate?: string;
  tourDurationDays?: number;
  numberOfTravelers: number;
  travelers: Array<{
    firstName: string; lastName: string;
    email: string; phone: string;
    passportNumber: string; nationality: string;
    passportExpiry: string; dateOfBirth: string;
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

// ─── Formatters ──────────────────────────────────────────────────────────────────
const fmt = (d?: string | null) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
};
const fmtS = (d?: string | null) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return d ?? '—'; }
};
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

// ─── Builder ─────────────────────────────────────────────────────────────────────
async function buildPDF(data: BookingData): Promise<jsPDF> {
  const iconB64 = await getLogoBase64();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W  = doc.internal.pageSize.getWidth();
  const H  = doc.internal.pageSize.getHeight();
  const CW = W - ML - MR;
  const FOOTER_H = 14;
  const safeBottom = H - FOOTER_H - 6;
  let y = 0;

  const fill  = (c: [number,number,number]) => doc.setFillColor(c[0], c[1], c[2]);
  const draw  = (c: [number,number,number]) => doc.setDrawColor(c[0], c[1], c[2]);
  const color = (c: [number,number,number]) => doc.setTextColor(c[0], c[1], c[2]);

  // Fill the full page with warm cream
  const paintPageBg = () => {
    fill(P.pageBg);
    doc.rect(0, 0, W, H, 'F');
  };

  // ── Footer ───────────────────────────────────────────────────────────────────
  const addFooter = () => {
    const fy = H - FOOTER_H;
    // Thin top border
    draw(P.footerBd); doc.setLineWidth(0.3);
    doc.line(ML, fy + 1, W - MR, fy + 1);

    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    color(P.gray);
    doc.text(
      'info@marefatpilgrimage.com  ·  +1 (954) 330-8904  ·  www.marefatpilgrimage.com',
      W / 2, fy + 7, { align: 'center' },
    );
    doc.setFontSize(6.5);
    color([160, 155, 148]);
    doc.text(
      `Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
      W / 2, fy + 12, { align: 'center' },
    );
  };

  // ── Header: icon + wordmark ───────────────────────────────────────────────────
  const drawHeader = (compact = false): number => {
    const iconSize = compact ? 7 : 9;   // mm — small, not dominant
    const topPad   = compact ? 6 : 8;

    // Center the logo block (icon + name text)
    const nameW = compact ? 28 : 34;
    const totalW = iconSize + 2.5 + nameW;
    const startX = W / 2 - totalW / 2;

    if (iconB64) {
      doc.addImage(iconB64, 'PNG', startX, topPad, iconSize, iconSize);
    } else {
      fill(P.gold);
      doc.circle(startX + iconSize / 2, topPad + iconSize / 2, iconSize / 2, 'F');
    }

    // "MAREFAT" wordmark
    const tx = startX + iconSize + 2.5;
    doc.setFontSize(compact ? 9 : 11); doc.setFont('helvetica', 'bold');
    color(P.charcoal);
    doc.text('MAREFAT', tx, topPad + iconSize * 0.52);

    doc.setFontSize(compact ? 5.5 : 6.5); doc.setFont('helvetica', 'normal');
    color(P.gray);
    doc.text('Pilgrimage', tx, topPad + iconSize * 0.52 + (compact ? 3.5 : 4.5));

    // Gold rule
    const ruleY = topPad + iconSize + 4;
    fill(P.gold); doc.rect(0, ruleY, W, 0.6, 'F');
    return ruleY + 6;
  };

  const ensureSpace = (need: number) => {
    if (y + need > safeBottom) {
      addFooter();
      doc.addPage();
      paintPageBg();
      y = drawHeader(true);
    }
  };

  // ── Section heading ──────────────────────────────────────────────────────────
  const section = (label: string) => {
    ensureSpace(16);
    y += 6;
    doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
    color(P.gold);
    doc.text(label.toUpperCase(), ML, y, { charSpace: 0.8 });
    y += 2;
    draw(P.border); doc.setLineWidth(0.2);
    doc.line(ML, y, W - MR, y);
    y += 5;
  };

  // ── Key/value row ─────────────────────────────────────────────────────────────
  const kv = (key: string, val: string, alt = false) => {
    const h = 8.5;
    ensureSpace(h);
    fill(alt ? P.altRow : P.cardBg);
    draw(P.border); doc.setLineWidth(0.15);
    doc.rect(ML, y, CW, h, 'FD');

    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(P.gray);
    doc.text(key, ML + 3, y + 5.8);

    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(P.charcoal);
    const lines = doc.splitTextToSize(val || '—', CW - 60);
    doc.text(lines[0], ML + 55, y + 5.8);
    y += h;
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // PAGE 1
  // ═══════════════════════════════════════════════════════════════════════════════
  paintPageBg();
  y = drawHeader(false);

  // Title block
  y += 3;
  doc.setFontSize(6); doc.setFont('helvetica', 'bold');
  color(P.gold);
  doc.text('BOOKING PRE-CONFIRMATION', W / 2, y, { align: 'center', charSpace: 1 });
  y += 6;

  doc.setFontSize(17); doc.setFont('helvetica', 'bold');
  color(P.charcoal);
  doc.text(data.tourTitle, W / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(P.gray);
  doc.text(`Booking Reference: ${data.bookingRef}`, W / 2, y, { align: 'center' });
  y += 5;

  draw(P.border); doc.setLineWidth(0.2);
  doc.line(ML + 30, y, W - MR - 30, y);
  y += 7;

  // Pending notice box
  fill(P.white); draw(P.border); doc.setLineWidth(0.2);
  const noteTxt = doc.splitTextToSize(
    'Your booking has been received and is awaiting deposit payment. ' +
    'Full confirmation — including hotel assignments and travel documents — ' +
    'will be issued once the deposit is processed.',
    CW - 10,
  );
  const noteH = noteTxt.length * 4.8 + 8;
  doc.roundedRect(ML, y, CW, noteH, 2, 2, 'FD');
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(P.gray);
  doc.text(noteTxt, ML + 5, y + 6);
  y += noteH + 4;

  // Tour Details
  section('Tour Details');
  kv('Tour Package',  data.tourTitle,           false);
  kv('Destination',   data.tourDestination,     true);
  kv('Travel Date',   fmt(data.tourStartDate),  false);
  kv('Duration',      data.tourDurationDays ? `${data.tourDurationDays} Days` : '—', true);
  kv('Travelers',     `${data.numberOfTravelers}`, false);

  // Booker Details
  section('Booker Details');
  const p0 = data.travelers[0];
  kv('Full Name', p0 ? `${p0.firstName} ${p0.lastName}` : '—', false);
  kv('Phone',     data.contactPhone, true);
  kv('Email',     data.contactEmail, false);

  // Travelers
  section('Travelers');
  data.travelers.forEach((t, i) => {
    const h = 8;
    ensureSpace(h);
    fill(i % 2 === 1 ? P.altRow : P.cardBg);
    draw(P.border); doc.setLineWidth(0.15);
    doc.rect(ML, y, CW, h, 'FD');
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(P.charcoal);
    doc.text(`${i + 1}.  ${t.firstName} ${t.lastName}`, ML + 3, y + 5.5);
    y += h;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // PAGE 2
  // ═══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage();
  paintPageBg();
  y = drawHeader(true);

  // Payment Summary boxes
  section('Payment Summary');

  const balance = data.grandTotal - data.depositAmount;
  const bW = CW / 4;
  const bH = 22;
  ensureSpace(bH + 4);

  const boxes = [
    { label: 'Total Price',          value: usd(data.grandTotal),    vc: P.charcoal },
    { label: 'Deposit Due (30%)',     value: usd(data.depositAmount), vc: P.green    },
    { label: 'Remaining Balance',     value: usd(balance),            vc: P.charcoal },
    { label: 'Reservation Expires',   value: fmtS(data.expiresAt),   vc: P.charcoal },
  ] as const;

  boxes.forEach(({ label, value, vc }, i) => {
    const cx = ML + i * bW;
    fill(i % 2 === 0 ? P.white : P.altRow);
    draw(P.border); doc.setLineWidth(0.2);
    doc.rect(cx, y, bW, bH, 'FD');
    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
    color(P.gray);
    doc.text(doc.splitTextToSize(label, bW - 4), cx + 3, y + 5.5);
    doc.setFontSize(9.5); doc.setFont('helvetica', 'bold');
    color(vc as [number,number,number]);
    doc.text(value, cx + 3, y + 17);
  });
  y += bH + 5;

  // Payment method note
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  color(P.gray);
  doc.text('Payment Method: Wire Transfer  ·  Zelle  ·  Check', ML, y);
  y += 5;
  const cancelTxt = doc.splitTextToSize(
    'Failure to complete the deposit by the reservation expiry date may result in cancellation per our refund policy.',
    CW,
  );
  doc.text(cancelTxt, ML, y);
  y += cancelTxt.length * 4.5 + 6;

  // Package Includes
  section('Package Includes');
  const services = [
    '5-Star Transportation',
    'Half-Board Meals (Breakfast & Dinner)',
    '5-Star Renowned Hotels',
    'Saudi Visa Application',
    'Religious Lectures',
  ];
  services.forEach((s, i) => {
    const h = 7.5;
    ensureSpace(h);
    fill(i % 2 === 0 ? P.white : P.altRow);
    draw(P.border); doc.setLineWidth(0.15);
    doc.rect(ML, y, CW, h, 'FD');
    fill(P.gold); doc.circle(ML + 4.5, y + 3.5, 1, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    color(P.charcoal);
    doc.text(s, ML + 9, y + 5);
    y += h;
  });
  y += 5;

  // Payment Instructions
  section('Payment Instructions');

  // Wire Transfer card
  ensureSpace(34);
  fill(P.white); draw(P.border); doc.setLineWidth(0.2);
  doc.roundedRect(ML, y, CW, 32, 2, 2, 'FD');
  fill(P.gold); doc.rect(ML, y, 2, 32, 'F');

  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  color(P.charcoal);
  doc.text('Bank Wire Transfer — JPMorgan Chase', ML + 6, y + 8);

  const wireRows = [
    ['Account Name', 'TGA Tour and Travel LLC'],
    ['Account #',    '879845787'],
    ['Routing #',    '267084131'],
    ['Memo / Ref',   data.bookingRef],
  ];
  wireRows.forEach(([k, v], i) => {
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(P.gray);
    doc.text(k, ML + 6, y + 14 + i * 4.8);
    doc.setFont('helvetica', 'bold');
    color(P.charcoal);
    doc.text(v, ML + 38, y + 14 + i * 4.8);
  });
  y += 36;

  // Zelle card
  ensureSpace(18);
  fill(P.white); draw(P.border); doc.setLineWidth(0.2);
  doc.roundedRect(ML, y, CW, 16, 2, 2, 'FD');
  fill(P.gold); doc.rect(ML, y, 2, 16, 'F');

  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  color(P.charcoal);
  doc.text('Zelle', ML + 6, y + 7);
  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  color(P.gray);
  doc.text('Send to:', ML + 6, y + 12.5);
  doc.setFont('helvetica', 'bold'); color(P.charcoal);
  doc.text(`info@marefatpilgrimage.com  ·  Memo: ${data.bookingRef}`, ML + 22, y + 12.5);
  y += 20;

  // Sign-off
  ensureSpace(30);
  y += 8;
  draw(P.border); doc.setLineWidth(0.2);
  doc.line(ML, y, W - MR, y);
  y += 7;

  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(P.gray);
  const signOff = doc.splitTextToSize(
    "Thank you for entrusting us with your sacred journey. Should you have any questions before your trip, please don't hesitate to reach out — we're here for you.",
    CW,
  );
  doc.text(signOff, ML, y);
  y += signOff.length * 4.8 + 6;

  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  color(P.gray);
  doc.text('Respectfully,', ML, y);
  y += 5;
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  color(P.charcoal);
  doc.text('Marefat Pilgrimage', ML, y);
  y += 4.5;
  doc.setFontSize(7); doc.setFont('helvetica', 'normal');
  color(P.gold);
  doc.text('Ahmad Reshad Tajik  ·  TGA Tour and Travel LLC', ML, y);

  addFooter();
  return doc;
}

// ─── Exports ─────────────────────────────────────────────────────────────────────
export async function generateBookingPDFBytes(data: BookingData): Promise<Uint8Array> {
  const doc = await buildPDF(data);
  return new Uint8Array(doc.output('arraybuffer'));
}

/** @deprecated */
export function generateBookingPDF(_data: BookingData): void {
  console.warn('generateBookingPDF is deprecated — use generateBookingPDFBytes (async)');
}
