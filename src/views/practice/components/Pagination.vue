<script setup lang="ts">
import { BaseButton } from '@/components'

interface Props {
  currentPage: number
  totalPages: number
}

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const handleFirstPage = () => {
  emit('update:currentPage', 1)
}

const handlePreviousPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const handleNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

const handleLastPage = () => {
  emit('update:currentPage', props.totalPages)
}

const handlePageInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const page = Number(target.value)
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="currentPage === 1"
      @click="handleFirstPage"
    >
      首页
    </BaseButton>
    
    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="currentPage === 1"
      @click="handlePreviousPage"
    >
      上一页
    </BaseButton>

    <div class="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
      <span class="text-sm text-slate-600">第</span>
      <input
        :value="currentPage"
        type="number"
        :min="1"
        :max="totalPages"
        class="w-12 px-2 py-1 border border-slate-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
        @change="handlePageInput"
      />
      <span class="text-sm text-slate-600">/ {{ totalPages }} 页</span>
    </div>

    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="currentPage === totalPages"
      @click="handleNextPage"
    >
      下一页
    </BaseButton>

    <BaseButton
      variant="secondary"
      size="sm"
      :disabled="currentPage === totalPages"
      @click="handleLastPage"
    >
      末页
    </BaseButton>
  </div>
</template>
