<template>
	<view class="library-page">
		<!-- 顶部搜索栏 -->
		<view class="search-container">
			<view class="search-bar">
				<input 
					type="text" 
					class="search-input" 
					placeholder="搜索书名、作者或ISBN" 
					v-model="searchKeyword"
					@confirm="searchBooks"
				/>
				<view class="search-btn" @tap="searchBooks">
					<image src="/static/images/search.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="scan-btn" @tap="scanBook">
				<image src="/static/images/scan.png" mode="aspectFit"></image>
			</view>
		</view>
		
		<!-- AR导航提示 -->
		<view class="ar-guide" v-if="!isSearchMode" @tap="startARNavigation">
			<image src="/static/images/ar.png" mode="aspectFit" class="ar-icon"></image>
			<view class="ar-text">
				<text class="ar-title">AR书架导航</text>
				<text class="ar-desc">扫描书架码，轻松找到您要的图书</text>
			</view>
			<view class="ar-arrow">
				<image src="/static/images/arrow-right.png" mode="aspectFit"></image>
			</view>
		</view>
		
		<!-- 搜索结果/推荐图书 -->
		<view class="book-section">
			<view class="section-header">
				<text class="section-title">{{isSearchMode ? '搜索结果' : '推荐图书'}}</text>
				<view class="section-filter" v-if="isSearchMode" @tap="showFilterOptions">
					<text>筛选</text>
					<image src="/static/images/filter.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<scroll-view scroll-y="true" class="book-list">
				<view 
					class="book-item" 
					v-for="(book, index) in displayBooks" 
					:key="index"
					@tap="viewBookDetail(book)"
				>
					<image :src="book.cover" mode="aspectFill" class="book-cover"></image>
					<view class="book-info">
						<text class="book-title">{{book.title}}</text>
						<text class="book-author">{{book.author}}</text>
						<view class="book-tags">
							<text class="book-tag" v-for="(tag, tagIndex) in book.tags" :key="tagIndex">{{tag}}</text>
						</view>
						<view class="book-status" :class="{'available': book.available}">
							<text>{{book.available ? '可借阅' : '已借出'}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 底部导航栏 -->
		<view class="tab-bar">
			<view class="tab-item" @tap="switchTab('search')">
				<image :src="currentTab === 'search' ? '/static/images/search-active.png' : '/static/images/search.png'" mode="aspectFit"></image>
				<text :class="{'active': currentTab === 'search'}">图书搜索</text>
			</view>
			<view class="tab-item" @tap="switchTab('shelf')">
				<image :src="currentTab === 'shelf' ? '/static/images/shelf-active.png' : '/static/images/shelf.png'" mode="aspectFit"></image>
				<text :class="{'active': currentTab === 'shelf'}">我的书架</text>
			</view>
			<view class="tab-item" @tap="switchTab('history')">
				<image :src="currentTab === 'history' ? '/static/images/history-active.png' : '/static/images/history.png'" mode="aspectFit"></image>
				<text :class="{'active': currentTab === 'history'}">借阅历史</text>
			</view>
		</view>
		
		<!-- 图书详情弹窗 -->
		<view class="book-detail-popup" v-if="showBookDetail">
			<view class="popup-mask" @tap="hideBookDetail"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">图书详情</text>
					<view class="popup-close" @tap="hideBookDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				
				<view class="popup-body">
					<view class="detail-book">
						<image :src="selectedBook.cover" mode="aspectFill" class="detail-cover"></image>
						<view class="detail-info">
							<text class="detail-title">{{selectedBook.title}}</text>
							<text class="detail-author">作者: {{selectedBook.author}}</text>
							<text class="detail-publisher">出版社: {{selectedBook.publisher}}</text>
							<text class="detail-isbn">ISBN: {{selectedBook.isbn}}</text>
						</view>
					</view>
					
					<view class="detail-section">
						<text class="detail-section-title">图书简介</text>
						<text class="detail-description">{{selectedBook.description}}</text>
					</view>
					
					<view class="detail-section">
						<text class="detail-section-title">借阅信息</text>
						<view class="detail-location">
							<text class="location-label">馆藏位置:</text>
							<text class="location-value">{{selectedBook.location}}</text>
						</view>
						<view class="detail-availability">
							<text class="availability-label">借阅状态:</text>
							<text class="availability-value" :class="{'available': selectedBook.available}">{{selectedBook.available ? '可借阅' : '已借出'}}</text>
						</view>
						<view class="detail-duedate" v-if="!selectedBook.available">
							<text class="duedate-label">预计归还日期:</text>
							<text class="duedate-value">{{selectedBook.dueDate}}</text>
						</view>
					</view>
					
					<view class="action-buttons">
						<button class="action-btn primary" v-if="selectedBook.available" @tap="borrowBook">
							<image src="/static/images/borrow.png" mode="aspectFit"></image>
							<text>借阅图书</text>
						</button>
						<button class="action-btn secondary" v-else @tap="reserveBook">
							<image src="/static/images/reserve.png" mode="aspectFit"></image>
							<text>预约图书</text>
						</button>
						<button class="action-btn secondary" @tap="locateBook">
							<image src="/static/images/locate.png" mode="aspectFit"></image>
							<text>查找位置</text>
						</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- AR导航模拟界面 -->
		<view class="ar-navigation" v-if="showARNavigation">
			<view class="ar-camera">
				<!-- 模拟相机画面 -->
				<image src="/static/images/ar-camera.png" mode="aspectFill" class="camera-preview"></image>
				
				<!-- AR路径指引 -->
				<view class="ar-direction">
					<image src="/static/images/ar-direction.png" mode="aspectFit"></image>
				</view>
				
				<!-- 书架标记 -->
				<view class="ar-shelf-marker">
					<text>历史文学区 A12</text>
				</view>
			</view>
			
			<view class="ar-controls">
				<view class="ar-info">
					<text class="ar-distance">距离目标: 15米</text>
					<text class="ar-target">目标: 历史文学区 A12-3</text>
				</view>
				
				<button class="ar-exit-btn" @tap="exitARNavigation">退出导航</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 搜索相关
			searchKeyword: '',
			isSearchMode: false,
			
			// 标签页
			currentTab: 'search',
			
			// 图书详情
			showBookDetail: false,
			selectedBook: {},
			
			// AR导航
			showARNavigation: false,
			
			// 模拟数据 - 推荐图书
			recommendedBooks: [
				{
					id: 1,
					title: '人类简史',
					author: '尤瓦尔·赫拉利',
					publisher: '中信出版社',
					isbn: '9787508647357',
					cover: '/static/images/book1.png',
					tags: ['历史', '人类学'],
					available: true,
					location: '人文社科区 A12-3',
					description: '这是一部宏大的人类简史，从人类的起源讲起，将生物演化与历史发展交织在一起，描述了从远古人类演化至今的历程。'
				},
				{
					id: 2,
					title: '三体',
					author: '刘慈欣',
					publisher: '重庆出版社',
					isbn: '9787536692930',
					cover: '/static/images/book2.png',
					tags: ['科幻', '奇幻'],
					available: false,
					dueDate: '2023-06-01',
					location: '科幻小说区 B05-2',
					description: '在文化大革命如火如荼进行的同时，军方探寻外星文明的绝秘计划"红岸工程"取得了突破性进展。但在按下发射键的那一刻，历经劫难的叶文洁没有意识到，她彻底改变了人类的命运。'
				},
				{
					id: 3,
					title: '活着',
					author: '余华',
					publisher: '作家出版社',
					isbn: '9787506365437',
					cover: '/static/images/book3.png',
					tags: ['文学', '当代'],
					available: true,
					location: '现当代文学区 C02-1',
					description: '《活着》是余华的代表作之一，讲述了农村人福贵悲惨的人生遭遇。福贵少年时代嗜赌成性，终于赌光了家业，福贵的父亲被他活活气死，福贵和妻子家珍在贫困中勉强生活。'
				},
				{
					id: 4,
					title: '算法导论',
					author: '科尔曼等',
					publisher: '机械工业出版社',
					isbn: '9787111407010',
					cover: '/static/images/book4.png',
					tags: ['计算机', '算法'],
					available: true,
					location: '计算机科学区 D08-4',
					description: '本书提供了对当代计算机算法研究的一个全面、系统的阐述，重点讨论了设计与分析高效算法所需的工具与技术，以及在解决实际应用问题时如何有效地利用各种算法。'
				}
			],
			
			// 模拟数据 - 搜索结果
			searchResults: [],
			
			// 模拟数据 - 我的书架
			myShelf: [
				{
					id: 5,
					title: '百年孤独',
					author: '加西亚·马尔克斯',
					publisher: '南海出版公司',
					isbn: '9787544253994',
					cover: '/static/images/book5.png',
					tags: ['文学', '魔幻现实主义'],
					borrowDate: '2023-04-15',
					dueDate: '2023-05-15',
					description: '《百年孤独》是魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰。'
				},
				{
					id: 6,
					title: '解忧杂货店',
					author: '东野圭吾',
					publisher: '南海出版公司',
					isbn: '9787544270878',
					cover: '/static/images/book6.png',
					tags: ['小说', '治愈'],
					borrowDate: '2023-04-20',
					dueDate: '2023-05-20',
					description: '这是一部充满温情的作品，故事讲述了在一家名为"解忧杂货店"的店铺，人们可以将烦恼写成信投进店后的信箱，就能在第二天收到回答。'
				}
			],
			
			// 模拟数据 - 借阅历史
			borrowHistory: [
				{
					id: 7,
					title: '置身事内',
					author: '兰小欢',
					publisher: '上海人民出版社',
					isbn: '9787208171336',
					cover: '/static/images/book7.png',
					tags: ['经济', '政治'],
					borrowDate: '2023-03-10',
					returnDate: '2023-04-10',
					description: '本书是一部融通经济学、社会学、政治学等多学科知识，分析中国地方政府行为模式与运行机制的通识读物。'
				},
				{
					id: 8,
					title: '围城',
					author: '钱钟书',
					publisher: '人民文学出版社',
					isbn: '9787020090006',
					cover: '/static/images/book8.png',
					tags: ['文学', '现代'],
					borrowDate: '2023-02-15',
					returnDate: '2023-03-15',
					description: '《围城》是钱钟书所著的长篇小说，描写了青年方鸿渐从美国留学回来后，在抗战初期的上海、香港，以及内地三闾大学的种种遭遇。'
				}
			]
		}
	},
	computed: {
		// 根据当前标签页显示不同的图书列表
		displayBooks() {
			if (this.isSearchMode) {
				return this.searchResults;
			}
			
			switch (this.currentTab) {
				case 'search':
					return this.recommendedBooks;
				case 'shelf':
					return this.myShelf;
				case 'history':
					return this.borrowHistory;
				default:
					return this.recommendedBooks;
			}
		}
	},
	methods: {
		// 搜索图书
		searchBooks() {
			if (!this.searchKeyword.trim()) {
				this.isSearchMode = false;
				return;
			}
			
			// 模拟搜索请求
			uni.showLoading({
				title: '搜索中...'
			});
			
			setTimeout(() => {
				// 模拟搜索结果
				this.searchResults = this.mockSearchResults(this.searchKeyword);
				this.isSearchMode = true;
				
				uni.hideLoading();
			}, 1000);
		},
		
		// 模拟搜索结果
		mockSearchResults(keyword) {
			// 简单模拟，实际应用中会调用API进行搜索
			// 这里将所有图书数据合并后进行简单过滤
			const allBooks = [
				...this.recommendedBooks,
				...this.myShelf,
				...this.borrowHistory
			];
			
			// 过滤符合关键词的图书
			return allBooks.filter(book => {
				const lowerKeyword = keyword.toLowerCase();
				return book.title.toLowerCase().includes(lowerKeyword) ||
					book.author.toLowerCase().includes(lowerKeyword) ||
					book.isbn.includes(keyword);
			});
		},
		
		// 扫描图书
		scanBook() {
			uni.scanCode({
				scanType: ['qrCode', 'barCode'],
				success: (res) => {
					console.log('扫描结果：', res);
					
					// 判断是ISBN还是QR码
					if (res.result.length >= 10 && /^\d+$/.test(res.result)) {
						// 当作ISBN处理
						this.searchKeyword = res.result;
						this.searchBooks();
					} else {
						// 当作书架二维码处理
						this.startARNavigation();
					}
				}
			});
		},
		
		// 切换标签页
		switchTab(tab) {
			this.currentTab = tab;
			this.isSearchMode = false;
			this.searchKeyword = '';
		},
		
		// 查看图书详情
		viewBookDetail(book) {
			this.selectedBook = book;
			this.showBookDetail = true;
		},
		
		// 隐藏图书详情
		hideBookDetail() {
			this.showBookDetail = false;
		},
		
		// 借阅图书
		borrowBook() {
			uni.showLoading({
				title: '处理中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showModal({
					title: '借阅成功',
					content: `您已成功借阅《${this.selectedBook.title}》，请在2023-06-15前归还。`,
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							// 更新图书状态
							this.selectedBook.available = false;
							this.selectedBook.dueDate = '2023-06-15';
							
							// 添加到我的书架
							this.myShelf.unshift({
								...this.selectedBook,
								borrowDate: '2023-05-15',
								dueDate: '2023-06-15'
							});
							
							this.hideBookDetail();
						}
					}
				});
			}, 1500);
		},
		
		// 预约图书
		reserveBook() {
			uni.showLoading({
				title: '处理中...'
			});
			
			setTimeout(() => {
				uni.hideLoading();
				uni.showModal({
					title: '预约成功',
					content: `您已成功预约《${this.selectedBook.title}》，图书归还后将通知您。`,
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							this.hideBookDetail();
						}
					}
				});
			}, 1500);
		},
		
		// 定位图书位置
		locateBook() {
			this.hideBookDetail();
			this.startARNavigation();
		},
		
		// 显示筛选选项
		showFilterOptions() {
			uni.showActionSheet({
				itemList: ['全部', '可借阅', '已借出', '文学类', '科技类'],
				success: (res) => {
					uni.showToast({
						title: '已选择：' + ['全部', '可借阅', '已借出', '文学类', '科技类'][res.tapIndex],
						icon: 'none'
					});
				}
			});
		},
		
		// 启动AR导航
		startARNavigation() {
			// 实际应用中，这里应该请求相机权限并启动AR功能
			this.showARNavigation = true;
		},
		
		// 退出AR导航
		exitARNavigation() {
			this.showARNavigation = false;
		}
	}
}
</script>

