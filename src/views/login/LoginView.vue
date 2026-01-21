<template>
  <BaseCard>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <!-- 测试用户提示 -->
      <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-xs text-blue-800 font-semibold mb-2">📝 测试账户：</p>
        <p class="text-xs text-blue-700">邮箱: zhangsan@example.com</p>
        <p class="text-xs text-blue-700">密码: password123</p>
      </div>

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
        {{ loading ? '登录中...' : '登录' }}
      </BaseButton>

      <!-- 快速登录按钮 -->
      <div class="grid grid-cols-2 gap-2 pt-2">
        <BaseButton
          type="button"
          variant="secondary"
          size="sm"
          @click="quickLogin('zhangsan@example.com', 'password123')"
        >
          用户1 登录
        </BaseButton>
        <BaseButton
          type="button"
          variant="secondary"
          size="sm"
          @click="quickLogin('lisi@example.com', 'password123')"
        >
          用户2 登录
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

const showPassword = ref(false)
const form = reactive({ email: '', password: '' })
const router = useRouter()
const userStore = useUserStore()
const { loading, error } = storeToRefs(userStore)

async function onSubmit() {
  if (!form.email || !form.password) return
  const ok = await userStore.login({ email: form.email, password: form.password })
  if (ok) {
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.replace(redirect)
  }
}

/**
 * 快速登录（用于测试）
 */
function quickLogin(email: string, password: string) {
  form.email = email
  form.password = password
  onSubmit()
}
</script>

<style scoped>
</style>
