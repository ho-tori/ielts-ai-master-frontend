<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-text-secondary mb-2">
      {{ label }}
    </label>
    <select 
      :value="modelValue"
      :required="required"
      :class="selectClass"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  required: false
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectClass = computed(() => 
  'w-full px-4 py-3 rounded-lg border border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 text-text-primary transition-all outline-none'
)
</script>

<style scoped>
</style>
