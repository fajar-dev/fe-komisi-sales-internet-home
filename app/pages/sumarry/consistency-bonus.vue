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
                    <USeparator orientation="vertical" class="h-7 w-2" />
                    <UButton to="/sumarry/target" icon="i-heroicons-flag" :variant="$route.path === '/sumarry/target' ? 'soft' : 'ghost'" :color="$route.path === '/sumarry/target' ? 'primary' : 'neutral'" size="sm">Target</UButton>
                    <USeparator orientation="vertical" class="h-7 w-2" />
                    <UButton to="/sumarry/consistency-bonus" icon="i-heroicons-gift" :variant="$route.path === '/sumarry/consistency-bonus' ? 'soft' : 'ghost'" :color="$route.path === '/sumarry/consistency-bonus' ? 'primary' : 'neutral'" size="sm">Bonus Konsistensi</UButton>
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
                                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Bonus Konsistensi</h3>
                                <p class="text-xs text-gray-500">{{ selectedMonthLabel }} {{ year }} &middot; Bonus tetap Rp 1.000.000, ditambahkan ke Total Komisi periode ini</p>
                            </div>
                            <UInput v-model="globalFilter" icon="i-heroicons-magnifying-glass" placeholder="Search account manager..." />
                        </div>
                    </template>
                    <UTable sticky :columns="columns" :data="filteredData" class="flex-1 max-h-[800px]" />
                </UCard>
            </div>
        </UContainer>

        <GrantConsistencyBonusModal
            v-model:open="isGrantModalOpen"
            :employee-id="selectedEmployeeId"
            :employee-name="selectedEmployeeName"
            :existing-note="selectedExistingNote"
            :existing-months="selectedExistingMonths"
            :existing-service-count="selectedExistingServiceCount"
            :existing-testimonial-link="selectedExistingTestimonialLink"
            :month="selectedMonth"
            :year="year"
            @success="fetchSummary"
        />
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { SummaryService } from '~/services/summary-service'
import type { ConsistencyBonusItem } from '~/types/summary'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
    headerProps: { toolbar: true }
})

const NuxtLink = resolveComponent('NuxtLink')
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UTooltip = resolveComponent('UTooltip')

const { setLoading } = useLoading()
const { formatCurrency } = useFormat()
const toast = useToast()
const summaryService = new SummaryService()

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthSelect = monthNames.map((label, i) => ({ id: i + 1, label }))
const yearItems = [2026, 2027, 2028, 2029, 2030]

const summaryData = ref<ConsistencyBonusItem[]>([])
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const globalFilter = ref('')
const isMounted = ref(false)
const revokingIds = ref(new Set<string>())

const isGrantModalOpen = ref(false)
const selectedEmployeeId = ref<string | null>(null)
const selectedEmployeeName = ref<string | null>(null)
const selectedExistingNote = ref<string | null>(null)
const selectedExistingMonths = ref<string | null>(null)
const selectedExistingServiceCount = ref<number | null>(null)
const selectedExistingTestimonialLink = ref<string | null>(null)

const monthShortLabel = (n: number) => monthSelect.find(m => m.id === n)?.label.slice(0, 3) ?? String(n)
const formatMonths = (months: string | null) => months ? months.split(',').map(m => monthShortLabel(Number(m))).join(', ') : null

const selectedMonthLabel = computed(() => monthSelect.find(m => m.id === selectedMonth.value)?.label ?? '')

const filteredData = computed(() => {
    const query = globalFilter.value.trim().toLowerCase()
    if (!query) return summaryData.value
    return summaryData.value.filter(row =>
        row.name.toLowerCase().includes(query) || row.employeeId.toLowerCase().includes(query)
    )
})

const openGrantModal = (row: ConsistencyBonusItem) => {
    selectedEmployeeId.value = row.employeeId
    selectedEmployeeName.value = row.name
    selectedExistingNote.value = row.note
    selectedExistingMonths.value = row.months
    selectedExistingServiceCount.value = row.serviceCount
    selectedExistingTestimonialLink.value = row.testimonialLink
    isGrantModalOpen.value = true
}

