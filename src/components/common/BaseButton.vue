<template>
	<button
		:type="type"
	class="inline-flex items-center justify-center rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
		:class="classes"
		:disabled="disabled || loading"
		@click="$emit('click')"
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

defineEmits<{ (e: 'click'): void }>()

const sizeClass = computed(() => {
	switch (props.size) {
		case 'sm':
			return 'px-3 py-1.5 text-sm'
		case 'lg':
			return 'px-5 py-3 text-base'
		default:
			return 'px-4 py-2 text-sm'
	}
})

const variantClass = computed(() => {
	switch (props.variant) {
		case 'secondary':
			return 'bg-surface-muted text-text-secondary hover:bg-border font-medium'
		case 'tertiary':
			return 'bg-primary/20 text-text-primary hover:bg-primary/30 font-medium '
		case 'ghost':
			return 'bg-transparent text-text-secondary hover:bg-surface-muted font-medium'
		case 'danger':
			return 'bg-danger/15 text-danger hover:bg-danger/25 font-medium'
		case 'success':
			return 'bg-success/15 text-success hover:bg-success/25 font-medium'
		default:
			return 'bg-primary text-white hover:bg-primary-hover font-semibold'
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
