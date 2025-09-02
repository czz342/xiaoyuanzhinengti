<template>
	<view class="psych-assessment-page">
		<!-- banner -->
		<view class="assessment-banner">
			<image class="banner-image" src="/static/images/psychology-banner.png" mode="aspectFill"></image>
			<view class="banner-content">
				<text class="banner-title">心理健康评估</text>
				<text class="banner-subtitle">关爱自己，从了解开始</text>
			</view>
		</view>
		
		<view class="assessment-container">
			<!-- Tabs -->
			<view class="tabs">
				<view 
					class="tab-item" 
					v-for="(tab, index) in tabs" 
					:key="index" 
					:class="{ active: currentTab === index }"
					@tap="switchTab(index)">
					<text>{{ tab }}</text>
				</view>
			</view>
			
			<!-- 心理健康评估 -->
			<view v-if="currentTab === 0">
				<view class="assessment-content">
					<!-- 问卷列表 -->
					<view v-if="assessmentStep === 'list'">
						<view class="questionnaire-list">
							<view class="questionnaire-card" v-for="q in questionnaireList" :key="q.id" @tap="startAssessment(q)">
								<image class="q-card-icon" :src="q.icon" mode="aspectFit"></image>
								<view class="q-card-info">
									<text class="q-card-title">{{ q.title }}</text>
									<text class="q-card-desc">{{ q.description }}</text>
				</view>
								<button class="start-btn">开始评估</button>
						</view>
							</view>
						</view>
					
					<!-- 答题界面 -->
					<view v-if="assessmentStep === 'answering'">
						<view class="question-list">
							<view class="question-item" v-for="(question, index) in currentQuestionnaire.questions" :key="index">
								<view class="question-title">{{ index + 1 }}. {{ question.text }}</view>
								<radio-group @change="handleRadioChange($event, index)">
									<label class="option-item" v-for="(option, oIndex) in question.options" :key="oIndex">
										<view class="option-text">
											<radio :value="String(oIndex)" :checked="question.selected === oIndex" />
											<text>{{ option.text }}</text>
						</view>
									</label>
								</radio-group>
					</view>
				</view>
						<button class="submit-button" @tap="submitAssessment" :disabled="!isAllQuestionsAnswered">提交问卷</button>
			</view>
			
					<!-- 报告结果 -->
					<view v-if="assessmentStep === 'report'">
						<view class="report-card">
							<view class="report-title">您的心理健康评估报告</view>
							<view class="report-item">
								<text class="report-label">评估结果：</text>
								<text class="report-value result-level">{{ assessmentReport.level }}</text>
				</view>
							<view class="report-item">
								<text class="report-label">总得分：</text>
								<text class="report-value">{{ assessmentReport.score }}</text>
				</view>
							<view class="report-item">
								<text class="report-label">评估建议：</text>
								<text class="report-value">{{ assessmentReport.suggestion }}</text>
						</view>
							<button class="retest-button" @tap="resetAssessment">重新评估</button>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 咨询预约 -->
			<view v-if="currentTab === 1">
				<view class="counseling-section">
				<view class="section-title">
					<text>咨询师预约</text>
				</view>
					<view v-if="isLoadingCounselors" class="loading-state">
						<uni-load-more status="loading"></uni-load-more>
					</view>
					<view v-else class="counselor-list">
					<view class="counselor-card" v-for="(counselor, index) in counselors" :key="index" @tap="showCounselorDetail(counselor)">
							<image class="counselor-avatar" :src="counselor.avatar" mode="aspectFill"></image>
						<view class="counselor-info">
							<view class="counselor-header">
									<text class="counselor-name">{{ counselor.name }}</text>
									<text class="counselor-title">{{ counselor.title }}</text>
							</view>
							<view class="counselor-specialties">
								<text class="specialty-label">专长：</text>
								<view class="specialty-tags">
										<text class="specialty-tag" v-for="(tag, tagIndex) in counselor.specialties" :key="tagIndex">{{ tag }}</text>
								</view>
							</view>
							<view class="counselor-rating">
								<view class="stars">
										<text class="star" v-for="n in 5" :key="n" :class="{ active: n <= counselor.rating }">★</text>
								</view>
									<text class="rating-value">{{ counselor.rating.toFixed(1) }}</text>
									<text class="rating-count">({{ counselor.ratingCount }})</text>
							</view>
						</view>
						<button class="book-btn">预约</button>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 我的记录 -->
			<view v-if="currentTab === 2">
				<view class="my-records-section">
					<uni-segmented-control
						:current="recordsTab"
						:values="['评估报告', '咨询预约']"
						@clickItem="onRecordsTabClick"
						style-type="button"
						active-color="#007AFF"
					></uni-segmented-control>
					
					<view class="records-content">
						<!-- 我的评估报告 -->
						<view v-if="recordsTab === 0">
							<view v-if="isLoadingReports" class="loading-state">
								<uni-load-more status="loading" contentText="报告加载中..."></uni-load-more>
							</view>
							<view v-else-if="myPsychReports.length === 0" class="empty-state">
								<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-image"></image>
								<text class="empty-text">您还没有评估报告</text>
								<button class="primary-btn" @tap="switchTab(0)">立即评估</button>
							</view>
							<view v-else class="report-list">
								<view class="my-report-card" v-for="report in myPsychReports" :key="report.id">
									<view class="my-report-header">
										<text class="my-report-title">{{ report.lb77_questionnairetitle }}</text>
										<text class="my-report-date">{{ formatDate(new Date(report.createtime), 'yyyy-MM-dd') }}</text>
									</view>
									<view class="my-report-body">
										<view class="my-report-item">
											<text class="my-report-label">评估结果</text>
											<text class="my-report-value result">{{ report.lb77_resultsummary }}</text>
										</view>
										<view class="my-report-item">
											<text class="my-report-label">总得分</text>
											<text class="my-report-value score">{{ report.lb77_totalscore }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						
						<!-- 我的咨询预约 -->
						<view v-if="recordsTab === 1">
							<view v-if="isLoadingAppointments" class="loading-state">
								<uni-load-more status="loading" contentText="预约加载中..."></uni-load-more>
							</view>
							<view v-else-if="myAppointments.length === 0" class="empty-state">
								<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-image"></image>
								<text class="empty-text">您还没有咨询预约</text>
								<button class="primary-btn" @tap="switchTab(1)">立即预约</button>
							</view>
							<view v-else class="appointment-list">
								<view class="appointment-card" v-for="apt in processedAppointments" :key="apt.id" @tap="showAppointmentDetail(apt)">
									<view class="apt-header">
										<text class="apt-counselor">{{ apt.lb77_counselor_name }}</text>
										<text class="apt-status" :class="apt.statusClass">{{ apt.lb77_appointment_status }}</text>
									</view>
									<view class="apt-body">
										<text class="apt-time">时间：{{ formatDate(new Date(apt.lb77_appointment_date), 'yyyy-MM-dd') }} {{ secondsToTime(apt.lb77_starttime) }}</text>
									</view>
									<view class="apt-footer" v-if="apt.lb77_appointment_status === '已预约'">
										<button class="cancel-btn" @tap.stop="confirmCancelAppointment(apt.id)">取消预约</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 咨询师详情弹窗 -->
		<view class="counselor-detail-popup" v-if="showCounselorDetailPopup">
			<view class="popup-mask" @tap="hideCounselorDetail"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">咨询师详情</text>
					<view class="popup-close" @tap="hideCounselorDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="popup-body">
					<view class="counselor-profile">
						<image :src="currentCounselor.avatar" mode="aspectFill" class="profile-avatar"></image>
						<view class="profile-basic">
							<text class="profile-name">{{currentCounselor.name}}</text>
							<text class="profile-title">{{currentCounselor.title}}</text>
							<view class="profile-rating">
								<view class="stars">
									<text class="star" v-for="n in 5" :key="n" :class="{active: n <= currentCounselor.rating}">★</text>
								</view>
								<text class="rating-value">{{currentCounselor.rating.toFixed(1)}}</text>
							</view>
						</view>
					</view>
					
					<view class="profile-detail">
						<view class="detail-item">
							<text class="detail-label">专业背景</text>
							<text class="detail-value">{{currentCounselor.background}}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">咨询专长</text>
							<view class="specialty-tags">
								<text class="specialty-tag" v-for="(tag, tagIndex) in currentCounselor.specialties" :key="tagIndex">{{tag}}</text>
							</view>
						</view>
						<view class="detail-item">
							<text class="detail-label">咨询风格</text>
							<text class="detail-value">{{currentCounselor.style}}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">可预约时段</text>
							<view class="time-slots">
								<view class="date-selector">
									<view class="dates">
										<view 
											class="date-item" 
											v-for="(date, dateIndex) in availableDates" 
											:key="dateIndex"
											:class="{active: selectedDateIndex === dateIndex}"
											@tap="selectDate(dateIndex)"
										>
											<text class="date-day">{{date.day}}</text>
											<text class="date-weekday">{{date.weekday}}</text>
										</view>
									</view>
								</view>
								
								<view v-if="isLoadingSchedule" class="loading-state">
									<uni-load-more status="loading" contentText="号源加载中..."></uni-load-more>
								</view>
								<view v-else-if="availableTimeSlots.length === 0" class="empty-slots">
									<text>暂无号源</text>
								</view>
								<view class="time-grid" v-else>
									<view 
										class="time-block" 
										v-for="(time, timeIndex) in availableTimeSlots" 
										:key="timeIndex"
										:class="{
											available: time.available,
											selected: selectedTime.startTime === time.startTime && time.available
										}"
										@tap="selectTime(time)"
									>
										<text>{{time.time}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<button 
						class="book-button" 
						:disabled="!selectedTime.startTime"
						:class="{disabled: !selectedTime.startTime}"
						@tap="bookAppointment"
					>
						确认预约
					</button>
				</view>
			</view>
		</view>

		<!-- 预约详情弹窗 -->
		<view class="apt-detail-popup" v-if="showAppointmentDetailPopup">
			<view class="popup-mask" @tap="hideAppointmentDetail"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">预约详情</text>
					<view class="popup-close" @tap="hideAppointmentDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="popup-body apt-detail-body">
					<view class="qrcode-section">
						<image class="qrcode-image" src="/static/images/qrcode.png" mode="aspectFit"></image>
						<text class="qrcode-tip">请到达时出示此二维码以核验</text>
					</view>
					<view class="apt-info">
						<view class="info-row"><text class="info-label">咨询师</text><text class="info-value">{{ currentAppointment.lb77_counselor_name }}</text></view>
						<view class="info-row"><text class="info-label">日期</text><text class="info-value">{{ formatDate(new Date(currentAppointment.lb77_appointment_date), 'yyyy-MM-dd') }}</text></view>
						<view class="info-row"><text class="info-label">时间</text><text class="info-value">{{ secondsToTime(currentAppointment.lb77_starttime) }}</text></view>
						<view class="info-row"><text class="info-label">状态</text><text class="info-value">{{ currentAppointment.lb77_appointment_status }}</text></view>
						<view class="info-row"><text class="info-label">地点</text><text class="info-value">校医楼二楼心理咨询中心</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			tabs: ['心理健康评估', '咨询师预约', '我的记录'],
			currentTab: 0,
			currentUser: {
				studentId: '645730151',
				name: '张三'
			},
			
			// 心理评估
			assessmentStep: 'list', // 'list', 'answering', 'report'
			questionnaireList: [],
			currentQuestionnaire: null,
			assessmentReport: null,
			
			// 咨询师列表
			counselors: [],
			isLoadingCounselors: false,
			
			// 咨询预约
			showCounselorDetailPopup: false,
			currentCounselor: {},
			selectedDateIndex: 0,
			selectedTime: {},
			availableDates: [],
			availableTimeSlots: [],
			isLoadingSchedule: false,
			
			// 我的记录
			recordsTab: 0,
			myPsychReports: [],
			isLoadingReports: false,
			myAppointments: [],
			isLoadingAppointments: false,
			// 预约详情弹窗
			showAppointmentDetailPopup: false,
			currentAppointment: {},
		}
	},
	async onLoad(options) {
		this.initAssessment();
		// 等待咨询师列表加载完毕
		await this.fetchCounselors();

		if (options) {
			// 处理tab切换
			if (options.tab) {
				const tabIndex = parseInt(options.tab, 10);
				if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < this.tabs.length) {
					// 在切换到“我的记录”前，先设置好内部的子tab
					if (tabIndex === 2 && options.recordstab) {
						const recordsTabIndex = parseInt(options.recordstab, 10);
						if (!isNaN(recordsTabIndex) && [0, 1].includes(recordsTabIndex)) {
							this.recordsTab = recordsTabIndex;
						}
					}
					this.switchTab(tabIndex);
				}
			}

			// 处理咨询师推荐
			if (options.recommendCounselorId) {
				const counselor = this.counselors.find(c => c.id === options.recommendCounselorId);
				if (counselor) {
					// 确保tab在咨询师列表页
					if (this.currentTab !== 1) {
						this.switchTab(1);
					}
					// 等待UI渲染完毕后，再弹出详情，增加稳定性
					this.$nextTick(() => {
						setTimeout(() => {
							this.showCounselorDetail(counselor);
						}, 100); 
					});
				} else {
					console.warn(`Recommended counselor with ID ${options.recommendCounselorId} not found.`);
					uni.showToast({
						title: '未找到推荐的咨询师',
						icon: 'none'
					});
				}
			}
		}
	},
	computed: {
		// 是否所有问题都已回答
		isAllQuestionsAnswered() {
			if (!this.currentQuestionnaire || !this.currentQuestionnaire.questions) {
				return false;
			}
			return this.currentQuestionnaire.questions.every(q => q.selected !== null);
		},

		processedAppointments() {
			return this.myAppointments.map(apt => {
				let statusClass = '';
				switch (apt.lb77_appointment_status) {
					case '已预约': statusClass = 'status-booked'; break;
					case '已完成': statusClass = 'status-completed'; break;
					case '已取消': statusClass = 'status-cancelled'; break;
				}
				return {
					...apt,
					statusClass: statusClass
				};
			});
		}
	},
	methods: {
		// 获取咨询师列表（改为本地后端）
		async fetchCounselors() {
			this.isLoadingCounselors = true;
			const token = uni.getStorageSync('token');
			const clean = (s) => {
				if (s == null) return '';
				const t = String(s).trim();
				return t.replace(/^\"|\"$/g, '');
			};
			try {
				const res = await uni.request({
					url: 'http://localhost:3000/api/psych/counselors',
					method: 'GET',
					header: token ? { 'Authorization': `Bearer ${token}` } : {}
				});
				if (res.data && res.data.success) {
					this.counselors = (res.data.data || []).map((c, index) => {
						const spec = clean(c.specialties).split(',').map(t => t.trim()).filter(Boolean);
						return {
							id: c.id,
							name: c.name,
							title: clean(c.title),
							avatar: c.avatar || '/static/images/counselor' + ((index % 3) + 1) + '.png',
							specialties: spec,
							background: clean(c.background),
							style: clean(c.style),
							rating: (4.6 + Math.random() * 0.4),
							ratingCount: Math.floor(Math.random() * 150) + 50,
						};
					});
				}
			} catch (error) {
				console.error('获取咨询师列表失败:', error);
				uni.showToast({ title: '咨询师加载失败', icon: 'none' });
			} finally {
				this.isLoadingCounselors = false;
			}
		},
		
		// 切换Tab
		switchTab(index) {
			this.currentTab = index;
			if (index === 2) {
				// 默认加载第一个子tab的内容
				this.onRecordsTabClick({ currentIndex: this.recordsTab });
			}
		},

		onRecordsTabClick(e) {
			const index = e.currentIndex;
			if (this.recordsTab !== index) {
				this.recordsTab = index;
			}
			if (index === 0 && this.myPsychReports.length === 0) {
				this.fetchMyReports();
			} else if (index === 1 && this.myAppointments.length === 0) {
				this.fetchMyAppointments();
			}
		},
		
		// 开始评估
		startAssessment(item) {
			uni.showToast({
				title: '开始评估：' + item.title,
				icon: 'none'
			});
			// 这里应该跳转到具体的问卷页面
			// uni.navigateTo({
			// 	url: `/pages/features/assessment-detail?id=${item.id}`
			// });
		},
		
		// 查看报告
		viewReport(report) {
			uni.showToast({
				title: '查看报告：' + report.title,
				icon: 'none'
			});
			// 这里应该跳转到报告详情页面
			// uni.navigateTo({
			// 	url: `/pages/features/report-detail?id=${report.id}`
			// });
		},
		
		// 显示咨询师详情
		showCounselorDetail(counselor) {
			this.currentCounselor = counselor;
			this.generateAvailableDates();
			this.updateCounselorSchedule();
			this.showCounselorDetailPopup = true;
		},
		
		// 隐藏咨询师详情
		hideCounselorDetail() {
			this.showCounselorDetailPopup = false;
		},
		
		// 动态生成可用日期
		generateAvailableDates() {
			const dates = [];
			const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			for (let i = 0; i < 7; i++) {
				const date = new Date();
				date.setDate(date.getDate() + i);
				dates.push({
					fullDate: this.formatDate(date, 'yyyy-MM-dd'),
					day: this.formatDate(date, 'dd'),
					weekday: weekdays[date.getDay()]
				});
			}
			this.availableDates = dates;
			this.selectedDateIndex = 0;
			this.selectedTime = {};
		},

		// 更新咨询师排班（改为本地后端）
		async updateCounselorSchedule() {
			if (!this.currentCounselor.id || this.selectedDateIndex < 0) return;
			
			this.isLoadingSchedule = true;
			this.availableTimeSlots = [];
			this.selectedTime = {};

			// 确保DOM更新完成后再执行后续操作
			await this.$nextTick();

			const selectedDate = this.availableDates[this.selectedDateIndex];

			try {
				const token = uni.getStorageSync('token');
				const res = await uni.request({
					url: `http://localhost:3000/api/psych/counselors/${this.currentCounselor.id}/schedule`,
					method: 'GET',
					header: token ? { 'Authorization': `Bearer ${token}` } : {}
				});

				const rows = (res.data && res.data.success) ? (res.data.data || []) : [];
				const weekday = selectedDate.weekday;
				const allSlots = rows
					.filter(r => (r.day_of_week || r.dayOfWeek) === weekday)
					.map(r => ({ startTime: Number(r.start_time_sec || r.startSec), endTime: Number(r.end_time_sec || r.endSec) }));

				this.availableTimeSlots = allSlots
					.map(slot => ({
						time: this.secondsToTime(slot.startTime),
						startTime: slot.startTime,
						endTime: slot.endTime,
						available: true
					}))
					.sort((a, b) => a.startTime - b.startTime);

			} catch (error) {
				console.error("获取咨询师排班失败:", error);
				uni.showToast({ title: '号源加载失败', icon: 'none' });
			} finally {
				this.isLoadingSchedule = false;
			}
		},
		
		// 日期选择器控制 - 已废弃
		previousDate() {
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		nextDate() {
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		
		// 选择日期
		selectDate(index) {
			this.selectedDateIndex = index;
			this.updateCounselorSchedule();
		},
		
		// 选择时间
		selectTime(time) {
			if (time.available) {
				this.selectedTime = time;
			}
		},
		
		// 预约咨询（本地后端）
		bookAppointment() {
			if (this.selectedTime && this.selectedTime.startTime) {
				const date = this.availableDates[this.selectedDateIndex];
				const time = this.selectedTime;
				
				uni.showModal({
					title: '预约确认',
					content: `您确定要预约${this.currentCounselor.name}咨询师在 ${date.fullDate} ${time.time} 的咨询吗？`,
					success: async (res) => {
						if (res.confirm) {
							// TODO: 后续应从用户登录状态中获取真实学生ID
							const studentId = "645730151"; 
							
							try {
								uni.showLoading({ title: '正在预约...' });
								
								const token = uni.getStorageSync('token');
								await uni.request({
									url: 'http://localhost:3000/api/psych/appointments',
									method: 'POST',
									header: token ? { 'Authorization': `Bearer ${token}` } : {},
									data: {
										studentId,
										counselorId: this.currentCounselor.id,
										date: date.fullDate,
										startTimeSec: time.startTime,
										endTimeSec: time.endTime
									}
								});
								
								uni.hideLoading();
								uni.showToast({
									title: '预约成功',
									icon: 'success',
									duration: 1500
								});
								this.hideCounselorDetail();

								// 预约成功后，延时跳转到我的记录-咨询预约列表
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/features/psychological-assessment?tab=2&recordstab=1'
									});
								}, 1500);

							} catch (error) {
								uni.hideLoading();
								console.error("创建心理咨询预约失败:", error);
								uni.showToast({
									title: '预约失败，请稍后再试或检查网络',
									icon: 'none',
									duration: 2000
								});
							}
						}
					}
				});
			}
		},
		
		// 时间格式化工具
		secondsToTime(seconds) {
			if (isNaN(seconds)) return '';
			const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
			const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
			return `${h}:${m}`;
		},
		formatDate(date, fmt) {
			if (!date || isNaN(new Date(date))) {
				return '';
			}
			date = new Date(date);
			const o = {
				"M+": date.getMonth() + 1,
				"d+": date.getDate(),
				"h+": date.getHours(),
				"m+": date.getMinutes(),
				"s+": date.getSeconds(),
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for (let k in o) {
				if (new RegExp("(" + k + ")").test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			}
			return fmt;
		},

		// -------- 心理评估方法 --------
		initAssessment() {
			this.questionnaireList = [
				{
					id: 'GeneralV1',
					title: '通用心理健康评估',
					description: '快速评估您近期的整体心理状态。',
					icon: '/static/images/assessment-icon-1.png',
					questions: [
						{
							text: "最近一周，我感到精力充沛。",
							options: [{ text: "完全同意", score: 1 }, { text: "比较同意", score: 2 }, { text: "不确定", score: 3 }, { text: "比较不同意", score: 4 }, { text: "完全不同意", score: 5 }],
							selected: null
						},
						{
							text: "最近一周，我对未来感到乐观。",
							options: [{ text: "完全同意", score: 1 }, { text: "比较同意", score: 2 }, { text: "不确定", score: 3 }, { text: "比较不同意", score: 4 }, { text: "完全不同意", score: 5 }],
							selected: null
						},
						{
							text: "最近一周，我能很好地处理日常压力。",
							options: [{ text: "完全同意", score: 1 }, { text: "比较同意", score: 2 }, { text: "不确定", score: 3 }, { text: "比较不同意", score: 4 }, { text: "完全不同意", score: 5 }],
							selected: null
						},
						{
							text: "最近一周，我对自己的能力有信心。",
							options: [{ text: "完全同意", score: 1 }, { text: "比较同意", score: 2 }, { text: "不确定", score: 3 }, { text: "比较不同意", score: 4 }, { text: "完全不同意", score: 5 }],
							selected: null
						},
						{
							text: "最近一周，我对参与各种活动兴趣盎然。",
							options: [{ text: "完全同意", score: 1 }, { text: "比较同意", score: 2 }, { text: "不确定", score: 3 }, { text: "比较不同意", score: 4 }, { text: "完全不同意", score: 5 }],
							selected: null
						}
					]
				},
				{
					id: 'SAS',
					title: '焦虑自评量表 (SAS)',
					description: '评估您过去一周内焦虑情绪的严重程度。',
					icon: '/static/images/assessment-icon-2.png',
					questions: [
						{
							text: "我感到比平常更容易紧张和着急。",
							options: [{ text: "没有或很少时间", score: 1 }, { text: "小部分时间", score: 2 }, { text: "相当多时间", score: 3 }, { text: "绝大部分或全部时间", score: 4 }],
							selected: null
						},
						{
							text: "我无缘无故地感到害怕或恐惧。",
							options: [{ text: "没有或很少时间", score: 1 }, { text: "小部分时间", score: 2 }, { text: "相当多时间", score: 3 }, { text: "绝大部分或全部时间", score: 4 }],
							selected: null
						},
						{
							text: "我容易心里烦乱或感到惊恐。",
							options: [{ text: "没有或很少时间", score: 1 }, { text: "小部分时间", score: 2 }, { text: "相当多时间", score: 3 }, { text: "绝大部分或全部时间", score: 4 }],
							selected: null
						},
					]
				},
				{
					id: 'SDS',
					title: '抑郁自评量表 (SDS)',
					description: '评估您近期抑郁情绪的体验和严重程度。',
					icon: '/static/images/assessment-icon-3.png',
					questions: [
						{
							text: "我觉得闷闷不乐，情绪低沉。",
							options: [{ text: "没有或很少时间", score: 1 }, { text: "小部分时间", score: 2 }, { text: "相当多时间", score: 3 }, { text: "绝大部分或全部时间", score: 4 }],
							selected: null
						},
						{
							text: "我感到前景非常暗淡。",
							options: [{ text: "没有或很少时间", score: 1 }, { text: "小部分时间", score: 2 }, { text: "相当多时间", score: 3 }, { text: "绝大部分或全部时间", score: 4 }],
							selected: null
						},
						{
							text: "我对以前感兴趣的事情失去了兴趣。",
							options: [{ text: "没有或很少时间", score: 1 }, { text: "小部分时间", score: 2 }, { text: "相当多时间", score: 3 }, { text: "绝大部分或全部时间", score: 4 }],
							selected: null
						},
					]
				},
				{
					id: 'SAD',
					title: '社交回避及苦恼量表 (SAD)',
					description: '评估您在社交场合中的回避倾向和感受到的苦恼。',
					icon: '/static/images/assessment-icon-4.png',
					questions: [
						{
							text: "参加聚会时，我感到不自在。",
							options: [{ text: "完全不符合", score: 1 }, { text: "不太符合", score: 2 }, { text: "有点符合", score: 3 }, { text: "非常符合", score: 4 }],
							selected: null
						},
						{
							text: "我尽量避免成为别人注意的中心。",
							options: [{ text: "完全不符合", score: 1 }, { text: "不太符合", score: 2 }, { text: "有点符合", score: 3 }, { text: "非常符合", score: 4 }],
							selected: null
						},
						{
							text: "我对和陌生人交谈感到紧张。",
							options: [{ text: "完全不符合", score: 1 }, { text: "不太符合", score: 2 }, { text: "有点符合", score: 3 }, { text: "非常符合", score: 4 }],
							selected: null
						},
					]
				}
			];
			this.currentQuestionnaire = null;
			this.assessmentReport = null;
			this.assessmentStep = 'list';
		},
		
		startAssessment(questionnaire) {
			// 重置问题的选中状态
			questionnaire.questions.forEach(q => q.selected = null);
			this.currentQuestionnaire = questionnaire;
			this.assessmentStep = 'answering';
		},

		handleRadioChange(event, questionIndex) {
			const selectedOptionIndex = parseInt(event.detail.value);
			this.currentQuestionnaire.questions[questionIndex].selected = selectedOptionIndex;
		},

		async submitAssessment() {
			if (!this.isAllQuestionsAnswered) {
				uni.showToast({ title: '请回答所有问题', icon: 'none' });
				return;
			}
			
			const totalScore = this.currentQuestionnaire.questions.reduce((sum, question) => {
				return sum + question.options[question.selected].score;
			}, 0);
			
			let level = '';
			let suggestion = '';
			// Note: 这里的评分标准是通用的，实际应用中不同问卷应有不同标准
			if (totalScore <= (this.currentQuestionnaire.questions.length * 2)) {
				level = '心理状态良好';
				suggestion = '您的心理状态比较健康，能够较好地应对生活中的挑战。建议继续保持，并适当进行放松活动。';
			} else if (totalScore <= (this.currentQuestionnaire.questions.length * 3.5)) {
				level = '轻度心理困扰';
				suggestion = '您可能正面临一些压力或情绪困扰。建议主动与朋友、家人沟通，或考虑寻求专业心理咨询。';
			} else {
				level = '需要关注';
				suggestion = '您的心理状态需要引起重视。强力建议您预约专业心理咨询师进行深入沟通，以获得及时有效的帮助。';
			}
			
			uni.showLoading({ title: '正在生成报告...' });

			try {
				// TODO: 后续应从用户登录状态中获取真实学生ID
				const studentId = "645730151";
				const entries = this.currentQuestionnaire.questions.map((q, index) => ({
					question_index: index + 1,
					selected_text: q.options[q.selected].text,
					score: q.options[q.selected].score,
				}));
				const token = uni.getStorageSync('token');
				await uni.request({
					url: 'http://localhost:3000/api/psych/reports',
					method: 'POST',
					header: token ? { 'Authorization': `Bearer ${token}` } : {},
					data: {
						studentId,
						questionnaireKey: this.currentQuestionnaire.id,
						questionnaireTitle: this.currentQuestionnaire.title,
						totalScore,
						resultLevel: level,
						suggestion,
						entries
					}
				});
				
				this.assessmentReport = {
					score: totalScore,
					level: level,
					suggestion: suggestion
				};
				
				this.assessmentStep = 'report';

				uni.hideLoading();
				uni.showToast({ title: '报告生成成功', icon: 'success' });
				
			} catch (error) {
				uni.hideLoading();
				console.error("创建心理评估报告失败:", error);
				uni.showToast({ title: '报告提交失败，请重试', icon: 'none' });
			}
		},

		resetAssessment() {
			this.initAssessment();
			this.myPsychReports = []; 
		},

		// -------- 咨询预约方法 --------
		
		// -------- 我的记录方法 --------
		async fetchMyReports() {
			this.isLoadingReports = true;
			// 确保DOM更新完成后再执行后续操作，防止uni-load-more组件报错
			await this.$nextTick(); 
			try {
				// TODO: 后续应从用户登录状态中获取真实学生ID
				const studentId = "645730151";
				const token = uni.getStorageSync('token');
				const res = await uni.request({
					url: `http://localhost:3000/api/psych/my/reports?studentId=${studentId}`,
					method: 'GET',
					header: token ? { 'Authorization': `Bearer ${token}` } : {}
				});
				if (res.data && res.data.success) {
					const list = res.data.data || [];
					this.myPsychReports = list
						.map(r => ({
							id: r.id,
							lb77_questionnairetitle: r.questionnaire_title,
							lb77_resultsummary: r.result_level,
							lb77_totalscore: r.total_score,
							createtime: r.created_at
						}))
						.sort((a, b) => new Date(b.createtime) - new Date(a.createtime));
				} else {
					this.myPsychReports = [];
				}
			} catch (error) {
				console.error("获取心理评估报告列表失败:", error);
				uni.showToast({ title: '报告加载失败', icon: 'none' });
			} finally {
				this.isLoadingReports = false;
			}
		},
		async fetchMyAppointments() {
			this.isLoadingAppointments = true;
			await this.$nextTick();
			try {
				// TODO: 后续应从用户登录状态中获取真实学生ID
				const studentId = "645730151";
				const token = uni.getStorageSync('token');
				const res = await uni.request({
					url: `http://localhost:3000/api/psych/my/appointments?studentId=${studentId}`,
					method: 'GET',
					header: token ? { 'Authorization': `Bearer ${token}` } : {}
				});
				if (res.data && res.data.success) {
					const list = res.data.data || [];
					this.myAppointments = list
						.map(r => ({
							id: r.id,
							lb77_counselor_name: r.counselor_name || '',
							lb77_appointment_status: r.status,
							lb77_appointment_date: r.appointment_date,
							lb77_starttime: r.start_time_sec
						}))
						.sort((a, b) => new Date(b.lb77_appointment_date) - new Date(a.lb77_appointment_date));
				} else {
					this.myAppointments = [];
				}
			} catch (error) {
				console.error("获取我的咨询预约列表失败:", error);
				uni.showToast({ title: '预约记录加载失败', icon: 'none' });
			} finally {
				this.isLoadingAppointments = false;
			}
		},

		confirmCancelAppointment(appointmentId) {
			uni.showModal({
				title: '确认取消',
				content: '您确定要取消本次预约吗？',
				success: async (res) => {
					if (res.confirm) {
						this.cancelAppointment(appointmentId);
					}
				}
			});
		},
		
		async cancelAppointment(appointmentId) {
			uni.showLoading({ title: '正在取消...' });
			try {
				const token = uni.getStorageSync('token');
				const studentId = "645730151";
				await uni.request({
					url: `http://localhost:3000/api/psych/appointments/${appointmentId}/cancel`,
					method: 'POST',
					header: token ? { 'Authorization': `Bearer ${token}` } : {},
					data: { studentId }
				});
				uni.hideLoading();
				uni.showToast({ title: '取消成功', icon: 'success' });
				// 刷新列表
				this.fetchMyAppointments();
			} catch (error) {
				uni.hideLoading();
				console.error("取消预约失败:", error);
				uni.showToast({ title: '取消失败，请稍后再试', icon: 'none' });
			}
		},
		// 显示/隐藏预约详情
		showAppointmentDetail(apt) {
			this.currentAppointment = apt;
			this.showAppointmentDetailPopup = true;
		},
		hideAppointmentDetail() {
			this.showAppointmentDetailPopup = false;
		}
	}
}
</script>

