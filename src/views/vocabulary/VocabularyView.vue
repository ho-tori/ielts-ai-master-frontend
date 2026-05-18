<template>
  <div class="app-page vocabulary-page">
    <PageHeader
      title="智能生词本"
      description="按固定语义标签整理错题中的同义替换和高频表达。"
    >
      <template #actions>
        <BaseButton
          variant="primary"
          class="vocabulary-action"
          :loading="generating"
          :disabled="generating"
          @click="generateVocab"
        >
          <Icon icon="heroicons:sparkles" />
          {{ generating ? 'AI分析中...' : '生成生词本' }}
        </BaseButton>
      </template>
    </PageHeader>

    <div v-if="clusters.length > 0" class="surface-panel-muted vocabulary-filter-panel overflow-x-auto p-2">
      <div class="flex min-w-max items-center gap-2">
        <BaseButton
          :variant="selectedCluster === '' ? 'primary' : 'ghost'"
          class="vocabulary-filter"
          :class="{ 'is-active': selectedCluster === '' }"
          size="sm"
          @click="filterByCluster('')"
        >全部 {{ totalCount }}</BaseButton>
        <BaseButton
          v-for="c in clusters"
          :key="c.name"
          :variant="selectedCluster === c.name ? 'primary' : 'ghost'"
          class="vocabulary-filter"
          :class="{ 'is-active': selectedCluster === c.name }"
          size="sm"
          @click="filterByCluster(c.name)"
        >{{ c.name }} {{ c.count }}</BaseButton>
      </div>
    </div>

    <!-- Loading -->
    <Loading v-if="loading" />

    <!-- Empty State -->
    <BaseCard v-else-if="vocabList.length === 0">
      <Empty>暂无生词数据，请先完成错题解析后点击"生成生词本"</Empty>
    </BaseCard>

    <!-- Vocabulary Grid -->
    <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <VocabularyItemCard
        v-for="item in vocabList"
        :key="item.id"
        :item="item"
        @delete="handleDelete(item.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { BaseCard, BaseButton, Loading, Empty, PageHeader } from '@/components'
import { Icon } from '@iconify/vue'
import VocabularyItemCard from './components/VocabularyItemCard.vue'
import { apiGenerateVocabulary, apiGetGenerationStatus, apiGetVocabularyList, apiGetClusters, apiDeleteVocabulary } from '@/api/vocabulary'
import type { VocabularyItem, ClusterInfo } from '@/types/vocabulary'

const loading = ref(false)
const generating = ref(false)
const vocabList = ref<VocabularyItem[]>([])
const clusters = ref<ClusterInfo[]>([])
const selectedCluster = ref('')
const totalCount = ref(0)

async function fetchClusters() {
  try {
    const { data } = await apiGetClusters()
    if (data.code === 0) {
      clusters.value = data.data || []
      totalCount.value = clusters.value.reduce((s, c) => s + c.count, 0)
    }
  } catch { /* 暂无聚类数据 */ }
}

async function fetchList(cluster?: string) {
  loading.value = true
  try {
    const { data } = await apiGetVocabularyList(cluster)
    if (data.code === 0) {
      vocabList.value = data.data || []
    }
  } catch (e) {
    console.error('获取生词列表失败', e)
  } finally {
    loading.value = false
  }
}

let pollTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  fetchClusters()
  fetchList()
  checkPendingGeneration()
})

onBeforeUnmount(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})

async function checkPendingGeneration() {
  try {
    const { data } = await apiGetGenerationStatus()
    if (data.code === 0 && data.data?.status === 'generating') {
      generating.value = true
      startPolling()
    }
  } catch { /* ignore */ }
}

async function generateVocab() {
  generating.value = true
  try {
    const { data } = await apiGenerateVocabulary()
    if (data.code === 0 && data.data?.status === 'generating') {
      startPolling()
    } else if (data.code !== 0) {
      alert(data.message || '生成失败')
      generating.value = false
    }
  } catch (e: any) {
    alert(e?.response?.data?.message || '请求失败，请稍后重试')
    generating.value = false
  }
}

function startPolling() {
  if (pollTimer) clearInterval(pollTimer)
  let attempts = 0
  pollTimer = setInterval(async () => {
    attempts++
    try {
      const { data } = await apiGetGenerationStatus()
      if (data.code !== 0) return

      const status = data.data?.status
      if (status === 'done') {
        clearInterval(pollTimer!)
        pollTimer = null
        generating.value = false
        await fetchClusters()
        await fetchList()
      } else if (status?.startsWith('error')) {
        clearInterval(pollTimer!)
        pollTimer = null
        generating.value = false
        alert(data.data?.message || '生成失败，请重试')
      } else if (attempts > 60) {
        // 3分钟超时
        clearInterval(pollTimer!)
        pollTimer = null
        generating.value = false
        alert('生成超时，请刷新页面查看结果')
        await fetchClusters()
        await fetchList()
      }
    } catch {
      // 轮询失败，继续重试
    }
  }, 3000) // 每3秒轮询一次
}

async function handleDelete(id: number) {
  try {
    await apiDeleteVocabulary(id)
    vocabList.value = vocabList.value.filter(v => v.id !== id)
    await fetchClusters()
  } catch { /* ignore */ }
}

function filterByCluster(name: string) {
  selectedCluster.value = name
  fetchList(name || undefined)
}
</script>

<style scoped>
:global(html[data-theme='mono']) .vocabulary-action {
  background-color: rgb(var(--color-vocabulary-accent));
  box-shadow: 0 10px 22px rgb(var(--color-vocabulary-accent) / 0.18);
}

:global(html[data-theme='mono']) .vocabulary-action:hover {
  background-color: rgb(234 88 12);
}

:global(html[data-theme='mono']) .vocabulary-filter-panel {
  background-color: rgb(var(--color-vocabulary-muted) / 0.12);
  border-color: rgb(var(--color-vocabulary-muted) / 0.72);
}

:global(html[data-theme='mono']) .vocabulary-filter.is-active {
  background-color: rgb(var(--color-vocabulary-accent));
  border-color: rgb(var(--color-vocabulary-accent));
  color: rgb(255 255 255);
  box-shadow: 0 8px 18px rgb(var(--color-vocabulary-accent) / 0.18);
}

:global(html[data-theme='mono']) .vocabulary-filter:not(.is-active):hover {
  background-color: rgb(var(--color-vocabulary-muted) / 0.18);
  color: rgb(var(--color-text-primary));
}
</style>
