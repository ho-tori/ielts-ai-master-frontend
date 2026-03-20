<template>
  <div class="space-y-6">
    <!-- Profile Card -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-text-primary">个人中心</h2>
          <Icon icon="solar:settings-linear" class="text-text-secondary text-xl" />
        </div>
      </template>
      <div class="flex flex-col items-center">
        <div class="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
          {{ initials }}
        </div>
        <h3 class="mt-3 text-xl font-bold text-text-primary">{{ user?.name || '用户' }}</h3>
        <p class="text-text-secondary/70 text-sm">{{ user?.email }}</p>
        <div class="flex gap-2 mt-3 flex-wrap justify-center">
          <span 
            v-for="badge in earnedBadges" 
            :key="badge.id"
            class="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
          >
            {{ badge.icon }} {{ badge.name }}
          </span>
          <span v-if="earnedBadges.length === 0" class="px-3 py-1 bg-surface-muted text-text-secondary/70 text-xs font-medium rounded-full border border-border/70">
            暂无徽章
          </span>
        </div>
      </div>
    </BaseCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-surface p-4 rounded-2xl shadow-sm border border-border/70 flex flex-col items-center">
        <span class="text-primary font-bold text-xl">{{ stats.totalArticles }}</span>
        <span class="text-text-secondary/70 text-[11px] uppercase tracking-wider">完成阅读</span>
      </div>
      <div class="bg-surface p-4 rounded-2xl shadow-sm border border-border/70 flex flex-col items-center">
        <span class="text-primary font-bold text-xl">{{ stats.totalVocabulary }}</span>
        <span class="text-text-secondary/70 text-[11px] uppercase tracking-wider">掌握词汇</span>
      </div>
      <div class="bg-surface p-4 rounded-2xl shadow-sm border border-border/70 flex flex-col items-center">
        <span class="text-primary font-bold text-xl">{{ stats.streakDays }}</span>
        <span class="text-text-secondary/70 text-[11px] uppercase tracking-wider">连续天数</span>
      </div>
    </div>

    <!-- Chart -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-text-primary flex items-center gap-2">
            <Icon icon="solar:chart-2-linear" class="text-primary" /> 阅读进度 (近7日)
          </h3>
          <span class="text-[11px] text-text-secondary/70">{{ updateText }}</span>
        </div>
      </template>
      <div ref="chartEl" class="w-full h-52"></div>
    </BaseCard>

    <!-- Settings -->
    <BaseCard>
      <div class="divide-y divide-border/70">
        <button class="w-full flex items-center justify-between p-4 hover:bg-surface-muted transition-colors" @click="showEditProfile = true">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:user-circle-linear" class="text-primary text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-text-primary">编辑资料</p>
              <p class="text-[11px] text-text-secondary/70">修改昵称、头像、备考目标</p>
            </div>
          </div>
          <Icon icon="solar:alt-arrow-right-linear" class="text-text-secondary/50" />
        </button>
        <button class="w-full flex items-center justify-between p-4 hover:bg-surface-muted transition-colors" @click="toggleReminder">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:bell-bing-linear" class="text-primary text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-text-primary">学习提醒</p>
              <p class="text-[11px] text-text-secondary/70">{{ user?.reminderEnabled ? `已开启 - ${user.reminderTime || '09:00'}` : '点击开启每日提醒' }}</p>
            </div>
          </div>
          <div :class="['w-10 h-5 rounded-full relative flex items-center px-1 transition-colors', user?.reminderEnabled ? 'bg-primary' : 'bg-border']">
            <div :class="['w-3 h-3 bg-white rounded-full absolute transition-all', user?.reminderEnabled ? 'right-1' : 'left-1']"></div>
          </div>
        </button>
        <button class="w-full flex items-center justify-between p-4 hover:bg-surface-muted transition-colors" @click="showAccountSecurity = true">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:shield-keyhole-linear" class="text-primary text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-text-primary">账户安全</p>
              <p class="text-[11px] text-text-secondary/70">绑定手机、修改密码</p>
            </div>
          </div>
          <Icon icon="solar:alt-arrow-right-linear" class="text-text-secondary/50" />
        </button>
      </div>
      <div class="mt-4">
        <BaseButton variant="secondary" block @click="onLogout">
          退出登录
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Edit Profile Dialog -->
    <EditProfileDialog 
      v-model="showEditProfile" 
      :initialName="user?.name || ''"
      :initialTarget="user?.target || ''"
      @save="handleSaveProfile"
    />

    <!-- Account Security Dialog -->
    <AccountSecurityDialog 
      v-model="showAccountSecurity"
      @save="handleSaveSecurity"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'
