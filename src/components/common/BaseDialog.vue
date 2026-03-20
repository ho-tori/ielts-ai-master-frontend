<template>
  <div v-if="modelValue" class="fixed inset-0 bg-text-primary/50 flex items-center justify-center z-50">
    <div class="bg-surface rounded-lg shadow-lg max-w-md w-full mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-lg font-semibold text-text-primary">{{ title }}</h2>
        <button @click="$emit('update:modelValue', false)" class="text-text-secondary/70 hover:text-text-secondary transition-colors">
          <Icon icon="solar:close-circle-linear" class="text-xl" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-4">
        <slot />
      </div>

      <!-- Footer -->
      <div class="flex gap-3 p-6 border-t border-border">
        <slot name="footer">
          <BaseButton 
            variant="secondary" 
            class="flex-1"
            @click="$emit('update:modelValue', false)"
          >
            取消
          </BaseButton>
          <BaseButton 
            class="flex-1"
            @click="$emit('confirm')"
            :disabled="confirmDisabled"
          >
            {{ confirmText }}
          </BaseButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BaseButton from './BaseButton.vue'

interface Props {
  modelValue: boolean
  title: string
  confirmText?: string
  confirmDisabled?: boolean
}

withDefaults(defineProps<Props>(), {
  confirmText: '保存',
  confirmDisabled: false
})

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()
</script>

<style scoped>
</style>
