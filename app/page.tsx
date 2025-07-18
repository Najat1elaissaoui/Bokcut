"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Scissors, Users, Calendar, Eye, Sun, Moon, Menu, X, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [currentTime, setCurrentTime] = useState("")
  const [isDark, setIsDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString())
    }

    updateTime()
    const timeInterval = setInterval(updateTime, 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

  const features = [
    {
      icon: Calendar,
      title: "SMART BOOKING",
      description: "AI-powered appointment scheduling with real-time availability",
      stats: "99.9% Accuracy",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "CLIENT INTELLIGENCE",
      description: "Advanced customer analytics and personalized experiences",
      stats: "500+ Happy Clients",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Scissors,
      title: "SERVICE MASTERY",
      description: "Premium barbering services with expert craftsmen",
      stats: "25+ Premium Services",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Eye,
      title: "BUSINESS VISION",
      description: "Real-time analytics and performance insights",
      stats: "Live Dashboard",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  const services = [
    {
      name: "najat ",
      price: 45,
      duration: "60 min",
      image: "/placeholder.svg?height=200&width=300",
      description: "Premium haircut with consultation and styling",
      popular: true,
    },
    {
      name: "Royal Shave",
      price: 55,
      duration: "75 min",
      image: "/placeholder.svg?height=200&width=300",
      description: "Luxury hot towel shave with premium products",
      popular: false,
    },
    {
      name: "Beard Sculpting",
      price: 35,
      duration: "45 min",
      image: "/placeholder.svg?height=200&width=300",
      description: "Professional beard trimming and shaping",
      popular: false,
    },
    {
      name: "Gentleman's Package",
      price: 85,
      duration: "120 min",
      image: "/placeholder.svg?height=200&width=300",
      description: "Complete grooming experience with all services",
      popular: true,
    },
  ]

  const testimonials = [
    {
      name: "Marcus Johnson",
      role: "Business Executive",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "Exceptional service and attention to detail. The team at BOKCUT truly understands modern grooming.",
    },
    {
      name: "David Chen",
      role: "Creative Director",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "Best barbershop experience I've ever had. Professional, clean, and the results are always perfect.",
    },
    {
      name: "Alex Rodriguez",
      role: "Entrepreneur",
      image: "/placeholder.svg?height=60&width=60",
      rating: 5,
      text: "The booking system is seamless and the barbers are true artists. Highly recommend!",
    },
  ]

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
            linear-gradient(${isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)"} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)"} 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Navigation Header */}
        <header
          className={`border-b transition-colors duration-300 ${isDark ? "border-neutral-800 bg-black/80" : "border-neutral-200 bg-white/80"} backdrop-blur-xl sticky top-0 z-50`}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Scissors className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    BOKCUT
                  </h1>
                  <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                    Professional Barbershop Network
                  </p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-all duration-300 hover:text-blue-500 hover:scale-105 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className={`${isDark ? "text-neutral-400 hover:text-blue-500" : "text-neutral-600 hover:text-blue-500"} transition-all duration-300 hover:scale-110`}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                {/* Book Now Button */}
                <Link href="/salon-finder">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 font-bold tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    FIND SALON
                  </Button>
                </Link>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`md:hidden ${isDark ? "text-neutral-400 hover:text-blue-500" : "text-neutral-600 hover:text-blue-500"}`}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>

                <div
                  className={`text-xs font-mono hidden lg:block ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
                >
                  {currentTime}
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-neutral-700">
                <nav className="flex flex-col gap-4 pt-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-blue-500 ${isDark ? "text-neutral-300" : "text-neutral-700"}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section id="home" className="container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-block px-6 py-3 border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full text-sm text-blue-500 tracking-wider font-medium backdrop-blur-sm">
                    ✨ PREMIUM BARBERSHOP NETWORK
                  </div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider leading-tight">
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                      BOKCUT
                    </span>
                  </h1>
                  <div
                    className={`text-xl md:text-2xl tracking-wide ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
                  >
                    Where <span className="text-blue-500 font-semibold">Craftsmanship</span> Meets{" "}
                    <span className="text-purple-500 font-semibold">Innovation</span>
                  </div>
                </div>

                <div className="max-w-xl">
                  <p className={`text-lg leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                    Experience the future of barbering with our network of premium salons. Advanced booking, expert
                    craftsmen, and personalized service at your fingertips.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Link href="/salon-finder">
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg tracking-wider font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                      FIND YOUR SALON
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/employee-login">
                    <Button
                      variant="outline"
                      className="px-8 py-4 text-lg tracking-wider font-bold bg-transparent border-2 hover:bg-blue-500/10 transition-all duration-300"
                    >
                      EMPLOYEE LOGIN
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white"
                        ></div>
                      ))}
                    </div>
                    <span className="text-sm font-medium">500+ Happy Clients</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                    <span className="text-sm font-medium ml-1">4.9/5 Rating</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <img
                    src="/placeholder.svg?height=600&width=500"
                    alt="Premium Barbershop"
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold tracking-wider mb-6 ${isDark ? "text-white" : "text-black"}`}
              >
                PREMIUM{" "}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  SERVICES
                </span>
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Crafted experiences that blend traditional techniques with modern innovation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className={`group transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    isDark
                      ? "bg-neutral-900/50 border-neutral-700 hover:border-blue-500/50"
                      : "bg-white border-neutral-200 shadow-lg hover:shadow-2xl hover:border-blue-500/50"
                  } backdrop-blur-sm relative overflow-hidden`}
                >
                  {service.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">POPULAR</Badge>
                    </div>
                  )}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-2xl font-bold">${service.price}</div>
                      <div className="text-sm opacity-90">{service.duration}</div>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-black"}`}>
                        {service.name}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                        {service.description}
                      </p>
                    </div>
                    <Link href="/salon-finder">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all duration-300 hover:shadow-lg">
                        Book This Service
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="about" className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold tracking-wider mb-6 ${isDark ? "text-white" : "text-black"}`}
              >
                WHY CHOOSE{" "}
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  BOKCUT
                </span>
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 font-medium">ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`group transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    isDark ? "bg-neutral-900/50 border-neutral-700" : "bg-white border-neutral-200 shadow-lg"
                  } backdrop-blur-sm relative overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>
                  <CardContent className="p-8 space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold tracking-wider mb-3 ${isDark ? "text-white" : "text-black"}`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                        {feature.description}
                      </p>
                    </div>

                    <div className={`pt-4 border-t ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
                      <div
                        className={`text-sm font-mono bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                      >
                        {feature.stats}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold tracking-wider mb-6 ${isDark ? "text-white" : "text-black"}`}
              >
                CLIENT{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  STORIES
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    isDark ? "bg-neutral-900/50 border-neutral-700" : "bg-white border-neutral-200 shadow-lg"
                  } backdrop-blur-sm`}
                >
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className={`text-lg leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                          {testimonial.name}
                        </div>
                        <div className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: "HAPPY CLIENTS", gradient: "from-blue-500 to-cyan-500" },
                { number: "25+", label: "PREMIUM SERVICES", gradient: "from-purple-500 to-pink-500" },
                { number: "12", label: "MASTER BARBERS", gradient: "from-green-500 to-emerald-500" },
                { number: "99.9%", label: "SATISFACTION", gradient: "from-orange-500 to-red-500" },
              ].map((stat, index) => (
                <div key={index} className="space-y-4">
                  <div
                    className={`text-4xl md:text-5xl font-bold font-mono bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.number}
                  </div>
                  <div
                    className={`text-sm tracking-wider font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <Card
              className={`backdrop-blur-xl border-2 ${isDark ? "bg-neutral-900/80 border-blue-500/30" : "bg-white/80 border-blue-500/30 shadow-2xl"} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"></div>
              <CardContent className="p-12 space-y-8 relative z-10">
                <div className="text-center space-y-6">
                  <div className="text-lg text-blue-500 tracking-wider font-medium">READY FOR THE EXPERIENCE?</div>
                  <h3
                    className={`text-4xl md:text-5xl font-bold tracking-wider ${isDark ? "text-white" : "text-black"}`}
                  >
                    BOOK YOUR{" "}
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                      APPOINTMENT
                    </span>
                  </h3>
                  <p className={`text-xl max-w-2xl mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Join thousands of satisfied clients who trust BOKCUT for their grooming needs.
                  </p>
                </div>

                <div className="space-y-6">
                  <div
                    className={`p-6 rounded-xl border font-mono text-sm ${isDark ? "bg-black/50 border-neutral-700" : "bg-neutral-50 border-neutral-200"}`}
                  >
                    <div className="text-blue-500">{"> SYSTEM: BOKCUT Network Platform"}</div>
                    <div className={`${isDark ? "text-white" : "text-black"}`}>{"> STATUS: Online and Ready"}</div>
                    <div className={`${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                      {"> AVAILABILITY: Multiple locations available"}
                    </div>
                    <div className="text-green-500">{"> READY FOR BOOKING..."}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/salon-finder" className="block">
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg tracking-wider font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                        FIND YOUR SALON NOW
                      </Button>
                    </Link>
                    <Link href="/onboarding">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto px-8 py-4 text-lg tracking-wider font-bold bg-transparent border-2 hover:bg-blue-500/10 transition-all duration-300"
                      >
                        BUSINESS PORTAL
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`border-t backdrop-blur-xl ${isDark ? "border-neutral-800 bg-black/80" : "border-neutral-200 bg-white/80"}`}
        >
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    BOKCUT
                  </span>
                </div>
                <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Premium barbershop network delivering exceptional grooming experiences.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>Services</h4>
                <div className="space-y-2">
                  {["Haircuts", "Shaving", "Beard Care", "Styling"].map((item) => (
                    <div
                      key={item}
                      className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"} hover:text-blue-500 cursor-pointer transition-colors`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>Company</h4>
                <div className="space-y-2">
                  {["About Us", "Careers", "Contact", "Support"].map((item) => (
                    <div
                      key={item}
                      className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"} hover:text-blue-500 cursor-pointer transition-colors`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>Connect</h4>
                <div className="flex gap-4">
                  {["Facebook", "Instagram", "Twitter"].map((social) => (
                    <div
                      key={social}
                      className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    >
                      <div className="w-5 h-5 bg-blue-500 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t ${isDark ? "border-neutral-800" : "border-neutral-200"}`}
            >
              <div className={`text-sm ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                © 2025 BOKCUT • PREMIUM BARBERSHOP NETWORK • ALL RIGHTS RESERVED
              </div>
              <div className={`flex items-center gap-4 text-sm ${isDark ? "text-neutral-500" : "text-neutral-600"}`}>
                <span>SECURE & RELIABLE</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>ALWAYS ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
