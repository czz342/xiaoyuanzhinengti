<template>
	<view class="medical-page">
		<!-- 顶部banner -->
		<view class="medical-banner">
			<view class="banner-content">
				<text class="banner-title">校医预约</text>
				<text class="banner-subtitle">方便快捷的校园医疗服务</text>
			</view>
		</view>

		<!-- 主导航栏 -->
		<view class="nav-tabs">
			<view class="tab-item" v-for="(tab, index) in tabs" :key="index" :class="{ active: currentTab === index }"
				@tap="switchTab(index)">
				<text>{{tab}}</text>
			</view>
		</view>

		<!-- 预约挂号内容 -->
		<view class="tab-content" v-if="currentTab === 0">
			<!-- 科室选择 -->
			<view class="section-departments">
				<view class="section-title">
					<text>选择科室</text>
				</view>
				<view class="departments-list">
					<view class="department-item" v-for="dept in departments" :key="dept.number"
						:class="{ active: selectedDepartment && selectedDepartment.number === dept.number }"
						@tap="selectDepartment(dept)">
						<text>{{dept.name}}</text>
					</view>
				</view>
			</view>

			<!-- 日期选择 -->
			<view class="section-date" v-if="selectedDepartment">
				<view class="section-title">
					<text>选择日期</text>
				</view>
				<view class="date-selector">
					<view class="dates">
						<view class="date-item" v-for="(date, dateIndex) in availableDates" :key="dateIndex"
							:class="{ active: selectedDate && selectedDate.fullDate === date.fullDate }" @tap="selectDate(date)">
							<text class="date-day">{{date.day}}</text>
							<text class="date-weekday">{{date.weekday}}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 医生列表 -->
			<view class="section-doctors" v-if="selectedDate">
				<view class="section-title">
					<text>选择医生</text>
				</view>
				<view v-if="isLoadingDoctors" class="loading-state">
					<uni-load-more status="loading" contentText=""></uni-load-more>
				</view>
				<view v-else-if="doctorsList.length === 0" class="empty-state small">
					<text class="empty-text">该科室今日无排班医生</text>
				</view>
				<view v-else class="doctors-list">
					<view class="doctor-card" v-for="doctor in doctorsList" :key="doctor.id">
						<image :src="doctor.avatar" mode="aspectFill" class="doctor-avatar"></image>
						<view class="doctor-info">
							<view class="doctor-header">
								<text class="doctor-name">{{doctor.name}}</text>
								<text class="doctor-title">{{doctor.title}}</text>
							</view>
							<view class="doctor-specialty-list">
								<text>擅长：{{doctor.specialty}}</text>
							</view>
							<view class="doctor-rating">
								<view class="stars">
									<text class="star" v-for="n in 5" :key="n" :class="{ active: n <= doctor.rating }">★</text>
								</view>
								<text class="rating-text">{{doctor.ratingCount}}人评价</text>
							</view>
						</view>
						<button class="book-btn-list" @tap="showDoctorDetail(doctor)">预约</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 我的预约内容 -->
		<view class="tab-content" v-if="currentTab === 1">
			<view class="my-appointments">
				<view class="appointment-status-tabs">
					<view class="status-tab" v-for="(status, index) in appointmentStatusList" :key="index"
						:class="{ active: currentStatusTab === index }" @tap="switchStatusTab(index)">
						<text>{{status}}</text>
					</view>
				</view>

				<view v-if="isLoadingAppointments" class="loading-state">
					<uni-load-more status="loading" contentText=""></uni-load-more>
				</view>
				<view class="appointment-list" v-else-if="filteredAppointments.length > 0">
					<view class="appointment-card" v-for="(appointment, index) in filteredAppointments" :key="index"
						@tap="viewAppointmentDetail(appointment)">
						<view class="appointment-info">
							<text class="appointment-dept">{{appointment.department}}</text>
							<text class="appointment-doctor">{{appointment.doctorName}} {{appointment.doctorTitle}}</text>
							<view class="appointment-time">
								<image src="/static/images/calendar.png" mode="aspectFit"></image>
								<text>{{appointment.date}} {{appointment.time}}</text>
							</view>
							<view class="appointment-location">
								<image src="/static/images/location.png" mode="aspectFit"></image>
								<text>{{appointment.location}}</text>
							</view>
						</view>
						<view class="appointment-action">
							<view class="appointment-status" :class="appointment.statusClass">
								<text>{{appointment.status}}</text>
							</view>
							<button class="action-btn" v-if="appointment.status === '待就诊'"
								@tap.stop="cancelAppointment(appointment)">
								取消预约
							</button>
						</view>
					</view>
				</view>

				<view class="empty-state" v-else>
					<image src="/static/images/empty-appointments.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">暂无{{appointmentStatusList[currentStatusTab]}}的预约记录</text>
				</view>
			</view>
		</view>

		<!-- 健康档案内容 -->
		<view class="tab-content" v-if="currentTab === 2">
			<view class="health-records">
				<view class="records-type-tabs">
					<view class="record-type" v-for="(type, index) in healthRecordTypes" :key="index"
						:class="{ active: currentRecordType === index }" @tap="switchRecordType(index)">
						<image :src="type.icon" mode="aspectFit"></image>
						<text>{{type.name}}</text>
					</view>
				</view>

				<!-- 就诊记录 -->
				<view class="records-list" v-if="currentRecordType === 0">
					<view v-if="isLoadingMedicalRecords" class="loading-state">
						<uni-load-more status="loading" contentText=""></uni-load-more>
					</view>
					<view class="timeline" v-else-if="medicalRecords.length > 0">
						<view class="timeline-item" v-for="(record, index) in medicalRecords" :key="index"
							@tap="viewRecordDetail(record)">
							<view class="timeline-dot"></view>
							<view class="timeline-content">
								<view class="record-header">
									<text class="record-title">{{record.disease}}</text>
									<text class="record-date">{{record.date}}</text>
								</view>
								<text class="record-doctor">{{record.doctorName}} {{record.doctorTitle}}</text>
								<text class="record-desc">{{record.description}}</text>
							</view>
						</view>
					</view>
					<view v-else class="empty-state">
						<image src="/static/images/empty-reports.png" mode="aspectFit" class="empty-image"></image>
						<text class="empty-text">暂无就诊记录</text>
					</view>
				</view>
				
				<!-- 体检报告 -->
				<view class="records-list" v-if="currentRecordType === 1">
					<view v-if="examReports.length > 0">
						<view 
							class="report-card" 
							v-for="(report, index) in examReports" 
							:key="index"
							@tap="viewExamReport(report)"
						>
							<view class="report-header">
								<text class="report-title">{{report.title}}</text>
								<text class="report-date">{{report.date}}</text>
							</view>
							<view class="report-summary">
								<text class="summary-label">体检结论：</text>
								<text class="summary-content">{{report.summary}}</text>
							</view>
							<view class="report-footer">
								<text class="report-location">{{report.location}}</text>
								<view class="report-status" :class="report.statusClass">
									<text>{{report.status}}</text>
								</view>
							</view>
						</view>
					</view>
					<view v-else class="empty-state">
						<image src="/static/images/empty-reports.png" mode="aspectFit" class="empty-image"></image>
						<text class="empty-text">暂无体检报告</text>
					</view>
				</view>
				
				<!-- 疫苗接种 -->
				<view class="records-list" v-if="currentRecordType === 2">
					<view v-if="vaccineRecords.length > 0">
						<view 
							class="vaccine-card" 
							v-for="(vaccine, index) in vaccineRecords" 
							:key="index"
						>
							<view class="vaccine-header">
								<text class="vaccine-name">{{vaccine.name}}</text>
								<view class="vaccine-status" :class="vaccine.statusClass">
									<text>{{vaccine.status}}</text>
								</view>
							</view>
							<view class="vaccine-info">
								<view class="vaccine-item">
									<text class="item-label">接种日期：</text>
									<text class="item-value">{{vaccine.date || '未接种'}}</text>
								</view>
								<view class="vaccine-item">
									<text class="item-label">接种地点：</text>
									<text class="item-value">{{vaccine.location || '未接种'}}</text>
								</view>
								<view class="vaccine-item">
									<text class="item-label">疫苗批次：</text>
									<text class="item-value">{{vaccine.batch || '未接种'}}</text>
								</view>
							</view>
							<button 
								class="vaccine-btn" 
								v-if="vaccine.status === '未接种'"
								@tap="reserveVaccine(vaccine)"
							>
								预约接种
							</button>
						</view>
					</view>
					<view v-else class="empty-state">
						<image src="/static/images/empty-reports.png" mode="aspectFit" class="empty-image"></image>
						<text class="empty-text">暂无疫苗接种记录</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 医生详情与预约弹窗 -->
		<view class="doctor-detail-popup" v-if="showDoctorDetailPopup">
			<view class="popup-mask" @tap="hideDoctorDetail"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">预约详情</text>
					<view class="popup-close" @tap="hideDoctorDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<scroll-view scroll-y="true" class="popup-body">
					<view class="doctor-profile-popup">
						<image :src="currentDoctor.avatar" mode="aspectFill" class="profile-avatar"></image>
						<view class="profile-basic">
							<text class="profile-name">{{currentDoctor.name}}</text>
							<text class="profile-title">{{currentDoctor.title}}</text>
							<view class="profile-rating">
								<view class="stars">
									<text class="star" v-for="n in 5" :key="n" :class="{active: n <= currentDoctor.rating}">★</text>
								</view>
								<text class="rating-value">{{currentDoctor.rating}}</text>
							</view>
						</view>
					</view>
					
					<view class="profile-detail">
						<view class="detail-item">
							<text class="detail-label">专业擅长</text>
							<text class="detail-value">{{currentDoctor.specialty}}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">可预约时段 ({{ selectedDate ? selectedDate.fullDate : '' }})</text>
							<view class="time-grid">
								<view v-if="currentDoctor.isLoadingSlots" class="loading-state mini">
									<text class="loading-text">号源加载中...</text>
								</view>
								<view v-else-if="currentDoctor.availableSlots && currentDoctor.availableSlots.length > 0" class="slots-wrapper">
									<view 
										class="time-block" 
										v-for="(slot, slotIndex) in currentDoctor.availableSlots" 
										:key="slotIndex"
										@tap="selectSlotInPopup(slot)"
									>
										<text :class="{ selected: isSlotSelectedInPopup(slot) }">{{slot}}</text>
									</view>
								</view>
								<view v-else class="no-slots">
									<text>暂无号源</text>
								</view>
							</view>
						</view>
					</view>
					
					<button 
						class="book-button" 
						:disabled="!selectedTimeInPopup"
						:class="{disabled: !selectedTimeInPopup}"
						@tap="submitAppointment"
					>
						确认预约
					</button>
				</scroll-view>
			</view>
		</view>

		<!-- 预约成功弹窗 -->
		<view class="modal appointment-success" v-if="showAppointmentSuccess">
			<view class="modal-mask" @tap="hideAppointmentSuccess"></view>
			<view class="modal-content">
				<image src="/static/images/success.png" mode="aspectFit" class="success-icon"></image>
				<text class="success-title">预约成功</text>
				<view class="success-info">
					<view class="info-item">
						<text class="info-label">就诊科室：</text>
						<text class="info-value">{{appointmentResult.department}}</text>
					</view>
					<view class="info-item">
						<text class="info-label">就诊医生：</text>
						<text class="info-value">{{appointmentResult.doctorName}}</text>
					</view>
					<view class="info-item">
						<text class="info-label">就诊时间：</text>
						<text class="info-value">{{appointmentResult.date}} {{appointmentResult.time}}</text>
					</view>
					<view class="info-item">
						<text class="info-label">就诊地点：</text>
						<text class="info-value">{{appointmentResult.location}}</text>
					</view>
				</view>
				<view class="success-reminder">
					<text>请于预约时间前十分钟左右，携带校园卡或身份证到诊室门口等待叫号。</text>
				</view>
				<view class="success-actions">
					<view class="action-btn primary" @tap="hideAppointmentSuccess">完成</view>
				</view>
			</view>
		</view>

		<!-- 预约详情弹窗 -->
		<view class="modal appointment-detail" v-if="showAppointmentDetail">
			<view class="modal-mask" @tap="hideAppointmentDetail"></view>
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">预约详情</text>
					<view class="modal-close" @tap="hideAppointmentDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="detail-content">
					<view class="detail-status" :class="currentAppointmentStatusClass">
						<text>{{currentAppointment.status}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">就诊科室：</text>
						<text class="detail-value">{{currentAppointment.department}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">就诊医生：</text>
						<text class="detail-value">{{currentAppointment.doctorName}} {{currentAppointment.doctorTitle}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">就诊时间：</text>
						<text class="detail-value">{{currentAppointment.date}} {{currentAppointment.time}}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">就诊地点：</text>
						<text class="detail-value">{{currentAppointment.location}}</text>
					</view>
					<view class="detail-actions" v-if="currentAppointment.status === '待就诊'">
						<button class="action-btn" @tap="confirmCancelAppointment">取消预约</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 就诊记录详情弹窗 -->
		<view class="modal medical-record-detail" v-if="showMedicalRecordDetail">
			<view class="modal-mask" @tap="hideMedicalRecordDetail"></view>
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">就诊记录详情</text>
					<view class="modal-close" @tap="hideMedicalRecordDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="detail-content" v-if="isLoadingRecordDetail">
					<view class="loading-state">
						<uni-load-more status="loading"></uni-load-more>
					</view>
				</view>
				<scroll-view scroll-y="true" class="detail-scroll-view" v-else-if="currentMedicalRecord.billno">
					<view class="detail-content">
						<view class="detail-item">
							<text class="detail-label">诊断结果：</text>
							<text class="detail-value bold">{{currentMedicalRecord.lb77_diagnosis}}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">就诊医生：</text>
							<text class="detail-value">{{currentMedicalRecord.lb77_doctor_name}}
								{{currentMedicalRecord.lb77_doctor_lb77_title}}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">就诊日期：</text>
							<text class="detail-value">{{(currentMedicalRecord.lb77_fdate || '').split(' ')[0]}}</text>
						</view>
						<view class="detail-item advice-item">
							<text class="detail-label">医嘱：</text>
							<text class="detail-value advice">{{currentMedicalRecord.lb77_advice || '无'}}</text>
						</view>

						<!-- 药品处方 -->
						<view class="prescription-section">
							<view class="section-title">
								<text>药品处方</text>
							</view>
							<view v-if="currentMedicalRecord.entryentity && currentMedicalRecord.entryentity.length > 0"
								class="prescription-list">
								<view class="prescription-item" v-for="(med, index) in currentMedicalRecord.entryentity"
									:key="index">
									<view class="med-header">
										<text class="med-name">{{med.lb77_medicine_name}}</text>
										<text class="med-spec">{{med.lb77_medicine_lb77_specification}}
											({{med.lb77_medicine_lb77_dosage_form}})</text>
									</view>
									<text class="med-usage">用法：{{med.lb77_usage}}</text>
									<text class="med-quantity">数量：{{med.lb77_quantity}} {{med.lb77_unit_name}}</text>
								</view>
							</view>
							<view v-else class="empty-prescription">
								<text>本次就诊无处方药品</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入金蝶API服务
	import KingdeeAgentService from '@/services/kingdeeAgent.js';

	// 科室图标映射
	const departmentIconMap = {
		'内科': '/static/images/dept-internal.png',
		'外科': '/static/images/dept-surgery.png',
		'口腔科': '/static/images/dept-dental.png',
		'眼科': '/static/images/dept-eye.png',
		'耳鼻喉科': '/static/images/dept-ent.png',
		'皮肤科': '/static/images/dept-derma.png',
		'心理咨询': '/static/images/dept-psychology.png',
		'中医科': '/static/images/dept-chinese.png',
	};
	// 医生默认头像列表
	const doctorAvatars = [
		'/static/images/doctor1.png',
		'/static/images/doctor2.png',
		'/static/images/doctor3.png',
	];

	export default {
		data() {
			return {
				tabs: ['预约挂号', '我的预约', '健康档案'],
				currentTab: 0,
				departments: [],
				doctorsList: [],
				availableDates: [],
				selectedDepartment: null,
				selectedDate: null,
				
				// 弹窗相关
				showDoctorDetailPopup: false,
				currentDoctor: {},
				selectedTimeInPopup: null,
				
				isLoadingDepartments: true,
				isLoadingDoctors: false,
				appointmentStatusList: ['全部', '待就诊', '已完成', '已取消'],
				currentStatusTab: 0,
				myAppointments: [],
				isLoadingAppointments: true,
				currentUser: {
					studentId: '645730151',
					name: '张三'
				},
				healthRecordTypes: [
					{ name: '就诊记录', icon: '/static/images/record-visit.png' },
					{ name: '体检报告', icon: '/static/images/record-exam.png' },
					{ name: '疫苗接种', icon: '/static/images/record-vaccine.png' },
				],
				currentRecordType: 0,
				medicalRecords: [],
				isLoadingMedicalRecords: false,
				examReports: [
					{
						id: 1,
						title: '2023学年入学体检',
						date: '2023-09-01',
						summary: '体检各项指标正常，无异常发现',
						location: '校医院体检中心',
						status: '正常'
					},
				],
				vaccineRecords: [
					{
						id: 1,
						name: '流感疫苗',
						status: '已接种',
						date: '2023-10-15',
						location: '校医院预防接种门诊',
						batch: 'FL202310A'
					},
				],
				showAppointmentSuccess: false,
				showAppointmentDetail: false,
				showMedicalRecordDetail: false,
				currentAppointment: {},
				currentMedicalRecord: {},
				isLoadingRecordDetail: false,
				appointmentResult: {}
			}
		},
		computed: {
			filteredAppointments() {
				let appointmentsToFilter = this.myAppointments;
				if (this.currentStatusTab !== 0) {
					const statusMap = { 1: '已预约', 2: '已完成', 3: '已取消' };
					const statusFilter = statusMap[this.currentStatusTab];
					appointmentsToFilter = this.myAppointments.filter(item => item.status === statusFilter);
				}
				return appointmentsToFilter.map(appointment => ({
					...appointment,
					department: appointment.departmentName || this.getDepartmentNameByNumber(appointment.dept_number),
					doctorName: appointment.doctorName || appointment.doctor_name,
					doctorTitle: appointment.doctorTitle || appointment.title,
					date: appointment.appointment_date,
					time: this.secondsToTime(appointment.start_time_sec),
					location: '校医院 ' + (appointment.departmentName || this.getDepartmentNameByNumber(appointment.dept_number)),
					status: appointment.status === '已预约' ? '待就诊' : appointment.status,
					statusClass: this.getStatusClass(appointment.status)
				}));
			},
			currentAppointmentStatusClass() {
				if (this.currentAppointment && this.currentAppointment.status) {
					return this.getStatusClass(this.currentAppointment.status);
				}
				return '';
			}
		},
		async onLoad(options) {
			this.generateAvailableDates();
			this.fetchMyAppointments();
			this.fetchMedicalRecords();

			this.examReports = this.examReports.map(report => ({
				...report,
				statusClass: this.getReportStatusClass(report.status)
			}));
			this.vaccineRecords = this.vaccineRecords.map(vaccine => ({
				...vaccine,
				statusClass: this.getVaccineStatusClass(vaccine.status)
			}));

			// 默认加载，会选中第一个科室并加载其医生列表
			await this.fetchDepartments();

			// 在默认数据加载后处理深度链接
			if (options && options.departmentId && options.recommendDoctorId) {
				const department = this.departments.find(d => d.number === options.departmentId);
				if (department) {
					// 如果目标科室不是当前已选中的科室，则切换科室并等待医生列表加载
					if (!this.selectedDepartment || this.selectedDepartment.number !== department.number) {
						await this.selectDepartment(department);
					}

					// 现在正确的医生列表已加载，查找推荐的医生
					const doctor = this.doctorsList.find(doc => doc.id === options.recommendDoctorId);
					if (doctor) {
						this.$nextTick(() => {
							this.showDoctorDetail(doctor);
						});
					} else {
						console.warn(`在科室 ${department.name} 未找到ID为 ${options.recommendDoctorId} 的医生`);
						uni.showToast({
							title: '未在该科室找到推荐医生',
							icon: 'none'
						});
					}
				} else {
					console.warn(`未找到ID为 ${options.departmentId} 的科室`);
					uni.showToast({
						title: '未找到推荐的科室',
						icon: 'none'
					});
				}
			}
		},
		methods: {
			// ===================================================================
			// ========================== 数据获取与处理 ==========================
			// ===================================================================
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
				// 默认选中今天
				if(this.availableDates.length > 0) {
					this.selectDate(this.availableDates[0]);
				}
			},
			async fetchDepartments() {
				this.isLoadingDepartments = true;
				try {
					const token = uni.getStorageSync('token');
					const res = await uni.request({
						url: 'http://localhost:3000/api/medical/departments',
						method: 'GET',
						header: token ? { 'Authorization': `Bearer ${token}` } : {}
					});
					if (res.data && res.data.success) {
						this.departments = (res.data.data || []).map(d => ({
							number: d.dept_number,
							name: d.name,
							description: d.description
						}));
						// 默认选中第一个科室
						if (this.departments.length > 0) {
							await this.selectDepartment(this.departments[0]);
						}
					}
				} catch (error) {
					console.error("获取科室列表失败:", error);
					uni.showToast({
						title: '科室加载失败',
						icon: 'none'
					});
				} finally {
					this.isLoadingDepartments = false;
				}
			},
			async fetchDoctors(departmentNumber) {
				this.isLoadingDoctors = true;
				this.doctorsList = [];
				try {
					const token = uni.getStorageSync('token');
					const res = await uni.request({
						url: `http://localhost:3000/api/medical/departments/${departmentNumber}/doctors`,
						method: 'GET',
						header: token ? { 'Authorization': `Bearer ${token}` } : {}
					});
					if (res.data && res.data.success) {
						this.doctorsList = (res.data.data || []).map((doc, index) => ({
							id: doc.id,
							number: doc.doctor_number,
							name: doc.name,
							title: doc.title,
							specialty: doc.specialty,
							avatar: doctorAvatars[index % doctorAvatars.length],
							rating: (4.5 + Math.random() * 0.5).toFixed(1),
							ratingCount: Math.floor(Math.random() * 200) + 50,
							availableSlots: [],
							isLoadingSlots: true 
						}));
						this.updateAllDoctorSchedules(); 
					}
				} catch (error) {
					console.error("获取医生列表失败:", error);
					uni.showToast({
						title: '医生加载失败',
						icon: 'none'
					});
				} finally {
					this.isLoadingDoctors = false;
				}
			},
			async updateAllDoctorSchedules() {
				if (!this.selectedDate) return;
				const schedulePromises = this.doctorsList.map(doctor => this.updateDoctorSchedule(doctor));
				await Promise.all(schedulePromises);
			},
			async updateDoctorSchedule(doctor) {
				this.$set(doctor, 'isLoadingSlots', true);
				this.$set(doctor, 'availableSlots', []);
				try {
					const token = uni.getStorageSync('token');
					const res = await uni.request({
						url: `http://localhost:3000/api/medical/doctors/${doctor.number}/schedule`,
						method: 'GET',
						header: token ? { 'Authorization': `Bearer ${token}` } : {}
					});
					const rows = (res.data && res.data.success) ? (res.data.data || []) : [];
					const slots = rows
						.filter(r => r.day_of_week === this.selectedDate.weekday)
						.map(r => r.start_time_sec);
					const availableSlots = slots.map(sec => this.secondsToTime(sec));
					this.$set(doctor, 'availableSlots', availableSlots);
				} catch (error) {
					console.error(`获取医生 ${doctor.name} 的排班失败:`, error);
					this.$set(doctor, 'availableSlots', []);
				} finally {
					this.$set(doctor, 'isLoadingSlots', false);
				}
			},

			// ===================================================================
			// ========================= 预约挂号页面事件 ========================
			// ===================================================================
			async selectDepartment(dept) {
				if (this.selectedDepartment && this.selectedDepartment.number === dept.number) return;
				this.selectedDepartment = dept;
				await this.fetchDoctors(dept.number);
			},
			selectDate(date) {
				if (this.selectedDate && this.selectedDate.fullDate === date.fullDate) return;
				this.selectedDate = date;
				if (this.doctorsList.length > 0) {
					this.updateAllDoctorSchedules();
				}
			},
			showDoctorDetail(doctor) {
				this.currentDoctor = doctor;
				this.selectedTimeInPopup = null; // 重置时间选择
				this.showDoctorDetailPopup = true;
			},
			hideDoctorDetail() {
				this.showDoctorDetailPopup = false;
			},
			selectSlotInPopup(time) {
				this.selectedTimeInPopup = time;
			},
			isSlotSelectedInPopup(time) {
				return this.selectedTimeInPopup === time;
			},
			async submitAppointment() {
				if (!this.currentDoctor.number || !this.selectedTimeInPopup) {
					uni.showToast({
						title: '请选择预约时间',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '正在提交...'
				});
				try {
					const timeParts = this.selectedTimeInPopup.split(':');
					const startTimeInSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60;
					const endTimeInSeconds = startTimeInSeconds + 15 * 60;
					const token = uni.getStorageSync('token');
					const res = await uni.request({
						url: 'http://localhost:3000/api/medical/appointments',
						method: 'POST',
						header: token ? { 'Authorization': `Bearer ${token}` } : {},
						data: {
							studentId: this.currentUser.studentId,
							doctorNumber: this.currentDoctor.number,
							date: this.selectedDate.fullDate,
							startTimeSec: startTimeInSeconds,
							endTimeSec: endTimeInSeconds
						}
					});
					if (res.data && res.data.success) {
						uni.hideLoading();
						this.hideDoctorDetail();
						this.appointmentResult = {
							department: this.selectedDepartment.name,
							doctorName: this.currentDoctor.name,
							date: this.selectedDate.fullDate,
							time: this.selectedTimeInPopup,
							location: `校医院 ${this.selectedDepartment.name}`
						};
						this.showAppointmentSuccess = true;
						this.fetchMyAppointments();
						this.updateAllDoctorSchedules();
					} else {
						throw new Error((res.data && res.data.message) || '预约失败');
					}
				} catch (error) {
					uni.hideLoading();
					console.error("创建预约失败:", error);
					uni.showToast({
						title: error.message || '预约失败，该时段可能已被预约',
						icon: 'none'
					});
					this.updateAllDoctorSchedules();
				}
			},

			// ===================================================================
			// ========================= 其他页面和通用事件 ========================
			// ===================================================================
			switchTab(index) {
				this.currentTab = index;
			},
			async fetchMyAppointments() {
				this.isLoadingAppointments = true;
				try {
					const token = uni.getStorageSync('token');
					const res = await uni.request({
						url: `http://localhost:3000/api/medical/my/appointments?studentId=${this.currentUser.studentId}`,
						method: 'GET',
						header: token ? { 'Authorization': `Bearer ${token}` } : {}
					});
					if (res.data && res.data.success) {
						const depts = this.departments || [];
						const deptNameByNum = (n) => (depts.find(d => d.number === n)?.name) || n || '门诊部';
						const rows = res.data.data || [];
						this.myAppointments = rows.map(r => ({
							id: r.id,
							departmentName: deptNameByNum(r.dept_number),
							doctorName: r.doctor_name || '',
							doctorTitle: r.title || '',
							appointment_date: r.appointment_date,
							start_time_sec: r.start_time_sec,
							status: r.status,
							dept_number: r.dept_number
						})).sort((a, b) => {
							const dateA = new Date(a.appointment_date).getTime();
							const dateB = new Date(b.appointment_date).getTime();
							if (dateB !== dateA) return dateB - dateA;
							return b.start_time_sec - a.start_time_sec;
						});
					} else {
						this.myAppointments = [];
					}
				} catch (error) {
					console.error("获取我的预约记录失败:", error);
					uni.showToast({
						title: '预约记录加载失败',
						icon: 'none'
					});
				} finally {
					this.isLoadingAppointments = false;
				}
			},
			async fetchMedicalRecords() {
				if (!this.currentUser || !this.currentUser.studentId) return;
				this.isLoadingMedicalRecords = true;
				try {
					const res = await KingdeeAgentService.getMedicalRecords(this.currentUser.studentId);
					if (res && res.data && Array.isArray(res.data.rows)) {
						this.medicalRecords = res.data.rows.map(record => ({
							...record,
							disease: record.lb77_diagnosis,
							date: (record.lb77_fdate || '').split(' ')[0],
							doctorName: record.lb77_doctor_name,
							doctorTitle: record.lb77_doctor_lb77_title,
							description: record.lb77_advice || '暂无医嘱详情',
						}));
					}
				} catch (error) {
					console.error("获取就诊记录失败:", error);
					uni.showToast({
						title: '就诊记录加载失败',
						icon: 'none'
					});
				} finally {
					this.isLoadingMedicalRecords = false;
				}
			},
			async cancelAppointment(appointment) {
				uni.showModal({
					title: '取消预约',
					content: '确定要取消此次预约吗？',
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '正在取消...'
							});
							try {
								const token = uni.getStorageSync('token');
								const apiRes = await uni.request({
									url: `http://localhost:3000/api/medical/appointments/${appointment.id}/cancel`,
									method: 'POST',
									header: token ? { 'Authorization': `Bearer ${token}` } : {},
									data: { studentId: this.currentUser.studentId }
								});
								if (apiRes.data && apiRes.data.success) {
									uni.hideLoading();
									uni.showToast({
										title: '预约已取消',
										icon: 'success'
									});
									this.fetchMyAppointments();
									if (this.showAppointmentDetail) {
										this.hideAppointmentDetail();
									}
								} else {
									throw new Error((apiRes.data && apiRes.data.message) || '取消失败');
								}
							} catch (error) {
								uni.hideLoading();
								console.error('取消预约失败:', error);
								uni.showToast({
									title: error.message || '取消操作失败',
									icon: 'none'
								});
							}
						}
					}
				});
			},
			hideAppointmentSuccess() {
				this.showAppointmentSuccess = false;
				this.currentTab = 1;
				this.currentStatusTab = 1;
			},
			switchStatusTab(index) {
				this.currentStatusTab = index;
			},
			viewAppointmentDetail(appointment) {
				this.currentAppointment = appointment;
				this.showAppointmentDetail = true;
			},
			hideAppointmentDetail() {
				this.showAppointmentDetail = false;
			},
			confirmCancelAppointment() {
				this.cancelAppointment(this.currentAppointment);
			},
			secondsToTime(seconds) {
				if (isNaN(seconds)) return '';
				const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
				const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
				return `${h}:${m}`;
			},
			formatDate(date, fmt) {
				const o = {
					"M+": date.getMonth() + 1,
					"d+": date.getDate(),
				};
				if (/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
				for (let k in o) {
					if (new RegExp("(" + k + ")").test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (("00" + o[k]).substr(("" + o[k]).length)));
					}
				}
				return fmt;
			},
			getStatusClass(status) {
				switch (status) {
					case '已预约':
					case '待就诊':
						return 'status-pending';
					case '已完成':
						return 'status-completed';
					case '已取消':
						return 'status-canceled';
					default:
						return '';
				}
			},
			switchRecordType(index) {
				this.currentRecordType = index;
			},
			async viewRecordDetail(record) {
				this.isLoadingRecordDetail = true;
				this.showMedicalRecordDetail = true;
				this.currentMedicalRecord = {};
				try {
					const res = await KingdeeAgentService.getMedicalRecordDetails(record.billno);
					if (res && res.data && res.data.rows && res.data.rows.length > 0) {
						this.currentMedicalRecord = res.data.rows[0];
					} else {
						throw new Error('未找到该条记录的详细信息');
					}
				} catch (error) {
					console.error("获取就诊记录详情失败:", error);
					uni.showToast({
						title: error.message || '加载详情失败',
						icon: 'none'
					});
					this.hideMedicalRecordDetail();
				} finally {
					this.isLoadingRecordDetail = false;
				}
			},
			hideMedicalRecordDetail() {
				this.showMedicalRecordDetail = false;
				this.currentMedicalRecord = {};
			},
			
			viewExamReport(report) {
				uni.showToast({ title: '查看报告: ' + report.title, icon: 'none' });
			},
			getReportStatusClass(status) {
				switch(status) {
					case '正常': return 'status-normal';
					case '异常': return 'status-abnormal';
					default: return '';
				}
			},
			reserveVaccine(vaccine) {
				uni.showToast({ title: '预约接种: ' + vaccine.name, icon: 'none' });
			},
			getVaccineStatusClass(status) {
				switch(status) {
					case '已接种': return 'status-vaccinated';
					case '未接种': return 'status-unvaccinated';
					default: return '';
				}
			},
			getDepartmentNameByNumber(number) {
				const department = this.departments.find(d => d.number === number);
				return department ? department.name : number;
			}
		}
	}
