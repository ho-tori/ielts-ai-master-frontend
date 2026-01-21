<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-slate-700 mb-2">
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
  'w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 transition-all outline-none'
)
</script>

<style scoped>
</style>
