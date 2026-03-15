<template>
    <div class="space-y-4">
        <ClientOnly>
            <Teleport v-if="isMounted" to="#toolbar-left">
                <div class="flex items-center gap-1">
                    <UButton to="/sumarry/sales" icon="i-heroicons-users" :variant="$route.path === '/sumarry/sales' ? 'soft' : 'ghost'" :color="$route.path === '/sumarry/sales' ? 'primary' : 'neutral'" size="sm">Account Manager</UButton>
                    <USeparator orientation="vertical" class="h-7 w-2" />
                    <UButton to="/sumarry/manager" icon="i-heroicons-presentation-chart-line" :variant="$route.path === '/sumarry/manager' ? 'soft' : 'ghost'" :color="$route.path === '/sumarry/manager' ? 'primary' : 'neutral'" size="sm">Sales Manager</UButton>
                    <USeparator orientation="vertical" class="h-7 w-2" />
                    <UButton to="/sumarry/invoice" icon="i-heroicons-document-text" :variant="$route.path === '/sumarry/invoice' ? 'soft' : 'ghost'" :color="$route.path === '/sumarry/invoice' ? 'primary' : 'neutral'" size="sm">Invoice</UButton>
                    <USeparator orientation="vertical" class="h-7 w-2" />
                    <UButton to="/sumarry/churn" icon="i-heroicons-archive-box-x-mark" :variant="$route.path === '/sumarry/churn' ? 'soft' : 'ghost'" :color="$route.path === '/sumarry/churn' ? 'primary' : 'neutral'" size="sm">Churn</UButton>
                </div>
            </Teleport>
            <Teleport v-if="isMounted" to="#toolbar-right">
                <div class="flex items-center gap-2">
                    <USelectMenu v-model="selectedMonth" :items="monthSelect" value-key="id" class="w-40" />
                    <USelectMenu v-model="year" :items="yearItems" class="w-24" />
                </div>
            </Teleport>
        </ClientOnly>

        <UContainer>
            <HeroBackground />
            <div class="py-4">
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Sales Manager Summary
                            </h3>
                                <p class="text-xs text-gray-500">{{ selectedMonthLabel }} {{ year }}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Hide Values</span>
                                <USwitch v-model="hideValues" color="primary" />
                            </div>
                        </div>
                    </template>
                    <UTable
                        sticky
                        :columns="columns"
                        :data="summaryData"
                        class="flex-1 max-h-[800px]"
                    />
                </UCard>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent, ref, onMounted, watch, computed, nextTick } from 'vue'
import { CommissionService } from '~/services/commission-service'
import { AdditionalService } from '~/services/additional-service'
import type { ManagerSummaryItem } from '~/types/summary'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  headerProps: {
    toolbar: true
  }
})

const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const NuxtLink = resolveComponent('NuxtLink')

const { setLoading } = useLoading()
const commissionService = new CommissionService()
const additionalService = new AdditionalService()

const summaryData = ref<ManagerSummaryItem[]>([])
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const yearItems = ref<number[]>([])
const hideValues = ref(true)
const isMounted = ref(false)

const monthSelect = [
    { id: 1, label: 'January' },
    { id: 2, label: 'February' },
    { id: 3, label: 'March' },
    { id: 4, label: 'April' },
    { id: 5, label: 'May' },
    { id: 6, label: 'June' },
    { id: 7, label: 'July' },
    { id: 8, label: 'August' },
    { id: 9, label: 'September' },
    { id: 10, label: 'October' },
    { id: 11, label: 'November' },
    { id: 12, label: 'December' }
]

const selectedMonthLabel = computed(() => {
    return monthSelect.find(m => m.id === selectedMonth.value)?.label || ''
})

const formatCurrency = (value: any) => {
    if (value === '***') return '***'
    const num = Number(value)
    if (isNaN(num)) return value
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num)
}

const getAchievementColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('tidak capai') || s.includes('sp1')) return 'font-bold text-red-500 dark:text-red-400 text-xs uppercase'
    if (s.includes('average')) return 'font-bold text-orange-500 dark:text-orange-400 text-xs uppercase'
    if (s.includes('bonus')) return 'font-bold text-violet-500 dark:text-violet-400 text-xs uppercase'
    if (s.includes('excelent') || s.includes('excellent')) return 'font-bold text-emerald-500 dark:text-emerald-400 text-xs uppercase'
    if (s.includes('very good')) return 'font-bold text-teal-500 dark:text-teal-400 text-xs uppercase'
    if (s.includes('capai target')) return 'font-bold text-green-500 dark:text-green-400 text-xs uppercase'
    return 'text-primary-500 dark:text-primary-400 text-xs uppercase'
}

