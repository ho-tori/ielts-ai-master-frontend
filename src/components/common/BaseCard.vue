<template>
	<div
		class="rounded-2xl bg-surface shadow-sm ring-1 ring-border/70"
	>
		<div v-if="$slots.header" class="px-5 pt-5 pb-3 border-b border-border/70">
			<slot name="header" />
		</div>
		<div class="p-5">
			<slot />
		</div>
		<div v-if="$slots.footer" class="px-5 pb-5 pt-3 border-t border-border/70">
			<slot name="footer" />
		</div>
	</div>
  
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
