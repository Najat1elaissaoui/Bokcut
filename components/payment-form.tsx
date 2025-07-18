"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Lock } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  amount: number
  bookingData: any
  onSuccess: (result: any) => void
  onError: (error: string) => void
}

function CheckoutForm({ amount, bookingData, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      // Create payment intent
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          bookingData,
        }),
      })

      const { clientSecret, paymentIntentId } = await response.json()

      // Confirm payment
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) return

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${bookingData.customer.firstName} ${bookingData.customer.lastName}`,
            email: bookingData.customer.email,
            phone: bookingData.customer.phone,
          },
        },
      })

      if (error) {
        onError(error.message || "Payment failed")
      } else if (paymentIntent.status === "succeeded") {
        // Confirm booking and send notifications
        const confirmResponse = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId,
            bookingData: {
              ...bookingData,
              clientName: `${bookingData.customer.firstName} ${bookingData.customer.lastName}`,
              clientEmail: bookingData.customer.email,
              clientPhone: bookingData.customer.phone,
              service: bookingData.service.name,
              barber: bookingData.barber.name,
              salon: bookingData.salon.name,
              date: bookingData.date.toLocaleDateString(),
              time: bookingData.time,
              price: amount,
              employeeName: bookingData.barber.name,
              employeeEmail: "barber@bokcut.com", // In production, get from database
              employeePhone: "+1234567890", // In production, get from database
              address: bookingData.salon.address,
            },
          }),
        })

        const result = await confirmResponse.json()
        onSuccess(result)
      }
    } catch (error) {
      onError("Payment processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-500" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Summary */}
        <div className="p-4 bg-blue-50 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Service:</span>
            <span>{bookingData.service.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Barber:</span>
            <span>{bookingData.barber.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Date & Time:</span>
            <span>
              {bookingData.date.toLocaleDateString()} at {bookingData.time}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-blue-600">${amount}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Element */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Information</label>
            <div className="p-3 border rounded-lg bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
            <Lock className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 text-lg font-semibold shadow-lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Pay ${amount} & Confirm Booking
              </div>
            )}
          </Button>
        </form>

        {/* Payment Methods */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t">
          <Badge variant="outline" className="bg-white">
            <CreditCard className="w-3 h-3 mr-1" />
            Visa
          </Badge>
          <Badge variant="outline" className="bg-white">
            <CreditCard className="w-3 h-3 mr-1" />
            Mastercard
          </Badge>
          <Badge variant="outline" className="bg-white">
            <CreditCard className="w-3 h-3 mr-1" />
            Amex
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
