<template>
	<view class="create-post-page">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="nav-left" @tap="goBack">
				<text class="nav-cancel">取消</text>
			</view>
			<text class="nav-title">发布帖子</text>
			<view class="nav-right" @tap="publishPost">
				<text class="nav-publish" :class="{ active: canPublish }">发布</text>
			</view>
		</view>
		
		<!-- 发布表单 -->
		<view class="form-container">
			<!-- 分类选择 -->
			<view class="form-section">
				<text class="section-label">选择分类</text>
				<view class="category-selector">
					<view 
						class="category-option" 
						v-for="category in categories" 
						:key="category.key"
						:class="{ active: selectedCategory === category.key }"
						@tap="selectCategory(category.key)"
					>
						<text class="category-text">{{ category.label }}</text>
					</view>
				</view>
			</view>
			
			<!-- 标题输入 -->
			<view class="form-section">
				<text class="section-label">标题</text>
				<input 
					class="title-input" 
					v-model="postTitle" 
					placeholder="请输入帖子标题..."
					maxlength="50"
					@input="onTitleInput"
				/>
				<text class="char-count">{{ postTitle.length }}/50</text>
			</view>
			
			<!-- 内容输入 -->
			<view class="form-section">
				<text class="section-label">内容</text>
				<textarea 
					class="content-textarea" 
					v-model="postContent" 
					placeholder="分享你的想法..."
					maxlength="1000"
					@input="onContentInput"
				></textarea>
				<text class="char-count">{{ postContent.length }}/1000</text>
			</view>
			
			<!-- 图片上传 -->
			<view class="form-section">
				<text class="section-label">添加图片 ({{ images.length }}/9)</text>
				<view class="image-upload-container">
					<view class="image-list">
						<view 
							class="image-item" 
							v-for="(image, index) in images" 
							:key="index"
						>
							<image :src="image" mode="aspectFill" class="uploaded-image"></image>
							<view class="image-delete" @tap="removeImage(index)">
								<image src="/static/images/close.png" mode="aspectFit"></image>
							</view>
						</view>
						
						<view 
							class="upload-btn" 
							v-if="images.length < 9"
							@tap="chooseImages"
						>
							<image src="/static/images/add-image.png" mode="aspectFit" class="upload-icon"></image>
							<text class="upload-text">添加图片</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 评论设置 -->
			<view class="form-section">
				<text class="section-label">评论设置</text>
				<view class="comment-setting">
					<view class="setting-item">
						<text class="setting-label">允许评论</text>
						<switch 
							:checked="allowComments" 
							@change="onCommentSettingChange"
							color="#007AFF"
						/>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 发布提示 -->
		<view class="publish-tips">
			<text class="tips-title">发布须知：</text>
			<text class="tips-item">• 请遵守社区规范，发布健康积极的内容</text>
			<text class="tips-item">• 禁止发布违法违规、虚假信息</text>
			<text class="tips-item">• 二手交易请确保信息真实有效</text>
		</view>
		
		<!-- 加载状态 -->
		<view class="loading-overlay" v-if="isPublishing">
			<view class="loading-content">
				<text class="loading-text">发布中...</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 分类选项
			categories: [
				{ key: 'second_hand', label: '二手市场' },
				{ key: 'dating', label: '恋爱交友' },
				{ key: 'help', label: '打听求助' },
				{ key: 'part_time', label: '发布兼职' },
				{ key: 'gossip', label: '校园八卦' }
			],
			selectedCategory: '',
			
			// 帖子内容
			postTitle: '',
			postContent: '',
			images: [],
			allowComments: true,
			
			// 状态
			isPublishing: false
		}
	},
	
	computed: {
		canPublish() {
			return this.selectedCategory && 
				   this.postTitle.trim() && 
				   this.postContent.trim() && 
				   !this.isPublishing;
		}
	},
	
	onLoad() {
		// 检查登录状态
		this.checkLoginStatus();
	},
	
	methods: {
		// 检查登录状态
		checkLoginStatus() {
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showModal({
					title: '提示',
					content: '请先登录后再发布帖子',
					showCancel: false,
					success: () => {
						uni.navigateBack();
					}
				});
			}
		},
		
		// 返回上一页
		goBack() {
			if (this.postTitle.trim() || this.postContent.trim() || this.images.length > 0) {
				uni.showModal({
					title: '提示',
					content: '确定要离开吗？未保存的内容将丢失',
					success: (res) => {
						if (res.confirm) {
							uni.navigateBack();
						}
					}
				});
			} else {
				uni.navigateBack();
			}
		},
		
		// 选择分类
		selectCategory(category) {
			this.selectedCategory = category;
		},
		
		// 标题输入
		onTitleInput(e) {
			this.postTitle = e.detail.value;
		},
		
		// 内容输入
		onContentInput(e) {
			this.postContent = e.detail.value;
		},
		
		// 选择图片
		chooseImages() {
			const remainingCount = 9 - this.images.length;
			
			uni.chooseImage({
				count: remainingCount,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					// 模拟图片上传
					this.uploadImages(res.tempFilePaths);
				},
				fail: (error) => {
					console.error('选择图片失败:', error);
					uni.showToast({
						title: '选择图片失败',
						icon: 'none'
					});
				}
			});
		},
		
		// 上传图片
		async uploadImages(filePaths) {
			uni.showLoading({
				title: '上传中...'
			});
			
			try {
				const uploadedUrls = [];
				
				for (const filePath of filePaths) {
					// 模拟上传过程
					await new Promise(resolve => setTimeout(resolve, 1000));
					
					// 这里应该调用真实的上传API
					// const uploadResult = await this.uploadToServer(filePath);
					// uploadedUrls.push(uploadResult.url);
					
					// 临时使用本地路径
					uploadedUrls.push(filePath);
				}
				
				this.images = [...this.images, ...uploadedUrls];
				
				uni.hideLoading();
				uni.showToast({
					title: '上传成功',
					icon: 'success'
				});
			} catch (error) {
				uni.hideLoading();
				console.error('上传图片失败:', error);
				uni.showToast({
					title: '上传失败',
					icon: 'none'
				});
			}
		},
		
		// 删除图片
		removeImage(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除这张图片吗？',
				success: (res) => {
					if (res.confirm) {
						this.images.splice(index, 1);
					}
				}
			});
		},
		
		// 评论设置改变
		onCommentSettingChange(e) {
			this.allowComments = e.detail.value;
		},
		
		// 发布帖子
		async publishPost() {
			if (!this.canPublish) {
				if (!this.selectedCategory) {
					uni.showToast({
						title: '请选择分类',
						icon: 'none'
					});
				} else if (!this.postTitle.trim()) {
					uni.showToast({
						title: '请输入标题',
						icon: 'none'
					});
				} else if (!this.postContent.trim()) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					});
				}
				return;
			}
			
			this.isPublishing = true;
			
			try {
				const token = uni.getStorageSync('token');
				const userInfo = uni.getStorageSync('userInfo');
				
				const postData = {
					title: this.postTitle.trim(),
					content: this.postContent.trim(),
					category: this.selectedCategory,
					images: this.images,
					allow_comments: this.allowComments,
					status: 'published'
				};
				
				const response = await uni.request({
					url: 'http://localhost:3000/api/community/posts',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: postData
				});
				
				console.log('发布帖子响应:', response);
				
				if (response.data && response.data.success) {
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} else {
					uni.showToast({
						title: response.data.message || '发布失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('发布帖子失败:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			} finally {
				this.isPublishing = false;
			}
		}
	}
}
</script>

