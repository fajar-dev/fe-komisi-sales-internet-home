type AchievementColorKey = 'red' | 'orange' | 'violet' | 'emerald' | 'teal' | 'green' | 'primary'

const badgeClasses: Record<AchievementColorKey, string> = {
    red: 'text-red-500 dark:text-red-400 border-red-200 dark:border-red-800',
    orange: 'text-orange-500 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    violet: 'text-violet-500 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    emerald: 'text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    teal: 'text-teal-500 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    green: 'text-green-500 dark:text-green-400 border-green-200 dark:border-green-800',
    primary: 'text-primary-500 dark:text-primary-400 border-primary-200 dark:border-primary-800'
}

const textClasses: Record<AchievementColorKey, string> = {
    red: 'font-bold text-red-500 dark:text-red-400',
    orange: 'font-bold text-orange-500 dark:text-orange-400',
    violet: 'font-bold text-violet-500 dark:text-violet-400',
    emerald: 'font-bold text-emerald-500 dark:text-emerald-400',
    teal: 'font-bold text-teal-500 dark:text-teal-400',
    green: 'font-bold text-green-500 dark:text-green-400',
    primary: 'font-bold text-primary-500 dark:text-primary-400'
}

/** Single source of truth for which achievement status maps to which color. */
function achievementColorKey(status: string): AchievementColorKey {
    const s = status.toLowerCase()
    if (s.includes('tidak capai') || s.includes('sp1')) return 'red'
    if (s.includes('average')) return 'orange'
    if (s.includes('bonus')) return 'violet'
    if (s.includes('excelent') || s.includes('excellent')) return 'emerald'
    if (s.includes('very good')) return 'teal'
    if (s.includes('capai target')) return 'green'
    return 'primary'
}

export const useAchievementColor = () => {
    const getAchievementBadgeClass = (status: string): string => badgeClasses[achievementColorKey(status)]
    const getAchievementTextClass = (status: string): string => textClasses[achievementColorKey(status)]

    return {
        getAchievementBadgeClass,
        getAchievementTextClass
    }
}
