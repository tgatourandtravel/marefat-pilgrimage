import jsPDF from 'jspdf';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { COMPANY_ADDRESS_LINES } from '@/lib/company-address';

const COLORS = {
  charcoal: [21, 21, 21] as [number, number, number],
  gold: [199, 165, 106] as [number, number, number],
  softBg: [247, 243, 235] as [number, number, number],
  border: [229, 220, 200] as [number, number, number],
  gray: [85, 85, 85] as [number, number, number],
  lightGray: [130, 130, 130] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

type PaymentMethodType = 'wire' | 'zelle' | 'card' | 'crypto' | string;

export interface TravelerDetails {
  fullName: string;
  nationality?: string;
  passportNumber?: string;
  dateOfBirth?: string;
  roomType?: string;
}

export interface HotelDetails {
  name: string;
  checkInDate?: string;
  checkInTime?: string;
  checkOutDate?: string;
  checkOutTime?: string;
  address?: string;
  phone?: string;
  email?: string;
  mealPlan?: string;
  roomType?: string;
}

export interface BookerDetails {
  fullName: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
}

export interface RegistrationConfirmationData {
  bookingRef: string;
  preConfirmationNumber?: string;
  groupName?: string;
  confirmationDate?: string;
  bookingStatus?: string;
  booker: BookerDetails;
  travelers: TravelerDetails[];
  hotelMedina: HotelDetails;
  hotelMecca: HotelDetails;
  totalPrice: number;
  amountPaid: number;
  currency: string;
  balanceDueDate: string;
  selectedPaymentMethod?: PaymentMethodType;
  cancellationPolicy?: string;
}

const TRANSPORT_TEXT =
  'Package transportation is available within Saudi Arabia, including airport pick-up and drop-off, as well as visits to holy sites in Medina and Mecca.';
const VISA_NOTE =
  'Please note that the visa fee for nationals of the USA, Canada, and the European Union is included in the package price. For other nationalities, an additional visa fee may apply.';
const PAYMENT_NOTE =
  'Please note that failure to complete payment by the due date may result in cancellation of the booking, and cancellation fees may apply according to our refund policy.';
const DEFAULT_CANCELLATION_TEXT =
  'Cancellation fees may apply according to the refund policy and the date of cancellation. Please contact Marefat Pilgrimage for detailed cancellation terms.';
const CLOSING_TEXT =
  'If you have any inquiries or require assistance before your trip, please feel free to contact us. We look forward to providing you with an unforgettable experience.';

const setTextColor = (doc: jsPDF, rgb: [number, number, number]) => doc.setTextColor(...rgb);
const setFillColor = (doc: jsPDF, rgb: [number, number, number]) => doc.setFillColor(...rgb);
const setDrawColor = (doc: jsPDF, rgb: [number, number, number]) => doc.setDrawColor(...rgb);
let cachedHeaderLogoDataUrl: string | null | undefined;

const getHeaderLogoDataUrl = (): string | undefined => {
  if (cachedHeaderLogoDataUrl !== undefined) {
    return cachedHeaderLogoDataUrl || undefined;
  }

  try {
    const logoPath = path.join(process.cwd(), 'public', 'branding', 'marefat-logo-full.png');
    const pngBuffer = readFileSync(logoPath);
    cachedHeaderLogoDataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;
    return cachedHeaderLogoDataUrl;
  } catch {
    cachedHeaderLogoDataUrl = null;
    return undefined;
  }
};

const valueOrDash = (value?: string | number | null): string => {
  if (value === null || value === undefined) return '—';
  const text = String(value).trim();
  return text.length ? text : '—';
};

const formatDate = (value?: string): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return valueOrDash(value);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatCurrency = (currency: string, amount: number): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
};

const paymentMethodLabel = (method?: PaymentMethodType): string => {
  if (!method) return '—';
  if (method === 'wire') return 'Bank Transfer';
  if (method === 'zelle') return 'Zelle';
  if (method === 'card') return 'Card';
  if (method === 'crypto') return 'Crypto';
  return method.toUpperCase();
};

