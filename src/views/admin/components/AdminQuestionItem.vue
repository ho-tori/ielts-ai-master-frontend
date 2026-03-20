<script setup lang="ts">
import { BaseButton, BaseInput, BaseSelect, BaseTextarea } from '@/components'

interface QuestionOption {
  label: string
  content: string
}

interface AdminQuestion {
  questionNumber: number
  questionTypeCode: 'single_choice' | 'judgment'
  stem: string
  options?: QuestionOption[]
  correctAnswer: string
  analysis?: string
  answerParagraphNumber: number
  answerSentenceIndex: number
}

const props = defineProps<{
  modelValue: AdminQuestion
  index: number
  canRemove: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: AdminQuestion): void
  (e: 'remove'): void
}>()

function updateField<K extends keyof AdminQuestion>(key: K, value: AdminQuestion[K]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

function onTypeChange(value: string) {
  const questionTypeCode = value as AdminQuestion['questionTypeCode']
  if (questionTypeCode === 'single_choice') {
    emit('update:modelValue', {
      ...props.modelValue,
      questionTypeCode,
      options: props.modelValue.options && props.modelValue.options.length > 0
        ? props.modelValue.options
        : [
            { label: 'A', content: '' },
            { label: 'B', content: '' },
            { label: 'C', content: '' },
            { label: 'D', content: '' }
          ],
      correctAnswer: ['A', 'B', 'C', 'D'].includes(props.modelValue.correctAnswer) ? props.modelValue.correctAnswer : 'A'
    })
    return
  }

  emit('update:modelValue', {
    ...props.modelValue,
    questionTypeCode,
    options: undefined,
    correctAnswer: ['TRUE', 'FALSE', 'NOT GIVEN'].includes(props.modelValue.correctAnswer)
      ? props.modelValue.correctAnswer
      : 'TRUE'
  })
}

function updateOption(index: number, value: string) {
  const defaults = [
    { label: 'A', content: '' },
    { label: 'B', content: '' },
    { label: 'C', content: '' },
    { label: 'D', content: '' }
  ]
  const options = [...(props.modelValue.options || defaults)]
  const fallback = { label: String.fromCharCode(65 + index), content: '' }
  const base = options[index] || defaults[index] || fallback
  options[index] = { label: base.label, content: value }
  updateField('options', options)
}
</script>

<template>
  <div class="p-4 rounded-xl border border-border bg-surface-muted/60 space-y-3">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-text-secondary">题目 {{ index + 1 }}</p>
      <BaseButton variant="danger" size="sm" :disabled="!canRemove" @click="emit('remove')">删除</BaseButton>
    </div>

    <BaseSelect
      label="题型"
      :model-value="modelValue.questionTypeCode"
      @update:model-value="onTypeChange"
    >
      <option value="single_choice">single_choice</option>
      <option value="judgment">judgment</option>
    </BaseSelect>

    <BaseTextarea
      :model-value="modelValue.stem"
      label="题干"
      :rows="3"
      min-height-class="min-h-[88px]"
      @update:model-value="(value) => updateField('stem', value)"
    />

    <div v-if="modelValue.questionTypeCode === 'single_choice'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <BaseInput
        v-for="(option, i) in (modelValue.options || [])"
        :key="i"
        :model-value="option.content"
        :label="`选项 ${option.label}`"
        @update:model-value="(value) => updateOption(i, value)"
      />
    </div>

    <div v-if="modelValue.questionTypeCode === 'single_choice'">
      <label class="block text-sm font-medium text-text-secondary mb-2">标准答案</label>
      <div class="grid grid-cols-4 gap-2">
        <BaseButton
          v-for="choice in ['A', 'B', 'C', 'D']"
          :key="choice"
          type="button"
          size="sm"
          :variant="modelValue.correctAnswer === choice ? 'primary' : 'secondary'"
          @click="updateField('correctAnswer', choice)"
        >
          {{ choice }}
        </BaseButton>
      </div>
    </div>

    <div v-else>
      <label class="block text-sm font-medium text-text-secondary mb-2">标准答案</label>
      <div class="grid grid-cols-3 gap-2">
        <BaseButton
          v-for="choice in ['TRUE', 'FALSE', 'NOT GIVEN']"
          :key="choice"
          type="button"
          size="sm"
          :variant="modelValue.correctAnswer === choice ? 'primary' : 'secondary'"
          @click="updateField('correctAnswer', choice)"
        >
          {{ choice }}
        </BaseButton>
      </div>
    </div>

    <BaseTextarea
      :model-value="modelValue.analysis || ''"
      label="解析（可选）"
      :rows="3"
      min-height-class="min-h-[72px]"
      @update:model-value="(value) => updateField('analysis', value)"
    />

    <div class="grid grid-cols-2 gap-3">
      <BaseInput
        :model-value="String(modelValue.answerParagraphNumber)"
        label="答案段落号"
        @update:model-value="(value) => updateField('answerParagraphNumber', Number(value) || 1)"
      />
      <BaseInput
        :model-value="String(modelValue.answerSentenceIndex)"
        label="答案句子索引"
        @update:model-value="(value) => updateField('answerSentenceIndex', Number(value) || 0)"
      />
    </div>
  </div>
</template>
