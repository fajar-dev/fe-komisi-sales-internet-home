<template>
    <UContainer>
        <AdjustmentModal
          :ai="invoiceAi"
          v-model:open="isAdjustmentModalOpen"
          @updated="fetchInvoiceData()"
        />
        <HeroBackground />
        <CommissionHeader
            :employee="employee"
            v-model:year="year"
            :year-items="items"
            subtitle="Monthly sales commission heatmap 🔥"
        />

        <div class="py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Special Card (Left, Spanning 2 Rows & 2 Cols) -->
            <UPageCard class="lg:col-span-2 lg:row-span-4 h-full order-first flex flex-col" v-if="periodData"> 
                <template #title>
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400 pe-2">Period: </span>
                            <span class="text-sm font-medium">
                                {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} - {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
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
                </template>
                
                <template #default>
                    <div class="mt-4 space-y-6">
                        
                        <!-- Section 1: New Sales Activity -->
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
                        </div>

                        <!-- Section 2: Financial Breakdown (Grid) -->
                        <div class="grid grid-cols-2 gap-8 border-t border-gray-100 dark:border-gray-800 pt-5">
                            <!-- Earnings -->
                            <div>
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
                            <div>
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
                        </div>

                         <!-- Section 3: DPP Breakdown (Grid) -->
                        <div class="grid grid-cols-2 gap-8 border-t border-gray-100 dark:border-gray-800 pt-5">
                            <!-- DPP New -->
                            <div>
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
                            <div>
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
                                    <li class="flex justify-between items-center text-sm pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                        <span class="text-gray-900 dark:text-white font-bold text-xs">Total</span>
                                        <span class="font-bold text-xs">{{ formatCurrency(Number(periodData.detail.prorate.dpp) + Number(periodData.detail.recurring.dpp)) }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Achievement Section -->
                        <div v-if="periodData.achievement" class="w-full pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                             <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 w-full shadow-sm">
                                <div class="flex justify-between items-center mb-3 w-full">
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
                                <p class="text-sm text-center text-gray-600 dark:text-gray-300 italic leading-relaxed w-full font-medium">
                                    "{{ periodData.achievement.motivation }}"
                                </p>
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
                    </div>
                </template>
                
                <template #default>
                    <div class="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">Commission</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ card.commission }}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">Bonus</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ card.bonus }}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">New Customer</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ card.detail.new.count }}</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">New Subscription</span>
                            <span class="font-medium text-gray-900 dark:text-white">{{ card.detail.new.dpp }}</span>
                        </div>
                            <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500">New MRC</span>
                            <span class="font-medium text-gray-900 dark:text-white">
                                {{ card.detail.new.mrc }}</span>
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

        <!-- Service Charts -->
        <div class="py-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard>
            <template #header>
                <h2>Commission by Service</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                Breakdown of commission by service type
                </p>
            </template>
                <AreaChart
                    :key="colorMode.value + '-service-commission'"
                    :data="commissionByServiceData"
                    :height="280"
                    :categories="commissionByServiceChart"
                    :stacked="true"
                    :x-formatter="xFormatterCommissionService"
                    :y-formatter="yFormatterCommission"
                    :curve-type="CurveType.MonotoneX"
                    :legend-position="LegendPosition.TopRight"
                    :hide-legend="false"
                    :y-grid-line="true"
                    :x-grid-line="false"
                />
            </UCard>
            <UCard>
            <template #header>
                <h2>Customer by Service</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                Number of customers by service
                </p>
            </template>
                <BarChart
                    :data="customerByServiceData"
                    :height="300"
                    :categories="customerByServiceChart"
                    :y-axis="customerServiceKeys"
                    :group-padding="0"
                    :bar-padding="0.2"
                    :x-num-ticks="6"
                    :radius="4"
                    :x-formatter="xFormatterCustomerService"
                    :y-formatter="yFormatter"
                    :legend-position="LegendPosition.TopRight"
                    :hide-legend="false"
                    :y-grid-line="true"
                />
            </UCard>
        </div>
        </div>

        <!-- Additional Business Insights -->
        <div class="py-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard>
                    <template #header>
                        <h2>Commission Distribution</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                             Yearly Commission Split
                        </p>
                    </template>
                    <DonutChart
                        :data="commissionDistributionData"
                        :height="280"
                        :categories="commissionDistributionChart"
                        :radius="80"
                        :pad-angle="0.1"
                        :arc-width="20"
                        :value-formatter="donutValueFormatter"
                    >
                        <div class="text-center">
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                Total
                            </div>
                            <div class="text-xl font-bold text-gray-900 dark:text-white">
                                {{ formatCurrency(commissionDistributionData.reduce((a, b) => a + b, 0)) }}
                            </div>
                        </div>
                    </DonutChart>
                </UCard>
                <UCard>
                    <template #header>
                        <h2>Subscription Trend</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                             DPP vs MRC Performance
                        </p>
                    </template>
                    <LineChart
                        :data="revenueTrendData"
                        :height="280"
                        y-label="Amount"
                        :x-num-ticks="6"
                        :y-num-ticks="4"
                        :categories="revenueTrendChart"
                        :x-formatter="xFormatterRevenue"
                        :y-formatter="yFormatterCommission"
                        :y-grid-line="true"
                        :curve-type="CurveType.MonotoneX"
                        :legend-position="LegendPosition.TopRight"
                        :hide-legend="false"
                    />
                </UCard>
            </div>
        </div>

        <!-- Volume & Share Insights -->
        <div class="py-2">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <UCard class="col-span-12 md:col-span-8">
                    <template #header>
                        <h2>Sales Volume</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                             Count by Client Type
                        </p>
                    </template>
                    <BarChart
                        :data="salesVolumeData"
                        :height="300"
                        :categories="salesVolumeChart"
                        :y-axis="['new', 'recurring', 'prorate']"
                        :group-padding="0"
                        :bar-padding="0.2"
                        :x-num-ticks="6"
                        :radius="4"
                        :x-formatter="xFormatterSalesVolume"
                        :y-formatter="yFormatter"
                        :legend-position="LegendPosition.TopRight"
                        :hide-legend="false"
                        :y-grid-line="true"
                    />
                </UCard>
                <UCard class="col-span-12 md:col-span-4">
                    <template #header>
                        <h2>Subscription Share</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                             DPP Contribution by Service
                        </p>
                    </template>
                    <DonutChart
                        :data="revenueShareDonutData"
                        :height="280"
                        :categories="revenueShareDonutChart"
                        :radius="80"
                        :pad-angle="0.1"
                        :arc-width="20"
                        :value-formatter="donutValueFormatter"
                    >
                        <div class="text-center">
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                Total DPP
                            </div>
                            <div class="text-xl font-bold text-gray-900 dark:text-white">
                                {{ formatCurrency(revenueShareDonutData.reduce((a, b) => a + b, 0)) }}
                            </div>
                        </div>
                    </DonutChart>
                </UCard>
            </div>
        </div>

        <!-- Efficiency & Growth -->
        <div class="py-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard>
                    <template #header>
                        <h2>Efficiency Metrics</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                                Commission Rate vs Average Subscription
                        </p>
                    </template>
                    <LineChart
                        :data="efficiencyData"
                        :height="280"
                        y-label="Value"
                        :x-num-ticks="6"
                        :y-num-ticks="4"
                        :categories="efficiencyChart"
                        :x-formatter="xFormatterEfficiency"
                        :y-grid-line="true"
                        :curve-type="CurveType.MonotoneX"
                        :legend-position="LegendPosition.TopRight"
                        :hide-legend="false"
                    />
                </UCard>
                <UCard>
                    <template #header>
                        <h2>MRR Growth</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                             Monthly Recurring Revenue Composition
                        </p>
                    </template>
                    <AreaChart
                        :key="colorMode.value + '-mrc'"
                        :data="mrcCompositionData"
                        :height="280"
                        :categories="mrcCompositionChart"
                        :stacked="true"
                        :x-formatter="xFormatterMrc"
                        :y-formatter="yFormatterCommission"
                        :curve-type="CurveType.MonotoneX"
                        :legend-position="LegendPosition.TopRight"
                        :hide-legend="false"
                        :y-grid-line="true"
                        :x-grid-line="false"
                    />
                </UCard>
            </div>
        </div>

        <!-- Financial Performance & Growth -->
        <div class="py-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard>
                    <template #header>
                        <h2>ARPU Trend by Service</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                             Average Subscription Per Unit (User)
                        </p>
                    </template>
                    <LineChart
                        :data="arpuByServiceData"
                        :height="280"
                        y-label="ARPU (IDR)"
                        :x-num-ticks="6"
                        :y-num-ticks="4"
                        :categories="arpuByServiceChart"
                        :x-formatter="xFormatterArpu"
                        :y-formatter="yFormatterCommission"
                        :y-grid-line="true"
                        :curve-type="CurveType.MonotoneX"
                        :legend-position="LegendPosition.TopRight"
                        :hide-legend="false"
                    />
                </UCard>
                <UCard>
                    <template #header>
                        <h2>Cumulative Commission</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                             Total Accumulated Commission YTD
                        </p>
                    </template>
                    <AreaChart
                        :key="colorMode.value + '-cumulative'"
                        :data="cumulativeCommissionData"
                        :height="280"
                        :categories="cumulativeCommissionChart"
                        :stacked="false"
                        :x-formatter="xFormatterCumulative"
                        :y-formatter="yFormatterCommission"
                        :curve-type="CurveType.MonotoneX"
                        :legend-position="LegendPosition.TopRight"
                        :hide-legend="false"
                        :y-grid-line="true"
                        :x-grid-line="false"
                    />
                </UCard>
            </div>
        </div>

        <div class="py-2">
            <div class="grid grid-cols-1">
                <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <div>
                            <h2>Invoice</h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                            Customer Invoice
                            </p>
                        </div>
                        <UPopover>
                            <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
                            <template v-if="modelValue.start">
                                <template v-if="modelValue.end">
                                {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} - {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
                                </template>

                                <template v-else>
                                {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}
                                </template>
                            </template>
                            <template v-else>
                                Pick a date
                            </template>
                            </UButton>

                            <template #content>
                            <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
                            </template>
                        </UPopover>
                    </div>
                </template>
                    <UTable sticky :data="data" :columns="columns" class="flex-1 max-h-[800px] [&_tr:has(.commission-zero)]:bg-yellow-50 dark:[&_tr:has(.commission-zero)]:bg-yellow-950/20 [&_tr:has(.row-deleted)]:bg-red-50 dark:[&_tr:has(.row-deleted)]:bg-red-950/20" />
                    <div class="p-4 border-t border-gray-200 dark:border-gray-800" v-if="zeroCommissionCount > 0">
                        <p class="text-sm text-yellow-500 font-medium">
                            {{ zeroCommissionCount }} invoice doesn't have commission
                        </p>
                    </div>
                </UCard>
            </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { CommissionService } from '~/services/commission-service'
import { EmployeeService } from '~/services/employee-service'
import { InvoiceService } from '~/services/invoice-service'
import type { Employee } from '~/types/employee'

import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { type Row } from '@tanstack/table-core'

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
})

