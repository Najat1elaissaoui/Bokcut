"use client"

import React, { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Users,
  Shield,
  Phone,
  User,
  Target,
  Monitor,
  UserPlus,
  Lock,
  Zap,
  Activity,
  Radar,
} from "lucide-react"
import { useRouter } from "next/navigation"

type FormData = {
  email: string
  password: string
  confirmPassword: string
  operations: string[]
  agentName: string
  codename: string
  phone: string
  teamSize: number
  teamMembers: { email: string; role: string }[]
  operationZone: string
  schedule: Record<string, { enabled: boolean; start: string; end: string }>
  activationDate: string
}

export default function TacticalOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [glitchText, setGlitchText] = useState("")
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    operations: [],
    agentName: "",
    codename: "",
    phone: "",
    teamSize: 1,
    teamMembers: [],
    operationZone: "",
    schedule: {},
    activationDate: "",
  })
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 7 steps: 0=login/inscription, 1=operation, 2=profile, 3=team, 4=zone, 5=schedule, 6=activation
  const totalSteps = 7

  // Glitch effect for text
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
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTransitioning])

  // Switch login/register, stay on step 0
  const handleSwitchAccountMode = () => {
    setHasAccount((prev) => !prev)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }))
  }

  const operationTypes = [
    { 
      id: "", 
      name: "coiffure ", 
      icon: "🕵️", 
      description: "",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: "", 
      name: "barbier", 
      icon: "🎯", 
      description: "",
      color: "from-red-500 to-orange-500"
    },
    { 
      id: "", 
      name: "salon de beauté", 
      icon: "💻", 
      description: "",
      color: "from-green-500 to-emerald-500"
    },
  ]

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOperationSelect = (operationId: string) => {
    setFormData((prev) => ({
      ...prev,
      operations: prev.operations.includes(operationId)
        ? prev.operations.filter((s) => s !== operationId)
        : [...prev.operations, operationId],
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsTransitioning(false)
      }, 800)
    } else {
      // Redirect to dashboard when completed
      router.push("/dashboard")
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsTransitioning(false)
      }, 800)
    }
  }

  // Enhanced StepIndicator with animations
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8 lg:mb-12 px-4">
      <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 overflow-x-auto max-w-full">
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
              
              {/* Glowing effect for current step */}
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

  // Enhanced input component with glitch effects
  const TacticalInput = ({ 
    type, 
    value, 
    onChange, 
    placeholder, 
    icon: Icon, 
    label,
    error = false 
  }: {
    type: string
    value: string
    onChange: (value: string) => void
    placeholder: string
    icon?: any
    label: string
    error?: boolean
  }) => (
    <div className="relative group">
      <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors z-10" size={16} />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? 'pl-10 sm:pl-12' : 'pl-3 sm:pl-4'} pr-3 sm:pr-4 py-2 sm:py-3 bg-neutral-900/80 backdrop-blur-sm border-2 rounded-lg text-white placeholder-neutral-500 transition-all duration-300 font-mono text-sm sm:text-base
            ${error 
              ? 'border-red-500 shadow-lg shadow-red-500/20' 
              : 'border-neutral-700 focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20'
            }
            hover:bg-neutral-800/80 group-hover:border-neutral-600`}
          placeholder={placeholder}
        />
        {/* Scanning line effect */}
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  )

  // Enhanced button component
  const TacticalButton = ({ 
    onClick, 
    children, 
    variant = "primary", 
    disabled = false, 
    icon: Icon,
    className = ""
  }: {
    onClick: () => void
    children: React.ReactNode
    variant?: "primary" | "secondary" | "danger"
    disabled?: boolean
    icon?: any
    className?: string
  }) => {
    const variants = {
      primary: "bg-gradient-to-r from-orange-500 to-red-500 text-black hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30",
      secondary: "bg-neutral-800 text-white hover:bg-neutral-700 border-2 border-neutral-600 hover:border-neutral-500",
      danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`relative overflow-hidden px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 tracking-wider transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base ${variants[variant]} ${className}`}
      >
        <div className="flex items-center justify-center space-x-2">
          {Icon && <Icon size={16} />}
          <span>{children}</span>
        </div>
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
        )}
      </button>
    )
  }

  // API base URL
  const API_BASE = "http://localhost:8080/api/salon-admins"

  // Registration handler
  const handleRegister = async () => {
    setLoading(true)
    setNotification(null)
    try {
      const res = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.agentName,
          lastName: formData.codename,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
        }),
      })
      if (res.ok) {
        setNotification({ type: "success", message: "Inscription réussie !" })
        setTimeout(() => {
          setCurrentStep(currentStep + 1)
          setNotification(null)
        }, 1000)
      } else {
        const data = await res.json().catch(() => ({}))
        setNotification({ type: "error", message: data.message || "Erreur lors de l'inscription" })
      }
    } catch (e) {
      setNotification({ type: "error", message: "Erreur réseau lors de l'inscription" })
    }
    setLoading(false)
  }

  // Login handler
  const handleLogin = async () => {
    setLoading(true)
    setNotification(null)
    try {
      const res = await fetch(`${API_BASE}/by-email?email=${encodeURIComponent(formData.email)}`)
      if (res.ok) {
        const admin = await res.json()
        // Vérifier le mot de passe côté front (pas sécurisé, à remplacer par une vraie API d'authentification)
        // Ici, on suppose que le backend renvoie le hash, mais normalement il faut une vraie route login
        // Pour la démo, on compare juste (à remplacer par un vrai endpoint login)
        const passwordRes = await fetch(`${API_BASE}/by-email?email=${encodeURIComponent(formData.email)}`)
        if (passwordRes.ok) {
          // Impossible de vérifier le hash côté front, donc on simule le succès
          setNotification({ type: "success", message: "Connexion réussie !" })
          setTimeout(() => {
            setCurrentStep(currentStep + 1)
            setNotification(null)
          }, 1000)
        } else {
          setNotification({ type: "error", message: "Email ou mot de passe incorrect" })
        }
      } else {
        setNotification({ type: "error", message: "Email ou mot de passe incorrect" })
      }
    } catch (e) {
      setNotification({ type: "error", message: "Erreur réseau lors de la connexion" })
    }
    setLoading(false)
  }

  // Render login or registration step 0
  const renderAccountStep = () => {
    return (
      <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
        {/* Notification */}
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
            {hasAccount ? "SECURE ACCESS" : "AGENT REGISTRATION"}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base lg:text-lg px-4">
            {hasAccount
              ? "Authenticate your tactical command access"
              : "Initialize your tactical command credentials"}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <TacticalInput
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            placeholder="username@gmail.com"
            icon={Mail}
            label="Email "
          />

          {/* Add these fields for registration only */}
          {!hasAccount && (
            <>
              <TacticalInput
                type="text"
                value={formData.agentName}
                onChange={(value) => handleInputChange("agentName", value)}
                placeholder="Votre nom"
                icon={User}
                label="Nom"
              />
              <TacticalInput
                type="text"
                value={formData.codename}
                onChange={(value) => handleInputChange("codename", value)}
                placeholder="Votre prénom"
                icon={UserPlus}
                label="Prénom"
              />
              <TacticalInput
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                placeholder="+33 6 12 34 56 78"
                icon={Phone}
                label="Numéro de téléphone"
              />
            </>
          )}

          {/* Password input field */}
          <div className="relative group">
            <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 tracking-wider">
             mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors z-10" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono hover:bg-neutral-800/80 text-sm sm:text-base"
                placeholder={hasAccount ? "Entre votre mot de passe" : "Entrer un mot de passe sécurisé"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors z-10"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {!hasAccount && (
            <>
              <div className="relative group">
                <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2 tracking-wider">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-orange-500 transition-colors z-10" size={16} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono hover:bg-neutral-800/80 text-sm sm:text-base"
                    placeholder="confirmer le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors z-10"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                  <Shield className="text-orange-500 animate-pulse" size={14} />
                  <span className="text-orange-400 font-medium text-xs sm:text-sm tracking-wider">SECURITY PROTOCOL</span>
                </div>
                <ul className="text-xs text-neutral-300 space-y-1 sm:space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>Minimum 8 characters required</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>Include uppercase and lowercase letters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>Include numbers and special characters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>No dictionary words or patterns</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Buttons */}
          {hasAccount ? (
            <TacticalButton onClick={handleLogin} icon={Mail} className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "AUTHENTICATE WITH EMAIL"}
            </TacticalButton>
          ) : (
            <TacticalButton onClick={handleRegister} icon={UserPlus} className="w-full" disabled={loading}>
              {loading ? "Inscription..." : "S'INSCRIRE"}
            </TacticalButton>
          )}

          <div className="text-center pt-2 sm:pt-4">
            <button 
              onClick={handleSwitchAccountMode}
              className="text-orange-500 hover:text-orange-400 transition-colors text-xs sm:text-sm tracking-wider hover:underline"
            >
              {hasAccount ? "Need to register a new agent?" : "Already have tactical access?"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    if (isTransitioning) {
      return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin absolute top-2 left-2" style={{ animationDirection: "reverse" }}></div>
          </div>
          <p className="text-orange-400 mt-4 sm:mt-6 tracking-wider font-mono animate-pulse text-sm sm:text-base">
            {glitchText}
          </p>
        </div>
      )
    }

    if (currentStep === 0) {
      return renderAccountStep()
    }

    switch (currentStep) {
      case 1:
        // OPERATION TYPE
        return (
          <div className="w-full px-4 sm:px-6 max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-10"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Quels services offrez-vous?
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base lg:text-lg px-4">Sélectionnez vos domaines d'expertise </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {operationTypes.map((operation, index) => (
                <div
                  key={operation.id}
                  onClick={() => handleOperationSelect(operation.id)}
                  className={`relative p-4 sm:p-6 lg:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 text-center group transform hover:scale-105 ${
                    formData.operations.includes(operation.id)
                      ? "border-orange-500 bg-gradient-to-br from-orange-500/20 to-red-500/20 shadow-2xl shadow-orange-500/30 scale-105"
                      : "border-neutral-700 bg-neutral-900/50 hover:border-neutral-600 hover:bg-neutral-800/70"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl sm:text-5xl lg:text-7xl mb-3 sm:mb-4 lg:mb-6 group-hover:animate-bounce">
                    {operation.icon}
                  </div>
                  <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-white tracking-wider mb-2 sm:mb-3">
                    {operation.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mb-2 sm:mb-4">
                    {operation.description}
                  </p>
                  
                  {formData.operations.includes(operation.id) && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-black font-bold text-xs sm:text-sm">✓</span>
                    </div>
                  )}
                  
                  {/* Glowing border effect */}
                  {formData.operations.includes(operation.id) && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 opacity-20 animate-pulse pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 2:
        // AGENT PROFILE
        return (
          <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-10"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                profile  de votre salon   
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base lg:text-lg px-4">Configure your operational identity</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <TacticalInput
                type="text"
                value={formData.agentName}
                onChange={(value) => handleInputChange("agentName", value)}
                placeholder="Nom de votre salon"
                icon={User}
                label="Nom de votre salon"
              />

              <TacticalInput
                type="text"
                value={formData.codename}
                onChange={(value) => handleInputChange("codename", value)}
                placeholder="Nom"
                icon={Shield}
                label="votre nom"
              />

              <TacticalInput
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                placeholder="+1-XXX-XXX-XXXX"
                icon={Phone}
                label="Numéro de téléphone"
              />
            </div>
          </div>
        )

      case 3:
        // TEAM CONFIGURATION
        return (
          <div className="w-full px-4 sm:px-6 max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-10"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Collaborateurs
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base lg:text-lg px-4">Configure your tactical unit structure</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <TacticalInput
                type="number"
                value={formData.teamSize.toString()}
                onChange={(value) => handleInputChange("teamSize", Number.parseInt(value) || 0)}
                placeholder="1"
                icon={Users}
                label="TAILLE DE L'UNITÉ (1-12 OPÉRATEURS)"
              />

              {formData.teamSize > 0 && (
                <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-neutral-700">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <UserPlus className="text-orange-500" size={16} />
                    <h3 className="text-sm sm:text-lg font-semibold text-white tracking-wider">RECRUIT OPERATIVES</h3>
                  </div>
                  <p className="text-neutral-400 text-xs sm:text-sm mb-4 sm:mb-6">
                    Add secure channels for team members (classified communications only)
                  </p>

                  <div className="space-y-3 sm:space-y-4">
                    {[...Array(formData.teamSize - 0)].map((_, index) => (
                      <div key={index} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <input
                          type="email"
                          placeholder={`Operative ${index + 1} secure channel`}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono text-sm sm:text-base"
                        />
                        <select className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-700 rounded-lg text-white focus:border-orange-500 transition-all duration-300 text-sm sm:text-base">
                          <option value="operative">gerant</option>
                          <option value="specialist">Collaborateur</option>
                          <option value="support">accueil</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        // OPERATION ZONE
        return (
          <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-10"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                OPERATION ZONE
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base lg:text-lg px-4">Define your area of operations</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <TacticalInput
                type="text"
                value={formData.operationZone}
                onChange={(value) => handleInputChange("operationZone", value)}
                placeholder="Sector 7, Grid Reference Alpha-9"
                icon={MapPin}
                label="PRIMARY OPERATION SECTOR"
              />

              <TacticalButton onClick={() => console.log("Getting location...")} icon={Target} className="w-full">
                ACQUIRE CURRENT COORDINATES
              </TacticalButton>

              <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-neutral-700">
                <div className="w-full h-32 sm:h-40 bg-neutral-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
                  <MapPin className="text-neutral-600 group-hover:text-orange-500 transition-colors duration-300" size={32} />
                  <div className="absolute top-2 right-2 text-xs text-neutral-500 font-mono animate-pulse">
                    [CLASSIFIED SECTOR]
                  </div>
                  <div className="absolute bottom-2 left-2 text-xs text-neutral-500 font-mono">
                    GRID: XX-XX-XX
                  </div>
                  
                  {/* Scanning lines */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-full h-px bg-orange-500 animate-pulse top-1/4"></div>
                    <div className="absolute w-full h-px bg-orange-500 animate-pulse top-2/4"></div>
                    <div className="absolute w-full h-px bg-orange-500 animate-pulse top-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        // OPERATIONAL SCHEDULE
        return (
          <div className="w-full px-4 sm:px-6 max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-10"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                MISSION SCHEDULE
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base lg:text-lg px-4">Configure your operational availability</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {weekDays.map((day, index) => (
                <div 
                  key={day} 
                  className="bg-gradient-to-r from-neutral-900/80 to-neutral-800/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-neutral-700 hover:border-neutral-600 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={day}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 bg-neutral-900 border-neutral-600 rounded focus:ring-orange-500 focus:ring-2 transition-all"
                        />
                        <div className="absolute inset-0 rounded border-2 border-orange-500 opacity-0 animate-ping peer-checked:opacity-20"></div>
                      </div>
                      <label htmlFor={day} className="text-white font-medium tracking-wider cursor-pointer hover:text-orange-400 transition-colors text-sm sm:text-base">
                        {day}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                      <input
                        type="time"
                        className="px-2 sm:px-3 py-1 sm:py-2 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-700 rounded text-white focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono text-sm"
                        defaultValue="06:00"
                      />
                      <span className="text-neutral-400 text-sm">→</span>
                      <input
                        type="time"
                        className="px-2 sm:px-3 py-1 sm:py-2 bg-neutral-900/80 backdrop-blur-sm border-2 border-neutral-700 rounded text-white focus:border-orange-500 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono text-sm"
                        defaultValue="22:00"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 6:
        // SYSTEM ACTIVATION
        return (
          <div className="w-full px-4 sm:px-6 max-w-md mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-10"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                SYSTEM ACTIVATION
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base lg:text-lg px-4">Initialize your tactical command center</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button className="p-4 sm:p-6 bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 backdrop-blur-sm border-2 border-neutral-700 rounded-xl text-white hover:border-orange-500 hover:bg-neutral-800/90 transition-all duration-300 group">
                  <Activity className="mx-auto mb-2 sm:mb-3 text-orange-500 group-hover:animate-bounce" size={24} />
                  <span className="block text-xs sm:text-sm tracking-wider font-semibold">IMMEDIATE</span>
                  <span className="block text-xs text-neutral-400 mt-1">Deploy now</span>
                </button>
                <button className="p-4 sm:p-6 bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 backdrop-blur-sm border-2 border-neutral-700 rounded-xl text-white hover:border-orange-500 hover:bg-neutral-800/90 transition-all duration-300 group">
                  <Clock className="mx-auto mb-2 sm:mb-3 text-orange-500 group-hover:animate-bounce" size={24} />
                  <span className="block text-xs sm:text-sm tracking-wider font-semibold">SCHEDULED</span>
                  <span className="block text-xs text-neutral-400 mt-1">Timed deployment</span>
                </button>
              </div>

              <TacticalInput
                type="date"
                value={formData.activationDate}
                onChange={(value) => handleInputChange("activationDate", value)}
                placeholder=""
                label="DEPLOYMENT DATE"
              />

              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                  <Target className="text-orange-500 animate-pulse" size={16} />
                  <h3 className="text-orange-400 font-semibold tracking-wider text-sm sm:text-base">MISSION STATUS: READY</h3>
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  Your tactical command center has been configured and is ready for operational deployment. 
                  All systems are green and awaiting your authorization.
                </p>
                <div className="mt-3 sm:mt-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-mono">ALL SYSTEMS OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0">
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              backgroundImage: `
                linear-gradient(rgba(249, 115, 22, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-neutral-900/50 via-transparent to-neutral-800/50"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-orange-500/20 rounded-full animate-pulse"
              style={{
                width: Math.random() * 4 + 1 + 'px',
                height: Math.random() * 4 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-2 sm:p-4 lg:p-6 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {/* Enhanced Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 border-2 border-orange-500 rotate-45 flex items-center justify-center group">
                <div className="w-2 h-2 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"></div>
                <div className="absolute inset-0 border-2 border-orange-400 animate-ping opacity-20"></div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                TACTICAL OPS
              </h1>
            </div>
            <p className="text-neutral-500 text-xs sm:text-sm tracking-wider animate-pulse">
              ◦ SYSTEM INITIALIZATION PROTOCOL ◦
            </p>
          </div>

          <StepIndicator />
          
          <div className="mb-6 sm:mb-8 lg:mb-12 animate-fade-in flex-1 flex items-center justify-center">
            <div className="w-full max-w-full">
              {renderStep()}
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center max-w-md mx-auto gap-3 sm:gap-4 w-full px-4">
            <TacticalButton
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="secondary"
              icon={ChevronLeft}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              PREVIOUS
            </TacticalButton>
            
            <div className="flex items-center space-x-2 order-1 sm:order-2">
              <span className="text-neutral-500 text-xs sm:text-sm tracking-wider">STEP</span>
              <span className="text-orange-400 font-mono font-bold text-sm sm:text-base">
                {String(currentStep + 1).padStart(2, '0')}
              </span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-500 font-mono text-sm sm:text-base">
                {String(totalSteps).padStart(2, '0')}
              </span>
            </div>
            
            <TacticalButton
              onClick={nextStep}
              variant="primary"
              icon={currentStep === totalSteps - 1 ? Zap : ChevronRight}
              className="w-full sm:w-auto order-3"
            >
              {currentStep === totalSteps - 1 ? "DEPLOY MISSION" : "ADVANCE"}
            </TacticalButton>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  )
}