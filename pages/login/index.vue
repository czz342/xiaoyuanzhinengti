<template>
	<view class="login-page">
		<view class="login-container">
			<!-- 页面标题 -->
			<view class="page-header">
				<text class="page-title">校园生活管理系统</text>
				<text class="page-subtitle">欢迎回来，请登录您的账户</text>
			</view>
			
			<!-- 登录表单 -->
			<view class="login-form">
				<view class="form-item">
					<view class="input-wrapper">
						<image src="/static/images/user-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="loginForm.username" 
							type="text" 
							placeholder="请输入用户名" 
							class="form-input"
							@input="clearError"
						/>
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper">
						<image src="/static/images/password-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="loginForm.password" 
							:type="showPassword ? 'text' : 'password'" 
							placeholder="请输入密码" 
							class="form-input"
							@input="clearError"
							:key="showPassword"
						/>
						<view class="password-toggle" @tap="togglePassword">
							<text class="eye-text">{{ showPassword ? '🙈' : '👀' }}</text>
						</view>
					</view>
				</view>
				
				<!-- 错误提示 -->
				<view v-if="errorMessage" class="error-message">
					<text>{{ errorMessage }}</text>
				</view>
				
				<!-- 登录按钮 -->
				<button 
					@tap="handleLogin" 
					:disabled="isLoading" 
					:class="['login-btn', { 'loading': isLoading }]"
				>
					<text v-if="!isLoading">登录</text>
					<text v-else>登录中...</text>
				</button>
				
				<view class="form-options">
					<text class="forgot-password-link" @tap="goToForgotPassword">忘记密码？</text>
				</view>
				
				<!-- 其他选项 -->
				<view class="form-options">
					<text class="register-link" @tap="goToRegister">还没有账户？立即注册</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loginForm: {
				username: '',
				password: ''
			},
			showPassword: false,
			isLoading: false,
			errorMessage: ''
		}
	},
	methods: {
		// 切换密码显示/隐藏
		togglePassword() {
			console.log('切换密码显示状态:', this.showPassword);
			this.showPassword = !this.showPassword;
			console.log('新的密码显示状态:', this.showPassword);
			
			// 强制更新视图
			this.$forceUpdate();
		},
		
		// 清除错误信息
		clearError() {
			this.errorMessage = '';
		},
		
		// 表单验证
		validateForm() {
			if (!this.loginForm.username.trim()) {
				this.errorMessage = '请输入用户名';
				return false;
			}
			if (!this.loginForm.password.trim()) {
				this.errorMessage = '请输入密码';
				return false;
			}
			return true;
		},
		
		// 处理登录
		async handleLogin() {
			if (!this.validateForm()) {
				return;
			}
			
			this.isLoading = true;
			this.errorMessage = '';
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/auth/login',
					method: 'POST',
					data: {
						username: this.loginForm.username,
						password: this.loginForm.password
					}
				});
				
				if (response.data.success) {
					// 保存用户信息和token
					const userData = response.data.data;
					uni.setStorageSync('userInfo', userData.user);
					uni.setStorageSync('token', userData.token);
					uni.setStorageSync('isLoggedIn', true);
					
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					});
					
					// 延迟跳转，让用户看到成功提示
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/personal/index'
						});
					}, 1500);
				} else {
					this.errorMessage = response.data.message || '登录失败';
				}
			} catch (error) {
				console.error('登录错误:', error);
				this.errorMessage = '网络错误，请稍后重试';
			} finally {
				this.isLoading = false;
			}
		},
		
		// 跳转到注册页面
		goToRegister() {
			uni.navigateTo({
				url: '/pages/register/index'
			});
		},
		
		// 跳转到忘记密码页面
		goToForgotPassword() {
			uni.navigateTo({
				url: '/pages/forgot-password/index'
			});
		}
	}
}
</script>

<style scoped>
.login-page {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
}

.login-container {
	width: 100%;
	max-width: 600rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
}

.page-header {
	text-align: center;
	margin-bottom: 60rpx;
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.page-subtitle {
	font-size: 28rpx;
	color: #666;
	display: block;
}

.login-form {
	width: 100%;
}

.form-item {
	margin-bottom: 40rpx;
}

.input-wrapper {
	display: flex;
	align-items: center;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx 24rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s ease;
}

.input-wrapper:focus-within {
	border-color: #667eea;
	background: #FFFFFF;
}

.password-toggle {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	background: rgba(102, 126, 234, 0.1);
	border: 2rpx solid rgba(102, 126, 234, 0.3);
	border-radius: 12rpx;
	margin-left: 15rpx;
	transition: all 0.3s ease;
}

.password-toggle:active {
	background: rgba(102, 126, 234, 0.2);
	border-color: rgba(102, 126, 234, 0.5);
	transform: scale(0.95);
}

.eye-text {
	font-size: 32rpx;
	color: #666;
	user-select: none;
}

.input-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 20rpx;
}

.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	background: transparent;
}

.form-input::placeholder {
	color: #999;
}

.error-message {
	background: #ffe6e6;
	color: #d63031;
	padding: 20rpx;
	border-radius: 8rpx;
	margin-bottom: 30rpx;
	font-size: 24rpx;
	text-align: center;
}

.login-btn {
	width: 100%;
	height: 90rpx;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #FFFFFF;
	border: none;
	border-radius: 45rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 40rpx;
	transition: all 0.3s ease;
}

.login-btn:disabled {
	opacity: 0.7;
}

.login-btn.loading {
	background: #ccc;
}

.form-options {
	text-align: center;
}

.register-link {
	color: #667eea;
	font-size: 28rpx;
	text-decoration: underline;
}

.forgot-password-link {
	color: #667eea;
	font-size: 28rpx;
	text-decoration: underline;
	margin-bottom: 20rpx;
	display: block;
}
</style>
