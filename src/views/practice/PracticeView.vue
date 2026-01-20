<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import BaseButton from '../../components/common/BaseButton.vue';
import BaseCard from '../../components/common/BaseCard.vue';

const router = useRouter();

// 搜索相关
const searchKeyword = ref('');
const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all');
const selectedCategory = ref<'all' | 'news' | 'academic' | 'fiction'>('all');

// 模拟习题数据
const mockExercises = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence',
    category: 'academic',
    difficulty: 'medium',
    wordCount: 450,
    estimatedTime: '12 min',
    description: '关于人工智能发展趋势的学术文章，涵盖机器学习、深度学习等内容',
    tags: ['AI', '科技', '机器学习']
  },
  {
    id: 2,
    title: 'Climate Change and Global Warming',
    category: 'academic',
    difficulty: 'hard',
    wordCount: 520,
    estimatedTime: '15 min',
    description: '深度讨论气候变化和全球变暖的科学证据和影响',
    tags: ['环境', '气候', '科学']
  },
  {
    id: 3,
    title: 'Breaking News: Major Discovery in Physics',
    category: 'news',
    difficulty: 'medium',
    wordCount: 380,
    estimatedTime: '10 min',
    description: '物理学领域的重要发现，涉及量子计算',
    tags: ['物理', '新闻', '科学发现']
  },
  {
    id: 4,
    title: 'The Lost City: A Mystery Novel',
    category: 'fiction',
    difficulty: 'easy',
    wordCount: 420,
    estimatedTime: '11 min',
    description: '冒险小说，讲述考古学家寻找失落古城的故事',
    tags: ['冒险', '小说', '考古']
  },
  {
    id: 5,
    title: 'Digital Revolution in Education',
    category: 'academic',
    difficulty: 'medium',
    wordCount: 480,
    estimatedTime: '13 min',
    description: '探讨数字技术如何改变现代教育',
    tags: ['教育', '技术', '数字化']
  },
  {
    id: 6,
    title: 'Sustainable Fashion Industry',
    category: 'news',
    difficulty: 'easy',
    wordCount: 320,
    estimatedTime: '9 min',
    description: '时尚业的可持续发展趋势',
    tags: ['环保', '时尚', '可持续']
  },
];

// 过滤习题
const filteredExercises = computed(() => {
  return mockExercises.filter(exercise => {
    // 按关键字搜索
    const matchKeyword = !searchKeyword.value || 
      exercise.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      exercise.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()));
    
    // 按难度过滤
    const matchDifficulty = selectedDifficulty.value === 'all' || 
      exercise.difficulty === selectedDifficulty.value;
    
    // 按分类过滤
    const matchCategory = selectedCategory.value === 'all' || 
      exercise.category === selectedCategory.value;
    
    return matchKeyword && matchDifficulty && matchCategory;
  });
});

// 难度标签样式
const getDifficultyClass = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'medium':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'hard':
      return 'bg-red-50 text-red-700 border border-red-200';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
};

// 分类标签
const getCategoryLabel = (category: string) => {
  switch(category) {
    case 'news':
      return '新闻';
    case 'academic':
      return '学术';
    case 'fiction':
      return '文学';
    default:
      return '其他';
  }
};

// 难度标签
const getDifficultyLabel = (difficulty: string) => {
  switch(difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return '未知';
  }
};

// 开始练习
const startPractice = (exerciseId: number) => {
  router.push(`/reading?exerciseId=${exerciseId}`);
};
</script>

<template>
  <div class="space-y-6">
    <!-- 主容器 -->
    <div class="space-y-6">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">练习中心</h1>
        <p class="text-slate-600">搜索并练习IELTS阅读考试题目</p>
      </div>

      <!-- 搜索和过滤区域 -->
      <BaseCard class="mb-8">
        <!-- 搜索框 -->
        <div class="mb-6">
          <div class="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
            <Icon icon="heroicons:magnifying-glass" class="text-xl text-slate-400" />
            <input 
              v-model="searchKeyword"
              type="text"
              placeholder="搜索关键字、标题或标签..."
              class="flex-1 bg-transparent outline-none text-slate-900 placeholder-slate-500"
            />
          </div>
        </div>

        <!-- 过滤选项 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 难度过滤 -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">难度</label>
            <div class="flex gap-2">
              <button 
                v-for="level in ['all', 'easy', 'medium', 'hard']"
                :key="level"
                @click="selectedDifficulty = level as any"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedDifficulty === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                ]"
              >
                {{ level === 'all' ? '全部' : level === 'easy' ? '简单' : level === 'medium' ? '中等' : '困难' }}
              </button>
            </div>
          </div>

          <!-- 分类过滤 -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">分类</label>
            <div class="flex gap-2">
              <button 
                v-for="cat in ['all', 'news', 'academic', 'fiction']"
                :key="cat"
                @click="selectedCategory = cat as any"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                ]"
              >
                {{ cat === 'all' ? '全部' : cat === 'news' ? '新闻' : cat === 'academic' ? '学术' : '文学' }}
              </button>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- 搜索结果统计 -->
      <div class="mb-6">
        <p class="text-slate-600">
          找到 <span class="font-semibold text-slate-900">{{ filteredExercises.length }}</span> 个相关习题
        </p>
      </div>

      <!-- 习题卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="exercise in filteredExercises"
          :key="exercise.id"
          class="group"
        >
          <BaseCard class="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer">
            <!-- 卡片头部 -->
            <div class="mb-4 pb-4 border-b border-slate-200">
              <h3 class="text-lg font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {{ exercise.title }}
              </h3>
              
              <!-- 难度和分类标签 -->
              <div class="flex gap-2 flex-wrap">
                <span :class="['inline-block px-3 py-1 rounded-full text-xs font-medium', getDifficultyClass(exercise.difficulty)]">
                  {{ getDifficultyLabel(exercise.difficulty) }}
                </span>
                <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {{ getCategoryLabel(exercise.category) }}
                </span>
              </div>
            </div>

            <!-- 卡片内容 -->
            <div class="flex-1 mb-4">
              <p class="text-sm text-slate-600 mb-4 line-clamp-3">
                {{ exercise.description }}
              </p>

              <!-- 标签 -->
              <div class="flex gap-2 flex-wrap mb-4">
                <span 
                  v-for="tag in exercise.tags"
                  :key="tag"
                  class="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- 统计信息 -->
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex items-center gap-2 text-slate-600">
                  <Icon icon="heroicons:document-text" class="text-lg" />
                  <span>{{ exercise.wordCount }} 词</span>
                </div>
                <div class="flex items-center gap-2 text-slate-600">
                  <Icon icon="heroicons:clock" class="text-lg" />
                  <span>{{ exercise.estimatedTime }}</span>
                </div>
              </div>
            </div>

            <!-- 底部按钮 -->
            <div class="pt-4 border-t border-slate-200">
              <BaseButton 
                @click="startPractice(exercise.id)"
                variant="primary" 
                class="w-full"
              >
                开始练习
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredExercises.length === 0" class="text-center py-12">
        <Icon icon="heroicons:inbox" class="text-5xl text-slate-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-slate-900 mb-2">未找到相关习题</h3>
        <p class="text-slate-600">请尝试调整搜索关键字或过滤条件</p>
      </div>
    </div>
  </div>
</template>

