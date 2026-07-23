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
                                <div class="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        class="h-full" 
                                        :class="getAchievementBg(periodData.sales.status)"
                                        :style="{ width: periodData.sales.percentage }"
                                    ></div>
                                </div>
                            </div>
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6">New Achievement</h4>
                            <div class="flex flex-col gap-2">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ periodData.sales.newAchievement }}</span>
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
                            <h4 class="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">New Achievement per Service</h4>
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

        <!-- SM Invoice: invoice langsung SM/CRO/CS — komisi hanya dari recurring (SE-002) -->
        <div class="py-2">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between gap-3">
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                SM Invoice
                            </h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                                Invoice langsung SM / CRO / CS — hanya komisi recurring ({{ smInvoiceData?.recurringRate ?? '-' }}%), tidak memengaruhi achievement
                            </p>
                        </div>
                        <div class="text-right" v-if="smInvoiceData">
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">SM Recurring Commission</p>
                            <span class="text-xl font-bold text-primary-500 dark:text-primary-400">{{ formatCurrency(Number(smInvoiceData.commission)) }}</span>
                        </div>
                    </div>
                </template>
                <UTabs :items="smTabItems" class="w-full">
                    <template #content="{ item }">
                        <UTable
                            sticky
                            :data="getSmTabData(item.key)"
                            :columns="smInvoiceColumns"
                            class="flex-1 max-h-[600px]"
                        />
                    </template>
                </UTabs>
            </UCard>
        </div>

        <div class="py-2 grid grid-cols-1 lg:grid-cols-2 gap-4" v-if="yearlyData">
            <!-- Financial and Performance Trends -->
            <div class="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <UCard>
                    <template #header>
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Target vs New Achievement
                            </h3>
                            <p class="text-xs text-gray-500">Monthly comparison of team targets vs actual achievement</p>
                        </div>
                    </template>
                    <div class="h-80 w-full">
                        <LineChart 
                            v-if="salesTrendData.length > 0"
                            :data="salesTrendData" 
                            index="date" 
                            :categories="salesCategories" 
                            :x-formatter="(i: number) => salesTrendData[i]?.date ?? ''"
                            :y-formatter="(tick: number) => Math.floor(tick).toString()"
                        />
                    </div>
                </UCard>
                <UCard>
                    <template #header>
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Commission Trend (Yearly)
                            </h3>
                            <p class="text-xs text-gray-500">Yearly trend of new and recurring commission income</p>
                        </div>
                    </template>
                    <div class="h-80 w-full">
                        <AreaChart 
                            v-if="commissionTrendData.length > 0"
                            :data="commissionTrendData" 
                            index="date" 
                            :categories="commissionCategories" 
                            :x-formatter="(i: number) => commissionTrendData[i]?.date ?? ''"
                            :y-formatter="formatCurrency"
                        />
                    </div>
                </UCard>
                <UCard>
                    <template #header>
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Team Achievement
                            </h3>
                            <p class="text-xs text-gray-500">Monthly trend of team's total commissions, subscriptions and MRC</p>
                        </div>
                    </template>
                    <div class="h-80 w-full">
                        <BarChart 
                            v-if="teamAchievementTrendData.length > 0"
                            :data="teamAchievementTrendData" 
                            index="date"
                            :orientation="Orientation.Horizontal"
                            :stacked="true"
                            :categories="teamAchievementCategories" 
                            :y-axis="teamAchievementYAxis"
                            :y-formatter="yFormatterTeam"
                            :x-formatter="formatCurrency"
                            :group-padding="0"
                            :bar-padding="0.2"
                            :radius="4"
                        />
                    </div>
                </UCard>
            </div>

            <!-- Priority Chart: Commission per Sales (Full Width) -->
            <UCard class="lg:col-span-2">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Monthly Total Commission per Sales
                            </h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Monthly trend of total commission earned by each sales team member</p>
                        </div>
                    </div>
                </template>
                <div class="w-full">
                    <BarChart 
                        v-if="teamCommissionTrendData.length > 0"
                        :data="teamCommissionTrendData" 
                        :height="400"
                        index="date"
                        :categories="teamCategories" 
                        :y-axis="allTeamMembers"
                        :y-formatter="formatCurrency"
                        :x-formatter="yFormatterTeam"
                        :group-padding="0"
                        :bar-padding="0.2"
                        :radius="4"
                    />
                </div>
            </UCard>

            <!-- MRC and Subscription side by side -->
            <UCard class="lg:col-span-2">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Monthly New MRC per Sales
                            </h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Monthly trend of new MRC generated by each sales team member</p>
                        </div>
                    </div>
                </template>
                <div class="w-full">
                    <BarChart 
                        v-if="teamMrcTrendData.length > 0"
                        :data="teamMrcTrendData" 
                        :height="400"
                        index="date"
                        :categories="teamCategories" 
                        :y-axis="allTeamMembers"
                        :y-formatter="formatCurrency"
                        :x-formatter="yFormatterTeam"
                        :group-padding="0"
                        :bar-padding="0.2"
                        :radius="4"
                    />
                </div>
            </UCard>

            <UCard class="lg:col-span-2">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Monthly Total Subscription per Sales
                            </h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Monthly trend of total subscription (New & Recurring) generated by each sales team member</p>
                        </div>
                    </div>
                </template>
                <div class="w-full">
                    <BarChart 
                        v-if="teamSubscriptionTrendData.length > 0"
                        :data="teamSubscriptionTrendData" 
                        :height="400"
                        index="date"
                        :categories="teamCategories" 
                        :y-axis="allTeamMembers"
                        :y-formatter="formatCurrency"
                        :x-formatter="yFormatterTeam"
                        :group-padding="0"
                        :bar-padding="0.2"
                        :radius="4"
                    />
                </div>
            </UCard>

        </div>

    </UContainer>
