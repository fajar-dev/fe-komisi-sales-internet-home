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

                    <div class="mt-4 md:mt-6">
                        <PersonalSalesDetail :data="periodData" :churn-data="churnData" />
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
