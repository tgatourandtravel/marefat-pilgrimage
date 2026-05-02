/**
 * Marefat Pilgrimage — Registration Confirmation PDF
 *
 * Issued by admin after deposit is confirmed. Includes hotel assignments.
 *
 * Design mirrors the website / email aesthetic:
 *   Background  Warm cream  #F5F1EA
 *   Cards        White      #FFFFFF
 *   Gold         #CCAB6B
 *   Charcoal     #2C2C2A
 *   Muted label  #6B6B69
 *   Border       #E0DBD0
 *   Footer       Light/minimal — no dark band
 */

import jsPDF from 'jspdf';
import { getLogoBase64 } from './logo-loader';

// ─── Palette ─────────────────────────────────────────────────────────────────────
const P = {
  pageBg:   [245, 241, 234] as [number,number,number],
  white:    [255, 255, 255] as [number,number,number],
  altRow:   [250, 248, 244] as [number,number,number],
  gold:     [204, 171, 107] as [number,number,number],
  charcoal: [ 44,  44,  42] as [number,number,number],
  gray:     [107, 107, 105] as [number,number,number],
  border:   [224, 219, 208] as [number,number,number],
  green:    [ 34, 127,  60] as [number,number,number],
  footerBd: [210, 204, 192] as [number,number,number],
};

const ML = 20;
const MR = 20;
const FOOTER_H = 14;

// ─── Types ───────────────────────────────────────────────────────────────────────
export interface HotelDetails {
  name: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  meal: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface RegistrationConfirmationData {
  bookingRef: string;
  tourTitle: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address?: string;
  grandTotal: number;
  depositAmount: number;
  paymentMethod: string;
  balanceDueDate: string;
  travelers: string[];
  hotelMedina: HotelDetails;
  hotelMecca: HotelDetails;
  notes?: string;
}

// ─── Formatters ──────────────────────────────────────────────────────────────────
const fmt = (d: string) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
};
const fmtS = (d: string) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
};
const payLabel = (m: string) =>
  m === 'zelle' ? 'Zelle' : m === 'wire' ? 'Bank Wire Transfer' : m === 'card' ? 'Credit Card' : m;
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

