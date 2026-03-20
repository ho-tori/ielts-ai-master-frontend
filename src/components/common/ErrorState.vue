<template>
	<div class="p-4 rounded-xl bg-danger/10 text-danger border border-danger/20">
		<div class="font-medium">{{ title }}</div>
		<div v-if="message" class="text-sm mt-1 text-danger/90">{{ message }}</div>
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
