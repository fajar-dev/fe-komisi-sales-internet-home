<template>
    <UContainer>
        <HeroBackground />
        <CommissionHeader
            :employee="employee"
            v-model:year="year"
            :year-items="items"
            subtitle="Monthly sales commission heatmap 🔥"
        />

        <div class="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UPageCard class="lg:col-span-2 lg:row-span-4 h-full order-first flex flex-col" v-if="periodData"> 
                <template #default>
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400 pe-2">Period: </span>
                            
                            <span class="text-sm font-medium">
                                {{ df.format(parseDate(periodData.startPeriod).toDate(getLocalTimeZone())) }} - {{ df.format(parseDate(periodData.endPeriod).toDate(getLocalTimeZone())) }}
                            </span>
                        </div>
                        <div class="flex justify-between items-end mt-2">
                            <div>
                                <span class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                    {{ formatCurrency(Number(periodData.totalCommission)) }}
                                </span>
                                <p class="text-[10px] pt-4 text-gray-400 font-medium uppercase tracking-wider">Grand Total Commission</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 space-y-6">
                        
                        <!--New Sales Activity -->
                        <div>
                            <h4 class="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span class="w-1 h-4 bg-primary-500 rounded-full"></span>
                                New Service Activity
                            </h4>
                            <div class="grid grid-cols-3 gap-3">
                                <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
                                    <span class="text-[10px] text-gray-500 uppercase font-semibold mb-1">Home</span>
                                    <span class="text-xl font-bold text-gray-900 dark:text-white">{{ periodData.service.find(s => s.name === 'Home')?.detail.new.count ?? 0 }}</span>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
                                    <span class="text-[10px] text-gray-500 uppercase font-semibold mb-1">nusaSelecta</span>
                                    <span class="text-xl font-bold text-gray-900 dark:text-white">{{ periodData.service.find(s => s.name === 'NusaSelecta')?.detail.new.count ?? 0 }}</span>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
                                    <span class="text-[10px] text-gray-500 uppercase font-semibold mb-1">nusafiber</span>
                                    <span class="text-xl font-bold text-gray-900 dark:text-white">{{ periodData.service.find(s => s.name === 'Nusafiber')?.detail.new.count ?? 0 }}</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mt-3 text-sm px-1">
                                <span class="text-gray-500">Total New Service</span>
                                <span class="font-bold text-gray-900 dark:text-white bg-primary-50 dark:bg-primary-900/10 px-2 py-0.5 rounded text-primary-600 dark:text-primary-400">{{ periodData.detail.new.count }}</span>
                            </div>
                             <div class="flex justify-between items-center mt-1 text-sm px-1">
                                <span class="text-gray-500">Prorata</span>
                                <span class="font-bold text-gray-900 dark:text-white bg-warning-50 dark:bg-warning-900/10 px-2 py-0.5 rounded text-warning-600 dark:text-warning-400">{{ periodData.detail.prorate.count }}</span>
                            </div>
                             <div class="flex justify-between items-center mt-1 text-sm px-1">
                                <span class="text-gray-500">Recurring</span>
                                <span class="font-bold text-gray-900 dark:text-white bg-info-50 dark:bg-info-900/10 px-2 py-0.5 rounded text-info-600 dark:text-info-400">{{ periodData.detail.recurring.count }}</span>
                            </div>
                             <div class="flex justify-between items-center mt-1 text-sm px-1">
                                <span class="text-gray-500">Upgrade</span>
                                <span class="font-bold text-gray-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/10 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400">{{ periodData.detail.upgrade.count }}</span>
                            </div>
                             <div class="flex justify-between items-center mt-1 text-sm px-1">
                                <span class="text-gray-500">Alat</span>
                                <span class="font-bold text-gray-900 dark:text-white bg-pink-50 dark:bg-pink-900/10 px-2 py-0.5 rounded text-pink-600 dark:text-pink-400">{{ periodData.detail.alat.count }}</span>
                            </div>
                             <div class="flex justify-between items-center mt-1 text-sm px-1">
                                <span class="text-gray-500">Setup</span>
                                <span class="font-bold text-gray-900 dark:text-white bg-teal-50 dark:bg-teal-900/10 px-2 py-0.5 rounded text-teal-600 dark:text-teal-400">{{ periodData.detail.setup.count }}</span>
                            </div>
                        </div>

                        <!-- Section 2: Financial Breakdown (Masonry) -->
                        <div class="columns-1 md:columns-2 gap-8 border-t border-gray-100 dark:border-gray-800 pt-5 space-y-8">
                            <!-- Earnings -->
                            <div class="break-inside-avoid">
                                <h4 class="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                                    Commission
                                </h4>
                                <ul class="space-y-2.5">
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                                            <span class="text-gray-500 text-xs">New</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.new.commission)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-warning-500"></span>
                                            <span class="text-gray-500 text-xs">Prorate</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.prorate.commission)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-info-500"></span>
                                            <span class="text-gray-500 text-xs">Recurring</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.recurring.commission)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                            <span class="text-gray-500 text-xs">Upgrade</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.upgrade.commission)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                            <span class="text-gray-500 text-xs">Alat</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.alat.commission)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                                            <span class="text-gray-500 text-xs">Setup</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.setup.commission)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-black"></span>
                                            <span class="text-gray-500 text-xs">Bonus</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.bonus)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                        <span class="text-gray-900 dark:text-white font-bold text-xs">Total</span>
                                        <span class="font-bold text-xs">{{ formatCurrency(Number(periodData.totalCommission)) }}</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- MRC -->
                            <div class="break-inside-avoid">
                                <h4 class="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                                    MRC
                                </h4>
                                <ul class="space-y-2.5">
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="text-gray-500 text-xs">Home</span>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'Home')?.detail.new.mrc ?? 0)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="text-gray-500 text-xs">NusaSelecta</span>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'NusaSelecta')?.detail.new.mrc ?? 0)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="text-gray-500 text-xs">Nusafiber</span>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'Nusafiber')?.detail.new.mrc ?? 0)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                        <span class="text-gray-900 dark:text-white font-bold text-xs">Total</span>
                                        <span class="font-bold text-xs">{{ formatCurrency(Number(periodData.detail.new.mrc)) }}</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- DPP New -->
                            <div class="break-inside-avoid">
                                <h4 class="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                                    New Subscription
                                </h4>
                                <ul class="space-y-2.5">
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="text-gray-500 text-xs">Home</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'Home')?.detail.new.dpp ?? 0)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="text-gray-500 text-xs">NusaSelecta</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'NusaSelecta')?.detail.new.dpp ?? 0)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <div class="flex items-center gap-1.5">
                                            <span class="text-gray-500 text-xs">Nusafiber</span>
                                        </div>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'Nusafiber')?.detail.new.dpp ?? 0)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                        <span class="text-gray-900 dark:text-white font-bold text-xs">Total</span>
                                        <span class="font-bold text-xs">{{ formatCurrency(Number(periodData.detail.new.dpp)) }}</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- DPP Other -->
                            <div class="break-inside-avoid">
                                <h4 class="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                                    Other Subscription
                                </h4>
                                <ul class="space-y-2.5">
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="text-gray-500 text-xs">Prorate</span>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.prorate.dpp)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="text-gray-500 text-xs">Recurring</span>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.recurring.dpp)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="text-gray-500 text-xs">Upgrade</span>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.upgrade.dpp)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="text-gray-500 text-xs">Alat</span>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.alat.dpp)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm">
                                        <span class="text-gray-500 text-xs">Setup</span>
                                        <span class="font-medium text-xs">{{ formatCurrency(Number(periodData.detail.setup.dpp)) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center text-sm pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                        <span class="text-gray-900 dark:text-white font-bold text-xs">Total</span>
                                        <span class="font-bold text-xs">{{ formatCurrency(Number(periodData.detail.prorate.dpp) + Number(periodData.detail.recurring.dpp) + Number(periodData.detail.upgrade.dpp) + Number(periodData.detail.alat.dpp) + Number(periodData.detail.setup.dpp)) }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Achievement Section -->
                        <div v-if="periodData.achievement" class="w-full pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 w-full shadow-sm">
                                <div class="flex flex-col gap-3">
                                    <div class="flex justify-between items-center w-full">
                                        <span class="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
                                            <UIcon name="i-heroicons-trophy" class="w-4 h-4 text-yellow-500" />
                                            Month Achievement
                                        </span>
                                        <span 
                                            :class="['text-xs font-bold uppercase', getAchievementColor(periodData.achievement.status)]"
                                        >
                                            {{ periodData.achievement.status }}
                                        </span>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 py-3">
                                        <div class="flex flex-col text-center">
                                            <span class="text-[10px] text-gray-500 uppercase font-semibold">Type</span>
                                            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.achievement.type }}</span>
                                        </div>
                                        <div class="flex flex-col text-center border-l border-gray-200 dark:border-gray-700">
                                            <span class="text-[10px] text-gray-500 uppercase font-semibold">Activity</span>
                                            <span class="text-sm font-bold text-gray-900 dark:text-white">{{ periodData.achievement.activity }}</span>
                                        </div>
                                    </div>

                                    <p class="text-sm text-center text-gray-600 dark:text-gray-300 italic leading-relaxed w-full font-medium border-t border-gray-200 dark:border-gray-700 pt-3">
                                        "{{ periodData.achievement.motivation }}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UPageCard>

            <!-- Month Cards -->
            <UPageCard
                v-for="card in monthcard"
                :key="card.mounth"
            >
                <template #title>
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ card.mounth }}</span>
                        <span class="text-lg font-bold text-gray-900 dark:text-white">{{ card.total }}</span>
                        <small class="text-xs text-gray-500 dark:text-gray-400">{{ card.startPeriod }} - {{ card.endPeriod }}</small>
                    </div>
                </template>
                
                <template #default>
                    <div class="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">Activity</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ card.count }}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">Bonus</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ card.bonus }}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">Total Commission</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ card.commission }}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">Total Subscription</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ card.dpp }}</span>
                        </div>
                            <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">Total MRC</span>
                            <span class="font-medium text-gray-900 dark:text-white">
                                {{ card.mrc }}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">Achievement</span>
                            <span :class="getAchievementColor(card.status)">
                                {{ card.status }}</span>
                        </div>
                    </div>
                </template>
            </UPageCard>
        </div>

        <div class="py-2">
            <div class="grid grid-cols-12 gap-4">
                <UCard class="col-span-12 md:col-span-4">
                    <template #header>
                    <h2>Total Commission</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Total Yearly Commission
                    </p>
                    </template>
                    <DonutChart
                        :data="totalCommissionDonutData"
                        :height="280"
                        :categories="totalCommissionDonutChart"
                        :radius="80"
                        :pad-angle="0.1"
                        :arc-width="20"
                        :value-formatter="donutValueFormatter"
                    >
                        <div class="text-center">
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                Total
                            </div>
                            <div class="text-2xl font-bold text-gray-900 dark:text-white">
                                {{ formatCurrency(totalCommissionDonutData.reduce((a, b) => a + b, 0)) }}
                            </div>
                        </div>
                    </DonutChart>
                </UCard>

                <!-- 8 kolom -->
                <UCard class="col-span-12 md:col-span-8">
                    <template #header>
                    <div class="lg:flex items-center justify-between">
                        <div>
                        <h2>Monthly Commission</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Total monthly commission
                        </p>
                        </div>
                        <div>
                        <h1 class="font-bold text-2xl">
                            Total:
                            {{
                            new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(totalCommissionData.reduce((total, item) => total + item.total, 0))
                            }}
                        </h1>
                        </div>
                    </div>
                    </template>

                    <LineChart
                    :data="totalCommissionData"
                    :height="280"
                    y-label="Total Commission"
                    :x-num-ticks="4"
                    :y-num-ticks="4"
                    :categories="totalCommissionChart"
                    :x-formatter="xFormatterTotalCommission"
                    :y-formatter="yFormatterCommission"
                    :y-grid-line="true"
                    :curve-type="CurveType.MonotoneX"
                    :legend-position="LegendPosition.TopRight"
                    :hide-legend="false"
                    />
                </UCard>
            </div>
        </div>



        <div class="py-2">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <div>
                            <h2>Invoice</h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Customer Invoice period: <span class="font-medium text-gray-900 dark:text-white" v-if="responseData.startPeriod && responseData.endPeriod"> {{ df.format(parseDate(responseData.startPeriod).toDate(getLocalTimeZone())) }} - {{ df.format(parseDate(responseData.endPeriod).toDate(getLocalTimeZone())) }}</span>
                            </p>
                        </div>
                        <div>
                            <USelectMenu v-model="selectedMonth" value-key="id" :items="monthSelect" class="w-48" />
                        </div>
                    </div>
                </template>
                
                <UTabs :items="tabItems" class="w-full">
                    <template #content="{ item }">
                        <UTable 
                            sticky 
                            :data="getTabData(item.key)" 
                            :columns="getColumns(item.key)" 
                            class="flex-1 max-h-[800px] [&_tr:has(.commission-zero)]:bg-yellow-50 dark:[&_tr:has(.commission-zero)]:bg-yellow-950/20 [&_tr:has(.row-deleted)]:bg-red-50 dark:[&_tr:has(.row-deleted)]:bg-red-950/20" 
                        />
                        <div class="p-4 border-t border-gray-200 dark:border-gray-800" v-if="getZeroCommissionCount(item.key) > 0">
                            <p class="text-sm text-yellow-500 font-medium">
                                {{ getZeroCommissionCount(item.key) }} invoice doesn't have commission
                            </p>
                        </div>
                    </template>
                </UTabs>
            </UCard>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { CommissionService } from '~/services/commission-service'
