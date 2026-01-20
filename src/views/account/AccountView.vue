<template>
  <div class="space-y-6">
    <!-- Profile Card -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-800">个人中心</h2>
          <Icon icon="solar:settings-linear" class="text-slate-500 text-xl" />
        </div>
      </template>
      <div class="flex flex-col items-center">
        <div class="w-24 h-24 rounded-full bg-indigo-50 border-4 border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
          {{ initials }}
        </div>
        <h3 class="mt-3 text-xl font-bold text-slate-800">{{ user?.name || '用户' }}</h3>
        <p class="text-slate-400 text-sm">{{ user?.email }}</p>
        <div class="flex gap-2 mt-3">
          <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full border border-indigo-100">AI初级学者</span>
          <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-100">阅读达人</span>
        </div>
      </div>
    </BaseCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <span class="text-indigo-600 font-bold text-xl">156</span>
        <span class="text-slate-400 text-[11px] uppercase tracking-wider">完成阅读</span>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <span class="text-indigo-600 font-bold text-xl">2480</span>
        <span class="text-slate-400 text-[11px] uppercase tracking-wider">掌握词汇</span>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <span class="text-indigo-600 font-bold text-xl">12</span>
        <span class="text-slate-400 text-[11px] uppercase tracking-wider">连续天数</span>
      </div>
    </div>

    <!-- Chart -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="solar:chart-2-linear" class="text-indigo-500" /> 阅读进度 (近7日)
          </h3>
          <span class="text-[11px] text-slate-400">{{ updateText }}</span>
        </div>
      </template>
      <div ref="chartEl" class="w-full h-52"></div>
    </BaseCard>

    <!-- Settings -->
    <BaseCard>
      <div class="divide-y divide-slate-100">
        <button class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon icon="solar:user-circle-linear" class="text-blue-500 text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-slate-800">编辑资料</p>
              <p class="text-[11px] text-slate-400">修改昵称、头像、备考目标</p>
            </div>
          </div>
          <Icon icon="solar:alt-arrow-right-linear" class="text-slate-300" />
        </button>
        <button class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Icon icon="solar:bell-bing-linear" class="text-orange-500 text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-slate-800">学习提醒</p>
              <p class="text-[11px] text-slate-400">设置每日推送到访时间</p>
            </div>
          </div>
          <div class="w-10 h-5 bg-indigo-600 rounded-full relative flex items-center px-1">
            <div class="w-3 h-3 bg-white rounded-full absolute right-1"></div>
          </div>
        </button>
        <button class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Icon icon="solar:shield-keyhole-linear" class="text-purple-500 text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-slate-800">账户安全</p>
              <p class="text-[11px] text-slate-400">绑定手机、修改密码</p>
            </div>
          </div>
          <Icon icon="solar:alt-arrow-right-linear" class="text-slate-300" />
        </button>
      </div>
      <div class="mt-4">
        <BaseButton variant="secondary" block @click="onLogout">
          退出登录
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'
import BaseCard from '../../components/common/BaseCard.vue'
import BaseButton from '../../components/common/BaseButton.vue'
import { Icon } from '@iconify/vue'
import * as echarts from 'echarts'

const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.user)

const initials = computed(() => (user.value?.name || '用户').slice(0, 1).toUpperCase())
const updateText = computed(() => new Date().toISOString().slice(0, 10).replace(/-/g, '.'))

const chartEl = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

onMounted(() => {
  if (!chartEl.value) return
  chart = echarts.init(chartEl.value)
  chart.setOption({
    grid: { top: '10%', left: '2%', right: '5%', bottom: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1.13', '1.14', '1.15', '1.16', '1.17', '1.18', '今日'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, axisLabel: { show: false } },
    series: [{
      data: [15, 25, 18, 42, 35, 28, 50],
      type: 'bar',
      barWidth: 14,
      itemStyle: {
        color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#6366f1' },
          { offset: 1, color: '#a5b4fc' }
        ]),
        borderRadius: [4, 4, 0, 0]
      }
    }]
  })
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  chart = null
})

function handleResize() {
  chart?.resize()
}

function onLogout() {
  userStore.logout()
  router.replace('/login')
}
</script>

<style scoped>
</style>
