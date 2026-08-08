<template>
    <UContainer>
        <HeroBackground />
        <CommissionHeader
            :employee="employee"
            v-model:year="year"
            :year-items="yearItems"
            subtitle="Monthly sales commission heatmap 🔥"
        />

        <div class="py-2 grid grid-cols-1 gap-4">
            <UPageCard v-if="periodData">
                <template #default>
                    <!-- Header Section -->
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 border-b border-gray-100 dark:border-gray-800 pb-4 md:pb-6">
                        <div class="space-y-2 w-full md:w-auto">
                            <div class="mb-2">
                                <USelectMenu v-model="selectedMonth" value-key="id" :items="monthSelect" class="w-full sm:w-56 md:w-64" />
                            </div>
                            <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Period:</span>
                            <div class="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                <span class="text-sm sm:text-base md:text-md">
                                    {{ formatDate(periodData.startDate) }} - {{ formatDate(periodData.endDate) }}
                                </span>
                            </div>
                        </div>
                        <div class="text-left md:text-right flex flex-col w-full md:w-auto">
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 md:mb-2 text-left md:text-right">
                                Grand Total Commission
                            </p>
                            <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500 dark:text-primary-400">
                                {{ formatCurrency(periodData.total.commission + periodData.bonus) }}
                            </span>
                        </div>
                    </div>

                    <div class="mt-4 md:mt-6 space-y-6 md:space-y-8">
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
                                            {{ periodData.byServiceGroup[group]?.new.count ?? 0 }}
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
                                                <span :class="['text-xs sm:text-sm font-bold uppercase px-2 md:px-2.5 py-0.5 md:py-1 rounded-md border bg-gray-50 dark:bg-gray-800', getAchievementColor(periodData.achievementStatus)]">
                                                    {{ periodData.achievementStatus }}
                                                </span>
                                            </div>
                                            <div>
                                                <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 tracking-wide">Employment Status</p>
                                                <span class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{{ periodData.status ?? '-' }}</span>
                                            </div>
                                            <div>
                                                <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 tracking-wide">Activity</p>
                                                <span class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{{ periodData.activityCount }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="pt-3 md:pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic font-medium leading-relaxed">
                                            "{{ periodData.motivation }}"
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
            </UPageCard>
        </div>

        <div class="py-2">
            <UCard>
                <UTabs :items="tabItems" class="w-full">
                    <template #content="{ item }">
                        <UTable
                            sticky
                            :data="getTabData(item.key)"
                            :columns="getColumns(item.key)"
                            class="flex-1 max-h-[800px] [&_tr:has(.commission-zero)]:bg-yellow-50 dark:[&_tr:has(.commission-zero)]:bg-yellow-950/20"
                        />
                    </template>
                </UTabs>
            </UCard>
        </div>

    </UContainer>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { CommissionService } from '~/services/commission-service'
import { EmployeeService } from '~/services/employee-service'
import { InvoiceService } from '~/services/invoice-service'
import type { Employee } from '~/types/employee'
import type { SelectMenuItem, TableColumn } from '@nuxt/ui'
import type { ChurnRow, CommissionLineItem, SalesCommissionData } from '~/types/sales'

const { setLoading } = useLoading()
const route = useRoute()
const commissionService = new CommissionService()
const employeeService = new EmployeeService()
const invoiceService = new InvoiceService()
const UBadge = resolveComponent('UBadge')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthSelect: SelectMenuItem[] = monthNames.map((label, i) => ({ label, id: i + 1 }))

const employee = ref<Employee>()
const yearItems = [2026, 2027, 2028, 2029, 2030]
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)

const periodData = ref<SalesCommissionData | null>(null)
const invoiceItems = ref<CommissionLineItem[]>([])
const churnData = ref<ChurnRow[]>([])

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

const formatDate = (isoDate: string): string => {
    const [y, m, d] = isoDate.split('-').map(Number)
    if (y === undefined || m === undefined || d === undefined) return isoDate
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { dateStyle: 'medium' })
}

const getAchievementColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('tidak capai') || s.includes('sp1')) return 'text-red-500 dark:text-red-400 border-red-200 dark:border-red-800'
    if (s.includes('average')) return 'text-orange-500 dark:text-orange-400 border-orange-200 dark:border-orange-800'
    if (s.includes('bonus')) return 'text-violet-500 dark:text-violet-400 border-violet-200 dark:border-violet-800'
    if (s.includes('excelent') || s.includes('excellent')) return 'text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    if (s.includes('very good')) return 'text-teal-500 dark:text-teal-400 border-teal-200 dark:border-teal-800'
    if (s.includes('capai target')) return 'text-green-500 dark:text-green-400 border-green-200 dark:border-green-800'
    return 'text-primary-500 dark:text-primary-400 border-primary-200 dark:border-primary-800'
}

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
    if (!periodData.value) return []
    const b = periodData.value.breakdown
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
    for (const c of churnData.value) {
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
    if (!periodData.value) return []
    const b = periodData.value.breakdown
    const g = periodData.value.byServiceGroup
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
                { label: 'Bonus', value: periodData.value.bonus }
            ],
            total: periodData.value.total.commission + periodData.value.bonus
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
            { label: 'MRC', value: periodData.value.deduction.mrc },
            { label: 'Commission', value: periodData.value.deduction.commission },
            { label: 'Subscription', value: periodData.value.deduction.subscription }
        ], negative: true },
        { title: 'Service (churn)', rows: churnByService.value, negative: true, isCount: true }
    ]
})

const tabItems = computed(() => {
    const byType = (key: string) => invoiceItems.value.filter(i => i.type === key)
    return [
        { label: `New (${byType('new').length})`, key: 'new' },
        { label: `Recurring (${byType('recurring').length})`, key: 'recurring' },
        { label: `Prorate (${byType('prorate').length})`, key: 'prorate' },
        { label: `Upgrade (${byType('upgrade').length})`, key: 'upgrade' },
        { label: `Alat (${byType('alat').length})`, key: 'alat' },
        { label: `Setup (${byType('setup').length})`, key: 'setup' },
        { label: `Churn (${churnData.value.length})`, key: 'churn' }
    ]
})

const getTabData = (key: string) => {
    if (key === 'churn') return churnData.value
    return invoiceItems.value.filter(i => i.type === key)
}

const boxTotal = (key: string, field: 'subscription' | 'mrc' | 'commission') => periodData.value?.breakdown[key as keyof typeof periodData.value.breakdown]?.[field] ?? 0