import { EmployeeService } from '~/services/employee-service'
import { InvoiceService } from '~/services/invoice-service'
import type { Employee } from '~/types/employee'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import { h, resolveComponent } from 'vue'
import type { SelectMenuItem, TableColumn } from '@nuxt/ui'
import { AdditionalService } from '~/services/additional-service'
import type { InvoiceSalesData, CommissionDetailItem, CommissionPeriodData } from '~/types/sales'

const df = new DateFormatter('en-US', {
    dateStyle: 'medium'
})

const monthSelect = ref<SelectMenuItem[]>([
    {
        label: 'January',
        id: 1
    },
    {
        label: 'February',
        id: 2
    },
    {
        label: 'March',
        id: 3
    },
    {
        label: 'April',
        id: 4
    },
    {
        label: 'May',
        id: 5
    },
    {
        label: 'June',
        id: 6
    },
    {
        label: 'July',
        id: 7
    },
    {
        label: 'August',
        id: 8
    },
    {
        label: 'September',
        id: 9
    },
    {
        label: 'October',
        id: 10
    },
    {
        label: 'November',
        id: 11
    },
    {
        label: 'December',
        id: 12
    }
])
const value = ref('todo')


const selectedMonth = ref(new Date().getMonth() + 1)
const UBadge = resolveComponent('UBadge')

