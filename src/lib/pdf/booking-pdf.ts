/**
 * PDF Generation Utility for Booking Confirmations
 */
import jsPDF from 'jspdf';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { COMPANY_ADDRESS_LINES } from '@/lib/company-address';

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
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  amountPaid?: number;
  cardFeeAmount?: number;
  cardFundingType?: string;
}

const COLORS = {
  ivory: [247, 243, 235] as [number, number, number],
  charcoal: [21, 21, 21] as [number, number, number],
  gold: [199, 165, 106] as [number, number, number],
  charcoalLight: [85, 85, 85] as [number, number, number],
  lightGray: [130, 130, 130] as [number, number, number],
  border: [229, 220, 200] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

let cachedHeaderLogoDataUrl: string | null | undefined;

const getHeaderLogoDataUrl = (): string | undefined => {
  if (cachedHeaderLogoDataUrl !== undefined) return cachedHeaderLogoDataUrl || undefined;
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

function buildBookingPDF(data: BookingData): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const footerHeight = 28;
  const safeBottom = pageHeight - footerHeight - 10;
  let yPos = margin;

  const setTextColor = (rgb: [number, number, number]) => doc.setTextColor(...rgb);
  const setFillColor = (rgb: [number, number, number]) => doc.setFillColor(...rgb);
  const setDrawColor = (rgb: [number, number, number]) => doc.setDrawColor(...rgb);

  const ensureSpace = (requiredSpace: number) => {
    if (yPos + requiredSpace <= safeBottom) return;
    drawFooter();
    doc.addPage();
    yPos = margin;
  };

  const valueOrDash = (value?: string | number | null): string => {
    if (value === null || value === undefined) return '—';
    const text = String(value).trim();
    return text.length ? text : '—';
  };

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const formatPaymentMethod = (method?: string | null): string => {
    if (method === 'card') return 'Card';
    if (method === 'zelle') return 'Zelle';
    if (method === 'wire') return 'Bank Transfer';
    if (method === 'crypto') return 'Crypto';
    return 'Not specified';
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return valueOrDash(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const drawFooter = () => {
    const fy = pageHeight - footerHeight;
    setDrawColor(COLORS.border);
    doc.setLineWidth(0.25);
    doc.line(margin, fy - 2, pageWidth - margin, fy - 2);
    setTextColor(COLORS.charcoalLight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    let ty = fy + 3;
    doc.text('www.marefatpilgrimage.com', margin, ty);
    ty += 4;
    doc.text('Phone/WhatsApp: +1 (954) 330-8904', margin, ty);
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

  const section = (title: string) => {
    ensureSpace(14);
    setTextColor(COLORS.lightGray);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(title.toUpperCase(), margin, yPos);
    yPos += 2;
    setDrawColor(COLORS.border);
    doc.setLineWidth(0.25);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;
  };

  const drawParagraph = (text: string) => {
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * 4.3 + 2);
    setTextColor(COLORS.charcoalLight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 4.3 + 2;
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
        const item = rowItems[c];
        if (!item) continue;
        const x = margin + c * colWidth;
        const [label, value] = item;
        setTextColor(COLORS.lightGray);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(label, x, yPos);
        setTextColor(COLORS.charcoal);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        const valueLines = doc.splitTextToSize(valueOrDash(value), colWidth - 3);
        doc.text(valueLines, x, yPos + labelToValueGap);
      }
      yPos += rowHeight;
    }
  };

  ensureSpace(28);
  setFillColor(COLORS.ivory);
  setDrawColor(COLORS.border);
  doc.roundedRect(margin, yPos, contentWidth, 23, 2, 2, 'FD');
  const headerLogoDataUrl = getHeaderLogoDataUrl();
  if (headerLogoDataUrl) {
    doc.addImage(headerLogoDataUrl, 'PNG', margin + 4, yPos + 5.3, 34.2, 12);
  } else {
    setTextColor(COLORS.charcoal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('MAREFAT PILGRIMAGE', margin + 4, yPos + 11);
  }
  setTextColor(COLORS.charcoalLight);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('www.marefatpilgrimage.com', margin + 42.5, yPos + 10.8);
  yPos += 28.5;

  setTextColor(COLORS.gold);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('Booking Confirmation', margin, yPos);
  yPos += 5.8;
  setTextColor(COLORS.charcoalLight);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Thank you for choosing Marefat Pilgrimage. Your sacred journey awaits.', margin, yPos);
  yPos += 6;

  section('Booking Summary');
  drawKeyValueRows(
    [
      ['Booking Reference', data.bookingRef],
      ['Confirmation Date', formatDate(data.createdAt)],
      ['Tour Package', valueOrDash(data.tourTitle)],
      ['Destination', valueOrDash(data.tourDestination)],
      ['Start Date', formatDate(data.tourStartDate)],
      ['Duration', data.tourDurationDays ? `${data.tourDurationDays} days` : 'To be confirmed'],
      ['Travelers', `${data.numberOfTravelers} ${data.numberOfTravelers === 1 ? 'person' : 'people'}`],
      ['Payment Status', valueOrDash(data.paymentStatus)],
    ],
    2
  );

  section('Contact');
  drawKeyValueRows(
    [
      ['Email', valueOrDash(data.contactEmail)],
      ['Phone', valueOrDash(data.contactPhone)],
    ],
    2
  );

  section('Travelers');
  if (!data.travelers.length) {
    drawParagraph('No traveler records are attached to this booking yet.');
  } else {
    data.travelers.forEach((traveler, index) => {
      const lines = [
        `Full Name: ${valueOrDash(`${traveler.firstName} ${traveler.lastName}`.trim())}`,
        `Date of Birth: ${formatDate(traveler.dateOfBirth)}`,
        `Nationality: ${valueOrDash(traveler.nationality)}`,
        `Passport Number: ${valueOrDash(traveler.passportNumber)}`,
        `Passport Expiry: ${formatDate(traveler.passportExpiry)}`,
        `Email: ${valueOrDash(traveler.email)}`,
        `Phone: ${valueOrDash(traveler.phone)}`,
      ];
      const requiredHeight = 6 + lines.length * 4 + 4;
      ensureSpace(requiredHeight + 2);
      setFillColor(COLORS.white);
      setDrawColor(COLORS.border);
      doc.roundedRect(margin, yPos, contentWidth, requiredHeight, 2, 2, 'D');
      setTextColor(COLORS.charcoal);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Traveler ${index + 1}`, margin + 4, yPos + 5.2);
      setTextColor(COLORS.charcoalLight);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.3);
      doc.text(lines, margin + 4, yPos + 9.2);
      yPos += requiredHeight + 2;
    });
  }

  section('Payment Summary');
  const baseTotal = data.basePricePerPerson * data.numberOfTravelers;
  const pricingRows: Array<[string, string]> = [[`Tour Package x ${data.numberOfTravelers}`, formatCurrency(baseTotal)]];
  if (data.hasInsurance && data.insuranceTotal > 0) pricingRows.push(['Travel Insurance', formatCurrency(data.insuranceTotal)]);
  if (data.hasFlightBooking && data.flightTotal > 0) pricingRows.push(['Flight Booking', formatCurrency(data.flightTotal)]);
  pricingRows.push(['Total Amount', formatCurrency(data.grandTotal)]);
  pricingRows.push(['Deposit Due Now (30%)', formatCurrency(data.depositAmount)]);
  drawKeyValueRows(pricingRows, 2);
  drawParagraph(`Remaining balance of ${formatCurrency(data.grandTotal - data.depositAmount)} is due 30 days before departure.`);
  drawKeyValueRows([['Selected Payment Method', formatPaymentMethod(data.paymentMethod)]], 1);

  if (data.paymentMethod === 'card') {
    const fundingType = data.cardFundingType || 'unknown';
    const isCredit = fundingType === 'credit';
    const cardFeeAmount = data.cardFeeAmount || 0;
    const cardRows: Array<[string, string]> = [
      ['Card Funding Type', fundingType],
      ['Card Processing Fee (3.6%)', isCredit ? formatCurrency(cardFeeAmount) : formatCurrency(0)],
    ];
    if (typeof data.amountPaid === 'number' && data.amountPaid > 0) {
      cardRows.push(['Amount Paid', formatCurrency(data.amountPaid)]);
    }
    drawKeyValueRows(cardRows, 2);
  }

  section('Payment Instructions');
  drawParagraph('Please use your booking reference when making the payment transfer.');
  drawKeyValueRows(
    [
      ['Account Name', 'TGA Tour and Travel LLC'],
      ['Bank', 'JPMorgan Chase Bank, N.A.'],
      ['Routing (Wire)', '021000021'],
      ['Account Number', '2906503801'],
      ['SWIFT / BIC', 'CHASUS33'],
      ['Reference', data.bookingRef],
    ],
    2
  );
  drawParagraph('Wire transfer only (not ACH). Include your booking reference in the payment note.');

  if (data.expiresAt) {
    ensureSpace(14);
    setFillColor(COLORS.ivory);
    setDrawColor(COLORS.border);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'FD');
    setTextColor(COLORS.charcoal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.text(`Reservation expires: ${formatDate(data.expiresAt)}`, margin + 3, yPos + 4.8);
    setTextColor(COLORS.charcoalLight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Please complete the deposit payment by this date to secure your booking.', margin + 3, yPos + 9);
    yPos += 14;
  }

  drawFooter();
  return doc;
}

export function generateBookingPDF(data: BookingData): void {
  const doc = buildBookingPDF(data);
  doc.save(`Marefat-Booking-${data.bookingRef}.pdf`);
}

export function generateBookingPDFBytes(data: BookingData): Uint8Array {
  const doc = buildBookingPDF(data);
  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}
