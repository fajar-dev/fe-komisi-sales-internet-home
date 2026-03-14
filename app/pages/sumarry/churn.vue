<template>
    <div class="space-y-4">
        <ClientOnly>
            <Teleport to="#toolbar-left">
                <h1 class="text-lg font-bold">Churn Summary</h1>
            </Teleport>
            <Teleport to="#toolbar-right">
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
        </ClientOnly>

        <UContainer>
            <HeroBackground />
            <div class="py-8">
                <!-- Churn content will go here -->
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import HeroBackground from '@/components/HeroBackground.vue'

definePageMeta({
  headerProps: {
    toolbar: true
  }
})
</script>