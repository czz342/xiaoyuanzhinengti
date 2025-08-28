<template>
	<view class="register-page">
		<view class="register-container">
			<!-- 页面标题 -->
			<view class="page-header">
				<text class="page-title">用户注册</text>
				<text class="page-subtitle">创建您的校园生活账户</text>
			</view>
			
			<!-- 注册表单 -->
			<view class="register-form">
				<view class="form-item">
					<view class="input-wrapper" :class="{ 'error': fieldErrors.username }">
						<image src="/static/images/user-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="registerForm.username" 
							type="text" 
							placeholder="请输入用户名" 
							class="form-input"
							@input="validateField('username')"
							@blur="validateField('username')"
						/>
					</view>
					<view v-if="fieldErrors.username" class="field-error">
						<text>{{ fieldErrors.username }}</text>
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper" :class="{ 'error': fieldErrors.email }">
						<image src="/static/images/email-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="registerForm.email" 
							type="email" 
							placeholder="请输入邮箱" 
							class="form-input"
							@input="validateField('email')"
							@blur="validateField('email')"
						/>
					</view>
					<view v-if="fieldErrors.email" class="field-error">
						<text>{{ fieldErrors.email }}</text>
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper" :class="{ 'error': fieldErrors.password }">
						<image src="/static/images/password-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="registerForm.password" 
							:type="showPassword ? 'text' : 'password'" 
							placeholder="请输入密码（至少6位）" 
							class="form-input"
							@input="validateField('password')"
							@blur="validateField('password')"
							:key="showPassword"
						/>
						<view class="password-toggle" @tap="togglePassword">
							<text class="eye-text">{{ showPassword ? '🙈' : '👀' }}</text>
						</view>
					</view>
					<view v-if="fieldErrors.password" class="field-error">
						<text>{{ fieldErrors.password }}</text>
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper" :class="{ 'error': fieldErrors.confirmPassword }">
						<image src="/static/images/password-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="registerForm.confirmPassword" 
							:type="showConfirmPassword ? 'text' : 'password'" 
							placeholder="请确认密码" 
							class="form-input"
							@input="validateField('confirmPassword')"
							@blur="validateField('confirmPassword')"
							:key="showConfirmPassword"
						/>
						<view class="password-toggle" @tap="toggleConfirmPassword">
							<text class="eye-text">{{ showConfirmPassword ? '🙈' : '👀' }}</text>
						</view>
					</view>
					<view v-if="fieldErrors.confirmPassword" class="field-error">
						<text>{{ fieldErrors.confirmPassword }}</text>
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper" :class="{ 'error': fieldErrors.real_name }">
						<image src="/static/images/user-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="registerForm.real_name" 
							type="text" 
							placeholder="请输入真实姓名" 
							class="form-input"
							@input="validateField('real_name')"
							@blur="validateField('real_name')"
						/>
					</view>
					<view v-if="fieldErrors.real_name" class="field-error">
						<text>{{ fieldErrors.real_name }}</text>
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper" :class="{ 'error': fieldErrors.student_id }">
						<image src="/static/images/id-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="registerForm.student_id" 
							type="text" 
							placeholder="请输入学号" 
							class="form-input"
							@input="validateField('student_id')"
							@blur="validateField('student_id')"
						/>
					</view>
					<view v-if="fieldErrors.student_id" class="field-error">
						<text>{{ fieldErrors.student_id }}</text>
					</view>
				</view>
				
				<view class="form-item">
					<view class="input-wrapper" :class="{ 'error': fieldErrors.phone }">
						<image src="/static/images/phone-icon.png" mode="aspectFit" class="input-icon"></image>
						<input 
							v-model="registerForm.phone" 
							type="tel" 
							placeholder="请输入手机号" 
							class="form-input"
							@input="validateField('phone')"
							@blur="validateField('phone')"
						/>
					</view>
					<view v-if="fieldErrors.phone" class="field-error">
						<text>{{ fieldErrors.phone }}</text>
					</view>
				</view>
				
				<!-- 错误提示 -->
				<view v-if="errorMessage" class="error-message">
					<text>{{ errorMessage }}</text>
				</view>
				
				<!-- 注册按钮 -->
				<button 
					@tap="handleRegister" 
					:disabled="isLoading" 
					:class="['register-btn', { 'loading': isLoading }]"
				>
					<text v-if="!isLoading">立即注册</text>
					<text v-else>注册中...</text>
				</button>
				
				<!-- 其他选项 -->
				<view class="form-options">
					<text class="login-link" @tap="goToLogin">已有账户？立即登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			registerForm: {
				username: '',
				email: '',
				password: '',
				confirmPassword: '',
				real_name: '',
				student_id: '',
				phone: ''
			},
			fieldErrors: {
				username: '',
				email: '',
				password: '',
				confirmPassword: '',
				real_name: '',
				student_id: '',
				phone: ''
			},
			showPassword: false,
			showConfirmPassword: false,
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
		
		// 切换确认密码显示/隐藏
		toggleConfirmPassword() {
			console.log('切换确认密码显示状态:', this.showConfirmPassword);
			this.showConfirmPassword = !this.showConfirmPassword;
			console.log('新的确认密码显示状态:', this.showConfirmPassword);
			
			// 强制更新视图
			this.$forceUpdate();
		},
		
		// 清除错误信息
		clearError() {
			this.errorMessage = '';
		},
		
		// 清除字段错误
		clearFieldError(field) {
			this.fieldErrors[field] = '';
		},
		
		// 验证单个字段
		validateField(field) {
			const value = this.registerForm[field];
			let error = '';
			
			switch (field) {
				case 'username':
					if (!value.trim()) {
						error = '请输入用户名';
					} else if (value.length < 2) {
						error = '用户名至少2个字符';
					} else if (value.length > 20) {
						error = '用户名不能超过20个字符';
					}
					break;
					
				case 'email':
					if (!value.trim()) {
						error = '请输入邮箱';
					} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
						error = '请输入正确的邮箱格式';
					}
					break;
					
				case 'password':
					if (!value.trim()) {
						error = '请输入密码';
					} else if (value.length < 6) {
						error = '密码长度至少6位';
					} else if (value.length > 20) {
						error = '密码不能超过20位';
					}
					break;
					
				case 'confirmPassword':
					if (!value.trim()) {
						error = '请确认密码';
					} else if (value !== this.registerForm.password) {
						error = '两次输入的密码不一致';
					}
					break;
					
				case 'real_name':
					if (!value.trim()) {
						error = '请输入真实姓名';
					} else if (value.length < 2) {
						error = '姓名至少2个字符';
					} else if (value.length > 10) {
						error = '姓名不能超过10个字符';
					}
					break;
					
				case 'student_id':
					if (!value.trim()) {
						error = '请输入学号';
					} else if (!/^\d{8,12}$/.test(value)) {
						error = '请输入正确的学号格式（8-12位数字）';
					}
					break;
					
				case 'phone':
					if (!value.trim()) {
						error = '请输入手机号';
					} else if (!/^1[3-9]\d{9}$/.test(value)) {
						error = '请输入正确的手机号格式';
					}
					break;
			}
			
			this.fieldErrors[field] = error;
			return !error;
		},
		
		// 表单验证
		validateForm() {
			// 验证所有字段
			const fields = ['username', 'email', 'password', 'confirmPassword', 'real_name', 'student_id', 'phone'];
			let isValid = true;
			
			fields.forEach(field => {
				if (!this.validateField(field)) {
					isValid = false;
				}
			});
			
			return isValid;
		},
		
		// 处理注册
		async handleRegister() {
			if (!this.validateForm()) {
				return;
			}
			
			this.isLoading = true;
			this.errorMessage = '';
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/auth/register',
					method: 'POST',
					data: this.registerForm
				});
				
				if (response.data.success) {
					// 保存用户信息和token
					const userData = response.data.data;
					uni.setStorageSync('userInfo', userData.user);
					uni.setStorageSync('token', userData.token);
					uni.setStorageSync('isLoggedIn', true);
					
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					});
					
					// 延迟跳转，让用户看到成功提示
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/personal/index'
						});
					}, 1500);
				} else {
					this.errorMessage = response.data.message || '注册失败';
				}
			} catch (error) {
				console.error('注册错误:', error);
				this.errorMessage = '网络错误，请稍后重试';
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
.register-page {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
}

.register-container {
	width: 100%;
	max-width: 600rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
	max-height: 90vh;
	overflow-y: auto;
}

.page-header {
	text-align: center;
	margin-bottom: 40rpx;
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

.register-form {
	width: 100%;
}

.form-item {
	margin-bottom: 30rpx;
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

.input-wrapper.error {
	border-color: #d63031;
	background: #fff5f5;
}

.input-wrapper.error .input-icon {
	opacity: 0.7;
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

.field-error {
	color: #d63031;
	font-size: 24rpx;
	margin-top: 10rpx;
	margin-left: 24rpx;
	text-align: left;
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

.error-message {
	background: #ffe6e6;
	color: #d63031;
	padding: 20rpx;
	border-radius: 8rpx;
	margin-bottom: 30rpx;
	font-size: 24rpx;
	text-align: center;
}

.register-btn {
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

.register-btn:disabled {
	opacity: 0.7;
}

.register-btn.loading {
	background: #ccc;
}

.form-options {
	text-align: center;
}

.login-link {
	color: #667eea;
	font-size: 28rpx;
	text-decoration: underline;
}
</style>
