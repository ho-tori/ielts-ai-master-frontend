<template>
	<div class="w-full flex flex-col items-center justify-center p-10 text-slate-400">
		<div class="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-6 w-6">
				<path d="M3 7h18M3 7a2 2 0 0 1 2-2h3.172a2 2 0 0 1 1.414.586l1.828 1.828A2 2 0 0 0 13.828 8H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
			</svg>
		</div>
		<div class="text-sm"><slot>暂无数据</slot></div>
	</div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
