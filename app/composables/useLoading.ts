export const useLoading = () => {
    const isLoading = useState('global-loading', () => false)

    const setLoading = (value: boolean) => {
        isLoading.value = value
    }

    return {
        isLoading,
        setLoading
    }
}