const route = useRoute()
const responseData = ref<any>({
    startPeriod: '',
    endPeriod: '',
    count: 0,
    commission: '0',
    dpp: '0',
    mrc: '0',
    new: { data: [] },
    upgrade: { data: [] },
    prorate: { data: [] },
    recurring: { data: [] },
    alat: { data: [] },
    setup: { data: [] }
})

const tabItems = computed(() => [
    { label: `New (${responseData.value.new?.data?.length || 0})`, key: 'new'},
    { label: `Recurring (${responseData.value.recurring?.data?.length || 0})`, key: 'recurring'},
    { label: `Prorate (${responseData.value.prorate?.data?.length || 0})`, key: 'prorate'},
    { label: `Upgrade (${responseData.value.upgrade?.data?.length || 0})`, key: 'upgrade'},
    { label: `Alat (${responseData.value.alat?.data?.length || 0})`, key: 'alat'},
    { label: `Setup (${responseData.value.setup?.data?.length || 0})`, key: 'setup'}
])

const getTabData = (key: string) => {
    return responseData.value[key]?.data || []
}

const getZeroCommissionCount = (key: string) => {
    const data = getTabData(key)
    return data.filter((item: InvoiceSalesData) => Number(item.salesCommission) === 0).length
}

const getColumns = (key: string): TableColumn<InvoiceSalesData>[] => {
    const cols: TableColumn<InvoiceSalesData>[] = [
        {
            accessorKey: 'paidDate',
            header: 'Paid Date',
            cell: ({ row }) => {
            return new Date(row.getValue('paidDate')).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
            }
        },
        {
            id: 'label',
            header: 'Label',
            cell: ({ row }) => {            
                if (row.original.type === 'new') {
                    return h(UBadge, { label: 'New', color: 'success', variant: 'subtle' })
                }
                if (row.original.type === 'prorate') {
                    return h(UBadge, { label: 'Prorate', color: 'warning', variant: 'subtle' })
                }
                if (row.original.type === 'recurring') {
                    return h(UBadge, { label: 'Recurring', color: 'info', variant: 'subtle' })
                }
                if (row.original.category === 'alat') {
                    return h(UBadge, { label: 'Alat', color: 'primary', variant: 'solid' })
                }
                if (row.original.category === 'setup') {
                    return h(UBadge, { label: 'Setup', color: 'neutral', variant: 'solid' })
                }
            }
        },
        {
            header: 'Service',
            cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('a', { 
                    href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customerServiceId}/detail`,
                    target: '_blank',
                    class: ['text-blue-500 hover:underline font-semibold', row.original.isDeleted ? 'row-deleted' : '']
                }, row.original.customerServiceAccount),
                h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.serviceName)
            ])
            }
        },
        {
            header: 'Customer',
            cell: ({ row }) => {
            return h('div', { class: 'flex flex-col' }, [
                h('a', { 
                    href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customerId}&pid=profile`,
                    target: '_blank',
                    class: ['text-blue-500 hover:underline font-semibold', row.original.isDeleted ? 'row-deleted' : '']
                }, row.original.customerId),
                h('span', { class: 'text-sm whitespace-normal break-words' }, row.original.customerName)
            ])
            }
        },
        {
            accessorKey: 'dpp',
            header: 'DPP',
            meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
            },
            cell: ({ row }) => {
            const amount = Number.parseFloat(row.getValue('dpp'))
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(amount)
            },
            footer: () => {
                return h('div', { class: 'text-right font-bold' }, new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(Number(responseData.value[key]?.dpp ?? 0)))
            }
        },
        {
            header: 'Month Period',
            meta: {
                class: {
                    th: 'text-right',
                    td: 'text-right font-medium'
                }
            },
            cell: ({ row }) => {
            return row.original.month
            }
        },
        {
            header: 'Commission',
            meta: {
            class: {
                th: 'text-right',
                td: 'text-right font-medium'
            }
            },
            cell: ({ row }) => {
            const isZero = Number(row.original.salesCommission) === 0
            return h('div', { class: ['flex flex-col', isZero ? 'commission-zero' : ''] }, [
                h('span', { class: 'text-sm text-highlighted' }, Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.salesCommissionPercentage) + '%'),
                h('span', { class: 'text-sm' }, new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(row.original.salesCommission))
            ])
            },
            footer: () => {
                return h('div', { class: 'text-right font-bold' }, new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(Number(responseData.value[key]?.commission ?? 0)))
            }
        }
    ]
    return cols
}

