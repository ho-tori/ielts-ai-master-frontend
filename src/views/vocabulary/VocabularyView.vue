<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-text-primary">智能生词本</h2>
      <BaseButton
        variant="primary"
        :loading="generating"
        :disabled="generating"
        @click="generateVocab"
      >
        {{ generating ? 'AI分析中...' : '生成生词本' }}
      </BaseButton>
    </div>

    <!-- Cluster Tabs -->
    <div v-if="clusters.length > 0" class="flex flex-wrap gap-2">
      <BaseButton
        :variant="selectedCluster === '' ? 'primary' : 'secondary'"
        size="sm"
        @click="filterByCluster('')"
      >全部 ({{ totalCount }})</BaseButton>
      <BaseButton
        v-for="c in clusters"
        :key="c.name"
        :variant="selectedCluster === c.name ? 'primary' : 'secondary'"
        size="sm"
        @click="filterByCluster(c.name)"
      >{{ c.name }} ({{ c.count }})</BaseButton>
    </div>

    <!-- Loading -->
    <Loading v-if="loading" />

    <!-- Empty State -->
    <BaseCard v-else-if="vocabList.length === 0">
      <Empty>暂无生词数据，请先完成错题解析后点击"生成生词本"</Empty>
    </BaseCard>

    <!-- Vocabulary Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
import { ref, onMounted } from 'vue'
import { BaseCard, BaseButton, Loading, Empty } from '@/components'
import VocabularyItemCard from './components/VocabularyItemCard.vue'
import { apiGenerateVocabulary, apiGetVocabularyList, apiGetClusters, apiDeleteVocabulary } from '@/api/vocabulary'
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

async function generateVocab() {
  generating.value = true
  try {
    const { data } = await apiGenerateVocabulary()
    if (data.code === 0) {
      await fetchClusters()
      await fetchList()
    }
  } catch (e: any) {
    const msg = e?.response?.data?.message || '生成失败'
    alert(msg)
  } finally {
    generating.value = false
  }
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

onMounted(() => {
  fetchClusters()
  fetchList()
})
</script>
