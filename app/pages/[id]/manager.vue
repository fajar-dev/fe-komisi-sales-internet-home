<template>
    <UContainer>
        <HeroBackground />
        <CommissionHeader
            :employee="employee"
            v-model:year="year"
            :year-items="items"
            subtitle="Monthly manager commission heatmap 🔥"
        />

        <div class="py-2 grid grid-cols-1 gap-4">
            <UPageCard v-if="periodData">
                <template #default>
                    <!-- Header Section -->
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 border-b border-gray-100 dark:border-gray-800 pb-4 md:pb-6">
                        <div class="space-y-2 w-full md:w-auto">
                            <div class="mb-2">
                                <USelectMenu v-model="selectedMonth" :items="monthSelect" class="w-full sm:w-56 md:w-64" />
                            </div>
                            <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Period:</span>
                            <div class="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                <span class="text-sm sm:text-base md:text-md" v-if="periodData?.startDate && periodData?.endDate">
                                    {{ df.format(parseDate(periodData.startDate).toDate(getLocalTimeZone())) }} - 
                                    {{ df.format(parseDate(periodData.endDate).toDate(getLocalTimeZone())) }}
                                </span>
                                <span class="text-sm sm:text-base md:text-md" v-else>
                                    {{ selectedMonthLabel }} {{ year }}
                                </span>
                            </div>
                        </div>
                        <div class="text-left md:text-right flex flex-col w-full md:w-auto">
                            <div>
                                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 md:mb-2 text-left md:text-right">
                                    Grand Total Commission
                                </p>
                                <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500 dark:text-primary-400">
                                    {{ formatCurrency(Number(periodData.achievement.totalCommission)) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Team Performance Summary -->
                    <div class="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" v-if="periodData.sales">
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Team Composition</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Total Sales</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.sales.total }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Permanent</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.sales.Permanent }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Probation</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.sales.Probation }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Target</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.sales.target }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Commission Achievement</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">New Commission ({{ periodData.achievement.newCommissionPercentage }}%)</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.achievement.newCommission)) }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600 dark:text-gray-400">Recurring ({{ periodData.achievement.recurringCommissionPercentage }}%)</span>
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.achievement.recurringCommission)) }}</span>
                                </div>
                                <div class="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <span class="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                                    <span class="text-base font-bold text-primary-500 dark:text-primary-400">{{ formatCurrency(Number(periodData.achievement.totalCommission)) }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Team Achievement</h4>
                                <UBadge :color="getBadgeColor(periodData.sales.status)" variant="subtle">
                                    {{ periodData.sales.status }}
                                </UBadge>
                            </div>
                            <div class="flex flex-col gap-3">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ periodData.sales.percentage }}</span>
                            </div>
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6">New Service</h4>
                            <div class="flex flex-col gap-2">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ periodData.sales.activity }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Summary Cards -->
                    <div class="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Commission</h4>
                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.monthlyNewCommission)) }}</span>
                        </div>
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recurring Commission</h4>
                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.monthlyRecurringCommission)) }}</span>
                        </div>
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Subscription</h4>
                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.monthlyNewSubscription)) }}</span>
                        </div>
                         <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New MRC</h4>
                            <span class="text-xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.monthlyNewMrc)) }}</span>
                        </div>
                    </div>

                </template>
            </UPageCard>
        </div>

        <div class="py-2">
            <UCard>
                <UTable 
                    sticky 
                    v-model:expanded="expanded"
                    :data="formattedRows" 
                    :columns="columns" 
                    class="flex-1 max-h-[800px] [&_tr:has(.row-deleted)]:bg-red-50 dark:[&_tr:has(.row-deleted)]:bg-red-950/20" 
                >
                    <template #expanded="{ row }">
                         <div class="p-4 bg-gray-50 dark:bg-gray-800/50">
                            <h4 class="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">New Service</h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div v-for="(service, index) in row.original.newService" :key="index" class="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="font-semibold text-gray-900 dark:text-white">{{ service.name }}</span>
                                        <span class="font-medium">{{ service.count }}</span>
                                    </div>
                                    <div class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                        <div class="flex justify-between">
                                            <span>MRC:</span>
                                            <span class="font-medium">{{ formatCurrency(Number(service.mrc)) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Subscription:</span>
                                            <span class="font-medium">{{ formatCurrency(Number(service.subscription)) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </UTable>
            </UCard>
        </div>

        <div class="py-2 grid grid-cols-1 lg:grid-cols-2 gap-4" v-if="yearlyData">
            <UCard>
                <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Total Commission Composition
                    </h3>
                </template>
                 <div class="h-80 w-full flex justify-center items-center">
                    <DonutChart
                        :data="yearlyDonutData"
                        :categories="yearlyDonutCategories"
                        :value-formatter="formatCurrency"
                    />
                </div>
            </UCard>
            <UCard>
                <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Revenue Trend (Yearly)
                    </h3>
                </template>
                <div class="h-80 w-full">
                    <BarChart 
                        :data="revenueTrendData" 
                        index="date" 
                        :categories="revenueCategories" 
                        :y-formatter="formatCurrency"
                        :y-axis="revenueYAxis"
                    />
                </div>
            </UCard>
            <UCard class="col-span-1 lg:col-span-2">
                <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Commission Trend (Yearly)
                    </h3>
                </template>
                <div class="h-80 w-full">
                     <AreaChart 
                        :data="commissionTrendData" 
                        index="date" 
                        :categories="commissionCategories" 
                        :y-formatter="formatCurrency"
                    />
                </div>
            </UCard>
            <UCard>
                 <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Team Performance Trend
                    </h3>
                </template>
                <div class="h-80 w-full">
                    <LineChart 
                        :data="salesTrendData" 
                        index="date" 
                        :categories="salesCategories" 
                    />
                </div>
            </UCard>
            <UCard>
                 <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Sales Contribution (Permanent vs Probation)
                    </h3>
                </template>
                <div class="h-80 w-full">
                    <BarChart 
                        :data="salesSourceTrendData" 
                        index="date" 
                        :categories="salesSourceCategories" 
                        :y-axis="salesSourceYAxis"
                        :stacked="true"
                    />
                </div>
            </UCard>
            <UCard>
                 <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Service Product Trend
                    </h3>
                </template>
                <div class="h-80 w-full">
                    <BarChart 
                        :data="serviceTrendData" 
                        index="date" 
                        :categories="serviceCategories" 
                        :y-axis="serviceYAxis"
                        :stacked="true"
                    />
                </div>
            </UCard>
            <UCard>
                <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Productivity Trend (Sales/Employee)
                    </h3>
                </template>
                <div class="h-80 w-full">
                    <LineChart 
                        :data="productivityTrendData" 
                        index="date" 
                        :categories="productivityCategories" 
                        :y-num-ticks="4"
                    />
                </div>
            </UCard>
            <UCard class="col-span-1 lg:col-span-2">
                <template #header>
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Commission Rate Trend (% of Revenue)
                    </h3>
                </template>
                <div class="h-80 w-full">
                    <LineChart 
                        :data="costOfSalesTrendData" 
                        index="date" 
                        :categories="costOfSalesCategories" 
                        :value-formatter="(val: number) => val + '%'"
                        :y-num-ticks="4"
                    />
                </div>
            </UCard>
        </div>

    </UContainer>
</template>

<script setup lang="ts">
import { CommissionService } from '~/services/commission-service'
import { EmployeeService } from '~/services/employee-service'
import type { Employee } from '~/types/employee'
import type { TableColumn } from '@nuxt/ui'
import type { ManagerPeriodData, ManagerEmployeePerformance, ManagerMouthlyResponseData } from '~/types/manager'
import { resolveComponent, computed, ref, watch, h } from 'vue'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'

const df = new DateFormatter('en-US', {
    dateStyle: 'medium'
})

const route = useRoute()
const employee = ref<Employee>()

// Year Select
const items = ref([2026, 2027, 2028, 2029, 2030])

const year = ref(new Date().getFullYear())

// Month Select
const monthSelect = ref([
    { label: 'January', id: 1 },
    { label: 'February', id: 2 },
    { label: 'March', id: 3 },
    { label: 'April', id: 4 },
    { label: 'May', id: 5 },
    { label: 'June', id: 6 },
    { label: 'July', id: 7 },
    { label: 'August', id: 8 },
    { label: 'September', id: 9 },
    { label: 'October', id: 10 },
    { label: 'November', id: 11 },
    { label: 'December', id: 12 }
])

const selectedMonth = ref(monthSelect.value[new Date().getMonth()])
const selectedMonthLabel = computed(() => selectedMonth.value?.label)

const periodData = ref<ManagerPeriodData>()

const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const expanded = ref({})

const getBadgeColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('tidak capai') || s.includes('sp1')) return 'error'
    if (s.includes('average')) return 'warning'
    if (s.includes('bonus')) return 'primary'
    if (s.includes('excelent') || s.includes('excellent')) return 'success'
    if (s.includes('very good')) return 'success'
    if (s.includes('capai target')) return 'success'
    return 'primary'
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value)
}

const formattedRows = computed(() => {
    return periodData.value?.employee || []
})

const getAchievementColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('tidak capai') || s.includes('sp1')) return 'font-bold text-red-500 dark:text-red-400'
    if (s.includes('average')) return 'font-bold text-orange-500 dark:text-orange-400'
    if (s.includes('bonus')) return 'font-bold text-violet-500 dark:text-violet-400'
    if (s.includes('excelent') || s.includes('excellent')) return 'font-bold text-emerald-500 dark:text-emerald-400'
    if (s.includes('very good')) return 'font-bold text-teal-500 dark:text-teal-400'
    if (s.includes('capai target')) return 'font-bold text-green-500 dark:text-green-400'
    return 'text-primary-500 dark:text-primary-400'
}

