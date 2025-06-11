<template>
  <view class="express-page">
    <!-- 头部区域 -->
    <view class="header">
      <text class="title">快递服务</text>
      <view class="scan-btn" @tap="scanPackage">
        <text class="btn-icon">🔍</text>
        <text>扫描</text>
      </view>
    </view>

    <!-- 快递搜索框 -->
    <view class="search-box">
      <input type="text" class="search-input" placeholder="输入快递单号或手机号查询" v-model="searchText" confirm-type="search" @confirm="searchPackage" />
      <button class="search-btn" @tap="searchPackage">查询</button>
    </view>

    <!-- 快递汇总信息 -->
    <view class="summary-section">
      <view class="summary-row">
        <view class="summary-item" @tap="filterPackages('all')">
          <text class="summary-number">{{allPackages.length}}</text>
          <text class="summary-label">全部</text>
        </view>
        <view class="summary-item" @tap="filterPackages('inTransit')">
          <text class="summary-number">{{inTransitCount}}</text>
          <text class="summary-label">运输中</text>
        </view>
        <view class="summary-item" @tap="filterPackages('arrived')">
          <text class="summary-number" style="color: #FF8000;">{{arrivedCount}}</text>
          <text class="summary-label">待取件</text>
        </view>
        <view class="summary-item" @tap="filterPackages('completed')">
          <text class="summary-number">{{completedCount}}</text>
          <text class="summary-label">已签收</text>
        </view>
      </view>
    </view>

    <!-- 快递列表 -->
    <view class="package-list">
      <view v-for="pkg in filteredPackages" :key="pkg.id" class="package-card" @tap="showPackageDetail(pkg)">
        <view class="package-header">
          <view class="courier-info">
            <image :src="pkg.courierIcon" mode="aspectFit" class="courier-icon"></image>
            <text class="courier-name">{{pkg.courier}}</text>
          </view>
          <view :class="['status-tag', pkg.statusClass]">{{pkg.statusText}}</view>
        </view>
        <view class="package-content">
          <view class="package-info">
            <text class="tracking-number">{{pkg.trackingNumber}}</text>
            <text class="package-desc">{{pkg.description}}</text>
            <text class="update-time">{{pkg.updateTime}}</text>
          </view>
          <view class="action-area" v-if="pkg.status === 'arrived'">
            <button class="action-btn pickup" @tap.stop="showPickupCode(pkg)">取件码</button>
          </view>
        </view>
      </view>

      <view v-if="filteredPackages.length === 0" class="empty-tip">
        <image src="/static/images/empty-box.png" mode="aspectFit" class="empty-icon"></image>
        <text>暂无相关快递信息</text>
      </view>
    </view>

    <!-- 快递详情弹窗 -->
    <view v-if="showDetail" class="detail-popup">
      <view class="detail-content">
        <view class="detail-header">
          <view class="popup-title">快递详情</view>
          <text class="close-btn" @tap="closeDetail">×</text>
        </view>

        <view class="courier-row">
          <image :src="currentPackage.courierIcon" mode="aspectFit" class="detail-courier-icon"></image>
          <text class="detail-courier-name">{{currentPackage.courier}}</text>
          <view :class="['detail-status', currentPackage.statusClass]">{{currentPackage.statusText}}</view>
        </view>

        <view class="detail-info">
          <view class="detail-item">
            <text class="detail-label">快递单号</text>
            <text class="detail-value">{{currentPackage.trackingNumber}}</text>
            <text class="copy-btn" @tap="copyTrackingNumber">复制</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">物品描述</text>
            <text class="detail-value">{{currentPackage.description}}</text>
          </view>
          <view class="detail-item" v-if="currentPackage.status === 'arrived'">
            <text class="detail-label">驿站位置</text>
            <text class="detail-value">{{currentPackage.location}}</text>
          </view>
          <view class="detail-item" v-if="currentPackage.status === 'arrived'">
            <text class="detail-label">取件码</text>
            <text class="pickup-code">{{currentPackage.pickupCode}}</text>
          </view>
        </view>

        <view class="detail-timeline">
          <view class="timeline-title">物流轨迹</view>
          <view v-for="(track, index) in currentPackage.trackingInfo" :key="index" class="timeline-item">
            <view class="timeline-point" :class="{'active': index === 0}"></view>
            <view class="timeline-content">
              <text class="timeline-status">{{track.status}}</text>
              <text class="timeline-time">{{track.time}}</text>
            </view>
          </view>
        </view>

        <view class="detail-actions" v-if="currentPackage.status === 'arrived'">
          <button class="detail-btn navigate" @tap="navigateToPickup">
            <text class="btn-icon">🧭</text>
            <text>导航取件</text>
          </button>
          <button class="detail-btn remind" @tap="setReminder">
            <text class="btn-icon">⏰</text>
            <text>设置提醒</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 取件码弹窗 -->
    <view v-if="showPickupCodePopup" class="pickup-popup">
      <view class="pickup-content">
        <view class="pickup-header">
          <text class="pickup-title">取件码</text>
          <text class="close-btn" @tap="closePickupCode">×</text>
        </view>
        <view class="code-display">
          <text class="code">{{currentPackage.pickupCode}}</text>
          <text class="code-tip">向驿站工作人员出示此码</text>
        </view>
        <view class="station-info">
          <text class="station-name">{{currentPackage.location}}</text>
          <text class="operation-hours">营业时间: 8:00-22:00</text>
        </view>
        <button class="pickup-nav-btn" @tap="navigateToPickup">
          <text class="btn-icon">🧭</text>
          <text>导航前往 ({{currentPackage.distance}})</text>
        </button>
      </view>
    </view>

    <!-- 导航弹窗 -->
    <view v-if="showNavigation" class="navigation-popup">
      <view class="navigation-content">
        <view class="navigation-header">
          <text class="navigation-title">路线导航</text>
          <text class="close-btn" @tap="closeNavigation">×</text>
        </view>
        <view class="map-container">
          <image src="/static/images/campus-map.png" mode="aspectFit" class="map-image"></image>
          <view class="route-info">
            <text class="route-distance">{{navInfo.distance}}</text>
            <text class="route-time">预计{{navInfo.time}}分钟到达</text>
          </view>
        </view>
        <view class="nav-steps">
          <view v-for="(step, index) in navInfo.steps" :key="index" class="nav-step">
            <text class="step-number">{{index + 1}}</text>
            <text class="step-instruction">{{step}}</text>
          </view>
        </view>
        <view class="nav-actions">
          <button class="nav-action-btn" @tap="startWalking">开始导航</button>
          <button class="nav-action-btn secondary" @tap="closeNavigation">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
      filter: 'all',
      showDetail: false,
      showPickupCodePopup: false,
      showNavigation: false,
      currentPackage: {},
      navInfo: {
        distance: '650米',
        time: 8,
        steps: [
          '从当前位置向东步行100米',
          '左转进入学生宿舍区',
          '沿学生宿舍区主路向北步行300米',
          '右转进入生活服务区',
          '步行50米后可在右侧看到快递驿站'
        ]
      },
      allPackages: [
        {
          id: 1,
          courier: '顺丰速运',
          courierIcon: '/static/images/sf-express.png',
          trackingNumber: 'SF1234567890123',
          description: '图书 1件',
          status: 'arrived',
          statusText: '待取件',
          statusClass: 'status-arrived',
          updateTime: '今天 12:30',
          location: '菜鸟驿站 (三食堂旁)',
          pickupCode: 'SF8842',
          distance: '650米',
          trackingInfo: [
            { status: '快递已到达驿站，请凭取件码尽快领取', time: '今天 12:30' },
            { status: '快递已到达学校集散中心', time: '今天 10:15' },
            { status: '快件正在派送途中', time: '今天 08:42' },
            { status: '快件已到达当地配送站', time: '昨天 20:13' },
            { status: '快件已从上海发出', time: '昨天 06:25' },
            { status: '快件已揽收', time: '前天 18:00' }
          ]
        },
        {
          id: 2,
          courier: '中通快递',
          courierIcon: '/static/images/zt-express.png',
          trackingNumber: 'ZT98765432109876',
          description: '衣物 1件',
          status: 'inTransit',
          statusText: '运输中',
          statusClass: 'status-transit',
          updateTime: '今天 09:15',
          trackingInfo: [
            { status: '快件已到达当地配送站', time: '今天 09:15' },
            { status: '快件已从北京发出', time: '昨天 14:30' },
            { status: '快件已揽收', time: '昨天 10:22' }
          ]
        },
        {
          id: 3,
          courier: '圆通速递',
          courierIcon: '/static/images/yt-express.png',
          trackingNumber: 'YT3333333333333',
          description: '电子产品 1件',
          status: 'arrived',
          statusText: '待取件',
          statusClass: 'status-arrived',
          updateTime: '昨天 15:45',
          location: '图书馆南侧快递驿站',
          pickupCode: 'YT2468',
          distance: '850米',
          trackingInfo: [
            { status: '快递已到达驿站，请凭取件码尽快领取', time: '昨天 15:45' },
            { status: '快递已到达学校集散中心', time: '昨天 13:20' },
            { status: '快件正在派送途中', time: '昨天 09:18' },
            { status: '快件已到达当地配送站', time: '前天 22:34' },
            { status: '快件已从广州发出', time: '3天前 10:15' },
            { status: '快件已揽收', time: '3天前 08:00' }
          ]
        },
        {
          id: 4,
          courier: '京东物流',
          courierIcon: '/static/images/jd-express.png',
          trackingNumber: 'JD1212121212121',
          description: '日用品 2件',
          status: 'completed',
          statusText: '已签收',
          statusClass: 'status-completed',
          updateTime: '3天前 14:30',
          trackingInfo: [
            { status: '包裹已签收，感谢您使用京东物流', time: '3天前 14:30' },
            { status: '快递已到达驿站，请凭取件码尽快领取', time: '3天前 10:25' },
            { status: '快递已到达学校集散中心', time: '3天前 08:10' },
            { status: '快件正在派送途中', time: '4天前 15:43' },
            { status: '快件已到达当地配送站', time: '4天前 06:30' },
            { status: '快件已从上海发出', time: '5天前 18:22' },
            { status: '快件已揽收', time: '5天前 15:10' }
          ]
        }
      ]
    }
  },
  computed: {
    inTransitCount() {
      return this.allPackages.filter(pkg => pkg.status === 'inTransit').length;
    },
    arrivedCount() {
      return this.allPackages.filter(pkg => pkg.status === 'arrived').length;
    },
    completedCount() {
      return this.allPackages.filter(pkg => pkg.status === 'completed').length;
    },
    filteredPackages() {
      if (this.filter === 'all') return this.allPackages;
      return this.allPackages.filter(pkg => pkg.status === this.filter);
    }
  },
  methods: {
    // 扫描快递单号
    scanPackage() {
      uni.scanCode({
        success: (res) => {
          this.searchText = res.result;
          this.searchPackage();
        },
        fail: () => {
          uni.showToast({
            title: '扫描失败',
            icon: 'none'
          });
        }
      });
    },
    
    // 搜索快递
    searchPackage() {
      if (!this.searchText.trim()) {
        uni.showToast({
          title: '请输入快递单号或手机号',
          icon: 'none'
        });
        return;
      }
      
      // 模拟搜索
      const found = this.allPackages.find(pkg => 
        pkg.trackingNumber.includes(this.searchText.trim())
      );
      
      if (found) {
        this.showPackageDetail(found);
      } else {
        uni.showToast({
          title: '未找到相关快递',
          icon: 'none'
        });
      }
    },
    
    // 筛选快递
    filterPackages(status) {
      this.filter = status;
    },
    
    // 显示快递详情
    showPackageDetail(pkg) {
      this.currentPackage = pkg;
      this.showDetail = true;
    },
    
    // 关闭详情
    closeDetail() {
      this.showDetail = false;
    },
    
    // 显示取件码
    showPickupCode(pkg) {
      this.currentPackage = pkg;
      this.showPickupCodePopup = true;
    },
    
    // 关闭取件码
    closePickupCode() {
      this.showPickupCodePopup = false;
    },
    
    // 复制单号
    copyTrackingNumber() {
      uni.setClipboardData({
        data: this.currentPackage.trackingNumber,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          });
        }
      });
    },
    
    // 导航到取件点
    navigateToPickup() {
      this.closePickupCode();
      this.closeDetail();
      this.showNavigation = true;
    },
    
    // 关闭导航
    closeNavigation() {
      this.showNavigation = false;
    },
    
    // 开始步行导航
    startWalking() {
      uni.showToast({
        title: '开始导航',
        icon: 'success'
      });
      this.closeNavigation();
    },
    
    // 设置提醒
    setReminder() {
      uni.showToast({
        title: '已设置22:00前取件提醒',
        icon: 'success'
      });
    },

    // 模拟短信识别功能
    autoDetectExpressFromSMS() {
      // 实际应用中需要获取短信权限
      uni.showModal({
        title: '快递识别',
        content: '是否允许从短信中识别快递信息？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '已添加识别到的快递',
              icon: 'success'
            });
          }
        }
      });
    }
  },
  onLoad(options) {
    if (options.packageId) {
      const pkgId = parseInt(options.packageId, 10);
      const pkg = this.allPackages.find(p => p.id === pkgId);
      if (pkg) {
        // 使用 $nextTick 确保页面渲染后再显示弹窗
        this.$nextTick(() => {
          this.showPackageDetail(pkg);
        });
      }
    }
    // 页面加载时执行
    this.autoDetectExpressFromSMS();
  },
  onShow() {
    // 模拟新快递通知
    if (Math.random() > 0.5) {
      setTimeout(() => {
        uni.showModal({
          title: '新快递到达',
          content: '您有1个新快递已到达第二教学楼东侧快递驿站，是否查看详情？',
          confirmText: '查看',
          success: (res) => {
            if (res.confirm) {
              this.showPackageDetail(this.allPackages[0]);
            }
          }
        });
      }, 1500);
    }
  }
}
</script>

