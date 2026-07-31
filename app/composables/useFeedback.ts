const isOpen = ref(false)
const isCapturing = ref(false)
const screenshotFile = ref<File | null>(null)
const currentUrl = ref('')

export const useFeedback = () => {
  const triggerFeedback = async () => {
    isCapturing.value = true
    currentUrl.value = window.location.href
    screenshotFile.value = null // reset first
    
    // Give the UI a moment to show the loader spinner
    await new Promise((resolve) => setTimeout(resolve, 200))
    
    try {
      const { domToBlob } = await import('modern-screenshot')
      const targetElement = document.body

      const width = window.innerWidth
      const height = window.innerHeight
      const scrollX = window.scrollX || window.pageXOffset || 0
      const scrollY = window.scrollY || window.pageYOffset || 0
      
      const blob = await domToBlob(targetElement, {
        width,
        height,
        scrollX,
        scrollY,
        filter: (node: Node) => {
          if (node instanceof HTMLElement) {
            if (
              node.id === 'feedback-loader' || 
              node.classList.contains('feedback-exclude') ||
              node.classList.contains('u-toaster')
            ) {
              return false
            }
          }
          return true
        }
      } as any)
      
      if (blob) {
        screenshotFile.value = new File([blob], `screenshot_${Date.now()}.png`, { type: 'image/png' })
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error)
      screenshotFile.value = null
    } finally {
      isCapturing.value = false
      isOpen.value = true
    }
  }

  return {
    isOpen,
    isCapturing,
    screenshotFile,
    currentUrl,
    triggerFeedback
  }
}