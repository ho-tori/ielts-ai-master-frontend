<template>
  <aside class="yasi-mascot" :style="widgetStyle" aria-live="polite">
    <button
      v-if="isCollapsed"
      type="button"
      class="yasi-mascot__collapsed"
      aria-label="展开雅思娘学习助手"
      title="展开雅思娘"
      @click="setCollapsed(false)"
    >
      <img :src="poseImages.idle" alt="" aria-hidden="true">
      <Icon icon="heroicons:chevron-up" class="yasi-mascot__collapsed-icon" />
    </button>

    <div v-else class="yasi-mascot__panel">
      <section v-show="!bubbleHidden" class="yasi-mascot__bubble" aria-label="雅思娘提示">
        <p>{{ currentLine }}</p>
        <div class="yasi-mascot__bubble-footer">
          <span>{{ statusLabel }}</span>
          <div class="yasi-mascot__bubble-actions">
            <button
              type="button"
              aria-label="换一条雅思娘提示"
              title="换一条提示"
              @click="nextTip()"
            >
              <Icon icon="heroicons:arrow-path" />
            </button>
            <button
              type="button"
              aria-label="隐藏雅思娘提示气泡"
              title="隐藏提示"
              @click="bubbleHidden = true"
            >
              <Icon icon="heroicons:eye-slash" />
            </button>
          </div>
        </div>
      </section>

      <div class="yasi-mascot__toolbar" role="group" aria-label="雅思娘控制">
        <button
          type="button"
          :aria-label="bubbleHidden ? '显示雅思娘提示气泡' : '隐藏雅思娘提示气泡'"
          :title="bubbleHidden ? '显示提示' : '隐藏提示'"
          @click="bubbleHidden = !bubbleHidden"
        >
          <Icon :icon="bubbleHidden ? 'heroicons:chat-bubble-left-right' : 'heroicons:chat-bubble-left-right-solid'" />
        </button>
        <button
          type="button"
          aria-label="让雅思娘鼓励一下"
          title="鼓励一下"
          @click="triggerAction('cheer')"
        >
          <Icon icon="heroicons:sparkles" />
        </button>
        <button
          type="button"
          aria-label="让雅思娘思考提示"
          title="思考提示"
          @click="triggerAction('thinking')"
        >
          <Icon icon="heroicons:light-bulb" />
        </button>
        <button
          type="button"
          aria-label="折叠雅思娘"
          title="折叠"
          @click="setCollapsed(true)"
        >
          <Icon icon="heroicons:chevron-down" />
        </button>
      </div>

      <button
        type="button"
        class="yasi-mascot__stage"
        :class="stageClasses"
        aria-label="点击雅思娘触发新动作"
        title="点击触发新动作"
        @click="triggerNextAction"
      >
        <span class="yasi-mascot__glow" aria-hidden="true"></span>
        <span class="yasi-mascot__spark yasi-mascot__spark--one" aria-hidden="true"></span>
        <span class="yasi-mascot__spark yasi-mascot__spark--two" aria-hidden="true"></span>
        <img
          :key="currentPose"
          class="yasi-mascot__portrait"
          :src="currentPoseSrc"
          alt="雅思娘 2D 学习助手"
          decoding="async"
        >
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const props = withDefaults(defineProps<{
  liftForMobileNav?: boolean
}>(), {
  liftForMobileNav: false
})

type PoseName = 'idle' | 'wave' | 'cheer' | 'thinking' | 'focus'
type ActionName = Exclude<PoseName, 'idle'>
type TipList = [string, ...string[]]
type MascotAction = {
  name: ActionName
  label: string
  line: string
}

const STORAGE_KEY = 'ielts-master-yasi-mascot-collapsed'
const route = useRoute()

const poseImages: Record<PoseName, string> = {
  idle: '/images/mascot/yasi-idle.png',
  wave: '/images/mascot/yasi-wave.png',
  cheer: '/images/mascot/yasi-cheer.png',
  thinking: '/images/mascot/yasi-thinking.png',
  focus: '/images/mascot/yasi-focus.png'
}

const isCollapsed = ref(false)
const bubbleHidden = ref(false)
const tipIndex = ref(0)
const actionIndex = ref(0)
const action = ref<ActionName | 'idle'>('idle')
const currentLine = ref('')

let actionTimer: number | undefined
let tipTimer: number | undefined

const defaultTips: TipList = [
  '我在右下角陪你学习，点我可以换动作。',
  '先开始一小步，状态通常会在行动之后出现。',
  '今天的雅思任务不用很大，但要足够具体。'
]

