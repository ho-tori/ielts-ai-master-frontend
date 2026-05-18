<template>
  <div class="app-page">
    <PageHeader title="个人中心" description="管理账号资料、学习数据和安全设置。" />
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-text-primary">个人中心</h2>
          <Icon icon="solar:settings-linear" class="text-text-secondary text-xl" />
        </div>
      </template>
      <div class="flex flex-col items-center">
        <div class="w-24 h-24 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
          {{ initials }}
        </div>
        <h3 class="mt-3 text-xl font-bold text-text-primary">{{ user?.nickname || user?.username || '用户' }}</h3>
        <p class="text-text-secondary text-sm">{{ user?.email || '未设置邮箱' }}</p>
      </div>
    </BaseCard>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="metric-card flex flex-col items-center">
        <span class="text-primary font-bold text-xl">{{ stats.totalArticlesPracticed }}</span>
        <span class="text-text-secondary text-[11px] uppercase">练习文章</span>
      </div>
      <div class="metric-card flex flex-col items-center">
        <span class="text-primary font-bold text-xl">{{ stats.totalQuestionsAnswered }}</span>
        <span class="text-text-secondary text-[11px] uppercase">答题数</span>
      </div>
      <div class="metric-card flex flex-col items-center">
        <span class="text-primary font-bold text-xl">{{ stats.correctRate }}%</span>
        <span class="text-text-secondary text-[11px] uppercase">正确率</span>
      </div>
    </div>
    <BaseCard>
      <div class="divide-y divide-border/70">
        <button class="w-full flex items-center justify-between p-4 hover:bg-surface-muted transition-colors" @click="showEditProfile = true">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:user-circle-linear" class="text-primary text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-text-primary">编辑资料</p>
              <p class="text-[11px] text-text-secondary">修改昵称、邮箱、头像</p>
            </div>
          </div>
          <Icon icon="solar:alt-arrow-right-linear" class="text-text-secondary/50" />
        </button>
        <button class="w-full flex items-center justify-between p-4 hover:bg-surface-muted transition-colors" @click="showAccountSecurity = true">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon icon="solar:shield-keyhole-linear" class="text-primary text-xl" />
            </div>
            <div class="text-left">
              <p class="text-sm font-semibold text-text-primary">账户安全</p>
              <p class="text-[11px] text-text-secondary">修改密码</p>
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

    <EditProfileDialog 
      v-model="showEditProfile" 
      :initialNickname="user?.nickname || ''"
      :initialEmail="user?.email || ''"
      @save="handleSaveProfile"
    />

    <AccountSecurityDialog 
      v-model="showAccountSecurity"
      @save="handleSaveSecurity"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'
import { BaseCard, BaseButton, PageHeader } from '@/components'
import EditProfileDialog from './components/EditProfileDialog.vue'
import AccountSecurityDialog from './components/AccountSecurityDialog.vue'
import { apiUpdateProfile, apiUpdateSecurity } from '@/api/user'
import { apiGetUserStats } from '@/api/stats'
import { Icon } from '@iconify/vue'
import type { UserStats } from '@/types/user'

const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.user)

const showEditProfile = ref(false)
const showAccountSecurity = ref(false)

const stats = ref<UserStats>({
  totalArticlesPracticed: 0,
  totalQuestionsAnswered: 0,
  correctRate: 0,
  wrongAnswersCount: 0,
  pendingReviewCount: 0,
  lastPracticeTime: null,
  recentArticles: []
})

const initials = computed(() => (user.value?.nickname || user.value?.username || '用户').slice(0, 1).toUpperCase())

async function handleSaveProfile(data: { nickname: string; email: string }) {
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

async function handleSaveSecurity(data: { password: string }) {
  try {
    const res = await apiUpdateSecurity(data)
    if (res.data.code === 0) {
      userStore.user = res.data.data
      alert('密码修改成功')
    } else {
      alert(res.data.message || '保存失败')
    }
  } catch (e) {
    console.error('保存安全设置失败', e)
    alert('保存失败，请重试')
  }
}

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

onMounted(() => {
  fetchStats()
})

function onLogout() {
  userStore.logout()
  router.replace('/login')
}
</script>

<style scoped>
</style>