<style>
.library-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #F8F8F8;
}

/* 搜索栏样式 */
.search-container {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #FFFFFF;
}

.search-bar {
	flex: 1;
	display: flex;
	align-items: center;
	height: 70rpx;
	background-color: #F5F5F5;
	border-radius: 35rpx;
	padding: 0 20rpx;
}

.search-input {
	flex: 1;
	height: 70rpx;
	font-size: 28rpx;
}

.search-btn {
	width: 50rpx;
	height: 50rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.search-btn image {
	width: 40rpx;
	height: 40rpx;
}

.scan-btn {
	width: 70rpx;
	height: 70rpx;
	border-radius: 35rpx;
	background-color: #007AFF;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 20rpx;
}

.scan-btn image {
	width: 40rpx;
	height: 40rpx;
}

/* AR导航提示样式 */
.ar-guide {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #E6F2FF;
	margin: 0 20rpx 20rpx;
	border-radius: 10rpx;
}

.ar-icon {
	width: 60rpx;
	height: 60rpx;
	margin-right: 20rpx;
}

.ar-text {
	flex: 1;
}

.ar-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	display: block;
}

.ar-desc {
	font-size: 24rpx;
	color: #666;
	margin-top: 6rpx;
	display: block;
}

.ar-arrow {
	width: 40rpx;
	height: 40rpx;
}