const modelValue = shallowRef({
    start: new CalendarDate(2026, 1, 1),
    end: new CalendarDate(2026, 1, 31)
})

const isAdjustmentModalOpen = ref(false)
const invoiceAi = ref<number>(0)

import { h, resolveComponent } from 'vue'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import { AdditionalService } from '~/services/additional-service'
import type { InvoiceSalesData, InvoiceSalesResponseData, CommissionDetailItem, CommissionPeriodData } from '~/types/sales'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

import { authService } from '~/services/auth-service'

const route = useRoute()
const data = ref<InvoiceSalesData[]>([])
const responseData = ref<InvoiceSalesResponseData['data']>({ data: [], totalCommission: 0, totalDpp: 0 })

    const zeroCommissionCount = computed(() => {
        return data.value.filter(item => Number(item.salesCommission) === 0).length
    })

    const getRowItems = (row: Row<InvoiceSalesData>) => {
        const items: DropdownMenuItem[] = [
            {
                label: 'Adjust Commission',
                icon: 'i-lucide-edit',
                size: 'xs',
                onClick: () => {
                     invoiceAi.value = row.original.ai
                    isAdjustmentModalOpen.value = true
                }
            }
        ]
        return items
    }

    const columns = computed<TableColumn<InvoiceSalesData>[]>(() => {
        const cols: TableColumn<InvoiceSalesData>[] = [
    {
        accessorKey: 'invoiceNumber',
        header: 'Invoice Number',
        meta: {
        class: {
            td: 'font-bold'
        }
        },
        cell: ({ row }) => {
            const invoiceNum = row.original.invoiceNumber
            return h('a', { 
                href: `https://isx.nusa.net.id/customer.php?module=customer&pid=printNewCustomerInvoice&invoiceNum=${invoiceNum}&urut=${row.original.invoiceOrder}&new=1&proforma=0&signature=0`,
                target: '_blank',
                class: ['text-blue-500 hover:underline', row.original.isDeleted ? 'row-deleted' : '']
            }, `#${invoiceNum}`)
        }
    },
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
            h('span', { class: 'text-sm' }, row.original.serviceName)
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
            h('span', { class: 'text-sm' }, row.original.customerName)
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
            }).format(responseData.value.totalDpp ?? 0))
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
            }).format(responseData.value.totalCommission ?? 0))
        }
    }
]

    if (authService.user.value?.employee_id === route.params.id) {
        cols.push({
            id: 'actions',
            cell: ({ row }) => {
                return h(
                    'div',
                    { class: 'text-right' },
                    h(
                    UDropdownMenu,
                    { content: { align: 'end' }, items: getRowItems(row) },
                    () =>
                        h(UButton, {
                        icon: 'i-lucide-ellipsis-vertical',
                        color: 'neutral',
                        variant: 'ghost',
                        class: 'ml-auto'
                        })
                    )
                )
            }
        })
    }

    return cols
})