</template>

<script setup lang="ts">
import { CommissionService } from '~/services/commission-service'
import { EmployeeService } from '~/services/employee-service'
import { AdditionalService } from '~/services/additional-service'
import type { Employee } from '~/types/employee'
import type { TableColumn } from '@nuxt/ui'
import type { ManagerPeriodData, ManagerEmployeePerformance, ManagerMouthlyResponseData, ManagerInvoiceData, ManagerInvoiceItem } from '~/types/manager'
const { setLoading } = useLoading()
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

const getAchievementBg = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('tidak capai') || s.includes('sp1')) return 'bg-red-500'
    if (s.includes('average')) return 'bg-orange-500'
    if (s.includes('bonus')) return 'bg-violet-500'
    if (s.includes('excelent') || s.includes('excellent')) return 'bg-emerald-500'
    if (s.includes('very good')) return 'bg-teal-500'
    if (s.includes('capai target')) return 'bg-green-500'
    return 'bg-primary-500'
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
        accessorKey: 'newAchievement',
        header: 'New Achievement',
        cell: ({ row }) => h('div', { class: 'text-center font-medium' }, row.original.achievement.newAchievement),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.achievement.newAchievement) || 0), 0)
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
        accessorKey: 'otherSubscription',
        header: () => h('div', { class: 'text-right' }, 'Other Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.otherSubscription))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.otherSubscription) || 0), 0)
            return h('div', { class: 'text-right font-bold py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'otherCommission',
        header: () => h('div', { class: 'text-right' }, 'Other Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.otherCommission))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.otherCommission) || 0), 0)
            return h('div', { class: 'text-right font-bold py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'bonus',
        header: () => h('div', { class: 'text-right' }, 'Bonus'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.bonus))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.bonus) || 0), 0)
            return h('div', { class: 'text-right font-bold py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'totalCommission',
        header: () => h('div', { class: 'text-right' }, 'Total Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.totalCommission))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.totalCommission) || 0), 0)
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

// SM Invoice: invoice langsung SM/CRO/CS (SE-002) — komisi hanya recurring
const smInvoiceData = ref<ManagerInvoiceData | null>(null)

const smTabItems = computed(() => [
    { label: `Recurring (${smInvoiceData.value?.recurring?.data?.length || 0})`, key: 'recurring' },
    { label: `New (${smInvoiceData.value?.new?.data?.length || 0})`, key: 'new' },
    { label: `Prorate (${smInvoiceData.value?.prorate?.data?.length || 0})`, key: 'prorate' },
    { label: `Upgrade (${smInvoiceData.value?.upgrade?.data?.length || 0})`, key: 'upgrade' },
    { label: `Alat (${smInvoiceData.value?.alat?.data?.length || 0})`, key: 'alat' },
    { label: `Setup (${smInvoiceData.value?.setup?.data?.length || 0})`, key: 'setup' }
])

const getSmTabData = (key: string): ManagerInvoiceItem[] => {
    return (smInvoiceData.value as any)?.[key]?.data || []
}

const smInvoiceColumns: TableColumn<ManagerInvoiceItem>[] = [
    {
        accessorKey: 'paidDate',
        header: 'Paid Date',
        cell: ({ row }) => {
            if (!row.original.paidDate) return '-'
            return new Date(row.original.paidDate).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        }
    },
    {
        header: 'Service',
        cell: ({ row }) => h('div', { class: 'flex flex-col min-w-[120px]' }, [
            h('a', {
                href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customerServiceId}/detail`,
                target: '_blank',
                class: 'text-blue-500 hover:underline font-semibold text-sm break-all'
            }, row.original.customerServiceAccount),
            h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words line-clamp-2' }, row.original.serviceName)
        ])
    },
    {
        header: 'Customer',
        cell: ({ row }) => h('div', { class: 'flex flex-col min-w-[120px]' }, [
            h('a', {
                href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customerId}&pid=profile`,
                target: '_blank',
                class: 'text-blue-500 hover:underline font-semibold text-sm'
            }, row.original.customerId),
            h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words line-clamp-2' }, row.original.customerName)
        ])
    },
    {
        header: 'Sales ID',
        cell: ({ row }) => h('span', { class: 'text-xs font-medium' }, row.original.salesId || '-')
    },
    {
        accessorKey: 'dpp',
        header: () => h('div', { class: 'text-right' }, 'DPP'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.dpp)))
    },
    {
        accessorKey: 'lineRental',
        header: () => h('div', { class: 'text-right' }, 'Line Rental'),
        cell: ({ row }) => h('div', { class: 'text-right text-xs text-gray-500' }, formatCurrency(Number(row.original.lineRental)))
    },
    {
        header: 'Month Period',
        cell: ({ row }) => h('div', { class: 'text-center font-medium' }, row.original.month)
    },
    {
        id: 'smCommission',
        header: () => h('div', { class: 'text-right' }, 'SM Commission'),
        cell: ({ row }) => h('div', { class: 'flex flex-col items-end' }, [
            h('span', { class: 'text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 mb-1' },
                Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.smCommissionPercentage) + '%'),
            h('span', { class: 'text-sm font-bold text-gray-900 dark:text-white' }, formatCurrency(Number(row.original.smCommission)))
        ])
    }
]

const fetchSmInvoice = async () => {
    try {
        const commissionService = new CommissionService()
        const response = await commissionService.managerInvoice(route.params.id as string, {
            month: selectedMonth.value?.id ?? (new Date().getMonth() + 1),
            year: year.value
        })
        smInvoiceData.value = response.data
    } catch (error) {
        smInvoiceData.value = null
    }
}

const fetchData = async () => {
    try {
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
    } finally {
        // No longer setting loading false here
    }
}

const initData = async () => {
    setLoading(true)
    try {
        const additionalService = new AdditionalService()
        const currentPeriod = await additionalService.getCurrentPeriod()
        
        if (currentPeriod?.start && currentPeriod?.end) {
            if (currentPeriod.month && currentPeriod.year) {
                const m = monthSelect.value.find(x => x.id === currentPeriod.month)
                if (m) selectedMonth.value = m
                year.value = currentPeriod.year
            } else {
                const [endYear, endMonth] = currentPeriod.end.split('-').map(Number)
                const m = monthSelect.value.find(x => x.id === endMonth)
                if (m) selectedMonth.value = m
                year.value = endYear ?? new Date().getFullYear()
            }
        }
        
        await Promise.all([
            fetchData(),
            fetchSmInvoice()
        ])
    } finally {
        setLoading(false)
    }
}

watch([year], () => {
    fetchData()
    fetchSmInvoice()
})

watch([selectedMonth], () => {
    updatePeriodData()
    fetchSmInvoice()
})

const allTeamMembers = computed<string[]>(() => {
    if (!yearlyData.value) return []
    const members = new Set<string>()
    Object.values(yearlyData.value.monthly).forEach(month => {
        month.employee?.forEach(emp => {
            members.add(emp.name)
        })
    })
    return Array.from(members)
})

const teamCategories = computed(() => {
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#3b82f6', '#8b5cf6']
    const cat: any = {}
    allTeamMembers.value.forEach((name, i) => {
        cat[name] = { name: name, color: colors[i % colors.length] }
    })
    return cat
})

const teamCommissionTrendData = computed(() => {
    if (!yearlyData.value) return []
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    
    return months.map(m => {
        const data = yearlyData.value!.monthly[m]
        const row: any = { date: m }
        
        // Initialize all members to 0 for this month
        allTeamMembers.value.forEach(name => {
            row[name] = 0
        })
        
        // Fill in actual values if month data exists
        if (data) {
            data.employee?.forEach(emp => {
                row[emp.name] = Number(emp.totalCommission)
            })
        }
        return row
    })
})

const commissionTrendData = computed(() => {
    if (!yearlyData.value) return []
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months.map(m => {
        const data = yearlyData.value!.monthly[m]
        return {
            date: m,
            'New Commission': Number(data?.monthlyNewCommission || 0),
            'Recurring Commission': Number(data?.monthlyRecurringCommission || 0)
        }
    })
})

const commissionCategories = {
    'New Commission': { name: 'New Commission', color: '#10b981' }, 
    'Recurring Commission': { name: 'Recurring Commission', color: '#3b82f6' }
}

const salesTrendData = computed(() => {
    if (!yearlyData.value) return []
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months.map(m => {
        const data = yearlyData.value!.monthly[m]
        return {
            date: m,
            'Target': data?.sales?.target || 0,
            'New Achievement': data?.sales?.newAchievement || 0
        }
    })
})

const salesCategories = {
    'Target': { name: 'Target', color: '#f59e0b' },
    'New Achievement': { name: 'New Achievement', color: '#ec4899' }
}

const salesSourceTrendData = computed(() => {
    if (!yearlyData.value) return []
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months.map(m => {
        const data = yearlyData.value!.monthly[m]
        return {
            date: m,
            'Permanent': data?.sales?.Permanent || 0,
            'Probation': data?.sales?.Probation || 0
        }
    })
})

const teamAchievementTrendData = computed(() => {
    if (!yearlyData.value) return []
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months.map(m => {
        const data = yearlyData.value!.monthly[m]
        return {
            date: m,
            'New Commission': Number(data?.monthlyNewCommission || 0),
            'Recurring Commission': Number(data?.monthlyRecurringCommission || 0),
            'New Subscription': Number(data?.monthlyNewSubscription || 0),
            'New MRC': Number(data?.monthlyNewMrc || 0)
        }
    })
})

const teamAchievementCategories = {
    'New Commission': { name: 'New Commission', color: '#10b981' },
    'Recurring Commission': { name: 'Recurring Commission', color: '#3b82f6' },
    'New Subscription': { name: 'New Subscription', color: '#f59e0b' },
    'New MRC': { name: 'New MRC', color: '#ec4899' }
}

const teamAchievementYAxis = ['New Commission', 'Recurring Commission', 'New Subscription', 'New MRC'] as any


const teamMrcTrendData = computed(() => {
    if (!yearlyData.value) return []
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    
    return months.map(m => {
        const data = yearlyData.value!.monthly[m]
        const row: any = { date: m }
        
        allTeamMembers.value.forEach(name => {
            row[name] = 0
        })
        
        if (data) {
            data.employee?.forEach(emp => {
                row[emp.name] = Number(emp.newMrc)
            })
        }
        return row
    })
})

const teamSubscriptionTrendData = computed(() => {
    if (!yearlyData.value) return []
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    
    return months.map(m => {
        const data = yearlyData.value!.monthly[m]
        const row: any = { date: m }
        
        allTeamMembers.value.forEach(name => {
            row[name] = 0
        })
        
        if (data) {
            data.employee?.forEach(emp => {
                row[emp.name] = Number(emp.newSubscription || 0) + Number(emp.recurringSubscription || 0)
            })
        }
        return row
    })
})

const yFormatterTeam = (i: number): string => {
    return teamCommissionTrendData.value[i]?.date ?? ''
}

const xFormatterTeam = (tick: number): string => {
    return formatCurrency(tick)
}

initData()
</script>