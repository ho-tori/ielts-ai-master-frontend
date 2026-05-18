<template>
	<button
		:type="type"
	class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg transition-all duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55"
		:class="classes"
		:disabled="disabled || loading"
		@click="$emit('click', $event)"
	>
		<span v-if="loading" class="mr-2 h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></span>
		<slot />
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'success'
	size?: 'sm' | 'md' | 'lg'
	block?: boolean
	loading?: boolean
	disabled?: boolean
	type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'primary',
	size: 'md',
	block: false,
	loading: false,
	disabled: false,
	type: 'button'
})

defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const sizeClass = computed(() => {
	switch (props.size) {
		case 'sm':
			return 'px-3 py-2 text-sm'
		case 'lg':
			return 'px-5 py-3 text-base'
		default:
			return 'px-4 py-2.5 text-sm'
	}
})

const variantClass = computed(() => {
	switch (props.variant) {
		case 'secondary':
			return 'border border-border/70 bg-surface-elevated text-text-primary shadow-[0_1px_2px_rgb(15_23_42_/_0.03)] hover:border-primary/35 hover:bg-surface-muted font-medium'
		case 'tertiary':
			return 'border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 font-medium'
		case 'ghost':
			return 'bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary font-medium'
		case 'danger':
			return 'border border-danger/20 bg-danger/10 text-danger hover:bg-danger/15 font-medium'
		case 'success':
			return 'border border-success/20 bg-success/10 text-success hover:bg-success/15 font-medium'
		default:
			return 'bg-primary text-white shadow-[0_10px_22px_rgb(var(--color-primary)_/_0.18)] hover:bg-primary-hover font-semibold'
	}
})

const classes = computed(() => [
	sizeClass.value,
	variantClass.value,
	props.block ? 'w-full' : ''
])
</script>

<style scoped>
</style>