<style scoped>
.create-post-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 导航栏 */
.navbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	padding-top: calc(16rpx + env(safe-area-inset-top));
	background-color: #fff;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.06);
	position: sticky;
	top: 0;
	z-index: 100;
}

.nav-left, .nav-right {
	width: 120rpx;
}

.nav-cancel {
	font-size: 32rpx;
	color: #666;
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.nav-publish {
	font-size: 32rpx;
	color: #ccc;
	text-align: right;
}

.nav-publish.active {
	color: #007AFF;
	font-weight: bold;
}

/* 表单容器 */
.form-container {
	padding: 30rpx;
}

/* 表单区块 */
.form-section {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
}

.section-label {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

/* 分类选择 */
.category-selector {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.category-option {
	padding: 20rpx 30rpx;
	border: 2rpx solid #eee;
	border-radius: 30rpx;
	background-color: #f7f8fa;
	transition: background-color 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}

.category-option.active {
	border-color: #007AFF;
	background: linear-gradient(135deg, #E6F3FF 0%, #D9EBFF 100%);
	box-shadow: 0 6rpx 16rpx rgba(0,122,255,0.12);
}

.category-text {
	font-size: 28rpx;
	color: #666;
}

.category-option.active .category-text {
	color: #007AFF;
	font-weight: bold;
}

.category-option:active {
	transform: scale(0.98);
	background-color: #f0f3f6;
}

/* 标题输入 */
.title-input {
	width: 100%;
	height: 80rpx;
	padding: 0 20rpx;
	border: 1rpx solid #e6e8eb;
	border-radius: 12rpx;
	font-size: 30rpx;
	background-color: #fafbfc;
	margin-bottom: 10rpx;
}

/* 内容输入 */
.content-textarea {
	width: 100%;
	min-height: 300rpx;
	padding: 20rpx;
	border: 1rpx solid #e6e8eb;
	border-radius: 12rpx;
	font-size: 28rpx;
	background-color: #fafbfc;
	margin-bottom: 10rpx;
	line-height: 1.6;
}

/* 字符计数 */
.char-count {
	font-size: 24rpx;
	color: #999;
	text-align: right;
	display: block;
}

/* 图片上传 */
.image-upload-container {
	margin-top: 20rpx;
}

.image-list {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.image-item {
	position: relative;
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.08);
}

.uploaded-image {
	width: 100%;
	height: 100%;
}

.image-delete {
	position: absolute;
	top: -10rpx;
	right: -10rpx;
	width: 40rpx;
	height: 40rpx;
	background-color: #FF3B30;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.image-delete image {
	width: 24rpx;
	height: 24rpx;
}

.upload-btn {
	width: 200rpx;
	height: 200rpx;
	border: 2rpx dashed #cfd6dd;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f7f8fa;
	transition: background-color 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}

.upload-icon {
	width: 60rpx;
	height: 60rpx;
	margin-bottom: 10rpx;
	opacity: 0.6;
}

.upload-text {
	font-size: 24rpx;
	color: #999;
}

.upload-btn:active {
	transform: scale(0.98);
	background-color: #f0f3f6;
	border-color: #a9b6c2;
}

/* 评论设置 */
.comment-setting {
	margin-top: 20rpx;
}

.setting-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.setting-label {
	font-size: 28rpx;
	color: #333;
}

/* 发布提示 */
.publish-tips {
	background-color: #fff;
	margin: 30rpx;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
}

.tips-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx;
	display: block;
}

.tips-item {
	font-size: 24rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 8rpx;
	display: block;
}

/* 加载遮罩 */
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.loading-content {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 40rpx 60rpx;
}

.loading-text {
	font-size: 30rpx;
	color: #333;
}
</style>