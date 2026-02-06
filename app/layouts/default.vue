<template>
    <div>
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
