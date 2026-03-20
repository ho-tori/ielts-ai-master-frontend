<template>
  <BaseDialog 
    :model-value="modelValue"
    title="编辑资料"
    confirm-text="保存"
    :confirm-disabled="!isFormValid"
    @update:model-value="$emit('update:modelValue', $event)"
    @confirm="handleSave"
  >
    <div class="space-y-4">
      <div>
        <BaseInput 
          v-model="formData.nickname" 
          type="text" 
          label="昵称"
          placeholder="请输入昵称"
          required
        />
        <p v-if="errors.nickname" class="text-red-600 text-sm mt-1">{{ errors.nickname }}</p>
      </div>
      
      <div>
        <BaseInput 
          v-model="formData.email" 
          type="email" 
          label="邮箱"
          placeholder="请输入邮箱"
        />
        <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { BaseDialog, BaseInput } from '@/components'
import type { EditProfilePayload } from '@/types/user'

interface Props {
  modelValue: boolean
  initialNickname?: string
  initialEmail?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: EditProfilePayload): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  initialNickname: '',
  initialEmail: ''
})

const emit = defineEmits<Emits>()

const formData = reactive({
  nickname: props.initialNickname,
  email: props.initialEmail
})

const errors = reactive({
  nickname: '',
  email: ''
})

const isFormValid = computed(() => {
  return formData.nickname.trim() !== ''
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.nickname = props.initialNickname
    formData.email = props.initialEmail
    errors.nickname = ''
    errors.email = ''
  }
})

function validate() {
  errors.nickname = !formData.nickname.trim() ? '昵称不能为空' : ''
  return isFormValid.value
}

function handleSave() {
  if (!validate()) return
  
  emit('save', {
    nickname: formData.nickname.trim(),
    email: formData.email.trim()
  })
  emit('update:modelValue', false)
}
</script>

<style scoped>
</style>
