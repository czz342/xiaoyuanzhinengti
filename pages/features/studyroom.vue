<template>
  <view class="studyroom-page">
    <view class="header">
      <text class="title">自习室预约</text>
      <view class="exam-period" v-if="isExamPeriod">
        <text>考试周 · 实时空位查询</text>
        <button class="realtime-btn" @tap="showRealtime">查看实时</button>
      </view>
    </view>
    
    <!-- 自习室概览 -->
    <view class="overview-section">
      <view class="overview-header">
        <text>自习室概览</text>
        <view class="filter-container">
          <picker @change="filterChange" :value="filterIndex" :range="filterOptions">
            <view class="filter-text">{{filterOptions[filterIndex]}}</view>
          </picker>
        </view>
      </view>
      <view class="overview-stats">
        <view class="stat-box">
          <text class="stat-number">{{totalVacancies}}</text>
          <text class="stat-label">总空位</text>
        </view>
        <view class="stat-box">
          <text class="stat-number">{{totalRooms}}</text>
          <text class="stat-label">自习室</text>
        </view>
        <view class="stat-box">
          <text class="stat-number">{{peakHours}}</text>
          <text class="stat-label">高峰时段</text>
        </view>
      </view>
    </view>
    
    <!-- 自习室列表 -->
    <view class="room-list">
      <view v-for="room in filteredRooms" :key="room.id" class="room-card">
        <view class="room-info">
          <view class="room-name-row">
            <text class="room-name">{{ room.name }}</text>
            <text class="room-location">{{ room.location }}</text>
          </view>
          <view class="room-stats">
            <text class="stat-item">总座位：{{ room.total }}</text>
            <text class="stat-item">空位：{{ room.available }}</text>
          </view>
          <view class="crowd-level">
            <text>拥挤程度：</text>
            <text :class="['level', room.level]">{{ crowdText(room.level) }}</text>
          </view>
          <view class="room-capacity">
            <progress :percent="(room.total - room.available) / room.total * 100" 
                     stroke-width="4" 
                     :activeColor="crowdColor(room.level)" 
                     backgroundColor="#f0f0f0" />
          </view>
        </view>
        <button class="book-btn" :disabled="room.available === 0" @tap="bookRoom(room)">
          {{ room.available === 0 ? '已满' : '预约座位' }}
        </button>
      </view>
    </view>

    <!-- 座位选择弹窗 - 修改了实现方式 -->
    <view v-if="showSeatSelector" class="seat-selector-mask">
      <view class="seat-selector">
        <view class="selector-header">
          <text>{{selectedRoom.name}} - 选择座位</text>
          <text class="close-btn" @tap="closeSeatSelector">×</text>
        </view>
        <view class="seat-map">
          <view class="seat-layout">
            <!-- 使用单一循环渲染所有座位 -->
            <view class="seat-grid">
              <view 
                v-for="seat in seats" 
                :key="seat.id" 
                :class="['seat', seat.status]"
                @tap="selectSeat(seat)"
              >
                {{seat.label}}
              </view>
            </view>
          </view>
          <view class="seat-legend">
            <view class="legend-item"><view class="seat-demo available"></view> 可选</view>
            <view class="legend-item"><view class="seat-demo occupied"></view> 已占</view>
            <view class="legend-item"><view class="seat-demo selected"></view> 已选</view>
          </view>
        </view>
        <view class="time-selector">
          <text>选择时间段：</text>
          <view class="time-picker-container">
            <picker mode="multiSelector" 
                   :value="timeIndex" 
                   :range="timeRange"
                   @change="timeChange">
              <view class="time-display">
                {{timeRange[0][timeIndex[0]]}} - {{timeRange[1][timeIndex[1]]}}
              </view>
            </picker>
          </view>
        </view>
        <view class="selector-actions">
          <button @tap="closeSeatSelector" class="cancel-btn">取消</button>
          <button @tap="confirmBooking" class="confirm-btn">确认预约</button>
        </view>
      </view>
    </view>

    <!-- 预约凭证 -->
    <view v-if="showVoucher" class="voucher-mask">
      <view class="voucher-popup">
        <view class="voucher-header">
          <text class="voucher-title">预约成功</text>
          <text class="close-btn" @tap="closeVoucher">×</text>
        </view>
        <view class="voucher-qr">
          <image src="/static/images/qr-code.png" mode="aspectFit"></image>
        </view>
        <view class="voucher-info">
          <text class="voucher-room">{{voucher.room}}</text>
          <view class="voucher-detail">
            <text>座位号：{{voucher.seat}}</text>
            <text>日期：{{voucher.date}}</text>
            <text>时间：{{voucher.time}}</text>
            <text>有效期至：{{voucher.expire}}</text>
          </view>
        </view>
        <view class="voucher-actions">
          <button @tap="addReminder" class="reminder-btn">
            <text class="btn-icon">⏰</text>
            <text>设置提醒</text>
          </button>
          <button @tap="saveVoucher" class="save-btn">
            <text class="btn-icon">💾</text>
            <text>保存凭证</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 实时空位面板 -->
    <view v-if="showRealtimePanel" class="realtime-panel">
      <view class="realtime-content">
        <view class="realtime-header">
          <text>考试周自习室实时空位</text>
          <text class="close-btn" @tap="closeRealtime">×</text>
        </view>
        <view class="realtime-refresh">
          <text>{{lastUpdateTime}} 更新</text>
          <button @tap="refreshRealtime" class="refresh-btn">刷新</button>
        </view>
        <view class="realtime-list">
          <view v-for="room in rooms" :key="room.id" class="realtime-item">
            <view class="realtime-room">
              <text class="room-name">{{room.name}}</text>
              <text :class="['availability', room.level]">{{room.available}} / {{room.total}}</text>
            </view>
            <progress :percent="room.available / room.total * 100" 
                     stroke-width="3" 
                     activeColor="#4facfe" 
                     backgroundColor="#f0f0f0" />
          </view>
        </view>
        <view class="realtime-note">
          <text>注：数据每5分钟自动更新一次</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isExamPeriod: true, // 是否为考试周
      filterOptions: ['全部自习室', '图书馆', '教学楼', '空位优先'],
      filterIndex: 0,
      rooms: [
        { id: 1, name: '中央图书馆', location: '3层', total: 120, available: 45, level: 'low', type: '图书馆' },
        { id: 2, name: '理科楼自习室', location: 'A区', total: 80, available: 12, level: 'medium', type: '教学楼' },
        { id: 3, name: '工科楼自习室', location: 'B区', total: 60, available: 0, level: 'high', type: '教学楼' },
        { id: 4, name: '文科楼自习室', location: 'C区', total: 50, available: 25, level: 'low', type: '教学楼' },
        { id: 5, name: '图书馆西区', location: '2层', total: 90, available: 8, level: 'medium', type: '图书馆' }
      ],
      showSeatSelector: false,
      selectedRoom: {},
      // 使用扁平化的座位数组
      seats: [],
      selectedSeatId: null,
      timeRange: [
        ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
        ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
      ],
      timeIndex: [0, 4], // 默认8:00-13:00
      showVoucher: false,
      voucher: {},
      showRealtimePanel: false,
      lastUpdateTime: '16:45'
    }
  },
  computed: {
    totalVacancies() {
      return this.rooms.reduce((sum, room) => sum + room.available, 0);
    },
    totalRooms() {
      return this.rooms.length;
    },
    peakHours() {
      return '18:00-21:00';
    },
    filteredRooms() {
      if (this.filterIndex === 0) return this.rooms;
      if (this.filterIndex === 1) return this.rooms.filter(room => room.type === '图书馆');
      if (this.filterIndex === 2) return this.rooms.filter(room => room.type === '教学楼');
      if (this.filterIndex === 3) return [...this.rooms].sort((a, b) => b.available - a.available);
      return this.rooms;
    }
  },
  onLoad(options) {
  	// 检查URL中是否有showVoucher参数
  	if (options.showVoucher === 'true') {
  		// 模拟一个凭证数据
  		this.voucher = {
  			room: '中央图书馆',
  			seat: '2-1',
  			date: '2025-6-10',
  			time: '08:00 - 13:00',
  			expire: '2025-6-10 13:00'
  		};
  		this.showVoucher = true;
  	}
  },
  methods: {
    // 人流量文字描述
    crowdText(level) {
      switch(level) {
        case 'low': return '宽松';
        case 'medium': return '适中';
        case 'high': return '拥挤';
        default: return '';
      }
    },
    // 人流量对应颜色
    crowdColor(level) {
      switch(level) {
        case 'low': return '#4CAF50';
        case 'medium': return '#FF9800';
        case 'high': return '#F44336';
        default: return '#999';
      }
    },
    // 筛选变化
    filterChange(e) {
      this.filterIndex = e.detail.value;
    },
    // 预约自习室
    bookRoom(room) {
      if (room.available <= 0) return;
      
      // 初始化座位数据
      this.selectedRoom = room;
      this.generateSeats();
      this.showSeatSelector = true;
      this.selectedSeatId = null;
    },
    // 生成座位数据 (使用扁平化数组)
    generateSeats() {
      this.seats = [];
      const totalSeats = 40;  // 总共5行8列 = 40个座位
      const occupiedCount = totalSeats - this.selectedRoom.available;
      
      // 创建所有座位
      for (let row = 1; row <= 5; row++) {
        for (let col = 1; col <= 8; col++) {
          this.seats.push({
            id: `${row}-${col}`,
            label: `${row}-${col}`,
            status: 'available',
            row: row,
            col: col
          });
        }
      }
      
      // 随机设置已占用的座位
      const shuffled = [...this.seats].sort(() => 0.5 - Math.random());
      const occupied = shuffled.slice(0, occupiedCount);
      
      occupied.forEach(seat => {
        const index = this.seats.findIndex(s => s.id === seat.id);
        if (index !== -1) {
          this.seats[index].status = 'occupied';
        }
      });
    },
    // 选择座位
    selectSeat(seat) {
      if (seat.status === 'occupied') return;
      
      // 取消之前选择的座位
      if (this.selectedSeatId) {
        const prevIndex = this.seats.findIndex(s => s.id === this.selectedSeatId);
        if (prevIndex !== -1) {
          this.seats[prevIndex].status = 'available';
        }
      }
      
      // 选择当前座位
      if (this.selectedSeatId === seat.id) {
        this.selectedSeatId = null;
      } else {
        seat.status = 'selected';
        this.selectedSeatId = seat.id;
      }
    },
    // 关闭座位选择
    closeSeatSelector() {
      this.showSeatSelector = false;
      this.selectedSeatId = null;
    },
    // 时间选择变化
    timeChange(e) {
      this.timeIndex = e.detail.value;
    },
    // 确认预约
    confirmBooking() {
      if (!this.selectedSeatId) {
        uni.showToast({
          title: '请先选择座位',
          icon: 'none'
        });
        return;
      }
      
      // 生成当前日期
      const now = new Date();
      const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      
      // 生成预约凭证
      this.voucher = {
        room: this.selectedRoom.name,
        seat: this.selectedSeatId,
        date: today,
        time: `${this.timeRange[0][this.timeIndex[0]]} - ${this.timeRange[1][this.timeIndex[1]]}`,
        expire: `${today} ${this.timeRange[1][this.timeIndex[1]]}`
      };
      
      this.showSeatSelector = false;
      this.showVoucher = true;
    },
    // 关闭预约凭证
    closeVoucher() {
      this.showVoucher = false;
    },
    // 添加到期提醒
    addReminder() {
      uni.showToast({
        title: '已设置到期前10分钟提醒',
        icon: 'success'
      });
    },
    // 保存凭证
    saveVoucher() {
      uni.showToast({
        title: '凭证已保存到"我的预约"',
        icon: 'success'
      });
    },
    // 显示实时空位
    showRealtime() {
      this.showRealtimePanel = true;
    },
    // 关闭实时空位
    closeRealtime() {
      this.showRealtimePanel = false;
    },
    // 刷新实时数据
    refreshRealtime() {
      uni.showLoading({
        title: '刷新数据中...'
      });
      
      // 模拟刷新
      setTimeout(() => {
        // 随机更新空位数
        this.rooms.forEach(room => {
          if (room.available > 0) {
            const change = Math.floor(Math.random() * 5) - 2; // -2到2的随机变化
            room.available = Math.max(0, Math.min(room.total, room.available + change));
            
            // 更新拥挤程度
            const ratio = room.available / room.total;
            if (ratio > 0.3) room.level = 'low';
            else if (ratio > 0.1) room.level = 'medium';
            else room.level = 'high';
          }
        });
        
        // 更新时间
        const now = new Date();
        this.lastUpdateTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        uni.hideLoading();
        uni.showToast({
          title: '数据已更新',
          icon: 'success'
        });
      }, 1000);
    }
  },
  onReady() {
    // 页面加载完成
  }
}
</script>