const employee = ref<Employee>()  

// Year Select
const items = ref([2026, 2027, 2028, 2029, 2030])
const year = ref(new Date().getFullYear())



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

// Helper function untuk format currency
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
    }).format(value)
}

// Total Commission Donut Chart Data
const totalCommissionDonutData = ref<number[]>([])
const donutLabels = ref<{ name: string; color: string }[]>([])
const totalCommissionDonutChart = computed<Record<string, BulletLegendItemInterface>>(() => 
    Object.fromEntries(donutLabels.value.map(i => [i.name, { name: i.name, color: i.color }]))
)

const donutValueFormatter = (value: number): string => {
    return formatCurrency(value)
}

// Total Commission Chart (Line Chart)
const totalCommissionData = ref<{
    date: string;
    total: number;
    new: number;
    recurring: number;
    prorate: number;
    upgrade: number;
    alat: number;
    setup: number;
    bonus: number;
}[]>([])

const totalCommissionChart: Record<string, BulletLegendItemInterface> = {
    new: { name: 'New', color: '#3b82f6' },
    recurring: { name: 'Recurring', color: '#f97316' },
    prorate: { name: 'Prorate', color: '#8b5cf6' },
    upgrade: { name: 'Upgrade', color: '#6366f1' },
    alat: { name: 'Alat', color: '#ec4899' },
    setup: { name: 'Setup', color: '#14b8a6' },
}

