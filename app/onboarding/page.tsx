"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  ChevronLeft, ChevronRight, Mail, Eye, EyeOff, MapPin, Clock, Users, Shield, Phone, User, Target, UserPlus, Lock, Zap, Activity, Radar, Scissors,
  Expand,
  Info,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2, X, Navigation, Plus, Minus } from 'lucide-react'

// Types principaux
type FormData = {
  email: string
  password: string
  confirmPassword: string
  adminFirstName: string
  adminLastName: string
  adminPhone: string
  salonName: string
  salonEmail: string
  salonPhone: string
  address: string
  latitude: number | null
  longitude: number | null
  selectedServiceIds: number[]
  teamSize: number
  teamMembers: { email: string; roleId: number; firstName: string; lastName: string; phone: string }[]
  openingTime: string
  closingTime: string
  activationDate: string
}

type Category = { id: number; name: string; description: string }
type Role = { id: number; roleName: string; description: string }

// API endpoints
const API_BASE = "http://localhost:8080"

// Utilitaire pour les requêtes API avec gestion d'erreurs améliorée
// apiRequest.ts
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  // Ne pas envoyer le token pour les routes d'authentification
  const isAuthRoute = url.includes('/api/auth');
  const token = isAuthRoute ? null : localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
};


// Composant principal avec gestion d'erreurs améliorée
export default function SalonOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)

