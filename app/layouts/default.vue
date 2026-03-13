<template>
    <div class="relative min-h-screen">
        <LoadingOverlay :is-loading="isLoading" />
        <AppHeader />

        <UMain>
        <slot />
        </UMain>

        <UFooter>
        <p class="text-sm text-muted text-center">
            PT. Media Antar Nusa • © {{ new Date().getFullYear() }}
        </p>
        </UFooter>
    </div>
</template>

<script setup lang="ts">
const { isLoading } = useLoading()
</script>