const employee = ref<Employee>()  

// Year Select
const items = ref([2026, 2027, 2028, 2029, 2030])
const year = ref(new Date().getFullYear())

const colorMode = useColorMode()

const getAchievementColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('tidak capai') || s.includes('sp1')) return 'text-red-500 dark:text-red-400'
    if (s.includes('average')) return 'text-orange-500 dark:text-orange-400'
    if (s.includes('bonus')) return 'text-violet-500 dark:text-violet-400'
    if (s.includes('excelent') || s.includes('excellent')) return 'text-emerald-500 dark:text-emerald-400'
    if (s.includes('very good')) return 'text-teal-500 dark:text-teal-400'
    if (s.includes('capai target')) return 'text-green-500 dark:text-green-400'
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

// Commission By Service (Area Chart)
const commissionByServiceData = ref<any[]>([])
const commissionByServiceChart = computed<Record<string, BulletLegendItemInterface>>(() => {
    return {
        Home: { name: 'Home', color: '#3b82f6' },
        Nusafiber: { name: 'Nusafiber', color: '#22c55e' },
        NusaSelecta: { name: 'NusaSelecta', color: '#f97316' },
    }
})
const xFormatterCommissionService = (tick: number, _i?: number, _ticks?: number[]): string => {
    return String(commissionByServiceData.value[tick]?.date ?? '')
}