<style>
.express-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 20rpx;
}

/* 头部区域 */
.header {
  padding: 40rpx 30rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}
.scan-btn {
  display: flex;
  align-items: center;
  background: #007AFF;
  color: #fff;
  padding: 12rpx 24rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
}
.btn-icon {
  margin-right: 6rpx;
  font-size: 28rpx;
}

/* 搜索框 */
.search-box {
  margin: 10rpx 30rpx 30rpx;
  display: flex;
  align-items: center;
}
.search-input {
  flex: 1;
  height: 80rpx;
  background: #fff;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.search-btn {
  width: 120rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #007AFF;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
  margin-left: 20rpx;
  padding: 0;
}

/* 快递汇总 */
.summary-section {
  margin: 0 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.summary-row {
  display: flex;
  justify-content: space-around;
}
.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 20rpx;
}
.summary-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.summary-label {
  font-size: 24rpx;
  color: #666;
  margin-top: 6rpx;
}

/* 快递列表 */
.package-list {
  margin: 30rpx;
}
.package-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}
.courier-info {
  display: flex;
  align-items: center;
}
.courier-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}
.courier-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
.status-tag {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}
.status-transit {
  background: #e6f7ff;
  color: #1890ff;
}
.status-arrived {
  background: #fff7e6;
  color: #ff8000;
}
.status-completed {
  background: #f0f0f0;
  color: #999;
}
.package-content {
  padding-top: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.package-info {
  flex: 1;
}
.tracking-number {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}
.package-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}
.update-time {
  font-size: 22rpx;
  color: #999;
}
.action-area {
  min-width: 140rpx;
  display: flex;
  justify-content: flex-end;
}
.action-btn {
  font-size: 26rpx;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  background: #fff;
  border: 1rpx solid;
}
.pickup {
  color: #ff8000;
  border-color: #ff8000;
}
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

