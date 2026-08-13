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
                <UFormField label="Berapa Service" name="serviceCount" required description="Jumlah service yang dicapai sales, diisi manual.">
                    <UInput v-model.number="state.serviceCount" type="number" min="0" class="w-full" placeholder="Contoh: 15" />
                </UFormField>
                <UFormField label="Bulan" name="months" description="Bulan-bulan pencapaian yang dijadikan catatan (opsional, tidak mempengaruhi periode bonus).">
                    <USelectMenu v-model="state.months" :items="monthOptions" value-key="id" multiple class="w-full" placeholder="Pilih bulan" />
                </UFormField>
                <UFormField label="Link Testimoni" name="testimonialLink" description="Opsional, link bukti testimoni pelanggan.">
                    <UInput v-model="state.testimonialLink" type="url" class="w-full" placeholder="https://..." />
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
    existingMonths: string | null
    existingServiceCount: number | null
    existingTestimonialLink: string | null
    month: number
    year: number
}>()

const isOpen = defineModel<boolean>('open', { default: false })
const emit = defineEmits(['success'])

const summaryService = new SummaryService()
const toast = useToast()
const saving = ref(false)

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthOptions = monthNames.map((label, i) => ({ id: i + 1, label }))

const state = reactive<{ note: string; serviceCount: number | undefined; months: number[]; testimonialLink: string }>({
    note: '',
    serviceCount: undefined,
    months: [],
    testimonialLink: ''
})

watch(
    () => [props.existingNote, props.existingMonths, props.existingServiceCount, props.existingTestimonialLink, isOpen.value] as const,
    ([note, months, serviceCount, testimonialLink, open]) => {
        if (open) {
            state.note = note ?? ''
            state.months = months ? months.split(',').map(Number) : []
            state.serviceCount = serviceCount ?? undefined
            state.testimonialLink = testimonialLink ?? ''
        }
    },
    { immediate: true }
)

async function onSubmit() {
    if (!props.employeeId) return
    if (!state.note.trim()) {
        toast.add({ title: 'Note is required', description: 'Explain why this bonus is being granted.', color: 'error' })
        return
    }
    if (state.serviceCount === undefined || state.serviceCount === null || state.serviceCount < 0) {
        toast.add({ title: 'Berapa Service is required', description: 'Isi jumlah service yang dicapai.', color: 'error' })
        return
    }

    saving.value = true
    try {
        const response = await summaryService.grantConsistencyBonus(
            props.employeeId,
            { month: props.month, year: props.year },
            {
                note: state.note.trim(),
                serviceCount: state.serviceCount,
                months: state.months.length > 0 ? state.months : undefined,
                testimonialLink: state.testimonialLink.trim() || undefined
            }
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
