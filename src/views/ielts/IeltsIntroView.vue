<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const currentStep = ref(0)
const themeStore = useThemeStore()

// 雅思考试流程数据
const ieltsSteps = [
  {
    id: 1,
    title: '考前准备',
    subtitle: 'Registration & Preparation',
    image: '/images/fingerprint-scanner.png',
    summary: '完成报名注册，准备考试材料',
    color: '#3B82F6',
    icon: {
      light: 'heroicons:calendar-days',
      ocean: 'heroicons:clipboard-document-list'
    }
  },
  {
    id: 2,
    title: '笔试考试',
    subtitle: 'Written Test',
    image: '/images/written-test.png',
    summary: '包括听力、阅读、写作三个部分',
    color: '#10B981',
    icon: {
      light: 'heroicons:document-text',
      ocean: 'heroicons:clipboard-list'
    }
  },
  {
    id: 3,
    title: '听力考试',
    subtitle: 'Listening Test',
    image: '/images/audio-test.png',
    summary: '30分钟听取录音并作答',
    content: '听力考试共40题，时长约30分钟，包括4个部分，难度递增。',
    color: '#8B5CF6',
    icon: {
      light: 'heroicons:headphones',
      ocean: 'heroicons:volume-2'
    }
  },
  {
    id: 4,
    title: '阅读考试',
    subtitle: 'Reading Test',
    image: '/images/reading-test.png',
    summary: '60分钟完成3篇文章阅读',
    content: '学术类阅读共3篇文章，每篇约1000词，共40道题目。',
    color: '#F59E0B',
    icon: {
      light: 'heroicons:book-open',
      ocean: 'heroicons:document-text'
    }
  },
  {
    id: 5,
    title: '写作考试',
    subtitle: 'Writing Test',
    image: '/images/writing-test.png',
    summary: '60分钟完成两篇作文',
    content: '学术类写作包括Task 1图表作文（150词）和Task 2议论文（250词）。',
    color: '#EF4444',
    icon: {
      light: 'heroicons:pencil',
      ocean: 'heroicons:edit'
    }
  },
  {
    id: 6,
    title: '口语考试',
    subtitle: 'Speaking Test',
    image: '/images/speaking-test.png',
    summary: '11-14分钟一对一面试',
    content: '口语考试分为三部分：自我介绍、话题陈述、双向讨论。',
    color: '#EC4899',
    icon: {
      light: 'heroicons:mic',
      ocean: 'heroicons:chat-bubble-left-right'
    }
  },
  {
    id: 7,
    title: '其他注意事项',
    subtitle: 'Additional Notes',
    image: '/images/others.png',
    summary: '考试中的特殊情况处理',
    content: '了解考试中的特殊情况处理方法，确保考试顺利进行。',
    color: '#10B981',
    icon: {
      light: 'heroicons:alert-circle',
      ocean: 'heroicons:information-circle'
    }
  },
  {
    id: 8,
    title: '成绩查询',
    subtitle: 'Results & Score',
    image: '/images/score-inquiry.png',
    summary: '考后13天可查询成绩',
    content: '笔试后第13天可在线查询成绩，成绩有效期为2年。',
    color: '#06B6D4',
    icon: {
      light: 'heroicons:chart-bar',
      ocean: 'heroicons:check-circle'
    }
  }
]

const currentData = computed(() => ieltsSteps[currentStep.value])

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const nextStep = () => {
  if (currentStep.value < ieltsSteps.length - 1) {
    currentStep.value++
  }
}

const goToStep = (index: number) => {
  currentStep.value = index
}

// 移除自动轮播功能
onMounted(() => {
  // 初始化时不自动轮播
})

onUnmounted(() => {
  // 清理资源
})

const goBack = () => {
  router.push('/practice')
}
</script>

