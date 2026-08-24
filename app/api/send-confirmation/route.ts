import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      bookingId,
      fullName,
      email,
      phone,
      packageName,
      selectedDate,
      timeSlot,
      guestCount,
      totalAmountLKR,
      paymentMethod
    } = data;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "re_123456789_placeholder") {
      console.log("Resend API key notice: Running in simulation mode. Payload received:", {
        bookingId,
        fullName,
        email,
        packageName,
      });

      return NextResponse.json({
        success: true,
        simulated: true,
        notice: "RESEND_API_KEY not configured. Transactional email simulated successfully."
      });
    }

    const resend = new Resend(apiKey);

    const { data: emailData, error } = await resend.emails.send({
      from: "Kayaking Kalawewa <onboarding@resend.dev>",
      to: [email],
      bcc: [process.env.ADMIN_EMAIL || "admin@kalawewakayaking.com"],
      subject: `Booking Confirmation: ${packageName} (#${bookingId})`,
      html: `
        <div style="font-family: serif, sans-serif; background-color: #0b1914; color: #f3f4f6; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #112620; border: 1px solid #c8b8a6; padding: 30px; border-radius: 8px;">
            <h1 style="color: #c8a97e; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 5px;">
              Kalawewa Adventures & Expeditions
            </h1>
            <p style="text-align: center; color: #9ca3af; font-size: 14px; margin-top: 0;">King Dhatusena's Ancient 5th-Century Waters</p>
            <hr style="border: 0; border-top: 1px solid #374151; margin: 25px 0;" />
            <h2 style="color: #ffffff; font-size: 18px;">Ayubowan ${fullName},</h2>
            <p style="color: #d1d5db; line-height: 1.6;">Your eco-kayaking expedition has been successfully reserved. Below are your booking itinerary details:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 25px 0; color: #f3f4f6;">
              <tr style="border-bottom: 1px solid #1f3d34;"><td style="padding: 10px 0; color: #9ca3af;">Booking Reference</td><td style="padding: 10px 0; text-align: right; font-weight: bold; color: #c8a97e;">#${bookingId}</td></tr>
              <tr style="border-bottom: 1px solid #1f3d34;"><td style="padding: 10px 0; color: #9ca3af;">Expedition Package</td><td style="padding: 10px 0; text-align: right;">${packageName}</td></tr>
              <tr style="border-bottom: 1px solid #1f3d34;"><td style="padding: 10px 0; color: #9ca3af;">Date & Slot</td><td style="padding: 10px 0; text-align: right;">${selectedDate} at ${timeSlot}</td></tr>
              <tr style="border-bottom: 1px solid #1f3d34;"><td style="padding: 10px 0; color: #9ca3af;">Adventurers</td><td style="padding: 10px 0; text-align: right;">${guestCount} Person(s)</td></tr>
              <tr style="border-bottom: 1px solid #1f3d34;"><td style="padding: 10px 0; color: #9ca3af;">Payment Option</td><td style="padding: 10px 0; text-align: right;">${paymentMethod === "COD" ? "Pay Cash on Arrival" : "Bank Transfer"}</td></tr>
              <tr><td style="padding: 15px 0; font-size: 18px; color: #ffffff; font-weight: bold;">Total Amount Due</td><td style="padding: 15px 0; text-align: right; font-size: 18px; font-weight: bold; color: #e06a26;">LKR ${totalAmountLKR ? totalAmountLKR.toLocaleString() : '0'}</td></tr>
            </table>
            <div style="background-color: #0b1914; border-left: 4px solid #c8a97e; padding: 15px; margin-top: 20px;">
              <h3 style="color: #c8a97e; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase;">Expedition Guidelines:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                <li>Certified international safety life vests are provided on-site.</li>
                <li>Please arrive at the Kalawewa base camp 15 minutes prior to your slot.</li>
                <li>Bring extra change of clothes and sunscreen.</li>
              </ul>
            </div>
            <p style="text-align: center; margin-top: 30px; font-size: 13px; color: #6b7280;">Need instant assistance? Contact our concierge via WhatsApp.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailData });
  } catch (err: any) {
    console.error("Route handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
