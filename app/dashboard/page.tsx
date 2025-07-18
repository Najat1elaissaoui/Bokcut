"use client"

import { useState, useEffect } from "react"
import {
  ChevronRight,
  Monitor,
  Settings,
  Users,
  Calendar,
  Bell,
  RefreshCw,
  Menu,
  Sun,
  Moon,
  Scissors,
  UserCheck,
  DollarSign,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import CommandCenterPage from "../command-center/page"
import TacticalDashboard from "../tactical-dashboard/page"
import TacticalCalendar from "../tactical-calendar/page"
import ClientManagement from "../client-management/page"
import EmployeeManagement from "../employee-management/page"
import ServicesPage from "../services/page"
import FinancialDashboard from "../financial-dashboard/page"


export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDark(savedTheme === "dark")
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newTheme)
  }

  const menuItems = [
    { id: "dashboard", icon: Monitor, label: "DASHBOARD" },
    { id: "calendar", icon: Calendar, label: "CALENDAR" },
    { id: "clients", icon: Users, label: "CLIENTS" },
    { id: "employees", icon: UserCheck, label: "EMPLOYEES" },
    { id: "services", icon: Scissors, label: "SERVICES" },
    { id: "financial", icon: DollarSign, label: "FINANCIAL" },
    { id: "overview", icon: BarChart3, label: "OVERVIEW" },
    { id: "settings", icon: Settings, label: "SETTINGS" },
  ]

  return (
    <div className={`flex h-screen transition-colors duration-300 ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-64"} transition-all duration-300 fixed lg:relative z-50 h-full ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200 shadow-lg"} border-r`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-blue-500 font-bold text-lg tracking-wider">BOKCUT</h1>
              </div>
              <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>Professional Management</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:flex ${isDark ? "text-neutral-400 hover:text-blue-500" : "text-neutral-600 hover:text-blue-500"}`}
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-500 text-white"
                    : isDark
                      ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div
              className={`mt-8 p-4 rounded border ${
                isDark ? "bg-neutral-800 border-neutral-700" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className={`text-xs ${isDark ? "text-white" : "text-black"}`}>SYSTEM ONLINE</span>
              </div>
              <div className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                <div>UPTIME: 99.9%</div>
                <div>CLIENTS: 500+ ACTIVE</div>
                <div>BOOKINGS: 25 TODAY</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Toolbar */}
        <div
          className={`h-16 border-b flex items-center justify-between px-4 lg:px-6 ${
            isDark ? "bg-neutral-800 border-neutral-700" : "bg-white border-neutral-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden ${isDark ? "text-neutral-400 hover:text-blue-500" : "text-neutral-600 hover:text-blue-500"}`}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              BOKCUT MANAGEMENT / <span className="text-blue-500">{activeSection.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`${isDark ? "text-neutral-400 hover:text-blue-500" : "text-neutral-600 hover:text-blue-500"}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <div className={`text-xs font-mono hidden sm:block ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
              LAST UPDATE: {new Date().toLocaleTimeString()}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`${isDark ? "text-neutral-400 hover:text-blue-500" : "text-neutral-600 hover:text-blue-500"}`}
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${isDark ? "text-neutral-400 hover:text-blue-500" : "text-neutral-600 hover:text-blue-500"}`}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "dashboard" && <TacticalDashboard isDark={isDark} />}
          {activeSection === "calendar" && <TacticalCalendar isDark={isDark} />}
          {activeSection === "clients" && <ClientManagement isDark={isDark} />}
          {activeSection === "employees" && <EmployeeManagement isDark={isDark} />}
          {activeSection === "services" && <ServicesPage isDark={isDark} />}
          {activeSection === "financial" && <FinancialDashboard isDark={isDark} />}
          {activeSection === "overview" && <CommandCenterPage />}
          {activeSection === "settings" && (
            <div className="p-6">
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>Settings Coming Soon</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