<template>
  <div class="min-h-screen bg-surface-muted">
    <!-- 顶部导航 -->
    <div class="sticky top-0 z-10 bg-surface border-b border-border">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回练习中心
        </button>
        <h1 class="text-xl font-semibold text-text-primary">雅思考试流程指南</h1>
        <div class="w-24"></div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- 左右分栏布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：图像区域 -->
        <div class="rounded-xl overflow-hidden shadow-md border border-border">
          <div class="aspect-[4/3]">
            <img
              :src="currentData.image"
              :alt="currentData.title"
              class="w-full h-full object-contain"
            />
          </div>
        </div>

        <!-- 右侧：文字介绍区域 -->
        <div class="flex flex-col">
          <!-- 顶部：横向流程导航轴 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-text-primary flex items-center gap-2">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                考试流程
              </h3>
              <div class="flex items-center gap-2">
                <button
                  @click="prevStep"
                  :disabled="currentStep === 0"
                  class="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-border hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  @click="nextStep"
                  :disabled="currentStep === ieltsSteps.length - 1"
                  class="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-border hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 流程步骤指示器 -->
            <div class="relative">
              <div class="h-1 bg-border rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary rounded-full transition-all duration-500"
                  :style="{ width: ((currentStep + 1) / ieltsSteps.length * 100) + '%' }"
                ></div>
              </div>
              <div class="flex justify-between mt-2">
                <button
                  v-for="(step, index) in ieltsSteps"
                  :key="step.id"
                  @click="goToStep(index)"
                  class="flex flex-col items-center gap-1"
                >
                  <div
                    class="w-3 h-3 rounded-full transition-all"
                    :class="index === currentStep ? 'bg-primary scale-125' : 'bg-border hover:bg-primary/50'"
                  ></div>
                  <span class="text-xs text-text-secondary hover:text-text-primary transition-colors">{{ step.title }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 中间：详细内容 -->
          <div class="flex-1 bg-surface rounded-xl p-6 border border-border">
            <transition name="fade" mode="out-in">
              <div :key="currentData.id">
                <!-- 步骤标题 -->
                <div class="mb-4">
                  <span
                    class="text-xs font-medium px-2 py-0.5 rounded-full"
                    :style="{ backgroundColor: currentData.color + '20', color: currentData.color }"
                  >
                    Step {{ currentData.id }}
                  </span>
                  <h3 class="text-lg font-semibold text-text-primary mt-2">{{ currentData.title }}</h3>
                  <p class="text-text-secondary mt-1 text-sm">{{ currentData.content }}</p>
                </div>

                <!-- 详细内容 -->
                <div class="space-y-4">
                  <!-- 考前准备 -->
                  <div v-if="currentData.id === 1" class="rounded-lg p-4 bg-surface-muted border border-border">
                    <h4 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      考前准备
                    </h4>
                    <ul class="space-y-2 text-sm text-text-secondary">
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">1.</span>
                        <span>关闭电子产品、存包、来到登记桌前递身份证</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">2.</span>
                        <span>工作人员询问："是否有电子产品、纸巾在身上？" "口袋是否清空？" "请摘下口罩、眼镜、露出额头方便对照身份。" "请用手指在录入器上按4下"</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">3.</span>
                        <span>拍照：无口罩、无眼镜、露出额头，女孩子有需要的话自带夹子掀开刘海</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">4.</span>
                        <span>候场准备考试</span>
                      </li>
                    </ul>
                  </div>

                  <!-- 笔试考试 -->
                  <div v-if="currentData.id === 2" class="rounded-lg p-4 bg-surface-muted border border-border">
                    <h4 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      笔试考试
                    </h4>
                    <div class="mb-4">
                      <h5 class="font-medium text-text-primary mb-2">考试用品：</h5>
                      <ul class="space-y-1 text-sm text-text-secondary">
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">•</span>
                          <span>自己随身携带：身份证、储物柜钥匙（如果有）、透明无标签矿泉水</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">•</span>
                          <span>考场提供：一支铅笔、一副耳塞（没有的话找工作人员申请）、以及每个科目开始前都会发放一张账号密码纸</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="font-medium text-text-primary mb-2">考试流程：</h5>
                      <ul class="space-y-2 text-sm text-text-secondary">
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">1.</span>
                          <span>进入考位，调整座椅高低，为耳机套一次性耳机套</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">2.</span>
                          <span>工作人员会来到每个考生的位置上挨个要求摘下口罩确认身份</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">3.</span>
                          <span>考场这时候会播放规则的录音</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">4.</span>
                          <span>工作人员发放账号密码纸（草稿纸）⚠️ 正式开考前一个字不能写</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 听力考试 -->
                  <div v-if="currentData.id === 3" class="rounded-lg p-4 bg-surface-muted border border-border">
                    <h4 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      笔试听力
                    </h4>
                    <ul class="space-y-2 text-sm text-text-secondary">
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">1.</span>
                        <span>登录后，耳机试音时间：右上角音量条可以直接拉到最大</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">2.</span>
                        <span>字体选择：Extra Large（正式开后依旧可以调整）</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">3.</span>
                        <span>关于题目 highlight：</span>
                        <ul class="ml-4 space-y-1">
                          <li>上述流程结束、规则录音播放完毕</li>
                          <li>屏幕中间出现【Start Test】的按钮</li>
                          <li>点击后开始考试，听力从这一刻正式开始，此时所有40道题目都可见了（可以通过屏幕最下方的按钮跳转）</li>
                          <li>双击你想要 highlight 的词汇，选中后右键 highlight</li>
                        </ul>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">4.</span>
                        <span>听力考试时间一共30分钟左右，因为都在电脑上，所以没有纸笔的10分钟答题卡时间，听力播放结束后只有2分钟检查</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">5.</span>
                        <span>屏幕最顶端中间有剩余时间显示</span>
                      </li>
                    </ul>
                  </div>

                  <!-- 阅读考试 -->
                  <div v-if="currentData.id === 4" class="rounded-lg p-4 bg-surface-muted border border-border">
                    <h4 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      笔试阅读
                    </h4>
                    <ul class="space-y-2 text-sm text-text-secondary">
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">1.</span>
                        <span>同样登录后，等待规则录音播放完毕后，出现【Start Test】</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">2.</span>
                        <span>进入考试后，下方有题目选择键，所有40道题目可以随意跳转</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">3.</span>
                        <span>考试时长60分钟</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">4.</span>
                        <span>屏幕最顶端中间有剩余时间显示 </span>
                      </li>
                    </ul>
                  </div>

                  <!-- 写作考试 -->
                  <div v-if="currentData.id === 5" class="rounded-lg p-4 bg-surface-muted border border-border">
                    <h4 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      笔试作文
                    </h4>
                    <ul class="space-y-2 text-sm text-text-secondary">
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">1.</span>
                        <span>同样登录后，等待规则录音播放完毕后，出现【Start Test】</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">2.</span>
                        <span>大小作文的底部都有字数显示 </span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">3.</span>
                        <span>考试时长60分钟</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">4.</span>
                        <span>屏幕最顶端中间有剩余时间显示</span>
                      </li>
                    </ul>
                  </div>

                  <!-- 口语考试 -->
                  <div v-if="currentData.id === 6" class="rounded-lg p-4 bg-surface-muted border border-border">
                    <h4 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      口语篇
                    </h4>
                    <div class="mb-4">
                      <h5 class="font-medium text-text-primary mb-2">考试用品：</h5>
                      <p class="text-sm text-text-secondary">自己随身携带的：身份证、储物柜钥匙（如果有）</p>
                      <p class="text-sm text-text-secondary">考场提供：一张草纸、一支铅笔、一个通话耳机、一个呼叫器</p>
                    </div>
                    <div>
                      <h5 class="font-medium text-text-primary mb-2">考试流程：</h5>
                      <ul class="space-y-2 text-sm text-text-secondary">
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">1.</span>
                          <span>工作人员引导进入考室</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">2.</span>
                          <span>工作人员测试好麦克风  为你连接上考官  告知考官你的姓名和考号  把耳机递交给你 </span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">3.</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">4.</span>
                          <span>紧接着考试开始-语速放缓，找到节奏，就当作一场付费聊天 😊</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">5.</span>
                          <span>考完后不要立刻起身，按呼叫器，等待工作人员来放你出去。</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 其他注意事项 -->
                  <div v-if="currentData.id === 7" class="rounded-lg p-4 bg-surface-muted border border-border">
                    <h4 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      其他注意事项
                    </h4>
                    <div>
                      <h5 class="font-medium text-text-primary mb-2">上厕所问题：</h5>
                      <ul class="space-y-2 text-sm text-text-secondary">
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">1.</span>
                          <span>仅仅只有写作的时间可以申请上厕所（注意：⚠️但并不单独计算—会占用考试时间）</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">2.</span>
                          <span>写作最后10分钟不可以上厕所</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">3.</span>
                          <span>听力、阅读全程不可以上厕所</span>
                        </li>
                      </ul>
                    </div>
                    <div class="mt-4">
                      <h5 class="font-medium text-text-primary mb-2">其他注意事项：</h5>
                      <ul class="space-y-2 text-sm text-text-secondary">
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">1.</span>
                          <span>遇到技术问题及时举手示意</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">2.</span>
                          <span>遵守考场纪律，保持安静</span>
                        </li>
                        <li class="flex items-start gap-2">
                          <span class="text-primary mt-1">3.</span>
                          <span>考试结束后不要立即离开，等待监考人员指示</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- 成绩查询 -->
                  <div v-if="currentData.id === 8" class="rounded-lg p-4 bg-surface-muted border border-border">
                    <h4 class="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      成绩查询
                    </h4>
                    <ul class="space-y-2 text-sm text-text-secondary">
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">1.</span>
                        <span>登录官网查询电子成绩单</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">2.</span>
                        <span>纸质成绩单约3-5天邮寄</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">3.</span>
                        <span>总分和各单项均为1-9分</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-primary mt-1">4.</span>
                        <span>不满意可申请成绩复议</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>