<style>
.psych-assessment-page {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.assessment-banner {
	position: relative;
	height: 300rpx;
	overflow: hidden;
}

.banner-image {
	width: 100%;
	height: 300rpx;
}

.banner-content {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 40rpx;
	background: linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0));
}

.banner-title {
	font-size: 40rpx;
	color: #ffffff;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.banner-subtitle {
	font-size: 28rpx;
	color: #ffffff;
	opacity: 0.9;
}

.assessment-container {
	padding: 20rpx;
}

.tabs {
	display: flex;
	background-color: #ffffff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 20rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #007AFF;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40rpx;
	height: 4rpx;
	background-color: #007AFF;
	border-radius: 2rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	margin: 30rpx 10rpx 20rpx;
	color: #333;
}

.assessment-cards, .report-cards, .counselor-list {
	background-color: #ffffff;
	border-radius: 10rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	padding: 10rpx;
}

.assessment-card {
	display: flex;
	padding: 20rpx;
	border-bottom: 1px solid #f0f0f0;
}

.assessment-card:last-child {
	border-bottom: none;
}

.card-left {
	width: 80rpx;
	height: 80rpx;
	margin-right: 20rpx;
}

.card-icon {
	width: 80rpx;
	height: 80rpx;
}

.card-content {
	flex: 1;
}

