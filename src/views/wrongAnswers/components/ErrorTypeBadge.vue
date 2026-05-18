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
    '同义替换识别不足': 'bg-amber-50 text-amber-700',
    '定位词选择错误': 'bg-blue-50 text-blue-700',
    '细节信息漏读': 'bg-cyan-50 text-cyan-700',
    '逻辑关系误判': 'bg-pink-50 text-pink-700',
    '否定与范围误读': 'bg-orange-50 text-orange-700',
    '比较与程度误读': 'bg-purple-50 text-purple-700',
    '时间顺序误读': 'bg-teal-50 text-teal-700',
    '主客体关系误读': 'bg-violet-50 text-violet-700',
    '指代关系误读': 'bg-indigo-50 text-indigo-700',
    '题型策略错误': 'bg-slate-100 text-slate-700',
    '选项干扰辨析不足': 'bg-red-50 text-red-700',
    '过度推断': 'bg-rose-50 text-rose-700',
    '同义替换错误': 'bg-amber-50 text-amber-700',
    '关键词定位错误': 'bg-blue-50 text-blue-700',
    '偷换概念': 'bg-red-50 text-red-700',
    '范围扩大/缩小': 'bg-orange-50 text-orange-700',
    '推理链错误': 'bg-pink-50 text-pink-700'
  }
  return map[props.type] || 'bg-slate-50 text-slate-600'
})
</script>
