<template>
    <UContainer>
        <HeroBackground />
        <CommissionHeader
            :employee="employee"
            v-model:year="year"
            :year-items="yearItems"
            subtitle="Monthly manager commission heatmap 🔥"
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
                                {{ formatCurrency(periodData.totalCommission) }}
                            </span>
                        </div>
                    </div>

                    <!-- Team Performance Summary -->
                    <div class="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Team Composition</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Total AM</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.team.totalCount }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Permanent</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.team.permanentCount }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Probation</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.team.nonPermanentCount }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Target</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.team.finalTarget }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Commission Achievement</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">New Commission ({{ periodData.override.newCommissionRate }}%)</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatCurrency(periodData.override.newCommission) }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Recurring ({{ periodData.override.recurringCommissionRate }}%)</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatCurrency(periodData.override.recurringCommission) }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Personal Sales</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatCurrency(periodData.personal.total.commission + periodData.personal.bonus) }}</span>
                                </div>
                                <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                                    <span class="text-base font-bold text-primary-500 dark:text-primary-400">{{ formatCurrency(periodData.totalCommission) }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Team Achievement</h4>
                                <UBadge :color="periodData.team.isTargetAchieved ? 'success' : 'error'" variant="subtle">
                                    {{ periodData.team.isTargetAchieved ? 'Capai Target' : 'Tidak Capai Target' }}
                                </UBadge>
                            </div>
                            <div class="flex flex-col gap-3">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ Math.round(periodData.team.achievementPercentage) }}%</span>
                                <div class="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        class="h-full"
                                        :class="periodData.team.isTargetAchieved ? 'bg-green-500' : 'bg-red-500'"
                                        :style="{ width: Math.min(100, periodData.team.achievementPercentage) + '%' }"
                                    ></div>
                                </div>
                            </div>
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6">New Service</h4>
                            <div class="flex flex-col gap-2">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ periodData.team.activityCount }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Summary Cards -->
                    <div class="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Commission</h4>
                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(periodData.teamTotals.newCommission) }}</span>
                        </div>
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recurring Commission</h4>
                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(periodData.teamTotals.recurringCommission) }}</span>
                        </div>
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Subscription</h4>
                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(periodData.teamTotals.newSubscription) }}</span>
                        </div>
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New MRC</h4>
                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(periodData.teamTotals.newMrc) }}</span>
                        </div>
                    </div>

                    <!-- Team Production by Service -->
                    <div class="mt-4 md:mt-6">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3 md:mb-4">
                            <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                            Team Production by Service
                        </h4>
                        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-6 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800">
                            <div v-for="box in teamServiceBoxes" :key="box.title">
                                <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">{{ box.title }}</h5>
                                <ul class="space-y-2 md:space-y-3">
                                    <li v-for="row in box.rows" :key="row.label" class="flex justify-between items-center text-xs sm:text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">{{ row.label }}</span>
                                        <span class="font-semibold text-gray-900 dark:text-white">{{ box.isCount ? row.value : formatCurrency(row.value) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-xs sm:text-sm pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                                        <span class="font-bold text-gray-900 dark:text-white">Total</span>
                                        <span class="font-bold text-primary-600 dark:text-primary-400">{{ box.isCount ? box.total : formatCurrency(box.total) }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </template>
            </UPageCard>
        </div>

        <div class="py-2">
            <UCard>
                <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Personal Sales Invoice</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Invoices sold directly under this manager's own employee ID, plus Customer Relation Officer recurring rows credited to them</p>
                </template>
                <UTabs :items="invoiceTabItems" class="w-full">
                    <template #content="{ item }">
                        <UTable
                            sticky
                            :data="getInvoiceTabData(item.key)"
                            :columns="getInvoiceColumns(item.key)"
                            class="flex-1 max-h-[800px] [&_tr:has(.commission-zero)]:bg-yellow-50 dark:[&_tr:has(.commission-zero)]:bg-yellow-950/20"
                        />
                    </template>
                </UTabs>
            </UCard>
        </div>

        <div class="py-2">
            <UCard>
                <UTable
                    sticky
                    v-model:expanded="expanded"
                    :data="members"
                    :columns="columns"
                    class="flex-1 max-h-[800px]"
                >
                    <template #expanded="{ row }">
                        <div class="p-4 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">New Service</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div v-for="service in row.original.newService" :key="service.name" class="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="font-semibold text-gray-900 dark:text-white">{{ service.name }}</span>
                                        <span class="font-medium">{{ service.count }}</span>
                                    </div>
                                    <div class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                        <div class="flex justify-between">
                                            <span>MRC:</span>
                                            <span class="font-medium">{{ formatCurrency(service.mrc) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Subscription:</span>
                                            <span class="font-medium">{{ formatCurrency(service.subscription) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </UTable>
            </UCard>
        </div>

    </UContainer>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { CommissionService } from '~/services/commission-service'
import { EmployeeService } from '~/services/employee-service'
import type { Employee } from '~/types/employee'
import type { SelectMenuItem, TableColumn } from '@nuxt/ui'
import type { ManagerCommissionData, ManagerTeamMember } from '~/types/manager'
import type { CommissionLineItem } from '~/types/sales'

const { setLoading } = useLoading()
const route = useRoute()
const commissionService = new CommissionService()
const employeeService = new EmployeeService()
const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthSelect: SelectMenuItem[] = monthNames.map((label, i) => ({ label, id: i + 1 }))

const employee = ref<Employee>()
const yearItems = [2026, 2027, 2028, 2029, 2030]
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)

const periodData = ref<ManagerCommissionData | null>(null)
const expanded = ref({})

const { formatCurrency, formatDate } = useFormat()
const { getAchievementTextClass } = useAchievementColor()

interface TeamServiceBox {
    title: string
    rows: { label: string; value: number }[]
    total: number
    isCount?: boolean
}

const serviceGroupOrder = ['Home', 'Nusafiber', 'NusaSelecta'] as const

const teamServiceBoxes = computed<TeamServiceBox[]>(() => {
    if (!periodData.value) return []
    const g = periodData.value.teamTotals.byServiceGroup
    return [
        {
            title: 'New Service',
            rows: serviceGroupOrder.map(name => ({ label: name, value: g[name].newCount })),
            total: serviceGroupOrder.reduce((sum, name) => sum + g[name].newCount, 0),
            isCount: true
        },
        {
            title: 'New Subscription',
            rows: serviceGroupOrder.map(name => ({ label: name, value: g[name].newSubscription })),
            total: periodData.value.teamTotals.newSubscription
        },
        {
            title: 'New MRC',
            rows: serviceGroupOrder.map(name => ({ label: name, value: g[name].newMrc })),
            total: periodData.value.teamTotals.newMrc
        },
        {
            title: 'Recurring Subscription',
            rows: serviceGroupOrder.map(name => ({ label: name, value: g[name].recurringSubscription })),
            total: serviceGroupOrder.reduce((sum, name) => sum + g[name].recurringSubscription, 0)
        },
        {
            title: 'Recurring Commission',
            rows: serviceGroupOrder.map(name => ({ label: name, value: g[name].recurringCommission })),
            total: periodData.value.teamTotals.recurringCommission
        }
    ]
})

const personalItems = computed(() => periodData.value?.personal.items ?? [])
const croItems = computed(() => periodData.value?.croRecurring ?? [])
// Customer Relation Officer rows have no real salesperson, so they never
// appear in personal.items — folded into the Recurring tab here since
// that's the only commission stream they actually feed (KOMISI.md 6.D).
const recurringItems = computed(() => [...personalItems.value.filter(i => i.type === 'recurring'), ...croItems.value])

const invoiceTabItems = computed(() => {
    const byType = (key: string) => personalItems.value.filter(i => i.type === key)
    return [
        { label: `New (${byType('new').length})`, key: 'new' },
        { label: `Recurring (${recurringItems.value.length})`, key: 'recurring' },
        { label: `Prorate (${byType('prorate').length})`, key: 'prorate' },
        { label: `Upgrade (${byType('upgrade').length})`, key: 'upgrade' },
        { label: `Alat (${byType('alat').length})`, key: 'alat' },
        { label: `Setup (${byType('setup').length})`, key: 'setup' }
    ]
})

const getInvoiceTabData = (key: string) => {
    if (key === 'recurring') return recurringItems.value
    return personalItems.value.filter(i => i.type === key)
}

const invoiceBoxTotal = (key: string, field: 'subscription' | 'mrc' | 'commission') => {
    const rows = getInvoiceTabData(key)
    return rows.reduce((sum, r) => sum + r[field], 0)
}

const getInvoiceColumns = (key: string): TableColumn<CommissionLineItem>[] => [
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
        footer: () => h('div', { class: 'hidden lg:block text-right font-bold' }, formatCurrency(invoiceBoxTotal(key, 'subscription')))
    },
    {
        accessorKey: 'mrc',
        header: 'MRC',
        cell: ({ row }) => h('span', { class: 'font-medium' }, formatCurrency(row.original.mrc)),
        footer: () => h('div', { class: 'hidden lg:block text-right font-bold' }, formatCurrency(invoiceBoxTotal(key, 'mrc')))
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
        footer: () => h('div', { class: 'text-right font-bold text-gray-900 dark:text-white' }, formatCurrency(invoiceBoxTotal(key, 'commission')))
    }
]

const members = computed(() => periodData.value?.members ?? [])

const columns = computed<TableColumn<ManagerTeamMember>[]>(() => [
    {
        id: 'expand',
        header: '',
        cell: ({ row }) => h(UButton, {
            color: 'gray',
            variant: 'ghost',
            icon: 'i-heroicons-chevron-down-20-solid',
            class: 'transition-transform duration-200',
            style: { transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(0deg)' },
            onClick: () => row.toggleExpanded()
        })
    },
    {
        accessorKey: 'employee',
        header: 'Employee',
        cell: ({ row }) => h(resolveComponent('NuxtLink'), {
            class: 'flex items-center gap-3 group',
            to: `/${row.original.employeeId}/sales`
        }, () => [
            h(UAvatar, { src: row.original.photoProfile, alt: row.original.name, size: 'md' }),
            h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors' }, row.original.name),
                h('span', { class: 'text-xs text-gray-500' }, row.original.employeeId)
            ])
        ]),
        footer: () => h('div', { class: 'font-bold py-3' }, 'Total')
    },
    {
        id: 'achievement',
        header: 'Achievement',
        cell: ({ row }) => h('div', { class: getAchievementTextClass(row.original.achievementStatus) }, row.original.achievementStatus)
    },
    {
        accessorKey: 'activityCount',
        header: 'New Service',
        cell: ({ row }) => h('div', { class: 'text-center font-medium' }, row.original.activityCount),
        footer: () => h('div', { class: 'text-center font-bold py-3' }, members.value.reduce((sum, m) => sum + m.activityCount, 0))
    },
    {
        accessorKey: 'newSubscription',
        header: () => h('div', { class: 'text-right' }, 'New Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.newSubscription)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.newSubscription, 0)))
    },
    {
        accessorKey: 'newCommission',
        header: () => h('div', { class: 'text-right' }, 'New Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.newCommission)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.newCommission, 0)))
    },
    {
        accessorKey: 'recurringSubscription',
        header: () => h('div', { class: 'text-right' }, 'Recurring Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.recurringSubscription)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.recurringSubscription, 0)))
    },
    {
        accessorKey: 'recurringCommission',
        header: () => h('div', { class: 'text-right' }, 'Recurring Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.recurringCommission)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.recurringCommission, 0)))
    },
    {
        accessorKey: 'otherSubscription',
        header: () => h('div', { class: 'text-right' }, 'Other Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.otherSubscription)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.otherSubscription, 0)))
    },
    {
        accessorKey: 'otherCommission',
        header: () => h('div', { class: 'text-right' }, 'Other Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.otherCommission)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.otherCommission, 0)))
    },
    {
        accessorKey: 'bonus',
        header: () => h('div', { class: 'text-right' }, 'Bonus'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.bonus)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.bonus, 0)))
    },
    {
        accessorKey: 'totalCommission',
        header: () => h('div', { class: 'text-right' }, 'Total Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.totalCommission)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.totalCommission, 0)))
    },
    {
        accessorKey: 'newMrc',
        header: () => h('div', { class: 'text-right' }, 'New MRC'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.newMrc)),
        footer: () => h('div', { class: 'text-right font-bold py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.newMrc, 0)))
    },
    {
        accessorKey: 'managerNewCommission',
        header: () => h('div', { class: 'text-right' }, 'Manager New Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.managerNewCommission)),
        footer: () => h('div', { class: 'text-right font-bold text-gray-900 dark:text-white py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.managerNewCommission, 0)))
    },
    {
        accessorKey: 'managerRecurringCommission',
        header: () => h('div', { class: 'text-right' }, 'Manager Recurring Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.managerRecurringCommission)),
        footer: () => h('div', { class: 'text-right font-bold text-gray-900 dark:text-white py-3' }, formatCurrency(members.value.reduce((sum, m) => sum + m.managerRecurringCommission, 0)))
    }
])

// --- Data fetching ---
const fetchPeriodData = async () => {
    const response = await commissionService.managerCommission(route.params.id as string, { month: selectedMonth.value, year: year.value })
    periodData.value = response.data
}

const initData = async () => {
    setLoading(true)
    try {
        const employeeData = await employeeService.getEmployee(route.params.id as string)
        employee.value = employeeData.data
        await fetchPeriodData()
    } finally {
        setLoading(false)
    }
}

watch(year, () => {
    fetchPeriodData()
})

watch(selectedMonth, () => {
    fetchPeriodData()
})

initData()
</script>
