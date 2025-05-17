<template>
	<view class="emergency-page">
		<!-- 顶部banner -->
		<view class="emergency-banner">
			<image src="/static/images/emergency-banner.png" mode="aspectFill" class="banner-image"></image>
			<view class="banner-content">
				<text class="banner-title">紧急呼救</text>
				<text class="banner-subtitle">一键联系校园紧急救援</text>
			</view>
		</view>
		
		<!-- 用户位置信息 -->
		<view class="location-card">
			<view class="location-title">
				<image src="/static/images/location-pin.png" mode="aspectFit" class="location-icon"></image>
				<text>您的当前位置</text>
			</view>
			<view class="location-info" v-if="userLocation.address">
				<text class="location-address">{{userLocation.address}}</text>
				<text class="location-coordinates">GPS: {{userLocation.latitude}}, {{userLocation.longitude}}</text>
			</view>
			<view class="location-info" v-else>
				<text class="location-loading">正在获取位置信息...</text>
			</view>
			<button class="refresh-button" @tap="refreshLocation">刷新位置</button>
		</view>
		
		<!-- 紧急联系方式 -->
		<view class="emergency-contacts">
			<view class="section-title">紧急联系</view>
			
			<!-- 一键呼叫按钮 -->
			<view class="one-click-call" @tap="makeEmergencyCall">
				<image src="/static/images/emergency-call.png" mode="aspectFit" class="call-icon"></image>
				<text class="call-text">一键紧急呼叫</text>
			</view>
			
			<!-- 联系人列表 -->
			<view class="contacts-list">
				<view class="contact-item" v-for="(contact, index) in emergencyContacts" :key="index" @tap="callContact(contact)">
					<view class="contact-info">
						<text class="contact-name">{{contact.name}}</text>
						<text class="contact-title">{{contact.title}}</text>
						<text class="contact-phone">{{contact.phone}}</text>
					</view>
					<view class="contact-call">
						<image src="/static/images/phone.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 快速发送求助信息 -->
		<view class="send-help-request">
			<view class="section-title">发送求助信息</view>
			<view class="help-options">
				<view class="help-option" v-for="(option, index) in helpOptions" :key="index" @tap="sendHelpRequest(option)">
					<image :src="option.icon" mode="aspectFit" class="option-icon"></image>
					<text class="option-text">{{option.text}}</text>
				</view>
			</view>
		</view>
		
		<!-- 紧急小贴士 -->
		<view class="emergency-tips">
			<view class="section-title">紧急小贴士</view>
			<view class="tips-content">
				<view class="tip-item" v-for="(tip, index) in emergencyTips" :key="index">
					<text class="tip-number">{{index + 1}}</text>
					<text class="tip-text">{{tip}}</text>
				</view>
			</view>
		</view>
		
		<!-- 呼叫中弹窗 -->
		<view class="modal calling-modal" v-if="showCallingModal">
			<view class="modal-content">
				<image src="/static/images/calling.gif" mode="aspectFit" class="calling-animation"></image>
				<text class="calling-text">正在呼叫...</text>
				<text class="calling-name">{{currentCalling.name}}</text>
				<text class="calling-info">已自动发送您的位置信息</text>
				<button class="cancel-call" @tap="cancelCall">取消</button>
			</view>
		</view>
		
		<!-- 呼叫成功弹窗 -->
		<view class="modal success-modal" v-if="showSuccessModal">
			<view class="modal-content">
				<image src="/static/images/call-success.png" mode="aspectFit" class="success-icon"></image>
				<text class="success-text">求助信息已发送</text>
				<text class="success-info">救援人员正在赶来，请保持电话畅通</text>
				<button class="confirm-button" @tap="confirmSuccess">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 用户位置信息
			userLocation: {
				latitude: '',
				longitude: '',
				address: ''
			},
			
			// 紧急联系人
			emergencyContacts: [
				{
					name: '校园安保中心',
					title: '24小时值班',
					phone: '0123-4567890'
				},
				{
					name: '校医院急诊',
					title: '医疗紧急救助',
					phone: '0123-4567891'
				},
				{
					name: '学生处值班室',
					title: '学生紧急事务',
					phone: '0123-4567892'
				},
				{
					name: '心理危机干预',
					title: '24小时心理援助',
					phone: '0123-4567893'
				}
			],
			
			// 求助选项
			helpOptions: [
				{
					text: '安全求助',
					icon: '/static/images/security-help.png',
					type: 'security'
				},
				{
					text: '医疗急救',
					icon: '/static/images/medical-help.png',
					type: 'medical'
				},
				{
					text: '火灾报警',
					icon: '/static/images/fire-help.png',
					type: 'fire'
				},
				{
					text: '设施故障',
					icon: '/static/images/facility-help.png',
					type: 'facility'
				}
			],
			
			// 紧急小贴士
			emergencyTips: [
				'保持冷静，清晰描述您的位置和需要的帮助',
				'如在室内，请尽量靠近门口或开阔区域',
				'寻找安全区域，远离危险源',
				'打开手机定位功能，便于救援人员快速找到您',
				'如有伤病，请尽量不要移动，等待专业人员救援'
			],
			
			// 弹窗控制
			showCallingModal: false,
			showSuccessModal: false,
			currentCalling: {}
		}
	},
	onLoad() {
		// 页面加载时获取位置
		this.getUserLocation();
	},
	methods: {
		// 获取用户位置
		getUserLocation() {
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					this.userLocation.latitude = res.latitude.toFixed(6);
					this.userLocation.longitude = res.longitude.toFixed(6);
					
					// 逆地理编码获取地址
					this.getAddress(res.latitude, res.longitude);
				},
				fail: () => {
					uni.showToast({
						title: '获取位置失败，请检查位置权限',
						icon: 'none'
					});
				}
			});
		},
		
		// 获取地址信息
		getAddress(latitude, longitude) {
			// 这里应该调用地图API进行逆地理编码
			// 示例中使用模拟数据
			setTimeout(() => {
				this.userLocation.address = '某某大学某某楼3层305教室附近';
			}, 500);
		},
		
		// 刷新位置
		refreshLocation() {
			this.userLocation.address = '';
			this.getUserLocation();
			
			uni.showToast({
				title: '位置已更新',
				icon: 'success'
			});
		},
		
		// 一键紧急呼叫
		makeEmergencyCall() {
			// 调用校园安保中心
			this.callContact(this.emergencyContacts[0]);
		},
		
		// 呼叫特定联系人
		callContact(contact) {
			// 显示呼叫中弹窗
			this.currentCalling = contact;
			this.showCallingModal = true;
			
			// 发送位置信息
			this.sendLocationInfo(contact);
			
			// 模拟呼叫过程
			setTimeout(() => {
				// 实际应用中这里应该使用uni.makePhoneCall
				// uni.makePhoneCall({
				//     phoneNumber: contact.phone
				// });
				
				this.showCallingModal = false;
				this.showSuccessModal = true;
			}, 2000);
		},
		
		// 发送位置信息
		sendLocationInfo(contact) {
			console.log(`向${contact.name}发送位置信息: ${this.userLocation.address}`);
			// 实际应用中这里应该调用API发送位置信息
		},
		
		// 取消呼叫
		cancelCall() {
			this.showCallingModal = false;
			
			uni.showToast({
				title: '已取消呼叫',
				icon: 'none'
			});
		},
		
		// 确认求助成功
		confirmSuccess() {
			this.showSuccessModal = false;
		},
		
		// 发送特定类型的求助
		sendHelpRequest(option) {
			uni.showModal({
				title: '发送求助',
				content: `确认发送"${option.text}"求助信息？救援人员将会根据您的位置信息尽快赶到。`,
				success: (res) => {
					if (res.confirm) {
						// 发送求助信息
						console.log(`发送${option.text}求助信息`);
						
						// 显示成功提示
						this.showSuccessModal = true;
					}
				}
			});
		}
	}
}
</script>

