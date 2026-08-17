import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      email,
      tourDate,
      timeSlot,
      kayakType,
      guestCount,
      packageId,
      packageName,
      paymentMethod,
    } = body;

    // Validate mandatory fields
    if (!fullName || !phone || !email || !tourDate || !timeSlot || !kayakType) {
      return NextResponse.json(
        { error: 'Missing required booking fields.' },
        { status: 400 }
      );
    }

    // Generate unique booking reference number
    const referenceId = `KK-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toISOString();

    // Nodemailer / Resend Email Schema Placeholder Structure
    const emailNotificationSchema = {
      from: 'Kayaking Kalawewa Expeditions <bookings@kalawewakayak.lk>',
      to: [email, 'operations@kalawewakayak.lk'],
      subject: `[PENDING CONFIRMATION] Booking Reference #${referenceId} - Kayaking Kalawewa`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0B1914; color: #F4F1EA; padding: 30px; border-radius: 8px;">
          <h2 style="color: #C8A97E; text-transform: uppercase; letter-spacing: 2px;">Kayaking Kalawewa Adventures & Expeditions</h2>
          <p style="font-size: 16px;">Dear ${fullName},</p>
          <p>Thank you for booking your eco-kayaking expedition on ancient Kalawewa Reservoir. Your reservation request has been received and is currently <strong>PENDING</strong> confirmation.</p>
          
          <div style="background-color: #13241E; padding: 20px; border: 1px solid #C8A97E; margin: 20px 0;">
            <p><strong>Booking Reference:</strong> ${referenceId}</p>
            <p><strong>Package:</strong> ${packageName || packageId || 'Custom Expedition'}</p>
            <p><strong>Date:</strong> ${tourDate}</p>
            <p><strong>Time Slot:</strong> ${timeSlot}</p>
            <p><strong>Kayak Type:</strong> ${kayakType} Kayak</p>
            <p><strong>Guests:</strong> ${guestCount || 1}</p>
            <p><strong>Payment Option:</strong> ${paymentMethod === 'bank_transfer' ? 'Manual Bank Transfer' : 'Pay Cash on Arrival (On-Site)'}</p>
            <p><strong>Order Status:</strong> <span style="color: #EAB308;">pending</span></p>
          </div>

          <p style="font-size: 13px; color: #A0A0A0;">Please arrive at the launch point 15 minutes prior to your scheduled time slot (${timeSlot}). Safety gear and briefing will be provided on-site.</p>
          <p style="font-size: 12px; color: #707070;">Location: Kalawewa Lake, North Central Province, Sri Lanka (8.0264° N, 80.5284° E)</p>
        </div>
      `,
    };

    // Return pending status and confirmation payload
    return NextResponse.json({
      success: true,
      referenceId,
      status: 'pending',
      createdAt,
      bookingDetails: {
        fullName,
        phone,
        email,
        tourDate,
        timeSlot,
        kayakType,
        guestCount,
        packageId,
        packageName,
        paymentMethod: paymentMethod === 'bank_transfer' ? 'Manual Bank Transfer' : 'Pay Cash on Arrival (On-Site)',
      },
      emailNotificationSchema,
    });
  } catch (error) {
    console.error('Booking processing error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your booking.' },
      { status: 500 }
    );
  }
}