const columns = computed<TableColumn<ManagerEmployeePerformance>[]>(() => [
    {
        id: 'expand',
        header: '',
        cell: ({ row }) => h(UButton, {
            color: 'gray',
            variant: 'ghost',
            icon: 'i-heroicons-chevron-down-20-solid',
            class: 'transition-transform duration-200', 
            ui: { 
                 rounded: 'rounded-full'
            },
            style: {
                 transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(0deg)'
            },
            onClick: () => row.toggleExpanded()
        })
    },
    {
        accessorKey: 'employee',
        header: 'Employee',
        cell: ({ row }) => h(resolveComponent('NuxtLink'), { 
            class: 'flex items-center gap-3 group',
            to: `/${row.original.employeeId}/sales`,
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
            cell: ({ row }) => {
                const status: string = row.original.achievement.status ?? ''
                return h('div', { class: getAchievementColor(status) }, status)
            }
        },
    {
        accessorKey: 'activity',
        header: 'New Service',
        cell: ({ row }) => h('div', { class: 'text-center font-medium' }, row.original.achievement.activity),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.achievement.activity) || 0), 0)
            return h('div', { class: 'text-center font-bold py-3' }, total)
        }
    },
    {
        accessorKey: 'newSubscription',
        header: () => h('div', { class: 'text-right' }, 'New Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.newSubscription))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.newSubscription) || 0), 0)
            return h('div', { class: 'text-right font-bold py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'newCommission',
        header: () => h('div', { class: 'text-right' }, 'New Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.newCommission))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.newCommission) || 0), 0)
            return h('div', { class: 'text-right font-bold py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'recurringSubscription',
        header: () => h('div', { class: 'text-right' }, 'Recurring Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.recurringSubscription))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.recurringSubscription) || 0), 0)
            return h('div', { class: 'text-right font-bold py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'recurringCommission',
        header: () => h('div', { class: 'text-right' }, 'Recurring Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.recurringCommission))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.recurringCommission) || 0), 0)
            return h('div', { class: 'text-right font-bold py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'newMrc',
        header: () => h('div', { class: 'text-right' }, 'New MRC'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.newMrc))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.newMrc) || 0), 0)
            return h('div', { class: 'text-right font-bold py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'managerNewCommission',
        header: () => h('div', { class: 'text-right' }, 'Manager New Commission'),
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col items-end' }, [
                h('span', { class: 'text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 mb-1' }, Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.managerNewCommissionPercentage) + '%'),
                h('span', { class: 'text-sm font-bold text-gray-900 dark:text-white' }, formatCurrency(Number(row.original.managerNewCommission)))
            ])
        },
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.managerNewCommission) || 0), 0)
            return h('div', { class: 'text-right font-bold text-gray-900 dark:text-white py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'managerRecurringCommission',
        header: () => h('div', { class: 'text-right' }, 'Manager Recurring Commission'),
        cell: ({ row }) => {
            return h('div', { class: 'flex flex-col items-end' }, [
                h('span', { class: 'text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 mb-1' }, Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.managerRecurringCommissionPercentage) + '%'),
                h('span', { class: 'text-sm font-bold text-gray-900 dark:text-white' }, formatCurrency(Number(row.original.managerRecurringCommission)))
            ])
        },
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.managerRecurringCommission) || 0), 0)
            return h('div', { class: 'text-right font-bold text-gray-900 dark:text-white py-3' }, formatCurrency(total))
        }
    }
])


