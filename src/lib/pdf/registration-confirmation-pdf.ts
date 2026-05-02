/**
 * Registration Confirmation PDF
 * Sent to customer after admin confirms the booking.
 * Design matches the Marefat Registration Confirmation template.
 */

import jsPDF from 'jspdf';

const COLORS = {
  ivory: '#f7f3eb',
  charcoal: '#151515',
  gold: '#c7a56a',
  goldDark: '#a0844f',
  gray: '#555555',
  lightGray: '#888888',
  border: [229, 220, 200] as [number, number, number],
  goldRGB: [199, 165, 106] as [number, number, number],
  charcoalRGB: [21, 21, 21] as [number, number, number],
  ivoryRGB: [247, 243, 235] as [number, number, number],
  grayRGB: [85, 85, 85] as [number, number, number],
  lightGrayRGB: [136, 136, 136] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  greenRGB: [22, 163, 74] as [number, number, number],
};

export interface HotelDetails {
  name: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  meal: string;
  address?: string;
}

export interface RegistrationConfirmationData {
  bookingRef: string;
  tourTitle: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  grandTotal: number;
  depositAmount: number;
  paymentMethod: string;
  balanceDueDate: string;
  travelers: string[];
  hotelMedina: HotelDetails;
  hotelMecca: HotelDetails;
  notes?: string;
}

const formatDate = (d: string): string => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return d;
  }
};

const methodLabel = (m: string): string => {
  if (m === 'zelle') return 'Zelle';
  if (m === 'wire') return 'Bank Transfer';
  return 'Credit Card';
};

