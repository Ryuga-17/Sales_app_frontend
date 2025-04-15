"use client"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Toast() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`rounded-lg border p-4 shadow-md ${
            toast.variant === "destructive"
              ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
              : "border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              {toast.title && <h5 className="font-medium">{toast.title}</h5>}
              {toast.description && <p className="text-sm">{toast.description}</p>}
            </div>
            <button className="ml-4 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