const routeTips: Record<string, TipList> = {
  dashboard: [
    '今天先挑一个薄弱项开练，连续 15 分钟就算很好的启动。',
    '复盘比刷题更值钱：看清错因，下一次才会少掉分。',
    '把目标拆小一点：阅读一篇、错题三道、生词十个。'
  ],
  reading: [
    '阅读先定位关键词，再找同义替换，不要被长句带着跑。',
    '遇到难句先抓主干，修饰成分可以第二遍再补。',
    '计时练习时先稳住正确率，再一点点压缩用时。'
  ],
  practice: [
    '做题时给每道题留一个判断依据，复盘会轻松很多。',
    '先做熟悉题型建立手感，再回头攻克卡住的部分。',
    '错题不是失败记录，是下一轮提分路线图。'
  ],
  wrongAnswers: [
    '错题页最适合找模式：词汇、定位、长难句，哪类最常出现？',
    '把同类错题放在一起看，会比单题复盘更容易发现问题。',
    '今天只解决一个高频错误，也是在稳稳提分。'
  ],
  vocabulary: [
    '生词不要只背释义，顺手补一个原句记忆会更牢。',
    '同义替换是雅思阅读核心技能，记单词时顺便记近义表达。',
    '复习间隔拉开一点，记忆会更抗遗忘。'
  ],
  training: [
    '专项训练前先定一个小目标：速度、准确率，或者某类题型。',
    '训练结束后记得看反馈，别让有价值的数据躺着。',
    '连续的小胜利会堆出大进步，今天稳一点就很好。'
  ],
  account: [
    '目标分数写清楚，练习路线会更容易坚持。',
    '学习记录不需要完美，真实才方便调整节奏。',
    '把资料和偏好整理好，后面训练会更顺手。'
  ],
  default: defaultTips
}

const actions: [MascotAction, ...MascotAction[]] = [
  { name: 'wave', label: '打招呼中', line: '我来啦。今天也一起把雅思拆成小块解决。' },
  { name: 'cheer', label: '鼓励中', line: '很好，已经在路上了。把这一题弄懂，就比刚才更强一点。' },
  { name: 'thinking', label: '思考中', line: '我们先找题干关键词，再回到原文看同义替换。' },
  { name: 'focus', label: '专注中', line: '进入专注模式：先看题干，再回文定位，最后核对答案。' }
]

const routeKey = computed(() => {
  if (route.path.startsWith('/reading')) return 'reading'
  if (route.path.startsWith('/practice')) return 'practice'
  if (route.path.startsWith('/wrong-answers')) return 'wrongAnswers'
  if (route.path.startsWith('/vocabulary')) return 'vocabulary'
  if (route.path.startsWith('/training')) return 'training'
  if (route.path.startsWith('/account')) return 'account'
  if (route.path === '/') return 'dashboard'
  return 'default'
})

const activeTips = computed<TipList>(() => routeTips[routeKey.value] ?? defaultTips)
const idleLine = computed(() => activeTips.value[tipIndex.value % activeTips.value.length] ?? defaultTips[0])
const activeAction = computed(() => actions.find(item => item.name === action.value))
const statusLabel = computed(() => activeAction.value?.label ?? '学习陪伴中')
const currentPose = computed<PoseName>(() => {
  if (action.value !== 'idle') return action.value
  return 'idle'
})
const currentPoseSrc = computed(() => poseImages[currentPose.value])
const stageClasses = computed(() => [`is-${currentPose.value}`, action.value === 'idle' ? 'is-idle' : 'is-acting'])
const widgetStyle = computed<Record<string, string>>(() => ({
  '--yasi-mobile-bottom': props.liftForMobileNav
    ? 'calc(5.5rem + env(safe-area-inset-bottom))'
    : 'calc(1rem + env(safe-area-inset-bottom))'
}))

watch(idleLine, (line) => {
  if (action.value === 'idle') {
    currentLine.value = line
  }
}, { immediate: true })

watch(() => route.path, () => {
  tipIndex.value = 0
  action.value = 'idle'
  currentLine.value = idleLine.value
})

onMounted(() => {
  isCollapsed.value = window.localStorage.getItem(STORAGE_KEY) === '1'

  tipTimer = window.setInterval(() => {
    if (!isCollapsed.value && action.value === 'idle' && !bubbleHidden.value) {
      nextTip(false)
    }
  }, 22000)
})

onBeforeUnmount(() => {
  window.clearTimeout(actionTimer)
  window.clearInterval(tipTimer)
})

function setCollapsed(value: boolean) {
  isCollapsed.value = value
  window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  if (!value) {
    bubbleHidden.value = false
    action.value = 'idle'
    currentLine.value = idleLine.value
  }
}

