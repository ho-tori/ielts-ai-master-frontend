<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon: string
  label: string
  active?: boolean
  to?: string
  danger?: boolean
}

withDefaults(defineProps<Props>(), {
  active: false,
  to: undefined,
  danger: false
})

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <router-link
    v-if="to"
    :to="to"
    class="p-3 rounded-2xl transition-all group relative block"
    :class="[
      active
        ? (danger ? 'bg-danger/15 text-danger shadow-sm' : 'bg-primary/10 text-primary shadow-sm')
        : (danger
          ? 'text-text-secondary/70 hover:text-danger hover:bg-danger/10'
          : 'text-text-secondary/70 hover:text-primary hover:bg-surface-muted')
    ]"
  >
    <Icon :icon="icon" class="text-2xl" />
    <span class="absolute left-full ml-4 px-2 py-1 bg-text-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
      {{ label }}
    </span>
  </router-link>

  <button
    v-else
    type="button"
    class="p-3 rounded-2xl transition-all group relative block"
    :class="[
      active
        ? (danger ? 'bg-danger/15 text-danger shadow-sm' : 'bg-primary/10 text-primary shadow-sm')
        : (danger
          ? 'text-text-secondary/70 hover:text-danger hover:bg-danger/10'
          : 'text-text-secondary/70 hover:text-primary hover:bg-surface-muted')
    ]"
    @click="$emit('click')"
  >
    <Icon :icon="icon" class="text-2xl" />
    <span class="absolute left-full ml-4 px-2 py-1 bg-text-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
      {{ label }}
    </span>
  </button>
</template>
