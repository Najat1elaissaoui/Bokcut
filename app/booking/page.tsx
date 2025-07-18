"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PaymentForm from "@/components/payment-form"
import { ChevronLeft, ChevronRight, Scissors, CheckCircle, MapPin, Star, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface Service {
  id: string
  name: string
  price: number
  duration: number
  description: string
}

interface Barber {
  id: string
  name: string
  avatar: string
  specialties: string[]
  rating: number
}

interface TimeSlot {
  time: string
  available: boolean
}

interface Salon {
  id: string
  name: string
  address: string
  image: string
  rating: number
  reviewCount: number
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const salonId = searchParams.get("salon")

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const salons: Salon[] = [
    {
      id: "1",
      name: "BOKCUT Downtown",
      address: "123 Main Street, Downtown",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
      reviewCount: 245,
    },
    {
      id: "2",
      name: "BOKCUT Uptown",
      address: "456 Oak Avenue, Uptown",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      reviewCount: 189,
    },
  ]

  const services: Service[] = [
    {
      id: "1",
      name: "Signature Cut",
      price: 45,
      duration: 60,
      description: "Premium haircut with consultation and styling",
    },
    {
      id: "2",
      name: "Royal Shave",
      price: 55,
      duration: 75,
      description: "Luxury hot towel shave with premium products",
    },
    {
      id: "3",
      name: "Beard Sculpting",
      price: 35,
      duration: 45,
      description: "Professional beard trimming and shaping",
    },
    {
      id: "4",
      name: "Gentleman's Package",
      price: 85,
      duration: 120,
      description: "Complete grooming experience with all services",
    },
  ]

  const barbers: Barber[] = [
    {
      id: "1",
      name: "Robert Morgan",
      avatar: "/placeholder.svg?height=80&width=80",
      specialties: ["Signature Cuts", "Beard Styling"],
      rating: 4.9,
    },
    {
      id: "2",
      name: "Esther Howard",
      avatar: "/placeholder.svg?height=80&width=80",
      specialties: ["Modern Styles", "Royal Shaves"],
      rating: 4.8,
    },
    {
      id: "3",
      name: "Jacob Jones",
      avatar: "/placeholder.svg?height=80&width=80",
      specialties: ["Beard Sculpting", "Premium Services"],
      rating: 4.9,
    },
  ]

  const timeSlots: TimeSlot[] = [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "11:30 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "12:30 PM", available: true },
    { time: "01:00 PM", available: false },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "02:30 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "03:30 PM", available: false },
    { time: "04:00 PM", available: true },
    { time: "04:30 PM", available: true },
    { time: "05:00 PM", available: true },
    { time: "05:30 PM", available: true },
  ]

  useEffect(() => {
    if (salonId) {
      const salon = salons.find((s) => s.id === salonId)
      if (salon) {
        setSelectedSalon(salon)
        setCurrentStep(2)
      }
    }
  }, [salonId])

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePaymentSuccess = (result: any) => {
    setPaymentSuccess(true)
    localStorage.setItem("currentBooking", JSON.stringify(result.booking))
    localStorage.setItem("customerInfo", JSON.stringify(customerInfo))
    setCurrentStep(7) // Go to success step
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    // Handle payment error (show toast, etc.)
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4, 5, 6, 7].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step <= currentStep
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "bg-neutral-200 text-neutral-500"
              }`}
            >
              {step < currentStep || paymentSuccess ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 7 && (
              <div
                className={`w-12 h-1 mx-2 transition-all duration-300 ${
                  step < currentStep ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Choose Your Salon</h2>
              <p className="text-neutral-600">Select your preferred BOKCUT location</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {salons.map((salon) => (
                <Card
                  key={salon.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    selectedSalon?.id === salon.id
                      ? "border-blue-500 bg-blue-50 shadow-xl"
                      : "border-neutral-200 hover:border-blue-300"
                  } overflow-hidden`}
                  onClick={() => setSelectedSalon(salon)}
                >
                  <div className="relative h-48">
                    <img
                      src={salon.image || "/placeholder.svg"}
                      alt={salon.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{salon.name}</h3>
                      <p className="text-sm opacity-90 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {salon.address}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{salon.rating}</span>
                        </div>
                        <span className="text-sm text-neutral-600">({salon.reviewCount} reviews)</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Choose Your Service</h2>
              <p className="text-neutral-600">Select the service you'd like to book at {selectedSalon?.name}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    selectedService?.id === service.id
                      ? "border-blue-500 bg-blue-50 shadow-xl"
                      : "border-neutral-200 hover:border-blue-300"
                  } overflow-hidden`}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Scissors className="w-8 h-8 text-blue-500" />
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                          ${service.price}
                        </div>
                        <div className="text-sm text-neutral-500">{service.duration} min</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-sm text-neutral-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Choose Your Barber</h2>
              <p className="text-neutral-600">Select your preferred master barber</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <Card
                  key={barber.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    selectedBarber?.id === barber.id
                      ? "border-blue-500 bg-blue-50 shadow-xl"
                      : "border-neutral-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedBarber(barber)}
                >
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={barber.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-lg">
                        {barber.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-2">{barber.name}</h3>
                    <div className="flex items-center justify-center mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="ml-1 font-medium">{barber.rating}</span>
                    </div>
                    <div className="space-y-1">
                      {barber.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Select Date & Time</h2>
              <p className="text-neutral-600">Choose your preferred appointment date and time</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Times</h3>
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`${
                        selectedTime === slot.time
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                          : slot.available
                            ? "hover:bg-blue-50 hover:border-blue-300"
                            : "opacity-50 cursor-not-allowed"
                      } transition-all duration-200`}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
              <p className="text-neutral-600">Enter your details to complete the booking</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                    placeholder="John"
                    className="bg-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                    placeholder="Doe"
                    className="bg-white/50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="john@example.com"
                  className="bg-white/50"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="bg-white/50"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={customerInfo.password}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, password: e.target.value })}
                  placeholder="Create a password"
                  className="bg-white/50"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={customerInfo.confirmPassword}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="bg-white/50"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Secure Payment</h2>
              <p className="text-neutral-600">Complete your booking with secure payment</p>
            </div>
            <div className="max-w-lg mx-auto">
              <PaymentForm
                amount={selectedService?.price || 0}
                bookingData={{
                  salon: selectedSalon,
                  service: selectedService,
                  barber: selectedBarber,
                  date: selectedDate,
                  time: selectedTime,
                  customer: customerInfo,
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-green-600">Booking Confirmed!</h2>
              <p className="text-neutral-600">Your appointment has been successfully booked and paid</p>
            </div>
            <Card className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Salon:</span>
                  <span className="font-medium">{selectedSalon?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Service:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Barber:</span>
                  <span className="font-medium">{selectedBarber?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Date:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span>Paid:</span>
                    <span className="text-green-600">${selectedService?.price}</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700 text-center">
                    📧 Confirmation email sent to {customerInfo.email}
                    <br />📱 SMS confirmation sent to {customerInfo.phone}
                    <br />⏰ You'll receive a reminder 30 minutes before your appointment
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/client-dashboard" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/salon-finder" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Book Another
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedSalon !== null
      case 2:
        return selectedService !== null
      case 3:
        return selectedBarber !== null
      case 4:
        return selectedDate && selectedTime
      case 5:
        return (
          customerInfo.firstName &&
          customerInfo.lastName &&
          customerInfo.email &&
          customerInfo.phone &&
          customerInfo.password &&
          customerInfo.password === customerInfo.confirmPassword
        )
      case 6:
        return false // Payment form handles its own submission
      case 7:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  BOKCUT
                </h1>
                <p className="text-xs text-neutral-600">Book Your Appointment</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <StepIndicator />

          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">{renderStep()}</CardContent>
          </Card>

          {/* Navigation Buttons */}
          {currentStep < 7 && (
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-white/50"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm text-neutral-500">Step {currentStep} of 7</span>

              {currentStep < 6 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : currentStep === 6 ? (
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <CreditCard className="w-4 h-4" />
                  Complete payment to proceed
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