.ar-arrow image {
	width: 100%;
	height: 100%;
}

/* 图书列表样式 */
.book-section {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 0 20rpx;
	overflow: hidden;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.section-filter {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #666;
}

.section-filter image {
	width: 28rpx;
	height: 28rpx;
	margin-left: 8rpx;
}

.book-list {
	flex: 1;
}

.book-item {
	display: flex;
	padding: 20rpx;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.book-cover {
	width: 180rpx;
	height: 240rpx;
	border-radius: 6rpx;
	margin-right: 20rpx;
}

.book-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.book-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.book-author {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.book-tags {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 10rpx;
}

.book-tag {
	font-size: 20rpx;
	color: #007AFF;
	background-color: #E6F2FF;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	margin-right: 10rpx;
	margin-bottom: 10rpx;
}

.book-status {
	margin-top: auto;
	font-size: 24rpx;
	color: #FF3B30;
	padding: 6rpx 16rpx;
	background-color: #FFEBEB;
	border-radius: 20rpx;
	width: fit-content;
}

.book-status.available {
	color: #4CD964;
	background-color: #E6FFF2;
}

/* 底部导航栏样式 */
.tab-bar {
	display: flex;
	height: 100rpx;
	background-color: #FFFFFF;
	border-top: 1rpx solid #F0F0F0;
}

.tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.tab-item image {
	width: 48rpx;
	height: 48rpx;
	margin-bottom: 6rpx;
}

.tab-item text {
	font-size: 22rpx;
	color: #999;
}

.tab-item text.active {
	color: #007AFF;
}

/* 图书详情弹窗样式 */
.book-detail-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
}

.popup-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
	width: 90%;
	max-height: 90%;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	overflow: hidden;
	z-index: 10000;
	display: flex;
	flex-direction: column;
}

.popup-header {
	position: relative;
	padding: 30rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
}

.popup-close {
	position: absolute;
	top: 30rpx;
	right: 30rpx;
	width: 40rpx;
	height: 40rpx;
}

.popup-close image {
	width: 100%;
	height: 100%;
}

.popup-body {
	flex: 1;
	padding: 30rpx;
	overflow-y: auto;
}

.detail-book {
	display: flex;
	margin-bottom: 30rpx;
}

.detail-cover {
	width: 200rpx;
	height: 280rpx;
	border-radius: 10rpx;
	margin-right: 30rpx;
}

.detail-info {
	flex: 1;
}

.detail-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.detail-author, .detail-publisher, .detail-isbn {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.detail-section {
	margin-bottom: 30rpx;
}

.detail-section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.detail-description {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	text-align: justify;
}

.detail-location, .detail-availability, .detail-duedate {
	display: flex;
	font-size: 26rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.location-label, .availability-label, .duedate-label {
	width: 160rpx;
}

.availability-value.available {
	color: #4CD964;
}

.action-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 40rpx;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 30%;
	height: 160rpx;
	justify-content: center;
	border-radius: 10rpx;
}

.action-btn image {
	width: 60rpx;
	height: 60rpx;
	margin-bottom: 10rpx;
}

.action-btn text {
	font-size: 24rpx;
}

.action-btn.primary {
	background-color: #007AFF;
	color: #FFFFFF;
}

.action-btn.secondary {
	background-color: #F5F5F5;
	color: #333;
}

/* AR导航界面样式 */
.ar-navigation {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10000;
	background-color: #000000;
	display: flex;
	flex-direction: column;
}

.ar-camera {
	flex: 1;
	position: relative;
}

.camera-preview {
	width: 100%;
	height: 100%;
}

.ar-direction {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
}

.ar-direction image {
	width: 100%;
	height: 100%;
}

.ar-shelf-marker {
	position: absolute;
	top: 300rpx;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(0, 122, 255, 0.8);
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
}

.ar-shelf-marker text {
	color: #FFFFFF;
	font-size: 28rpx;
	font-weight: bold;
}

.ar-controls {
	height: 200rpx;
	background-color: rgba(0, 0, 0, 0.7);
	padding: 20rpx;
	display: flex;
	flex-direction: column;
}

.ar-info {
	flex: 1;
}

.ar-distance, .ar-target {
	color: #FFFFFF;
	font-size: 28rpx;
	margin-bottom: 10rpx;
	display: block;
}

.ar-exit-btn {
	height: 80rpx;
	line-height: 80rpx;
	background-color: #007AFF;
	color: #FFFFFF;
	font-size: 30rpx;
	border-radius: 40rpx;
}
</style> 