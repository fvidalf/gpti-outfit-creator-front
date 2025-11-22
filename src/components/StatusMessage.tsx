interface StatusMessageProps {
  isLoading: boolean
  hasResults: boolean
  conversationalMessage?: string
}

export function StatusMessage({ isLoading, hasResults, conversationalMessage }: StatusMessageProps) {
  const text = isLoading
    ? "Estoy buscando tu outfit perfecto..."
    : conversationalMessage
      ? conversationalMessage
      : hasResults
        ? "Encontré esto para ti, ¿qué te parece?"
        : "¡Hola! Dime, ¿qué estás buscando?"

  return (
    <div className="mb-8">
      <p className="text-xl text-black text-left">{text}</p>
    </div>
  )
}
