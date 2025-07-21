<template>
	<view class="create-post-container">
		<view class="editor-wrapper">
			<textarea
				class="post-textarea"
				v-model="postContent"
				placeholder="在这里写下你的想法，分享你的感受，或提出你的困惑... 你的声音很重要。"
				:maxlength="500"
				auto-focus
				cursor-spacing="100"
			></textarea>
			<view class="char-counter">
				{{ postContent.length }}/500
			</view>
		</view>

		<view class="bottom-bar">
			<button class="publish-button" :disabled="!isSubmittable" @click="publishPost">
				发布
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				postContent: ''
			};
		},
		computed: {
			isSubmittable() {
				return this.postContent.trim().length > 0;
			}
		},
		methods: {
			publishPost() {
				if (!this.isSubmittable) return;

				// 模拟发布成功
				uni.showToast({
					title: '发布成功',
					icon: 'success',
					duration: 1500
				});
				
				// 在真实应用中，这里会调用 API 将 postContent 发送到服务器
				// 模拟数据更新，可以利用 event bus 或者 vuex
				// 这里为了简单，我们直接返回上一页
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}
		}
	};
</script>

<style scoped>
	.create-post-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #ffffff;
	}

	.editor-wrapper {
		flex: 1;
		padding: 40rpx;
		position: relative;
	}

	.post-textarea {
		width: 100%;
		height: 100%;
		font-size: 30rpx;
		line-height: 1.7;
		color: #303133;
		padding-bottom: 60rpx; /* 为计数器留出空间 */
		box-sizing: border-box;
	}

	.char-counter {
		position: absolute;
		bottom: 40rpx;
		right: 40rpx;
		font-size: 26rpx;
		color: #c0c4cc;
	}

	.bottom-bar {
		padding: 20rpx 40rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		background-color: #fff;
		border-top: 1rpx solid #f2f2f2;
	}

	.publish-button {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: #82c4b8;
		border-radius: 45rpx;
	}

	.publish-button[disabled] {
		background-color: #c8c9cc;
		color: #ffffff;
	}
</style> 