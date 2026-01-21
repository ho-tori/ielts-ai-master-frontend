<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-slate-700 mb-2">{{ label }}</label>
    <input
      :value="modelValue"
      :type="inputType"
      :placeholder="placeholder"
      :required="required"
      :minlength="minlength"
      :autocomplete="autocomplete"
      class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 placeholder-slate-400 transition-all outline-none"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value.trim())"
    />
    <button 
      v-if="type === 'password' && showToggle"
      type="button" 
      class="text-sm text-indigo-600 hover:text-indigo-700 font-semibold mt-2 transition-colors" 
      @click="$emit('toggle-password')"
    >
      {{ isPasswordVisible ? '隐藏密码' : '显示密码' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel'
  placeholder?: string
  required?: boolean
  minlength?: number
  autocomplete?: string
  showToggle?: boolean
  isPasswordVisible?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  showToggle: false,
  isPasswordVisible: false
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'toggle-password'): void
}>()

const inputType = computed(() => {
  // 这个计算属性会在组件使用时通过 isPasswordVisible 来动态确定
  return 'text'
})
</script>

<style scoped>
</style>