const yFormatterCommission = (value: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

// Total Commission Chart (Line Chart)
const totalCommissionData = ref<{
    date: string;
    total: number;
    new: number;
    recurring: number;
    prorate: number;
    bonus: number;
}[]>([])

const totalCommissionChart: Record<string, BulletLegendItemInterface> = {
    total: { name: 'Total', color: '#10b981' },
    new: { name: 'New', color: '#3b82f6' },
    recurring: { name: 'Recurring', color: '#f97316' },
    prorate: { name: 'Prorate', color: '#8b5cf6' },
    bonus: { name: 'Bonus', color: '#ec4899' },
}

const xFormatterTotalCommission = (tick: number, _i?: number, _ticks?: number[]): string => {
    return String(totalCommissionData.value[tick]?.date ?? '')
}

// Customer Count By Service (Bar Chart)
const customerByServiceData = ref<any[]>([])
const customerByServiceChart = computed(() => commissionByServiceChart.value)
const customerServiceKeys = computed(() => Object.keys(customerByServiceChart.value))

const xFormatterCustomerService = (i: number): string => `${customerByServiceData.value[i]?.date}`
const yFormatter = (tick: number) => tick.toString()

// Month Card
const defaultDetailItem: CommissionDetailItem = { count: 0, commission: '0', mrc: '0', dpp: '0' }
const monthcard = ref<{ mounth: string; total: string; commission: string; bonus: string; count: number; dpp: string; mrc: string; detail: { new: CommissionDetailItem; recurring: CommissionDetailItem; prorate: CommissionDetailItem } }[]>([])
const periodData = ref<CommissionPeriodData | null>(null)

const fetchData = async () => {
    const additionalService = new AdditionalService()
    const currentPeriod = await additionalService.getCurrentPeriod()
    
    // Instantiate services
    const commissionService = new CommissionService()
    const employeeService = new EmployeeService()

    const employeeData = await employeeService.getEmployee(route.params.id as string)
    employee.value = employeeData.data

    if (currentPeriod?.start && currentPeriod?.end) {
        const [startYear, startMonth, startDay] = currentPeriod.start.split('-').map(Number) as [number, number, number]
        const [endYear, endMonth, endDay] = currentPeriod.end.split('-').map(Number) as [number, number, number]
        
        modelValue.value = {
            start: new CalendarDate(startYear, startMonth, startDay),
            end: new CalendarDate(endYear, endMonth, endDay)
        }

        const periodResponse = await commissionService.salesCommissionPeriod(route.params.id as string, {
            start: currentPeriod.start,
            end: currentPeriod.end,
            status: employee.value?.status ?? ''
        })
        periodData.value = periodResponse.data
    }
    
    const response = await commissionService.salesCommission(route.params.id as string, { year: year.value })
    const data = response.data
    
    // Donut Chart Data - By Service
    totalCommissionDonutData.value = data.service.map((s: any) => Number(s.commission))
    donutLabels.value = data.service.map((s: any, i: number) => ({ 
        name: s.name, 
        color: ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6'][i % 4] ?? '#3b82f6'
    }))
    
    // Month Card
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    monthcard.value = months.map(m => {
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
             }
        } : { 
            new: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) }, 
            recurring: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) }, 
            prorate: { ...defaultDetailItem, dpp: formatCurrency(0), mrc: formatCurrency(0) } 
        }

        return {
            mounth: m,
            total: formatCurrency(Number(mData?.totalCommission ?? 0)),
            commission: formatCurrency(Number(mData?.commission ?? 0)),
            bonus: formatCurrency(Number(mData?.bonus ?? 0)),
            count: mData?.count ?? 0,
            dpp: formatCurrency(Number(mData?.dpp ?? 0)),
            mrc: formatCurrency(Number(mData?.mrc ?? 0)),
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
            bonus: Number(mData?.bonus ?? 0)
        }
    })

    // Commission Internal (Service Breakdown)
    commissionByServiceData.value = months.map(m => {
        const mData = data.monthly[m]
        const obj: any = { date: m.substring(0, 3) }
        mData?.service?.forEach((s: any) => {
            obj[s.name] = Number(s.commission ?? 0)
        })
        return obj
    })

    // Customer Internal (Service Breakdown)
    customerByServiceData.value = months.map(m => {
        const mData = data.monthly[m]
        const obj: any = { date: m.substring(0, 3) }
        mData?.service.forEach((s: any) => {
            obj[s.name] = s.count
        })
        return obj
    })

    // Commission By Type (Bar Chart)
    commissionByTypeData.value = months.map(m => {
        const mData = data.monthly[m]
        return {
            date: m.substring(0, 3),
            new: Number(mData?.detail.new.commission ?? 0),
            recurring: Number(mData?.detail.recurring.commission ?? 0),
            prorate: Number(mData?.detail.prorate.commission ?? 0)
        }
    })

    // Revenue Trend (DPP vs MRC)
    revenueTrendData.value = months.map(m => {
        const mData = data.monthly[m]
        return {
            date: m.substring(0, 3),
            dpp: Number(mData?.dpp ?? 0),
            mrc: Number(mData?.mrc ?? 0)
        }
    })

    // Commission Distribution Data
    const totalNew = totalCommissionData.value.reduce((sum, item) => sum + item.new, 0)
    const totalRecurring = totalCommissionData.value.reduce((sum, item) => sum + item.recurring, 0)
    const totalProrate = totalCommissionData.value.reduce((sum, item) => sum + item.prorate, 0)
    commissionDistributionData.value = [totalNew, totalRecurring, totalProrate]

    // Sales Volume By Type (Bar Chart)
    salesVolumeData.value = months.map(m => {
        const mData = data.monthly[m]
        return {
            date: m.substring(0, 3),
            new: mData?.detail.new.count ?? 0,
            recurring: mData?.detail.recurring.count ?? 0,
            prorate: mData?.detail.prorate.count ?? 0
        }
    })

    // Revenue Share By Service (Donut Chart)
    revenueShareDonutData.value = data.service.map((s: any) => Number(s.dpp))

    // Efficiency Metrics (Rate & ARPU)
    efficiencyData.value = months.map(m => {
        const mData = data.monthly[m]
        const dpp = Number(mData?.dpp ?? 0)
        const comm = Number(mData?.commission ?? 0)
        const count = mData?.count ?? 0
        return {
            date: m.substring(0, 3),
            commissionRate: dpp > 0 ? (comm / dpp) * 100 : 0,
            arpu: count > 0 ? dpp / count : 0
        }
    })

    // MRC Composition (New vs Recurring Value)
    mrcCompositionData.value = months.map(m => {
        const mData = data.monthly[m]
        return {
            date: m.substring(0, 3),
            newMrc: Number(mData?.detail.new.mrc ?? 0),
            prorateMrc: Number(mData?.detail.prorate.mrc ?? 0)
        }
    })

    // ARPU by Service (Trend)
    arpuByServiceData.value = months.map(m => {
        const mData = data.monthly[m]
        const obj: any = { date: m.substring(0, 3) }
        mData?.service.forEach((s: any) => {
            const dpp = Number(s.dpp ?? 0)
            const count = s.count ?? 0
            obj[s.name] = count > 0 ? dpp / count : 0
        })
        return obj
    })

    // Cumulative Commission (Growth)
    let cum = 0;
    cumulativeCommissionData.value = months.map(m => {
        const mData = data.monthly[m]
        const comm = Number(mData?.commission ?? 0)
        cum += comm;
        return {
            date: m.substring(0, 3),
            cumulative: cum,
            monthly: comm
        }
    })
}

