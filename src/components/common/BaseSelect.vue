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
  'w-full min-h-11 rounded-lg border border-border/80 bg-surface-elevated px-4 py-3 text-text-primary shadow-[0_1px_2px_rgb(15_23_42_/_0.03)] outline-none transition-all hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20'
)
</script>

<style scoped>
</style>