.card-title {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.card-desc {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
	line-height: 1.4;
}

.card-meta {
	display: flex;
	font-size: 22rpx;
	color: #999;
}

.meta-item {
	margin-right: 20rpx;
}

.meta-label {
	color: #666;
}

.card-right {
	display: flex;
	align-items: center;
}

.arrow-icon {
	width: 40rpx;
	height: 40rpx;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
}

.empty-image {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 30rpx;
}

.primary-btn {
	background-color: #007AFF;
	color: #fff;
	font-size: 28rpx;
	padding: 10rpx 40rpx;
	border-radius: 30rpx;
}

.loading-state {
	padding: 60rpx 0;
	text-align: center;
}

/* 报告卡片 */
.report-card {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}

.report-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.report-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.report-date {
	font-size: 24rpx;
	color: #999;
}

.report-summary {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 20rpx;
	line-height: 1.4;
}

.report-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.score-display {
	display: flex;
	align-items: baseline;
}

.score-label {
	font-size: 24rpx;
	color: #666;
	margin-right: 10rpx;
}

.score-value {
	font-size: 40rpx;
	color: #FF9500;
	font-weight: bold;
}

.view-btn {
	background-color: #f0f0f0;
	color: #666;
	font-size: 24rpx;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
}

/* 咨询师卡片 */
.counselor-card {
	display: flex;
	padding: 20rpx;
	border-bottom: 1px solid #f0f0f0;
	align-items: center;
}

.counselor-card:last-child {
	border-bottom: none;
}

.counselor-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.counselor-info {
	flex: 1;
}

.counselor-header {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.counselor-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-right: 10rpx;
}

.counselor-title {
	font-size: 24rpx;
	color: #666;
}

.counselor-specialties {
	display: flex;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
	flex-wrap: wrap;
}

.specialty-tags {
	display: flex;
	flex-wrap: wrap;
}

.specialty-tag {
	background-color: #f0f0f0;
	color: #666;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	margin-right: 10rpx;
	margin-bottom: 6rpx;
	font-size: 20rpx;
}

.counselor-rating {
	display: flex;
	align-items: center;
}

.stars {
	display: flex;
	margin-right: 10rpx;
}

.star {
	color: #e0e0e0;
	font-size: 24rpx;
}

.star.active {
	color: #FFCC00;
}

.rating-value {
	font-size: 24rpx;
	color: #333;
	margin-right: 6rpx;
}

.rating-count {
	font-size: 22rpx;
	color: #999;
}

.book-btn {
	background-color: #007AFF;
	color: #fff;
	font-size: 24rpx;
	padding: 10rpx 30rpx;
	border-radius: 30rpx;
	margin-left: 20rpx;
}

/* 弹窗 */
.counselor-detail-popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
}

.popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
}

.popup-content {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #ffffff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	padding-bottom: 40rpx;
	max-height: 80vh;
	overflow-y: auto;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #f0f0f0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.popup-close image {
	width: 40rpx;
	height: 40rpx;
}

.popup-body {
	padding: 30rpx;
}

.counselor-profile {
	display: flex;
	margin-bottom: 40rpx;
}

.profile-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 30rpx;
}

.profile-basic {
	flex: 1;
}

.profile-name {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 6rpx;
}

.profile-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.profile-detail .detail-item {
	margin-bottom: 30rpx;
}

.detail-label {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
}

.detail-value {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.date-selector {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.date-arrow {
	width: 60rpx;
	display: flex;
	justify-content: center;
}

.date-arrow image {
	width: 40rpx;
	height: 40rpx;
}

.dates {
	flex: 1;
	display: flex;
	justify-content: space-around;
	overflow-x: auto;
}

.date-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx 0;
	width: 110rpx;
	flex-shrink: 0;
	border-radius: 10rpx;
}

.date-item.active {
	background-color: #007AFF;
}
.date-item.active .date-day,
.date-item.active .date-weekday {
	color: #fff;
}

.date-day {
	font-size: 32rpx;
	font-weight: bold;
}

.date-weekday {
	font-size: 22rpx;
}

.time-grid {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -10rpx;
}

.time-block {
	width: 25%;
	box-sizing: border-box;
	padding: 10rpx;
}

.time-block text {
	display: block;
	text-align: center;
	padding: 16rpx 0;
	background-color: #f5f5f5;
	color: #999;
	border-radius: 8rpx;
	font-size: 26rpx;
}

.empty-slots {
	text-align: center;
	padding: 40rpx 0;
	color: #999;
	font-size: 26rpx;
}

.time-block.available text {
	background-color: #eef5ff;
	color: #007aff;
}

.time-block.selected text {
	background-color: #007AFF;
	color: #fff;
	font-weight: bold;
}

.book-button {
	margin-top: 40rpx;
	background-color: #007AFF;
	color: #fff;
	padding: 20rpx 0;
	text-align: center;
	border-radius: 10rpx;
	font-size: 32rpx;
}

.book-button.disabled {
	background-color: #cccccc;
}

.assessment-content {
	padding: 30rpx;
}

.question-list {
	margin-bottom: 40rpx;
}

.question-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
}

