<template>
    <div class="space-y-4">
        <ClientOnly>
            <Teleport v-if="isMounted" to="#toolbar-left">
                <div class="flex items-center gap-1">
                    <UButton icon="i-lucide-arrow-left" size="lg" color="neutral" variant="ghost" to="/"/>
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
                                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Account Manager Summary
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
import type { SalesSummaryItem } from '~/types/summary'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  headerProps: {
    toolbar: true
  }
})

const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const NuxtLink = resolveComponent('NuxtLink')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

const { setLoading } = useLoading()
const commissionService = new CommissionService()
const additionalService = new AdditionalService()

const summaryData = ref<SalesSummaryItem[]>([])
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const yearItems = ref<number[]>([])
const hideValues = ref(true)
const isMounted = ref(false)

const getRowItems = (row: any) => [
    [
        {
            label: 'View Details',
            icon: 'i-heroicons-user-20-solid',
            onSelect: () => useRouter().push(`/${row.original.employeeId}/sales`)
        }
    ]
]

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

const columns: TableColumn<SalesSummaryItem>[] = [
    {
        accessorKey: 'name',
        header: 'Account Manager',
        cell: ({ row }) => h(NuxtLink, { 
            to: `/${row.original.employeeId}/sales`,
            class: 'flex items-center gap-3 group' 
        }, [
            h(UAvatar, { src: row.original.photoProfile, alt: row.original.name, size: 'sm' }),
            h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors' }, row.original.name),
                h('span', { class: 'text-xs text-gray-500' }, row.original.employeeId)
            ])
        ])
    },
    {
        accessorKey: 'achievement',
        header: 'Achievement',
        cell: ({ row }) => h('div', { class: getAchievementColor(row.original.achievement) }, row.original.achievement)
    },
    {
        accessorKey: 'newService',
        header: () => h('div', { class: 'text-center' }, 'New Service'),
        cell: ({ row }) => h('div', { class: 'text-center font-bold' }, row.original.newService)
    },
    {
        accessorKey: 'newMrc',
        header: () => h('div', { class: 'text-right' }, 'New MRC'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.newMrc))
    },
    {
        accessorKey: 'newSubscription',
        header: () => h('div', { class: 'text-right' }, 'New Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.newSubscription))
    },
    {
        accessorKey: 'newCommission',
        header: () => h('div', { class: 'text-right' }, 'New Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.newCommission))
    },
    {
        accessorKey: 'recurringSubscription',
        header: () => h('div', { class: 'text-right' }, 'Recurring Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.recurringSubscription))
    },
    {
        accessorKey: 'recurringCommission',
        header: () => h('div', { class: 'text-right' }, 'Recurring Commission'),
        cell: ({ row }) => h('div', { class: 'text-right     font-medium' }, formatCurrency(row.original.recurringCommission))
    },
    {
        accessorKey: 'otherSubscription',
        header: () => h('div', { class: 'text-right' }, 'Other Subscription'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.otherSubscription))
    },
    {
        accessorKey: 'otherCommission',
        header: () => h('div', { class: 'text-right' }, 'Other Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.otherCommission))
    },
    {
        accessorKey: 'bonus',
        header: () => h('div', { class: 'text-right' }, 'Bonus'),
        cell: ({ row }) => h('div', { class: 'text-right font-medium text-violet-600 dark:text-violet-400' }, formatCurrency(row.original.bonus))
    },
    {
        accessorKey: 'totalCommission',
        header: () => h('div', { class: 'text-right' }, 'Total Commission'),
        cell: ({ row }) => h('div', { class: 'text-right font-bold text-primary-600 dark:text-primary-400' }, formatCurrency(row.original.totalCommission))
    },
    {
    id: 'actions',
    meta: {
      class: {
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: 'end'
          },
          items: getRowItems(row),
          'aria-label': 'Actions dropdown'
        },
        () =>
          h(UButton, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            'aria-label': 'Actions dropdown'
          })
      )
    }
  }

]

const fetchSummary = async () => {
    setLoading(true)
    try {
        const response = await commissionService.salesSummary({
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