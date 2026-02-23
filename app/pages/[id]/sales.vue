<template>
    <UContainer>
        <HeroBackground />
        <CommissionHeader
            :employee="employee"
            v-model:year="year"
            :year-items="items"
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
                                    {{ df.format(parseDate(periodData.startPeriod).toDate(getLocalTimeZone())) }} - 
                                    {{ df.format(parseDate(periodData.endPeriod).toDate(getLocalTimeZone())) }}
                                </span>
                            </div>
                        </div>
                        <div class="text-left md:text-right flex flex-col w-full md:w-auto">
                            <div>
                                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 md:mb-2 text-left md:text-right">
                                    Grand Total Commission
                                </p>
                                <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500 dark:text-primary-400">
                                    {{ formatCurrency(Number(periodData.totalCommission)) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 md:mt-6 space-y-6 md:space-y-8">
                        <!-- Top Grid: Service Activity & Achievement -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                            <!-- Col 1: Service Breakdown -->
                            <div class="space-y-3 md:space-y-4">
                                <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                                    New Service Activity
                                </h4>
                                <div class="grid grid-cols-1 gap-2 md:gap-3">
                                    <div v-for="(svc, index) in ['Home', 'NusaSelecta', 'Nusafiber']" :key="svc" 
                                        :class="[
                                            'p-3 md:p-4 rounded-lg md:rounded-xl border flex justify-between items-center transition-all',
                                            svc === 'Home' ? 'bg-sky-50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-800' : 
                                            svc === 'NusaSelecta' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800' : 
                                            'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800'
                                        ]">
                                        <div class="flex items-center gap-2 md:gap-3">
                                            <span :class="[
                                                'text-sm font-semibold',
                                                svc === 'Home' ? 'text-sky-700 dark:text-sky-300' : 
                                                svc === 'NusaSelecta' ? 'text-orange-700 dark:text-orange-300' : 
                                                'text-purple-700 dark:text-purple-300'
                                            ]">{{ svc }}</span>
                                        </div>
                                        <span :class="[
                                            'text-lg sm:text-xl font-bold',
                                            svc === 'Home' ? 'text-sky-900 dark:text-sky-100' : 
                                            svc === 'NusaSelecta' ? 'text-orange-900 dark:text-orange-100' : 
                                            'text-purple-900 dark:text-purple-100'
                                        ]">
                                            {{ periodData.service.find(s => s.name === svc)?.detail.new.count ?? 0 }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Col 2: Categories Counts -->
                            <div class="space-y-3 md:space-y-4">
                                <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <UIcon name="i-heroicons-rectangle-stack" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                                    Category Summary
                                </h4>
                                <div class="grid grid-cols-2 gap-2 md:gap-3 h-full content-start">
                                    <div v-for="cat in [
                                        { label: 'New', count: periodData.detail.new.count, color: 'primary' },
                                        { label: 'Recurring', count: periodData.detail.recurring.count, color: 'orange' },
                                        { label: 'Prorate', count: periodData.detail.prorate.count, color: 'purple' },
                                        { label: 'Upgrade', count: periodData.detail.upgrade.count, color: 'indigo' },
                                        { label: 'Alat', count: periodData.detail.alat.count, color: 'pink' },
                                        { label: 'Setup', count: periodData.detail.setup.count, color: 'teal' }
                                    ]" :key="cat.label" 
                                    :class="[
                                        'flex justify-between items-center p-2 md:p-3 rounded-lg md:rounded-xl border transition-colors',
                                        cat.color === 'primary' ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-800' :
                                        cat.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800' :
                                        cat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800' :
                                        cat.color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800' :
                                        cat.color === 'pink' ? 'bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-800' :
                                        'bg-teal-50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-800'
                                    ]">
                                        <span :class="[
                                            'text-xs font-medium uppercase',
                                            cat.color === 'primary' ? 'text-primary-600 dark:text-primary-400' :
                                            cat.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                                            cat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                            cat.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                                            cat.color === 'pink' ? 'text-pink-600 dark:text-pink-400' :
                                            'text-teal-600 dark:text-teal-400'
                                        ]">{{ cat.label }}</span>
                                        <span :class="[
                                            'text-sm font-bold px-2 py-0.5 rounded bg-white/50 dark:bg-black/20',
                                            cat.color === 'primary' ? 'text-primary-700 dark:text-primary-300' :
                                            cat.color === 'orange' ? 'text-orange-700 dark:text-orange-300' :
                                            cat.color === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                                            cat.color === 'indigo' ? 'text-indigo-700 dark:text-indigo-300' :
                                            cat.color === 'pink' ? 'text-pink-700 dark:text-pink-300' :
                                            'text-teal-700 dark:text-teal-300'
                                        ]">{{ cat.count }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Col 3: Achievement -->
                            <div class="space-y-3 md:space-y-4 flex flex-col" v-if="periodData.achievement">
                                <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <UIcon name="i-heroicons-trophy" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                                    Achievement
                                </h4>
                                <div class="p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800"
                                    :class="getAchievementColor(periodData.achievement.status).replace('text-', 'border-').replace('dark:text-', 'dark:border-').replace('500', '200').replace('400', '800')">
                                    <div class="flex justify-between items-start mb-4 md:mb-6">
                                        <div class="flex flex-col gap-2 md:gap-3">
                                            <div>
                                                <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 md:mb-1.5 tracking-wide">Status</p>
                                                <span :class="['text-xs sm:text-sm font-bold uppercase px-2 md:px-2.5 py-0.5 md:py-1 rounded-md border bg-gray-50 dark:bg-gray-800', getAchievementColor(periodData.achievement.status).replace('text-', 'border-').replace('dark:text-', 'dark:border-') + ' ' + getAchievementColor(periodData.achievement.status)]">
                                                    {{ periodData.achievement.status }}
                                                </span>
                                            </div>
                                            <div>
                                                <p class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 tracking-wide">Type</p>
                                                <span class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                                    {{ periodData.achievement.type ?? '-' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="pt-3 md:pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic font-medium leading-relaxed">
                                            "{{ periodData.achievement.motivation }}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: Financial Breakdown (Grid) -->
                        <div>
                            <h4 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3 md:mb-4">
                                <UIcon name="i-heroicons-banknotes" class="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                                Financial Breakdown
                            </h4>
                            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-800">
                                <!-- Earnings -->
                                <div>
                                    <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Commission</h5>
                                    <ul class="space-y-2 md:space-y-3">
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">New</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.new.commission)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Prorate</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.prorate.commission)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Recurring</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.recurring.commission)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Upgrade</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.upgrade.commission)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Alat</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.alat.commission)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Setup</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.setup.commission)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Bonus</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.bonus)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                                            <span class="font-bold text-gray-900 dark:text-white">Total</span>
                                            <span class="font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(Number(periodData.totalCommission)) }}</span>
                                        </li>
                                    </ul>
                                </div>

                                <!-- MRC -->
                                <div>
                                    <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">MRC (New)</h5>
                                    <ul class="space-y-2 md:space-y-3">
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Home</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'Home')?.detail.new.mrc ?? 0)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">NusaSelecta</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'NusaSelecta')?.detail.new.mrc ?? 0)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Nusafiber</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'Nusafiber')?.detail.new.mrc ?? 0)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                                            <span class="font-bold text-gray-900 dark:text-white">Total</span>
                                            <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.new.mrc)) }}</span>
                                        </li>
                                    </ul>
                                </div>

                                <!-- DPP New -->
                                <div>
                                    <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Subscription (New)</h5>
                                    <ul class="space-y-2 md:space-y-3">
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Home</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'Home')?.detail.new.dpp ?? 0)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">NusaSelecta</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'NusaSelecta')?.detail.new.dpp ?? 0)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Nusafiber</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.service.find(s => s.name === 'Nusafiber')?.detail.new.dpp ?? 0)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                                            <span class="font-bold text-gray-900 dark:text-white">Total</span>
                                            <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.new.dpp)) }}</span>
                                        </li>
                                    </ul>
                                </div>

                                <!-- DPP Other -->
                                <div>
                                    <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Subscription (Other)</h5>
                                    <ul class="space-y-2 md:space-y-3">
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Prorate</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.prorate.dpp)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Recurring</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.recurring.dpp)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Upgrade</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.upgrade.dpp)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Alat</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.alat.dpp)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm">
                                            <span class="text-gray-600 dark:text-gray-400">Setup</span>
                                            <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.setup.dpp)) }}</span>
                                        </li>
                                        <li class="flex justify-between items-center text-xs sm:text-sm pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                                            <span class="font-bold text-gray-900 dark:text-white">Total</span>
                                            <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(Number(periodData.detail.prorate.dpp) + Number(periodData.detail.recurring.dpp) + Number(periodData.detail.upgrade.dpp) + Number(periodData.detail.alat.dpp) + Number(periodData.detail.setup.dpp)) }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
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
                            class="flex-1 max-h-[800px] [&_tr:has(.commission-zero)]:bg-yellow-50 dark:[&_tr:has(.commission-zero)]:bg-yellow-950/20 [&_tr:has(.row-deleted)]:bg-red-50 dark:[&_tr:has(.row-deleted)]:bg-red-950/20" 
                        />
                    </template>
                </UTabs>
            </UCard>
        </div>
        
        <div class="py-2">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <UCard class="lg:col-span-4">
                    <template #header>
                    <h2>Total Commission</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Total Yearly Commission by Type
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
                            <div class="text-xl font-bold text-gray-900 dark:text-white">
                                {{ formatCurrency(totalCommissionDonutData.reduce((a, b) => a + b, 0)) }}
                            </div>
                        </div>
                    </DonutChart>
                </UCard>

                <UCard class="lg:col-span-4">
                    <template #header>
                    <h2>Service Breakdown</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Commission by Service Product
                    </p>
                    </template>
                    <DonutChart
                        :data="serviceCommissionDonutData"
                        :height="280"
                        :categories="serviceCommissionDonutChart"
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
                                {{ formatCurrency(serviceCommissionDonutData.reduce((a, b) => a + b, 0)) }}
                            </div>
                        </div>
                    </DonutChart>
                </UCard>
                
                <UCard class="lg:col-span-4">
                     <template #header>
                        <h2>Commission vs Bonus</h2>
                         <p class="text-sm text-gray-500 dark:text-gray-400">Comparison of Base Commission vs Bonus</p>
                    </template>
                     <DonutChart
                        v-if="commissionVsBonusData.length > 0"
                        :data="commissionVsBonusData"
                        :height="280"
                        :categories="commissionVsBonusChart"
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
                                {{ formatCurrency(commissionVsBonusData.reduce((a, b) => a + b, 0)) }}
                            </div>
                        </div>
                     </DonutChart>
                </UCard>

                <UCard class="lg:col-span-8">
                    <template #header>
                    <div class="lg:flex items-center justify-between">
                        <div>
                        <h2>Monthly Commission Trend</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Stacked view of commission by type
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

                    <AreaChart
                    v-if="totalCommissionData.length > 0"
                    :data="totalCommissionData"
                    index="date"
                    :categories="totalCommissionChart"
                    y-label="Total Commission"
                    :x-num-ticks="4"
                    :y-num-ticks="4"
                    :y-formatter="yFormatterCommission"
                    :x-formatter="xFormatterTotalCommission "
                    :y-grid-line="true"
                    :curve-type="CurveType.MonotoneX"
                    :height="320"
                    :legend-position="LegendPosition.TopRight"
                    :stacked="true"
                    />
                </UCard>

                <UCard class="lg:col-span-4">
                     <template #header>
                        <h2>Commission Composition</h2>
                         <p class="text-sm text-gray-500 dark:text-gray-400">Monthly Comparison of DPP, MRC, and Commission</p>
                    </template>
                     <BarChart
                        v-if="commissionCompositionData.length > 0"
                        :data="commissionCompositionData"
                        :stacked="true"
                        :height="300"
                        :categories="commissionCompositionChart"
                        :y-axis="['dpp', 'mrc', 'commission']"
                        :group-padding="0"
                        :bar-padding="0.2"
                        :x-num-ticks="6"
                        :radius="4"
                        :orientation="Orientation.Horizontal"
                        :x-formatter="xFormatterComposition"
                        :y-formatter="yFormatterComposition"
                        :legend-position="LegendPosition.TopRight"
                        :hide-legend="false"
                        :x-grid-line="true"
                     />
                </UCard>

                <UCard class="lg:col-span-12">
                    <template #header>
                        <div class="lg:flex items-center justify-between">
                            <div>
                                <h2>Monthly Service Performance</h2>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Commission comparison by service product
                                </p>
                            </div>
                        </div>
                    </template>

                    <BarChart
                    v-if="monthlyServiceData.length > 0"
                    :data="monthlyServiceData"
                    index="date"
                    :categories="serviceChart"
                    :y-axis="serviceKeys"
                    y-label="Commission"
                    :x-num-ticks="4"
                    :y-num-ticks="4"
                    :y-formatter="yFormatterCommission"
                    :x-formatter="xFormatterTotalCommission"
                    :y-grid-line="true"
                    :height="320"
                    :legend-position="LegendPosition.TopRight"
                    :rounded-corners="4"
                    />
                </UCard>

                <UCard class="lg:col-span-6">
                     <template #header>
                        <h2>Monthly Sales Count</h2>
                         <p class="text-sm text-gray-500 dark:text-gray-400">Total number of sales per month</p>
                    </template>
                     <LineChart
                        v-if="monthlySalesCountData.length > 0"
                        :data="monthlySalesCountData"
                        index="date"
                        :categories="salesCountChart"
                        :y-axis="['total']"
                        y-label="Count"
                         :x-num-ticks="4"
                        :y-num-ticks="4"
                         :y-grid-line="true"
                         :x-formatter="xFormatterTotalCommission"
                         :curve-type="CurveType.MonotoneX"
                         :height="320"
                        :legend-position="LegendPosition.TopRight"
                     />
                </UCard>

                 <UCard class="lg:col-span-6">
                     <template #header>
                        <h2>Monthly Bonus</h2>
                         <p class="text-sm text-gray-500 dark:text-gray-400">Total bonus received per month</p>
                    </template>
                     <BarChart
                        v-if="monthlyBonusData.length > 0"
                        :data="monthlyBonusData"
                        index="date"
                        :categories="bonusChart"
                        :y-axis="['total']"
                        y-label="Bonus"
                         :x-num-ticks="4"
                        :y-num-ticks="4"
                         :y-formatter="yFormatterCommission"
                         :x-formatter="xFormatterTotalCommission"
                         :y-grid-line="true"
                         :height="320"
                        :legend-position="LegendPosition.TopRight"
                        :rounded-corners="4"
                     />
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
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import type { SelectMenuItem, TableColumn } from '@nuxt/ui'
import { AdditionalService } from '~/services/additional-service'
import type { InvoiceSalesData, CommissionDetailItem, CommissionPeriodData } from '~/types/sales'

