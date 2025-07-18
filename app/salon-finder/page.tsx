"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import GoogleMap from "@/components/google-map"
import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  Navigation,
  Phone,
  Scissors,
  Users,
  Award,
  Calendar,
  ChevronRight,
  Map,
  List,
} from "lucide-react"
import Link from "next/link"

interface Salon {
  id: string
  name: string
  address: string
  distance: number
  rating: number
  reviewCount: number
  priceRange: string
  image: string
  services: string[]
  barbers: number
  nextAvailable: string
  specialties: string[]
  phone: string
  coordinates: { lat: number; lng: number }
}

export default function SalonFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [maxDistance, setMaxDistance] = useState([10])
  const [sortBy, setSortBy] = useState("distance")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })

  const salons: Salon[] = [
    {
      id: "1",
      name: "BOKCUT Downtown",
      address: "123 Main Street, Downtown",
      distance: 0.8,
      rating: 4.9,
      reviewCount: 245,
      priceRange: "$35-85",
      image: "/placeholder.svg?height=200&width=300",
      services: ["Haircuts", "Beard Trim", "Hot Towel Shave", "Styling"],
      barbers: 6,
      nextAvailable: "Today 2:30 PM",
      specialties: ["Classic Cuts", "Modern Styles", "Beard Care"],
      phone: "+1 (555) 123-4567",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: "2",
      name: "BOKCUT Uptown",
      address: "456 Oak Avenue, Uptown",
      distance: 2.3,
      rating: 4.8,
      reviewCount: 189,
      priceRange: "$40-95",
      image: "/placeholder.svg?height=200&width=300",
      services: ["Premium Cuts", "Royal Shave", "Beard Sculpting", "Hair Wash"],
      barbers: 8,
      nextAvailable: "Today 4:15 PM",
      specialties: ["Premium Services", "Wedding Prep", "Executive Cuts"],
      phone: "+1 (555) 234-5678",
      coordinates: { lat: 40.7589, lng: -73.9851 },
    },
    {
      id: "3",
      name: "BOKCUT Westside",
      address: "789 Pine Street, Westside",
      distance: 3.7,
      rating: 4.7,
      reviewCount: 156,
      priceRange: "$30-75",
      image: "/placeholder.svg?height=200&width=300",
      services: ["Basic Cuts", "Fade Cuts", "Mustache Trim", "Kids Cuts"],
      barbers: 4,
      nextAvailable: "Tomorrow 10:00 AM",
      specialties: ["Fade Specialists", "Kids Friendly", "Quick Service"],
      phone: "+1 (555) 345-6789",
      coordinates: { lat: 40.7505, lng: -74.0087 },
    },
    {
      id: "4",
      name: "BOKCUT Elite",
      address: "321 Luxury Lane, Elite District",
      distance: 5.2,
      rating: 5.0,
      reviewCount: 98,
      priceRange: "$75-150",
      image: "/placeholder.svg?height=200&width=300",
      services: ["Signature Cuts", "Luxury Shave", "Grooming Package", "VIP Service"],
      barbers: 3,
      nextAvailable: "Tomorrow 2:00 PM",
      specialties: ["Luxury Experience", "VIP Treatment", "Master Barbers"],
      phone: "+1 (555) 456-7890",
      coordinates: { lat: 40.7282, lng: -73.9942 },
    },
  ]

  const services = ["All Services", "Haircuts", "Beard Trim", "Hot Towel Shave", "Styling", "Premium Cuts", "Kids Cuts"]

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setMapCenter(location)
        },
        (error) => {
          console.log("Location access denied")
        },
      )
    }
  }, [])

  const filteredSalons = salons
    .filter((salon) => {
      const matchesSearch =
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesService =
        selectedService === "" ||
        selectedService === "All Services" ||
        salon.services.some((service) => service.toLowerCase().includes(selectedService.toLowerCase()))
      const matchesDistance = salon.distance <= maxDistance[0]

      return matchesSearch && matchesService && matchesDistance
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price":
          return (
            Number.parseInt(a.priceRange.split("-")[0].replace("$", "")) -
            Number.parseInt(b.priceRange.split("-")[0].replace("$", ""))
          )
        case "distance":
        default:
          return a.distance - b.distance
      }
    })

  const mapMarkers = filteredSalons.map((salon) => ({
    position: salon.coordinates,
    title: salon.name,
    info: `${salon.rating} ⭐ • ${salon.priceRange} • ${salon.nextAvailable}`,
  }))

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setMapCenter(location)
    setSearchQuery(location.address)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(location)
        setMapCenter(location)
        setSearchQuery("Current Location")
      })
    }
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
                <p className="text-xs text-neutral-600">Find Your Perfect Salon</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-blue-500 text-white" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className={viewMode === "map" ? "bg-blue-500 text-white" : ""}
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
              <Link href="/">
                <Button variant="ghost">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-500" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      placeholder="Enter address or salon name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/50"
                    />
                  </div>
                </div>

                {/* Service Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Type</label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Distance Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Max Distance: {maxDistance[0]} miles</label>
                  <Slider
                    value={maxDistance}
                    onValueChange={setMaxDistance}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Location */}
                <Button
                  variant="outline"
                  className="w-full bg-blue-50 border-blue-200 hover:bg-blue-100"
                  onClick={getCurrentLocation}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Available Salons</h2>
                <p className="text-neutral-600">{filteredSalons.length} salons found near you</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="w-4 h-4" />
                <span>Showing results within {maxDistance[0]} miles</span>
              </div>
            </div>

            {/* Map View */}
            {viewMode === "map" && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-6">
                  <GoogleMap
                    center={mapCenter}
                    zoom={12}
                    markers={mapMarkers}
                    onLocationSelect={handleLocationSelect}
                    className="w-full h-96"
                  />
                </CardContent>
              </Card>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSalons.map((salon) => (
                  <Card
                    key={salon.id}
                    className="group bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  >
                    <div className="relative h-48">
                      <img
                        src={salon.image || "/placeholder.svg"}
                        alt={salon.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-black border-0">{salon.distance} mi</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{salon.name}</h3>
                        <p className="text-sm opacity-90">{salon.address}</p>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      {/* Rating & Reviews */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{salon.rating}</span>
                          </div>
                          <span className="text-sm text-neutral-600">({salon.reviewCount} reviews)</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">{salon.priceRange}</div>
                      </div>

                      {/* Services */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Services:</div>
                        <div className="flex flex-wrap gap-1">
                          {salon.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {salon.services.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{salon.services.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Specialties:</div>
                        <div className="flex flex-wrap gap-1">
                          {salon.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 py-3 border-t border-neutral-100">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">{salon.barbers}</span>
                          </div>
                          <p className="text-xs text-neutral-600">Barbers</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-green-600">Open</span>
                          </div>
                          <p className="text-xs text-neutral-600">Status</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{salon.rating}</span>
                          </div>
                          <p className="text-xs text-neutral-600">Rating</p>
                        </div>
                      </div>

                      {/* Next Available */}
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Next available: {salon.nextAvailable}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/booking?salon=${salon.id}`} className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                            Book Now
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon" className="bg-white/50">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredSalons.length === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No salons found</h3>
                  <p className="text-neutral-600 mb-6">Try adjusting your filters or expanding your search radius.</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedService("")
                      setMaxDistance([10])
                      setPriceRange([0, 100])
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