import { BaseCard, BaseButton } from '@/components'
import EditProfileDialog from './components/EditProfileDialog.vue'
import AccountSecurityDialog from './components/AccountSecurityDialog.vue'
import { apiUpdateProfile, apiUpdateSecurity, apiUpdateReminder } from '@/api/user'
import { apiGetUserStats, apiGetReadingProgress } from '@/api/stats'
import { apiGetBadges, type BadgeResponse } from '@/api/badge'
import { Icon } from '@iconify/vue'
import * as echarts from 'echarts'

const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.user)

const showEditProfile = ref(false)
const showAccountSecurity = ref(false)

const stats = ref({
  totalArticles: 0,
  totalVocabulary: 0,
  streakDays: 0
})

const chartData = ref<number[]>([])

const badges = ref<BadgeResponse[]>([])
const earnedBadges = computed(() => badges.value.filter(b => b.earned))

const initials = computed(() => (user.value?.name || '用户').slice(0, 1).toUpperCase())
const updateText = computed(() => new Date().toISOString().slice(0, 10).replace(/-/g, '.'))


async function handleSaveProfile(data: { name: string; target: string }) {
  try {
    const res = await apiUpdateProfile(data)
    if (res.data.code === 0) {
      userStore.user = res.data.data
      alert('资料保存成功')
    } else {
      alert(res.data.message || '保存失败')
    }
  } catch (e) {
    console.error('保存资料失败', e)
    alert('保存失败，请重试')
  }
}

async function handleSaveSecurity(data: { phone: string; password: string }) {
  try {
    const res = await apiUpdateSecurity(data)
    if (res.data.code === 0) {
      userStore.user = res.data.data
      alert('安全设置保存成功')
    } else {
      alert(res.data.message || '保存失败')
    }
  } catch (e) {
    console.error('保存安全设置失败', e)
    alert('保存失败，请重试')
  }
}

async function toggleReminder() {
  const newEnabled = !user.value?.reminderEnabled
  try {
    const res = await apiUpdateReminder({
      reminderEnabled: newEnabled,
      reminderTime: user.value?.reminderTime || '09:00'
    })
    if (res.data.code === 0) {
      userStore.user = res.data.data
    }
  } catch (e) {
    console.error('更新提醒设置失败', e)
    alert('操作失败，请重试')
  }
}
const chartEl = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const fetchStats = async () => {
  try {
    const { data } = await apiGetUserStats()
    if (data.code === 0) {
      stats.value = data.data
    }
  } catch (e) {
    console.error('获取统计数据失败', e)
  }
}

const fetchReadingProgress = async () => {
  try {
    const { data } = await apiGetReadingProgress()
    if (data.code === 0) {
      const progress = data.data.dailyProgress
      chartData.value = progress.map(p => p.articlesRead)
      updateChart(progress.map(p => p.date))
    }
  } catch (e) {
    console.error('获取阅读进度失败', e)
  }
}

const fetchBadges = async () => {
  try {
    const { data } = await apiGetBadges()
    if (data.code === 0) {
      badges.value = data.data
    }
  } catch (e) {
    console.error('获取徽章失败', e)
  }
}

function getThemeRgbVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value ? `rgb(${value})` : fallback
}

const updateChart = (dates: string[]) => {
  if (!chart) return

  const axisTextColor = getThemeRgbVar('--color-text-secondary', '#94a3b8')
  const splitLineColor = getThemeRgbVar('--color-border', '#f1f5f9')
  const primaryColor = getThemeRgbVar('--color-primary', '#6366f1')
  const primaryHoverColor = getThemeRgbVar('--color-primary-hover', '#a5b4fc')

  chart.setOption({
    grid: { top: '10%', left: '2%', right: '5%', bottom: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: axisTextColor, fontSize: 10 }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: splitLineColor } }, axisLabel: { show: false } },
    series: [{
      data: chartData.value,
      type: 'bar',
      barWidth: 14,
      itemStyle: {
        color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: primaryColor },
          { offset: 1, color: primaryHoverColor }
        ]),
        borderRadius: [4, 4, 0, 0]
      }
    }]
  })
}

onMounted(() => {
  if (!chartEl.value) return
  chart = echarts.init(chartEl.value)
  
  fetchStats()
  fetchReadingProgress()
  fetchBadges()
  
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
