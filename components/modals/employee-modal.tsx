"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Trash2, User, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getThemeClasses } from "@/lib/theme"

interface Employee {
  id?: string
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
  rating?: number
  totalClients?: number
}

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  employee?: Employee | null
  onSave: (employee: Employee) => void
  isDark?: boolean
}

export default function EmployeeModal({ isOpen, onClose, employee, onSave, isDark = true }: EmployeeModalProps) {
  const [formData, setFormData] = useState<Employee>({
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    position: employee?.position || "",
    specialties: employee?.specialties || [],
    experience: employee?.experience || "",
    salary: employee?.salary || "",
    address: employee?.address || "",
    bio: employee?.bio || "",
    rating: employee?.rating || 0,
    totalClients: employee?.totalClients || 0,
  })

  const [newSpecialty, setNewSpecialty] = useState("")

  const modalClasses = getThemeClasses("modal", "default", isDark)
  const inputClasses = getThemeClasses("input", "default", isDark)
  const buttonClasses = getThemeClasses("button", "primary", isDark)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, id: employee?.id })
    onClose()
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()],
      })
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`${modalClasses.background} ${modalClasses.border} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold">{employee ? "Edit Employee" : "Add New Employee"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                >
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Senior Barber">Senior Barber</SelectItem>
                    <SelectItem value="Junior Barber">Junior Barber</SelectItem>
                    <SelectItem value="Stylist">Stylist</SelectItem>
                    <SelectItem value="Apprentice">Apprentice</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Professional Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className={inputClasses}
                  placeholder="e.g., 5 years"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Salary</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className={inputClasses}
                  placeholder="e.g., $3,500"
                />
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Add specialty..."
                  className={`flex-1 ${inputClasses}`}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              Additional Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={inputClasses}
                placeholder="Full address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className={inputClasses}
                placeholder="Brief description about the employee..."
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className={buttonClasses}>
              {employee ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