.question-title {
	font-size: 30rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	color: #333;
}

.option-item {
	display: block;
	padding: 15rpx 0;
	font-size: 28rpx;
	color: #555;
}

.option-text {
	display: flex;
	align-items: center;
}

.option-text radio {
	transform: scale(0.8);
	margin-right: 10rpx;
}

.submit-button, .retest-button {
	background-color: #007AFF;
	color: white;
	border-radius: 50rpx;
}

.submit-button[disabled] {
	background-color: #a0cfff;
}

.report-card {
	background-color: #fff;
	padding: 40rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.report-title {
	font-size: 36rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 40rpx;
}

.report-item {
	display: flex;
	font-size: 30rpx;
	margin-bottom: 20rpx;
}

.report-label {
	width: 180rpx;
	color: #666;
	flex-shrink: 0;
}

.report-value {
	color: #333;
}

.result-level {
	font-weight: bold;
	color: #007AFF;
}

/* 我的记录 */
.my-records-section {
	padding-bottom: 30rpx;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 100rpx;
}

.empty-image {
	width: 250rpx;
	height: 250rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	color: #999;
	font-size: 28rpx;
	margin-bottom: 40rpx;
}

.primary-btn {
	background-color: #007AFF;
	color: white;
	border-radius: 50rpx;
	font-size: 30rpx;
	padding: 0 50rpx;
}

.report-list {
	padding: 0 30rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.my-report-card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.my-report-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1rpx solid #f0f0f0;
	padding-bottom: 20rpx;
	margin-bottom: 20rpx;
}

.my-report-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.my-report-date {
	font-size: 24rpx;
	color: #999;
}

.my-report-body {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.my-report-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.my-report-item:first-child {
	align-items: flex-start;
}
.my-report-item:last-child {
	align-items: flex-end;
}

.my-report-label {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 10rpx;
}

.my-report-value {
	font-size: 32rpx;
	font-weight: bold;
}

.my-report-value.result {
	color: #007aff;
}

.my-report-value.score {
	color: #ff9500;
}

.records-content {
	padding-top: 20rpx;
}

.appointment-list {
	padding: 0 30rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.appointment-card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.apt-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.apt-counselor {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.apt-status {
	font-size: 26rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	font-weight: bold;
}

.status-booked {
	background-color: #eef5ff;
	color: #007aff;
}
.status-completed {
	background-color: #e8f5e9;
	color: #4caf50;
}
.status-cancelled {
	background-color: #f5f5f5;
	color: #999;
}

.apt-body {
	margin-bottom: 20rpx;
}

.apt-time {
	font-size: 28rpx;
	color: #666;
}

.apt-footer {
	display: flex;
	justify-content: flex-end;
	border-top: 1rpx solid #f0f0f0;
	padding-top: 20rpx;
}

.cancel-btn {
	background-color: #fff;
	color: #ff3b30;
	border: 1rpx solid #ff3b30;
	border-radius: 30rpx;
	padding: 8rpx 24rpx;
	font-size: 26rpx;
	line-height: 1;
	margin: 0;
}

/* 咨询师弹窗样式 */
.counselor-detail-popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
}

.popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
}

.popup-content {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #ffffff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	padding-bottom: 40rpx;
	max-height: 80vh;
	overflow-y: auto;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1px solid #f0f0f0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.popup-close image {
	width: 40rpx;
	height: 40rpx;
}

.popup-body {
	padding: 30rpx;
}

.counselor-profile {
	display: flex;
	margin-bottom: 40rpx;
}

.profile-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 30rpx;
}

.profile-basic {
	flex: 1;
}

.profile-name {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 6rpx;
}

.profile-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.profile-detail .detail-item {
	margin-bottom: 30rpx;
}

.detail-label {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
}

.detail-value {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
}

.date-selector {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.date-arrow {
	width: 60rpx;
	display: flex;
	justify-content: center;
}

.date-arrow image {
	width: 40rpx;
	height: 40rpx;
}

.dates {
	flex: 1;
	display: flex;
	justify-content: space-around;
	overflow-x: auto;
}

.date-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx 0;
	width: 110rpx;
	flex-shrink: 0;
	border-radius: 10rpx;
}

.date-item.active {
	background-color: #007AFF;
}
.date-item.active .date-day,
.date-item.active .date-weekday {
	color: #fff;
}

.date-day {
	font-size: 32rpx;
	font-weight: bold;
}

.date-weekday {
	font-size: 22rpx;
}

.time-grid {
	display: flex;
	flex-wrap: wrap;
	margin: 0 -10rpx;
}

.time-block {
	width: 25%;
	box-sizing: border-box;
	padding: 10rpx;
}

.time-block text {
	display: block;
	text-align: center;
	padding: 16rpx 0;
	background-color: #f5f5f5;
	color: #999;
	border-radius: 8rpx;
	font-size: 26rpx;
}

.empty-slots {
	text-align: center;
	padding: 40rpx 0;
	color: #999;
	font-size: 26rpx;
}

.time-block.available text {
	background-color: #eef5ff;
	color: #007aff;
}

.time-block.selected text {
	background-color: #007AFF;
	color: #fff;
	font-weight: bold;
}

.book-button {
	margin-top: 40rpx;
	background-color: #007AFF;
	color: #fff;
	padding: 20rpx 0;
	text-align: center;
	border-radius: 10rpx;
	font-size: 32rpx;
}

.book-button.disabled {
	background-color: #cccccc;
}

.assessment-content {
	padding: 30rpx;
}

.question-list {
	margin-bottom: 40rpx;
}

.question-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
}