// ─── Builder ─────────────────────────────────────────────────────────────────────
async function buildPDF(data: RegistrationConfirmationData): Promise<jsPDF> {
  const iconB64 = await getLogoBase64();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W  = doc.internal.pageSize.getWidth();
  const H  = doc.internal.pageSize.getHeight();
  const CW = W - ML - MR;
  const safeBottom = H - FOOTER_H - 6;
  let y = 0;

  const fill  = (c: [number,number,number]) => doc.setFillColor(c[0], c[1], c[2]);
  const draw  = (c: [number,number,number]) => doc.setDrawColor(c[0], c[1], c[2]);
  const color = (c: [number,number,number]) => doc.setTextColor(c[0], c[1], c[2]);

  const paintPageBg = () => { fill(P.pageBg); doc.rect(0, 0, W, H, 'F'); };

  // ── Footer ───────────────────────────────────────────────────────────────────
  const addFooter = () => {
    const fy = H - FOOTER_H;
    draw(P.footerBd); doc.setLineWidth(0.3);
    doc.line(ML, fy + 1, W - MR, fy + 1);
    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    color(P.gray);
    doc.text(
      'info@marefatpilgrimage.com  ·  +1 (954) 330-8904  ·  www.marefatpilgrimage.com',
      W / 2, fy + 7, { align: 'center' },
    );
    doc.setFontSize(6.5); color([160, 155, 148]);
    doc.text(
      `Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
      W / 2, fy + 12, { align: 'center' },
    );
  };

  // ── Header ───────────────────────────────────────────────────────────────────
  const drawHeader = (compact = false): number => {
    const iconSize = compact ? 7 : 9;
    const topPad   = compact ? 6 : 8;
    const nameW    = compact ? 28 : 34;
    const totalW   = iconSize + 2.5 + nameW;
    const startX   = W / 2 - totalW / 2;

    if (iconB64) {
      doc.addImage(iconB64, 'PNG', startX, topPad, iconSize, iconSize);
    } else {
      fill(P.gold); doc.circle(startX + iconSize / 2, topPad + iconSize / 2, iconSize / 2, 'F');
    }
    const tx = startX + iconSize + 2.5;
    doc.setFontSize(compact ? 9 : 11); doc.setFont('helvetica', 'bold');
    color(P.charcoal);
    doc.text('MAREFAT', tx, topPad + iconSize * 0.52);
    doc.setFontSize(compact ? 5.5 : 6.5); doc.setFont('helvetica', 'normal');
    color(P.gray);
    doc.text('Pilgrimage', tx, topPad + iconSize * 0.52 + (compact ? 3.5 : 4.5));

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

  // ── KV row ───────────────────────────────────────────────────────────────────
  const kv = (key: string, val: string, alt = false) => {
    const h = 8.5;
    ensureSpace(h);
    fill(alt ? P.altRow : P.white);
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

  // ── City sub-label ───────────────────────────────────────────────────────────
  const cityLabel = (label: string) => {
    ensureSpace(10);
    y += 4;
    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
    color(P.charcoal);
    doc.text(label, ML, y);
    y += 2;
    draw(P.gold); doc.setLineWidth(0.4);
    doc.line(ML, y, ML + 30, y);
    y += 4;
  };

  // ── Bullet ───────────────────────────────────────────────────────────────────
  const bullet = (text: string, alt = false) => {
    const h = 7.5;
    ensureSpace(h);
    fill(alt ? P.altRow : P.white);
    draw(P.border); doc.setLineWidth(0.15);
    doc.rect(ML, y, CW, h, 'FD');
    fill(P.gold); doc.circle(ML + 4.5, y + 3.5, 1, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    color(P.charcoal);
    doc.text(text, ML + 9, y + 5);
    y += h;
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // PAGE 1  ·  Header / Booker / Travelers
  // ═══════════════════════════════════════════════════════════════════════════════
  paintPageBg();
  y = drawHeader(false);

  y += 3;
  doc.setFontSize(6); doc.setFont('helvetica', 'bold');
  color(P.gold);
  doc.text('REGISTRATION CONFIRMATION', W / 2, y, { align: 'center', charSpace: 1 });
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

  // Thank you note
  fill(P.white); draw(P.border); doc.setLineWidth(0.2);
  const thankTxt = doc.splitTextToSize(
    "Thank you for entrusting us to accompany you on this blessed journey. We're honored to guide you, and we pray to share in your spiritual rewards and blessings.",
    CW - 10,
  );
  const thankH = thankTxt.length * 4.8 + 8;
  doc.roundedRect(ML, y, CW, thankH, 2, 2, 'FD');
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(P.gray);
  doc.text(thankTxt, ML + 5, y + 6);
  y += thankH + 4;

  // Booker Details
  section('Booker Details');
  kv('Full Name', `${data.firstName} ${data.lastName}`, false);
  kv('Phone',     data.phone, true);
  kv('Email',     data.email, false);
  if (data.address) kv('Address', data.address, true);

  // Travelers
  section('Travelers');
  data.travelers.forEach((name, i) => {
    const h = 8;
    ensureSpace(h);
    fill(i % 2 === 0 ? P.white : P.altRow);
    draw(P.border); doc.setLineWidth(0.15);
    doc.rect(ML, y, CW, h, 'FD');
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(P.charcoal);
    doc.text(`${i + 1}.  ${name}`, ML + 3, y + 5.5);
    y += h;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // PAGE 2  ·  Hotel Accommodation
  // ═══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage(); paintPageBg();
  y = drawHeader(true);

  section('Hotel Accommodation');

  const drawHotel = (city: string, h: HotelDetails) => {
    cityLabel(city);
    kv('Hotel Name',  h.name,              false);
    kv('Check-in',    fmt(h.checkIn),      true);
    kv('Check-out',   fmt(h.checkOut),     false);
    kv('Room Type',   h.roomType,          true);
    kv('Meals',       h.meal,              false);
    if (h.address) kv('Address', h.address, true);
    if (h.phone)   kv('Phone',   h.phone,   false);
    if (h.email)   kv('Email',   h.email,   true);
    y += 3;
  };

  drawHotel('Medina', data.hotelMedina);
  drawHotel('Mecca',  data.hotelMecca);

  section('Transportation');
  fill(P.white); draw(P.border); doc.setLineWidth(0.15);
  const transLines = doc.splitTextToSize(
    'Package Transportation is available within Saudi Arabia for airport pickup and drop-off, and Ziyarat (Holy Sites) in both Medina and Mecca.',
    CW - 10,
  );
  const transH = transLines.length * 4.8 + 8;
  doc.roundedRect(ML, y, CW, transH, 2, 2, 'FD');
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(P.gray);
  doc.text(transLines, ML + 5, y + 6);
  y += transH + 2;

  // ═══════════════════════════════════════════════════════════════════════════════
  // PAGE 3  ·  Services / Payment
  // ═══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage(); paintPageBg();
  y = drawHeader(true);

  section('Package Includes');
  const services = [
    '5-Star Transportation within Saudi Arabia',
    'Half-Board Meals (Breakfast & Dinner)',
    '5-Star Renowned Hotels',
    'Saudi Visa Application (USA, Canada & EU included)',
    'Religious Lectures',
  ];
  services.forEach((s, i) => bullet(s, i % 2 === 1));

  section('Payment Summary');
  const balance = data.grandTotal - data.depositAmount;
  const bW = CW / 4;
  const bH = 22;
  ensureSpace(bH + 4);

  const summaryBoxes = [
    { label: 'Total Price',      value: usd(data.grandTotal),     vc: P.charcoal },
    { label: 'Amount Paid',      value: usd(data.depositAmount),  vc: P.green    },
    { label: 'Balance Due',      value: usd(balance),             vc: P.charcoal },
    { label: 'Balance Due Date', value: fmtS(data.balanceDueDate),vc: P.charcoal },
  ] as const;

  summaryBoxes.forEach(({ label, value, vc }, i) => {
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

  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  color(P.charcoal);
  doc.text('Payment Method: ', ML, y);
  color(P.gray);
  doc.text(payLabel(data.paymentMethod), ML + doc.getTextWidth('Payment Method: '), y);
  y += 5;
  const cancelTxt = doc.splitTextToSize(
    'Failure to complete the balance by the due date may result in cancellation per our refund policy.',
    CW,
  );
  doc.setFontSize(7.5); color(P.gray);
  doc.text(cancelTxt, ML, y);
  y += cancelTxt.length * 4.5 + 5;

  // Notes
  if (data.notes) {
    ensureSpace(24);
    const noteLines = doc.splitTextToSize(data.notes, CW - 10);
    const noteH = noteLines.length * 4.8 + 10;
    fill(P.white); draw(P.border); doc.setLineWidth(0.2);
    doc.roundedRect(ML, y, CW, noteH, 2, 2, 'FD');
    fill(P.gold); doc.rect(ML, y, 2, noteH, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    color(P.charcoal);
    doc.text('Notes', ML + 6, y + 7);
    doc.setFont('helvetica', 'normal'); color(P.gray);
    doc.text(noteLines, ML + 6, y + 12);
    y += noteH + 4;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PAGE 4  ·  Sign-off
  // ═══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage(); paintPageBg();
  y = drawHeader(true);

  y += 12;
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(P.gray);
  const signOff = doc.splitTextToSize(
    "If you have any inquiries or require assistance before your trip, please feel free to contact us. " +
    "We're looking forward to providing you with an unforgettable spiritual experience.",
    CW,
  );
  doc.text(signOff, ML, y);
  y += signOff.length * 4.8 + 7;

  draw(P.border); doc.setLineWidth(0.2);
  doc.line(ML, y, W - MR, y);
  y += 7;

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
export async function generateRegistrationConfirmationPDFBytes(
  data: RegistrationConfirmationData,
): Promise<Uint8Array> {
  const doc = await buildPDF(data);
  return new Uint8Array(doc.output('arraybuffer'));
}
