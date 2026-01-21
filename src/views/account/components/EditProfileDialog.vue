<template>
  <BaseDialog 
    :model-value="modelValue"
    title="编辑资料"
    confirm-text="保存"
    :confirm-disabled="!isFormValid"
    @update:model-value="$emit('update:modelValue', $event)"
    @confirm="handleSave"
  >
    <div class="space-y-4">
      <div>
        <BaseInput 
          v-model="formData.name" 
          type="text" 
          label="昵称"
          placeholder="请输入昵称"
          required
        />
        <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
      </div>
      
      <div>
        <BaseSelect 
          v-model="formData.target"
          label="备考目标"
          required
        >
          <option value="">选择目标分数</option>
          <option value="6.0">6.0</option>
          <option value="6.5">6.5</option>
          <option value="7.0">7.0</option>
          <option value="7.5">7.5</option>
          <option value="8.0">8.0+</option>
        </BaseSelect>
        <p v-if="errors.target" class="text-red-600 text-sm mt-1">{{ errors.target }}</p>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { BaseDialog, BaseInput, BaseSelect } from '@/components'
import type { EditProfilePayload } from '@/types/user'

interface Props {
  modelValue: boolean
  initialName?: string
  initialTarget?: string
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: EditProfilePayload): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  initialName: '',
  initialTarget: ''
})

const emit = defineEmits<Emits>()

const formData = reactive({
  name: props.initialName,
  target: props.initialTarget
})

const errors = reactive({
  name: '',
  target: ''
})

const isFormValid = computed(() => {
  return formData.name.trim() !== '' && formData.target !== ''
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    formData.name = props.initialName
    formData.target = props.initialTarget
    errors.name = ''
    errors.target = ''
  }
})

function validate() {
  errors.name = !formData.name.trim() ? '昵称不能为空' : ''
  errors.target = !formData.target ? '请选择备考目标' : ''
  return isFormValid.value
}

function handleSave() {
  if (!validate()) return
  
  emit('save', {
    name: formData.name.trim(),
    target: formData.target
  })
  emit('update:modelValue', false)
}
</script>

<style scoped>
</style>

<style scoped>
</style>