const xFormatterTotalCommission = (tick: number, _i?: number, _ticks?: number[]): string => {
    return String(totalCommissionData.value[tick]?.date ?? '')
}

const yFormatterCommission = (value: number): string => {
    return formatCurrency(value)
}

// Month Card
const defaultDetailItem: CommissionDetailItem = { count: 0, commission: '0', mrc: '0', dpp: '0' }
const monthcard = ref<{ mounth: string; total: string; commission: string; bonus: string; count: number; dpp: string; mrc: string; startPeriod: string; endPeriod: string; status: string; detail: { new: CommissionDetailItem; recurring: CommissionDetailItem; prorate: CommissionDetailItem; upgrade: CommissionDetailItem; alat: CommissionDetailItem; setup: CommissionDetailItem; } }[]>([])
const periodData = ref<CommissionPeriodData | null>(null)

const fetchSalesData = async () => {
    const commissionService = new CommissionService()
    const response = await commissionService.salesCommission(route.params.id as string, { year: year.value })
    const data = response.data
    
    // Donut Chart Data - By Category
    const donutItems = [
        { label: 'New', value: Number(data.detail.new?.commission ?? 0), color: '#3b82f6' },
        { label: 'Recurring', value: Number(data.detail.recurring?.commission ?? 0), color: '#f97316' },
        { label: 'Prorate', value: Number(data.detail.prorate?.commission ?? 0), color: '#8b5cf6' },
        { label: 'Upgrade', value: Number(data.detail.upgrade?.commission ?? 0), color: '#6366f1' },
        { label: 'Alat', value: Number(data.detail.alat?.commission ?? 0), color: '#ec4899' },
        { label: 'Setup', value: Number(data.detail.setup?.commission ?? 0), color: '#14b8a6' }
    ]

    totalCommissionDonutData.value = donutItems.map(item => item.value)
    donutLabels.value = donutItems.map(item => ({ name: item.label, color: item.color }))
    
    // Month Card
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    monthcard.value = months.map((m, index) => {
        const mData = data.monthly[m]
        
        const detail = mData?.detail ? {
                new: { 
                    ...mData.detail.new, 
                    dpp: formatCurrency(Number(mData.detail.new?.dpp ?? 0)), 
                    mrc: formatCurrency(Number(mData.detail.new?.mrc ?? 0)) 
                },
                recurring: { 
                    ...mData.detail.recurring, 
                    dpp: formatCurrency(Number(mData.detail.recurring?.dpp ?? 0)), 
                    mrc: formatCurrency(Number(mData.detail.recurring?.mrc ?? 0)) 
                },
                prorate: { 
                    ...mData.detail.prorate, 
                    dpp: formatCurrency(Number(mData.detail.prorate?.dpp ?? 0)), 
                    mrc: formatCurrency(Number(mData.detail.prorate?.mrc ?? 0)) 
                },
                upgrade: { 
                    ...mData.detail.upgrade, 
                    dpp: formatCurrency(Number(mData.detail.upgrade?.dpp ?? 0)), 
                    mrc: formatCurrency(Number(mData.detail.upgrade?.mrc ?? 0)) 
                },
                alat: { 
                    ...mData.detail.alat, 
                    dpp: formatCurrency(Number(mData.detail.alat?.dpp ?? 0)), 
                    mrc: formatCurrency(Number(mData.detail.alat?.mrc ?? 0)) 
                },
                setup: { 
                    ...mData.detail.setup, 
                    dpp: formatCurrency(Number(mData.detail.setup?.dpp ?? 0)), 
                    mrc: formatCurrency(Number(mData.detail.setup?.mrc ?? 0)) 
                }
        } : { 
            new: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) }, 
            recurring: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) }, 
            prorate: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) },
            upgrade: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) },
            alat: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) },
            setup: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) }
        }

        let startPeriod = '-'
        let endPeriod = '-'

        if (mData?.startPeriod) {
            const [y, month, d] = mData.startPeriod.split('-').map(Number)
            if (y !== undefined && month !== undefined && d !== undefined) {
                startPeriod = df.format(new Date(y, month - 1, d))
            }
        }

        if (mData?.endPeriod) {
            const [y, month, d] = mData.endPeriod.split('-').map(Number)
            if (y !== undefined && month !== undefined && d !== undefined) {
                endPeriod = df.format(new Date(y, month - 1, d))
            }
        }

        return {
            mounth: m,
            total: formatCurrency(Number(mData?.totalCommission ?? 0)),
            commission: formatCurrency(Number(mData?.commission ?? 0)),
            bonus: formatCurrency(Number(mData?.bonus ?? 0)),
            count: mData?.achievement?.activity ?? 0,
            dpp: formatCurrency(Number(mData?.dpp ?? 0)),
            mrc: formatCurrency(Number(mData?.mrc ?? 0)),
            startPeriod: startPeriod,
            endPeriod: endPeriod,
            status: mData?.achievement?.status ?? '-',
            detail: detail
        }
    })
    
    // Total Commission Trend
    totalCommissionData.value = months.map(m => {
        const mData = data.monthly[m]
        return {
            date: m.substring(0, 3),
            total: Number(mData?.totalCommission ?? 0),
            new: Number(mData?.detail?.new?.commission ?? 0),
            recurring: Number(mData?.detail?.recurring?.commission ?? 0),
            prorate: Number(mData?.detail?.prorate?.commission ?? 0),
            upgrade: Number(mData?.detail?.upgrade?.commission ?? 0),
            alat: Number(mData?.detail?.alat?.commission ?? 0),
            setup: Number(mData?.detail?.setup?.commission ?? 0),
            bonus: Number(mData?.bonus ?? 0)
        }
    })
}

