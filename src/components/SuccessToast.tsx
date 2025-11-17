import { CheckCircle } from "lucide-react"

interface SuccessToastProps {
  visible: boolean
  message?: string
}

export function SuccessToast({ visible, message = "¡Tu producto ha sido añadido exitosamente!" }: SuccessToastProps) {
  if (!visible) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
      <CheckCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  )
}
