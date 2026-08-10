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
                                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Sales Target</h3>
                                <p class="text-xs text-gray-500">{{ selectedMonthLabel }} {{ year }} &middot; Default target is {{ defaultTarget }} New Achievement/month for Permanent Account Managers</p>
                            </div>
                            <UInput v-model="globalFilter" icon="i-heroicons-magnifying-glass" placeholder="Search account manager..." />
                        </div>
                    </template>
                    <UTable sticky :columns="columns" :data="filteredData" class="flex-1 max-h-[800px]" />
                </UCard>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { SummaryService } from '~/services/summary-service'
import type { SalesTargetItem } from '~/types/summary'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
    headerProps: { toolbar: true }
})

const NuxtLink = resolveComponent('NuxtLink')
const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UInput = resolveComponent('UInput')

const { setLoading } = useLoading()
const toast = useToast()
const summaryService = new SummaryService()

const defaultTarget = 12

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthSelect = monthNames.map((label, i) => ({ id: i + 1, label }))
const yearItems = [2026, 2027, 2028, 2029, 2030]

const summaryData = ref<SalesTargetItem[]>([])
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const globalFilter = ref('')
const isMounted = ref(false)
const savingIds = ref(new Set<string>())

const selectedMonthLabel = computed(() => monthSelect.find(m => m.id === selectedMonth.value)?.label ?? '')

const filteredData = computed(() => {
    const query = globalFilter.value.trim().toLowerCase()
    if (!query) return summaryData.value
    return summaryData.value.filter(row =>
        row.name.toLowerCase().includes(query) || row.employeeId.toLowerCase().includes(query)
    )
})

const saveTarget = async (row: SalesTargetItem, value: number) => {
    if (!Number.isFinite(value) || value < 0) {
        toast.add({ title: 'Invalid target', description: 'Target must be a non-negative number', color: 'error' })
        return
    }
    if (value === row.target) return

    savingIds.value.add(row.employeeId)
    try {
        const response = await summaryService.updateSalesTarget(
            row.employeeId,
            { month: selectedMonth.value, year: year.value },
            { target: value }
        )
        if (response && response.success) {
            row.target = value
            toast.add({ title: 'Target updated', description: `${row.name}'s target is now ${value}`, color: 'success' })
        }
    } catch (error) {
        toast.add({ title: 'Error', description: 'Failed to update target', color: 'error' })
    } finally {
        savingIds.value.delete(row.employeeId)
    }
}

const columns: TableColumn<SalesTargetItem>[] = [
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
        accessorKey: 'target',
        header: () => h('div', { class: 'text-right' }, 'New Achievement Target'),
        cell: ({ row }) => h('div', { class: 'flex justify-end' }, [
            h(UInput, {
                type: 'number',
                min: 0,
                modelValue: row.original.target,
                loading: savingIds.value.has(row.original.employeeId),
                disabled: savingIds.value.has(row.original.employeeId),
                class: 'w-24',
                ui: { base: 'text-right' },
                'onUpdate:modelValue': (val: string | number) => {
                    row.original.target = Number(val)
                },
                onBlur: () => saveTarget(row.original, Number(row.original.target)),
                onKeydown: (e: KeyboardEvent) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                }
            })
        ])
    }
]

const fetchSummary = async () => {
    setLoading(true)
    try {
        const response = await summaryService.salesTarget({ month: selectedMonth.value, year: year.value })
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
