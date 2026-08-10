const NUSAFIBER_IDS = ['BFLITE']
const NUSASELECTA_IDS = ['NFSP030', 'NFSP100', 'NFSP200']
const HOME_IDS = ['HOME100', 'HOMESTD100', 'HOMEADV', 'HOMEADV200', 'HOMEPREM300', 'HOME300', 'LITE100', 'LITE200']

export const useServiceLabel = () => {
    const getServiceLabel = (category: string | null | undefined, serviceId: string | null | undefined) => {
        const trimmedCategory = category?.trim()
        if (trimmedCategory === 'Alat') return { label: 'Alat', color: 'error' as const }
        if (trimmedCategory === 'Digital Business') return { label: 'Digital Business', color: 'success' as const }

        const id = serviceId ?? ''
        if (NUSAFIBER_IDS.some(c => id.startsWith(c))) return { label: 'Nusafiber', color: 'info' as const }
        if (NUSASELECTA_IDS.some(c => id.startsWith(c))) return { label: 'NusaSelecta', color: 'warning' as const }
        if (HOME_IDS.some(c => id.startsWith(c))) return { label: 'Home', color: 'primary' as const }

        // Everything else (FO, FO Prepaid non-Nusafiber ids, IP Public, Wireless, Starlink, CPE Rental, Cicilan, ...)
        return { label: 'Access Business', color: 'neutral' as const }
    }

    return { getServiceLabel }
}