<style scoped>
.studyroom-page {
  background: linear-gradient(to bottom, #f5f7fa 0%, #e4e8eb 100%);
  min-height: 100vh;
  padding: 20rpx 24rpx 40rpx;
}
.header {
  padding: 40rpx 0 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #222;
}
.exam-period {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #ff7e00;
}
.realtime-btn {
  margin-left: 20rpx;
  font-size: 24rpx;
  background: #ff7e00;
  color: #fff;
  border-radius: 20rpx;
  padding: 6rpx 24rpx;
}

/* 概览区域 */
.overview-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin: 20rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #666;
}
.filter-container {
  font-size: 24rpx;
  color: #007AFF;
}
.filter-text::after {
  content: " ▼";
  font-size: 20rpx;
}
.overview-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0;
}
.stat-number {
  font-size: 42rpx;
  font-weight: bold;
  color: #007AFF;
}
.stat-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
}

/* 自习室列表 */
.room-list {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.room-card {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
  padding: 32rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}
.room-card:active {
  transform: scale(0.98);
}
.room-info {
  flex: 1;
}
.room-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}
.room-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}
.room-location {
  font-size: 24rpx;
  color: #999;
  background: #f5f5f5;
  padding: 4rpx 10rpx;
  margin-left: 12rpx;
  border-radius: 10rpx;
}
.room-stats {
  display: flex;
  margin-bottom: 10rpx;
}
.stat-item {
  font-size: 24rpx;
  color: #666;
  margin-right: 20rpx;
}
.crowd-level {
  font-size: 24rpx;
  color: #666;
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}
.level {
  position: relative;
  margin-left: 8rpx;
  font-weight: bold;
  padding-left: 20rpx;
}
.level::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
}
.level.low {
  color: #4CAF50;
}
.level.low::before {
  background: #4CAF50;
}
.level.medium {
  color: #FF9800;
}
.level.medium::before {
  background: #FF9800;
}
.level.high {
  color: #F44336;
}
.level.high::before {
  background: #F44336;
}
.room-capacity {
  width: 100%;
  margin-top: 16rpx;
}
.book-btn {
  min-width: 160rpx;
  font-size: 28rpx;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  border-radius: 40rpx;
  padding: 12rpx 36rpx;
  box-shadow: 0 4rpx 12rpx rgba(79, 172, 254, 0.3);
}
.book-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 6rpx rgba(79, 172, 254, 0.3);
}
.book-btn[disabled] {
  background: #e0e0e0;
  color: #9e9e9e;
  box-shadow: none;
}