.question-title {
	font-size: 30rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	color: #333;
}

.option-item {
	display: block;
	padding: 15rpx 0;
	font-size: 28rpx;
	color: #555;
}

.option-text {
	display: flex;
	align-items: center;
}

.option-text radio {
	transform: scale(0.8);
	margin-right: 10rpx;
}

.submit-button, .retest-button {
	background-color: #007AFF;
	color: white;
	border-radius: 50rpx;
}

.submit-button[disabled] {
	background-color: #a0cfff;
}

.report-card {
	background-color: #fff;
	padding: 40rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.report-title {
	font-size: 36rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 40rpx;
}

.report-item {
	display: flex;
	font-size: 30rpx;
	margin-bottom: 20rpx;
}

.report-label {
	width: 180rpx;
	color: #666;
	flex-shrink: 0;
}

.report-value {
	color: #333;
}

.result-level {
	font-weight: bold;
	color: #007AFF;
}

.questionnaire-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.questionnaire-card {
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 30rpx;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.q-card-icon {
	width: 80rpx;
	height: 80rpx;
	margin-right: 30rpx;
}

.q-card-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.q-card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.q-card-desc {
	font-size: 26rpx;
	color: #999;
}

.start-btn {
	background-color: #eef5ff;
	color: #007aff;
	font-size: 26rpx;
	border-radius: 30rpx;
	padding: 10rpx 24rpx;
	line-height: 1;
	margin: 0;
	margin-left: 20rpx;
	flex-shrink: 0;
}

/* 预约详情弹窗 */
.apt-detail-popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
}
.apt-detail-body {
	padding: 30rpx;
}
.qrcode-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 30rpx;
}
.qrcode-image {
	width: 360rpx;
	height: 360rpx;
}
.qrcode-tip {
	margin-top: 12rpx;
	font-size: 24rpx;
	color: #666;
}
.apt-info {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}
.info-row {
	display: flex;
	justify-content: space-between;
	padding: 12rpx 0;
}
.info-label {
	color: #666;
	font-size: 26rpx;
}
.info-value {
	color: #333;
	font-size: 28rpx;
	font-weight: 500;
}
</style> 