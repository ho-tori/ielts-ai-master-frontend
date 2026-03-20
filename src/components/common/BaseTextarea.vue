<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">{{ label }}</label>
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
    `w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-primary placeholder:text-text-secondary/70 transition-all outline-none ${props.minHeightClass}`
)
</script>

<style scoped>
</style>