const columns: TableColumn<ManagerSummaryItem>[] = [
    {
        accessorKey: 'name',
        header: 'Sales Manager',
        cell: ({ row }) => h(NuxtLink, { 
            to: `/${row.original.employeeId}/manager`,
            class: 'flex items-center gap-3 group' 
        }, [
            h(UAvatar, { src: row.original.photoProfile, alt: row.original.name, size: 'sm' }),
            h('div', { class: 'flex flex-col text-left' }, [
                h('span', { class: 'font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors' }, row.original.name),
                h('span', { class: 'text-[10px] text-gray-500' }, row.original.employeeId)
            ])
        ])
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => h('div', { class: getAchievementColor(row.original.status) }, row.original.status)
    },
    {
        accessorKey: 'newService',
        header: () => h('div', { class: 'text-center' }, 'New Service'),
        cell: ({ row }) => h('div', { class: 'text-center font-bold' }, row.original.newService)
    },
    {
        accessorKey: 'percentage',
        header: () => h('div', { class: 'text-center' }, 'Achv'),
        cell: ({ row }) => h('div', { class: 'text-center font-bold text-sm' }, row.original.percentage)
    },
    {
        accessorKey: 'team',
        header: () => h('div', { class: 'text-center' }, 'Team'),
        cell: ({ row }) => h('div', { class: 'text-center font-bold text-sm' }, row.original.team)
    },
    {
        accessorKey: 'monthlyNewMrc',
        header: () => h('div', { class: 'text-right' }, 'New MRC'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, formatCurrency(row.original.monthlyNewMrc))
    },
    {
        accessorKey: 'monthlyNewSubscription',
        header: () => h('div', { class: 'text-right' }, 'New Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, formatCurrency(row.original.monthlyNewSubscription))
    },
    {
        accessorKey: 'monthlyNewCommission',
        header: () => h('div', { class: 'text-right' }, 'New Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, formatCurrency(row.original.monthlyNewCommission))
    },
    {
        accessorKey: 'monthlyRecurringSubscription',
        header: () => h('div', { class: 'text-right' }, 'Recurring Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, formatCurrency(row.original.monthlyRecurringSubscription))
    },
    {
        accessorKey: 'monthlyRecurringCommission',
        header: () => h('div', { class: 'text-right' }, 'Recurring Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, formatCurrency(row.original.monthlyRecurringCommission))
    },
    {
        accessorKey: 'managerNewCommission',
        header: () => h('div', { class: 'text-right text-primary-500' }, 'Mgr New Comm'),
        cell: ({ row }) => h('div', { class: 'text-right font-bold text-primary-600 dark:text-primary-400 text-xs' }, formatCurrency(row.original.managerNewCommission))
    },
    {
        accessorKey: 'managerRecurringCommission',
        header: () => h('div', { class: 'text-right text-primary-500' }, 'Mgr Recur Comm'),
        cell: ({ row }) => h('div', { class: 'text-right font-bold text-primary-600 dark:text-primary-400 text-xs' }, formatCurrency(row.original.managerRecurringCommission))
    },
    {
        accessorKey: 'managerTotalCommission',
        header: () => h('div', { class: 'text-right text-primary-600 font-bold' }, 'Mgr Total'),
        cell: ({ row }) => h('div', { class: 'text-right font-bold text-primary-700 dark:text-primary-300' }, formatCurrency(row.original.managerTotalCommission))
    }
]

const fetchSummary = async () => {
    setLoading(true)
    try {
        const response = await commissionService.managerSummary({
            month: selectedMonth.value,
            year: year.value,
            hide: hideValues.value
        })
        if (response && response.success) {
            summaryData.value = response.data || []
        } else {
            summaryData.value = []
        }
    } catch (error) {
        console.error('Failed to fetch summary:', error)
        summaryData.value = []
    } finally {
        setLoading(false)
    }
}

const initData = async () => {
    setLoading(true)
    try {
        const currentPeriod = await additionalService.getCurrentPeriod()
        if (currentPeriod) {
            selectedMonth.value = currentPeriod.month
            year.value = currentPeriod.year
        }
        
        const currentYear = new Date().getFullYear()
        yearItems.value = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
        
        await fetchSummary()
    } finally {
        setLoading(false)
    }
}

onMounted(() => {
    initData()
    nextTick(() => {
        isMounted.value = true
    })
})

watch([year, selectedMonth, hideValues], () => {
    fetchSummary()
})
</script>