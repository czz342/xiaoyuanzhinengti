<template>
	<view class="forgot-password-page">
		<view class="forgot-password-container">
			<view class="header">
				<text class="title">忘记密码</text>
				<text class="subtitle">请输入您的邮箱地址，我们将发送重置链接</text>
			</view>
			
			<view class="form">
				<view class="input-wrapper" :class="{ 'error': fieldErrors.email }">
					<input 
						class="input" 
						type="text" 
						placeholder="请输入邮箱地址"
						v-model="form.email"
						@input="validateField('email')"
						@blur="validateField('email')"
					/>
					<view v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</view>
				</view>
				
				<button 
					class="submit-btn" 
					:disabled="isLoading || !isFormValid"
					@click="handleResetPassword"
				>
					<text v-if="isLoading">发送中...</text>
					<text v-else>发送重置链接</text>
				</button>
				
				<view class="actions">
					<text class="action-link" @click="goToLogin">返回登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				email: ''
			},
			fieldErrors: {
				email: ''
			},
			isLoading: false
		}
	},
	computed: {
		isFormValid() {
			return this.form.email.trim() && !this.fieldErrors.email;
		}
	},
	methods: {
		// 验证字段
		validateField(field) {
			this.clearFieldError(field);
			
			switch (field) {
				case 'email':
					if (!this.form.email.trim()) {
						this.fieldErrors.email = '请输入邮箱地址';
					} else if (!this.isValidEmail(this.form.email)) {
						this.fieldErrors.email = '请输入有效的邮箱地址';
					}
					break;
			}
		},
		
		// 清除字段错误
		clearFieldError(field) {
			this.fieldErrors[field] = '';
		},
		
		// 验证邮箱格式
		isValidEmail(email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		},
		
		// 处理重置密码
		async handleResetPassword() {
			if (!this.isFormValid) {
				return;
			}
			
			this.isLoading = true;
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/auth/forgot-password',
					method: 'POST',
					data: {
						email: this.form.email.trim()
					}
				});
				
				if (response.data.success) {
					uni.showToast({
						title: '重置链接已发送',
						icon: 'success'
					});
					
					// 延迟跳转到登录页面
					setTimeout(() => {
						this.goToLogin();
					}, 2000);
				} else {
					uni.showToast({
						title: response.data.message || '发送失败',
						icon: 'error'
					});
				}
			} catch (error) {
				console.error('重置密码错误:', error);
				uni.showToast({
					title: '网络错误，请稍后重试',
					icon: 'error'
				});
			} finally {
				this.isLoading = false;
			}
		},
		
		// 跳转到登录页面
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/index'
			});
		}
	}
}
</script>

<style scoped>
.forgot-password-page {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
}

.forgot-password-container {
	width: 100%;
	max-width: 600rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
}

.header {
	text-align: center;
	margin-bottom: 60rpx;
}

.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
}

.form {
	width: 100%;
}

.input-wrapper {
	margin-bottom: 40rpx;
}

.input-wrapper.error .input {
	border-color: #ff4757;
}

.input {
	width: 100%;
	height: 88rpx;
	border: 2rpx solid #e1e5e9;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 32rpx;
	background: #f8f9fa;
	transition: all 0.3s ease;
}

.input:focus {
	border-color: #667eea;
	background: #FFFFFF;
	box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
}

.field-error {
	color: #ff4757;
	font-size: 24rpx;
	margin-top: 12rpx;
	padding-left: 8rpx;
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #FFFFFF;
	border: none;
	border-radius: 12rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 40rpx;
	transition: all 0.3s ease;
}

.submit-btn:disabled {
	opacity: 0.6;
	background: #ccc;
}

.submit-btn:not(:disabled):active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}

.actions {
	text-align: center;
}

.action-link {
	color: #667eea;
	font-size: 28rpx;
	text-decoration: underline;
	cursor: pointer;
}

.action-link:active {
	opacity: 0.8;
}
</style>