const revokeBonus = async (row: ConsistencyBonusItem) => {
    revokingIds.value.add(row.employeeId)
    try {
        const response = await summaryService.revokeConsistencyBonus(row.employeeId, { month: selectedMonth.value, year: year.value })
        if (response && response.success) {
            row.amount = 0
            row.note = null
            row.months = null
            row.serviceCount = null
            row.testimonialLink = null
            row.grantedBy = null
            row.grantedByName = null
            row.createdAt = null
            toast.add({ title: 'Revoked', description: `Bonus Konsistensi ${row.name} dicabut`, color: 'success' })
        }
    } catch (error) {
        toast.add({ title: 'Error', description: 'Failed to revoke bonus', color: 'error' })
    } finally {
        revokingIds.value.delete(row.employeeId)
    }
}

const columns: TableColumn<ConsistencyBonusItem>[] = [
    {
        accessorKey: 'name',
        header: 'Account Manager',
        cell: ({ row }) => h(NuxtLink, { to: `/${row.original.employeeId}/sales`, class: 'flex items-center gap-3 group' }, () => [
            h(UAvatar, { src: row.original.photoProfile, alt: row.original.name, size: 'sm' }),
            h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors' }, row.original.name),
                h('span', { class: 'text-xs text-gray-500' }, row.original.employeeId)
            ])
        ])
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => row.original.status
            ? h(UBadge, { color: row.original.status === 'Permanent' ? 'primary' : 'neutral', variant: 'subtle' }, () => row.original.status)
            : h('span', { class: 'text-xs text-gray-400 italic' }, 'N/A')
    },
    {
        accessorKey: 'amount',
        header: () => h('div', { class: 'text-right' }, 'Bonus'),
        cell: ({ row }) => row.original.amount > 0
            ? h('div', { class: 'text-right font-bold text-violet-600 dark:text-violet-400' }, formatCurrency(row.original.amount))
            : h('div', { class: 'text-right text-xs text-gray-400 italic' }, 'Not granted')
    },
    {
        accessorKey: 'note',
        header: 'Note',
        cell: ({ row }) => {
            const note = row.original.note
            if (!note) return h('span', { class: 'text-xs text-gray-400 italic' }, '-')
            return h(UTooltip, { text: note, delayDuration: 0 }, () =>
                h('span', { class: 'text-xs text-gray-600 dark:text-gray-300 truncate block max-w-[220px]' }, note))
        }
    },
    {
        accessorKey: 'serviceCount',
        header: () => h('div', { class: 'text-center' }, 'Service'),
        cell: ({ row }) => h('div', { class: 'text-center font-medium' }, row.original.serviceCount ?? '-')
    },
    {
        accessorKey: 'months',
        header: 'Bulan',
        cell: ({ row }) => {
            const label = formatMonths(row.original.months)
            return label
                ? h('span', { class: 'text-xs text-gray-600 dark:text-gray-300' }, label)
                : h('span', { class: 'text-xs text-gray-400 italic' }, '-')
        }
    },
    {
        accessorKey: 'testimonialLink',
        header: 'Testimoni',
        cell: ({ row }) => row.original.testimonialLink
            ? h('a', { href: row.original.testimonialLink, target: '_blank', class: 'text-xs text-blue-500 hover:underline' }, 'Lihat')
            : h('span', { class: 'text-xs text-gray-400 italic' }, '-')
    },
    {
        accessorKey: 'grantedByName',
        header: 'Granted By',
        cell: ({ row }) => row.original.grantedByName
            ? h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'text-xs font-medium' }, row.original.grantedByName),
                h('span', { class: 'text-[10px] text-gray-400' }, row.original.createdAt ? new Date(row.original.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '')
            ])
            : h('span', { class: 'text-xs text-gray-400 italic' }, '-')
    },
    {
        id: 'actions',
        header: () => h('div', { class: 'text-right' }, 'Actions'),
        cell: ({ row }) => h('div', { class: 'flex justify-end gap-2' }, [
            row.original.amount > 0
                ? h(UButton, {
                    color: 'error',
                    loading: revokingIds.value.has(row.original.employeeId),
                    onClick: () => revokeBonus(row.original)
                }, () => 'Revoke')
                : h(UButton, {
                    color: 'primary',
                    onClick: () => openGrantModal(row.original)
                }, () => 'Grant')
        ])
    }
]

const fetchSummary = async () => {
    setLoading(true)
    try {
        const response = await summaryService.consistencyBonus({ month: selectedMonth.value, year: year.value })
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
