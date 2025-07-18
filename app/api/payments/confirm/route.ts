// import { type NextRequest, NextResponse } from "next/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// })

// export async function POST(request: NextRequest) {
//   try {
//     const { paymentIntentId, bookingData } = await request.json()

//     // Retrieve payment intent to confirm it was successful
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

//     if (paymentIntent.status === "succeeded") {
//       // Payment successful, save booking and send notifications

//       // Send confirmation notifications
//       await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/send`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           type: "booking_confirmation",
//           data: {
//             ...bookingData,
//             paymentId: paymentIntent.id,
//             paymentStatus: "paid",
//           },
//         }),
//       })

//       // Schedule reminder (in production, use a job queue like Bull or Agenda)
//       setTimeout(async () => {
//         const appointmentTime = new Date(`${bookingData.date} ${bookingData.time}`)
//         const reminderTime = new Date(appointmentTime.getTime() - 30 * 60 * 1000) // 30 minutes before
//         const now = new Date()

//         if (reminderTime > now) {
//           setTimeout(async () => {
//             await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/send`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 type: "appointment_reminder",
//                 data: bookingData,
//               }),
//             })
//           }, reminderTime.getTime() - now.getTime())
//         }
//       }, 1000)

//       return NextResponse.json({
//         success: true,
//         booking: {
//           ...bookingData,
//           paymentId: paymentIntent.id,
//           status: "confirmed",
//           paymentStatus: "paid",
//         },
//       })
//     } else {
//       return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
//     }
//   } catch (error) {
//     console.error("Payment confirmation failed:", error)
//     return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
//   }
// }