/* 快递详情弹窗 */
.detail-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}
.detail-content {
  width: 100%;
  max-height: 80vh;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  overflow-y: auto;
}
.detail-header {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f0f0f0;
}
.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.close-btn {
  font-size: 48rpx;
  line-height: 1;
  color: #999;
  padding: 0 20rpx;
}
.courier-row {
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  background: #f9f9f9;
}
.detail-courier-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
}
.detail-courier-name {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
.detail-status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}
.detail-info {
  padding: 20rpx 30rpx;
}
.detail-item {
  margin-bottom: 20rpx;
  display: flex;
  flex-wrap: wrap;
}
.detail-label {
  width: 140rpx;
  font-size: 26rpx;
  color: #999;
}
.detail-value {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}
.pickup-code {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff8000;
}
.copy-btn {
  font-size: 24rpx;
  color: #007AFF;
  margin-left: 10rpx;
}
.detail-timeline {
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}
.timeline-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 20rpx;
}
.timeline-item {
  position: relative;
  padding-left: 30rpx;
  padding-bottom: 30rpx;
}
.timeline-item:last-child {
  padding-bottom: 0;
}
.timeline-item:before {
  content: '';
  position: absolute;
  left: 6rpx;
  top: 16rpx;
  bottom: 0;
  width: 2rpx;
  background: #e0e0e0;
}
.timeline-item:last-child:before {
  display: none;
}
.timeline-point {
  position: absolute;
  left: 0;
  top: 16rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #e0e0e0;
}
.timeline-point.active {
  background: #007AFF;
}
.timeline-content {
  display: flex;
  flex-direction: column;
}
.timeline-status {
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
}
.timeline-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
}
.detail-actions {
  display: flex;
  padding: 20rpx 30rpx 40rpx;
  border-top: 1rpx solid #f0f0f0;
}
.detail-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  margin: 0 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
}
.navigate {
  background: #007AFF;
  color: white;
}
.remind {
  background: #f5f5f5;
  color: #ff8000;
}

