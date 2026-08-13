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
                                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Churn Summary</h3>
                                <p class="text-xs text-gray-500">{{ selectedMonthLabel }} {{ year }}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <UInput v-model="globalFilter" icon="i-heroicons-magnifying-glass" placeholder="Search churns..." />
                            </div>
                        </div>
                    </template>

                    <UTable
                        ref="table"
                        sticky
                        v-model:pagination="pagination"
                        v-model:global-filter="globalFilter"
                        v-model:sorting="sorting"
                        :columns="columns"
                        :data="summaryData"
                        :pagination-options="{
                            getPaginationRowModel: getPaginationRowModel()
                        }"
                        class="flex-1 max-h-[800px]"
                    />

                    <template #footer>
                        <div class="flex items-center justify-between pt-4 px-4">
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                Showing
                                <span class="font-medium text-gray-700 dark:text-gray-200">{{ table?.tableApi?.getFilteredRowModel().rows.length === 0 ? 0 : (table?.tableApi?.getState().pagination.pageIndex || 0) * (table?.tableApi?.getState().pagination.pageSize || 0) + 1 }}</span>
                                to
                                <span class="font-medium text-gray-700 dark:text-gray-200">{{ Math.min(((table?.tableApi?.getState().pagination.pageIndex || 0) + 1) * (table?.tableApi?.getState().pagination.pageSize || 0), table?.tableApi?.getFilteredRowModel().rows.length || 0) }}</span>
                                of
                                <span class="font-medium text-gray-700 dark:text-gray-200">{{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}</span>
                                results
                            </div>
                            <UPagination
                                :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                                :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                                :total="table?.tableApi?.getFilteredRowModel().rows.length"
                                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
                            />
                        </div>
                    </template>
                </UCard>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent, ref, onMounted, watch, computed, nextTick, useTemplateRef } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { SummaryService } from '~/services/summary-service'
import type { ChurnSummaryItem } from '~/types/summary'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
    headerProps: { toolbar: true }
})

const UAvatar = resolveComponent('UAvatar')
const NuxtLink = resolveComponent('NuxtLink')
const UButton = resolveComponent('UButton')
const USwitch = resolveComponent('USwitch')
const UIcon = resolveComponent('UIcon')
const UTooltip = resolveComponent('UTooltip')

const { setLoading } = useLoading()
const { formatCurrency, formatDate } = useFormat()
const toast = useToast()
const summaryService = new SummaryService()

const table = useTemplateRef('table')
const summaryData = ref<ChurnSummaryItem[]>([])
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const yearItems = [2026, 2027, 2028, 2029, 2030]
const isMounted = ref(false)

const pagination = ref({
    pageIndex: 0,
    pageSize: 100
})
const sorting = ref([{ id: 'no', desc: false }])
const globalFilter = ref('')

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthSelect = monthNames.map((label, i) => ({ id: i + 1, label }))

const selectedMonthLabel = computed(() => monthSelect.find(m => m.id === selectedMonth.value)?.label ?? '')

const columns: TableColumn<ChurnSummaryItem>[] = [
    {
        id: 'no',
        header: '#',
        cell: ({ row }) => h('div', { class: 'text-center text-xs' }, row.index + 1)
    },
    {
        id: 'employee',
        accessorFn: (row) => `${row.employee_name || 'Customer Relation Officer'} ${row.employee_eid || ''}`,
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Account Manager',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        sortingFn: (rowA, rowB) => {
            const nameA = rowA.original.employee_name || 'Customer Relation Officer'
            const nameB = rowB.original.employee_name || 'Customer Relation Officer'
            return nameA.localeCompare(nameB)
        },
        cell: ({ row }) => {
            const { employee_eid, employee_name, employee_photo } = row.original
            if (!employee_eid) return h('div', { class: 'text-gray-400 italic' }, 'Customer Relation Officer')

            return h(NuxtLink, {
                to: `/${employee_eid}/sales`,
                class: 'flex items-center gap-3 group'
            }, [
                h(UAvatar, { src: employee_photo || undefined, alt: employee_name || '', size: 'sm' }),
                h('div', { class: 'flex flex-col' }, [
                    h('span', { class: 'font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors' }, employee_name || 'Unknown'),
                    h('span', { class: 'text-xs text-gray-500' }, employee_eid || '')
                ])
            ])
        }
    },
    {
        accessorKey: 'customer_name',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Customer',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'font-medium' }, row.original.customer_name ?? '-'),
            h('a', {
                href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customer_id}&pid=profile`,
                target: '_blank',
                class: 'text-xs text-blue-500 hover:underline'
            }, row.original.customer_id)
        ])
    },
    {
        accessorKey: 'customer_service_account',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Service',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('a', {
                href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customer_service_id}/detail`,
                target: '_blank',
                class: 'font-medium text-blue-500 hover:underline'
            }, row.original.customer_service_account ?? '-'),
            h('span', { class: 'text-xs text-gray-400 truncate max-w-[200px]' }, row.original.service_name ?? '-')
        ])
    },
    {
        accessorKey: 'registration_date',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Reg Date',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('div', { class: 'text-xs' }, row.original.registration_date ? formatDate(row.original.registration_date) : '-')
    },
    {
        accessorKey: 'unregistration_date',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Unreg Date',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('div', { class: 'text-xs' }, row.original.unregistration_date ? formatDate(row.original.unregistration_date) : '-')
    },
    {
        accessorKey: 'period',
        header: 'Sub Period',
        cell: ({ row }) => h('div', { class: 'text-xs' }, row.original.period)
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Price',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'ml-auto'
            })
        },
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.price ?? 0))
    },
    {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ row }) => h('div', { class: 'text-xs italic text-gray-500 whitespace-normal min-w-[200px] max-w-[400px]', title: row.original.reason ?? '' }, row.original.reason ?? '-')
    },
    {
        accessorKey: 'is_approved',
        header: () => h('div', { class: 'flex items-center justify-center gap-1' }, [
            h('span', 'Approve'),
            h(UTooltip, {
                text: 'Approve to deduct commission',
                delayDuration: 0
            }, () => h(UIcon, {
                name: 'i-lucide-info',
                class: 'size-4 text-gray-400 cursor-help'
            }))
        ]),
        cell: ({ row }) => h('div', { class: 'flex justify-center' }, [
            h(USwitch, {
                modelValue: row.original.is_approved,
                'onUpdate:modelValue': async (val: boolean) => {
                    try {
                        const response = await summaryService.approveChurn(row.original.customer_service_id, { isApproved: val })
                        if (response && response.success) {
                            row.original.is_approved = val
                        }
                    } catch (error) {
                        toast.add({
                            title: 'Error',
                            description: 'Failed to update status',
                            color: 'error'
                        })
                    }
                }
            })
        ])
    }
]

const fetchSummary = async () => {
    setLoading(true)
    try {
        const response = await summaryService.churnSummary({ month: selectedMonth.value, year: year.value })
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
