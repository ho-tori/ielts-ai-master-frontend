<template>
  <BaseDialog 
    :model-value="modelValue"
    title="账户安全"
    confirm-text="保存"
    :confirm-disabled="!isFormValid"
    @update:model-value="$emit('update:modelValue', $event)"
    @confirm="handleSave"
  >
    <div class="space-y-4">
      <div>
        <BaseInput 
          v-model="formData.password" 
          type="password" 
          label="新密码"
          placeholder="请输入新密码"
          :minlength="6"
          required
        />
        <p v-if="errors.password" class="text-danger text-sm mt-1">{{ errors.password }}</p>
      </div>
      
      <div>
        <BaseInput 
          v-model="formData.confirmPassword" 
          type="password" 
          label="确认密码"
          placeholder="请再次输入新密码"
          :minlength="6"
          required
        />
        <p v-if="errors.confirmPassword" class="text-danger text-sm mt-1">{{ errors.confirmPassword }}</p>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { BaseDialog, BaseInput } from '@/components'
import type { AccountSecurityPayload } from '@/types/user'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: AccountSecurityPayload): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const formData = reactive({
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return formData.password.length >= 6 && formData.password === formData.confirmPassword
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.password = ''
    formData.confirmPassword = ''
    errors.password = ''
    errors.confirmPassword = ''
  }
})

function validate() {
  errors.password = formData.password.length < 6 ? '密码至少6位' : ''
  errors.confirmPassword = formData.password !== formData.confirmPassword ? '两次输入密码不一致' : ''
  return isFormValid.value && !errors.password && !errors.confirmPassword
}

function handleSave() {
  if (!validate()) return
  
  emit('save', {
    password: formData.password
  })
  emit('update:modelValue', false)
  
  formData.password = ''
  formData.confirmPassword = ''
  errors.password = ''
  errors.confirmPassword = ''
}
</script>

<style scoped>
</style>
