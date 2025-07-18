"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  User,
  Scissors,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  History,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"

interface Booking {
  id: string
  service: string
  barber: string
  date: string
  time: string
  status: "confirmed" | "completed" | "cancelled"
  price: number
}

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function ClientDashboard() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [currentBooking, setCurrentBooking] = useState<any>(null)
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([])

  const formatDate = (dateInput: string | Date) =>
    new Date(dateInput).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  useEffect(() => {
    const savedCustomerInfo = localStorage.getItem("customerInfo")
    const savedBooking = localStorage.getItem("currentBooking")

    if (savedCustomerInfo) {
      setCustomerInfo(JSON.parse(savedCustomerInfo))
    }

    if (savedBooking) {
      setCurrentBooking(JSON.parse(savedBooking))
    }

    setBookingHistory([
      {
        id: "1",
        service: "Classic Haircut",
        barber: "Robert Morgan",
        date: "2024-12-15",
        time: "10:30 AM",
        status: "completed",
        price: 35,
      },
      {
        id: "2",
        service: "Beard Trim",
        barber: "Jacob Jones",
        date: "2024-11-20",
        time: "02:00 PM",
        status: "completed",
        price: 25,
      },
      {
        id: "3",
        service: "Hot Towel Shave",
        barber: "Esther Howard",
        date: "2024-10-10",
        time: "11:00 AM",
        status: "completed",
        price: 40,
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (!customerInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Welcome to BOKCUT</h2>
            <p className="text-neutral-600 mb-6">
              Please find a salon and book an appointment to access your dashboard
            </p>
            <Link href="/salon-finder">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
                Find Salon & Book
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-50">
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
                <p className="text-xs text-neutral-600">Client Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">Welcome, {customerInfo.firstName}!</span>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Current Booking */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-lg">
                      {customerInfo.firstName[0]}
                      {customerInfo.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {customerInfo.firstName} {customerInfo.lastName}
                    </h3>
                    <p className="text-sm text-neutral-600">Premium Member</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>{customerInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span>{customerInfo.phone}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent hover:bg-blue-50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Current Booking */}
            {currentBooking && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Upcoming Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">
                      {getStatusIcon("confirmed")}
                      <span className="ml-1">Confirmed</span>
                    </Badge>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                      ${currentBooking.service?.price}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{currentBooking.service?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <span>{currentBooking.barber?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{currentBooking.salon?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{formatDate(currentBooking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{currentBooking.time}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent hover:bg-blue-50">
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/salon-finder">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </Link>
                <Button variant="outline" className="w-full bg-transparent hover:bg-blue-50">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Last Visit
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking History & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{bookingHistory.length + (currentBooking ? 1 : 0)}</div>
                  <div className="text-sm opacity-90">Total Bookings</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-xl border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">
                    ${bookingHistory.reduce((sum, booking) => sum + booking.price, 0)}
                  </div>
                  <div className="text-sm opacity-90">Total Spent</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-2">4.9</div>
                  <div className="text-sm opacity-90">Avg Rating</div>
                </CardContent>
              </Card>
            </div>

            {/* Booking History */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" />
                  Booking History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingHistory.map((booking) => (
                    <Card
                      key={booking.id}
                      className="bg-neutral-50 border-neutral-200 hover:shadow-lg transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Scissors className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{booking.service}</h4>
                              <p className="text-sm text-neutral-600">with {booking.barber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">${booking.price}</div>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status}</span>
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-neutral-600">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{booking.time}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              Book Again
                            </Button>
                            <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700">
                              <Star className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
