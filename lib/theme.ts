// Theme configuration file for easy customization
export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Main blue
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },

    // Secondary colors
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },

    // Status colors
    success: {
      light: "#10b981",
      dark: "#34d399",
    },
    warning: {
      light: "#f59e0b",
      dark: "#fbbf24",
    },
    error: {
      light: "#ef4444",
      dark: "#f87171",
    },
    info: {
      light: "#3b82f6",
      dark: "#60a5fa",
    },

    // Service type colors
    services: {
      haircut: {
        light: "#8b5cf6",
        dark: "#a78bfa",
      },
      beard: {
        light: "#f59e0b",
        dark: "#fbbf24",
      },
      shampoo: {
        light: "#06b6d4",
        dark: "#22d3ee",
      },
      styling: {
        light: "#ec4899",
        dark: "#f472b6",
      },
      premium: {
        light: "#eab308",
        dark: "#facc15",
      },
    },
  },

  // Component styles
  components: {
    card: {
      light: {
        background: "bg-white",
        border: "border-neutral-200",
        text: "text-black",
        shadow: "shadow-sm hover:shadow-md",
      },
      dark: {
        background: "bg-neutral-900",
        border: "border-neutral-700",
        text: "text-white",
        shadow: "shadow-lg hover:shadow-xl",
      },
    },

    button: {
      primary: {
        light: "bg-blue-500 hover:bg-blue-600 text-white",
        dark: "bg-blue-500 hover:bg-blue-600 text-white",
      },
      secondary: {
        light: "bg-white hover:bg-neutral-50 text-black border border-neutral-200",
        dark: "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700",
      },
      ghost: {
        light: "hover:bg-neutral-100 text-neutral-600 hover:text-black",
        dark: "hover:bg-neutral-800 text-neutral-400 hover:text-white",
      },
    },

    input: {
      light: "bg-white border-neutral-300 text-black placeholder-neutral-500 focus:border-blue-500",
      dark: "bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500",
    },

    modal: {
      light: "bg-white border-neutral-200",
      dark: "bg-neutral-900 border-neutral-700",
    },
  },

  // Layout
  layout: {
    sidebar: {
      light: "bg-white border-neutral-200 shadow-lg",
      dark: "bg-neutral-900 border-neutral-700",
    },
    header: {
      light: "bg-white border-neutral-200",
      dark: "bg-neutral-800 border-neutral-700",
    },
  },
}

// Helper function to get theme classes
export const getThemeClasses = (component: string, variant = "default", isDark = true) => {
  const themeMode = isDark ? "dark" : "light"

  switch (component) {
    case "card":
      return theme.components.card[themeMode]
    case "button":
      return (
        theme.components.button[variant as keyof typeof theme.components.button]?.[themeMode] ||
        theme.components.button.primary[themeMode]
      )
    case "input":
      return theme.components.input[themeMode]
    case "modal":
      return theme.components.modal[themeMode]
    case "sidebar":
      return theme.layout.sidebar[themeMode]
    case "header":
      return theme.layout.header[themeMode]
    default:
      return ""
  }
}

// Service type color helper
export const getServiceColor = (serviceType: string, isDark = true) => {
  const themeMode = isDark ? "dark" : "light"
  const serviceKey = serviceType.toLowerCase().replace(/\s+/g, "") as keyof typeof theme.colors.services

  return theme.colors.services[serviceKey]?.[themeMode] || theme.colors.services.haircut[themeMode]
}
