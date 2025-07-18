"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarIcon,
  Clock,
  User,
  Scissors,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Coffee,
  Settings,
  LogOut,
  Bell,
  Pause,
} from "lucide-react"
import Link from "next/link"

interface Appointment {
  id: string
  clientName: string
  service: string
  startTime: string
  endTime: string
  status: "confirmed" | "completed" | "cancelled" | "no-show"
  price: number
  clientPhone?: string
  notes?: string
  duration: number
}

interface TimeSlot {
  time: string
  appointment?: Appointment
  isBlocked?: boolean
  blockReason?: string
}

interface EmployeeInfo {
  id: string
  name: string
  email: string
  position: string
  salon: string
  avatar: string
}

export default function EmployeeDashboard() {
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"appointment" | "block" | "edit">("appointment")

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
  ]

  const [newAppointment, setNewAppointment] = useState({
    clientName: "",
    service: "",
    startTime: "",
    endTime: "",
    price: 0,
    clientPhone: "",
    notes: "",
    duration: 60,
  })

  const [blockData, setBlockData] = useState({
    startTime: "",
    endTime: "",
    reason: "",
  })

  useEffect(() => {
    const savedEmployeeInfo = localStorage.getItem("employeeInfo")
    if (savedEmployeeInfo) {
      setEmployeeInfo(JSON.parse(savedEmployeeInfo))
    }

    // Mock appointments data
    setAppointments([
      {
        id: "1",
        clientName: "John Smith",
        service: "Classic Haircut",
        startTime: "10:00",
        endTime: "11:00",
        status: "confirmed",
        price: 35,
        clientPhone: "+1 (555) 123-4567",
        notes: "Regular client, prefers short sides",
        duration: 60,
      },
      {
        id: "2",
        clientName: "Mike Johnson",
        service: "Beard Trim",
        startTime: "14:30",
        endTime: "15:00",
        status: "confirmed",
        price: 25,
        clientPhone: "+1 (555) 234-5678",
        duration: 30,
      },
      {
        id: "3",
        clientName: "David Wilson",
        service: "Hot Towel Shave",
        startTime: "16:00",
        endTime: "17:00",
        status: "completed",
        price: 40,
        clientPhone: "+1 (555) 345-6789",
        duration: 60,
      },
    ])
  }, [])

  const services = [
    { name: "Classic Haircut", price: 35, duration: 60 },
    { name: "Beard Trim", price: 25, duration: 30 },
    { name: "Hot Towel Shave", price: 40, duration: 60 },
    { name: "Hair Wash & Style", price: 30, duration: 45 },
    { name: "Premium Package", price: 75, duration: 90 },
  ]

  const getSlotData = (time: string): TimeSlot => {
    const appointment = appointments.find((apt) => apt.startTime === time)
    const isBlocked = time === "12:00" || time === "12:30" // Mock blocked lunch time

    return {
      time,
      appointment,
      isBlocked,
      blockReason: isBlocked ? "Lunch Break" : undefined,
    }
  }

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    if (slot.appointment) {
      setModalType("edit")
      setNewAppointment({
        clientName: slot.appointment.clientName,
        service: slot.appointment.service,
        startTime: slot.appointment.startTime,
        endTime: slot.appointment.endTime,
        price: slot.appointment.price,
        clientPhone: slot.appointment.clientPhone || "",
        notes: slot.appointment.notes || "",
        duration: slot.appointment.duration,
      })
    } else if (slot.isBlocked) {
      setModalType("block")
      setBlockData({
        startTime: slot.time,
        endTime: slot.time,
        reason: slot.blockReason || "",
      })
    } else {
      setModalType("appointment")
      setNewAppointment({
        clientName: "",
        service: "",
        startTime: slot.time,
        endTime: "",
        price: 0,
        clientPhone: "",
        notes: "",
        duration: 60,
      })
    }
    setIsModalOpen(true)
  }

  const handleServiceChange = (serviceName: string) => {
    const service = services.find((s) => s.name === serviceName)
    if (service) {
      const startHour = Number.parseInt(newAppointment.startTime.split(":")[0])
      const startMinute = Number.parseInt(newAppointment.startTime.split(":")[1])
      const endTime = new Date()
      endTime.setHours(startHour, startMinute + service.duration, 0, 0)

      setNewAppointment({
        ...newAppointment,
        service: serviceName,
        price: service.price,
        duration: service.duration,
        endTime: endTime.toTimeString().slice(0, 5),
      })
    }
  }

  const handleSaveAppointment = () => {
    if (modalType === "appointment") {
      const newApt: Appointment = {
        id: Date.now().toString(),
        ...newAppointment,
        status: "confirmed",
      }
      setAppointments([...appointments, newApt])
    } else if (modalType === "edit" && selectedSlot?.appointment) {
      setAppointments(
        appointments.map((apt) => (apt.id === selectedSlot.appointment!.id ? { ...apt, ...newAppointment } : apt)),
      )
    }
    setIsModalOpen(false)
  }

  const handleDeleteAppointment = () => {
    if (selectedSlot?.appointment) {
      setAppointments(appointments.filter((apt) => apt.id !== selectedSlot.appointment!.id))
      setIsModalOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const todayStats = {
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter((apt) => apt.status === "completed").length,
    totalRevenue: appointments.filter((apt) => apt.status === "completed").reduce((sum, apt) => sum + apt.price, 0),
    nextAppointment: appointments.find((apt) => apt.status === "confirmed"),
  }

  if (!employeeInfo) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Access Denied</h2>
            <p className="text-neutral-600 mb-6">Please log in to access your dashboard</p>
            <Link href="/employee-login">
              <Button className="bg-blue-500 hover:bg-blue-600">Employee Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-40">
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
                <p className="text-xs text-neutral-600">Employee Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">Welcome, {employeeInfo.name}!</span>
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Link href="/employee-login">
                <Button variant="ghost" size="icon">
                  <LogOut className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile & Stats */}
          <div className="lg:col-span-1 space-y-6">
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
                    <AvatarImage src={employeeInfo.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {employeeInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{employeeInfo.name}</h3>
                    <p className="text-sm text-neutral-600">{employeeInfo.position}</p>
                    <p className="text-xs text-neutral-500">{employeeInfo.salon}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Today's Stats */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Today's Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{todayStats.totalAppointments}</div>
                    <div className="text-xs text-neutral-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{todayStats.completedAppointments}</div>
                    <div className="text-xs text-neutral-600">Completed</div>
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
                  <div className="text-2xl font-bold">${todayStats.totalRevenue}</div>
                  <div className="text-xs opacity-90">Revenue Today</div>
                </div>
                {todayStats.nextAppointment && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800">Next Appointment</div>
                    <div className="text-xs text-yellow-600">
                      {todayStats.nextAppointment.clientName} at {todayStats.nextAppointment.startTime}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => {
                    setModalType("appointment")
                    setSelectedSlot({ time: "09:00" })
                    setIsModalOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setModalType("block")
                    setIsModalOpen(true)
                  }}
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  Block Time
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Calendar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Calendar Header */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-500" />
                    Work Schedule -{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Time Slots Grid */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timeSlots.map((time) => {
                    const slot = getSlotData(time)
                    return (
                      <Card
                        key={time}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                          slot.appointment
                            ? "bg-blue-50 border-blue-200 hover:border-blue-400"
                            : slot.isBlocked
                              ? "bg-red-50 border-red-200 hover:border-red-400"
                              : "bg-gray-50 border-gray-200 hover:border-blue-300 border-2 border-dashed"
                        }`}
                        onClick={() => handleSlotClick(slot)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm font-medium">{time}</span>
                            {slot.appointment && (
                              <Badge className={getStatusColor(slot.appointment.status)}>
                                {slot.appointment.status}
                              </Badge>
                            )}
                            {slot.isBlocked && (
                              <Badge className="bg-red-100 text-red-800">
                                <Pause className="w-3 h-3 mr-1" />
                                Blocked
                              </Badge>
                            )}
                          </div>

                          {slot.appointment ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" />
                                <span className="font-medium text-sm">{slot.appointment.clientName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Scissors className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-neutral-600">{slot.appointment.service}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-neutral-400" />
                                  <span className="text-xs text-neutral-500">
                                    {slot.appointment.startTime} - {slot.appointment.endTime}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3 text-green-500" />
                                  <span className="text-sm font-medium text-green-600">${slot.appointment.price}</span>
                                </div>
                              </div>
                            </div>
                          ) : slot.isBlocked ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Coffee className="w-4 h-4 text-red-500" />
                                <span className="font-medium text-sm text-red-700">{slot.blockReason}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Plus className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                              <span className="text-sm text-neutral-500">Available</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal for Appointments/Blocking */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalType === "appointment"
                ? "Add Appointment"
                : modalType === "edit"
                  ? "Edit Appointment"
                  : "Block Time"}
            </DialogTitle>
          </DialogHeader>

          {modalType === "block" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={blockData.startTime}
                    onChange={(e) => setBlockData({ ...blockData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={blockData.endTime}
                    onChange={(e) => setBlockData({ ...blockData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Reason</Label>
                <Select
                  value={blockData.reason}
                  onValueChange={(value) => setBlockData({ ...blockData, reason: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lunch Break">Lunch Break</SelectItem>
                    <SelectItem value="Personal Break">Personal Break</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)} className="flex-1 bg-red-500 hover:bg-red-600">
                  Block Time
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={newAppointment.clientName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, clientName: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label>Service</Label>
                <Select value={newAppointment.service} onValueChange={handleServiceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        {service.name} - ${service.price} ({service.duration}min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newAppointment.startTime}
                    onChange={(e) => setNewAppointment({ ...newAppointment, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newAppointment.endTime}
                    onChange={(e) => setNewAppointment({ ...newAppointment, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Client Phone</Label>
                <Input
                  value={newAppointment.clientPhone}
                  onChange={(e) => setNewAppointment({ ...newAppointment, clientPhone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  placeholder="Special requests or notes"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                {modalType === "edit" && (
                  <Button
                    variant="outline"
                    onClick={handleDeleteAppointment}
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveAppointment} className="flex-1 bg-blue-500 hover:bg-blue-600">
                  {modalType === "edit" ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