const getColumns = (key: string): TableColumn<any>[] => {
    if (key === 'churn') {
        return [
            {
                header: 'Service',
                cell: ({ row }) => h('div', { class: 'flex flex-col min-w-[120px]' }, [
                    h('a', { href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customer_service_id}/detail`, target: '_blank', class: 'text-blue-500 hover:underline font-semibold text-sm break-all' }, row.original.customer_service_account),
                    h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words line-clamp-2' }, row.original.service_name ?? '')
                ])
            },
            {
                header: 'Customer',
                cell: ({ row }) => h('div', { class: 'flex flex-col min-w-[120px]' }, [
                    h('a', { href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customer_id}&pid=profile`, target: '_blank', class: 'text-blue-500 hover:underline font-semibold text-sm' }, row.original.customer_id),
                    h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words line-clamp-2' }, row.original.customer_name ?? '')
                ])
            },
            { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => h('span', { class: 'text-xs italic text-gray-500 dark:text-gray-400 whitespace-normal line-clamp-2 min-w-[150px]' }, row.original.reason ?? '') },
            {
                header: 'Duration',
                cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
                    h('span', { class: 'text-sm font-medium' }, `${row.original.period} bulan`),
                    h('span', { class: 'text-[10px] text-gray-400 dark:text-gray-500' }, `${formatDate(String(row.original.registration_date).slice(0, 10))} - ${formatDate(String(row.original.unregistration_date).slice(0, 10))}`)
                ])
            },
            { header: 'Subscription', cell: ({ row }) => h('span', { class: 'font-medium' }, formatCurrency(row.original.price)) },
            { header: 'MRC', cell: ({ row }) => h('span', { class: 'font-medium' }, formatCurrency(row.original.mrc)) },
            {
                header: 'Commission',
                cell: ({ row }) => h('div', { class: 'flex flex-col items-end' }, [
                    h('span', { class: 'text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 mb-1' }, `${row.original.commissionPercentage}%`),
                    h('span', { class: 'text-sm font-bold text-gray-900 dark:text-white' }, formatCurrency(row.original.commission))
                ])
            }
        ]
    }

    const cols: TableColumn<CommissionLineItem>[] = [
        {
            accessorKey: 'paidDate',
            header: 'Paid Date',
            cell: ({ row }) => row.original.paidDate ? new Date(row.original.paidDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
        },
        {
            id: 'label',
            header: 'Label',
            cell: ({ row }) => {
                const serviceId = row.original.serviceId ?? ''
                if (['BFLITE'].some(c => serviceId.startsWith(c))) return h(UBadge, { label: 'Nusafiber', color: 'info', variant: 'subtle' })
                if (['NFSP030', 'NFSP100', 'NFSP200'].some(c => serviceId.startsWith(c))) return h(UBadge, { label: 'NusaSelecta', color: 'warning', variant: 'subtle' })
                if (['HOME100', 'HOMESTD100', 'HOMEADV', 'HOMEADV200', 'HOMEPREM300', 'HOME300', 'LITE100', 'LITE200'].some(c => serviceId.startsWith(c))) return h(UBadge, { label: 'Home', color: 'primary', variant: 'subtle' })
                return null
            }
        },
        {
            header: 'Service',
            cell: ({ row }) => h('div', { class: 'flex flex-col min-w-[120px]' }, [
                h('a', { href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customerServiceId}/detail`, target: '_blank', class: 'text-blue-500 hover:underline font-semibold text-sm break-all' }, row.original.customerServiceAccount ?? ''),
                h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words line-clamp-2' }, row.original.serviceName ?? '')
            ])
        },
        {
            header: 'Customer',
            cell: ({ row }) => h('div', { class: 'flex flex-col min-w-[120px]' }, [
                h('a', { href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customerId}&pid=profile`, target: '_blank', class: 'text-blue-500 hover:underline font-semibold text-sm' }, row.original.customerId),
                h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words line-clamp-2' }, row.original.customerName ?? '')
            ])
        },
        {
            accessorKey: 'subscription',
            header: 'Subscription',
            cell: ({ row }) => h('span', { class: 'font-medium' }, formatCurrency(row.original.subscription)),
            footer: () => h('div', { class: 'hidden lg:block text-right font-bold' }, formatCurrency(boxTotal(key, 'subscription')))
        },
        {
            accessorKey: 'mrc',
            header: 'MRC',
            cell: ({ row }) => h('span', { class: 'font-medium' }, formatCurrency(row.original.mrc)),
            footer: () => h('div', { class: 'hidden lg:block text-right font-bold' }, formatCurrency(boxTotal(key, 'mrc')))
        },
        { header: 'Month Period', cell: ({ row }) => h('span', { class: 'font-medium text-center' }, row.original.month) },
        { header: 'Month Late', cell: ({ row }) => h('span', { class: 'font-medium text-center' }, row.original.lateMonth) },
        {
            header: 'Commission',
            cell: ({ row }) => {
                const isZero = row.original.commission === 0
                return h('div', { class: ['flex flex-col items-end', isZero ? 'commission-zero' : ''] }, [
                    h('span', { class: 'text-xs text-gray-600 dark:text-white' }, formatCurrency(row.original.baseCommission)),
                    h('span', { class: 'text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 mb-1' }, `${row.original.commissionPercentage}%`),
                    h('span', { class: 'text-sm font-bold text-gray-900 dark:text-white' }, formatCurrency(row.original.commission))
                ])
            },
            footer: () => h('div', { class: 'text-right font-bold text-gray-900 dark:text-white' }, formatCurrency(boxTotal(key, 'commission')))
        }
    ]
    return cols
}

// --- Data fetching ---
const fetchPeriodData = async () => {
    const response = await commissionService.salesCommission(route.params.id as string, { month: selectedMonth.value, year: year.value })
    periodData.value = response.data
}

const fetchInvoiceData = async () => {
    const response = await invoiceService.getInvoiceSales(route.params.id as string, { month: selectedMonth.value, year: year.value })
    invoiceItems.value = response.data.data
}

const fetchChurnData = async () => {
    const response = await commissionService.salesChurn(route.params.id as string, { month: selectedMonth.value, year: year.value })
    churnData.value = response.data
}

const fetchMonthData = () => Promise.all([fetchPeriodData(), fetchInvoiceData(), fetchChurnData()])

const initData = async () => {
    setLoading(true)
    try {
        const employeeData = await employeeService.getEmployee(route.params.id as string)
        employee.value = employeeData.data
        await fetchMonthData()
    } finally {
        setLoading(false)
    }
}

watch(year, () => {
    fetchMonthData()
})

watch(selectedMonth, () => {
    fetchMonthData()
})

initData()
</script>
