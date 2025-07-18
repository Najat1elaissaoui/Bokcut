// SalonCreationDto attendu côté backend
export type SalonCreationDto = {
  adminId: number
  salonName: string
  phoneNumber: string
  email: string
  address: string
  latitude?: string
  longitude?: string
  openingTime: string
  closingTime: string
  serviceCategoryIds: number[]
}