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
        <view class="header-actions">
          <picker @change="onTimeFilterChange" :value="selectedTimeFilterIndex" :range="timeFilterOptions.map(t => t.label)">
            <view class="filter-text">{{timeFilterOptions[selectedTimeFilterIndex].label}}</view>
          </picker>
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
      <view class="realtime-note">
        <text>注：数据每5分钟自动更新一次</text>
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
            <view v-for="(row, rowIndex) in seats" :key="rowIndex" class="seat-row">
              <view 
                v-for="seat in row" 
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
          <image src="/static/images/qrcode.png" mode="aspectFit"></image>
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

    <!-- 我的预约 FAB -->
    <view class="fab" @tap="goToMyReservations">
        <image class="fab-icon" src="/static/images/预约凭证.png"></image>
        <text class="fab-text">我的预约</text>
    </view>
  </view>
</template>

<script>
import KingdeeAgentService from '@/services/kingdeeAgent.js';

export default {
  data() {
    return {
      isExamPeriod: true, // 是否为考试周
      filterOptions: ['全部自习室', '图书馆', '教学楼', '空位优先'],
      filterIndex: 0,
      timeFilterOptions: [
        { label: '实时', type: 'now' },
        { label: '早上', type: 'slot', start: '08:00', end: '12:00' },
        { label: '下午', type: 'slot', start: '12:00', end: '18:00' },
        { label: '晚上', type: 'slot', start: '18:00', end: '22:00' }
      ],
      selectedTimeFilterIndex: 0,
      baseRooms: [], // 从API获取的原始自习室列表
      rooms: [], // 经过处理后用于展示的列表
      allDailyBookings: [], // 存储所有自习室当天的所有预定记录
      showSeatSelector: false,
      selectedRoom: null, // 将 'null' 作为初始值
      seats: [],
      allSeatsInSelectedRoom: [], // 新增：用于存储从API获取的原始座位列表
      dailyBookings: [], // 存储一个自习室当天的所有预定记录
      selectedSeat: null, // 将 'null' 作为初始值
      timeRange: [
        ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
        ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
      ],
      timeIndex: [0, 1], // 默认8:00-09:00
      showVoucher: false,
      voucher: {},
      showRealtimePanel: false,
      lastUpdateTime: '', // 初始化为空
      currentDate: ''
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
      if (!this.allDailyBookings) {
          return '计算中...';
      }
      if (this.allDailyBookings.length === 0) {
          return '任意时段';
      }

      // 定义时间槽，从 8:00 到 21:00，共14个一小时的槽
      const totalSlots = 14;
      const slotCounts = new Array(totalSlots).fill(0);
      const baseHour = 8;

      // 遍历所有预定记录
      this.allDailyBookings.forEach(booking => {
          const bookingStartSec = booking.lb77_start_time;
          const bookingEndSec = booking.lb77_end_time;

          // 检查这个预定与哪个时间槽重叠
          for (let i = 0; i < totalSlots; i++) {
              const slotStartSec = (baseHour + i) * 3600;
              const slotEndSec = (baseHour + i + 1) * 3600;

              // 重叠条件: (StartA < EndB) and (EndA > StartB)
              if (bookingStartSec < slotEndSec && bookingEndSec > slotStartSec) {
                  slotCounts[i]++;
              }
          }
      });

      const maxBookings = Math.max(...slotCounts);

      if (maxBookings === 0) {
          return '任意时段';
      }

      // 找出所有高峰时段的索引
      const peakIndices = [];
      slotCounts.forEach((count, index) => {
          if (count === maxBookings) {
              peakIndices.push(index);
          }
      });

      // 寻找最长的连续高峰时段 (如果长度相同，则取当天最晚的那个)
      let longestStreak = 0;
      let currentStreak = 0;
      let longestStreakEndIndex = -1;

      for (let i = 0; i < peakIndices.length; i++) {
          if (i > 0 && peakIndices[i] === peakIndices[i-1] + 1) {
              currentStreak++;
          } else {
              currentStreak = 1;
          }
          if (currentStreak >= longestStreak) {
              longestStreak = currentStreak;
              longestStreakEndIndex = peakIndices[i];
          }
      }
      
      const startStreakIndex = longestStreakEndIndex - longestStreak + 1;
      
      const startHour = baseHour + startStreakIndex;
      const endHour = baseHour + longestStreakEndIndex + 1;

      const formatHour = (h) => `${String(h).padStart(2, '0')}:00`;

      return `${formatHour(startHour)}-${formatHour(endHour)}`;
    },
    filteredRooms() {
      let roomsToSort = [...this.rooms];
      const filter = this.filterOptions[this.filterIndex];
      
      const libraryRooms = ['中央图书馆', '文科楼自习室'];
      const teachingBuildingRooms = ['理科楼自习室', '综合楼自习室', '图书馆西区'];

      if (filter === '图书馆') {
        return roomsToSort.filter(room => room.name && libraryRooms.includes(room.name));
      }
      if (filter === '教学楼') {
        return roomsToSort.filter(room => room.name && teachingBuildingRooms.includes(room.name));
      }
      if (filter === '空位优先') {
        return roomsToSort.sort((a, b) => b.available - a.available);
      }
      return roomsToSort; // '全部自习室'
    }
  },
  onLoad() {
    // 初始化日期和时间
    const now = new Date();
    this.currentDate = this.formatDate(now);
    this.lastUpdateTime = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    // 加载自习室数据，初次加载显示loading
    this.fetchAndProcessRooms(true);
  },
  methods: {
    crowdText(level) {
      const map = {
        'low': '空闲',
        'medium': '适中',
        'high': '拥挤',
        'full': '无座'
      };
      return map[level] || '未知';
    },
    
    crowdColor(level) {
      const map = {
        'low': '#67c23a',    // 绿色
        'medium': '#e6a23c', // 黄色
        'high': '#f56c6c',   // 红色
        'full': '#909399'    // 灰色
      };
      return map[level] || '#909399';
    },

    onTimeFilterChange(e) {
      this.selectedTimeFilterIndex = e.detail.value;
      this.processRoomsWithBookings(); // 当时间筛选变化时，重新计算
    },

    timeToSeconds(timeStr) {
      if (!timeStr) return 0;
      const parts = timeStr.split(':');
      if (parts.length < 2) return 0; // 避免 split 失败
      return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60;
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    processRoomsWithBookings() {
      const filterOption = this.timeFilterOptions[this.selectedTimeFilterIndex];
      
      let targetStartSec;
      let targetEndSec;

      if (filterOption.type === 'now') {
        const now = new Date();
        targetStartSec = this.timeToSeconds(now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }));
        targetEndSec = targetStartSec + 1; // Check for this instant
      } else if (filterOption.type === 'slot') {
        targetStartSec = this.timeToSeconds(filterOption.start);
        targetEndSec = this.timeToSeconds(filterOption.end);
      }

      if (targetStartSec === undefined) return;

      const bookingsByRoomId = {};
      this.allDailyBookings.forEach(booking => {
        const roomId = booking.lb77_seat_id_lb77_studyroom_id_number;
        if (!bookingsByRoomId[roomId]) {
          bookingsByRoomId[roomId] = [];
        }
        bookingsByRoomId[roomId].push(booking);
      });
      
      this.rooms = this.baseRooms.map(room => {
        const roomBookings = bookingsByRoomId[room.number] || [];
        const occupiedSeats = new Set();

        roomBookings.forEach(booking => {
          // Check for time overlap: (StartA < EndB) and (EndA > StartB)
          if (booking.lb77_start_time < targetEndSec && booking.lb77_end_time > targetStartSec) {
            occupiedSeats.add(booking.lb77_seat_id_number);
          }
        });

        const availableCount = room.lb77_total_seats - occupiedSeats.size;
        const occupancy = room.lb77_total_seats > 0 ? (occupiedSeats.size / room.lb77_total_seats) : 1;
        
        let level = 'full';
        if (occupancy < 1) level = 'high';
        if (occupancy <= 0.7) level = 'medium';
        if (occupancy <= 0.4) level = 'low';


        return {
          ...room,
          id: room.number,
          name: room.name,
          location: room.lb77_location,
          total: room.lb77_total_seats,
          available: availableCount,
          level: availableCount === 0 ? 'full' : level
        };
      });
      this.lastUpdateTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    },

    async fetchAndProcessRooms(showLoading = true) {
      if (showLoading) {
        uni.showLoading({ title: '加载实时数据...' });
      }
      try {
        // 1. 获取自习室基础列表
        const roomRes = await KingdeeAgentService.getStudyRoomList();
        if (!roomRes || !roomRes.data || !roomRes.data.rows) {
          throw new Error('获取自习室列表失败');
        }
        this.baseRooms = roomRes.data.rows;

        // 2. 并行获取所有自习室当天的预约记录
        const bookingPromises = this.baseRooms.map(room =>
          KingdeeAgentService.getSeatBookingsByDate(room.number, this.currentDate)
        );
        const bookingResults = await Promise.all(bookingPromises);
        
        // 3. 将所有预约记录扁平化存储
        this.allDailyBookings = bookingResults.flatMap(res => (res && res.data && res.data.rows) ? res.data.rows : []);

        // 4. 根据默认筛选器（"当前"）更新一次视图
        this.processRoomsWithBookings();

      } catch (error) {
        console.error("获取自习室数据失败:", error);
        uni.showToast({ title: '数据加载失败', icon: 'none' });
      } finally {
        if (showLoading) {
          uni.hideLoading();
        }
      }
    },
    
    updateRoomAvailability() {
      // 此方法已废弃，逻辑合并到 processRoomsWithBookings
    },

    updateSeatStatuses() {
        if (!this.selectedRoom) return;

        // 1. 获取选定的时间范围（秒）
        const startTimeStr = this.timeRange[0][this.timeIndex[0]];
        const endTimeStr = this.timeRange[1][this.timeIndex[1]];
        const selectedStartSec = this.timeToSeconds(startTimeStr);
        const selectedEndSec = this.timeToSeconds(endTimeStr);

        // 2. 为每个座位创建一个预订时间的查找表，以提高效率
        const bookingsBySeat = {};
        this.dailyBookings.forEach(booking => {
            if (!bookingsBySeat[booking.lb77_seat_id_number]) {
                bookingsBySeat[booking.lb77_seat_id_number] = [];
            }
            bookingsBySeat[booking.lb77_seat_id_number].push({
                start: booking.lb77_start_time,
                end: booking.lb77_end_time
            });
        });

        // 3. 映射所有座位，计算其状态和属性
        const allSeatsWithStatus = this.allSeatsInSelectedRoom.map(seat => {
            let isOccupied = false;
            const seatBookings = bookingsBySeat[seat.number];
            if (seatBookings) {
                for (const booking of seatBookings) {
                    // 检查时间重叠: (StartA < EndB) and (EndA > StartB)
                    if (booking.start < selectedEndSec && booking.end > selectedStartSec) {
                        isOccupied = true;
                        break;
                    }
                }
            }
            
            const parts = seat.name.split('-');
            const row = parseInt(parts[parts.length - 2], 10);
            
            let status = isOccupied ? 'occupied' : 'available';
            // 如果是当前选中的座位且未被占用，则保持'selected'状态
            if (this.selectedSeat && this.selectedSeat.id === seat.number && !isOccupied) {
                status = 'selected';
            }

            return {
                id: seat.number,
                label: parts.slice(-2).join('-'),
                status: status,
                row: isNaN(row) ? -1 : row
            };
        });
        
        // 4. 检查当前选中的座位是否在新的时间段内变得不可用
        if (this.selectedSeat) {
            const currentSelectedSeatInfo = allSeatsWithStatus.find(s => s.id === this.selectedSeat.id);
            if (currentSelectedSeatInfo && currentSelectedSeatInfo.status === 'occupied') {
                uni.showToast({
                    title: '您选择的座位在该时段已被预约，请重新选择',
                    icon: 'none'
                });
                this.selectedSeat = null; // 取消选择
                // 再次遍历以更新该座位的状态为'occupied'
                allSeatsWithStatus.forEach(s => {
                    if (s.id === currentSelectedSeatInfo.id) {
                        s.status = 'occupied';
                    }
                });
            }
        }
        
        // 5. 按行号对所有座位进行分组
        const grouped = allSeatsWithStatus.reduce((acc, seat) => {
          if (seat.row === -1) return acc; // 忽略无效的行号
          if (!acc[seat.row]) {
            acc[seat.row] = [];
          }
          acc[seat.row].push(seat);
          return acc;
        }, {});

        // 6. 将分组后的对象转换为模板所需的二维数组
        this.seats = Object.values(grouped);
    },

    fetchStudyRooms() {
      // 此方法已废弃，逻辑合并到 fetchAndProcessRooms
    },

    async bookRoom(room) {
      if (room.available <= 0) return;
      this.selectedRoom = room;

      uni.showLoading({ title: '加载座位...' });
      try {
        // 1. 获取该自习室的所有座位
        const seatRes = await KingdeeAgentService.getSeatListByRoom(room.id);
        if (!seatRes || !seatRes.data || !seatRes.data.rows) {
          throw new Error("获取座位列表失败");
        }
        
        // 2. 对座位进行排序（按行、列）
        const sortedSeats = seatRes.data.rows.sort((a, b) => {
          const partsA = a.name.split('-');
          const partsB = b.name.split('-');
          
          if (partsA.length < 2 || partsB.length < 2) return 0;

          const rowA = parseInt(partsA[partsA.length - 2], 10);
          const colA = parseInt(partsA[partsA.length - 1], 10);
          const rowB = parseInt(partsB[partsB.length - 2], 10);
          const colB = parseInt(partsB[partsB.length - 1], 10);
          
          if (isNaN(rowA) || isNaN(colA) || isNaN(rowB) || isNaN(colB)) return 0;

          if (rowA !== rowB) {
            return rowA - rowB;
          }
          return colA - colB;
        });
        
        this.allSeatsInSelectedRoom = sortedSeats;

        // 3. 获取当天的预定记录
        const bookingRes = await KingdeeAgentService.getSeatBookingsByDate(room.id, this.currentDate);
        this.dailyBookings = (bookingRes && bookingRes.data && bookingRes.data.rows) ? bookingRes.data.rows : [];
        
        // 4. 根据默认时间更新座位状态
        this.updateSeatStatuses();
        
        this.showSeatSelector = true;
      } catch (error) {
        console.error("加载座位信息失败:", error);
        uni.showToast({ title: '加载座位失败', icon: 'none' });
      } finally {
        uni.hideLoading();
        }
    },
    // 关闭座位选择器
    closeSeatSelector() {
      this.showSeatSelector = false;
      this.selectedRoom = null;
      this.seats = [];
      this.dailyBookings = [];
      this.selectedSeat = null;
      this.allSeatsInSelectedRoom = [];
    },
    // 选择座位
    selectSeat(seat) {
      if (seat.status === 'occupied') {
        uni.showToast({ title: '该座位已被预约', icon: 'none' });
        return;
      }
      
      const isCurrentlySelected = seat.status === 'selected';

      // 如果有其他座位被选中，则先取消那个座位的选中状态
      if (this.selectedSeat && this.selectedSeat.id !== seat.id) {
          const flatSeats = this.seats.flat();
          const prevSeat = flatSeats.find(s => s.id === this.selectedSeat.id);
          if (prevSeat) {
              prevSeat.status = 'available';
        }
      }
      
      // 切换当前点击座位的状态
      if (isCurrentlySelected) {
        seat.status = 'available';
        this.selectedSeat = null;
      } else {
        seat.status = 'selected';
        this.selectedSeat = seat;
      }
    },
    // 时间选择变化
    timeChange(e) {
      this.timeIndex = e.detail.value;
      // 重新计算并更新座位状态
      this.updateSeatStatuses();
    },
    // 确认预约
    async confirmBooking() {
      if (!this.selectedSeat || !this.selectedRoom) {
        uni.showToast({ title: '数据错误，请重试', icon: 'none' });
        return;
      }
      
      // uni.showLoading({ title: '正在提交预约...' }); // 移除加载弹窗

      // 提前将需要的变量存储起来，防止后续被清空
      const roomName = this.selectedRoom.name;
      const seatLabel = this.selectedSeat.label;
      const seatId = this.selectedSeat.id;
      const startTime = this.timeRange[0][this.timeIndex[0]];
      const endTime = this.timeRange[1][this.timeIndex[1]];

      try {
        const bookingData = {
          number: `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `预约单-${roomName}-${seatLabel}`,
          lb77_booking_date: this.currentDate,
          lb77_start_time: this.timeToSeconds(startTime),
          lb77_end_time: this.timeToSeconds(endTime),
          lb77_status: "已预约",
          lb77_seat_id_number: seatId,
          lb77_student_id_number: "645730151" //  暂时硬编码学生ID
        };

        const res = await KingdeeAgentService.saveSeatBooking(bookingData);

        if (res && res.data && res.data.successCount > 0) {
          // uni.hideLoading(); // 移除加载弹窗
          uni.showToast({ title: '预约成功！', icon: 'success' });

          this.closeSeatSelector();
          
          this.voucher = {
            room: roomName,
            seat: seatLabel,
            date: this.currentDate,
            time: `${startTime} - ${endTime}`,
            expire: endTime
          };
      this.showVoucher = true;
          
          // 重新加载所有房间的预订，静默刷新，不显示loading
          this.fetchAndProcessRooms(false); 
          
        } else {
          throw new Error((res && res.message) || '预约失败，请稍后再试');
        }

      } catch (error) {
        // uni.hideLoading(); // 移除加载弹窗
        console.error("确认预约失败:", error);
        uni.showToast({
          title: error.message || '提交预约时发生错误',
          icon: 'none',
          duration: 3000
        });
      }
    },
    // 关闭凭证
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
        this.lastUpdateTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        
        uni.hideLoading();
        uni.showToast({
          title: '数据已更新',
          icon: 'success'
        });
      }, 1000);
    },
    filterChange(e) {
      this.filterIndex = e.detail.value;
    },
    goToMyReservations() {
      uni.navigateTo({
        url: '/pages/features/my-studyroom-reservations'
      });
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
.header-actions {
  display: flex;
  align-items: center;
  gap: 20rpx; /* 增加按钮和筛选器之间的间距 */
}
.filter-container { /* 现在由 header-actions 替代 */
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
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 改为 flex-start, 让所有行左对齐 */
  min-width: 650rpx;
  margin-bottom: 20rpx;
}
/* 新增：座位行样式 */
.seat-row {
  display: flex;
  flex-wrap: nowrap; /* 确保一行内的座位不换行 */
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}
.seat-row:last-child {
  margin-bottom: 0;
}
/* 移除 seat-grid 并调整 seat */
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
  margin-top: 20rpx; /* 增加与座位图的间距 */
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

/* 我的预约 FAB */
.fab {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-radius: 50rpx;
  padding: 16rpx 32rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 122, 255, 0.3);
  z-index: 100;
  transition: transform 0.2s ease;
}
.fab:active {
  transform: scale(0.95);
}
.fab-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 12rpx;
}
.fab-text {
  font-size: 28rpx;
  font-weight: 500;
}
</style>
