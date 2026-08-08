<template>
    <div class="space-y-6 md:space-y-8">
        <!-- Top Grid: Service Activity & Achievement -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <!-- Col 1: Service Breakdown -->
            <div class="space-y-3 md:space-y-4">
                <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                    New Service Activity
                </h4>
                <div class="grid grid-cols-1 gap-2 md:gap-3">
                    <div
                        v-for="group in serviceGroupOrder"
                        :key="group"
                        :class="['p-3 md:p-4 rounded-lg md:rounded-xl border flex justify-between items-center transition-all', groupColor[group]!.bg]"
                    >
                        <span :class="['text-sm font-semibold', groupColor[group]!.text]">{{ group }}</span>
                        <span :class="['text-lg sm:text-xl font-bold', groupColor[group]!.textStrong]">
                            {{ data.byServiceGroup[group]?.new.count ?? 0 }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Col 2: Categories Counts -->
            <div class="space-y-3 md:space-y-4">
                <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <UIcon name="i-heroicons-rectangle-stack" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                    Category Summary
                </h4>
                <div class="grid grid-cols-2 gap-2 md:gap-3 h-full content-start">
                    <div
                        v-for="cat in categoryCards"
                        :key="cat.label"
                        :class="['flex justify-between items-center p-2 md:p-3 rounded-lg md:rounded-xl border transition-colors', cat.color.bg]"
                    >
                        <span :class="['text-xs font-medium uppercase', cat.color.text]">{{ cat.label }}</span>
                        <span :class="['text-sm font-bold px-2 py-0.5 rounded bg-white/50 dark:bg-black/20', cat.color.textStrong]">{{ cat.count }}</span>
                    </div>
                </div>
            </div>

            <!-- Col 3: Achievement -->
            <div class="space-y-3 md:space-y-4 flex flex-col">
                <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <UIcon name="i-heroicons-trophy" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                    Achievement
                </h4>
                <div class="p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div class="flex justify-between items-start mb-4 md:mb-6">
                        <div class="flex flex-col gap-2 md:gap-3">
                            <div>
                                <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 md:mb-1.5 tracking-wide">Status</p>
                                <span :class="['text-xs sm:text-sm font-bold uppercase px-2 md:px-2.5 py-0.5 md:py-1 rounded-md border bg-gray-50 dark:bg-gray-800', getAchievementBadgeClass(data.achievementStatus)]">
                                    {{ data.achievementStatus }}
                                </span>
                            </div>
                            <div>
                                <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 tracking-wide">Employment Status</p>
                                <span class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{{ data.status ?? '-' }}</span>
                            </div>
                            <div>
                                <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 tracking-wide">Activity</p>
                                <span class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{{ data.activityCount }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="pt-3 md:pt-4 border-t border-gray-100 dark:border-gray-800">
                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic font-medium leading-relaxed">
                            "{{ data.motivation }}"
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 2: Financial Breakdown (Grid) -->
        <div>
            <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3 md:mb-4">
                <UIcon name="i-heroicons-banknotes" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                Financial Breakdown
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-4 md:gap-6 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800">
                <div v-for="box in financialBoxes" :key="box.title">
                    <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{{ box.title }}</h5>
                    <ul class="space-y-2 md:space-y-3">
                        <li v-for="row in box.rows" :key="row.label" class="flex justify-between items-center text-xs sm:text-sm">
                            <span class="text-gray-600 dark:text-gray-400">{{ row.label }}</span>
                            <span :class="['font-semibold', box.negative ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white']">
                                {{ box.negative ? '-' : '' }}{{ box.isCount ? row.value : formatCurrency(row.value) }}
                            </span>
                        </li>
                        <li v-if="box.total !== undefined" class="flex justify-between items-center text-xs sm:text-sm pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                            <span class="font-bold text-gray-900 dark:text-white">Total</span>
                            <span class="font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(box.total) }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChurnRow, SalesCommissionData } from '~/types/sales'

const props = defineProps<{
    data: SalesCommissionData
    churnData: ChurnRow[]
}>()

const { formatCurrency } = useFormat()
const { getAchievementBadgeClass } = useAchievementColor()

const serviceGroupOrder = ['Home', 'NusaSelecta', 'Nusafiber'] as const
const groupColor: Record<string, { bg: string; text: string; textStrong: string }> = {
    Home: { bg: 'bg-sky-50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-800', text: 'text-sky-700 dark:text-sky-300', textStrong: 'text-sky-900 dark:text-sky-100' },
    NusaSelecta: { bg: 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300', textStrong: 'text-orange-900 dark:text-orange-100' },
    Nusafiber: { bg: 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', textStrong: 'text-purple-900 dark:text-purple-100' }
}

const categoryColor: Record<string, { bg: string; text: string; textStrong: string }> = {
    primary: { bg: 'bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-800', text: 'text-primary-600 dark:text-primary-400', textStrong: 'text-primary-700 dark:text-primary-300' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400', textStrong: 'text-orange-700 dark:text-orange-300' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400', textStrong: 'text-purple-700 dark:text-purple-300' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800', text: 'text-indigo-600 dark:text-indigo-400', textStrong: 'text-indigo-700 dark:text-indigo-300' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-800', text: 'text-pink-600 dark:text-pink-400', textStrong: 'text-pink-700 dark:text-pink-300' },
    teal: { bg: 'bg-teal-50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-800', text: 'text-teal-600 dark:text-teal-400', textStrong: 'text-teal-700 dark:text-teal-300' }
}

const categoryCards = computed(() => {
    const b = props.data.breakdown
    return [
        { label: 'New', count: b.new.count, color: categoryColor.primary! },
        { label: 'Recurring', count: b.recurring.count, color: categoryColor.orange! },
        { label: 'Prorate', count: b.prorate.count, color: categoryColor.purple! },
        { label: 'Upgrade', count: b.upgrade.count, color: categoryColor.indigo! },
        { label: 'Alat', count: b.alat.count, color: categoryColor.pink! },
        { label: 'Setup', count: b.setup.count, color: categoryColor.teal! }
    ]
})

const churnByService = computed(() => {
    const counts = new Map<string, number>()
    for (const c of props.churnData ?? []) {
        if (c.is_approved) continue
        const name = c.service_name ?? c.service_id ?? 'Unknown'
        counts.set(name, (counts.get(name) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }))
})

interface FinancialBox {
    title: string
    rows: { label: string; value: number }[]
    total?: number
    negative?: boolean
    isCount?: boolean
}

const financialBoxes = computed<FinancialBox[]>(() => {
    const data = props.data
    const b = data.breakdown
    const g = data.byServiceGroup
    return [
        {
            title: 'Commission',
            rows: [
                { label: 'New', value: b.new.commission },
                { label: 'Prorate', value: b.prorate.commission },
                { label: 'Recurring', value: b.recurring.commission },
                { label: 'Upgrade', value: b.upgrade.commission },
                { label: 'Alat', value: b.alat.commission },
                { label: 'Setup', value: b.setup.commission },
                { label: 'Bonus', value: data.bonus }
            ],
            total: data.total.commission + data.bonus
        },
        {
            title: 'MRC (New)',
            rows: serviceGroupOrder.map(name => ({ label: name, value: g[name]?.new.mrc ?? 0 })),
            total: b.new.mrc
        },
        {
            title: 'Subscription (New)',
            rows: [
                ...serviceGroupOrder.map(name => ({ label: name, value: g[name]?.new.subscription ?? 0 })),
                { label: 'Prorate', value: b.prorate.subscription },
                { label: 'Upgrade', value: b.upgrade.subscription }
            ],
            total: b.new.subscription + b.prorate.subscription + b.upgrade.subscription
        },
        {
            title: 'Subscription (Recurring)',
            rows: serviceGroupOrder.map(name => ({ label: name, value: g[name]?.recurring.subscription ?? 0 })),
            total: b.recurring.subscription
        },
        {
            title: 'Subscription (Other)',
            rows: [
                { label: 'Alat', value: b.alat.subscription },
                { label: 'Setup', value: b.setup.subscription }
            ],
            total: b.alat.subscription + b.setup.subscription
        },
        { title: 'Deduction (churn)', rows: [
            { label: 'MRC', value: data.deduction.mrc },
            { label: 'Commission', value: data.deduction.commission },
            { label: 'Subscription', value: data.deduction.subscription }
        ], negative: true },
        { title: 'Service (churn)', rows: churnByService.value, negative: true, isCount: true }
    ]
})
</script>