function nextTip(revealBubble = true) {
  tipIndex.value = (tipIndex.value + 1) % activeTips.value.length
  currentLine.value = idleLine.value
  action.value = 'idle'
  if (revealBubble) {
    bubbleHidden.value = false
  }
}

function triggerNextAction() {
  const nextAction = actions[actionIndex.value % actions.length] ?? actions[0]
  actionIndex.value += 1
  triggerAction(nextAction.name)
}

function triggerAction(name: ActionName) {
  const nextAction = actions.find(item => item.name === name)
  if (!nextAction) return

  window.clearTimeout(actionTimer)
  action.value = name
  currentLine.value = nextAction.line
  bubbleHidden.value = false

  actionTimer = window.setTimeout(() => {
    action.value = 'idle'
    currentLine.value = idleLine.value
  }, 2100)
}
</script>

<style scoped>
.yasi-mascot {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: calc(1.25rem + env(safe-area-inset-bottom));
  z-index: 70;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
}

.yasi-mascot__panel {
  width: min(18rem, calc(100vw - 2rem));
  display: grid;
  justify-items: end;
  gap: 0.5rem;
  pointer-events: auto;
}

.yasi-mascot__bubble {
  width: min(17.5rem, calc(100vw - 2rem));
  border: 1px solid rgb(var(--color-border) / 0.72);
  border-radius: 0.5rem;
  background:
    linear-gradient(135deg, rgb(var(--color-surface-elevated) / 0.96), rgb(var(--color-surface-muted) / 0.92));
  box-shadow: 0 14px 34px rgb(15 23 42 / 0.13);
  color: rgb(var(--color-text-primary));
  overflow: hidden;
  backdrop-filter: blur(14px);
  transform-origin: right bottom;
  animation: yasi-bubble-in 220ms ease-out both;
}

.yasi-mascot__bubble p {
  margin: 0;
  padding: 0.75rem 0.875rem 0.625rem;
  font-size: 0.8125rem;
  line-height: 1.6;
}

.yasi-mascot__bubble-footer {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-top: 1px solid rgb(var(--color-border) / 0.56);
  padding: 0.25rem 0.375rem 0.25rem 0.75rem;
  color: rgb(var(--color-text-secondary));
  font-size: 0.75rem;
  font-weight: 600;
}