const df = new DateFormatter('en-US', {
    dateStyle: 'medium'
})

const monthSelect = ref<SelectMenuItem[]>([
    { label: 'January', id: 1 },
    { label: 'February', id: 2 },
    { label: 'March', id: 3 },
    { label: 'April', id: 4 },
    { label: 'May', id: 5 },
    { label: 'June', id: 6 },
    { label: 'July', id: 7 },
    { label: 'August', id: 8 },
    { label: 'September', id: 9 },
    { label: 'October', id: 10 },
    { label: 'November', id: 11 },
    { label: 'December', id: 12 }
])

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
            return h('div', { class: 'flex flex-col min-w-[120px]' }, [
                h('a', { 
                    href: `https://isx.nusa.net.id/v2/customer/service/${row.original.customerServiceId}/detail`,
                    target: '_blank',
                    class: ['text-blue-500 hover:underline font-semibold text-sm break-all', row.original.isDeleted ? 'row-deleted' : '']
                }, row.original.customerServiceAccount),
                h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words line-clamp-2' }, row.original.serviceName)
            ])
            }
        },
        {
            header: 'Customer',
            cell: ({ row }) => {
            return h('div', { class: 'flex flex-col min-w-[120px]' }, [
                h('a', { 
                    href: `https://isx.nusa.net.id/customer.php?custId=${row.original.customerId}&pid=profile`,
                    target: '_blank',
                    class: ['text-blue-500 hover:underline font-semibold text-sm', row.original.isDeleted ? 'row-deleted' : '']
                }, row.original.customerId),
                h('span', { class: 'text-xs text-gray-500 dark:text-gray-400 whitespace-normal break-words line-clamp-2' }, row.original.customerName)
            ])
            }
        },
        {
            accessorKey: 'dpp',
            header: 'DPP',
            cell: ({ row }) => {
                const amount = Number.parseFloat(row.getValue('dpp'))
                return h('span', { class: 'font-medium' }, new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(amount))
            },
            footer: () => {
                return h('div', { class: 'hidden lg:block text-right font-bold' }, new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(Number(responseData.value[key]?.dpp ?? 0)))
            }
        },
        {
            accessorKey: 'mrc',
            header: 'MRC',
            cell: ({ row }) => {
                const amount = Number.parseFloat(row.getValue('mrc'))
                return h('span', { class: 'font-medium' }, new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(amount))
            },
            footer: () => {
                return h('div', { class: 'hidden lg:block text-right font-bold' }, new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(Number(responseData.value[key]?.mrc ?? 0)))
            }
        },
        {
            header: 'Month Period',
            cell: ({ row }) => {
                return h('span', { class: 'font-medium' }, row.original.month)
            }
        },
        {
            header: 'Commission',
            cell: ({ row }) => {
            const isZero = Number(row.original.salesCommission) === 0
            return h('div', { class: ['flex flex-col items-end', isZero ? 'commission-zero' : ''] }, [
                h('span', { class: 'text-xs font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 mb-1' }, Intl.NumberFormat('id-ID', { style: 'decimal' }).format(row.original.salesCommissionPercentage) + '%'),
                h('span', { class: 'text-sm font-bold text-gray-900 dark:text-white' }, new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                }).format(row.original.salesCommission))
            ])
            },
            footer: () => {
                return h('div', { class: 'text-right font-bold text-gray-900 dark:text-white' }, new Intl.NumberFormat('id-ID', {
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

// Service Commission Donut Chart Data
const serviceCommissionDonutData = ref<number[]>([])
const serviceCommissionDonutLabels = ref<{ name: string; color: string }[]>([])
const serviceCommissionDonutChart = computed<Record<string, BulletLegendItemInterface>>(() => 
    Object.fromEntries(serviceCommissionDonutLabels.value.map(i => [i.name, { name: i.name, color: i.color }]))
)

const commissionVsBonusData = ref<number[]>([])
const commissionVsBonusLabels = ref<{ name: string; color: string }[]>([])
const commissionVsBonusChart = computed<Record<string, BulletLegendItemInterface>>(() => 
    Object.fromEntries(commissionVsBonusLabels.value.map(i => [i.name, { name: i.name, color: i.color }]))
)

const commissionCompositionData = ref<{ date: string; dpp: number; mrc: number; commission: number }[]>([])
const commissionCompositionChart = {
    dpp: { name: 'DPP (Revenue)', color: '#3b82f6' },
    mrc: { name: 'MRC', color: '#f97316' },
    commission: { name: 'Commission', color: '#10b981' }
}

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

const monthlyServiceData = ref<{
    date: string;
    Home: number;
    Nusafiber: number;
    NusaSelecta: number;
}[]>([])

const serviceChart: Record<string, BulletLegendItemInterface> = {
    Home: { name: 'Home', color: '#0ea5e9' },
    Nusafiber: { name: 'Nusafiber', color: '#a855f7' },
    NusaSelecta: { name: 'NusaSelecta', color: '#f97316' }
}

const serviceKeys = Object.keys(serviceChart) as any

const monthlySalesCountData = ref<{ date: string; total: number }[]>([])
const monthlyDppData = ref<{ date: string; total: number }[]>([])
const monthlyBonusData = ref<{ date: string; total: number }[]>([])

const salesCountChart: Record<string, BulletLegendItemInterface> = {
    total: { name: 'Total Sales', color: '#22c55e' }
}
const dppChart: Record<string, BulletLegendItemInterface> = {
    total: { name: 'Total Revenue (DPP)', color: '#eab308' }
}
const bonusChart: Record<string, BulletLegendItemInterface> = {
    total: { name: 'Total Bonus', color: '#ef4444' }
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
    
    // Donut Chart Data - By Service
    const serviceItems = data.service.map((s: any) => ({
        label: s.name,
        value: Number(s.commission ?? 0),
        color: s.name === 'Home' ? '#0ea5e9' : s.name === 'NusaSelecta' ? '#f97316' : '#a855f7'
    }))
    serviceCommissionDonutData.value = serviceItems.map((item: any) => item.value)
    serviceCommissionDonutLabels.value = serviceItems.map((item: any) => ({ name: item.label, color: item.color }))

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
        const detail = mData?.detail
        return {
            date: m.substring(0, 3),
            total: Number(mData?.totalCommission ?? 0),
            new: Number(detail?.new?.commission ?? 0),
            recurring: Number(detail?.recurring?.commission ?? 0),
            prorate: Number(detail?.prorate?.commission ?? 0),
            upgrade: Number(detail?.upgrade?.commission ?? 0),
            alat: Number(detail?.alat?.commission ?? 0),
            setup: Number(detail?.setup?.commission ?? 0),
            bonus: Number(mData?.bonus ?? 0)
        }
    })

    // Monthly Service Performance
    monthlyServiceData.value = months.map(m => {
        const mData = data.monthly[m]
        const services = mData?.service || []
        const home = services.find((s: any) => s.name === 'Home')?.commission || 0
        const nusafiber = services.find((s: any) => s.name === 'Nusafiber')?.commission || 0
        const nusaselecta = services.find((s: any) => s.name === 'NusaSelecta')?.commission || 0
        
        return {
            date: m.substring(0, 3),
            Home: Number(home),
            Nusafiber: Number(nusafiber),
            NusaSelecta: Number(nusaselecta)
        }
    })

    // Monthly Sales Count Trend
    monthlySalesCountData.value = months.map(m => {
        return {
            date: m.substring(0, 3),
            total: Number(data.monthly[m]?.count ?? 0)
        }
    })

    // Monthly DPP (Revenue) Data
    monthlyDppData.value = months.map(m => {
        return {
            date: m.substring(0, 3),
            total: Number(data.monthly[m]?.dpp ?? 0)
        }
    })

    // Monthly Bonus Data
    monthlyBonusData.value = months.map(m => {
        return {
            date: m.substring(0, 3),
            total: Number(data.monthly[m]?.bonus ?? 0)
        }
    })

    // Commission vs Bonus Data
    // Commission vs Bonus Data
    const totalCommission = totalCommissionData.value.reduce((total, item) => total + item.total, 0)
    const totalBonus = monthlyBonusData.value.reduce((total, item) => total + item.total, 0)
    
    const vsItems = [
        { label: 'Commission', value: totalCommission, color: '#10b981' },
        { label: 'Bonus', value: totalBonus, color: '#f59e0b' }
    ]
    commissionVsBonusData.value = vsItems.map(i => i.value)
    commissionVsBonusLabels.value = vsItems.map(i => ({ name: i.label, color: i.color }))

    // Commission Composition Data (Monthly: DPP, MRC, Commission)
    commissionCompositionData.value = months.map(m => {
        const mData = data.monthly[m]
        return {
            date: m.substring(0, 3),
            dpp: Number(mData?.dpp ?? 0),
            mrc: Number(mData?.mrc ?? 0),
            commission: Number(mData?.commission ?? 0)
        }
    })
}

const yFormatterComposition = (i: number): string => {
    return commissionCompositionData.value[i]?.date ?? ''
}

const xFormatterComposition = (tick: number | number, _i?: number, _ticks?: number[]): string => {
    return formatCurrency(Number(tick))
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

const fetchPeriodData = async () => {
    const commissionService = new CommissionService()
    const response = await commissionService.salesCommissionPeriod(route.params.id as string, {
        month: selectedMonth.value,
        year: year.value
    })
    periodData.value = response.data
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
    fetchPeriodData()
})

watch(selectedMonth, () => {
    fetchInvoiceData()
    fetchPeriodData()
})

initData()
fetchInvoiceData()
</script>