function buildRegistrationConfirmationPDF(data: RegistrationConfirmationData): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const footerHeight = 32;
  const safeBottom = pageHeight - footerHeight - 10;
  let y = margin;

  const rows = (items: Array<[string, string]>) => items.map(([k, v]) => `${k}: ${v}`);

  const ensureSpace = (space: number) => {
    if (y + space <= safeBottom) return;
    drawFooter();
    doc.addPage();
    y = margin;
  };

  const section = (title: string) => {
    ensureSpace(14);
    setTextColor(doc, COLORS.lightGray);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    setDrawColor(doc, COLORS.border);
    doc.setLineWidth(0.25);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  const drawKeyValueRows = (items: Array<[string, string]>, columns = 2) => {
    const colWidth = contentWidth / columns;
    const labelToValueGap = 3.8;
    const valueLineHeight = 3.9;
    const rowBottomPadding = 2.2;

    for (let i = 0; i < items.length; i += columns) {
      const rowItems = items.slice(i, i + columns);
      const lineCounts = rowItems.map(([, value]) => {
        const wrapped = doc.splitTextToSize(valueOrDash(value), colWidth - 3);
        return Array.isArray(wrapped) ? wrapped.length : 1;
      });
      const maxLines = Math.max(...lineCounts, 1);
      const rowHeight = labelToValueGap + maxLines * valueLineHeight + rowBottomPadding;
      ensureSpace(rowHeight + 0.8);

      for (let c = 0; c < columns; c += 1) {
        const item = items[i + c];
        if (!item) continue;
        const x = margin + c * colWidth;
        const [label, value] = item;
        setTextColor(doc, COLORS.lightGray);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(label, x, y);
        setTextColor(doc, COLORS.charcoal);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        const valueLines = doc.splitTextToSize(valueOrDash(value), colWidth - 3);
        doc.text(valueLines, x, y + labelToValueGap);
      }
      y += rowHeight;
    }
  };

  const drawParagraph = (text: string) => {
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * 4.3 + 2);
    setTextColor(doc, COLORS.gray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.text(lines, margin, y);
    y += lines.length * 4.3 + 2;
  };

  const drawBoxParagraph = (heading: string, text: string) => {
    const bodyLines = doc.splitTextToSize(text, contentWidth - 8);
    const boxHeight = bodyLines.length * 4.2 + 9;
    ensureSpace(boxHeight + 2);
    setFillColor(doc, COLORS.softBg);
    setDrawColor(doc, COLORS.border);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');
    setTextColor(doc, COLORS.charcoal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.text(heading, margin + 4, y + 5.5);
    setTextColor(doc, COLORS.gray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.3);
    doc.text(bodyLines, margin + 4, y + 9.5);
    y += boxHeight + 2;
  };

  const drawFooter = () => {
    const fy = pageHeight - footerHeight;
    setDrawColor(doc, COLORS.border);
    doc.setLineWidth(0.25);
    doc.line(margin, fy - 2, pageWidth - margin, fy - 2);

    setTextColor(doc, COLORS.gray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    let ty = fy + 3;
    doc.text('www.marefatpilgrimage.com', margin, ty);
    ty += 4;
    doc.text('Contact: Ahmad Reshad Tajik · Phone/WhatsApp: +1 (954) 637-1246', margin, ty);
    ty += 4;
    doc.text('Email: info@marefatpilgrimage.com', margin, ty);
    ty += 4;
    doc.setFontSize(7);
    for (const line of COMPANY_ADDRESS_LINES) {
      const wrapped = doc.splitTextToSize(line, contentWidth);
      doc.text(wrapped, margin, ty);
      ty += wrapped.length * 3.6;
    }
  };

  // 1) Header / Branding
  ensureSpace(28);
  setFillColor(doc, COLORS.softBg);
  setDrawColor(doc, COLORS.border);
  doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');
  const headerLogoDataUrl = getHeaderLogoDataUrl();
  if (headerLogoDataUrl) {
    // Keep brand mark proportional (400x140 ratio) and slightly smaller.
    doc.addImage(headerLogoDataUrl, 'PNG', margin + 4, y + 5.3, 34.2, 12);
  } else {
    setTextColor(doc, COLORS.charcoal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('MAREFAT PILGRIMAGE', margin + 4, y + 11);
  }

  setTextColor(doc, COLORS.gray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('www.marefatpilgrimage.com', margin + 42.5, y + 10.8);
  y += 28.5;

  // 2) Document Title
  setTextColor(doc, COLORS.gold);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('Registration Confirmation', margin, y);
  y += 5.8;
  setTextColor(doc, COLORS.gray);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Umrah Pilgrimage Package', margin, y);
  y += 4;

  // 3) Booking Details
  section('Booking Details');
  drawKeyValueRows(
    [
      ['Group Name', valueOrDash(data.groupName ?? 'Marefat Pilgrimage Group')],
      ['Booking Reference Number', data.bookingRef],
      ['Pre-Confirmation Number', valueOrDash(data.preConfirmationNumber ?? `PC-${data.bookingRef}`)],
      ['Confirmation Date', formatDate(data.confirmationDate ?? new Date().toISOString())],
      ['Booking Status', valueOrDash(data.bookingStatus ?? 'Pre-Confirmed')],
    ],
    2
  );

  // 4) Booker Details
  section('Booker Details');
  drawKeyValueRows(
    [
      ['Full Name', data.booker.fullName],
      ['Address', valueOrDash(data.booker.address)],
      ['City', valueOrDash(data.booker.city)],
      ['State', valueOrDash(data.booker.state)],
      ['Zip Code', valueOrDash(data.booker.zipCode)],
      ['Phone', valueOrDash(data.booker.phone)],
      ['Email', valueOrDash(data.booker.email)],
    ],
    2
  );

  // 5) Travelers
  section('Travelers');
  if (!data.travelers.length) {
    drawParagraph('No traveler records are attached to this booking yet.');
  } else {
    data.travelers.forEach((traveler, idx) => {
      const lines = rows([
        ['Full Name', traveler.fullName],
        ['Nationality', valueOrDash(traveler.nationality)],
        ['Passport Number', valueOrDash(traveler.passportNumber)],
        ['Date of Birth', valueOrDash(traveler.dateOfBirth)],
        ['Room Type', valueOrDash(traveler.roomType)],
      ]);
      const requiredHeight = 6 + lines.length * 4 + 4;
      ensureSpace(requiredHeight);
      setFillColor(doc, COLORS.white);
      setDrawColor(doc, COLORS.border);
      doc.roundedRect(margin, y, contentWidth, requiredHeight, 2, 2, 'D');
      setTextColor(doc, COLORS.charcoal);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Traveler ${idx + 1}`, margin + 4, y + 5.2);
      setTextColor(doc, COLORS.gray);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.3);
      doc.text(lines, margin + 4, y + 9.2);
      y += requiredHeight + 2;
    });
  }

  const drawHotelSection = (title: string, hotel: HotelDetails) => {
    section(title);
    drawKeyValueRows(
      [
        ['Hotel Name', valueOrDash(hotel.name)],
        ['Check-in Date', formatDate(hotel.checkInDate)],
        ['Check-in Time', valueOrDash(hotel.checkInTime)],
        ['Check-out Date', formatDate(hotel.checkOutDate)],
        ['Check-out Time', valueOrDash(hotel.checkOutTime)],
        ['Address', valueOrDash(hotel.address)],
        ['Phone', valueOrDash(hotel.phone)],
        ['Email', valueOrDash(hotel.email)],
        ['Meal Plan', valueOrDash(hotel.mealPlan)],
        ['Room Type', valueOrDash(hotel.roomType)],
      ],
      2
    );
  };

  // 6) Medina Hotel Details
  drawHotelSection('Medina Hotel Details', data.hotelMedina);

  // 7) Mecca Hotel Details
  drawHotelSection('Mecca Hotel Details', data.hotelMecca);

  // 8) Transportation
  section('Transportation');
  drawBoxParagraph('Transportation Coverage', TRANSPORT_TEXT);

  // 9) Other Services / Visa
  section('Other Services / Visa');
  drawKeyValueRows([['Service', 'Saudi Visa Application']], 1);
  drawParagraph(VISA_NOTE);

  // 10) Payment Summary
  section('Payment Summary');
  const balanceDue = Math.max(0, data.totalPrice - data.amountPaid);
  drawKeyValueRows(
    [
      ['Total Price', formatCurrency(data.currency, data.totalPrice)],
      ['Currency', data.currency.toUpperCase()],
      ['Amount Paid', formatCurrency(data.currency, data.amountPaid)],
      ['Balance Due', formatCurrency(data.currency, balanceDue)],
      ['Balance Due Date', formatDate(data.balanceDueDate)],
    ],
    2
  );

  // 11) Payment Method
  section('Payment Method');
  drawParagraph(`Available payment methods: Bank Transfer, Zelle, Card, Crypto.`);
  drawParagraph(`Selected payment method: ${paymentMethodLabel(data.selectedPaymentMethod)}.`);

  // 12) Payment Note
  section('Payment Note');
  drawParagraph(PAYMENT_NOTE);

  // 13) Cancellation Policy
  section('Cancellation Policy');
  drawParagraph(data.cancellationPolicy?.trim() || DEFAULT_CANCELLATION_TEXT);

  // 14) Closing Message
  section('Closing Message');
  drawParagraph(CLOSING_TEXT);
  setTextColor(doc, COLORS.charcoal);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Respectfully,', margin, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Marefat Pilgrimage Team', margin, y);

  // 15) Footer
  drawFooter();
  return doc;
}

export function generateRegistrationConfirmationPDFBytes(data: RegistrationConfirmationData): Uint8Array {
  const doc = buildRegistrationConfirmationPDF(data);
  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}