/* 座位选择器 - 更新了布局 */
.seat-selector-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.seat-selector {
  width: 92%;
  max-height: 85vh;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.selector-header {
  padding: 24rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  border-bottom: 1rpx solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  font-size: 48rpx;
  line-height: 1;
  color: #999;
  padding: 0 20rpx;
}
.seat-map {
  padding: 30rpx 24rpx;
  overflow-x: auto;
}
.seat-layout {
  min-width: 650rpx;
  margin-bottom: 20rpx;
}
/* 更新的座位网格样式 */
.seat-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16rpx;
  padding: 16rpx;
}
.seat {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10rpx;
  font-size: 22rpx;
  color: #fff;
}
.seat.available {
  background: #4CAF50;
}
.seat.occupied {
  background: #999;
}
.seat.selected {
  background: #007AFF;
  box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.4);
}
.seat-legend {
  display: flex;
  justify-content: center;
  margin-top: 10rpx;
}
.legend-item {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  margin: 0 15rpx;
}
.seat-demo {
  width: 24rpx;
  height: 24rpx;
  border-radius: 6rpx;
  margin-right: 8rpx;
}
.seat-demo.available {
  background: #4CAF50;
}
.seat-demo.occupied {
  background: #999;
}
.seat-demo.selected {
  background: #007AFF;
}
.time-selector {
  padding: 0 24rpx 30rpx;
  font-size: 28rpx;
  color: #333;
}
.time-picker-container {
  margin-top: 15rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
}
.time-display {
  font-size: 30rpx;
  color: #007AFF;
}
.selector-actions {
  display: flex;
  border-top: 1rpx solid #eee;
}
.selector-actions button {
  flex: 1;
  border-radius: 0;
  font-size: 32rpx;
  padding: 24rpx 0;
}
.cancel-btn {
  background: #f5f5f5;
  color: #666;
}
.confirm-btn {
  background: #007AFF;
  color: #fff;
}

