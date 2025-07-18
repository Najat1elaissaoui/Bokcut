"use client"

import type React from "react"

import { useState } from "react"
import { X, DollarSign, Star, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { getThemeClasses } from "@/lib/theme"

interface Service {
  id?: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  popularity?: number
  rating?: number
  totalBookings?: number
  icon: string
  isActive: boolean
}

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service?: Service | null
  onSave: (service: Service) => void
  isDark?: boolean
}

export default function ServiceModal({ isOpen, onClose, service, onSave, isDark = true }: ServiceModalProps) {
  const [formData, setFormData] = useState<Service>({
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price || 0,
    duration: service?.duration || 30,
    category: service?.category || "haircut",
    icon: service?.icon || "✂️",
    isActive: service?.isActive ?? true,
    popularity: service?.popularity || 0,
    rating: service?.rating || 0,
    totalBookings: service?.totalBookings || 0,
  })

  const modalClasses = getThemeClasses("modal", "default", isDark)
  const inputClasses = getThemeClasses("input", "default", isDark)
  const buttonClasses = getThemeClasses("button", "primary", isDark)

  const serviceIcons = ["✂️", "🧔", "🧴", "🪒", "💇", "👨‍👦", "💈", "🎨", "✨", "🔥"]
  const categories = [
    { value: "haircut", label: "Haircut" },
    { value: "beard", label: "Beard" },
    { value: "shampoo", label: "Shampoo" },
    { value: "styling", label: "Styling" },
    { value: "premium", label: "Premium" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, id: service?.id })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`${modalClasses.background} ${modalClasses.border} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold">{service ? "Edit Service" : "Add New Service"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-500" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClasses}
                  placeholder="e.g., Classic Haircut"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={inputClasses}
                placeholder="Describe the service in detail..."
                rows={3}
                required
              />
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Pricing & Duration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className={inputClasses}
                  placeholder="35"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className={inputClasses}
                  placeholder="45"
                  min="15"
                  step="15"
                  required
                />
              </div>
            </div>
          </div>

          {/* Visual & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Visual & Status
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Service Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                  {serviceIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 text-2xl rounded-lg border transition-colors ${
                        formData.icon === icon
                          ? "border-blue-500 bg-blue-500/20"
                          : isDark
                            ? "border-neutral-700 hover:border-neutral-600"
                            : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isActive">Service Status</Label>
                  <p className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Enable or disable this service for booking
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className={buttonClasses}>
              {service ? "Update Service" : "Add Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