.yasi-mascot__bubble-actions,
.yasi-mascot__toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.yasi-mascot__bubble-actions button,
.yasi-mascot__toolbar button {
  width: 2.75rem;
  height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  color: rgb(var(--color-text-secondary));
  transition: color 180ms ease, background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.yasi-mascot__bubble-actions button:hover,
.yasi-mascot__toolbar button:hover {
  border-color: rgb(var(--color-border) / 0.72);
  background: rgb(var(--color-surface) / 0.86);
  color: rgb(var(--color-primary));
}

.yasi-mascot__bubble-actions button:active,
.yasi-mascot__toolbar button:active,
.yasi-mascot__stage:active,
.yasi-mascot__collapsed:active {
  transform: scale(0.96);
}

.yasi-mascot__toolbar {
  border: 1px solid rgb(var(--color-border) / 0.68);
  border-radius: 0.5rem;
  background: rgb(var(--color-surface-elevated) / 0.92);
  padding: 0.25rem;
  box-shadow: 0 10px 26px rgb(15 23 42 / 0.1);
  backdrop-filter: blur(12px);
}

.yasi-mascot__stage {
  position: relative;
  width: 11rem;
  height: 12.75rem;
  border: 1px solid rgb(var(--color-border) / 0.72);
  border-radius: 0.5rem;
  background:
    radial-gradient(circle at 35% 20%, rgb(255 255 255 / 0.92), transparent 42%),
    linear-gradient(145deg, rgb(var(--color-surface-elevated)), rgb(var(--color-surface-muted)));
  box-shadow: 0 16px 36px rgb(15 23 42 / 0.15);
  overflow: hidden;
  transform-origin: center bottom;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}

.yasi-mascot__stage:hover {
  border-color: rgb(var(--color-primary) / 0.42);
  box-shadow: 0 20px 44px rgb(15 23 42 / 0.18);
  transform: translateY(-0.1875rem);
}

.yasi-mascot__glow {
  position: absolute;
  inset: auto 1rem 0.75rem;
  height: 3rem;
  border-radius: 999px;
  background: rgb(var(--color-primary) / 0.11);
  filter: blur(18px);
  pointer-events: none;
}

.yasi-mascot__portrait {
  position: absolute;
  top: -8%;
  left: -2%;
  z-index: 1;
  width: 116%;
  height: 116%;
  object-fit: contain;
  object-position: center center;
  transform-origin: 50% 86%;
  animation: yasi-pose-in 260ms ease-out both, yasi-idle 4.8s ease-in-out 260ms infinite;
}

.yasi-mascot__stage.is-acting .yasi-mascot__portrait {
  animation: yasi-pose-in 240ms ease-out both, yasi-action 1.35s cubic-bezier(0.2, 0.9, 0.2, 1) 120ms both;
}

.yasi-mascot__stage.is-cheer .yasi-mascot__portrait {
  animation: yasi-pose-in 220ms ease-out both, yasi-cheer 1.35s cubic-bezier(0.2, 0.9, 0.2, 1) 110ms both;
}

.yasi-mascot__stage.is-focus .yasi-mascot__portrait,
.yasi-mascot__stage.is-thinking .yasi-mascot__portrait {
  animation: yasi-pose-in 220ms ease-out both, yasi-focus 1.45s ease 120ms both;
}

.yasi-mascot__spark {
  position: absolute;
  z-index: 2;
  width: 0.625rem;
  height: 0.625rem;
  background: rgb(var(--color-accent) / 0.82);
  clip-path: polygon(50% 0, 62% 36%, 100% 50%, 62% 64%, 50% 100%, 38% 64%, 0 50%, 38% 36%);
  opacity: 0;
  pointer-events: none;
}

.yasi-mascot__spark--one {
  top: 1rem;
  left: 1rem;
}

.yasi-mascot__spark--two {
  top: 2.6rem;
  right: 1.1rem;
  width: 0.5rem;
  height: 0.5rem;
}

.yasi-mascot__stage.is-cheer .yasi-mascot__spark,
.yasi-mascot__stage.is-wave .yasi-mascot__spark {
  animation: yasi-spark 900ms ease-out both;
}

.yasi-mascot__stage.is-cheer .yasi-mascot__spark--two,
.yasi-mascot__stage.is-wave .yasi-mascot__spark--two {
  animation-delay: 120ms;
}

.yasi-mascot__collapsed {
  position: relative;
  width: 4rem;
  height: 4rem;
  border: 1px solid rgb(var(--color-border) / 0.72);
  border-radius: 999px;
  background: rgb(var(--color-surface-elevated) / 0.92);
  box-shadow: 0 14px 30px rgb(15 23 42 / 0.14);
  overflow: hidden;
  pointer-events: auto;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.yasi-mascot__collapsed:hover {
  border-color: rgb(var(--color-primary) / 0.42);
  box-shadow: 0 18px 38px rgb(15 23 42 / 0.18);
  transform: translateY(-0.125rem);
}

.yasi-mascot__collapsed img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 18%;
}

.yasi-mascot__collapsed-icon {
  position: absolute;
  right: 0.125rem;
  bottom: 0.125rem;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  background: rgb(var(--color-primary));
  color: white;
  padding: 0.2rem;
  box-shadow: 0 4px 10px rgb(var(--color-primary) / 0.24);
}

@keyframes yasi-pose-in {
  from {
    opacity: 0.2;
    transform: translateY(0.3rem) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes yasi-idle {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-0.18rem) rotate(-0.35deg) scale(1.01);
  }
}

@keyframes yasi-action {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  38% {
    transform: translateY(-0.35rem) rotate(-1.2deg) scale(1.025);
  }
  68% {
    transform: translateY(0.08rem) rotate(0.6deg) scale(0.998);
  }
}

@keyframes yasi-cheer {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  38% {
    transform: translateY(-0.7rem) scale(1.04);
  }
  66% {
    transform: translateY(0.08rem) scale(0.996);
  }
}

@keyframes yasi-focus {
  0%, 100% {
    transform: scale(1);
    filter: saturate(1);
  }
  45% {
    transform: scale(1.025);
    filter: saturate(1.06) contrast(1.02);
  }
}

@keyframes yasi-spark {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5) rotate(0deg);
  }
  35% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-1.4rem) scale(1.35) rotate(90deg);
  }
}

@keyframes yasi-bubble-in {
  from {
    opacity: 0;
    transform: translateY(0.35rem) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 767px) {
  .yasi-mascot {
    right: max(0.75rem, env(safe-area-inset-right));
    bottom: var(--yasi-mobile-bottom);
  }

  .yasi-mascot__panel,
  .yasi-mascot__bubble {
    width: min(15.5rem, calc(100vw - 1.5rem));
  }

  .yasi-mascot__stage {
    width: 8.75rem;
    height: 10.25rem;
  }
}

@media (max-width: 420px) {
  .yasi-mascot__bubble p {
    font-size: 0.75rem;
  }

  .yasi-mascot__stage {
    width: 8rem;
    height: 9.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yasi-mascot *,
  .yasi-mascot *::before,
  .yasi-mascot *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
