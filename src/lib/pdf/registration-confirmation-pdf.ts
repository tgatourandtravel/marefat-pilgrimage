/**
 * Registration Confirmation PDF
 * Layout matches the 4-page Marefat Registration Confirmation template:
 *   Page 1 – Header / Booker Details / Travelers
 *   Page 2 – Hotel (Medina + Mecca) / Transportation
 *   Page 3 – Other Services / Payment Summary / Cancellation Policy
 *   Page 4 – Sign-off
 */

import jsPDF from 'jspdf';
import { getLogoBase64 } from './logo-loader';

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  white:     [255, 255, 255] as [number, number, number],
  ivory:     [247, 243, 235] as [number, number, number],
  border:    [220, 210, 190] as [number, number, number],
  gold:      [199, 165, 106] as [number, number, number],
  goldDark:  [160, 132,  85] as [number, number, number],
  charcoal:  [ 30,  30,  28] as [number, number, number],
  gray:      [ 85,  85,  85] as [number, number, number],
  lightGray: [140, 140, 140] as [number, number, number],
  green:     [ 22, 163,  74] as [number, number, number],
  footerBg:  [ 30,  30,  28] as [number, number, number],
};

// ─── Public types ────────────────────────────────────────────────────────────
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

// ─── Utilities ───────────────────────────────────────────────────────────────
const fmtDate = (d: string): string => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch { return d; }
};

const payLabel = (m: string): string =>
  m === 'zelle' ? 'Zelle' : m === 'wire' ? 'Bank Transfer' : 'Credit Card';

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

