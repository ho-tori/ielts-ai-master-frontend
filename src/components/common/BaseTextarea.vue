<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-slate-700 mb-2">{{ label }}</label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
      :class="textareaClass"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  required?: boolean
  rows?: number
  minHeightClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  required: false,
  rows: 5,
  minHeightClass: 'min-h-[180px]'
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaClass = computed(
  () =>
    `w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 transition-all outline-none ${props.minHeightClass}`
)
</script>

<style scoped>
</style>