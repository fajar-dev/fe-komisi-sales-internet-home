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
                                Invoice Summary
                            </h3>
                                <p class="text-xs text-gray-500">{{ selectedMonthLabel }} {{ year }}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <UInput v-model="globalFilter" icon="i-heroicons-magnifying-glass" placeholder="Search invoices..." />
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
        <ReferralEditModal
            v-model:open="isReferralModalOpen"
            :ai="selectedInvoiceAi"
            :referral-fee="selectedInvoiceFee"
            :referral-type="selectedInvoiceType"
            @success="fetchSummary"
        />
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent, ref, onMounted, watch, computed, nextTick, useTemplateRef } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { CommissionService } from '~/services/commission-service'
import { AdditionalService } from '~/services/additional-service'
import type { InvoiceSummaryItem } from '~/types/summary'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  headerProps: {
    toolbar: true
  }
})

const UAvatar = resolveComponent('UAvatar')
const NuxtLink = resolveComponent('NuxtLink')
const UButton = resolveComponent('UButton')
const USwitch = resolveComponent('USwitch')
const UIcon = resolveComponent('UIcon')
const UTooltip = resolveComponent('UTooltip')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { setLoading } = useLoading()
const toast = useToast()
const commissionService = new CommissionService()
const additionalService = new AdditionalService()

const isReferralModalOpen = ref(false)
const selectedInvoiceAi = ref<number | null>(null)
const selectedInvoiceFee = ref(0)
const selectedInvoiceType = ref<string | null>(null)

const openReferralModal = (row: any) => {
    selectedInvoiceAi.value = row.ai
    selectedInvoiceFee.value = Number(row.referralFee)
    selectedInvoiceType.value = row.referralType
    isReferralModalOpen.value = true
}

const getRowItems = (row: any) => [
    [
        {
            label: 'Edit Referral',
            icon: 'i-heroicons-pencil-square-20-solid',
            onSelect: () => openReferralModal(row.original)
        }
    ]
]

const table = useTemplateRef('table')
const summaryData = ref<InvoiceSummaryItem[]>([])
const year = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const yearItems = ref<number[]>([])
const isMounted = ref(false)

const pagination = ref({
  pageIndex: 0,
  pageSize: 100
})
const sorting = ref([{ id: 'no', desc: false }])
const globalFilter = ref('')

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
    const num = Number(value)
    if (isNaN(num)) return value
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num)
}

const formatDate = (date: string | null) => {
    if (!date) return '-'
    try {
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date(date))
    } catch (e) {
        return date
    }
}

const columns: TableColumn<InvoiceSummaryItem>[] = [
    {
        id: 'no',
        header: '#',
        cell: ({ row }) => h('div', { class: 'text-center text-xs' }, row.index + 1)
    },
    {
        accessorKey: 'ai',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'AI Invoice',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('div', { class: 'text-center' }, row.original.ai)
    },
    {
        id: 'sales',
        accessorFn: (row) => {
            const name = row.sales?.name || 'Customer Relation Officer'
            const employeeId = row.sales?.employeeId || ''
            return `${name} ${employeeId}`
        },
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
            const nameA = rowA.original.sales?.name || 'Customer Relation Officer'
            const nameB = rowB.original.sales?.name || 'Customer Relation Officer'
            return nameA.localeCompare(nameB)
        },
        cell: ({ row }) => {
            const sales = row.original.sales
            if (!sales || !sales.employeeId) return h('div', { class: 'text-gray-400 italic' }, 'Customer Relation Officer')
            
            return h(NuxtLink, { 
                to: `/${sales.employeeId}/sales`,
                class: 'flex items-center gap-3 group' 
            }, [
                h(UAvatar, { src: sales.photoProfile || undefined, alt: sales.name || '', size: 'sm' }),
                h('div', { class: 'flex flex-col' }, [
                    h('span', { class: 'font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors' }, sales.name || 'Unknown'),
                    h('span', { class: 'text-xs text-gray-500' }, sales.employeeId || '')
                ])
            ])
        }
    },
    {
        accessorKey: 'customerName',
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
            h('span', { class: 'font-medium' }, row.original.customerName),
            h('a', { 
                href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customerId}&pid=profile`,
                target: '_blank',
                class: 'text-xs text-blue-500 hover:underline'
            }, row.original.customerId)
        ])
    },
    {
        accessorKey: 'customerServiceAccount',
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
                href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customerServiceId}/detail`,
                target: '_blank',
                class: 'font-medium text-blue-500 hover:underline'
            }, row.original.customerServiceAccount),
            h('span', { class: 'text-xs text-gray-400 whitespace-nowrap' }, row.original.serviceName)
        ])
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Type',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('span', { class: 'text-sm font-semibold' }, row.original.type)
    },
    {
        accessorKey: 'category',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Category',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('span', { class: 'text-sm text-gray-500 uppercase' }, row.original.category)
    },
    {
        accessorKey: 'invoiceDate',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Invoice Date',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('div', { class: 'text-xs' }, formatDate(row.original.invoiceDate))
    },
    {
        accessorKey: 'invoiceDueDate',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Due Date',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('div', { class: 'text-xs' }, formatDate(row.original.invoiceDueDate))
    },
    {
        accessorKey: 'paidDate',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Paid Date',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
            })
        },
        cell: ({ row }) => h('div', { class: 'text-xs' }, formatDate(row.original.paidDate))
    },
    {
        accessorKey: 'dpp',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'DPP',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'ml-auto'
            })
        },
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.dpp))
    },
    {
        accessorKey: 'referralType',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Ref Type',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'ml-auto'
            })
        },
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, row.original.referralType ?? '-')
    },
    {
        accessorKey: 'referralFee',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Ref Fee',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'ml-auto'
            })
        },
        cell: ({ row }) => h('div', { class: 'text-right font-medium' }, formatCurrency(row.original.referralFee))
    },
    {
        accessorKey: 'lateMonth',
        header: ({ column }) => {
            const isSorted = column.getIsSorted()
            return h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label: 'Late',
                icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'mx-auto'
            })
        },
        cell: ({ row }) => h('div', { class: 'text-center' }, row.original.lateMonth)
    },
    {
        accessorKey: 'isApproved',
        header: () => h('div', { class: 'flex items-center justify-center gap-1' }, [
            h('span', 'Approve'),
            h(UTooltip, {
                text: 'Approve to pay late commission',
                delayDuration: 0
            }, () => h(UIcon, {
                name: 'i-lucide-info',
                class: 'size-4 text-gray-400 cursor-help'
            }))
        ]),
        cell: ({ row }) => {
            if (row.original.lateMonth <= 0) return null
            
            return h('div', { class: 'flex justify-center' }, [
                h(USwitch, {
                    modelValue: row.original.isApproved === 1,
                    'onUpdate:modelValue': async (val: boolean) => {
                        try {
                            const response = await commissionService.updateInvoiceStatus(row.original.ai, val)
                            if (response && response.success) {
                                row.original.isApproved = val ? 1 : 0
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
    },
    {
        id: 'actions',
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
        const response = await commissionService.invoiceSummary({
            month: selectedMonth.value,
            year: year.value,
            hide: false
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

watch([year, selectedMonth], () => {
    fetchSummary()
})
</script>