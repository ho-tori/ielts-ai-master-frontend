<template>
	<div class="min-h-dvh w-full bg-surface-muted flex items-center justify-center p-6">
		<div class="w-full max-w-md">
			<slot name="brand">
				<div class="flex items-center justify-center mb-8 select-none">
					<div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
						<Icon icon="heroicons:academic-cap-solid" class="w-6 h-6 text-white" />
					</div>
					<div>
						<h1 class="ml-3 text-xl font-bold text-text-primary">IELTS Master AI</h1>
					</div>
				</div>
			</slot>
			<RouterView />
			<slot name="footer">
				<p class="mt-8 text-center text-xs text-text-secondary/70">© {{ year }} IELTS Assistant</p>
			</slot>
		</div>
	</div>
  
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Icon } from '@iconify/vue'
const year = new Date().getFullYear()
</script>

<style scoped>
</style>
