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
        <div class="flex gap-2 mt-3 flex-wrap justify-center">
          <span 
            v-for="badge in earnedBadges" 
            :key="badge.id"
            class="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full border border-indigo-100"
          >
            {{ badge.icon }} {{ badge.name }}
          </span>
          <span v-if="earnedBadges.length === 0" class="px-3 py-1 bg-slate-50 text-slate-400 text-xs font-medium rounded-full border border-slate-100">
            暂无徽章
          </span>
        </div>
      </div>
    </BaseCard>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <span class="text-indigo-600 font-bold text-xl">{{ stats.totalArticles }}</span>
        <span class="text-slate-400 text-[11px] uppercase tracking-wider">完成阅读</span>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <span class="text-indigo-600 font-bold text-xl">{{ stats.totalVocabulary }}</span>
        <span class="text-slate-400 text-[11px] uppercase tracking-wider">掌握词汇</span>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <span class="text-indigo-600 font-bold text-xl">{{ stats.streakDays }}</span>
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
        <button class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" @click="showEditProfile = true">
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
        <button class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" @click="toggleReminder">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Icon icon="solar:bell-bing-linear" class="text-orange-500 text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-slate-800">学习提醒</p>
              <p class="text-[11px] text-slate-400">{{ user?.reminderEnabled ? `已开启 - ${user.reminderTime || '09:00'}` : '点击开启每日提醒' }}</p>
            </div>
          </div>
          <div :class="['w-10 h-5 rounded-full relative flex items-center px-1 transition-colors', user?.reminderEnabled ? 'bg-indigo-600' : 'bg-slate-300']">
            <div :class="['w-3 h-3 bg-white rounded-full absolute transition-all', user?.reminderEnabled ? 'right-1' : 'left-1']"></div>
          </div>
        </button>
        <button class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" @click="showAccountSecurity = true">
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

const updateChart = (dates: string[]) => {
  if (!chart) return
  chart.setOption({
    grid: { top: '10%', left: '2%', right: '5%', bottom: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, axisLabel: { show: false } },
    series: [{
      data: chartData.value,
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
