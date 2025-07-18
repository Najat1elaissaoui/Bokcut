"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts"
import { DollarSign, TrendingUp, Users, Calendar, Scissors, Target, Download, Filter, RefreshCw } from "lucide-react"
import { getThemeClasses } from "@/lib/theme"

interface FinancialDashboardProps {
  isDark?: boolean
}

export default function FinancialDashboard({ isDark = true }: FinancialDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Sample data
  const revenueData = [
    { name: "Jan", revenue: 12400, appointments: 156, target: 15000 },
    { name: "Feb", revenue: 13200, appointments: 168, target: 15000 },
    { name: "Mar", revenue: 14800, appointments: 189, target: 15000 },
    { name: "Apr", revenue: 16200, appointments: 203, target: 15000 },
    { name: "May", revenue: 15600, appointments: 195, target: 15000 },
    { name: "Jun", revenue: 17800, appointments: 224, target: 15000 },
    { name: "Jul", revenue: 18900, appointments: 238, target: 15000 },
    { name: "Aug", revenue: 19200, appointments: 241, target: 15000 },
    { name: "Sep", revenue: 17600, appointments: 221, target: 15000 },
    { name: "Oct", revenue: 18400, appointments: 231, target: 15000 },
    { name: "Nov", revenue: 19800, appointments: 248, target: 15000 },
    { name: "Dec", revenue: 21200, appointments: 265, target: 15000 },
  ]

  const serviceDistribution = [
    { name: "Classic Haircut", value: 35, revenue: 8750, color: "#3b82f6" },
    { name: "Beard Trim", value: 25, revenue: 4375, color: "#10b981" },
    { name: "Hot Towel Shave", value: 20, revenue: 5600, color: "#f59e0b" },
    { name: "Hair Wash", value: 15, revenue: 2625, color: "#8b5cf6" },
    { name: "Premium Package", value: 5, revenue: 2625, color: "#ef4444" },
  ]

  const dailyPerformance = [
    { day: "Mon", revenue: 2800, appointments: 35 },
    { day: "Tue", revenue: 3200, appointments: 40 },
    { day: "Wed", revenue: 2900, appointments: 36 },
    { day: "Thu", revenue: 3400, appointments: 42 },
    { day: "Fri", revenue: 4200, appointments: 52 },
    { day: "Sat", revenue: 4800, appointments: 58 },
    { day: "Sun", revenue: 2100, appointments: 26 },
  ]

  const employeePerformance = [
    {
      name: "Robert Morgan",
      revenue: 8400,
      appointments: 105,
      avgRating: 4.9,
      growth: 12,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Esther Howard",
      revenue: 7200,
      appointments: 96,
      avgRating: 4.8,
      growth: 8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Jacob Jones",
      revenue: 6800,
      appointments: 89,
      avgRating: 4.7,
      growth: 15,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const cardClasses = getThemeClasses("card", "default", isDark)

  return (
    <div className={`p-6 space-y-6 ${isDark ? "bg-black text-white" : "bg-neutral-50 text-black"}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-500" />
            Financial Dashboard
          </h1>
          <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Track revenue, performance, and business metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className={`w-32 ${getThemeClasses("input", "default", isDark)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className={getThemeClasses("button", "secondary", isDark)}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className={getThemeClasses("button", "secondary", isDark)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className={getThemeClasses("button", "secondary", isDark)}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Total Revenue</p>
                <p className="text-3xl font-bold text-green-500">$21,200</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+12.5%</span>
                  <span className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Appointments</p>
                <p className="text-3xl font-bold text-blue-500">265</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-500">+8.2%</span>
                  <span className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Average Ticket</p>
                <p className="text-3xl font-bold text-purple-500">$80</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-500">+5.1%</span>
                  <span className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Active Clients</p>
                <p className="text-3xl font-bold text-orange-500">1,247</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-500">+15.3%</span>
                  <span className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="name" stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#ffffff",
                    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: isDark ? "#ffffff" : "#000000",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGradient)" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-blue-500" />
              Service Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#ffffff",
                    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: isDark ? "#ffffff" : "#000000",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceDistribution.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }}></div>
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{service.value}%</div>
                    <div className={`text-xs ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      ${service.revenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Performance */}
      <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Daily Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="day" stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#ffffff",
                  border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  color: isDark ? "#ffffff" : "#000000",
                }}
              />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employee Performance & Monthly Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Employee Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employeePerformance.map((employee, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-opacity-50 hover:bg-opacity-75 transition-colors"
                style={{ backgroundColor: isDark ? "#1f2937" : "#f9fafb" }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={employee.avatar || "/placeholder.svg"}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{employee.name}</h4>
                    <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {employee.appointments} appointments
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-500">${employee.revenue}</div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+{employee.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Monthly Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Revenue Target</span>
                <span className="text-sm text-green-500">$21,200 / $25,000</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className={`text-xs mt-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                85% completed • $3,800 remaining
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Appointments Target</span>
                <span className="text-sm text-blue-500">265 / 300</span>
              </div>
              <Progress value={88} className="h-2" />
              <p className={`text-xs mt-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                88% completed • 35 appointments remaining
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">New Clients Target</span>
                <span className="text-sm text-purple-500">47 / 50</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className={`text-xs mt-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                94% completed • 3 new clients remaining
              </p>
            </div>

            <div
              className={`p-4 rounded-lg ${isDark ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">On Track!</span>
              </div>
              <p className={`text-xs ${isDark ? "text-green-400" : "text-green-700"}`}>
                You're performing well this month. Keep up the great work!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
