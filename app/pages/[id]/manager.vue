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
                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
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
                            </div>
                        </div>

                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Activity Performance</h4>
                            <div class="flex flex-col gap-2">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ periodData.sales.activity }}</span>
                                <span class="text-xs text-gray-500">Average Activity Score</span>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Team Achievement</h4>
                            <div class="flex flex-col gap-3">
                                <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ periodData.sales.percentage }}</span>
                                <div>
                                    <UBadge :color="getBadgeColor(periodData.sales.status)" variant="subtle">
                                        {{ periodData.sales.status }}
                                    </UBadge>
                                </div>
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
                    :data="formattedRows" 
                    :columns="columns" 
                    class="flex-1 max-h-[800px] [&_tr:has(.commission-zero)]:bg-yellow-50 dark:[&_tr:has(.commission-zero)]:bg-yellow-950/20 [&_tr:has(.row-deleted)]:bg-red-50 dark:[&_tr:has(.row-deleted)]:bg-red-950/20" 
                />
            </UCard>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { CommissionService } from '~/services/commission-service'
import { EmployeeService } from '~/services/employee-service'
import type { Employee } from '~/types/employee'
import type { TableColumn } from '@nuxt/ui'
import type { ManagerPeriodData, ManagerEmployeePerformance } from '~/types/manager'
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

const formatCurrency = (value: number): string => {
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

const columns = computed<TableColumn<ManagerEmployeePerformance>[]>(() => [
    {
        accessorKey: 'employee',
        header: 'Employee',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
            h(UAvatar, { src: row.original.photoProfile, alt: row.original.name, size: 'sm' }),
            h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-sm font-medium text-gray-900 dark:text-white' }, row.original.name),
                h('span', { class: 'text-xs text-gray-500' }, row.original.employeeId)
            ])
        ]),
        footer: () => h('div', { class: 'font-bold py-3' }, 'Total')
    },
    {
        accessorKey: 'activity',
        header: 'Activity',
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
        accessorKey: 'recurringSubscription',
        header: () => h('div', { class: 'text-right' }, 'Recurring Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(Number(row.original.recurringSubscription))),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.recurringSubscription) || 0), 0)
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
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-gray-900 dark:text-white' }, 
            formatCurrency(Number(row.original.managerNewCommission))
        ),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.managerNewCommission) || 0), 0)
            return h('div', { class: 'text-right font-bold text-gray-900 dark:text-white py-3' }, formatCurrency(total))
        }
    },
    {
        accessorKey: 'managerRecurringCommission',
        header: () => h('div', { class: 'text-right' }, 'Manager Recurring Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-gray-900 dark:text-white' }, 
            formatCurrency(Number(row.original.managerRecurringCommission))
        ),
        footer: () => {
            const total = formattedRows.value.reduce((sum, row) => sum + (Number(row.managerRecurringCommission) || 0), 0)
            return h('div', { class: 'text-right font-bold text-gray-900 dark:text-white py-3' }, formatCurrency(total))
        }
    }
])


const fetchData = async () => {
    const employeeService = new EmployeeService()
    const employeeData = await employeeService.getEmployee(route.params.id as string)
    employee.value = employeeData.data

    const commissionService = new CommissionService()
    const data = await commissionService.managerCommissionPeriod(route.params.id as string, { 
        year: year.value, 
        month: selectedMonth.value?.id ?? 0 
    })
    
    periodData.value = data.data
}

watch([year, selectedMonth], () => {
    fetchData()
})

fetchData()
</script>