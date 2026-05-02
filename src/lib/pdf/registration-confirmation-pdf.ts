/**
 * Marefat Pilgrimage — Registration Confirmation PDF
 *
 * Issued by the admin after deposit is confirmed.
 * Contains full booking details including hotel assignments.
 *
 * Design system (matches booking-pdf.ts):
 *   Background  White / Cream (#FAFAF7) alternating
 *   Gold        #CCAB6B — accents, rules, headings
 *   Charcoal    #1D1D1B — primary text
 *   Mist        #6B6B69 — labels / secondary
 *   Feather     #E8E3D8 — borders, dividers
 *   Dark footer #161614
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

const ML = 20;
const MR = 20;
const FOOTER_H = 18;

// ─── Public types ───────────────────────────────────────────────────────────────
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

// ─── Formatters ─────────────────────────────────────────────────────────────────
const fmtDate = (d: string): string => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return d; }
};
const fmtShortDate = (d: string): string => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return d; }
};
const payLabel = (m: string): string =>
  m === 'zelle' ? 'Zelle' : m === 'wire' ? 'Bank Wire Transfer' : m === 'card' ? 'Credit Card' : m;
const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

// ─── Main builder ────────────────────────────────────────────────────────────────
async function buildPDF(data: RegistrationConfirmationData): Promise<jsPDF> {
  const logoB64 = await getHorizontalLogoBase64();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W  = doc.internal.pageSize.getWidth();
  const H  = doc.internal.pageSize.getHeight();
  const CW = W - ML - MR;

  const safeBottom = H - FOOTER_H - 8;
  let y = 0;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const fill  = (c: [number,number,number]) => doc.setFillColor(c[0], c[1], c[2]);
  const draw  = (c: [number,number,number]) => doc.setDrawColor(c[0], c[1], c[2]);
  const color = (c: [number,number,number]) => doc.setTextColor(c[0], c[1], c[2]);

  const hairline = (x1: number, yy: number, x2: number, cl: [number,number,number], lw = 0.2) => {
    draw(cl); doc.setLineWidth(lw);
    doc.line(x1, yy, x2, yy);
  };

  const ensureSpace = (need: number) => {
    if (y + need > safeBottom) {
      addFooter();
      doc.addPage();
      y = drawHeader(true);
    }
  };

  // ── Footer ────────────────────────────────────────────────────────────────────
  const addFooter = () => {
    const fy = H - FOOTER_H;
    fill(T.darkBg); doc.rect(0, fy, W, FOOTER_H, 'F');

    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(T.mist);
    doc.text('Ahmad Reshad Tajik  ·  +1 (954) 330-8904  ·  info@marefatpilgrimage.com', ML, fy + 7);

    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    color(T.gold);
    doc.text('www.marefatpilgrimage.com', W - MR, fy + 7, { align: 'right' });

    doc.setFontSize(6); doc.setFont('helvetica', 'normal');
    color([80, 80, 78]);
    doc.text(
      `Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
      W / 2, fy + 13.5, { align: 'center' },
    );
  };

  // ── Header ────────────────────────────────────────────────────────────────────
  const drawHeader = (small = false): number => {
    if (logoB64) {
      const logoW = small ? 46 : 62;
      const logoH = logoW / 2.860;  // 1024×358 px
      const lx    = small ? W - MR - logoW : W / 2 - logoW / 2;
      doc.addImage(logoB64, 'JPEG', lx, small ? 8 : 10, logoW, logoH);
    } else {
      doc.setFontSize(small ? 12 : 18); doc.setFont('helvetica', 'bold');
      color(T.charcoal);
      doc.text('MAREFAT', W / 2, small ? 20 : 24, { align: 'center' });
      doc.setFontSize(small ? 7 : 9); doc.setFont('helvetica', 'normal');
      color(T.mist);
      doc.text('Pilgrimage', W / 2, small ? 25 : 30, { align: 'center' });
    }
    const ruleY = small ? 22 : 30;
    fill(T.gold); doc.rect(0, ruleY, W, 0.8, 'F');
    return ruleY + 7;
  };

  // ── Section heading ──────────────────────────────────────────────────────────
  const sectionHeading = (label: string) => {
    ensureSpace(14);
    y += 5;
    doc.setFontSize(7); doc.setFont('helvetica', 'bold');
    color(T.gold);
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

  // ── Two-column kv row ────────────────────────────────────────────────────────
  const kvRow = (key: string, value: string, shade = false) => {
    const rowH = 9;
    const keyW = 50;
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

  // ── City sub-heading for hotels ──────────────────────────────────────────────
  const cityHeading = (label: string) => {
    ensureSpace(10);
    y += 3;
    doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    color(T.charcoal);
    doc.text(label, ML, y);
    y += 2;
    hairline(ML, y, ML + 40, T.gold, 0.5);
    y += 5;
  };

  // ── Bordered data card (for hotel rows) ──────────────────────────────────────
  const hotelKvRow = (key: string, value: string, shade = false) => {
    const rowH = 8.5;
    ensureSpace(rowH);
    if (shade) { fill(T.cream); doc.rect(ML, y, CW, rowH, 'F'); }
    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    color(T.mist);
    doc.text(key, ML + 2, y + 5.5);
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(T.charcoal);
    const w = doc.splitTextToSize(value || '—', CW - 55);
    doc.text(w[0], ML + 52, y + 5.5);
    y += rowH;
  };

  // ── Bullet point ─────────────────────────────────────────────────────────────
  const bulletRow = (text: string, shade = false) => {
    const rowH = 7;
    ensureSpace(rowH);
    if (shade) { fill(T.cream); doc.rect(ML, y, CW, rowH, 'F'); }
    fill(T.gold); doc.circle(ML + 2, y + 2.5, 0.8, 'F');
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(T.charcoal);
    doc.text(text, ML + 6, y + 4.5);
    y += rowH;
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 1  ·  Header → Title → Booker → Travelers
  // ══════════════════════════════════════════════════════════════════════════════
  y = drawHeader(false);

  // Title
  y += 4;
  doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
  color(T.gold);
  doc.text('REGISTRATION CONFIRMATION', W / 2, y, { align: 'center', charSpace: 1.2 });
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

  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(T.mist);
  const thankYou = doc.splitTextToSize(
    "Thank you for entrusting us to accompany you on this blessed journey. We're honored to guide you, and we pray to share in your spiritual rewards and blessings.",
    CW,
  );
  doc.text(thankYou, ML, y);
  y += thankYou.length * 4.8 + 6;

  // ── Booker Details ────────────────────────────────────────────────────────────
  sectionHeading('Booker Details');
  kvRow('Full Name',       `${data.firstName} ${data.lastName}`, false);
  kvRow('Phone',           data.phone,                           true);
  kvRow('Email',           data.email,                           false);
  if (data.address) {
    kvRow('Address', data.address, true);
  }
  y += 2;

  // ── Travelers ─────────────────────────────────────────────────────────────────
  sectionHeading('Travelers');
  data.travelers.forEach((name, i) => {
    const rowH = 8;
    ensureSpace(rowH);
    if (i % 2 === 1) { fill(T.cream); doc.rect(ML, y, CW, rowH, 'F'); }
    doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
    color(T.charcoal);
    doc.text(`${i + 1}.  ${name}`, ML + 2, y + 5.5);
    y += rowH;
  });

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 2  ·  Hotels
  // ══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage();
  y = drawHeader(true);

  sectionHeading('Hotel Accommodation');

  const drawHotel = (city: string, h: HotelDetails) => {
    cityHeading(city);
    hotelKvRow('Hotel Name',    h.name,                   false);
    hotelKvRow('Check-in',      fmtDate(h.checkIn),       true);
    hotelKvRow('Check-out',     fmtDate(h.checkOut),      false);
    hotelKvRow('Room Type',     h.roomType,               true);
    hotelKvRow('Meals',         h.meal,                   false);
    if (h.address) hotelKvRow('Address', h.address, true);
    if (h.phone)   hotelKvRow('Phone',   h.phone,   false);
    if (h.email)   hotelKvRow('Email',   h.email,   true);
    y += 4;
  };

  drawHotel('Medina', data.hotelMedina);
  drawHotel('Mecca',  data.hotelMecca);

  // ── Transportation ────────────────────────────────────────────────────────────
  sectionHeading('Transportation');
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  color(T.mist);
  const transLines = doc.splitTextToSize(
    'Package Transportation is available within Saudi Arabia for Airport pickup and drop off, and Ziyarat (Holy Sites) in both Medina and Mecca.',
    CW,
  );
  doc.text(transLines, ML, y);
  y += transLines.length * 4.8 + 4;

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 3  ·  Other Services → Payment Summary → Notes
  // ══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage();
  y = drawHeader(true);

  // ── Package includes ──────────────────────────────────────────────────────────
  sectionHeading('Package Includes');

  const services = [
    '5-Star Transportation within Saudi Arabia',
    'Half-Board Meals (Breakfast & Dinner)',
    '5-Star Renowned Hotels',
    'Saudi Visa Application (USA, Canada & EU — included; other nationalities may vary)',
    'Religious Lectures',
  ];
  services.forEach((s, i) => bulletRow(s, i % 2 === 1));
  y += 6;

  // ── Payment summary ───────────────────────────────────────────────────────────
  sectionHeading('Payment Summary');

  const balance = data.grandTotal - data.depositAmount;
  const cellW   = CW / 4;
  const cellH   = 22;

  ensureSpace(cellH + 4);

  const boxes: { sub: string; val: string; vc: [number,number,number] }[] = [
    { sub: 'Total Package Price', val: usd(data.grandTotal),     vc: T.charcoal },
    { sub: 'Amount Paid',         val: usd(data.depositAmount),  vc: T.green    },
    { sub: 'Balance Due',         val: usd(balance),             vc: T.ink      },
    { sub: 'Balance Due Date',    val: fmtShortDate(data.balanceDueDate), vc: T.charcoal },
  ];

  boxes.forEach(({ sub, val, vc }, i) => {
    const cx = ML + i * cellW;
    fill(i % 2 === 1 ? T.cream : T.white);
    draw(T.feather); doc.setLineWidth(0.25);
    doc.rect(cx, y, cellW, cellH, 'FD');
    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
    color(T.mist);
    const subLines = doc.splitTextToSize(sub, cellW - 5);
    doc.text(subLines, cx + 3, y + 6);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    color(vc);
    doc.text(val, cx + 3, y + 17);
  });
  y += cellH + 7;

  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  color(T.charcoal);
  doc.text('Payment Method:', ML, y);
  doc.setFont('helvetica', 'normal');
  color(T.mist);
  doc.text(`  ${payLabel(data.paymentMethod)}`, ML + doc.getTextWidth('Payment Method:'), y);
  y += 6;

  doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
  color(T.mist);
  const cancelNote = doc.splitTextToSize(
    'Failure to complete the balance by the due date may result in cancellation. A cancellation fee applies per our refund policy.',
    CW,
  );
  doc.text(cancelNote, ML, y);
  y += cancelNote.length * 4.5 + 8;

  // ── Notes ─────────────────────────────────────────────────────────────────────
  if (data.notes) {
    ensureSpace(24);
    const noteLines = doc.splitTextToSize(data.notes, CW - 10);
    const noteH = noteLines.length * 5 + 14;
    fill(T.cream); draw(T.feather); doc.setLineWidth(0.25);
    doc.roundedRect(ML, y, CW, noteH, 1.5, 1.5, 'FD');
    fill(T.gold); doc.rect(ML, y, 2.5, noteH, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    color(T.charcoal);
    doc.text('Notes', ML + 6, y + 7);
    doc.setFont('helvetica', 'normal');
    color(T.mist);
    doc.text(noteLines, ML + 6, y + 13);
    y += noteH + 6;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 4  ·  Sign-off
  // ══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage();
  y = drawHeader(true);

  y += 12;
  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  color(T.mist);
  const signOff = doc.splitTextToSize(
    "If you have any inquiries or require assistance before your trip, please feel free to contact us. " +
    "We're looking forward to providing you with an unforgettable spiritual experience.",
    CW,
  );
  doc.text(signOff, ML, y);
  y += signOff.length * 5 + 8;

  hairline(ML, y, W - MR, T.feather);
  y += 8;

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
export async function generateRegistrationConfirmationPDFBytes(
  data: RegistrationConfirmationData,
): Promise<Uint8Array> {
  const doc = await buildPDF(data);
  return new Uint8Array(doc.output('arraybuffer'));
}
