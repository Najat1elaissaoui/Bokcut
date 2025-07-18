"use client"

import { useState } from "react"
import { Plus, Filter, ChevronDown, MoreHorizontal, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getThemeClasses } from "@/lib/theme"

interface Appointment {
  id: string
  clientName: string
  service: string
  startTime: string
  endTime: string
  barber: string
  status: "confirmed" | "pending" | "completed"
  price: number
  clientAvatar?: string
}

interface TacticalCalendarProps {
  isDark?: boolean
}

export default function TacticalCalendar({ isDark = true }: TacticalCalendarProps) {
  const [selectedView, setSelectedView] = useState("daily")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const barbers = [
    { id: "1", name: "Robert Morgan", avatar: "/placeholder.svg?height=40&width=40", color: "#3b82f6" },
    { id: "2", name: "Esther Howard", avatar: "/placeholder.svg?height=40&width=40", color: "#10b981" },
    { id: "3", name: "Jacob Jones", avatar: "/placeholder.svg?height=40&width=40", color: "#f59e0b" },
  ]

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
  ]

  const appointments: Appointment[] = [
    {
      id: "1",
      clientName: "Hair Cuts",
      service: "Classic Haircut",
      startTime: "10:30am",
      endTime: "11:30am",
      barber: "Robert Morgan",
      status: "confirmed",
      price: 35,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      clientName: "Head Shave",
      service: "Premium Shave",
      startTime: "11:30am",
      endTime: "12:30pm",
      barber: "Robert Morgan",
      status: "confirmed",
      price: 40,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      clientName: "Razor Fade",
      service: "Fade Cut",
      startTime: "01:30pm",
      endTime: "02:30pm",
      barber: "Robert Morgan",
      status: "confirmed",
      price: 45,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      clientName: "Cut & Design",
      service: "Hair Design",
      startTime: "02:00pm",
      endTime: "03:00pm",
      barber: "Robert Morgan",
      status: "confirmed",
      price: 50,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      clientName: "Shampoo",
      service: "Wash & Style",
      startTime: "10:30am",
      endTime: "11:30am",
      barber: "Esther Howard",
      status: "confirmed",
      price: 25,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "6",
      clientName: "Shoeshine",
      service: "Shoe Polish",
      startTime: "10:30am",
      endTime: "11:30am",
      barber: "Jacob Jones",
      status: "confirmed",
      price: 15,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "7",
      clientName: "Mustache Trim",
      service: "Mustache",
      startTime: "11:30am",
      endTime: "12:30pm",
      barber: "Jacob Jones",
      status: "confirmed",
      price: 20,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "8",
      clientName: "Kids Cuts",
      service: "Kids Haircut",
      startTime: "10:30am",
      endTime: "11:30am",
      barber: "Esther Howard",
      status: "confirmed",
      price: 25,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "9",
      clientName: "Gift Cards",
      service: "Gift Card",
      startTime: "11:30am",
      endTime: "12:30pm",
      barber: "Jacob Jones",
      status: "confirmed",
      price: 50,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "10",
      clientName: "Shampoo",
      service: "Deep Clean",
      startTime: "10:30am",
      endTime: "11:30am",
      barber: "Jacob Jones",
      status: "confirmed",
      price: 30,
      clientAvatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const cardClasses = getThemeClasses("card", "default", isDark)

  const getAppointmentsByBarber = (barberName: string) => {
    return appointments.filter((apt) => apt.barber === barberName)
  }

  const getServiceTypeColor = (service: string) => {
    if (service.toLowerCase().includes("haircut") || service.toLowerCase().includes("cut")) return "#8b5cf6"
    if (service.toLowerCase().includes("shave") || service.toLowerCase().includes("razor")) return "#f59e0b"
    if (service.toLowerCase().includes("shampoo") || service.toLowerCase().includes("wash")) return "#06b6d4"
    if (service.toLowerCase().includes("mustache") || service.toLowerCase().includes("trim")) return "#ec4899"
    return "#10b981"
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card
      className={`${cardClasses.background} ${cardClasses.border} mb-3 cursor-pointer hover:scale-[1.02] transition-all duration-200`}
      style={{
        borderLeft: `4px solid ${getServiceTypeColor(appointment.service)}`,
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={appointment.clientAvatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {appointment.clientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{appointment.clientName}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
        <div className="space-y-1">
          <p className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            {appointment.startTime} - {appointment.endTime} • {appointment.service}
          </p>
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="text-xs"
              style={{
                backgroundColor: getServiceTypeColor(appointment.service) + "20",
                color: getServiceTypeColor(appointment.service),
              }}
            >
              {appointment.service}
            </Badge>
            <span className="text-xs font-medium">${appointment.price}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EmptySlot = ({ barber, timeSlot }: { barber: string; timeSlot: string }) => (
    <Card
      className={`${isDark ? "bg-neutral-800/50 border-neutral-700" : "bg-neutral-50 border-neutral-200"} mb-3 cursor-pointer hover:bg-blue-500/10 transition-all duration-200 border-2 border-dashed`}
    >
      <CardContent className="p-3 flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          className={`${isDark ? "text-neutral-500 hover:text-blue-400" : "text-neutral-400 hover:text-blue-600"}`}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className={`p-6 space-y-6 ${isDark ? "bg-black text-white" : "bg-neutral-50 text-black"}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-500" />
            Calendar
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Select value="monthly" onValueChange={() => {}}>
            <SelectTrigger className={`w-32 ${getThemeClasses("input", "default", isDark)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className={getThemeClasses("button", "secondary", isDark)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button
            size="sm"
            className={`${getThemeClasses("button", "primary", isDark)} bg-purple-500 hover:bg-purple-600`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Calendar
          </Button>
        </div>
      </div>

      {/* Barber Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <div key={barber.id} className="space-y-4">
            {/* Barber Header */}
            <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={barber.avatar || "/placeholder.svg"} />
                      <AvatarFallback style={{ backgroundColor: barber.color + "20", color: barber.color }}>
                        {barber.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{barber.name}</h3>
                      <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                        {getAppointmentsByBarber(barber.name).length} appointments
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appointments */}
            <div className="space-y-2">
              {getAppointmentsByBarber(barber.name).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}

              {/* Empty slots */}
              {Array.from({ length: 3 - getAppointmentsByBarber(barber.name).length }).map((_, index) => (
                <EmptySlot key={index} barber={barber.name} timeSlot={timeSlots[index + 10]} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid Alternative View */}
      <div className="mt-8">
        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Schedule Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Morning (9AM - 12PM)</h4>
                <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                  <p className="text-2xl font-bold text-green-500">8</p>
                  <p className="text-xs text-neutral-500">Appointments</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Afternoon (12PM - 4PM)</h4>
                <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                  <p className="text-2xl font-bold text-blue-500">6</p>
                  <p className="text-xs text-neutral-500">Appointments</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Evening (4PM - 8PM)</h4>
                <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                  <p className="text-2xl font-bold text-purple-500">4</p>
                  <p className="text-xs text-neutral-500">Appointments</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Available Slots</h4>
                <div className={`p-3 rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                  <p className="text-2xl font-bold text-orange-500">12</p>
                  <p className="text-xs text-neutral-500">Open Slots</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
