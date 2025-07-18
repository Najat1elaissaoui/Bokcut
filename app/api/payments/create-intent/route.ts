// import { type NextRequest, NextResponse } from "next/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// })

// export async function POST(request: NextRequest) {
//   try {
//     const { amount, currency = "usd", bookingData } = await request.json()

//     // Create payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // Stripe uses cents
//       currency,
//       metadata: {
//         bookingId: bookingData.id || "new",
//         clientName: bookingData.clientName,
//         service: bookingData.service,
//         barber: bookingData.barber,
//         salon: bookingData.salon,
//       },
//     })

//     return NextResponse.json({
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id,
//     })
//   } catch (error) {
//     console.error("Payment intent creation failed:", error)
//     return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
//   }
// }
