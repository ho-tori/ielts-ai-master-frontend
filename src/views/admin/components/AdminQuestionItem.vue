<script setup lang="ts">
import type { Question } from '@/types/article'
import { BaseButton, BaseInput, BaseSelect, BaseTextarea } from '@/components'

type QuestionType = 'TRUE_FALSE_NOT_GIVEN' | 'MULTIPLE_CHOICE'

const props = defineProps<{
  modelValue: Question
  index: number
  canRemove: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Question): void
  (e: 'remove'): void
}>()

function updateField<K extends keyof Question>(key: K, value: Question[K]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

function onTypeChange(value: string) {
  const nextType = value as QuestionType
  if (nextType === 'MULTIPLE_CHOICE') {
    emit('update:modelValue', {
      ...props.modelValue,
      type: nextType,
      options: props.modelValue.options && props.modelValue.options.length > 0 ? props.modelValue.options : ['', '', '', ''],
      answer: props.modelValue.answer || 'A'
    })
    return
  }

  emit('update:modelValue', {
    ...props.modelValue,
    type: nextType,
    options: undefined,
    answer: props.modelValue.answer || 'TRUE'
  })
}

function updateOption(index: number, value: string) {
  const options = [...(props.modelValue.options || ['', '', '', ''])]
  options[index] = value
  updateField('options', options)
}

function selectChoiceAnswer(value: string) {
  updateField('answer', value)
}
</script>

<template>
  <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-slate-700">题目 {{ index + 1 }}</p>
      <BaseButton variant="danger" size="sm" :disabled="!canRemove" @click="emit('remove')">删除</BaseButton>
    </div>

    <BaseSelect
      label="题型"
      :model-value="modelValue.type"
      @update:model-value="onTypeChange"
    >
      <option value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</option>
      <option value="TRUE_FALSE_NOT_GIVEN">TRUE_FALSE_NOT_GIVEN</option>
    </BaseSelect>

    <BaseTextarea
      :model-value="modelValue.questionText"
      label="题干"
      :rows="3"
      min-height-class="min-h-[88px]"
      @update:model-value="(value) => updateField('questionText', value)"
    />

    <div v-if="modelValue.type === 'MULTIPLE_CHOICE'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <BaseInput
        v-for="(option, i) in (modelValue.options || ['', '', '', ''])"
        :key="i"
        :model-value="option"
        :label="`选项 ${String.fromCharCode(65 + i)}`"
        @update:model-value="(value) => updateOption(i, value)"
      />
    </div>

    <div v-if="modelValue.type === 'MULTIPLE_CHOICE'">
      <label class="block text-sm font-medium text-slate-700 mb-2">标准答案</label>
      <div class="grid grid-cols-4 gap-2">
        <BaseButton
          v-for="choice in ['A', 'B', 'C', 'D']"
          :key="choice"
          type="button"
          size="sm"
          :variant="modelValue.answer === choice ? 'primary' : 'secondary'"
          @click="selectChoiceAnswer(choice)"
        >
          {{ choice }}
        </BaseButton>
      </div>
    </div>

    <div v-else>
      <label class="block text-sm font-medium text-slate-700 mb-2">标准答案</label>
      <div class="grid grid-cols-3 gap-2">
        <BaseButton
          v-for="choice in ['TRUE', 'FALSE', 'NOT GIVEN']"
          :key="choice"
          type="button"
          size="sm"
          :variant="modelValue.answer === choice ? 'primary' : 'secondary'"
          @click="selectChoiceAnswer(choice)"
        >
          {{ choice }}
        </BaseButton>
      </div>
    </div>

    <BaseTextarea
      :model-value="modelValue.explanation || ''"
      label="解析（可选）"
      :rows="3"
      min-height-class="min-h-[72px]"
      @update:model-value="(value) => updateField('explanation', value)"
    />
  </div>
</template>
