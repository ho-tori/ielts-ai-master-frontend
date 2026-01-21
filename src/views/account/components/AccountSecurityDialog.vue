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
          v-model="formData.phone" 
          type="tel" 
          label="绑定手机"
          placeholder="请输入手机号"
          required
        />
        <p v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</p>
      </div>

      <div>
        <BaseInput 
          v-model="formData.password" 
          type="password" 
          label="修改密码"
          placeholder="请输入新密码"
          :minlength="6"
          :show-toggle="true"
          :is-password-visible="showPassword"
          required
          @toggle-password="showPassword = !showPassword"
        />
        <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <div>
        <BaseInput 
          v-model="formData.confirmPassword" 
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          :minlength="6"
          :show-toggle="true"
          :is-password-visible="showConfirmPassword"
          required
          @toggle-password="showConfirmPassword = !showConfirmPassword"
        />
        <p v-if="errors.confirmPassword" class="text-red-600 text-sm mt-1">{{ errors.confirmPassword }}</p>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { BaseDialog, BaseInput } from '@/components'
import type { AccountSecurityPayload } from '@/types/user'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: AccountSecurityPayload): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  phone: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  phone: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return formData.phone && formData.password && formData.password === formData.confirmPassword
})

function validate() {
  const phoneRegex = /^1[3-9]\d{9}$/
  errors.phone = !phoneRegex.test(formData.phone) ? '请输入有效的手机号' : ''
  errors.password = formData.password.length < 6 ? '密码至少6位' : ''
  errors.confirmPassword = formData.password !== formData.confirmPassword ? '两次输入密码不一致' : ''
  return isFormValid.value && !errors.phone && !errors.password && !errors.confirmPassword
}

function handleSave() {
  if (!validate()) return
  
  emit('save', {
    phone: formData.phone,
    password: formData.password
  })
  emit('update:modelValue', false)
  
  // Reset form
  formData.phone = ''
  formData.password = ''
  formData.confirmPassword = ''
  errors.phone = ''
  errors.password = ''
  errors.confirmPassword = ''
}
</script>

<style scoped>
</style>
