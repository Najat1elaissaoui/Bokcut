import { type NextRequest, NextResponse } from "next/server"

// Mock email service - replace with real service like SendGrid, Resend, etc.
async function sendEmail(to: string, subject: string, content: string) {
  console.log(`📧 Email sent to ${to}:`, { subject, content })
  // In production, use a real email service:
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{ to: [{ email: to }] }],
  //     from: { email: 'noreply@bokcut.com' },
  //     subject,
  //     content: [{ type: 'text/html', value: content }]
  //   })
  // })
  return { success: true }
}

// Mock SMS service - replace with Twilio, etc.
async function sendSMS(to: string, message: string) {
  console.log(`📱 SMS sent to ${to}:`, message)
  // In production, use Twilio:
  // const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: new URLSearchParams({
  //     From: process.env.TWILIO_PHONE_NUMBER!,
  //     To: to,
  //     Body: message
  //   })
  // })
  return { success: true }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    switch (type) {
      case "booking_confirmation":
        // Send to client
        await sendEmail(
          data.clientEmail,
          "✅ Booking Confirmed - BOKCUT",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">Booking Confirmed!</h2>
            <p>Dear ${data.clientName},</p>
            <p>Your appointment has been confirmed:</p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Barber:</strong> ${data.barber}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Salon:</strong> ${data.salon}</p>
              <p><strong>Price:</strong> $${data.price}</p>
            </div>
            <p>We'll send you a reminder 30 minutes before your appointment.</p>
            <p>Thank you for choosing BOKCUT!</p>
          </div>
          `,
        )

        await sendSMS(
          data.clientPhone,
          `✅ BOKCUT: Booking confirmed! ${data.service} with ${data.barber} on ${data.date} at ${data.time}. See you soon!`,
        )

        // Send to employee
        await sendEmail(
          data.employeeEmail,
          "📅 New Booking - BOKCUT",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10B981;">New Booking Alert!</h2>
            <p>Dear ${data.employeeName},</p>
            <p>You have a new appointment:</p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Client:</strong> ${data.clientName}</p>
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Phone:</strong> ${data.clientPhone}</p>
              <p><strong>Price:</strong> $${data.price}</p>
            </div>
            <p>Please prepare for this appointment.</p>
          </div>
          `,
        )

        await sendSMS(
          data.employeePhone,
          `📅 BOKCUT: New booking! ${data.clientName} - ${data.service} on ${data.date} at ${data.time}`,
        )
        break

      case "appointment_reminder":
        await sendEmail(
          data.clientEmail,
          "⏰ Appointment Reminder - BOKCUT",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #F59E0B;">Appointment Reminder</h2>
            <p>Dear ${data.clientName},</p>
            <p>This is a reminder that your appointment is in 30 minutes:</p>
            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> ${data.service}</p>
              <p><strong>Barber:</strong> ${data.barber}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Salon:</strong> ${data.salon}</p>
              <p><strong>Address:</strong> ${data.address}</p>
            </div>
            <p>Please arrive 5 minutes early. See you soon!</p>
          </div>
          `,
        )

        await sendSMS(
          data.clientPhone,
          `⏰ BOKCUT: Your appointment with ${data.barber} is in 30 minutes at ${data.salon}. Address: ${data.address}`,
        )
        break

      default:
        return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification error:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}
