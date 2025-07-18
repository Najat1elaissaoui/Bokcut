"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Star, Phone, Mail, MapPin, User, Award, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EmployeeModal from "@/components/modals/employee-modal"
import { getThemeClasses } from "@/lib/theme"

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  specialties: string[]
  experience: string
  salary: string
  address: string
  bio: string
  avatar?: string
  rating: number
  totalClients: number
  monthlyRevenue: number
  isActive: boolean
}

interface EmployeeManagementProps {
  isDark?: boolean
}

export default function EmployeeManagement({ isDark = true }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Robert Morgan",
      email: "robert.morgan@bokcut.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Barber",
      specialties: ["Classic Cuts", "Beard Styling", "Hot Towel Shave"],
      experience: "8 years",
      salary: "$4,500",
      address: "123 Main St, New York, NY 10001",
      bio: "Experienced barber specializing in classic and modern cuts with attention to detail.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
      totalClients: 245,
      monthlyRevenue: 8500,
      isActive: true,
    },
    {
      id: "2",
      name: "Esther Howard",
      email: "esther.howard@bokcut.com",
      phone: "+1 (555) 234-5678",
      position: "Senior Stylist",
      specialties: ["Hair Styling", "Color Treatment", "Wedding Styles"],
      experience: "6 years",
      salary: "$4,200",
      address: "456 Oak Ave, New York, NY 10002",
      bio: "Creative stylist with expertise in modern trends and special occasion styling.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.8,
      totalClients: 198,
      monthlyRevenue: 7200,
      isActive: true,
    },
    {
      id: "3",
      name: "Jacob Jones",
      email: "jacob.jones@bokcut.com",
      phone: "+1 (555) 345-6789",
      position: "Junior Barber",
      specialties: ["Fade Cuts", "Beard Trim", "Kids Cuts"],
      experience: "3 years",
      salary: "$3,800",
      address: "789 Pine St, New York, NY 10003",
      bio: "Energetic barber focused on modern cuts and building client relationships.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.7,
      totalClients: 156,
      monthlyRevenue: 6800,
      isActive: true,
    },
    {
      id: "4",
      name: "Marcus Johnson",
      email: "marcus.johnson@bokcut.com",
      phone: "+1 (555) 456-7890",
      position: "Apprentice",
      specialties: ["Basic Cuts", "Shampoo Service"],
      experience: "1 year",
      salary: "$2,800",
      address: "321 Elm St, New York, NY 10004",
      bio: "Dedicated apprentice learning the craft with enthusiasm and commitment.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.5,
      totalClients: 89,
      monthlyRevenue: 3200,
      isActive: true,
    },
  ])

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const cardClasses = getThemeClasses("card", "default", isDark)

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsModalOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  const handleSaveEmployee = (employeeData: any) => {
    if (selectedEmployee) {
      setEmployees(
        employees.map((emp) => (emp.id === selectedEmployee.id ? { ...employeeData, id: selectedEmployee.id } : emp)),
      )
    } else {
      setEmployees([
        ...employees,
        { ...employeeData, id: Date.now().toString(), rating: 4.0, totalClients: 0, monthlyRevenue: 0, isActive: true },
      ])
    }
  }

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId))
  }

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case "senior barber":
        return "bg-blue-500"
      case "senior stylist":
        return "bg-purple-500"
      case "junior barber":
        return "bg-green-500"
      case "apprentice":
        return "bg-orange-500"
      case "manager":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const totalEmployees = employees.length
  const totalRevenue = employees.reduce((sum, emp) => sum + emp.monthlyRevenue, 0)
  const avgRating = employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length
  const totalClients = employees.reduce((sum, emp) => sum + emp.totalClients, 0)

  return (
    <div className={`p-6 space-y-6 ${isDark ? "bg-black text-white" : "bg-neutral-50 text-black"}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8 text-blue-500" />
            Employee Management
          </h1>
          <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Manage your team members and track their performance
          </p>
        </div>
        <Button onClick={handleAddEmployee} className={getThemeClasses("button", "primary", isDark)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Employee
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Employees</p>
                <p className="text-2xl font-bold">{totalEmployees}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Monthly Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Average Rating</p>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Clients</p>
                <p className="text-2xl font-bold">{totalClients}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card
            key={employee.id}
            className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow} transition-all duration-200 hover:scale-105`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                    <AvatarFallback className={`${getPositionColor(employee.position)} text-white`}>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {employee.position}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee)} className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>{employee.address}</span>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <p className="text-sm font-medium mb-2">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {employee.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {employee.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{employee.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{employee.rating}</span>
                  </div>
                  <p className="text-xs text-neutral-500">Rating</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{employee.totalClients}</div>
                  <p className="text-xs text-neutral-500">Clients</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-500">${employee.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-neutral-500">Revenue</p>
                </div>
              </div>

              {/* Experience & Salary */}
              <div className="flex justify-between items-center text-sm">
                <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>
                  {employee.experience} experience
                </span>
                <span className="font-medium">{employee.salary}/month</span>
              </div>

              {/* Bio */}
              {employee.bio && (
                <div>
                  <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    {employee.bio.length > 100 ? `${employee.bio.substring(0, 100)}...` : employee.bio}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="flex justify-between items-center">
                <Badge variant={employee.isActive ? "default" : "secondary"}>
                  {employee.isActive ? "Active" : "Inactive"}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${employee.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className="text-xs">{employee.isActive ? "Online" : "Offline"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        isDark={isDark}
      />
    </div>
  )
}