const [showPermission, setShowPermission] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [glitchText, setGlitchText] = useState("")
  const [formData, setFormData] = useState<FormData>({
    email: "", password: "", confirmPassword: "",
    adminFirstName: "", adminLastName: "", adminPhone: "",
    salonName: "", salonEmail: "", salonPhone: "",
    address: "", latitude: null, longitude: null,
    selectedServiceIds: [],
    teamSize: 1,
    teamMembers: [],
    openingTime: "09:00", closingTime: "19:00",
    activationDate: "",
  })
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [adminId, setAdminId] = useState<number | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState({
    categories: false,
    roles: false,
    submitting: false
  })
  // const [loadingDataRoles, setLoadingDataRoles] = useState({
  
  //   roles: false,
  //   submitting: false
  // })
  const router = useRouter()

  const totalSteps = 7

  // Effets pour glitch et fetch data
  useEffect(() => {
    const glitchTexts = ["INITIALIZING...", "SCANNING...", "ENCRYPTING...", "SECURE"]
    let interval: NodeJS.Timeout
    if (isTransitioning) {
      let index = 0
      interval = setInterval(() => {
        setGlitchText(glitchTexts[index % glitchTexts.length])
        index++
      }, 200)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isTransitioning])

  // Charger les données initiales avec gestion d'erreurs améliorée
useEffect(() => {
   const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
    const userId = localStorage.getItem('userId');
    if (userId) setAdminId(Number(userId));
  }

if (!token) {
  // N'affiche ce message que si ce n'est pas juste le premier rendu
  if (authToken !== null) {
    console.warn("Token absent, aucune donnée initiale chargée.")
  }
  return;
}


  setAuthToken(token);

  const loadInitialData = async () => {
    try {
      setLoadingData(prev => ({ ...prev, categories: true }));
      const categoriesData = await apiRequest(`${API_BASE}/api/salon/categories`);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
      setNotification({ type: "error", message: "Erreur lors du chargement des catégories" });
    } finally {
      setLoadingData(prev => ({ ...prev, categories: false }));
    }
  };
  const loadInitialDataRoles = async () => {
    try {
      setLoadingData(prev => ({ ...prev, roles: true }));
      const rolesData = await apiRequest(`${API_BASE}/api/salon/roles`);
      setRoles(rolesData);
    } catch (error) {
      console.error("Erreur chargement rôles:", error);
      setNotification({ type: "error", message: "Erreur lors du chargement des rôles" });
    } finally {
      setLoadingData(prev => ({ ...prev, roles: false }));
    }
  };

  loadInitialData();
  loadInitialDataRoles();
}, [authToken]); // ← important



  // Helpers
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Fonction pour sauvegarder le token
const saveAuthToken = (token: string, userId: number) => {
  console.log('[Auth] Saving token and userId:', { token, userId });
  localStorage.setItem('authToken', token);
  localStorage.setItem('userId', userId.toString()); // Stocker l'ID utilisateur
  setAuthToken(token);
  setAdminId(userId);
};

  // AUTH avec gestion d'erreurs améliorée
  const handleRegister = async () => {
    console.log('[Auth] Register attempt') // Log de débogage
    setLoading(true)
    setNotification(null)
    
    // Validation des champs
    if (!formData.email || !formData.password || !formData.adminFirstName || !formData.adminLastName || !formData.adminPhone) {
      setNotification({ type: "error", message: "Tous les champs sont obligatoires." })
      setLoading(false)
      return
    }
    
    if (formData.password.length < 8) {
      setNotification({ type: "error", message: "Le mot de passe doit faire au moins 8 caractères." })
      setLoading(false)
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setNotification({ type: "error", message: "Les mots de passe ne correspondent pas." })
      setLoading(false)
      return
    }

    try {
      console.log('[Auth] Sending registration request') // Log de débogage
      const data = await apiRequest(`${API_BASE}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          firstName: formData.adminFirstName,
          lastName: formData.adminLastName,
          email: formData.email,
          phoneNumber: formData.adminPhone,
          password: formData.password,
        }),
      })

      console.log('[Auth] Registration response:', data) // Log de débogage

      if (data.success) {
        setNotification({ type: "success", message: data.message || "Inscription réussie !" })
        
        // Sauvegarder le token si fourni
        if (data.token) {
          saveAuthToken(data.token, data.userId)
        } else {
          setAdminId(data.userId)
        }
        
        setTimeout(() => { 
          setCurrentStep(currentStep + 1)
          setNotification(null)
        }, 1000)
      } else {
        setNotification({ type: "error", message: data.message || "Erreur lors de l'inscription" })
      }
    } catch (error: any) {
      console.error('[Auth] Registration error:', error) // Log de débogage
      setNotification({ 
        type: "error", 
        message: error.message || "Erreur réseau lors de l'inscription" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    console.log('[Auth] Login attempt') // Log de débogage
    setLoading(true)
    setNotification(null)
    
    if (!formData.email || !formData.password) {
      setNotification({ type: "error", message: "Email et mot de passe obligatoires." })
      setLoading(false)
      return
    }

    try {
      console.log('[Auth] Sending login request') // Log de débogage
      const data = await apiRequest(`${API_BASE}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      })

      console.log('[Auth] Login response:', data) // Log de débogage

      if (data.success) {
        setNotification({ type: "success", message: data.message || "Connexion réussie !" })
        
        // Sauvegarder le token si fourni
        if (data.token) {
          saveAuthToken(data.token, data.userId)
        } else {
          setAdminId(data.userId)
        }
        
        setTimeout(() => { 
          setCurrentStep(currentStep + 1)
          setNotification(null)
        }, 1000)
      } else {
        setNotification({ type: "error", message: data.message || "Email ou mot de passe incorrect" })
      }
    } catch (error: any) {
      console.error('[Auth] Login error:', error) // Log de débogage
      setNotification({ 
        type: "error", 
        message: error.message || "Erreur réseau lors de la connexion" 
      })
    } finally {
      setLoading(false)
    }
  }

  // Step helpers
  const handleServiceSelect = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServiceIds: prev.selectedServiceIds.includes(id)
        ? prev.selectedServiceIds.filter(i => i !== id)
        : [...prev.selectedServiceIds, id]
    }))
  }

  // Collaborateurs
  const handleTeamMemberChange = (index: number, field: keyof FormData["teamMembers"][0], value: string | number) => {
    setFormData(prev => {
      const teamMembers = [...prev.teamMembers]
      if (!teamMembers[index]) {
        teamMembers[index] = { 
          email: "", 
          roleId: roles[0]?.id || 1, 
          firstName: "", 
          lastName: "", 
          phone: "" 
        }
      }
      teamMembers[index][field] = value
      return { ...prev, teamMembers }
    })
  }

  // GPS
  // const handleDetectAddress = async () => {
  //   if (!navigator.geolocation) {
  //     setNotification({ type: "error", message: "Géolocalisation non supportée!" })
  //     return
  //   }
    
  //   navigator.geolocation.getCurrentPosition(async (pos) => {
  //     const { latitude, longitude } = pos.coords
  //     setFormData(f => ({ ...f, latitude, longitude }))
      
  //     try {
  //       const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
  //       const data = await res.json()
  //       setFormData(f => ({ ...f, address: data.display_name }))
  //     } catch (error) {
  //       console.error('Erreur lors de la géolocalisation:', error)
  //       setNotification({ type: "error", message: "Erreur lors de la récupération de l'adresse" })
  //     }
  //   }, (error) => {
  //     console.error('Erreur de géolocalisation:', error)
  //     setNotification({ type: "error", message: "Impossible de détecter la position" })
  //   })
  // }
  // GPS - Fonction améliorée pour détecter l'adresse
  const handleDetectAddress = async () => {
    if (!navigator.geolocation) {
      setNotification({ type: "error", message: "Géolocalisation non supportée!" })
      return
    }
    
    setNotification({ type: "success", message: "Détection en cours..." })
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      setFormData(f => ({ ...f, latitude, longitude }))
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        const data = await res.json()
        setFormData(f => ({ ...f, address: data.display_name }))
        setNotification({ type: "success", message: "Adresse détectée avec succès!" })
        setTimeout(() => setNotification(null), 3000)
      } catch (error) {
        console.error('Erreur lors de la géolocalisation:', error)
        setNotification({ type: "error", message: "Erreur lors de la récupération de l'adresse" })
      }
    }, (error) => {
      console.error('Erreur de géolocalisation:', error)
      setNotification({ type: "error", message: "Impossible de détecter la position" })
    })
  }

  // Nouvelle fonction pour la recherche d'adresse
  const handleAddressSearch = (address: string, lat: number, lon: number) => {
    setFormData(prev => ({
      ...prev,
      address,
      latitude: lat,
      longitude: lon
    }))
    setNotification({ type: "success", message: "Adresse sélectionnée avec succès!" })
    setTimeout(() => setNotification(null), 3000)
  }



  // Création salon finale avec gestion d'erreurs
  const handleSubmitSalon = async () => {
    console.log('[Salon] Submitting salon creation') // Log de débogage
    setLoading(true)
    setNotification(null)
    
    // Validation des données
    if (!formData.salonName || !formData.salonEmail || !formData.address) {
      setNotification({ type: "error", message: "Veuillez remplir tous les champs obligatoires." })
      setLoading(false)
      return
    }

    if (formData.selectedServiceIds.length === 0) {
      setNotification({ type: "error", message: "Veuillez sélectionner au moins un service." })
      setLoading(false)
      return
    }

    try {
      const payload = {
        adminId,
        salonName: formData.salonName,
        phoneNumber: formData.salonPhone,
        email: formData.salonEmail,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        categoryIds: formData.selectedServiceIds,
        employees: formData.teamMembers.map(c => ({
          email: c.email,
          firstName: c.firstName,
          lastName: c.lastName,
          phoneNumber: c.phone,
          roleId: c.roleId
        })),
      }

      console.log('[Salon] Sending payload:', payload) // Log de débogage

      const data = await apiRequest(`${API_BASE}/api/salon/create`, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      console.log('[Salon] Creation response:', data) // Log de débogage

      if (data.success) {
        setNotification({ type: "success", message: "Salon créé avec succès!" })
        setTimeout(() => router.push("/dashboard"), 1500)
      } else {
        setNotification({ type: "error", message: data.message || "Erreur lors de la création du salon" })
      }
    } catch (error: any) {
      console.error('[Salon] Creation error:', error) // Log de débogage
      setNotification({ 
        type: "error", 
        message: error.message || "Erreur réseau lors de la création du salon" 
      })
    } finally {
      setLoading(false)
    }
  }

  // Validation des étapes
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: return adminId !== null
      case 1: return formData.salonName && formData.salonEmail && formData.address
      case 2: return formData.selectedServiceIds.length > 0
      case 3: return formData.teamMembers.length === formData.teamSize
      case 4: return formData.openingTime && formData.closingTime
      case 5: return formData.activationDate
      default: return true
    }
  }

  // Rendu des steps avec gestion d'erreurs améliorée
  const renderStep = () => {
    if (isTransitioning) return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin absolute top-2 left-2" style={{ animationDirection: "reverse" }}></div>
        </div>
        <p className="text-orange-400 mt-4 sm:mt-6 tracking-wider font-mono animate-pulse text-sm sm:text-base">{glitchText}</p>
      </div>
    )

    // ÉTAPE 0 : Auth
    if (currentStep === 0) {
      return (
        <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
          {notification && (
            <div className={`mb-4 px-4 py-2 rounded text-sm font-semibold ${notification.type === "success" ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"}`}>
              {notification.message}
            </div>
          )}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group">
              {hasAccount ? (
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 group-hover:animate-bounce" />
              ) : (
                <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 group-hover:animate-bounce" />
              )}
              <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-10"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              {hasAccount ? "Connexion" : "Créer un compte Admin"}
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base lg:text-lg px-4">
              {hasAccount ? "Accédez à votre espace d'administration" : "Créez votre accès administrateur"}
            </p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <Input label="Email admin" type="email" placeholder="Email" value={formData.email} onChange={v => handleInputChange("email", v)} icon={Mail} />
            {!hasAccount && (
              <>
                <Input label="Prénom admin" type="text" placeholder="Prénom" value={formData.adminFirstName} onChange={v => handleInputChange("adminFirstName", v)} icon={User} />
                <Input label="Nom admin" type="text" placeholder="Nom" value={formData.adminLastName} onChange={v => handleInputChange("adminLastName", v)} icon={UserPlus} />
                <Input label="Téléphone admin" type="tel" placeholder="Téléphone" value={formData.adminPhone} onChange={v => handleInputChange("adminPhone", v)} icon={Phone}  />
              </>
            )}
            <div className="relative group">
              <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 tracking-wider">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors z-10" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono hover:bg-neutral-800/80 text-sm sm:text-base"
                  placeholder={hasAccount ? "Votre mot de passe" : "Créer un mot de passe"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors z-10">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {!hasAccount && (
              <div className="relative group">
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 tracking-wider">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors z-10" size={16} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono hover:bg-neutral-800/80 text-sm sm:text-base"
                    placeholder="Confirmer le mot de passe"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors z-10">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
<div className="flex justify-center pt-2 sm:pt-4">
  {hasAccount ? (
    <Button onClick={handleLogin} icon={Mail} loading={loading}>
      Connexion
    </Button>
  ) : (
    <Button onClick={handleRegister} icon={UserPlus} loading={loading}>
      Créer le compte
    </Button>
  )}
</div>

            <div className="text-center pt-2 sm:pt-4">
              <button onClick={() => setHasAccount(!hasAccount)} className="text-orange-500 hover:text-orange-400 transition-colors text-xs sm:text-sm tracking-wider hover:underline">
                {hasAccount ? "Créer un nouveau compte admin ?" : "Déjà un accès admin ?"}
              </button>
            </div>
          </div>
        </div>
      )
    }

    // ÉTAPE 1 : Infos salon
    // if (currentStep === 1) {
    //   return (
    //     <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
    //       {notification && (
    //         <div className={`mb-4 px-4 py-2 rounded text-sm font-semibold ${notification.type === "success" ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"}`}>
    //           {notification.message}
    //         </div>
    //       )}
    //       <h2 className="text-2xl font-bold mb-4">Profil du salon</h2>
    //       <Input label="Nom du salon" type="text" value={formData.salonName} onChange={v => handleInputChange("salonName", v)} icon={User} />
    //       <Input label="Email du salon" type="email" value={formData.salonEmail} onChange={v => handleInputChange("salonEmail", v)} icon={Mail} />
    //       <Input label="Téléphone du salon" type="tel" value={formData.salonPhone} onChange={v => handleInputChange("salonPhone", v)} icon={Phone} />
    //       <Input label="Adresse" type="text" value={formData.address} onChange={v => handleInputChange("address", v)} icon={MapPin} />
    //       <Button onClick={handleDetectAddress} icon={Target}>Détecter l'adresse automatiquement</Button>
    //     </div>
    //   )
    // }


    if (currentStep === 1) {
    return (
      <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
        {notification && (
          <div className={`mb-4 px-4 py-2 rounded text-sm font-semibold ${notification.type === "success" ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"}`}>
            {notification.message}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-4">Profil du salon</h2>
        <Input label="Nom du salon" type="text" placeholder="Nom du salon" value={formData.salonName} onChange={v => handleInputChange("salonName", v)} icon={User} />
        <Input label="Email du salon" type="email" placeholder="Email du salon" value={formData.salonEmail} onChange={v => handleInputChange("salonEmail", v)} icon={Mail} />
        <Input label="Téléphone du salon" type="tel" placeholder="Téléphone du salon" value={formData.salonPhone} onChange={v => handleInputChange("salonPhone", v)} icon={Phone} />
        {/* --- Bloc adresse combiné --- */}
       <MapSearchCard
            address={formData.address}
            latitude={formData.latitude}
            longitude={formData.longitude}
            onAddressChange={(address, lat, lng, addressDetails) => {
              setFormData(f => ({
                ...f,
                address,
                latitude: lat,
                longitude: lng,
                // Optionnel : tu peux aussi stocker addressDetails si tu veux (ville, code postal, etc.)
              }))
            }}
            onRequestDetect={handleDetectAddress}
            loadingGPS={loading}
          />
      </div>
    )
  }

    // ÉTAPE 2 : Choix services
    if (currentStep === 2) {
      return (
        <div className="w-full px-4 sm:px-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Services proposés</h2>
          
          {/* Section de débogage */}
          {/* <div className="mb-4 p-4 bg-neutral-800 rounded-lg">
            <h3 className="font-mono text-sm mb-2">Debug Info:</h3>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify({
                categoriesLoaded: categories.length,
                loadingCategories: loadingData.categories,
                rolesLoaded: roles.length,
                loadingRoles: loadingData.roles,
                authToken: !!authToken,
                adminId: adminId
              }, null, 2)}
            </pre>
          </div> */}

          {loadingData.categories ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-neutral-400">Chargement des services...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-400">Aucun service disponible</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 text-orange-500 hover:text-orange-400"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all duration-300 ${
                    formData.selectedServiceIds.includes(cat.id)
                      ? "border-orange-500 bg-orange-500/20 font-bold"
                      : "border-neutral-700"
                  }`}
                  onClick={() => handleServiceSelect(cat.id)}
                >
                  <div className="text-xl">{cat.name}</div>
                  <div className="text-xs text-neutral-400">{cat.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    // ÉTAPE 3 : Collaborateurs
    // if (currentStep === 3) {
    //   return (
    //     <div className="w-full px-4 sm:px-6 max-w-2xl mx-auto">
    //       <h2 className="text-2xl font-bold mb-4">Collaborateurs</h2>
    //       <Input label="Nombre de collaborateurs" type="number" value={formData.teamSize.toString()} onChange={v => handleInputChange("teamSize", Number.parseInt(v) || 0)} icon={Users} />
    //       <p className="text-sm text-neutral-400 mb-4">Ajoutez les informations de vos collaborateurs ci-dessous.</p>
    //       {loadingDataRoles.roles ? (
    //         <div className="text-center py-4">
    //           <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500 mb-2"></div>
    //           <p className="text-neutral-400 text-sm">Chargement des rôles...</p>
    //         </div>
    //       ) : roles.length === 0 ? (
    //         <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
    //           <p className="text-red-300">Aucun rôle disponible. Veuillez vérifier votre connexion ou contacter l'administrateur.</p>
    //         </div>
    //       ) : null}

    //       <div className="space-y-4 mt-4">
    //         {[...Array(formData.teamSize)].map((_, idx) => (
    //           <div key={idx} className="flex flex-col md:flex-row gap-2">
    //             <input 
    //               type="email" 
    //               placeholder="Email" 
    //               className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
    //               value={formData.teamMembers[idx]?.email || ""} 
    //               onChange={e => handleTeamMemberChange(idx, "email", e.target.value)} 
    //             />
    //             <input 
    //               type="text" 
    //               placeholder="Prénom" 
    //               className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
    //               value={formData.teamMembers[idx]?.firstName || ""} 
    //               onChange={e => handleTeamMemberChange(idx, "firstName", e.target.value)} 
    //             />
    //             <input 
    //               type="text" 
    //               placeholder="Nom" 
    //               className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
    //               value={formData.teamMembers[idx]?.lastName || ""} 
    //               onChange={e => handleTeamMemberChange(idx, "lastName", e.target.value)} 
    //             />
    //             <input 
    //               type="text" 
    //               placeholder="Téléphone" 
    //               className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
    //               value={formData.teamMembers[idx]?.phone || ""} 
    //               onChange={e => handleTeamMemberChange(idx, "phone", e.target.value)} 
    //             />
    //             <select 
    //               className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
    //               value={formData.teamMembers[idx]?.roleId || roles[0]?.id} 
    //               onChange={e => handleTeamMemberChange(idx, "roleId", Number(e.target.value))}
    //               disabled={roles.length === 0}
    //             >
    //               {roles.map(r => (
    //                 <option value={r.id} key={r.id}>
    //                   {r.roleName}
    //                 </option>
    //               ))}
    //             </select>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   )
    // }



    if (currentStep === 3) {
  return (
    
    <div className="w-full px-4 sm:px-6 max-w-2xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Collaborateurs</h2>


       {/* <div className="mb-4 p-4 bg-neutral-800 rounded-lg">
  <h3 className="font-mono text-sm mb-2">Debug Rôles:</h3>
  <pre className="text-xs overflow-x-auto">
    {JSON.stringify({
      rolesLoaded: roles.length,
      rolesData: roles,
      loadingRoles: loadingData.roles,
      authToken: !!authToken,
      adminId: adminId
    }, null, 2)}
  </pre>
</div> */}


      <Input 
        label="Nombre de collaborateurs" 
        type="number" 
        value={formData.teamSize.toString()} 
        onChange={v => handleInputChange("teamSize", Number.parseInt(v) || 0)} 
        icon={Users} 
      />
      <p className="text-sm text-neutral-400 mb-4">Ajoutez les informations de vos collaborateurs ci-dessous.</p>
      
      {loadingData.roles ? ( 
        <div className="text-center py-2">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500 mb-2"></div>
          <p className="text-neutral-400 text-sm">Chargement des rôles...</p>
        </div>
      ) : roles.length === 0 ? (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-4">
          <p className="text-red-300">Aucun rôle disponible. Veuillez vérifier votre connexion ou contacter l'administrateur.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-orange-500 hover:text-orange-400"
          >
            Réessayer
          </button>
        </div>
      ) : null}

      <div className="space-y-4 mt-4">
        {[...Array(formData.teamSize)].map((_, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
              value={formData.teamMembers[idx]?.email || ""} 
              onChange={e => handleTeamMemberChange(idx, "email", e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Prénom" 
              className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
              value={formData.teamMembers[idx]?.firstName || ""} 
              onChange={e => handleTeamMemberChange(idx, "firstName", e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Nom" 
              className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
              value={formData.teamMembers[idx]?.lastName || ""} 
              onChange={e => handleTeamMemberChange(idx, "lastName", e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Téléphone" 
              className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
              value={formData.teamMembers[idx]?.phone || ""} 
              onChange={e => handleTeamMemberChange(idx, "phone", e.target.value)} 
            />
            <select 
              className="flex-1 px-2 py-2 rounded bg-neutral-900 text-white border border-neutral-700" 
              value={formData.teamMembers[idx]?.roleId || roles[0]?.id || ""} 
              onChange={e => handleTeamMemberChange(idx, "roleId", Number(e.target.value))}
              disabled={roles.length === 0}
            >
              {roles.length === 0 ? (
                <option value="">Chargement...</option>
              ) : (
                roles.map(r => (
                  <option value={r.id} key={r.id}>
                    {r.roleName}
                  </option>
                ))
              )}
            </select>
          </div>
        ))}
      </div>
      <button
                    type="button"
                    onClick={() => setShowPermission(true)}
                    className="text-orange-400 hover:text-orange-600"
                    aria-label="Voir les permissions des rôles"
                  >
                    <Info size={14} />
                  </button>
               {showPermission && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="bg-black border border-orange-500/30 rounded-lg shadow-2xl p-6 max-w-2xl w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-orange-400 transition-colors"
        onClick={() => setShowPermission(false)}
        aria-label="Fermer"
      >
        <X size={22} />
      </button>
      
      <h2 className="text-lg font-bold mb-4 text-orange-400">Niveau de permission</h2>
      
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="p-2 text-left text-gray-300"></th>
            <th className="p-2 font-semibold text-center text-orange-400">Accueil</th>
            <th className="p-2 font-semibold text-center text-orange-400">Gérant</th>
            <th className="p-2 font-semibold text-center text-orange-400">Collaborateur</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Agenda et rendez-vous", [true, true, true]],
            ["Gestion des clients", [true, true, true]],
            ["Caisse", [false, true, false]],
            ["Ajouter et inviter des clients", [true, true, true]],
            ["SMS / e-mail Marketing", [false, true, false]],
            ["Portfolio, avis et notes", [true, true, true]],
            ["Tableau de bord", [false, true, false]],
            ["Niveau de maîtrise", [false, true, false]],
            ["Gestion du personnel", [false, true, false]],
            ["Instantanés de perf. commerciale", [false, true, false]],
            ["Configuration", [false, true, false]],
          ].map(([label, rights], i) => (
            <tr key={i} className={i % 2 ? "bg-neutral-900/50" : "bg-neutral-800/30"}>
              <td className="p-2 text-gray-300">{label}</td>
              {(rights as boolean[]).map((val, j) => (
                <td className="p-2 text-center" key={j}>
                  {val ? (
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
                  ) : (
                    ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
    </div>
  );


 
}

    // ÉTAPE 4 : Horaires
    if (currentStep === 4) {
      return (
        <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Horaires d'ouverture</h2>
          <Input label="Ouverture" type="time" value={formData.openingTime} onChange={v => handleInputChange("openingTime", v)} icon={Clock} />
          <Input label="Fermeture" type="time" value={formData.closingTime} onChange={v => handleInputChange("closingTime", v)} icon={Clock} />
        </div>
      )
    }

    // ÉTAPE 5 : Activation
    if (currentStep === 5) {
      return (
        <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Activation</h2>
          <Input label="Date d'activation" type="date" value={formData.activationDate} onChange={v => handleInputChange("activationDate", v)} icon={Zap} />
          <Button 
            onClick={handleSubmitSalon} 
            icon={Zap} 
            loading={loading}
            disabled={loading}
          >
            Créer le salon
          </Button>
          {notification && (
            <div className={`mt-4 px-4 py-2 rounded text-sm font-semibold ${notification.type === "success" ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"}`}>
              {notification.message}
            </div>
          )}
        </div>
      )
    }

    // ÉTAPE 6 : Fin
    return (
      <div className="w-full px-4 sm:px-6 max-w-md mx-auto text-center">
        <div className="text-green-500 text-2xl mb-6">✔ Salon créé avec succès !</div>
        <Button onClick={() => router.push("/dashboard")}>Aller au dashboard</Button>
      </div>
    )
  }

  // UI générique
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 animate-pulse"
            style={{ backgroundImage: `linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)`, backgroundSize: "50px 50px" }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-neutral-900/50 via-transparent to-neutral-800/50"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-orange-500/20 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>
      <div className="relative z-10 p-2 sm:p-4 lg:p-6 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Scissors className="w-7 h-4 sm:w-6 sm:h-6 text-rose-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                BokCut
              </h1>
            </div>
            <p className="text-neutral-500 text-xs sm:text-sm tracking-wider animate-pulse">
              ◦ INITIALISATION SALON ◦
            </p>
          </div>
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          <div className="mb-6 sm:mb-8 lg:mb-1 animate-fade-in flex-1 flex items-center justify-center">
            <div className="w-full max-w-full">
              {renderStep()}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center max-w-md mx-auto gap-3 sm:gap-4 w-full px-4">
            <Button onClick={() => { if (currentStep > 0) setCurrentStep(currentStep - 1) }} variant="secondary" icon={ChevronLeft} disabled={currentStep === 0}>Précédent</Button>
            <div className="flex items-center space-x-2">
              <span className="text-neutral-500 text-xs sm:text-sm tracking-wider">ÉTAPE</span>
              <span className="text-orange-400 font-mono font-bold text-sm sm:text-base">{String(currentStep + 1).padStart(2, '0')}</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-500 font-mono text-sm sm:text-base">{String(totalSteps).padStart(2, '0')}</span>
            </div>
            <Button
              onClick={() => {
                if (currentStep === 0 && !adminId) return
                if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1)
              }}
              variant="primary"
              icon={currentStep === totalSteps - 1 ? Zap : ChevronRight}
              disabled={currentStep === totalSteps - 1}
            >
              {currentStep === totalSteps - 1 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        `}
      </style>
    </div>
  )
}

// Composants UI réutilisables
function Input({ label, ...props }: { label: string, placeholder?: string, type: string, value: string, onChange: (v: string) => void, icon?: any }) {
  return (
    <div className="relative group mb-2">
      <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 tracking-wider">{label}</label>
      <div className="relative">
        {props.icon && <props.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors z-10" size={16} />}
        <input
          {...props}
          className={`w-full ${props.icon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'} pr-3 sm:pr-4 py-2 sm:py-3 bg-neutral-900/80 backdrop-blur-sm border-2 rounded-lg text-white placeholder-neutral-500 transition-all duration-300 font-mono text-sm sm:text-base border-neutral-700 focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20`}
          onChange={e => props.onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
function Button({ children, onClick, icon: Icon, loading, variant = "primary", ...props }: any) {
  const variants: any = {
    primary: "bg-gradient-to-r from-orange-500 to-red-500 text-black hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-700 border-2 border-neutral-600 hover:border-neutral-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
  }
  return (
    <button type="button" onClick={onClick} disabled={props.disabled || loading}
      className={`relative overflow-hidden px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 tracking-wider transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base ${variants[variant]} ${props.className || ""}`}>
      <div className="flex items-center justify-center space-x-2">
        {Icon && <Icon size={16} />}
        <span>{loading ? "..." : children}</span>
      </div>
    </button>
  )
}
function StepIndicator({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8 lg:mb-12 px-4">
      <div className="flex items-center ">
        {[...Array(totalSteps)].map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={`relative w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-500 border-2 group flex-shrink-0 ${
                index <= currentStep
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-black shadow-lg shadow-orange-500/50 border-orange-500 scale-110"
                  : index === currentStep + 1 
                  ? "bg-neutral-800 text-orange-400 border-orange-500/50 animate-pulse"
                  : "bg-neutral-900 text-neutral-500 border-neutral-700"
              }`}
            >
              {index <= currentStep ? (
                <div className="animate-bounce text-xs sm:text-sm">✓</div>
              ) : index === currentStep + 1 ? (
                <Radar className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 animate-spin" />
              ) : (
                <span className="text-xs sm:text-sm">{index + 1}</span>
              )}
              {index === currentStep && (
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-20"></div>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-0.5 w-4 sm:w-8 lg:w-16 rounded-full transition-all duration-500 relative overflow-hidden flex-shrink-0 ${
                  index < currentStep 
                    ? "bg-gradient-to-r from-orange-500 to-red-500" 
                    : index === currentStep
                    ? "bg-gradient-to-r from-orange-500 to-neutral-700"
                    : "bg-neutral-700"
                }`}
              >
                {index === currentStep && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// Parse l'adresse issue de Nominatim
function parseAddress(addressObj: any) {
  if (!addressObj) return { rue: "", ville: "", codePostal: "", pays: "" };
  return {
    rue: addressObj.road || addressObj.house_number || "",
    ville: addressObj.city || addressObj.town || addressObj.village || "",
    codePostal: addressObj.postcode || "",
    pays: addressObj.country || "",
  };
}
function MapSearchCard({
  address,
  latitude,
  longitude,
  onAddressChange,
  onRequestDetect,
  loadingGPS,
}: {
  address: string;
  latitude: number | null;
  longitude: number | null;
  onAddressChange: (address: string, lat: number, lng: number, addressDetails?: any) => void;
  onRequestDetect: () => void;
  loadingGPS?: boolean;
}) {
  const [search, setSearch] = useState(address || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [marker, setMarker] = useState<{ lat: number; lng: number; title: string; details?: any } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude, title: address } : null
  );
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: latitude ?? 31.6295,
    lng: longitude ?? -7.9811,
  });
  const [zoom, setZoom] = useState(13);
  const [modalOpen, setModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Suggestions API
  const searchAddress = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
    setIsLoading(false);
  };

  // Sur changement de search dans l'input
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (search.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      searchAddress(search);
      setShowSuggestions(true);
    }, 350);
  }, [search]);

  // Sélection suggestion
  const selectSuggestion = (s: any) => {
    setSearch(s.display_name);
    setShowSuggestions(false);
    setMarker({ lat: Number(s.lat), lng: Number(s.lon), title: s.display_name, details: s.address });
    setCenter({ lat: Number(s.lat), lng: Number(s.lon) });
    setZoom(16);
    onAddressChange(s.display_name, Number(s.lat), Number(s.lon), s.address);
  };

  // Click sur la carte
  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>, full = false) => {
    // Coordonnées relatives (simple approx pour mini-carte ou modal)
    const ref = full ? modalRef : mapRef;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const latDelta = full ? 0.08 : 0.015;
    const lngDelta = full ? 0.15 : 0.025;
    const relLat = center.lat + latDelta * (1 - 2 * (y / rect.height));
    const relLng = center.lng + lngDelta * (2 * (x / rect.width) - 1);
    setMarker({ lat: relLat, lng: relLng, title: "Chargement..." });
    setCenter({ lat: relLat, lng: relLng });
    // Reverse geocode
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${relLat}&lon=${relLng}&addressdetails=1`
      );
      const data = await res.json();
      setSearch(data.display_name);
      setMarker({ lat: relLat, lng: relLng, title: data.display_name, details: data.address });
      onAddressChange(data.display_name, relLat, relLng, data.address);
    } catch {
      setMarker({ lat: relLat, lng: relLng, title: "Adresse inconnue" });
      onAddressChange("Adresse inconnue", relLat, relLng);
    }
  };

  // Détection GPS
  const handleDetect = async () => {
    if (loadingGPS) return;
    if (!navigator.geolocation) return;
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });
        setMarker({ lat: latitude, lng: longitude, title: "Chargement..." });
        // Reverse geocode
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          setSearch(data.display_name);
          setMarker({ lat: latitude, lng: longitude, title: data.display_name, details: data.address });
          onAddressChange(data.display_name, latitude, longitude, data.address);
        } catch {
          setMarker({ lat: latitude, lng: longitude, title: "Adresse inconnue" });
          onAddressChange("Adresse inconnue", latitude, longitude);
        }
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      }
    );
  };

  // Suppression adresse
  const handleClear = () => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    setMarker(null);
    onAddressChange("", null, null);
  };

  // Mini-carte/Modal refs
  const mapRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Affichage compact adresse
  const details = marker?.details ? parseAddress(marker.details) : { rue: "", ville: "", codePostal: "", pays: "" };

  // ---- UI ----
  return (
    <>
      <div className="bg-neutral-900/80 border border-orange-500/50 rounded-lg shadow-lg p-3 mt-4 mb-2">
        <label className="block text-xs font-medium text-neutral-300 mb-1 tracking-wider">Adresse du salon</label>
        <div className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-8 py-2 rounded bg-neutral-950 border border-neutral-700 text-white font-mono placeholder-neutral-500 text-sm"
              placeholder="Rue, ville, code postal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              autoComplete="off"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={15} />
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-500"
              onClick={handleClear}
              tabIndex={-1}
              type="button"
              aria-label="Effacer"
              style={{ display: search ? "inline" : "none" }}
            >
              <X size={16} />
            </button>
            {isLoading && <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 animate-spin text-orange-400" size={16} />}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full bg-neutral-900 border border-orange-500/30 rounded-lg shadow-xl mt-1 max-h-44 overflow-y-auto">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="px-3 py-2 hover:bg-orange-500/30 cursor-pointer flex items-center gap-2"
                  onClick={() => selectSuggestion(s)}
                >
                  <MapPin className="text-orange-500" size={15} />
                  <span className="truncate text-sm">{s.display_name}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="flex items-center gap-2 bg-neutral-800 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 px-3 py-1.5 rounded transition text-xs"
              onClick={handleDetect}
              disabled={isLoading || loadingGPS}
            >
              <Navigation size={14} /> GPS
            </button>
            <span className="text-xs text-neutral-500">ou cliquez sur la carte</span>
          </div>
          {/* Mini-carte */}
          <div className="w-full h-32 rounded-md border border-orange-500/20 bg-black relative overflow-hidden mt-2" ref={mapRef} style={{ minHeight: 90, cursor: "crosshair" }}>
            {/* Simple tile */}
            <img
              src={`https://tile.openstreetmap.org/${zoom}/${Math.floor((center.lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png`}
              alt="carte"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            {/* Marker */}
            {marker && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none"
                style={{ transform: "translate(-50%, -100%)" }}
              >
                <MapPin size={22} className="text-red-500 drop-shadow-lg" />
              </div>
            )}
            {/* Plein écran */}
            <button
              className="absolute bottom-2 right-2 bg-neutral-800/80 text-orange-400 rounded-full p-1 hover:bg-orange-500/40 transition z-20"
              type="button"
              onClick={() => setModalOpen(true)}
              aria-label="Agrandir la carte"
            >
              <Expand size={16} />
            </button>
            {/* Click sur la mini-carte */}
            <div
              className="absolute inset-0 cursor-crosshair z-10"
              onClick={(e) => handleMapClick(e, false)}
              title="Sélectionner un lieu sur la carte"
            />
          </div>
          {/* Adresse compacte (rue, ville, cp, pays) */}
          {marker?.details && (
            <div className="text-xs mt-2 flex flex-wrap gap-2 text-neutral-300">
              {details.rue && <span>🏠 {details.rue}</span>}
              {details.ville && <span>🏙️ {details.ville}</span>}
              {details.codePostal && <span>📮 {details.codePostal}</span>}
              {details.pays && <span>🌍 {details.pays}</span>}
            </div>
          )}
        </div>
      </div>
      {/* ---- MODAL FULL SCREEN MAP ---- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-neutral-900 rounded-lg shadow-2xl p-4 relative w-full max-w-2xl h-[65vh] flex flex-col">
            <button className="absolute top-3 right-3 text-neutral-400 hover:text-red-400" onClick={() => setModalOpen(false)} aria-label="Fermer">
              <X size={22} />
            </button>
            <div className="font-bold text-orange-400 mb-2 text-sm">Sélectionnez un point sur la carte</div>
            <div className="flex-1 w-full h-full relative" ref={modalRef} style={{ minHeight: 300 }}>
              <img
                src={`https://tile.openstreetmap.org/${zoom}/${Math.floor((center.lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png`}
                alt="carte"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
              {marker && (
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none"
                  style={{ transform: "translate(-50%, -100%)" }}
                >
                  <MapPin size={34} className="text-red-500 drop-shadow-lg" />
                </div>
              )}
              <div
                className="absolute inset-0 cursor-crosshair z-10"
                onClick={(e) => handleMapClick(e, true)}
                title="Sélectionner un lieu"
              />
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}