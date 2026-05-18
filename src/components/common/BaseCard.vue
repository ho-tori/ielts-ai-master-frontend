<template>
	<div
		class="overflow-hidden rounded-lg border border-border/60 bg-surface-elevated shadow-[0_1px_2px_rgb(15_23_42_/_0.04),0_18px_42px_rgb(15_23_42_/_0.06)]"
	>
		<div v-if="$slots.header" class="border-b border-border/50 bg-surface-muted/40 px-5 py-4">
			<slot name="header" />
		</div>
		<div class="p-5 sm:p-6">
			<slot />
		</div>
		<div v-if="$slots.footer" class="border-t border-border/50 bg-surface-muted/30 px-5 py-4">
			<slot name="footer" />
		</div>
	</div>
  
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
