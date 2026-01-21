<template>
  <BaseCard class="mb-8">
    <!-- 搜索框 -->
    <div class="mb-6">
      <div class="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
        <Icon icon="heroicons:magnifying-glass" class="text-xl text-slate-400" />
        <input 
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="搜索关键字、标题或标签..."
          class="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-500"
        />
      </div>
    </div>

    <!-- 过滤选项 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 难度过滤 -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-3">难度</label>
        <div class="flex gap-2">
          <BaseButton
            v-for="level in ['all', 'easy', 'medium', 'hard']"
            :key="level"
            size="sm"
            :variant="difficulty === level ? 'primary' : 'secondary'"
            @click="$emit('update:difficulty', level)"
          >
            {{ level === 'all' ? '全部' : level === 'easy' ? '简单' : level === 'medium' ? '中等' : '困难' }}
          </BaseButton>
        </div>
      </div>

      <!-- 分类过滤 -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-3">分类</label>
        <div class="flex gap-2">
          <BaseButton
            v-for="cat in ['all', 'news', 'academic', 'fiction']"
            :key="cat"
            size="sm"
            :variant="category === cat ? 'primary' : 'secondary'"
            @click="$emit('update:category', cat)"
          >
            {{ cat === 'all' ? '全部' : cat === 'news' ? '新闻' : cat === 'academic' ? '学术' : '文学' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { BaseCard, BaseButton } from '@/components'

defineProps<{
  modelValue: string
  difficulty: string
  category: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:difficulty', value: string): void
  (e: 'update:category', value: string): void
}>()
</script>
