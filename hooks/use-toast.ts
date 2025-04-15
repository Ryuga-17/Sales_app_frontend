"use client"

// A simplified toast hook for local development
// In a real app, you'd use a proper toast library

import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== props))
    }, 3000)

    // Log to console for now
    console.log(`Toast: ${props.title} - ${props.description}`)
  }

  return { toast, toasts }
}
