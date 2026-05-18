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
    :aria-label="label"
    class="group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all"
    :class="[
      active
        ? (danger ? 'bg-danger/10 text-danger ring-1 ring-danger/20' : 'bg-primary text-white shadow-[0_10px_22px_rgb(var(--color-primary)_/_0.18)]')
        : (danger
          ? 'text-text-secondary hover:bg-danger/10 hover:text-danger'
          : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary')
    ]"
  >
    <Icon :icon="icon" class="text-2xl" aria-hidden="true" />
    <span
      v-if="active"
      class="absolute -right-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full"
      :class="danger ? 'bg-danger' : 'bg-primary'"
      aria-hidden="true"
    />
    <span class="pointer-events-none absolute left-full z-50 ml-4 whitespace-nowrap rounded-md bg-text-primary px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
      {{ label }}
    </span>
  </router-link>

  <button
    v-else
    type="button"
    class="group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all"
    :class="[
      active
        ? (danger ? 'bg-danger/10 text-danger ring-1 ring-danger/20' : 'bg-primary text-white shadow-[0_10px_22px_rgb(var(--color-primary)_/_0.18)]')
        : (danger
          ? 'text-text-secondary hover:bg-danger/10 hover:text-danger'
          : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary')
    ]"
    :aria-label="label"
    @click="$emit('click')"
  >
    <Icon :icon="icon" class="text-2xl" aria-hidden="true" />
    <span
      v-if="active"
      class="absolute -right-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full"
      :class="danger ? 'bg-danger' : 'bg-primary'"
      aria-hidden="true"
    />
    <span class="pointer-events-none absolute left-full z-50 ml-4 whitespace-nowrap rounded-md bg-text-primary px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
      {{ label }}
    </span>
  </button>
</template>