/* 取件码弹窗 */
.pickup-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.pickup-content {
  width: 80%;
  background: white;
  border-radius: 16rpx;
  overflow: hidden;
}
.pickup-header {
  background: #ff8000;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pickup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}
.code-display {
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.code {
  font-size: 60rpx;
  font-weight: bold;
  color: #ff8000;
}
.code-tip {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
}
.station-info {
  background: #f9f9f9;
  padding: 20rpx 30rpx;
  text-align: center;
}
.station-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}
.operation-hours {
  font-size: 24rpx;
  color: #666;
}
.pickup-nav-btn {
  margin: 30rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #007AFF;
  color: white;
  border-radius: 40rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 导航弹窗 */
.navigation-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.navigation-content {
  width: 90%;
  max-height: 80vh;
  background: white;
  border-radius: 16rpx;
  overflow: hidden;
}
.navigation-header {
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #007AFF;
}
.navigation-title {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}
.map-container {
  position: relative;
}
.map-image {
  width: 100%;
  height: 360rpx;
}
.route-info {
  position: absolute;
  bottom: 20rpx;
  left: 20rpx;
  background: rgba(255, 255, 255, 0.9);
  padding: 10rpx 20rpx;
  border-radius: 10rpx;
}
.route-distance {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-right: 20rpx;
}
.route-time {
  font-size: 24rpx;
  color: #666;
}
.nav-steps {
  padding: 20rpx 30rpx;
  max-height: 300rpx;
  overflow-y: auto;
}
.nav-step {
  display: flex;
  padding: 15rpx 0;
}
.step-number {
  width: 50rpx;
  height: 50rpx;
  background: #f0f0f0;
  border-radius: 25rpx;
  text-align: center;
  line-height: 50rpx;
  font-size: 24rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.step-instruction {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  line-height: 50rpx;
}
.nav-actions {
  display: flex;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}
.nav-action-btn {
  flex: 1;
  margin: 0 10rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #007AFF;
  color: white;
  border-radius: 40rpx;
  font-size: 28rpx;
}
.nav-action-btn.secondary {
  background: #f5f5f5;
  color: #333;
}
</style> 