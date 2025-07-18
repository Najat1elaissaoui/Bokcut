"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Clock, DollarSign, Users, Star, Scissors, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ServiceModal from "@/components/modals/service-modal"
import { getThemeClasses, getServiceColor } from "@/lib/theme"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  popularity: number
  rating: number
  totalBookings: number
  icon: string
  isActive: boolean
}

interface ServicesPageProps {
  isDark?: boolean
}

export default function ServicesPage({ isDark = true }: ServicesPageProps) {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Classic Haircut",
      description: "Traditional haircut with styling and finishing touches",
      price: 35,
      duration: 45,
      category: "haircut",
      popularity: 95,
      rating: 4.8,
      totalBookings: 1250,
      icon: "✂️",
      isActive: true,
    },
    {
      id: "2",
      name: "Beard Trim & Shape",
      description: "Professional beard trimming and shaping service",
      price: 25,
      duration: 30,
      category: "beard",
      popularity: 78,
      rating: 4.7,
      totalBookings: 890,
      icon: "🧔",
      isActive: true,
    },
    {
      id: "3",
      name: "Premium Wash & Style",
      description: "Luxury shampoo, conditioning, and professional styling",
      price: 45,
      duration: 60,
      category: "shampoo",
      popularity: 65,
      rating: 4.9,
      totalBookings: 650,
      icon: "🧴",
      isActive: true,
    },
    {
      id: "4",
      name: "Hot Towel Shave",
      description: "Traditional hot towel shave with premium products",
      price: 40,
      duration: 50,
      category: "premium",
      popularity: 45,
      rating: 4.9,
      totalBookings: 320,
      icon: "🪒",
      isActive: true,
    },
    {
      id: "5",
      name: "Hair Styling",
      description: "Special occasion hair styling and finishing",
      price: 30,
      duration: 40,
      category: "styling",
      popularity: 55,
      rating: 4.6,
      totalBookings: 480,
      icon: "💇",
      isActive: true,
    },
    {
      id: "6",
      name: "Father & Son Package",
      description: "Special package for father and son haircuts",
      price: 60,
      duration: 90,
      category: "premium",
      popularity: 35,
      rating: 4.8,
      totalBookings: 180,
      icon: "👨‍👦",
      isActive: true,
    },
  ])

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const cardClasses = getThemeClasses("card", "default", isDark)

  const handleAddService = () => {
    setSelectedService(null)
    setIsModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleViewService = (service: Service) => {
    setSelectedService(service)
    setIsDetailModalOpen(true)
  }

  const handleSaveService = (serviceData: any) => {
    if (selectedService) {
      setServices(services.map((s) => (s.id === selectedService.id ? { ...serviceData, id: selectedService.id } : s)))
    } else {
      setServices([...services, { ...serviceData, id: Date.now().toString() }])
    }
  }

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((s) => s.id !== serviceId))
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return "text-green-500"
    if (popularity >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={`p-6 space-y-6 ${isDark ? "bg-black text-white" : "bg-neutral-50 text-black"}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Scissors className="w-8 h-8 text-blue-500" />
            Services Management
          </h1>
          <p className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
            Manage your barbershop services, pricing, and availability
          </p>
        </div>
        <Button onClick={handleAddService} className={getThemeClasses("button", "primary", isDark)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Services</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Avg. Price</p>
                <p className="text-2xl font-bold">
                  ${Math.round(services.reduce((acc, s) => acc + s.price, 0) / services.length)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Bookings</p>
                <p className="text-2xl font-bold">
                  {services.reduce((acc, s) => acc + s.totalBookings, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Avg. Rating</p>
                <p className="text-2xl font-bold">
                  {(services.reduce((acc, s) => acc + s.rating, 0) / services.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`${cardClasses.background} ${cardClasses.border} ${cardClasses.shadow} cursor-pointer transition-all duration-200 hover:scale-105`}
            onClick={() => handleViewService(service)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: getServiceColor(service.category, isDark) + "20" }}
                  >
                    {service.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className="mt-1"
                      style={{
                        backgroundColor: getServiceColor(service.category, isDark) + "20",
                        color: getServiceColor(service.category, isDark),
                      }}
                    >
                      {service.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditService(service)
                    }}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteService(service.id)
                    }}
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>{service.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-semibold">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{service.duration}min</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{service.rating}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Popularity</span>
                  <span className={getPopularityColor(service.popularity)}>{service.popularity}%</span>
                </div>
                <div
                  className={`w-full bg-neutral-200 rounded-full h-2 ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${service.popularity}%`,
                      backgroundColor: getServiceColor(service.category, isDark),
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>
                  {service.totalBookings} bookings
                </span>
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        onSave={handleSaveService}
        isDark={isDark}
      />

      {/* Service Detail Modal */}
      {isDetailModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`${cardClasses.background} ${cardClasses.border} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="text-2xl">{selectedService.icon}</span>
                {selectedService.name}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsDetailModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">${selectedService.price}</div>
                  <div className="text-sm text-neutral-500">Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{selectedService.duration}min</div>
                  <div className="text-sm text-neutral-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{selectedService.rating}</div>
                  <div className="text-sm text-neutral-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{selectedService.totalBookings}</div>
                  <div className="text-sm text-neutral-500">Bookings</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className={isDark ? "text-neutral-400" : "text-neutral-600"}>{selectedService.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Popularity Trend</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Popularity</span>
                    <span className={getPopularityColor(selectedService.popularity)}>
                      {selectedService.popularity}%
                    </span>
                  </div>
                  <div
                    className={`w-full bg-neutral-200 rounded-full h-3 ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`}
                  >
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${selectedService.popularity}%`,
                        backgroundColor: getServiceColor(selectedService.category, isDark),
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false)
                    handleEditService(selectedService)
                  }}
                  className={getThemeClasses("button", "primary", isDark)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Service
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
