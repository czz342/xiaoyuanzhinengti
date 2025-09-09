<template>
  <div class="post-detail-page">
    <div class="page-header">
      <el-button @click="goBack" class="back-button">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2>帖子详情</h2>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="post" class="post-container">
      <!-- 帖子内容 -->
      <el-card class="post-card">
        <div class="post-header">
          <div class="author-info">
            <el-avatar :src="post.author_avatar" :size="50" />
            <div class="author-details">
              <div class="author-name">{{ post.author_name }}</div>
              <div class="post-meta">
                <span>{{ formatDate(post.created_at) }}</span>
                <el-tag :type="getCategoryType(post.category)" size="small">
                  {{ getCategoryText(post.category) }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="post-stats">
            <div class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ post.view_count }}</span>
            </div>
            <div class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ post.comment_count }}</span>
            </div>
            <div class="stat-item" @click="toggleLike">
              <el-icon :class="{ liked: post.is_liked }"><Star /></el-icon>
              <span>{{ post.like_count }}</span>
            </div>
          </div>
        </div>
        
        <div class="post-content">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="content-text" v-html="formatContent(post.content)"></div>
          <div v-if="post.images && post.images.length > 0" class="post-images">
            <el-image
              v-for="(image, index) in post.images"
              :key="index"
              :src="image"
              :preview-src-list="post.images"
              fit="cover"
              class="post-image"
            />
          </div>
        </div>
      </el-card>

      <!-- 评论区域 -->
      <el-card class="comments-card">
        <div class="comments-header">
          <h3>评论 ({{ comments.length }})</h3>
        </div>
        
        <!-- 发表评论 -->
        <div class="comment-form">
          <el-input
            v-model="newComment"
            type="textarea"
            placeholder="写下你的评论..."
            :rows="4"
            maxlength="500"
            show-word-limit
          />
          <div class="comment-actions">
            <el-button @click="clearComment">清空</el-button>
            <el-button type="primary" @click="submitComment" :loading="commentLoading">发表评论</el-button>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <el-avatar :src="comment.user_avatar" :size="40" />
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.user_name }}</span>
                <span class="comment-time">{{ formatDate(comment.created_at) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-actions">
                <el-button size="small" text @click="toggleLikeComment(comment)">
                  <el-icon :class="{ liked: comment.is_liked }"><Star /></el-icon>
                  {{ comment.like_count }}
                </el-button>
                <el-button size="small" text @click="replyToComment(comment)">回复</el-button>
                <el-button size="small" text type="danger" @click="deleteComment(comment)">删除</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多评论 -->
        <div v-if="hasMoreComments" class="load-more">
          <el-button @click="loadMoreComments" :loading="loadingComments">加载更多评论</el-button>
        </div>
      </el-card>
    </div>

    <div v-else class="error-container">
      <el-empty description="帖子不存在或已被删除" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, View, ChatDotRound, Star } from '@element-plus/icons-vue'
import { getPostDetail, getPostComments, createComment, deleteComment, toggleLike, type Post, type Comment } from '@/api/community'

const route = useRoute()
const router = useRouter()

// 数据状态
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(false)
const commentLoading = ref(false)
const loadingComments = ref(false)
const newComment = ref('')

// 分页
const commentPage = ref(1)
const commentLimit = 20
const hasMoreComments = ref(true)

// 获取分类类型
const getCategoryType = (category: string) => {
  switch (category) {
    case 'second_hand': return 'success'
    case 'dating': return 'warning'
    case 'help': return 'info'
    case 'part_time': return 'primary'
    case 'gossip': return 'danger'
    default: return 'info'
  }
}

// 获取分类文本
const getCategoryText = (category: string) => {
  switch (category) {
    case 'second_hand': return '二手市场'
    case 'dating': return '恋爱交友'
    case 'help': return '打听求助'
    case 'part_time': return '发布兼职'
    case 'gossip': return '校园八卦'
    default: return '其他'
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 格式化内容
const formatContent = (content: string) => {
  return content.replace(/\n/g, '<br>')
}

// 加载帖子详情
const loadPostDetail = async () => {
  const postId = route.params.id
  if (!postId) return

  loading.value = true
  try {
    const response = await getPostDetail(Number(postId))
    post.value = response.data
  } catch (error) {
    ElMessage.error('加载帖子详情失败')
  } finally {
    loading.value = false
  }
}

// 加载评论
const loadComments = async (page = 1) => {
  if (!post.value) return

  try {
    const response = await getPostComments(post.value.id, {
      page,
      limit: commentLimit
    })
    
    if (page === 1) {
      comments.value = response.data.comments
    } else {
      comments.value.push(...response.data.comments)
    }
    
    hasMoreComments.value = response.data.comments.length === commentLimit
  } catch (error) {
    ElMessage.error('加载评论失败')
  }
}

// 加载更多评论
const loadMoreComments = async () => {
  commentPage.value++
  loadingComments.value = true
  try {
    await loadComments(commentPage.value)
  } finally {
    loadingComments.value = false
  }
}

// 发表评论
const submitComment = async () => {
  if (!newComment.value.trim() || !post.value) return
  
  commentLoading.value = true
  try {
    await createComment(post.value.id, {
      content: newComment.value.trim()
    })
    ElMessage.success('评论发表成功')
    newComment.value = ''
    await loadComments(1)
    commentPage.value = 1
  } catch (error) {
    ElMessage.error('发表评论失败')
  } finally {
    commentLoading.value = false
  }
}

// 清空评论
const clearComment = () => {
  newComment.value = ''
}

// 点赞帖子
const toggleLike = async () => {
  if (!post.value) return
  
  try {
    await toggleLike({
      target_type: 'post',
      target_id: post.value.id
    })
    post.value.is_liked = !post.value.is_liked
    post.value.like_count += post.value.is_liked ? 1 : -1
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 点赞评论
const toggleLikeComment = async (comment: Comment) => {
  try {
    await toggleLike({
      target_type: 'comment',
      target_id: comment.id
    })
    comment.is_liked = !comment.is_liked
    comment.like_count += comment.is_liked ? 1 : -1
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 回复评论
const replyToComment = (comment: Comment) => {
  ElMessage.info('回复功能待实现')
}

// 删除评论
const deleteComment = async (comment: Comment) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '确认删除', {
      type: 'warning'
    })
    await deleteComment(comment.id)
    ElMessage.success('删除成功')
    await loadComments(1)
    commentPage.value = 1
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  await loadPostDetail()
  if (post.value) {
    await loadComments()
  }
})
</script>

<style scoped>
.post-detail-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.loading-container {
  padding: 20px;
}

.post-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  overflow: hidden;
  position: relative;
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  position: relative;
  z-index: 1;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.author-name {
  font-weight: 600;
  font-size: 18px;
  color: white;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  opacity: 0.9;
}

.post-stats {
  display: flex;
  gap: 30px;
  font-size: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.stat-item .el-icon.liked {
  color: #ffd700;
}

.post-content {
  padding: 0 30px 30px;
  position: relative;
  z-index: 1;
}

.post-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: white;
  line-height: 1.3;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: white;
  margin-bottom: 20px;
  opacity: 0.95;
}

.post-images {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.post-image {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.post-image:hover {
  transform: scale(1.05);
}

.comments-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.comments-header {
  padding: 20px 30px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.comments-header h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
}

.comment-form {
  padding: 0 30px 20px;
  background: #f8f9fa;
  margin: 0 30px 20px;
  border-radius: 12px;
  padding: 20px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.comments-list {
  padding: 0 30px;
  max-height: 600px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.comment-time {
  font-size: 12px;
  color: #666;
}

.comment-text {
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
  font-size: 15px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-actions .el-icon.liked {
  color: #ffd700;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-detail-page {
    padding: 10px;
  }
  
  .post-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .post-stats {
    gap: 20px;
  }
  
  .post-content {
    padding: 0 20px 20px;
  }
  
  .post-title {
    font-size: 24px;
  }
  
  .comment-form {
    margin: 0 20px 20px;
  }
  
  .comments-list {
    padding: 0 20px;
  }
}
</style>

