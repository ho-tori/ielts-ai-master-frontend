<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">{{ label }}</label>
    <input
      :value="modelValue"
      :type="inputType"
      :placeholder="placeholder"
      :required="required"
      :minlength="minlength"
      :autocomplete="autocomplete"
      class="w-full min-h-11 rounded-lg border border-border/80 bg-surface-elevated px-4 py-3 text-text-primary shadow-[0_1px_2px_rgb(15_23_42_/_0.03)] outline-none transition-all placeholder:text-text-secondary/55 hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value.trim())"
    />
    <button 
      v-if="type === 'password' && showToggle"
      type="button" 
      class="text-sm text-primary hover:text-primary-hover font-semibold mt-2 transition-colors" 
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

const props = withDefaults(defineProps<Props>(), {
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
  if (props.type === 'password') {
    return props.isPasswordVisible ? 'text' : 'password'
  }
  return props.type
})
</script>

<style scoped>
</style>
