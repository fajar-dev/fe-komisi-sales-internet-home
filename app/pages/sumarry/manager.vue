<template>
    <div class="space-y-4">
        <ClientOnly>
            <Teleport v-if="isMounted" to="#toolbar-left">
                <div class="flex items-center gap-1">
                    <UButton icon="i-lucide-arrow-left" size="lg" color="neutral" variant="ghost" to="/" />
                    <USeparator orientation="vertical" class="h-7 w-2" />
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
                                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Sales Manager Summary</h3>
                                <p class="text-xs text-gray-500">{{ selectedMonthLabel }} {{ year }}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Hide Values</span>
                                <USwitch v-model="hideValues" color="primary" />
                            </div>
                        </div>
                    </template>
                    <UTable sticky :columns="columns" :data="summaryData" class="flex-1 max-h-[800px]" />
                </UCard>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { SummaryService } from '~/services/summary-service'
import type { ManagerSummaryItem } from '~/types/summary'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
    headerProps: { toolbar: true }
})

const NuxtLink = resolveComponent('NuxtLink')
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')

const { setLoading } = useLoading()
const { formatCurrency } = useFormat()
const summaryService = new SummaryService()

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthSelect = monthNames.map((label, i) => ({ id: i + 1, label }))
const yearItems = [2026, 2027, 2028, 2029, 2030]

const summaryData = ref<ManagerSummaryItem[]>([])
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const hideValues = ref(true)
const isMounted = ref(false)

const selectedMonthLabel = computed(() => monthSelect.find(m => m.id === selectedMonth.value)?.label ?? '')

const maskedCurrency = (value: number) => hideValues.value ? '***' : formatCurrency(value)

const columns: TableColumn<ManagerSummaryItem>[] = [
    {
        accessorKey: 'name',
        header: 'Sales Manager',
        cell: ({ row }) => h(NuxtLink, { to: `/${row.original.employeeId}/manager`, class: 'flex items-center gap-3 group' }, () => [
            h(UAvatar, { src: row.original.photoProfile, alt: row.original.name, size: 'sm' }),
            h('div', { class: 'flex flex-col text-left' }, [
                h('span', { class: 'font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors' }, row.original.name),
                h('span', { class: 'text-[10px] text-gray-500' }, row.original.employeeId)
            ])
        ])
    },
    {
        accessorKey: 'isTargetAchieved',
        header: 'Status',
        cell: ({ row }) => h(UBadge, { color: row.original.isTargetAchieved ? 'success' : 'error', variant: 'subtle' }, () => row.original.isTargetAchieved ? 'Capai Target' : 'Tidak Capai Target')
    },
    {
        accessorKey: 'activityCount',
        header: () => h('div', { class: 'text-center' }, 'New Service'),
        cell: ({ row }) => h('div', { class: 'text-center font-bold' }, row.original.activityCount)
    },
    {
        accessorKey: 'achievementPercentage',
        header: () => h('div', { class: 'text-center' }, 'Achv'),
        cell: ({ row }) => h('div', { class: 'text-center font-bold text-sm' }, `${Math.round(row.original.achievementPercentage)}%`)
    },
    {
        accessorKey: 'totalCount',
        header: () => h('div', { class: 'text-center' }, 'Team'),
        cell: ({ row }) => h('div', { class: 'text-center font-bold text-sm' }, row.original.totalCount)
    },
    {
        accessorKey: 'newMrc',
        header: () => h('div', { class: 'text-right' }, 'New MRC'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, maskedCurrency(row.original.newMrc))
    },
    {
        accessorKey: 'newSubscription',
        header: () => h('div', { class: 'text-right' }, 'New Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, maskedCurrency(row.original.newSubscription))
    },
    {
        accessorKey: 'newCommission',
        header: () => h('div', { class: 'text-right' }, 'New Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, maskedCurrency(row.original.newCommission))
    },
    {
        accessorKey: 'recurringSubscription',
        header: () => h('div', { class: 'text-right' }, 'Recurring Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, maskedCurrency(row.original.recurringSubscription))
    },
    {
        accessorKey: 'recurringCommission',
        header: () => h('div', { class: 'text-right' }, 'Recurring Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-xs' }, maskedCurrency(row.original.recurringCommission))
    },
    {
        accessorKey: 'managerNewCommission',
        header: () => h('div', { class: 'text-right text-primary-500' }, 'Mgr New Comm'),
        cell: ({ row }) => h('div', { class: 'text-right font-bold text-primary-600 dark:text-primary-400 text-xs' }, maskedCurrency(row.original.managerNewCommission))
    },
    {
        accessorKey: 'managerRecurringCommission',
        header: () => h('div', { class: 'text-right text-primary-500' }, 'Mgr Recur Comm'),
        cell: ({ row }) => h('div', { class: 'text-right font-bold text-primary-600 dark:text-primary-400 text-xs' }, maskedCurrency(row.original.managerRecurringCommission))
    },
    {
        accessorKey: 'managerTotalCommission',
        header: () => h('div', { class: 'text-right text-primary-600 font-bold' }, 'Mgr Total'),
        cell: ({ row }) => h('div', { class: 'text-right font-bold text-primary-700 dark:text-primary-300' }, maskedCurrency(row.original.managerTotalCommission))
    }
]

const fetchSummary = async () => {
    setLoading(true)
    try {
        const response = await summaryService.managerSummary({ month: selectedMonth.value, year: year.value })
        summaryData.value = response?.data ?? []
    } finally {
        setLoading(false)
    }
}

onMounted(() => {
    fetchSummary()
    nextTick(() => {
        isMounted.value = true
    })
})

watch([year, selectedMonth], () => {
    fetchSummary()
})
</script>
