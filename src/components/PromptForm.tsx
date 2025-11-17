import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PromptFormProps {
  prompt: string
  isLoading: boolean
  onPromptChange: (value: string) => void
  onSubmit: () => void
}

export function PromptForm({ prompt, isLoading, onPromptChange, onSubmit }: PromptFormProps) {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex gap-4 items-end border-4 border-gradient rounded-lg focus:border-purple-400">
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
          placeholder="Quiero un look para los días más calurosos de primavera..."
          className="flex-1 min-h-0 p-4 border-none focus:border-none transition-colors resize-none text-indigo-700 md:text-md"
        />
        <Button
          onClick={onSubmit}
          disabled={isLoading || !prompt.trim()}
          className="bg-transparent border-0 shadow-none p-0 my-auto mx-4 hover:bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-500 [&_svg]:!w-8 [&_svg]:!h-8 opacity-80 hover:opacity-100"
        >
          <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sparklesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5170ff" />
                <stop offset="100%" stopColor="#ff66c4" />
              </linearGradient>
            </defs>
            <path
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22.5l-.394-1.933a2.25 2.25 0 00-1.423-1.423L12.75 18.75l1.933-.394a2.25 2.25 0 001.423-1.423L16.5 15l.394 1.933a2.25 2.25 0 001.423 1.423l1.933.394-1.933.394a2.25 2.25 0 00-1.423 1.423z"
              fill="url(#sparklesGradient)"
            />
          </svg>
        </Button>
      </div>
    </div>
  )
}
