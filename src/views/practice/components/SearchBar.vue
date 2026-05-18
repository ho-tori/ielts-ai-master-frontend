<template>
  <BaseCard>
    <div class="grid gap-5 lg:grid-cols-[minmax(280px,1fr)_auto] lg:items-end">
      <div>
        <label class="mb-2 block text-sm font-medium text-text-secondary">搜索文章</label>
        <div class="flex min-h-12 items-center gap-3 rounded-lg border border-border/80 bg-surface-muted/70 px-4 transition-colors focus-within:border-primary focus-within:bg-surface-elevated focus-within:ring-2 focus-within:ring-primary/15">
          <Icon icon="heroicons:magnifying-glass" class="text-xl text-text-secondary/70" />
          <input
            :value="modelValue"
            type="text"
            placeholder="输入标题、关键字或标签"
            class="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/55"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:flex lg:items-end">
        <div>
          <label class="mb-2 block text-sm font-medium text-text-secondary">难度</label>
          <div class="segmented-control">
            <BaseButton
              v-for="item in difficultyOptions"
              :key="item.value"
              size="sm"
              :variant="difficulty === item.value ? 'primary' : 'ghost'"
              @click="$emit('update:difficulty', item.value)"
            >
              {{ item.label }}
            </BaseButton>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-text-secondary">考试类型</label>
          <div class="segmented-control">
            <BaseButton
              v-for="cat in ['all', 'A类', 'G类']"
              :key="cat"
              size="sm"
              :variant="category === cat ? 'primary' : 'ghost'"
              @click="$emit('update:category', cat)"
            >
              {{ cat === 'all' ? '全部' : cat }}
            </BaseButton>
          </div>
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
