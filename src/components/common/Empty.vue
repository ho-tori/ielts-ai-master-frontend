<template>
	<div class="w-full flex flex-col items-center justify-center p-10 text-text-secondary/70">
		<div class="h-12 w-12 rounded-lg bg-surface-muted flex items-center justify-center mb-3">
			<Icon icon="heroicons:archive-box" class="h-6 w-6" />
		</div>
		<div class="text-sm"><slot>暂无数据</slot></div>
	</div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped>
</style>
