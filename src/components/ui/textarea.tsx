import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const combinedRef = React.useMemo(() => {
    return (node: HTMLTextAreaElement) => {
      textareaRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }
  }, [ref])

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to calculate proper scrollHeight
      textarea.style.height = '0px'
      const scrollHeight = textarea.scrollHeight
      // Set height to scrollHeight (which includes all padding)
      textarea.style.height = scrollHeight + 'px'
    }
  }, [])

  React.useEffect(() => {
    adjustHeight()
  }, [props.value, adjustHeight])

  return (
    <textarea
      className={cn(
        "flex w-full rounded-md bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-hidden",
        className
      )}
      ref={combinedRef}
      style={props.style}
      onInput={(e) => {
        adjustHeight()
        if (props.onInput) props.onInput(e)
      }}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