const yearlyData = ref<ManagerMouthlyResponseData['data']>()

const updatePeriodData = () => {
    if (yearlyData.value && selectedMonth.value?.label) {
        periodData.value = yearlyData.value.monthly[selectedMonth.value.label]
    }
}

const fetchData = async () => {
    const employeeService = new EmployeeService()
    const employeeData = await employeeService.getEmployee(route.params.id as string)
    employee.value = employeeData.data

    const commissionService = new CommissionService()
    const response = await commissionService.managerCommission(route.params.id as string, { 
        year: year.value 
    })
    
    if (response.success) {
        yearlyData.value = response.data
        updatePeriodData()
    }
}

watch([year], () => {
    fetchData()
})

watch([selectedMonth], () => {
    updatePeriodData()
})

const revenueTrendData = computed(() => {
    if (!yearlyData.value) return []
    return Object.entries(yearlyData.value.monthly).map(([month, data]) => ({
        date: month,
        'New Subscription': Number(data.monthlyNewSubscription),
        'Recurring Subscription': Number(data.monthlyRecurringSubscription),
        'New MRC': Number(data.monthlyNewMrc),
    }))
})

const revenueCategories = {
    'New Subscription': { name: 'New Subscription', color: '#6366f1' },
    'Recurring Subscription': { name: 'Recurring Subscription', color: '#f97316' },
    'New MRC': { name: 'New MRC', color: '#10b981' },
}

