<template>
	<div class="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100">
		<div class="font-medium">{{ title }}</div>
		<div v-if="message" class="text-sm mt-1 text-red-600/90">{{ message }}</div>
		<div v-if="$slots.action" class="mt-3">
			<slot name="action" />
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	title?: string
	message?: string
}
withDefaults(defineProps<Props>(), {
	title: '出错了',
	message: ''
})
</script>

<style scoped>
</style>
