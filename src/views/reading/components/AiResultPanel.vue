<script setup lang="ts">
import { ref, watch } from 'vue'
import { BaseButton } from '@/components'
import { apiAiAnalyze, type AiAnalyzeResponse } from '@/api/ai'
import { BaseCard } from '@/components'

const props = defineProps<{
  selection: {
    text: string
    articleTitle: string
  }
}>()

const loading = ref(false)
const result = ref<AiAnalyzeResponse | null>(null)

const askAI = async () => {
  if (!props.selection.text) return

  loading.value = true
  result.value = null

  try {
    const { data } = await apiAiAnalyze({
      text: props.selection.text,
      articleTitle: props.selection.articleTitle
    })
    if (data.code === 0) {
      result.value = data.data
    }
  } catch (e) {
    console.error('AI分析失败', e)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.selection.text,
  () => {
    result.value = null
  }
)
</script>

<template>
  <BaseCard>
  <template #header>
      <h3 class="font-semibold text-slate-800">AI 辅助面板</h3>
    </template>
  <div class="space-y-4">
    <!-- 未选择 -->
    <div
      v-if="!selection.text"
      class="text-slate-400 text-center flex-1 flex items-center justify-center"
    >
      在左侧文中划词，获取 AI 深度解析
    </div>

    <!-- 已选择 -->
    <div v-else class="flex-1 flex flex-col gap-4">
      <div class="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
        <p class="text-xs font-bold text-indigo-700 mb-2">选中内容</p>
        <p class="text-sm italic text-slate-600">
          "{{ selection.text }}"
        </p>
      </div>

      <BaseButton
        variant="primary"
        block
        :disabled="loading"
        @click="askAI"
      >
        {{ loading ? 'AI 分析中...' : '询问 AI 助教' }}
      </BaseButton>

      <!-- AI 返回结果 -->
      <div v-if="result" class="mt-2 space-y-4">
        <div>
          <p class="font-semibold mb-1">句子解析</p>
          <p class="text-sm text-slate-700">
            {{ result.explanation }}
          </p>
        </div>

        <div>
          <p class="font-semibold mb-1">核心词汇</p>
          <ul class="text-sm text-slate-700 list-disc pl-5">
            <li v-for="v in result.vocab" :key="v.word">
              <strong>{{ v.word }}</strong>：{{ v.meaning }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  </BaseCard>
</template>
