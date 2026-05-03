/**
 * PDF Generation Utility for Booking Confirmations
 * Uses jsPDF to generate professional booking confirmation PDFs
 */

import jsPDF from 'jspdf';

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

// Design system colors
const COLORS = {
  ivory: '#f7f3eb',
  charcoal: '#151515',
  gold: '#c7a56a',
  goldDark: '#a0844f',
  charcoalLight: '#555555',
};

/**
 * Generate booking confirmation PDF
 */
function buildBookingPDF(data: BookingData): jsPDF {
  // Create new PDF document (A4 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ============================================
  // HEADER - Company Branding
  // ============================================
  doc.setFillColor(COLORS.charcoal);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(COLORS.ivory);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Marefat Pilgrimage', margin, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sacred Journeys with Purpose', margin, 23);

  yPos = 45;

  // ============================================
  // BOOKING REFERENCE - Prominent
  // ============================================
  doc.setFillColor(COLORS.gold);
  doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');

  doc.setTextColor(COLORS.charcoal);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('BOOKING REFERENCE', margin + 5, yPos + 8);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.bookingRef, margin + 5, yPos + 18);

  yPos += 35;

  // ============================================
  // CONFIRMATION MESSAGE
  // ============================================
  doc.setTextColor(COLORS.charcoal);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Confirmation', margin, yPos);

  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.charcoalLight);
  doc.text('Thank you for choosing Marefat Pilgrimage. Your sacred journey awaits.', margin, yPos);

  yPos += 12;

  // ============================================
  // TOUR DETAILS SECTION
  // ============================================
  doc.setDrawColor(COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.setTextColor(COLORS.charcoal);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tour Details', margin, yPos);

  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const tourDetails = [
    ['Tour Package:', data.tourTitle],
    ['Destination:', data.tourDestination],
    ['Duration:', data.tourDurationDays ? `${data.tourDurationDays} days` : 'To be confirmed'],
    ['Start Date:', formatDate(data.tourStartDate)],
    ['Number of Travelers:', `${data.numberOfTravelers} ${data.numberOfTravelers === 1 ? 'person' : 'people'}`],
  ];

  tourDetails.forEach(([label, value]) => {
    doc.setTextColor(COLORS.charcoalLight);
    doc.text(label, margin, yPos);
    doc.setTextColor(COLORS.charcoal);
    doc.setFont('helvetica', 'bold');
    doc.text(value, margin + 50, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 6;
  });

  yPos += 6;

  // ============================================
  // TRAVELER INFORMATION SECTION
  // ============================================
  checkPageBreak(40);

  doc.setDrawColor(COLORS.gold);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.setTextColor(COLORS.charcoal);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Traveler Information', margin, yPos);

  yPos += 8;

  data.travelers.forEach((traveler, index) => {
    checkPageBreak(35);

    // Traveler header
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin, yPos, contentWidth, 7, 2, 2, 'F');
    
    doc.setTextColor(COLORS.charcoal);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Traveler ${index + 1}`, margin + 3, yPos + 5);

    yPos += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    const travelerDetails = [
      ['Name:', `${traveler.firstName} ${traveler.lastName}`],
      ['Date of Birth:', formatDate(traveler.dateOfBirth)],
      ['Nationality:', traveler.nationality],
      ['Passport Number:', traveler.passportNumber],
      ['Passport Expiry:', formatDate(traveler.passportExpiry)],
      ['Email:', traveler.email],
      ['Phone:', traveler.phone],
    ];

    travelerDetails.forEach(([label, value]) => {
      doc.setTextColor(COLORS.charcoalLight);
      doc.text(label, margin + 3, yPos);
      doc.setTextColor(COLORS.charcoal);
      doc.text(value, margin + 40, yPos);
      yPos += 5;
    });

    yPos += 3;
  });

  yPos += 3;

  // ============================================
  // PRICING BREAKDOWN SECTION
  // ============================================
  checkPageBreak(45);

  doc.setDrawColor(COLORS.gold);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.setTextColor(COLORS.charcoal);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Price Summary', margin, yPos);

  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const baseTotal = data.basePricePerPerson * data.numberOfTravelers;

  const pricingDetails = [
    [`Tour Package × ${data.numberOfTravelers}`, formatCurrency(baseTotal)],
  ];

  if (data.hasInsurance && data.insuranceTotal > 0) {
    pricingDetails.push(['Travel Insurance', formatCurrency(data.insuranceTotal)]);
  }

  if (data.hasFlightBooking && data.flightTotal > 0) {
    pricingDetails.push(['Flight Booking', formatCurrency(data.flightTotal)]);
  }

  pricingDetails.forEach(([label, value]) => {
    doc.setTextColor(COLORS.charcoalLight);
    doc.text(label, margin, yPos);
    doc.setTextColor(COLORS.charcoal);
    doc.text(value, pageWidth - margin, yPos, { align: 'right' });
    yPos += 6;
  });

  yPos += 2;
  doc.setDrawColor(COLORS.charcoalLight);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 7;

  // Total Amount
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.charcoal);
  doc.text('Total Amount', margin, yPos);
  doc.text(formatCurrency(data.grandTotal), pageWidth - margin, yPos, { align: 'right' });

  yPos += 8;

  // Deposit Amount (highlighted)
  doc.setFillColor(COLORS.gold);
  doc.roundedRect(margin, yPos - 5, contentWidth, 10, 2, 2, 'F');

  doc.setTextColor(COLORS.charcoal);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Deposit Due Now (30%)', margin + 3, yPos + 2);
  doc.text(formatCurrency(data.depositAmount), pageWidth - margin - 3, yPos + 2, { align: 'right' });

  yPos += 12;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.charcoalLight);
  const remainingBalance = data.grandTotal - data.depositAmount;
  doc.text(
    `Remaining balance of ${formatCurrency(remainingBalance)} due 30 days before departure`,
    margin,
    yPos
  );

  yPos += 10;

  // ============================================
  // PAYMENT INSTRUCTIONS SECTION
  // ============================================
  checkPageBreak(55);

  doc.setDrawColor(COLORS.gold);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.setTextColor(COLORS.charcoal);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Instructions', margin, yPos);

  yPos += 8;

  // Bank details box
  doc.setFillColor(255, 250, 240);
  doc.setDrawColor(COLORS.gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'FD');

  yPos += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.charcoalLight);
  doc.text('BANK DETAILS', margin + 3, yPos);

  yPos += 6;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(COLORS.charcoal);

  const bankDetails = [
    ['Bank:', 'Deutsche Bank'],
    ['IBAN:', 'DE89 3704 0044 0532 0130 00'],
    ['BIC:', 'COBADEFFXXX'],
    ['Reference:', data.bookingRef],
  ];

  bankDetails.forEach(([label, value]) => {
    doc.setTextColor(COLORS.charcoalLight);
    doc.text(label, margin + 3, yPos);
    doc.setTextColor(COLORS.charcoal);
    doc.setFont('helvetica', 'bold');
    doc.text(value, margin + 25, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 5;
  });

  yPos += 8;

  doc.setFontSize(9);
  doc.setTextColor(COLORS.charcoalLight);
  doc.text(
    'Please use your booking reference when making the payment transfer.',
    margin,
    yPos
  );

  yPos += 10;

  if (data.expiresAt) {
    doc.setFillColor(255, 240, 240);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');

    yPos += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.charcoal);
    doc.text(`Reservation expires: ${formatDate(data.expiresAt)}`, margin + 3, yPos);

    yPos += 3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.charcoalLight);
    doc.text(
      'Please complete the deposit payment by this date to secure your booking.',
      margin + 3,
      yPos
    );

    yPos += 10;
  }

  // ============================================
  // FOOTER - Contact Information
  // ============================================
  const footerY = pageHeight - 25;
  
  doc.setDrawColor(COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(COLORS.charcoal);
  doc.text('Questions? We\'re here to help.', margin, footerY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.charcoalLight);
  doc.text('Email: info@marefat-pilgrimage.com', margin, footerY + 11);
  doc.text('WhatsApp: +1 (954) 330-8904', margin, footerY + 15);

  doc.setTextColor(COLORS.charcoalLight);
  doc.setFontSize(7);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    pageWidth - margin,
    footerY + 15,
    { align: 'right' }
  );

  // ============================================
  // SAVE PDF
  // ============================================
  return doc;
}

export function generateBookingPDF(data: BookingData): void {
  const doc = buildBookingPDF(data);
  const filename = `Marefat-Booking-${data.bookingRef}.pdf`;
  doc.save(filename);
}

export function generateBookingPDFBytes(data: BookingData): Uint8Array {
  const doc = buildBookingPDF(data);
  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}
