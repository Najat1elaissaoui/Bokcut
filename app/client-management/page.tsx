"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MoreHorizontal, Phone, Mail, Calendar, Plus, User, Star } from "lucide-react"

export default function ClientManagement({ isDark = true }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState(null)

  const clients = [
    {
      id: "C-001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 234 567 8900",
      lastVisit: "2025-01-15",
      totalVisits: 12,
      favoriteService: "Classic Cut",
      status: "active",
      rating: 5,
      notes: "Prefers short sides, regular customer",
      nextAppointment: "2025-01-22 14:00",
    },
    {
      id: "C-002",
      name: "Michael Johnson",
      email: "m.johnson@email.com",
      phone: "+1 234 567 8901",
      lastVisit: "2025-01-10",
      totalVisits: 8,
      favoriteService: "Beard Trim",
      status: "active",
      rating: 4,
      notes: "Allergic to certain products",
      nextAppointment: null,
    },
    {
      id: "C-003",
      name: "David Wilson",
      email: "david.w@email.com",
      phone: "+1 234 567 8902",
      lastVisit: "2024-12-20",
      totalVisits: 25,
      favoriteService: "Premium Cut & Style",
      status: "vip",
      rating: 5,
      notes: "VIP client, always books premium services",
      nextAppointment: "2025-01-20 10:00",
    },
    {
      id: "C-004",
      name: "Robert Brown",
      email: "r.brown@email.com",
      phone: "+1 234 567 8903",
      lastVisit: "2024-11-15",
      totalVisits: 3,
      favoriteService: "Basic Cut",
      status: "inactive",
      rating: 3,
      notes: "New client, still exploring services",
      nextAppointment: null,
    },
  ]

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"
      case "vip":
        return isDark ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-700"
      case "inactive":
        return isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700"
      default:
        return isDark ? "bg-neutral-500/20 text-neutral-300" : "bg-neutral-100 text-neutral-700"
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating ? "text-yellow-400 fill-current" : isDark ? "text-neutral-600" : "text-neutral-300"
        }`}
      />
    ))
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold tracking-wider ${isDark ? "text-white" : "text-black"}`}>
            CLIENT MANAGEMENT
          </h1>
          <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Manage your barbershop clients and their preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
          <Button
            className={`${
              isDark
                ? "bg-neutral-800 hover:bg-neutral-700 text-white"
                : "bg-white hover:bg-neutral-50 text-black border border-neutral-200"
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card
          className={`lg:col-span-1 ${isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"}`}
        >
          <CardContent className="p-4">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDark ? "text-neutral-400" : "text-neutral-500"
                }`}
              />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${
                  isDark
                    ? "bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    : "bg-white border-neutral-300 text-black placeholder-neutral-500"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={`${isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs tracking-wider ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  TOTAL CLIENTS
                </p>
                <p className={`text-2xl font-bold font-mono ${isDark ? "text-white" : "text-black"}`}>
                  {clients.length}
                </p>
              </div>
              <User className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs tracking-wider ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  ACTIVE CLIENTS
                </p>
                <p className={`text-2xl font-bold font-mono ${isDark ? "text-green-400" : "text-green-600"}`}>
                  {clients.filter((c) => c.status === "active").length}
                </p>
              </div>
              <User className={`w-8 h-8 ${isDark ? "text-green-400" : "text-green-500"}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs tracking-wider ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  VIP CLIENTS
                </p>
                <p className={`text-2xl font-bold font-mono ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  {clients.filter((c) => c.status === "vip").length}
                </p>
              </div>
              <Star className={`w-8 h-8 ${isDark ? "text-yellow-400" : "text-yellow-500"}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card className={`${isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"}`}>
        <CardHeader>
          <CardTitle
            className={`text-sm font-medium tracking-wider ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
          >
            CLIENT DATABASE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                  <th
                    className={`text-left py-3 px-4 text-xs font-medium tracking-wider ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    CLIENT
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-xs font-medium tracking-wider ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    CONTACT
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-xs font-medium tracking-wider ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    LAST VISIT
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-xs font-medium tracking-wider ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    VISITS
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-xs font-medium tracking-wider ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    STATUS
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-xs font-medium tracking-wider ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    RATING
                  </th>
                  <th
                    className={`text-left py-3 px-4 text-xs font-medium tracking-wider ${
                      isDark ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className={`border-b transition-colors cursor-pointer ${
                      isDark ? "border-neutral-800 hover:bg-neutral-800" : "border-neutral-200 hover:bg-neutral-50"
                    } ${index % 2 === 0 ? (isDark ? "bg-neutral-900" : "bg-white") : isDark ? "bg-neutral-850" : "bg-neutral-50"}`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className={`text-sm font-medium ${isDark ? "text-white" : "text-black"}`}>
                          {client.name}
                        </div>
                        <div className={`text-xs font-mono ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                          {client.id}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div
                          className={`flex items-center gap-2 text-xs ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
                        >
                          <Mail className="w-3 h-3" />
                          <span>{client.email}</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-xs ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
                        >
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className={`flex items-center gap-2 text-xs ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span className="font-mono">{client.lastVisit}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-mono ${isDark ? "text-white" : "text-black"}`}>
                        {client.totalVisits}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`text-xs px-2 py-1 rounded uppercase tracking-wider ${getStatusColor(client.status)}`}
                      >
                        {client.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">{renderStars(client.rating)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`${
                          isDark ? "text-neutral-400 hover:text-blue-500" : "text-neutral-600 hover:text-blue-500"
                        }`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-neutral-200"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className={`text-lg font-bold tracking-wider ${isDark ? "text-white" : "text-black"}`}>
                  {selectedClient.name}
                </CardTitle>
                <p className={`text-sm font-mono ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  {selectedClient.id}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedClient(null)}
                className={`${isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3
                    className={`text-sm font-medium tracking-wider mb-2 ${
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    CONTACT INFORMATION
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Email:</span>
                      <span className={`${isDark ? "text-white" : "text-black"}`}>{selectedClient.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Phone:</span>
                      <span className={`${isDark ? "text-white" : "text-black"} font-mono`}>
                        {selectedClient.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Status:</span>
                      <Badge className={`text-xs ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-sm font-medium tracking-wider mb-2 ${
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    VISIT HISTORY
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Total Visits:</span>
                      <span className={`${isDark ? "text-white" : "text-black"} font-mono`}>
                        {selectedClient.totalVisits}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Last Visit:</span>
                      <span className={`${isDark ? "text-white" : "text-black"} font-mono`}>
                        {selectedClient.lastVisit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Favorite Service:</span>
                      <span className={`${isDark ? "text-white" : "text-black"}`}>
                        {selectedClient.favoriteService}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Rating:</span>
                      <div className="flex items-center gap-1">{renderStars(selectedClient.rating)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedClient.nextAppointment && (
                <div>
                  <h3
                    className={`text-sm font-medium tracking-wider mb-2 ${
                      isDark ? "text-neutral-300" : "text-neutral-700"
                    }`}
                  >
                    NEXT APPOINTMENT
                  </h3>
                  <div
                    className={`p-3 rounded border ${
                      isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className={`text-sm font-mono ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                      {selectedClient.nextAppointment}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3
                  className={`text-sm font-medium tracking-wider mb-2 ${
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  }`}
                >
                  NOTES
                </h3>
                <p className={`text-sm ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>{selectedClient.notes}</p>
              </div>

              <div className={`flex gap-2 pt-4 border-t ${isDark ? "border-neutral-700" : "border-neutral-200"}`}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Book Appointment</Button>
                <Button
                  className={`${
                    isDark
                      ? "bg-neutral-800 hover:bg-neutral-700 text-white"
                      : "bg-white hover:bg-neutral-50 text-black border border-neutral-200"
                  }`}
                >
                  Edit Client
                </Button>
                <Button
                  className={`${
                    isDark
                      ? "bg-neutral-800 hover:bg-neutral-700 text-white"
                      : "bg-white hover:bg-neutral-50 text-black border border-neutral-200"
                  }`}
                >
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