// ARPU by Service
const arpuByServiceData = ref<any[]>([])
const arpuByServiceChart = computed(() => commissionByServiceChart.value)
const xFormatterArpu = (tick: number) => String(arpuByServiceData.value[tick]?.date ?? '')

// Cumulative Commission
const cumulativeCommissionData = ref<any[]>([])
const cumulativeCommissionChart = {
    cumulative: { name: 'Cumulative Commission', color: '#8b5cf6' },
    // monthly: { name: 'Monthly Commission', color: '#cbd5e1' }
}
const xFormatterCumulative = (tick: number) => String(cumulativeCommissionData.value[tick]?.date ?? '')

// Efficiency Metrics
const efficiencyData = ref<any[]>([])
const efficiencyChart = {
    commissionRate: { name: 'Commission Rate (%)', color: '#f59e0b' },
    arpu: { name: 'Avg Subscription / Sale', color: '#8b5cf6' },
}
const xFormatterEfficiency = (tick: number) => String(efficiencyData.value[tick]?.date ?? '')

// MRC Composition
const mrcCompositionData = ref<any[]>([])
const mrcCompositionChart = {
    newMrc: { name: 'New MRR', color: '#3b82f6' },
    prorateMrc: { name: 'Prorate MRR', color: '#f97316' },
}
const xFormatterMrc = (tick: number) => String(mrcCompositionData.value[tick]?.date ?? '')

