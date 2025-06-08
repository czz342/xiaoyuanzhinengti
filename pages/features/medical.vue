<template>
	<view class="medical-page">
		<!-- 顶部banner -->
		<view class="medical-banner">
			<image src="/static/images/medical-banner.png" mode="aspectFill" class="banner-image"></image>
			<view class="banner-content">
				<text class="banner-title">校医预约</text>
				<text class="banner-subtitle">方便快捷的校园医疗服务</text>
			</view>
		</view>
		
		<!-- 主导航栏 -->
		<view class="nav-tabs">
			<view 
				class="tab-item" 
				v-for="(tab, index) in tabs" 
				:key="index" 
				:class="{ active: currentTab === index }"
				@tap="switchTab(index)"
			>
				<text>{{tab}}</text>
			</view>
		</view>
		
		<!-- 预约挂号内容 -->
		<view class="tab-content" v-if="currentTab === 0">
			<!-- 科室选择 -->
			<view class="section section-departments">
				<view class="section-title">
					<text>选择科室</text>
				</view>
				<view class="departments-list">
					<view 
						class="department-item" 
						v-for="(dept, index) in departments" 
						:key="index"
						:class="{ active: selectedDepartment === index }"
						@tap="selectDepartment(index)"
					>
						<image :src="dept.icon" mode="aspectFit" class="dept-icon"></image>
						<text class="dept-name">{{dept.name}}</text>
					</view>
				</view>
			</view>
			
			<!-- 日期选择 -->
			<view class="section section-date" v-if="selectedDepartment !== null">
				<view class="section-title">
					<text>选择日期</text>
				</view>
				<view class="date-selector">
					<view class="date-arrow" @tap="prevDate">
						<image src="/static/images/arrow-left.png" mode="aspectFit"></image>
					</view>
					<view class="dates">
						<view 
							class="date-item" 
							v-for="(date, dateIndex) in availableDates" 
							:key="dateIndex"
							:class="{ active: selectedDate === dateIndex }"
							@tap="selectDate(dateIndex)"
						>
							<text class="date-day">{{date.day}}</text>
							<text class="date-weekday">{{date.weekday}}</text>
						</view>
					</view>
					<view class="date-arrow" @tap="nextDate">
						<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			
			<!-- 医生列表 -->
			<view class="section section-doctors" v-if="selectedDate !== null">
				<view class="section-title">
					<text>选择医生</text>
				</view>
				<view class="doctors-list">
					<view 
						class="doctor-card" 
						v-for="(doctor, index) in doctorsList" 
						:key="index"
						@tap="selectDoctor(doctor)"
					>
						<image :src="doctor.avatar" mode="aspectFill" class="doctor-avatar"></image>
						<view class="doctor-info">
							<view class="doctor-header">
								<text class="doctor-name">{{doctor.name}}</text>
								<text class="doctor-title">{{doctor.title}}</text>
							</view>
							<text class="doctor-specialty">{{doctor.specialty}}</text>
							<view class="doctor-rating">
								<view class="stars">
									<text class="star" v-for="n in 5" :key="n" :class="{ active: n <= doctor.rating }">★</text>
								</view>
								<text class="rating-text">{{doctor.ratingCount}}人评价</text>
							</view>
						</view>
						<view class="doctor-schedule">
							<view class="schedule-label">可预约：</view>
							<view class="available-slots">
								<text 
									class="time-slot" 
									v-for="(slot, slotIndex) in doctor.availableSlots" 
									:key="slotIndex"
									@tap.stop="selectTimeSlot(doctor, slot, slotIndex)"
									:class="{ selected: isSelectedTimeSlot(doctor, slotIndex) }"
								>
									{{slot}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 提交按钮 -->
			<view class="submit-section" v-if="selectedDoctor && selectedTimeSlot !== null">
				<button class="submit-btn" @tap="submitAppointment">确认预约</button>
			</view>
		</view>
		
		<!-- 我的预约内容 -->
		<view class="tab-content" v-if="currentTab === 1">
			<view class="my-appointments">
				<view class="appointment-status-tabs">
					<view 
						class="status-tab" 
						v-for="(status, index) in appointmentStatusList" 
						:key="index"
						:class="{ active: currentStatusTab === index }"
						@tap="switchStatusTab(index)"
					>
						<text>{{status}}</text>
					</view>
				</view>
				
				<view class="appointment-list" v-if="myAppointments.length > 0">
					<view 
						class="appointment-card" 
						v-for="(appointment, index) in filteredAppointments" 
						:key="index"
						@tap="viewAppointmentDetail(appointment)"
					>
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
							<view 
								class="appointment-status" 
								:class="appointment.statusClass"
							>
								<text>{{appointment.status}}</text>
							</view>
							<button 
								class="action-btn" 
								v-if="appointment.status === '待就诊'"
								@tap.stop="cancelAppointment(appointment)"
							>
								取消预约
							</button>
							<button 
								class="action-btn primary" 
								v-if="appointment.status === '待就诊'"
								@tap.stop="navigateToClinic(appointment)"
							>
								前往就诊
							</button>
							<button 
								class="action-btn" 
								v-if="appointment.status === '已完成'"
								@tap.stop="viewMedicalRecord(appointment)"
							>
								查看病历
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
					<view 
						class="record-type" 
						v-for="(type, index) in healthRecordTypes" 
						:key="index"
						:class="{ active: currentRecordType === index }"
						@tap="switchRecordType(index)"
					>
						<image :src="type.icon" mode="aspectFit"></image>
						<text>{{type.name}}</text>
					</view>
				</view>
				
				<!-- 就诊记录 -->
				<view class="records-list" v-if="currentRecordType === 0">
					<view class="timeline">
						<view 
							class="timeline-item" 
							v-for="(record, index) in medicalRecords" 
							:key="index"
							@tap="viewRecordDetail(record)"
						>
							<view class="timeline-dot"></view>
							<view class="timeline-content">
								<view class="record-header">
									<text class="record-title">{{record.department}} - {{record.disease}}</text>
									<text class="record-date">{{record.date}}</text>
								</view>
								<text class="record-doctor">{{record.doctorName}} {{record.doctorTitle}}</text>
								<text class="record-desc">{{record.description}}</text>
								<view class="record-tags">
									<text class="tag" v-for="(tag, tagIndex) in record.tags" :key="tagIndex">{{tag}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- 体检报告 -->
				<view class="records-list" v-if="currentRecordType === 1">
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
				
				<!-- 疫苗接种 -->
				<view class="records-list" v-if="currentRecordType === 2">
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
				
				<!-- 药品清单 -->
				<view class="records-list" v-if="currentRecordType === 3">
					<view class="medication-list">
						<view 
							class="medication-item" 
							v-for="(medicine, index) in medications" 
							:key="index"
						>
							<image :src="medicine.image" mode="aspectFit" class="medicine-image"></image>
							<view class="medicine-info">
								<text class="medicine-name">{{medicine.name}}</text>
								<text class="medicine-usage">{{medicine.usage}}</text>
								<view class="medicine-prescription">
									<text class="prescription-date">处方日期：{{medicine.prescriptionDate}}</text>
									<text class="prescription-doctor">{{medicine.doctorName}}</text>
								</view>
							</view>
							<view class="medicine-actions">
								<button class="medicine-btn" @tap="viewMedicationDetail(medicine)">详情</button>
							</view>
						</view>
					</view>
				</view>
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
				<view class="success-notes">
					<text class="notes-title">就诊须知：</text>
					<text class="notes-content">请提前10分钟到达就诊地点，携带学生证和校园卡。如需取消预约，请提前4小时操作。</text>
				</view>
				<view class="success-actions">
					<button class="action-btn" @tap="addToCalendar">添加到日历</button>
					<button class="action-btn primary" @tap="hideAppointmentSuccess">完成</button>
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
					<view class="detail-item" v-if="currentAppointment.notes">
						<text class="detail-label">备注信息：</text>
						<text class="detail-value">{{currentAppointment.notes}}</text>
					</view>
					
					<view class="detail-actions" v-if="currentAppointment.status === '待就诊'">
						<button class="action-btn" @tap="rescheduleAppointment">改期</button>
						<button class="action-btn" @tap="confirmCancelAppointment">取消预约</button>
						<button class="action-btn primary" @tap="navigateToClinic(currentAppointment)">前往就诊</button>
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
			// 标签页管理
			tabs: ['预约挂号', '我的预约', '健康档案'],
			currentTab: 0,
			
			// 预约挂号数据
			departments: [
				{ name: '内科', icon: '/static/images/dept-internal.png' },
				{ name: '外科', icon: '/static/images/dept-surgery.png' },
				{ name: '口腔科', icon: '/static/images/dept-dental.png' },
				{ name: '眼科', icon: '/static/images/dept-eye.png' },
				{ name: '耳鼻喉科', icon: '/static/images/dept-ent.png' },
				{ name: '皮肤科', icon: '/static/images/dept-derma.png' },
				{ name: '心理咨询', icon: '/static/images/dept-psychology.png' },
				{ name: '中医科', icon: '/static/images/dept-chinese.png' },
			],
			selectedDepartment: null,
			selectedDate: null,
			selectedDoctor: null,
			selectedTimeSlot: null,
			selectedTimeSlotIndex: null,
			
			// 日期选择
			availableDates: [
				{ day: '15', weekday: '周一' },
				{ day: '16', weekday: '周二' },
				{ day: '17', weekday: '周三' },
				{ day: '18', weekday: '周四' },
				{ day: '19', weekday: '周五' },
			],
			
			// 医生列表（示例数据）
			doctorsList: [
				{
					id: 1,
					name: '张医生',
					title: '主任医师',
					specialty: '高血压、感冒、发热',
					avatar: '/static/images/doctor1.png',
					rating: 4.8,
					ratingCount: 126,
					availableSlots: ['08:30', '09:00', '10:30', '15:30']
				},
				{
					id: 2,
					name: '李医生',
					title: '副主任医师',
					specialty: '咳嗽、支气管炎、哮喘',
					avatar: '/static/images/doctor2.png',
					rating: 4.7,
					ratingCount: 85,
					availableSlots: ['09:30', '10:00', '14:00', '16:30']
				},
				{
					id: 3,
					name: '王医生',
					title: '主治医师',
					specialty: '消化系统疾病',
					avatar: '/static/images/doctor3.png',
					rating: 4.9,
					ratingCount: 203,
					availableSlots: ['08:00', '11:30', '14:30', '15:00']
				}
			],
			
			// 我的预约数据
			appointmentStatusList: ['全部', '待就诊', '已完成', '已取消'],
			currentStatusTab: 0,
			myAppointments: [
				{
					id: 1,
					department: '内科',
					doctorName: '张医生',
					doctorTitle: '主任医师',
					date: '2023-05-20',
					time: '09:00',
					location: '校医院 302诊室',
					status: '待就诊',
					notes: '请携带学生证和校园卡'
				},
				{
					id: 2,
					department: '眼科',
					doctorName: '刘医生',
					doctorTitle: '副主任医师',
					date: '2023-05-15',
					time: '14:30',
					location: '校医院 205诊室',
					status: '已完成',
					notes: ''
				},
				{
					id: 3,
					department: '口腔科',
					doctorName: '陈医生',
					doctorTitle: '主治医师',
					date: '2023-04-28',
					time: '11:00',
					location: '校医院 108诊室',
					status: '已取消',
					notes: ''
				}
			],
			
			// 健康档案数据
			healthRecordTypes: [
				{ name: '就诊记录', icon: '/static/images/record-visit.png' },
				{ name: '体检报告', icon: '/static/images/record-exam.png' },
				{ name: '疫苗接种', icon: '/static/images/record-vaccine.png' },
				{ name: '药品清单', icon: '/static/images/record-medicine.png' },
			],
			currentRecordType: 0,
			
			// 就诊记录
			medicalRecords: [
				{
					id: 1,
					department: '内科',
					disease: '上呼吸道感染',
					date: '2023-05-15',
					doctorName: '张医生',
					doctorTitle: '主任医师',
					description: '症状为发热、咳嗽、咽痛，予以抗病毒及对症治疗',
					tags: ['发热', '咳嗽', '用药']
				},
				{
					id: 2,
					department: '眼科',
					disease: '结膜炎',
					date: '2023-04-10',
					doctorName: '刘医生',
					doctorTitle: '副主任医师',
					description: '双眼结膜充血，分泌物较多，给予抗菌滴眼液治疗',
					tags: ['眼部', '炎症', '用药']
				},
				{
					id: 3,
					department: '口腔科',
					disease: '牙周炎',
					date: '2023-03-22',
					doctorName: '陈医生',
					doctorTitle: '主治医师',
					description: '牙龈红肿出血，洗牙后给予漱口水',
					tags: ['口腔', '炎症', '治疗']
				}
			],
			
			// 体检报告
			examReports: [
				{
					id: 1,
					title: '2023学年入学体检',
					date: '2023-09-01',
					summary: '体检各项指标正常，无异常发现',
					location: '校医院体检中心',
					status: '正常'
				},
				{
					id: 2,
					title: '2022学年常规体检',
					date: '2022-09-05',
					summary: '血压偏高，建议定期复查，注意作息',
					location: '校医院体检中心',
					status: '异常'
				}
			],
			
			// 疫苗接种记录
			vaccineRecords: [
				{
					id: 1,
					name: '流感疫苗',
					status: '已接种',
					date: '2023-10-15',
					location: '校医院预防接种门诊',
					batch: 'FL202310A'
				},
				{
					id: 2,
					name: '新冠疫苗加强针',
					status: '已接种',
					date: '2023-08-20',
					location: '校医院预防接种门诊',
					batch: 'CV202308B'
				},
				{
					id: 3,
					name: '乙肝疫苗',
					status: '未接种',
					date: '',
					location: '',
					batch: ''
				}
			],
			
			// 药品清单
			medications: [
				{
					id: 1,
					name: '布洛芬缓释胶囊',
					usage: '头痛、发热时，一次1粒，一日3次',
					image: '/static/images/med1.png',
					prescriptionDate: '2023-05-15',
					doctorName: '张医生（内科）'
				},
				{
					id: 2,
					name: '氯雷他定片',
					usage: '过敏症状时，一次1片，一日1次',
					image: '/static/images/med2.png',
					prescriptionDate: '2023-04-20',
					doctorName: '王医生（内科）'
				},
				{
					id: 3,
					name: '红霉素眼膏',
					usage: '结膜炎治疗，每日3-4次，少量涂于下眼睑内侧',
					image: '/static/images/med3.png',
					prescriptionDate: '2023-04-10',
					doctorName: '刘医生（眼科）'
				}
			],
			
			// 弹窗控制
			showAppointmentSuccess: false,
			showAppointmentDetail: false,
			currentAppointment: {},
			appointmentResult: {}
		}
	},
	computed: {
		filteredAppointments() {
			let appointmentsToFilter = this.myAppointments;
			if (this.currentStatusTab !== 0) {
				const statusMap = {
					1: '待就诊',
					2: '已完成', 
					3: '已取消'
				};
				const statusFilter = statusMap[this.currentStatusTab];
				appointmentsToFilter = this.myAppointments.filter(item => item.status === statusFilter);
			}
			return appointmentsToFilter.map(appointment => ({
				...appointment,
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
	created() {
		// 为 examReports 添加 statusClass
		this.examReports = this.examReports.map(report => ({
			...report,
			statusClass: this.getReportStatusClass(report.status)
		}));

		// 为 vaccineRecords 添加 statusClass
		this.vaccineRecords = this.vaccineRecords.map(vaccine => ({
			...vaccine,
			statusClass: this.getVaccineStatusClass(vaccine.status)
		}));
	},
	methods: {
		// 标签切换
		switchTab(index) {
			this.currentTab = index;
		},
		
		// 科室选择
		selectDepartment(index) {
			this.selectedDepartment = index;
			this.selectedDate = null;
			this.selectedDoctor = null;
			this.selectedTimeSlot = null;
			this.selectedTimeSlotIndex = null;
			
			// 实际应用中，这里应该根据选择的科室获取可预约的日期
		},
		
		// 日期导航
		prevDate() {
			uni.showToast({
				title: '已是最早日期',
				icon: 'none'
			});
		},
		
		nextDate() {
			uni.showToast({
				title: '已是最晚日期',
				icon: 'none'
			});
		},
		
		// 选择日期
		selectDate(index) {
			this.selectedDate = index;
			this.selectedDoctor = null;
			this.selectedTimeSlot = null;
			this.selectedTimeSlotIndex = null;
			
			// 实际应用中，这里应该根据选择的科室和日期获取可预约的医生
		},
		
		// 选择医生
		selectDoctor(doctor) {
			this.selectedDoctor = doctor;
			this.selectedTimeSlot = null;
			this.selectedTimeSlotIndex = null;
		},
		
		// 选择时间
		selectTimeSlot(doctor, slot, index) {
			this.selectedTimeSlot = slot;
			this.selectedTimeSlotIndex = index;
		},
		
		// 判断时间是否被选中
		isSelectedTimeSlot(doctor, index) {
			return this.selectedDoctor && this.selectedDoctor.id === doctor.id && this.selectedTimeSlotIndex === index;
		},
		
		// 提交预约
		submitAppointment() {
			if (!this.selectedDoctor || this.selectedTimeSlot === null) {
				uni.showToast({
					title: '请选择医生和时间',
					icon: 'none'
				});
				return;
			}
			
			// 构建预约结果
			const dept = this.departments[this.selectedDepartment];
			const date = this.availableDates[this.selectedDate];
			
			this.appointmentResult = {
				department: dept.name,
				doctorName: this.selectedDoctor.name,
				date: `2023-05-${date.day}`,
				time: this.selectedTimeSlot,
				location: `校医院 ${Math.floor(Math.random() * 5) + 1}楼 ${Math.floor(Math.random() * 20) + 1}诊室`
			};
			
			// 添加到我的预约列表
			const newAppointment = {
				id: this.myAppointments.length + 1,
				department: this.appointmentResult.department,
				doctorName: this.appointmentResult.doctorName,
				doctorTitle: this.selectedDoctor.title,
				date: this.appointmentResult.date,
				time: this.appointmentResult.time,
				location: this.appointmentResult.location,
				status: '待就诊',
				notes: '请携带学生证和校园卡'
			};
			
			this.myAppointments.unshift(newAppointment);
			
			// 显示成功弹窗
			this.showAppointmentSuccess = true;
			
			// 重置选择
			// this.resetSelection();
		},
		
		// 重置选择
		resetSelection() {
			this.selectedDepartment = null;
			this.selectedDate = null;
			this.selectedDoctor = null;
			this.selectedTimeSlot = null;
			this.selectedTimeSlotIndex = null;
		},
		
		// 添加到日历
		addToCalendar() {
			uni.showToast({
				title: '已添加到日历',
				icon: 'success'
			});
		},
		
		// 隐藏成功弹窗
		hideAppointmentSuccess() {
			this.showAppointmentSuccess = false;
			// 跳转到我的预约标签页
			this.currentTab = 1;
			this.currentStatusTab = 1; // 待就诊
		},
		
		// 切换预约状态标签
		switchStatusTab(index) {
			this.currentStatusTab = index;
		},
		
		// 查看预约详情
		viewAppointmentDetail(appointment) {
			this.currentAppointment = appointment;
			this.showAppointmentDetail = true;
		},
		
		// 隐藏预约详情
		hideAppointmentDetail() {
			this.showAppointmentDetail = false;
		},
		
		// 取消预约确认
		confirmCancelAppointment() {
			uni.showModal({
				title: '取消预约',
				content: '确定要取消此次预约吗？',
				success: (res) => {
					if (res.confirm) {
						this.cancelAppointment(this.currentAppointment);
					}
				}
			});
		},
		
		// 取消预约
		cancelAppointment(appointment) {
			// 修改预约状态
			const index = this.myAppointments.findIndex(item => item.id === appointment.id);
			if (index !== -1) {
				this.myAppointments[index].status = '已取消';
				
				uni.showToast({
					title: '预约已取消',
					icon: 'success'
				});
				
				this.hideAppointmentDetail();
			}
		},
		
		// 预约改期
		rescheduleAppointment() {
			uni.showToast({
				title: '改期功能开发中',
				icon: 'none'
			});
		},
		
		// 导航到就诊地点
		navigateToClinic(appointment) {
			uni.showToast({
				title: '正在导航至' + appointment.location,
				icon: 'none'
			});
			
			// 实际应用中应该调用地图API进行导航
			setTimeout(() => {
				uni.showModal({
					title: '导航信息',
					content: `从当前位置到${appointment.location}大约需要5分钟，路线已生成`,
					showCancel: false
				});
			}, 1500);
			
			this.hideAppointmentDetail();
		},
		
		// 获取预约状态样式类
		getStatusClass(status) {
			switch(status) {
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
		
		// 切换健康记录类型
		switchRecordType(index) {
			this.currentRecordType = index;
		},
		
		// 查看就诊记录详情
		viewRecordDetail(record) {
			uni.showToast({
				title: '查看记录: ' + record.disease,
				icon: 'none'
			});
		},
		
		// 查看体检报告
		viewExamReport(report) {
			uni.showToast({
				title: '查看报告: ' + report.title,
				icon: 'none'
			});
		},
		
		// 获取体检报告状态样式类
		getReportStatusClass(status) {
			switch(status) {
				case '正常':
					return 'status-normal';
				case '异常':
					return 'status-abnormal';
				default:
					return '';
			}
		},
		
		// 预约疫苗接种
		reserveVaccine(vaccine) {
			uni.showToast({
				title: '预约接种: ' + vaccine.name,
				icon: 'none'
			});
		},
		
		// 获取疫苗状态样式类
		getVaccineStatusClass(status) {
			switch(status) {
				case '已接种':
					return 'status-vaccinated';
				case '未接种':
					return 'status-unvaccinated';
				default:
					return '';
			}
		},
		
		// 查看药品详情
		viewMedicationDetail(medicine) {
			uni.showToast({
				title: '查看药品: ' + medicine.name,
				icon: 'none'
			});
		},
		
		// 查看电子病历
		viewMedicalRecord(appointment) {
			uni.showToast({
				title: '查看病历: ' + appointment.department,
				icon: 'none'
			});
		}
	}
}
</script>

<style>
.medical-page {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 顶部banner样式 */
.medical-banner {
	position: relative;
	height: 300rpx;
	overflow: hidden;
}

.banner-image {
	width: 100%;
	height: 100%;
}

.banner-content {
	position: absolute;
	left: 40rpx;
	bottom: 40rpx;
	color: #FFFFFF;
	z-index: 1;
}

.banner-title {
	font-size: 40rpx;
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

/* 导航标签栏样式 */
.nav-tabs {
	display: flex;
	background-color: #FFFFFF;
	padding: 0 20rpx;
	box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
	position: relative;
	z-index: 2;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 30rpx 0;
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

/* 内容区样式 */
.tab-content {
	padding: 20rpx;
}

/* 预约挂号页样式 */
.section {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	padding-left: 10rpx;
	border-left: 4rpx solid #007AFF;
}

/* 科室选择样式 */
.departments-list {
	display: flex;
	flex-wrap: wrap;
}

.department-item {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 0;
	transition: all 0.2s;
}

.department-item.active {
	background-color: #f0f7ff;
}

.dept-icon {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 10rpx;
}

.dept-name {
	font-size: 24rpx;
	color: #333;
}

/* 日期选择器样式 */
.date-selector {
	display: flex;
	align-items: center;
}

.date-arrow {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.date-arrow image {
	width: 40rpx;
	height: 40rpx;
}

.dates {
	flex: 1;
	display: flex;
	justify-content: space-around;
}

.date-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 15rpx 0;
	border-radius: 10rpx;
	width: 100rpx;
}

.date-item.active {
	background-color: #007AFF;
	color: #FFFFFF;
}

.date-day {
	font-size: 32rpx;
	font-weight: bold;
}

.date-weekday {
	font-size: 24rpx;
	margin-top: 6rpx;
}

/* 医生列表样式 */
.doctors-list {
	display: flex;
	flex-direction: column;
}

.doctor-card {
	display: flex;
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.doctor-card:last-child {
	border-bottom: none;
}

.doctor-avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.doctor-info {
	flex: 1;
}

.doctor-header {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.doctor-name {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	margin-right: 10rpx;
}

.doctor-title {
	font-size: 24rpx;
	color: #666;
	background-color: #f5f5f5;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
}

.doctor-specialty {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
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

.doctor-schedule {
	padding-top: 10rpx;
}

.schedule-label {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.available-slots {
	display: flex;
	flex-wrap: wrap;
}

.time-slot {
	background-color: #f5f5f5;
	color: #333;
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
	margin-right: 10rpx;
	margin-bottom: 10rpx;
}

.time-slot.selected {
	background-color: #007AFF;
	color: #FFFFFF;
}

/* 提交按钮样式 */
.submit-section {
	padding: 30rpx 20rpx;
}

.submit-btn {
	background-color: #007AFF;
	color: #FFFFFF;
	font-size: 32rpx;
	padding: 20rpx 0;
	border-radius: 10rpx;
}

/* 我的预约页样式 */
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
}

.appointment-card {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
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

/* 健康档案页样式 */
.records-type-tabs {
	display: flex;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.record-type {
	flex: 1;
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

/* 就诊记录样式 */
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
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
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

.record-tags {
	display: flex;
	flex-wrap: wrap;
}

.tag {
	background-color: #f5f5f5;
	color: #666;
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	margin-right: 10rpx;
	margin-bottom: 6rpx;
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

/* 药品清单样式 */
.medication-item {
	display: flex;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
}

.medicine-image {
	width: 120rpx;
	height: 120rpx;
	margin-right: 20rpx;
}

.medicine-info {
	flex: 1;
}

.medicine-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.medicine-usage {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 20rpx;
	line-height: 1.4;
}

.medicine-prescription {
	display: flex;
	justify-content: space-between;
	font-size: 24rpx;
	color: #999;
}

.medicine-actions {
	display: flex;
	align-items: flex-end;
}

.medicine-btn {
	background-color: #f5f5f5;
	font-size: 24rpx;
	color: #666;
	padding: 10rpx 20rpx;
	border-radius: 6rpx;
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

/* 弹窗样式 */
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
	width: 80%;
	padding: 30rpx;
}

/* 预约成功弹窗样式 */
.appointment-success .modal-content {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.success-icon {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 20rpx;
}

.success-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
}

.success-info {
	width: 100%;
	margin-bottom: 30rpx;
}

.info-item {
	display: flex;
	margin-bottom: 15rpx;
}

.info-label {
	font-size: 28rpx;
	color: #666;
	width: 160rpx;
}

.info-value {
	font-size: 28rpx;
	color: #333;
	flex: 1;
	font-weight: bold;
}

.success-notes {
	width: 100%;
	background-color: #f9f9f9;
	padding: 15rpx;
	border-radius: 10rpx;
	margin-bottom: 30rpx;
}

.notes-title {
	font-size: 26rpx;
	color: #666;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
}

.notes-content {
	font-size: 24rpx;
	color: #666;
	line-height: 1.5;
}

.success-actions {
	width: 100%;
	display: flex;
	justify-content: space-between;
}

.success-actions .action-btn {
	width: 48%;
	text-align: center;
	padding: 20rpx 0;
}

/* 预约详情弹窗样式 */
.appointment-detail .modal-content {
	padding: 0;
	overflow: hidden;
}

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
</style> 