</script>

<style>
	/* 全局背景和基础布局 */
	.medical-page {
		background-color: #f7f8fa;
		min-height: 100vh;
	}

	.tab-content {
		padding: 20rpx;
	}
	
	.loading-state {
		padding: 40rpx 0;
	}
	
	.loading-state.mini {
		padding: 20rpx 0;
	}
	
	.loading-text {
		font-size: 24rpx;
		color: #999;
	}
	
	.empty-state.small {
		padding: 40rpx 0;
		text-align: center;
	}
	.empty-state.small .empty-text {
		font-size: 26rpx;
	}

	/* 顶部Banner */
	.medical-banner {
		position: relative;
		height: 280rpx;
		background: linear-gradient(to right, #4c87e8, #6d9eeb);
		display: flex;
		align-items: center;
		padding: 0 40rpx;
	}

	.banner-content {
		color: #ffffff;
	}

	.banner-title {
		font-size: 44rpx;
		font-weight: bold;
		margin-bottom: 15rpx;
		display: block;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	.banner-subtitle {
		font-size: 28rpx;
		display: block;
		opacity: 0.9;
	}

	/* 主导航栏 */
	.nav-tabs {
		display: flex;
		background-color: #ffffff;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.04);
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 25rpx 0;
		font-size: 30rpx;
		color: #666;
		position: relative;
		transition: color 0.2s;
	}

	.tab-item.active {
		color: #007aff;
		font-weight: bold;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 6rpx;
		background-color: #007aff;
		border-radius: 3rpx;
	}

	/* 通用Section标题 */
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		padding-left: 16rpx;
		border-left: 6rpx solid #007aff;
	}
	
	/* 科室选择 */
	.section-departments {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}
	.departments-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}
	.department-item {
		padding: 12rpx 24rpx;
		border-radius: 30rpx;
		background-color: #f5f5f5;
		color: #555;
		font-size: 26rpx;
		transition: all 0.2s ease;
	}
	.department-item.active {
		background-color: #007aff;
		color: #fff;
		font-weight: bold;
	}

	/* 日期选择 */
	.section-date {
		background-color: #fff;
		padding: 20rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}
	.date-selector {
		display: flex;
		align-items: center;
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
		padding: 16rpx 0;
		border-radius: 10rpx;
		width: 110rpx;
		flex-shrink: 0;
	}
	.date-item.active {
		background-color: #e6f2ff;
	}
	.date-item.active .date-day,
	.date-item.active .date-weekday {
		color: #007aff;
		font-weight: bold;
	}
	.date-day {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
	}
	.date-weekday {
		font-size: 24rpx;
		color: #666;
		margin-top: 8rpx;
	}
	
	/* 医生列表 */
	.doctors-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	.doctor-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.06);
		display: flex;
		align-items: center;
	}
	.doctor-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		flex-shrink: 0;
	}
	.doctor-info {
		flex: 1;
		min-width: 0;
	}
	.doctor-header {
		display: flex;
		align-items: baseline;
		margin-bottom: 8rpx;
	}
	.doctor-name {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
		margin-right: 12rpx;
	}
	.doctor-title {
		font-size: 26rpx;
		color: #666;
	}
	.doctor-specialty-list {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.doctor-rating {
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
	.rating-text {
		font-size: 22rpx;
		color: #999;
	}
	.book-btn-list {
		background-color: #007aff;
		color: #fff;
		font-size: 26rpx;
		padding: 10rpx 30rpx;
		border-radius: 30rpx;
		margin-left: 20rpx;
		white-space: nowrap;
	}
	
	/* 弹窗 */
	.doctor-detail-popup {
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
		max-height: 85vh;
		display: flex;
		flex-direction: column;
	}
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1px solid #f0f0f0;
		flex-shrink: 0;
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
		overflow-y: auto;
		flex: 1;
	}
	.doctor-profile-popup {
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
	.profile-rating {
		display: flex;
		align-items: center;
	}
	.profile-rating .rating-value {
		font-size: 24rpx;
		color: #333;
		margin-left: 10rpx;
	}
	.profile-detail .detail-item {
		margin-bottom: 30rpx;
	}
	.detail-label {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 15rpx;
		display: block;
	}
	.detail-value {
		font-size: 26rpx;
		color: #666;
		line-height: 1.5;
	}

	/* 弹窗内时间网格 */
	.time-grid {
		display: flex;
		flex-wrap: wrap;
		margin: 0 -8rpx;
	}
	.slots-wrapper {
		display: contents; 
	}
	.time-block {
		width: 25%;
		box-sizing: border-box;
		padding: 8rpx;
	}
	.time-block text {
		display: block;
		text-align: center;
		padding: 16rpx 0;
		background-color: #f5f5f5;
		color: #333;
		border-radius: 8rpx;
		font-size: 28rpx;
		transition: all 0.2s ease;
	}
	.time-block text.selected {
		background-color: #007aff;
		color: #fff;
		font-weight: bold;
	}
	.no-slots, .loading-state.mini {
		width: 100%;
		text-align: center;
		padding: 20rpx 0;
		font-size: 24rpx;
		color: #999;
	}
	.book-button {
		background-color: #007aff;
		color: #fff;
		padding: 24rpx 0;
		text-align: center;
		border-radius: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		margin-top: 40rpx;
		box-shadow: 0 8rpx 16rpx rgba(0,122,255,0.2);
	}
	.book-button.disabled {
		background-color: #cccccc;
		box-shadow: none;
	}
	
	/* 我的预约页样式 (部分调整) */
	.appointment-status-tabs {
		display: flex;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	
	.status-tab {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #666;
		position: relative;
	}
	
	.status-tab.active {
		color: #007AFF;
		font-weight: bold;
	}
	
	.status-tab.active::after {
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
	
	.appointment-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.appointment-card {
		background-color: #FFFFFF;
		border-radius: 16rpx;
		padding: 24rpx;
	}
	
	.appointment-info {
		margin-bottom: 20rpx;
	}
	
	.appointment-dept {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}
	
	.appointment-doctor {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 15rpx;
		display: block;
	}
	
	.appointment-time, .appointment-location {
		display: flex;
		align-items: center;
		margin-top: 10rpx;
		font-size: 26rpx;
		color: #666;
	}
	
	.appointment-time image, .appointment-location image {
		width: 28rpx;
		height: 28rpx;
		margin-right: 10rpx;
	}
	
	.appointment-action {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1rpx solid #f0f0f0;
		padding-top: 20rpx;
	}
	
	.appointment-status {
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
	}
	
	.status-pending {
		background-color: #e6f2ff;
		color: #007AFF;
	}
	
	.status-completed {
		background-color: #e6fff2;
		color: #00B578;
	}
	
	.status-canceled {
		background-color: #f5f5f5;
		color: #999;
	}
	
	.status-normal {
		background-color: #e6fff2;
		color: #00B578;
	}
	
	.status-abnormal {
		background-color: #fff1f0;
		color: #FF3B30;
	}
	
	.status-vaccinated {
		background-color: #e6fff2;
		color: #00B578;
	}
	
	.status-unvaccinated {
		background-color: #fff9e6;
		color: #FF9500;
	}
	
	.action-btn {
		background-color: #f5f5f5;
		font-size: 24rpx;
		color: #666;
		padding: 10rpx 20rpx;
		margin-left: 10rpx;
		border-radius: 6rpx;
	}
	
	.action-btn.primary {
		background-color: #007AFF;
		color: #FFFFFF;
	}
	
	/* 健康档案页样式 (部分调整) */
	.records-type-tabs {
		display: flex;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		justify-content: space-around;
	}
	
	.record-type {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10rpx 0;
		position: relative;
	}
	
	.record-type.active {
		color: #007AFF;
		font-weight: bold;
	}
	
	.record-type.active::after {
		content: '';
		position: absolute;
		bottom: -10rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: #007AFF;
		border-radius: 2rpx;
	}
	
	.record-type image {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}
	
	.record-type text {
		font-size: 24rpx;
		color: #666;
	}
	
	.timeline {
		padding: 20rpx 0;
	}
	
	.timeline-item {
		position: relative;
		padding-left: 30rpx;
		padding-bottom: 40rpx;
	}
	
	.timeline-item:last-child {
		padding-bottom: 0;
	}
	
	.timeline-item:before {
		content: '';
		position: absolute;
		top: 20rpx;
		left: 10rpx;
		width: 2rpx;
		height: calc(100% - 20rpx);
		background-color: #e0e0e0;
	}
	
	.timeline-item:last-child:before {
		display: none;
	}
	
	.timeline-dot {
		position: absolute;
		left: 0;
		top: 16rpx;
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: #007AFF;
		z-index: 1;
	}
	
	.timeline-content {
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx;
	}
	
	.record-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}
	
	.record-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.record-date {
		font-size: 24rpx;
		color: #999;
	}
	
	.record-doctor {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 10rpx;
	}
	
	.record-desc {
		font-size: 26rpx;
		color: #333;
		margin-bottom: 15rpx;
		line-height: 1.5;
	}
	
	/* 体检报告样式 */
	.report-card {
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
	}
	
	.report-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}
	
	.report-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.report-date {
		font-size: 24rpx;
		color: #999;
	}
	
	.report-summary {
		display: flex;
		margin-bottom: 15rpx;
	}
	
	.summary-label {
		font-size: 26rpx;
		color: #666;
		margin-right: 10rpx;
	}
	
	.summary-content {
		font-size: 26rpx;
		color: #333;
		flex: 1;
	}
	
	.report-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1rpx solid #f0f0f0;
		padding-top: 15rpx;
	}
	
	.report-location {
		font-size: 24rpx;
		color: #999;
	}
	
	.report-status {
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
	}
	
	/* 疫苗接种样式 */
	.vaccine-card {
		background-color: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
	}
	
	.vaccine-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}
	
	.vaccine-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}
	
	.vaccine-status {
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
	}
	
	.vaccine-info {
		margin-bottom: 20rpx;
	}
	
	.vaccine-item {
		display: flex;
		margin-bottom: 10rpx;
	}
	
	.item-label {
		font-size: 26rpx;
		color: #666;
		width: 160rpx;
	}
	
	.item-value {
		font-size: 26rpx;
		color: #333;
		flex: 1;
	}
	
	.vaccine-btn {
		background-color: #007AFF;
		color: #FFFFFF;
		font-size: 26rpx;
		padding: 10rpx 30rpx;
		border-radius: 30rpx;
		display: inline-block;
	}

	/* 空状态样式 */
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
	}

	/* 弹窗通用样式 */
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.modal-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.5);
	}
	
	.modal-content {
		position: relative;
		z-index: 1000;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		width: 85%;
	}
	
	/* 预约成功弹窗 */
	.appointment-success .modal-content {
		padding: 30rpx 50rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80%;
	}
	
	.success-icon {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 20rpx;
	}
	
	.success-title {
		font-size: 38rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}
	
	.success-info {
		width: 100%;
		margin-bottom: 30rpx;
		border-top: 1rpx solid #f0f0f0;
		padding-top: 30rpx;
	}
	
	.info-item {
		display: flex;
		margin-bottom: 20rpx;
		align-items: baseline;
	}
	
	.info-label {
		font-size: 28rpx;
		color: #888;
		width: 160rpx;
		flex-shrink: 0;
	}
	
	.info-value {
		font-size: 28rpx;
		color: #333;
		flex: 1;
		font-weight: bold;
	}
	
	.success-reminder {
		font-size: 24rpx;
		color: #888;
		line-height: 1.5;
		text-align: center;
		margin-bottom: 40rpx;
		padding: 0 10rpx;
	}
	
	.success-actions {
		width: 100%;
	}
	
	.success-actions .action-btn.primary {
		width: 100%;
		text-align: center;
		padding: 20rpx 0;
		border-radius: 40rpx;
		background-color: #007AFF;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		box-shadow: 0 6rpx 12rpx rgba(0, 122, 255, 0.2);
		transition: background-color 0.2s;
	}
	
	.success-actions .action-btn.primary:active {
		background-color: #0056b3;
	}
	
	/* 详情类弹窗 */
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.modal-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.modal-close {
		width: 40rpx;
		height: 40rpx;
	}
	
	.modal-close image {
		width: 100%;
		height: 100%;
	}
	
	.detail-content {
		padding: 30rpx;
	}
	
	.detail-status {
		display: inline-block;
		font-size: 26rpx;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
		margin-bottom: 20rpx;
	}
	
	.detail-item {
		margin-bottom: 20rpx;
	}
	
	.detail-label {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 6rpx;
		display: block;
	}
	
	.detail-value {
		font-size: 28rpx;
		color: #333;
	}
	
	.detail-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 30rpx;
	}
	
	.detail-actions .action-btn {
		margin-left: 20rpx;
	}
	
	/* 就诊记录详情弹窗特定样式 */
	.medical-record-detail .modal-content {
		max-height: 80vh;
		display: flex;
		flex-direction: column;
	}
	
	.detail-scroll-view {
		max-height: calc(80vh - 100rpx);
		box-sizing: border-box;
	}
	
	.medical-record-detail .detail-value.bold {
		font-weight: bold;
	}
	
	.medical-record-detail .advice {
		background-color: #f9f9f9;
		padding: 15rpx;
		border-radius: 8rpx;
		display: block;
		line-height: 1.6;
		white-space: pre-wrap;
	}
	
	.medical-record-detail .advice-item {
		margin-bottom: 25rpx;
	}
	
	.prescription-section .section-title {
		padding-left: 0;
		border-left: none;
		font-size: 28rpx;
		margin-bottom: 15rpx;
	}
	
	.prescription-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.prescription-item {
		background-color: #f5f5f5;
		border-radius: 10rpx;
		padding: 15rpx;
		font-size: 24rpx;
	}
	
	.med-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}
	
	.med-name {
		font-weight: bold;
		color: #333;
		font-size: 26rpx;
	}
	
	.med-spec,
	.med-usage,
	.med-quantity,
	.med-notes,
	.med-manufacturer {
		color: #666;
		line-height: 1.5;
		display: block;
	}
	.empty-prescription {
		text-align: center;
		color: #999;
		padding: 30rpx 0;
	}
</style> 