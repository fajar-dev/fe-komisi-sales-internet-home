export const handleServiceError = (error: any): never => {
    const toast = useToast()
    const message = error.response?.data?.message || 'An error occurred'
    toast.add({ description: message, color: 'error' })
    throw new Error(message)
}