function buildRegistrationConfirmationPDF(data: RegistrationConfirmationData): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const footerHeight = 18;
  const safeBottom = pageHeight - footerHeight - 8;

  const needsPage = (space: number) => {
    if (y + space > safeBottom) {
      addFooter();
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // ── Helpers ──────────────────────────────────────────────

  const setColor = (rgb: [number, number, number]) =>
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);

  const setFill = (rgb: [number, number, number]) =>
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);

  const setDraw = (rgb: [number, number, number]) =>
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);

  const sectionTitle = (label: string) => {
    needsPage(14);
    y += 5;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    setColor(COLORS.lightGrayRGB);
    doc.text(label.toUpperCase(), margin, y);
    y += 1;
    setDraw(COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1, pageWidth - margin, y + 1);
    y += 6;
  };

  const tableRow = (
    labels: string[],
    values: string[],
    colWidths: number[],
    isLast: boolean
  ) => {
    const rowH = 10;
    const x0 = margin;
    let x = x0;

    // Row background for label cells
    labels.forEach((label, i) => {
      const lw = 30;
      const vw = colWidths[i] - lw;

      setFill(COLORS.ivoryRGB);
      doc.rect(x, y, lw, rowH, 'F');
      setFill(COLORS.white);
      doc.rect(x + lw, y, vw, rowH, 'F');

      // Border
      setDraw(COLORS.border);
      doc.setLineWidth(0.2);
      doc.rect(x, y, colWidths[i], rowH, 'D');

      // Label
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      setColor(COLORS.lightGrayRGB);
      doc.text(label, x + 3, y + 6.5);

      // Value
      doc.setFont('helvetica', 'normal');
      setColor(COLORS.charcoalRGB);
      const vText = doc.splitTextToSize(values[i] || '—', vw - 4);
      doc.text(vText[0], x + lw + 3, y + 6.5);

      x += colWidths[i];
    });

    if (!isLast) {
      // bottom line already drawn by rect
    }

    y += rowH;
  };

  // ── Footer (drawn on current page) ───────────────────────
  const addFooter = () => {
    const fy = pageHeight - footerHeight;
    setFill(COLORS.charcoalRGB);
    doc.rect(0, fy, pageWidth, footerHeight, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(COLORS.goldRGB);
    doc.text('www.marefatpilgrimage.com', margin, fy + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setColor([160, 160, 160]);
    doc.text(
      'Ahmad Reshad Tajik  |  +1 (954) 330-8904  |  info@marefatpilgrimage.com',
      pageWidth - margin,
      fy + 7,
      { align: 'right' }
    );

    doc.setFontSize(7);
    setColor([120, 120, 120]);
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`,
      pageWidth / 2,
      fy + 13,
      { align: 'center' }
    );
  };

  // ══════════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════════
  // White header area with gold bottom border
  setFill(COLORS.white);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold accent line at bottom of header
  setFill(COLORS.goldRGB);
  doc.rect(0, 36, pageWidth, 2, 'F');

  // Logo mark (gold circle with ✦)
  setFill(COLORS.goldRGB);
  doc.circle(margin + 7, 15, 7, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  setColor(COLORS.white);
  doc.text('M', margin + 4.5, 17.5);

  // Company name
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  setColor(COLORS.charcoalRGB);
  doc.text('MAREFAT', margin + 17, 13);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  setColor(COLORS.lightGrayRGB);
  doc.text('Pilgrimage', margin + 17, 19);

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  setColor(COLORS.goldRGB);
  doc.text('Registration Confirmation', margin + 17, 30);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(COLORS.grayRGB);
  doc.text(data.tourTitle, margin + 17, 35.5);

  // Booking Ref (top-right)
  doc.setFontSize(7);
  setColor(COLORS.lightGrayRGB);
  doc.text('BOOKING REFERENCE', pageWidth - margin, 13, { align: 'right' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  setColor(COLORS.charcoalRGB);
  doc.text(data.bookingRef, pageWidth - margin, 23, { align: 'right' });

  y = 46;

  // ══════════════════════════════════════════════════════════
  // BOOKER DETAILS
  // ══════════════════════════════════════════════════════════
  sectionTitle('Booker Details');

  const half = contentWidth / 2;
  tableRow(['Full Name', 'E-mail'], [`${data.firstName} ${data.lastName}`, data.email], [half, half], false);
  tableRow(['Phone', ''], [data.phone, ''], [contentWidth, 0], true);
  y += 2;

  // ══════════════════════════════════════════════════════════
  // THANK YOU
  // ══════════════════════════════════════════════════════════
  needsPage(16);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  setColor(COLORS.grayRGB);
  const thankYou =
    'Thank you for entrusting us to accompany you on this blessed journey. We\'re honored to guide you, and we pray to share in your spiritual rewards and blessings.';
  const wrapped = doc.splitTextToSize(thankYou, contentWidth);
  doc.text(wrapped, margin, y);
  y += wrapped.length * 5 + 4;

  // ══════════════════════════════════════════════════════════
  // TRAVELERS
  // ══════════════════════════════════════════════════════════
  sectionTitle('Travelers');

  const colW = contentWidth / 2;
  for (let i = 0; i < data.travelers.length; i += 2) {
    needsPage(7);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    setColor(COLORS.charcoalRGB);
    doc.text(`${i + 1}. ${data.travelers[i]}`, margin, y);
    if (data.travelers[i + 1]) {
      doc.text(`${i + 2}. ${data.travelers[i + 1]}`, margin + colW, y);
    }
    y += 6;
  }
  y += 2;

  // ══════════════════════════════════════════════════════════
  // HOTELS
  // ══════════════════════════════════════════════════════════
  sectionTitle('Hotel');

  const drawHotel = (city: string, hotel: HotelDetails) => {
    needsPage(40);

    // City label
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    setColor(COLORS.goldRGB);
    doc.text(city, margin, y);
    y += 5;

    const h1 = contentWidth / 2;
    tableRow(['Name of Hotel', 'Check-in'], [hotel.name, formatDate(hotel.checkIn)], [h1, h1], false);
    tableRow(['Address', 'Check-out'], [hotel.address || '—', formatDate(hotel.checkOut)], [h1, h1], false);
    tableRow(['Meal', 'Room Type'], [hotel.meal || '—', hotel.roomType || '—'], [h1, h1], true);
    y += 4;
  };

  drawHotel('Medina', data.hotelMedina);
  drawHotel('Mecca', data.hotelMecca);

  // ── Transportation info ───────────────────────────────────
  needsPage(18);
  setFill(COLORS.ivoryRGB);
  setDraw(COLORS.border);
  doc.setLineWidth(0.2);
  const transText = 'Transportation: Package transportation is available within Saudi Arabia for airport pickup and drop-off. Mazonat (Holy Site) in Medina and Mecca.';
  const transWrapped = doc.splitTextToSize(transText, contentWidth - 8);
  const transH = transWrapped.length * 5 + 8;
  doc.roundedRect(margin, y, contentWidth, transH, 2, 2, 'FD');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  setColor(COLORS.charcoalRGB);
  doc.text('Transportation:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  setColor(COLORS.grayRGB);
  const transBody = doc.splitTextToSize(
    'Package transportation is available within Saudi Arabia for airport pickup and drop-off. Mazonat (Holy Site) in Medina and Mecca.',
    contentWidth - 40
  );
  doc.text(transBody, margin + 33, y + 6);
  y += transH + 4;

  // ══════════════════════════════════════════════════════════
  // OTHER SERVICES
  // ══════════════════════════════════════════════════════════
  sectionTitle('Other Services');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(COLORS.charcoalRGB);
  doc.text('Saudi Visa Application.', margin, y);
  y += 5;
  setColor(COLORS.grayRGB);
  const visaText = doc.splitTextToSize(
    'Please note that visa fee for the nationalities of the USA, Canada, and European Union is included in the package price. For other nationalities, extra visa fee may apply.',
    contentWidth
  );
  doc.text(visaText, margin, y);
  y += visaText.length * 5 + 2;

  // ══════════════════════════════════════════════════════════
  // PAYMENT SUMMARY
  // ══════════════════════════════════════════════════════════
  sectionTitle('Payment Summary');

  const balanceDue = data.grandTotal - data.depositAmount;
  const q = contentWidth / 4;

  // Payment grid — 4 columns
  needsPage(12);
  const cells = [
    { label: 'Total Price', value: `USD $${data.grandTotal.toLocaleString()}`, color: COLORS.charcoalRGB as [number,number,number] },
    { label: 'Amount Paid', value: `USD $${data.depositAmount.toLocaleString()}`, color: COLORS.greenRGB as [number,number,number] },
    { label: 'Balance Due', value: `USD $${balanceDue.toLocaleString()}`, color: COLORS.charcoalRGB as [number,number,number] },
    { label: 'Balance Due Date', value: formatDate(data.balanceDueDate), color: COLORS.charcoalRGB as [number,number,number] },
  ];

  cells.forEach((cell, i) => {
    const cx = margin + i * q;
    setFill(i % 2 === 0 ? COLORS.ivoryRGB : COLORS.white);
    setDraw(COLORS.border);
    doc.setLineWidth(0.2);
    doc.rect(cx, y, q, 14, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    setColor(COLORS.lightGrayRGB);
    doc.text(cell.label, cx + 3, y + 5.5);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    setColor(cell.color);
    doc.text(cell.value, cx + 3, y + 11);
  });

  y += 17;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(COLORS.charcoalRGB);
  doc.text(`Payment Method: ${methodLabel(data.paymentMethod)}`, margin, y);
  y += 5;

  doc.setFontSize(8);
  setColor(COLORS.lightGrayRGB);
  const cancelText = doc.splitTextToSize(
    'Please note that failure of payment by the due date may result in cancellation with an applied cancellation fee according to our refund policy.',
    contentWidth
  );
  doc.text(cancelText, margin, y);
  y += cancelText.length * 4.5 + 3;

  // ── Notes (optional) ─────────────────────────────────────
  if (data.notes) {
    needsPage(18);
    setFill([255, 249, 238]);
    setDraw(COLORS.border);
    doc.setLineWidth(0.2);
    const noteWrapped = doc.splitTextToSize(data.notes, contentWidth - 8);
    const noteH = noteWrapped.length * 5 + 10;
    doc.roundedRect(margin, y, contentWidth, noteH, 2, 2, 'FD');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    setColor(COLORS.charcoalRGB);
    doc.text('Notes: ', margin + 4, y + 7);
    doc.setFont('helvetica', 'normal');
    setColor(COLORS.grayRGB);
    doc.text(noteWrapped, margin + 18, y + 7);
    y += noteH + 4;
  }

  // ══════════════════════════════════════════════════════════
  // SIGN-OFF
  // ══════════════════════════════════════════════════════════
  needsPage(28);
  y += 4;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  setColor(COLORS.grayRGB);
  const signOffText = doc.splitTextToSize(
    'If you have any inquiries or require assistance before your trip, please feel free to contact us. We\'re looking forward to providing you with an unforgettable experience.',
    contentWidth
  );
  doc.text(signOffText, margin, y);
  y += signOffText.length * 5 + 3;
  doc.text('Respectfully,', margin, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  setColor(COLORS.charcoalRGB);
  doc.text('Marefat Pilgrimage Team', margin, y);

  // ── Footer on last page ───────────────────────────────────
  addFooter();

  return doc;
}

export function generateRegistrationConfirmationPDFBytes(
  data: RegistrationConfirmationData
): Uint8Array {
  const doc = buildRegistrationConfirmationPDF(data);
  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}