/* 预约成功凭证 */
.voucher-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.voucher-popup {
  background: #fff;
  border-radius: 24rpx;
  width: 85%;
  overflow: hidden;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.15);
}
.voucher-header {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  padding: 30rpx 24rpx;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.voucher-title {
  font-size: 36rpx;
  font-weight: bold;
}
.voucher-qr {
  display: flex;
  justify-content: center;
  padding: 40rpx 0 20rpx;
}
.voucher-qr image {
  width: 300rpx;
  height: 300rpx;
}
.voucher-info {
  padding: 0 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.voucher-room {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}
.voucher-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  font-size: 28rpx;
  color: #666;
}
.voucher-actions {
  padding: 20rpx 30rpx 40rpx;
  display: flex;
  justify-content: space-around;
}
.voucher-actions button {
  padding: 16rpx 36rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
}
.reminder-btn {
  background: #f5f5f5;
  color: #ff9800;
}
.save-btn {
  background: #f5f5f5;
  color: #007AFF;
}
.btn-icon {
  margin-right: 6rpx;
  font-size: 32rpx;
}

/* 实时空位面板 */
.realtime-panel {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.realtime-content {
  background: #fff;
  width: 86%;
  border-radius: 24rpx;
  overflow: hidden;
}
.realtime-header {
  background: #ff7e00;
  padding: 24rpx 30rpx;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
}
.realtime-refresh {
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #eee;
}
.realtime-refresh text {
  font-size: 24rpx;
  color: #999;
}
.refresh-btn {
  font-size: 24rpx;
  color: #007AFF;
  background: none;
  padding: 10rpx 20rpx;
}
.realtime-list {
  padding: 20rpx 30rpx;
  max-height: 60vh;
  overflow-y: auto;
}
.realtime-item {
  margin-bottom: 24rpx;
}
.realtime-room {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.realtime-room .room-name {
  font-size: 28rpx;
  color: #333;
}
.availability {
  font-weight: bold;
}
.availability.low {
  color: #4CAF50;
}
.availability.medium {
  color: #FF9800;
}
.availability.high {
  color: #F44336;
}
.realtime-note {
  padding: 20rpx 30rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
  border-top: 1rpx solid #eee;
}
</style>
