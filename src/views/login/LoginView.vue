<template>
  <BaseCard>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold text-slate-800">{{ isRegister ? '注册账号' : '登录' }}</h2>
      </div>

      <BaseInput
        v-if="isRegister"
        v-model="form.name"
        type="text"
        label="姓名"
        placeholder="请输入姓名"
        required
      />

      <BaseInput
        v-model="form.email"
        type="email"
        label="邮箱"
        placeholder="you@example.com"
        autocomplete="email"
        required
      />

      <BaseInput
        v-model="form.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        autocomplete="current-password"
        :minlength="6"
        :show-toggle="true"
        :is-password-visible="showPassword"
        required
        @toggle-password="showPassword = !showPassword"
      />

      <ErrorState v-if="error" :message="error" />

      <BaseButton 
        :loading="loading" 
        type="submit"
        variant="primary"
        size="lg"
        block
      >
        {{ loading ? (isRegister ? '注册中...' : '登录中...') : (isRegister ? '注册' : '登录') }}
      </BaseButton>

      <div class="text-center">
        <button type="button" class="text-sm text-blue-600 hover:underline" @click="toggleMode">
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </button>
      </div>

      <div v-if="!isRegister" class="pt-2">
        <BaseButton
          type="button"
          variant="secondary"
          size="sm"
          block
          @click="quickLogin('AA@example.com', '111111')"
        >
          测试用户
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { BaseCard, BaseButton, BaseInput, ErrorState } from '@/components'
import { useUserStore } from '../../stores/user'
import { apiRegister } from '../../api/user'

const showPassword = ref(false)
const isRegister = ref(false)
const form = reactive({ email: '', password: '', name: '' })
const router = useRouter()
const userStore = useUserStore()
const { loading, error } = storeToRefs(userStore)

function toggleMode() {
  isRegister.value = !isRegister.value
  userStore.error = null
}

async function onSubmit() {
  if (!form.email || !form.password) return
  
  if (isRegister.value) {
    if (!form.name) return
    try {
      const { data } = await apiRegister({ 
        email: form.email, 
        password: form.password, 
        name: form.name 
      })
      if (data.code === 0) {
        userStore.token = data.data.token
        userStore.user = data.data.user
        localStorage.setItem('ielts_token', data.data.token)
        const redirect = (router.currentRoute.value.query.redirect as string) || '/'
        router.replace(redirect)
      } else {
        userStore.error = data.message || '注册失败'
      }
    } catch (e: any) {
      userStore.error = e?.response?.data?.message || '注册失败'
    }
  } else {
    const ok = await userStore.login({ email: form.email, password: form.password })
    if (ok) {
      const redirect = (router.currentRoute.value.query.redirect as string) || '/'
      router.replace(redirect)
    }
  }
}

function quickLogin(email: string, password: string) {
  form.email = email
  form.password = password
  onSubmit()
}
</script>

<style scoped>
</style>
