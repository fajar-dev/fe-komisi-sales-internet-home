<template>
  <UModal
    v-model:open="isOpen"
    :title="`Edit Referral Invoice #${ai}`"
    description="Modify the referral fee and type for this invoice."
  >
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Referral Type" name="referralType">
          <USelect
            v-model="state.referralType"
            :items="['OTC', 'Cashback', 'Monthly']"
            placeholder="Select Type"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Referral Fee" name="referralFee">
          <UInput
            v-model="state.referralFee"
            type="number"
            icon="i-heroicons-banknotes"
            placeholder="0"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4">
          <UButton color="neutral" variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="loading">Save Changes</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { CommissionService } from '~/services/commission-service'
import { z } from 'zod'

const props = defineProps<{
    ai: number | null
    referralFee: number
    referralType: string | null
}>()

const isOpen = defineModel<boolean>('open', { default: false })
const emit = defineEmits(['success'])

const commissionService = new CommissionService()
const toast = useToast()
const loading = ref(false)

const state = reactive({
  referralFee: props.referralFee,
  referralType: props.referralType || ''
})

watch(() => props.ai, () => {
  state.referralFee = props.referralFee
  state.referralType = props.referralType || ''
})

const schema = z.object({
  referralFee: z.number().min(0, 'Referral fee must be positive'),
  referralType: z.string().min(1, 'Referral type is required')
})

async function onSubmit() {
  if (!props.ai) return
  
  loading.value = true
  try {
    const response = await commissionService.updateReferralInvoice(props.ai, {
      referralFee: Number(state.referralFee),
      referralType: state.referralType
    })
    
    if (response && response.success) {
      toast.add({
        title: 'Success',
        description: 'Referral updated successfully',
        color: 'success'
      })
      emit('success')
      isOpen.value = false
    }
  } catch (error) {
    console.error('Failed to update referral:', error)
  } finally {
    loading.value = false
  }
}
</script>