const revenueYAxis = ['New Subscription', 'Recurring Subscription', 'New MRC'] as any

const commissionTrendData = computed(() => {
    if (!yearlyData.value) return []
    return Object.entries(yearlyData.value.monthly).map(([month, data]) => ({
        date: month,
        'New Commission': Number(data.monthlyNewCommission),
        'Recurring Commission': Number(data.monthlyRecurringCommission)
    }))
})

const commissionCategories = {
    'New Commission': { name: 'New Commission', color: '#10b981' }, 
    'Recurring Commission': { name: 'Recurring Commission', color: '#3b82f6' }
}

const salesTrendData = computed(() => {
    if (!yearlyData.value) return []
    return Object.entries(yearlyData.value.monthly).map(([month, data]) => ({
        date: month,
        'Total Sales': data.sales?.total || 0,
        'New Service': data.sales?.activity || 0
    }))
})

const salesCategories = {
    'Total Sales': { name: 'Total Sales', color: '#f59e0b' },
    'New Service': { name: 'New Service', color: '#ec4899' }
}

const salesSourceTrendData = computed(() => {
    if (!yearlyData.value) return []
    return Object.entries(yearlyData.value.monthly).map(([month, data]) => ({
        date: month,
        'Permanent': data.sales?.Permanent || 0,
        'Probation': data.sales?.Probation || 0
    }))
})

const salesSourceCategories = {
    'Permanent': { name: 'Permanent', color: '#0ea5e9' },
    'Probation': { name: 'Probation', color: '#f59e0b' }
}

const serviceTrendData = computed(() => {
    if (!yearlyData.value) return []
    return Object.entries(yearlyData.value.monthly).map(([month, data]) => {
        const counts: Record<string, number> = { 'Home': 0, 'Nusafiber': 0, 'NusaSelecta': 0 }
        
        data.employee?.forEach(emp => {
            emp.newService?.forEach(svc => {
                 // Simple matching, assumes service names are consistent
                 if (svc.name === 'Home' || svc.name === 'Nusafiber' || svc.name === 'NusaSelecta') {
                     counts[svc.name] = (counts[svc.name] || 0) + svc.count
                 }
            })
        })
        
        return {
            date: month,
            ...counts
        }
    })
})

const serviceCategories = {
    'Home': { name: 'Home', color: '#0ea5e9' },
    'Nusafiber': { name: 'Nusafiber', color: '#a855f7' },
    'NusaSelecta': { name: 'NusaSelecta', color: '#f97316' }
}

const salesSourceYAxis = ['Permanent', 'Probation'] as any
const serviceYAxis = ['Home', 'Nusafiber', 'NusaSelecta'] as any

const productivityTrendData = computed(() => {
    if (!yearlyData.value) return []
    return Object.entries(yearlyData.value.monthly).map(([month, data]) => {
        const headcount = data.employee?.length || 1
        const totalSales = data.sales?.total || 0
        return {
            date: month,
            'Avg Sales': Number((totalSales / headcount).toFixed(2))
        }
    })
})

const productivityCategories = {
    'Avg Sales': { name: 'Avg Sales per Employee', color: '#14b8a6' }
}

const costOfSalesTrendData = computed(() => {
    if (!yearlyData.value) return []
    return Object.entries(yearlyData.value.monthly).map(([month, data]) => {
        const revenue = Number(data.monthlyNewSubscription) + Number(data.monthlyRecurringSubscription) + Number(data.monthlyNewMrc)
        const commission = Number(data.monthlyNewCommission) + Number(data.monthlyRecurringCommission)
        const ratio = revenue > 0 ? (commission / revenue) * 100 : 0
        return {
            date: month,
            'Commission Rate': Number(ratio.toFixed(2))
        }
    })
})

const costOfSalesCategories = {
    'Commission Rate': { name: 'Commission Rate (%)', color: '#f43f5e' }
}

const yearlyDonutData = computed(() => {
    if (!yearlyData.value) return []

    return [
        Number(yearlyData.value.yearlyNewCommission),
        Number(yearlyData.value.yearlyRecurringCommission)
    ]
})

const yearlyDonutCategories = computed(() => ({
    'New Commission': { name: 'New Commission', color: '#10b981' }, 
    'Recurring Commission': { name: 'Recurring Commission', color: '#3b82f6' }
}))


fetchData()
</script>