// Sales Volume By Type
const salesVolumeData = ref<any[]>([])
const salesVolumeChart = {
    new: { name: 'New Customer', color: '#3b82f6' },
    recurring: { name: 'Recurring Customer', color: '#22c55e' },
    prorate: { name: 'Prorate', color: '#f97316' },
}
const xFormatterSalesVolume = (i: number) => `${salesVolumeData.value[i]?.date}`

// Revenue Share Donut
const revenueShareDonutData = ref<number[]>([])
const revenueShareDonutChart = computed<Record<string, BulletLegendItemInterface>>(() => 
    Object.fromEntries(donutLabels.value.map(i => [i.name, { name: i.name, color: i.color }]))
)

// Commission By Type (Bar Chart)
const commissionByTypeData = ref<any[]>([])
const xFormatterCommissionType = (i: number) => `${commissionByTypeData.value[i]?.date}`

// Commission Distribution (Donut Chart)
const commissionDistributionData = ref<number[]>([])
const commissionDistributionChart = {
    new: { name: 'New', color: '#3b82f6' },
    recurring: { name: 'Recurring', color: '#22c55e' },
    prorate: { name: 'Prorate', color: '#f97316' },
}

// Revenue Trend (Line Chart)
const revenueTrendData = ref<any[]>([])
const revenueTrendChart = {
    dpp: { name: 'Total DPP (Subscription)', color: '#8b5cf6' },
    mrc: { name: 'Total MRC (Monthly)', color: '#06b6d4' },
}
const xFormatterRevenue = (tick: number) => String(revenueTrendData.value[tick]?.date ?? '')

const fetchInvoiceData = async () => {
    if (!modelValue.value.start || !modelValue.value.end) return

    const invoiceService = new InvoiceService()
    const response = await invoiceService.getInvoiceSales(route.params.id as string, {
        start: modelValue.value.start.toString(),
        end: modelValue.value.end.toString()
    })
    responseData.value = response.data
    data.value = response.data.data
}

watch(year, () => {
    fetchData()
})

watch(modelValue, () => {
    fetchInvoiceData()
})

fetchData()
fetchInvoiceData()

</script>