<style>
.emergency-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 顶部banner样式 */
.emergency-banner {
	position: relative;
	height: 300rpx;
	background: linear-gradient(to right, #FF3B30, #FF9500);
	overflow: hidden;
}

.banner-image {
	width: 100%;
	height: 100%;
	opacity: 0.3;
}

.banner-content {
	position: absolute;
	left: 40rpx;
	bottom: 40rpx;
	color: #FFFFFF;
	z-index: 1;
}

.banner-title {
	font-size: 48rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
	text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
}

.banner-subtitle {
	font-size: 28rpx;
	display: block;
	text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
}

/* 位置卡片样式 */
.location-card {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	margin: 20rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}

.location-title {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.location-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 10rpx;
}

.location-info {
	padding: 15rpx 0;
}

.location-address {
	font-size: 32rpx;
	color: #333;
	margin-bottom: 10rpx;
	display: block;
}

.location-coordinates {
	font-size: 24rpx;
	color: #999;
	display: block;
}

.location-loading {
	font-size: 28rpx;
	color: #999;
}

.refresh-button {
	margin-top: 15rpx;
	font-size: 24rpx;
	background-color: #f5f5f5;
	color: #666;
	padding: 8rpx 20rpx;
	border-radius: 30rpx;
}

/* 紧急联系方式样式 */
.emergency-contacts {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	margin: 20rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	padding-left: 10rpx;
	border-left: 4rpx solid #FF3B30;
}

/* 一键呼叫样式 */
.one-click-call {
	background-color: #FF3B30;
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 8rpx rgba(255, 59, 48, 0.3);
}

.call-icon {
	width: 60rpx;
	height: 60rpx;
	margin-right: 20rpx;
}

.call-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
}

