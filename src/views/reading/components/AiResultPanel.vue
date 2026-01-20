<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  selection: {
    text: string
    articleTitle: string
  }
}>()

const loading = ref(false)
const result = ref<null | {
  explanation: string
  vocab: { word: string; meaning: string }[]
}>(null)

const askAI = async () => {
  if (!props.selection.text) return

  loading.value = true
  result.value = null

  // 模拟 AI 请求
  await new Promise((r) => setTimeout(r, 900))

  result.value = {
    explanation:
      '这是一个典型的雅思阅读长句。主干是 “marine biologists are turning to algorithms”，后半部分通过现在分词结构补充说明原因。',
    vocab: [
      { word: 'marine', meaning: '海洋的' },
      { word: 'algorithm', meaning: '算法' },
      { word: 'increasingly', meaning: '越来越多地' }
    ]
  }

  loading.value = false
}

// 每次重新划词，清空旧结果
watch(
  () => props.selection.text,
  () => {
    result.value = null
  }
)
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
    <h4 class="font-bold mb-4">AI 辅助面板</h4>

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

      <button
        class="py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50"
        :disabled="loading"
        @click="askAI"
      >
        {{ loading ? 'AI 分析中...' : '询问 AI 助教' }}
      </button>

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
</template>
