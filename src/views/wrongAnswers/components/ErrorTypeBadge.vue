<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
    :class="colorClass"
  >
    {{ type }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ type: string }>()

const colorClass = computed(() => {
  const map: Record<string, string> = {
    '同义替换错误': 'bg-amber-50 text-amber-700',
    '关键词定位错误': 'bg-blue-50 text-blue-700',
    '主客体关系误读': 'bg-purple-50 text-purple-700',
    '偷换概念': 'bg-red-50 text-red-700',
    '范围扩大/缩小': 'bg-orange-50 text-orange-700',
    '推理链错误': 'bg-pink-50 text-pink-700'
  }
  return map[props.type] || 'bg-slate-50 text-slate-600'
})
</script>
