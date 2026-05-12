<template>
  <BaseCard class="mb-8">
    <!-- 搜索框 -->
    <div class="mb-6">
      <div class="flex items-center gap-3 bg-surface-muted rounded-lg px-4 py-3 border border-border">
        <Icon icon="heroicons:magnifying-glass" class="text-xl text-text-secondary/70" />
        <input 
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="搜索关键字、标题或标签..."
          class="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-secondary"
        />
      </div>
    </div>

    <!-- 过滤选项 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 难度过滤 -->
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-3">难度</label>
        <div class="flex gap-2">
          <BaseButton
            v-for="item in difficultyOptions"
            :key="item.value"
            size="sm"
            :variant="difficulty === item.value ? 'primary' : 'secondary'"
            @click="$emit('update:difficulty', item.value)"
          >
            {{ item.label }}
          </BaseButton>
        </div>
      </div>

      <!-- 分类过滤 -->
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-3">考试类型</label>
        <div class="flex gap-2">
          <BaseButton
            v-for="cat in ['all', 'A类', 'G类']"
            :key="cat"
            size="sm"
            :variant="category === cat ? 'primary' : 'secondary'"
            @click="$emit('update:category', cat)"
          >
            {{ cat === 'all' ? '全部' : cat }}
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { BaseCard, BaseButton } from '@/components'

const difficultyOptions = [
  { label: '全部', value: 'all' },
  { label: '简单', value: '简单' },
  { label: '中等', value: '中等' },
  { label: '困难', value: '困难' }
]

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