/* 联系人列表样式 */
.contacts-list {
	display: flex;
	flex-direction: column;
}

.contact-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.contact-item:last-child {
	border-bottom: none;
}

.contact-info {
	flex: 1;
}

.contact-name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 6rpx;
	display: block;
}

.contact-title {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 6rpx;
	display: block;
}

.contact-phone {
	font-size: 24rpx;
	color: #999;
}

.contact-call {
	background-color: #f5f5f5;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.contact-call image {
	width: 40rpx;
	height: 40rpx;
}

/* 发送求助信息样式 */
.send-help-request {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	margin: 20rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}

.help-options {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.help-option {
	width: 48%;
	background-color: #f9f9f9;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 15rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.05);
}

.option-icon {
	width: 60rpx;
	height: 60rpx;
	margin-right: 15rpx;
}

.option-text {
	font-size: 26rpx;
	color: #333;
}

/* 紧急小贴士样式 */
.emergency-tips {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	margin: 20rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.1);
}

.tips-content {
	padding: 10rpx;
}

.tip-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 15rpx;
}

.tip-number {
	background-color: #FF9500;
	color: #FFFFFF;
	font-size: 24rpx;
	width: 40rpx;
	height: 40rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 15rpx;
	flex-shrink: 0;
}

.tip-text {
	font-size: 26rpx;
	color: #333;
	line-height: 1.5;
}

/* 弹窗样式 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0,0.6);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	width: 80%;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

/* 呼叫中弹窗样式 */
.calling-animation {
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 30rpx;
}

.calling-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.calling-name {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
}

.calling-info {
	font-size: 26rpx;
	color: #999;
	margin-bottom: 30rpx;
}

.cancel-call {
	background-color: #f5f5f5;
	color: #666;
	font-size: 28rpx;
	padding: 15rpx 40rpx;
	border-radius: 40rpx;
}

/* 呼叫成功弹窗样式 */
.success-icon {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 20rpx;
}

.success-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.success-info {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 30rpx;
	text-align: center;
}

.confirm-button {
	background-color: #FF3B30;
	color: #FFFFFF;
	font-size: 28rpx;
	padding: 15rpx 60rpx;
	border-radius: 40rpx;
}
</style> 