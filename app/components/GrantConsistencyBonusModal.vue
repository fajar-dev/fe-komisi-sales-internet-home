<template>
    <UModal
        v-model:open="isOpen"
        :title="`Bonus Konsistensi — ${employeeName ?? ''}`"
        description="Bonus tetap Rp 1.000.000, ditambahkan langsung ke Total Komisi periode ini."
    >
        <template #body>
            <UForm :state="state" class="space-y-4">
                <UFormField label="Note" name="note" required description="Alasan pemberian bonus ini, wajib diisi untuk audit log.">
                    <UTextarea v-model="state.note" class="w-full" :rows="3" placeholder="Contoh: Konsisten capai target 3 bulan berturut-turut" />
                </UFormField>
            </UForm>
        </template>

        <template #footer="{ close }">
            <div class="flex justify-end gap-3 w-full">
                <UButton type="button" color="neutral" variant="ghost" :disabled="saving" @click="close">Cancel</UButton>
                <UButton type="button" color="primary" :loading="saving" @click="onSubmit">Grant Rp 1.000.000</UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { SummaryService } from '~/services/summary-service'

const props = defineProps<{
    employeeId: string | null
    employeeName: string | null
    existingNote: string | null
    month: number
    year: number
}>()

const isOpen = defineModel<boolean>('open', { default: false })
const emit = defineEmits(['success'])

const summaryService = new SummaryService()
const toast = useToast()
const saving = ref(false)

const state = reactive({ note: '' })

watch(
    () => [props.existingNote, isOpen.value] as const,
    ([note, open]) => {
        if (open) state.note = note ?? ''
    },
    { immediate: true }
)

async function onSubmit() {
    if (!props.employeeId) return
    if (!state.note.trim()) {
        toast.add({ title: 'Note is required', description: 'Explain why this bonus is being granted.', color: 'error' })
        return
    }

    saving.value = true
    try {
        const response = await summaryService.grantConsistencyBonus(
            props.employeeId,
            { month: props.month, year: props.year },
            { note: state.note.trim() }
        )
        if (response && response.success) {
            toast.add({ title: 'Granted', description: 'Bonus Konsistensi Rp 1.000.000 berhasil diberikan', color: 'success' })
            emit('success')
            isOpen.value = false
        }
    } catch (error) {
        console.error('Failed to grant consistency bonus:', error)
    } finally {
        saving.value = false
    }
}
</script>