const initData = async () => {
    const additionalService = new AdditionalService()
    const currentPeriod = await additionalService.getCurrentPeriod()
    
    // Instantiate services
    const commissionService = new CommissionService()
    const employeeService = new EmployeeService()

    const employeeData = await employeeService.getEmployee(route.params.id as string)
    employee.value = employeeData.data

    if (currentPeriod?.start && currentPeriod?.end) {
        if (currentPeriod.month && currentPeriod.year) {
                selectedMonth.value = currentPeriod.month
                year.value = currentPeriod.year
        } else {
                const [endYear, endMonth, endDay] = currentPeriod.end.split('-').map(Number)
                selectedMonth.value = endMonth ?? (new Date().getMonth() + 1)
                year.value = endYear ?? new Date().getFullYear()
        }

        const periodResponse = await commissionService.salesCommissionPeriod(route.params.id as string, {
            month: currentPeriod.month,
            year: currentPeriod.year
        })
        periodData.value = periodResponse.data
    }
    
    await fetchSalesData()
}

const fetchInvoiceData = async () => {
    const invoiceService = new InvoiceService()
    const response = await invoiceService.getInvoiceSales(route.params.id as string, {
        month: selectedMonth.value,
        year: year.value
    })
    responseData.value = response.data
}

watch(year, () => {
    fetchSalesData()
    fetchInvoiceData()
})

watch(selectedMonth, () => {
    fetchInvoiceData()
})

initData()
fetchInvoiceData()
</script>