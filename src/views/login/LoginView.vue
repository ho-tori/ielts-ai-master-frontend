<template>
  <BaseCard>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">邮箱</label>
        <input
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 placeholder-slate-400 transition-all outline-none"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">密码</label>
        <input
          v-model.trim="form.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 placeholder-slate-400 transition-all outline-none"
          placeholder="请输入密码"
          required
          minlength="6"
        />
        <button 
          type="button" 
          class="text-sm text-indigo-600 hover:text-indigo-700 font-semibold mt-2 transition-colors" 
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? '隐藏密码' : '显示密码' }}
        </button>
      </div>

      <ErrorState v-if="error" :message="error" />

      <BaseButton 
        :loading="loading" 
        type="submit"
        variant="primary"
        size="lg"
        block
      >
        登录
      </BaseButton>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseCard from '../../components/common/BaseCard.vue'
import BaseButton from '../../components/common/BaseButton.vue'
import ErrorState from '../../components/common/ErrorState.vue'
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
    const redirect = (router.currentRoute.value.query.redirect as string) || '/account'
    router.replace(redirect)
  }
}
</script>

<style scoped>
</style>