// ─── Main builder (async because logo loading is async) ──────────────────────
async function buildPDF(data: RegistrationConfirmationData): Promise<jsPDF> {
  const logoB64 = await getLogoBase64();

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297
  const ML = 16;   // left margin
  const MR = 16;   // right margin
  const CW = W - ML - MR;  // content width ≈ 178
  const FOOTER_H = 16;
  const SAFE_BOTTOM = H - FOOTER_H - 6;

  let y = 0;
  let pageNum = 1;

  // ── Color helpers ──────────────────────────────────────────────────────────
  const fill  = (c: [number,number,number]) => doc.setFillColor(c[0], c[1], c[2]);
  const draw  = (c: [number,number,number]) => doc.setDrawColor(c[0], c[1], c[2]);
  const color = (c: [number,number,number]) => doc.setTextColor(c[0], c[1], c[2]);

  // ── Footer ─────────────────────────────────────────────────────────────────
  const addFooter = () => {
    const fy = H - FOOTER_H;
    fill(C.footerBg);
    doc.rect(0, fy, W, FOOTER_H, 'F');

    // Left: contact info
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(C.lightGray);
    doc.text('Ahmad Reshad Tajik  ·  +1 (954) 330-8904  ·  info@marefatpilgrimage.com',
      ML, fy + 6.5);

    // Right: website (gold)
    doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    color(C.gold);
    doc.text('www.marefatpilgrimage.com', W - MR, fy + 6.5, { align: 'right' });

    // Bottom: generated date (centered)
    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
    color([100, 100, 100]);
    doc.text(
      `Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
      W / 2, fy + 12.5, { align: 'center' },
    );
  };

  // ── Page guard ─────────────────────────────────────────────────────────────
  const ensureSpace = (need: number) => {
    if (y + need > SAFE_BOTTOM) {
      addFooter();
      doc.addPage();
      pageNum++;
      y = addPageHeader();
    }
  };

  // ── Page header (logo + gold rule) ─────────────────────────────────────────
  // Returns the y position after the header
  const addPageHeader = (rightSide = false): number => {
    const logoW = 28;
    const logoH = 28;

    if (logoB64) {
      if (rightSide) {
        // Pages 2, 3, 4 – logo small top-right
        doc.addImage(logoB64, 'PNG', W - MR - logoW, 6, logoW, logoH);
      } else {
        // Page 1 – logo top-left
        doc.addImage(logoB64, 'PNG', ML, 6, logoW, logoH);
        // Brand text next to logo
        doc.setFontSize(14); doc.setFont('helvetica', 'bold');
        color(C.charcoal);
        doc.text('MAREFAT', ML + logoW + 4, 16);
        doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
        color(C.lightGray);
        doc.text('Pilgrimage', ML + logoW + 4, 22);
      }
    } else {
      // Fallback: text-only brand mark
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

    // Gold horizontal rule
    const ruleY = 36;
    fill(C.gold);
    doc.rect(0, ruleY, W, 1.2, 'F');

    return ruleY + 6;
  };

  // ── Section heading ─────────────────────────────────────────────────────────
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

  // ── Bordered table rows ─────────────────────────────────────────────────────
  // cols: array of { label, value, width } where width is in mm
  const tableRow = (cols: { label: string; value: string; width: number }[]) => {
    const rowH = 10;
    let x = ML;
    const labelW = 26;

    cols.forEach(({ label, value, width }) => {
      if (width === 0) { x += 0; return; }

      // Label cell (ivory bg)
      fill(C.ivory); draw(C.border); doc.setLineWidth(0.2);
      doc.rect(x, y, labelW, rowH, 'FD');
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      color(C.lightGray);
      doc.text(label, x + 2.5, y + 6.5);

      // Value cell (white bg)
      const vw = width - labelW;
      fill(C.white);
      doc.rect(x + labelW, y, vw, rowH, 'FD');
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
      color(C.charcoal);
      const vLines = doc.splitTextToSize(value || '—', vw - 4);
      doc.text(vLines[0], x + labelW + 3, y + 6.5);

      x += width;
    });

    y += rowH;
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 1 – Header / Booking info / Booker / Travelers
  // ══════════════════════════════════════════════════════════════════════════════
  y = addPageHeader(false);

  // Title block (right of logo on page 1)
  doc.setFontSize(20); doc.setFont('helvetica', 'bold');
  color(C.gold);
  doc.text('Registration Confirmation', W / 2, y + 4, { align: 'center' });
  y += 10;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  color(C.gray);
  doc.text('Umrah Pilgrimage Package', W / 2, y, { align: 'center' });
  y += 10;

  // Booking ref line
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text(`Booking Confirmation: ${data.tourTitle} — Ref. ${data.bookingRef}`, ML, y);
  y += 6;

  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  color(C.gray);
  doc.text('Booking Pre-confirmation:', ML, y);
  y += 8;

  // ── Booker Details ──────────────────────────────────────────────────────────
  sectionHeading('Booker Details:');

  const third = CW / 3;
  const half  = CW / 2;

  // Row 1: Full Name | Address | City/State/Zip
  tableRow([
    { label: 'Full Name',       value: `${data.firstName} ${data.lastName}`, width: third },
    { label: 'Address',         value: data.address || '—',                   width: third },
    { label: 'City / State / Zip', value: '—',                               width: CW - third * 2 },
  ]);
  // Row 2: Phone | E-mail
  tableRow([
    { label: 'Phone',  value: data.phone, width: half },
    { label: 'E-mail', value: data.email, width: CW - half },
  ]);
  y += 4;

  // ── Thank you paragraph ──────────────────────────────────────────────────────
  ensureSpace(18);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  color(C.gray);
  const thankYou = doc.splitTextToSize(
    "Thank you for entrusting us to accompany you on this blessed journey. We're honored to guide you, and we pray to share in your spiritual rewards and blessings.",
    CW,
  );
  doc.text(thankYou, ML, y);
  y += thankYou.length * 5 + 6;

  // ── Travelers ────────────────────────────────────────────────────────────────
  sectionHeading('Travelers:');

  const colW = CW / 2;
  for (let i = 0; i < data.travelers.length; i += 2) {
    ensureSpace(7);
    doc.setFontSize(9.5); doc.setFont('helvetica', 'normal');
    color(C.charcoal);
    doc.text(`${i + 1}.  ${data.travelers[i]}`, ML, y);
    if (data.travelers[i + 1]) {
      doc.text(`${i + 2}.  ${data.travelers[i + 1]}`, ML + colW, y);
    }
    y += 6;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 2 – Hotels / Transportation
  // ══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage(); pageNum++;
  y = addPageHeader(true);

  sectionHeading('Hotel:');

  const drawHotel = (city: string, h: HotelDetails) => {
    ensureSpace(46);

    // City label in gold
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    color(C.gold);
    doc.text(city, ML, y);
    y += 5;

    const col3 = CW / 3;

    // Row 1: Name of Hotel | Checking Date/Time | Check out Date/Time
    tableRow([
      { label: 'Name of Hotel',       value: h.name,                   width: col3 },
      { label: 'Check-in Date/Time',  value: fmtDate(h.checkIn),       width: col3 },
      { label: 'Check-out Date/Time', value: fmtDate(h.checkOut),      width: CW - col3 * 2 },
    ]);
    // Row 2: Address | Phone | E-mail
    tableRow([
      { label: 'Address', value: h.address || '—', width: col3 },
      { label: 'Phone',   value: h.phone   || '—', width: col3 },
      { label: 'E-mail',  value: h.email   || '—', width: CW - col3 * 2 },
    ]);
    // Row 3: Meal | Type of Room
    tableRow([
      { label: 'Meal',        value: h.meal     || '—', width: half },
      { label: 'Type of Room (Quad, Triple, Double, Single)', value: h.roomType || '—', width: CW - half },
    ]);
    y += 5;
  };

  drawHotel('Medina', data.hotelMedina);
  drawHotel('Mecca',  data.hotelMecca);

  // ── Transportation ──────────────────────────────────────────────────────────
  ensureSpace(18);
  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text('Transportation:', ML, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  color(C.gray);
  const transLines = doc.splitTextToSize(
    'Package Transportation is available within Saudi Arabia for Airport pickup and drop off. Mazonat (Holy Site) in Medina and Mecca.',
    CW,
  );
  doc.text(transLines, ML, y);
  y += transLines.length * 5 + 4;

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 3 – Other Services / Payment / Cancellation
  // ══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage(); pageNum++;
  y = addPageHeader(true);

  // ── Other Services ──────────────────────────────────────────────────────────
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

  // ── Payment Summary ──────────────────────────────────────────────────────────
  sectionHeading('Payment Summary:');

  const balance = data.grandTotal - data.depositAmount;
  const cellW   = CW / 4;
  const cellH   = 18;

  ensureSpace(cellH + 4);
  const summaryBoxes = [
    { label: 'Total Price',     value: usd(data.grandTotal),  color: C.charcoal },
    { label: 'Amount Paid',     value: usd(data.depositAmount), color: C.green },
    { label: 'Balance Due',     value: usd(balance),          color: C.charcoal },
    { label: 'Balance Due Date', value: fmtDate(data.balanceDueDate), color: C.charcoal },
  ];

  summaryBoxes.forEach(({ label, value, color: vc }, i) => {
    const cx = ML + i * cellW;
    fill(i % 2 === 0 ? C.ivory : C.white);
    draw(C.border); doc.setLineWidth(0.2);
    doc.rect(cx, y, cellW, cellH, 'FD');

    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    color(C.lightGray);
    doc.text(label, cx + 3, y + 6);

    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    color(vc);
    doc.text(value, cx + 3, y + 13);
  });
  y += cellH + 5;

  doc.setFontSize(9); doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text(`Payment Method: (${payLabel(data.paymentMethod)})`, ML, y);
  y += 6;

  doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
  color(C.gray);
  const cancelNote = doc.splitTextToSize(
    'Please note failure of payment by Due Date may result the cancellation with applied cancellation fee according to our refund policy.',
    CW,
  );
  doc.text(cancelNote, ML, y);
  y += cancelNote.length * 5 + 6;

  // ── Cancellation Policy ──────────────────────────────────────────────────────
  sectionHeading('Cancellation Policy:');
  // (empty in the template — admin fills this in manually after printing)

  // ── Optional notes ───────────────────────────────────────────────────────────
  if (data.notes) {
    ensureSpace(20);
    fill([255, 249, 238]); draw(C.border); doc.setLineWidth(0.2);
    const noteLines = doc.splitTextToSize(data.notes, CW - 10);
    const noteH = noteLines.length * 5 + 10;
    doc.roundedRect(ML, y, CW, noteH, 2, 2, 'FD');
    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
    color(C.charcoal);
    doc.text('Notes:', ML + 4, y + 7);
    doc.setFont('helvetica', 'normal');
    color(C.gray);
    doc.text(noteLines, ML + 4, y + 13);
    y += noteH + 4;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 4 – Sign-off
  // ══════════════════════════════════════════════════════════════════════════════
  addFooter();
  doc.addPage(); pageNum++;
  y = addPageHeader(true);

  y += 10;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  color(C.gray);
  const signOff = doc.splitTextToSize(
    "If you have any inquiries or require assistance before your trip, please feel free to contact us. We're looking forward to providing you with an unforgettable experience.",
    CW,
  );
  doc.text(signOff, ML, y);
  y += signOff.length * 5.5 + 4;

  doc.setFontSize(10);
  color(C.gray);
  doc.text('Respectfully', ML, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  color(C.charcoal);
  doc.text('Marefat Pilgrimage Team', ML, y);

  // Footer on last page
  addFooter();

  return doc;
}

// ─── Public exports ───────────────────────────────────────────────────────────
export async function generateRegistrationConfirmationPDFBytes(
  data: RegistrationConfirmationData,
): Promise<Uint8Array> {
  const doc = await buildPDF(data);
  return new Uint8Array(doc.output('arraybuffer'));
}
