import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bookingId,
      customerName,
      customerEmail,
      customerPhone,
      packageName,
      selectedDate,
      timeSlot,
      guestCount,
      totalAmountLKR,
      paymentMethod,
    } = body;

    if (!customerEmail || !bookingId) {
      return NextResponse.json(
        { error: 'Missing customer email or booking reference ID.' },
        { status: 400 }
      );
    }

    const formattedAmount = totalAmountLKR
      ? totalAmountLKR.toLocaleString()
      : '0';

    const paymentLabel =
      paymentMethod === 'BANK_TRANSFER'
        ? 'Direct Bank Transfer'
        : 'Pay on Arrival / Cash on-Site (COD)';

    // Luxury Editorial HTML Email Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Kayaking Kalawewa Expedition Receipt</title>
        </head>
        <body style="margin:0; padding:0; background-color: #0B1914; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #F4F1EA;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B1914; padding: 40px 10px;">
            <tr>
              <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #13241E; border: 1px solid rgba(200, 169, 126, 0.3); border-collapse: collapse;">
                  
                  <!-- Slate Dark Accent Banner with Gold Header -->
                  <tr>
                    <td style="background-color: #0B1914; padding: 36px; text-align: center; border-bottom: 2px solid #C8A97E;">
                      <span style="font-size: 10px; font-weight: 600; letter-spacing: 4px; color: #C8A97E; text-transform: uppercase; display: block; margin-bottom: 8px;">
                        OFFICIAL EXPEDITION CONFIRMATION
                      </span>
                      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: normal; color: #F4F1EA; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
                        KALAWEWA ADVENTURES &amp; EXPEDITIONS
                      </h1>
                      <p style="font-size: 12px; color: #C8A97E; font-style: italic; margin-top: 8px; margin-bottom: 0;">
                        Navigating King Dhatusena's Historic 5th-Century Waters
                      </p>
                    </td>
                  </tr>

                  <!-- Greeting & Intro Paragraph -->
                  <tr>
                    <td style="padding: 32px 36px 20px 36px;">
                      <p style="font-size: 16px; color: #F4F1EA; margin-top: 0;">
                        Dear <strong>${customerName}</strong>,
                      </p>
                      <p style="font-size: 14px; line-height: 1.6; color: rgba(244, 241, 234, 0.85); margin-bottom: 24px;">
                        Thank you for choosing <strong>Kayaking Kalawewa Adventures &amp; Expeditions</strong>. Your reservation has been recorded. Below is your official expedition receipt and arrival guidelines for your eco-kayaking journey.
                      </p>

                      <!-- Structured Receipt Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="12" style="background-color: #0B1914; border: 1px solid rgba(200, 169, 126, 0.3); margin-bottom: 28px;">
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                          <td style="font-size: 12px; color: #C8A97E; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</td>
                          <td style="font-size: 14px; color: #F4F1EA; font-weight: bold; font-family: monospace; text-align: right;">#KK-${bookingId}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                          <td style="font-size: 12px; color: #C8A97E; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Expedition Package</td>
                          <td style="font-size: 13px; color: #F4F1EA; text-align: right; font-weight: 500;">${packageName}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                          <td style="font-size: 12px; color: #C8A97E; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Date &amp; Scheduled Slot</td>
                          <td style="font-size: 13px; color: #F4F1EA; text-align: right;">${selectedDate} at ${timeSlot}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                          <td style="font-size: 12px; color: #C8A97E; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total Guests</td>
                          <td style="font-size: 13px; color: #F4F1EA; text-align: right;">${guestCount} Adventurer${guestCount > 1 ? 's' : ''}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                          <td style="font-size: 12px; color: #C8A97E; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Payment Selection</td>
                          <td style="font-size: 13px; color: #F4F1EA; text-align: right;">${paymentLabel}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 13px; color: #F4F1EA; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Amount Payable at Location</td>
                          <td style="font-size: 18px; color: #C8A97E; font-weight: bold; font-family: Georgia, serif; text-align: right;">LKR ${formattedAmount}</td>
                        </tr>
                      </table>

                      <!-- Safety & Preparation Guidelines -->
                      <div style="background-color: #0B1914; border-left: 3px solid #C8A97E; padding: 20px; margin-bottom: 28px;">
                        <h3 style="font-family: Georgia, serif; font-size: 15px; color: #C8A97E; margin-top: 0; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">
                          🌿 Safety &amp; Preparation Guidelines
                        </h3>
                        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: rgba(244, 241, 234, 0.8); line-height: 1.7;">
                          <li><strong>Arrival Time:</strong> Please arrive 15 minutes before your scheduled slot time (${timeSlot}) at Kalawewa Base Camp.</li>
                          <li><strong>Attire &amp; Gear:</strong> Bring an extra set of dry clothes and sun protection (hat, sunscreen).</li>
                          <li><strong>Electronics Protection:</strong> Waterproof pouches or dry bags are recommended for smartphones &amp; cameras.</li>
                          <li><strong>Included Equipment:</strong> CE/USCG-certified life jackets and eco-naturalist escorts are provided on-site.</li>
                        </ul>
                      </div>

                      <!-- Contact / WhatsApp Concierge Button -->
                      <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
                        <a href="https://wa.me/94771234567?text=Hi%20Concierge,%20inquiring%20about%20booking%20Ref%20%23KK-${bookingId}" 
                           style="background-color: #C8A97E; color: #0B1914; padding: 14px 28px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; display: inline-block;">
                          💬 Message Concierge via WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #0B1914; padding: 24px 36px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                      <p style="font-size: 11px; color: rgba(244, 241, 234, 0.5); margin: 0; line-height: 1.6;">
                        Kayaking Kalawewa Luxury Eco-Resort &amp; Expeditions<br>
                        Kalawewa Reservoir, North Central Province, Sri Lanka (8.0264° N, 80.5284° E)<br>
                        Hotline: +94 77 123 4567 • Email: expeditions@kalawewakayak.lk
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey !== 're_xxxxxxxxx') {
      const resend = new Resend(resendApiKey);

      const emailResponse = await resend.emails.send({
        from: 'Kayaking Kalawewa <onboarding@resend.dev>',
        to: [customerEmail],
        bcc: ['expeditions@kalawewakayak.lk'],
        subject: `[CONFIRMATION] Booking Reference #KK-${bookingId} - Kayaking Kalawewa`,
        html: htmlContent,
      });

      console.log('Resend email sent successfully:', emailResponse);

      return NextResponse.json({
        success: true,
        delivered: true,
        emailId: emailResponse.data?.id || 'resend-ok',
      });
    } else {
      console.log('Resend API key missing or template fallback. Email template generated cleanly:', {
        to: customerEmail,
        bookingId,
      });

      return NextResponse.json({
        success: true,
        simulated: true,
        notice: 'RESEND_API_KEY environment variable not set. Email html generated successfully.',
      });
    }
  } catch (error: any) {
    console.error('Confirmation email API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch confirmation email.' },
      { status: 500 }
    );
  }
}
