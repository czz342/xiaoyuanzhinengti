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
		<view class="book-section" v-if="currentTab === 'search'">
			<view class="section-header">
				<text class="section-title">{{isSearchMode ? '搜索结果' : `推荐图书 (${recommendedBooks.length})`}}</text>
				<view class="section-filter" v-if="isSearchMode" @tap="showFilterOptions">
					<text>筛选</text>
					<image src="/static/images/filter.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<view class="book-list-wrapper">
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
		</view>
		
		<!-- 我的借阅列表 -->
		<view class="book-section" v-if="currentTab === 'shelf' || currentTab === 'history'">
			<view class="section-header">
				<text class="section-title">{{ currentTab === 'shelf' ? '我的书架' : '借阅历史' }}</text>
			</view>
			
			<view class="book-list-wrapper">
				<scroll-view scroll-y="true" class="book-list">
					<!-- 复用 book-item 的样式来展示借阅记录 -->
					<view 
						class="book-item" 
						v-for="(item) in myBorrowings" 
						:key="item.billno"
						@tap="viewBorrowingDetail(item)"
					>
						<image :src="item.cover" mode="aspectFill" class="book-cover"></image>
						<view class="book-info">
							<text class="book-title">{{ item.title }}</text>
							<text class="book-author">借阅日期: {{ item.borrowDate }}</text>
							<text class="book-author">应还日期: {{ item.dueDate }}</text>
							<view class="book-status" :class="item.statusClass">
								<text>{{ item.statusText }}</text>
							</view>
						</view>
					</view>
					<view v-if="!myBorrowings.length && !isLoading" class="empty-list">
						<image src="/static/images/empty-box.png" class="empty-icon"></image>
						<text class="empty-text">您还没有借阅任何图书</text>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 底部导航栏 -->
		<view class="tab-bar">
			<view class="tab-item" @tap="switchTab('search')">
				<image :src="currentTab === 'search' ? '/static/images/search-active.png' : '/static/images/search.png'" mode="aspectFit"></image>
				<text :class="{'active': currentTab === 'search'}">图书搜索</text>
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
						<view class="detail-borrow-days" v-if="selectedBook.available">
							<text class="borrow-days-label">借阅天数:</text>
							<uni-number-box v-model="borrowingDays" :min="1" :max="90"></uni-number-box>
						</view>
						<view class="detail-borrow-date" v-if="selectedBook.available">
							<text class="borrow-date-label">借阅日期:</text>
							<text class="borrow-date-value">{{ borrowDate }}</text>
						</view>
						<view class="detail-due-date-calc" v-if="selectedBook.available">
							<text class="due-date-label">应还日期:</text>
							<text class="due-date-value">{{ calculatedDueDate }}</text>
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
		
		<!-- 借阅详情弹窗 -->
		<view class="book-detail-popup" v-if="showBorrowDetail">
			<view class="popup-mask" @tap="hideBorrowingDetail"></view>
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">借阅详情</text>
					<view class="popup-close" @tap="hideBorrowingDetail">
						<image src="/static/images/close.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="popup-body">
					<view class="detail-book">
						<image :src="selectedBorrowing.cover" mode="aspectFill" class="detail-cover"></image>
						<view class="detail-info">
							<text class="detail-title">{{ selectedBorrowing.title }}</text>
							<text class="detail-author">作者: {{ selectedBorrowing.author }}</text>
						</view>
					</view>
					<view class="detail-section">
						<text class="detail-section-title">详细信息</text>
						<view class="detail-item">
							<text class="detail-label">单据编号:</text>
							<text class="detail-value">{{ selectedBorrowing.billno }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">借阅日期:</text>
							<text class="detail-value">{{ selectedBorrowing.borrowDate }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">应还日期:</text>
							<text class="detail-value">{{ selectedBorrowing.dueDate }}</text>
						</view>
						<view class="detail-item">
							<text class="detail-label">当前状态:</text>
							<view class="book-status" :class="selectedBorrowing.statusClass" style="margin-top:0; margin-left: -10rpx;">
								<text>{{ selectedBorrowing.statusText }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import KingdeeAgentService from '@/services/kingdeeAgent.js';

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
			borrowingDays: 30, // 新增：借阅天数
			
			// AR导航
			showARNavigation: false,
			
			// 图书列表数据
			recommendedBooks: [],
			searchResults: [],
			
			// 我的借阅数据
			myBorrowings: [],
			isLoading: false, // 用于防止重复加载
			showBorrowDetail: false, // 控制借阅详情弹窗
			selectedBorrowing: {} // 选中的借阅记录
		}
	},
	onLoad() {
		this.fetchBooks();
	},
	computed: {
		// 根据当前标签页显示不同的图书列表
		displayBooks() {
			// 简化逻辑，只处理搜索模式和默认的推荐图书
			return this.isSearchMode ? this.searchResults : this.recommendedBooks;
		},
		borrowDate() {
			const today = new Date();
			return today.toLocaleDateString();
		},
		calculatedDueDate() {
			const today = new Date();
			today.setDate(today.getDate() + this.borrowingDays);
			return today.toLocaleDateString();
		}
	},
	methods: {
		// 获取图书列表
		async fetchBooks() {
			uni.showLoading({
				title: '加载中...'
			});
			try {
				const response = await KingdeeAgentService.getBooksList();
				if (response && response.status && response.data && Array.isArray(response.data.rows)) {
					// 映射API数据到页面格式
					this.recommendedBooks = response.data.rows.map(book => {
						// 从完整路径中提取文件名
						const fullPath = book.lb77_picturefield || '';
						const fileName = fullPath.split('\\').pop();
						
						return {
							id: book.number, // 使用ISBN作为唯一ID
							title: book.name,
							author: book.lb77_author,
							publisher: book.lb77_press,
							isbn: book.number,
							// 将后台返回的文件名与本地静态资源路径拼接
							cover: fileName ? `/static/images/BookPicture/${fileName}` : '/static/images/book-placeholder.png',
							tags: book.lb77_type ? book.lb77_type.split(',') : ['综合'],
							// 假设API返回的状态'C'为可借阅，需要根据实际业务调整
							available: book.status === 'C',
							location: book.lb77_addr,
							description: '暂无简介' // API暂未提供简介字段
						};
					});
				} else {
					uni.showToast({
						title: response.message || '获取图书列表失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error("获取图书列表失败:", error);
				uni.showToast({
					title: '网络请求失败，请稍后重试',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		},
			
		// 获取我的借阅记录
		async fetchMyBorrowings() {
			this.isLoading = true;
			uni.showLoading({ title: '加载中...' });
			try {
				const studentId = '645730151'; // 根据约定使用硬编码ID
				const response = await KingdeeAgentService.getPersonalBookBorrowings(studentId);
				if (response && response.status && response.data && Array.isArray(response.data.rows)) {
					this.myBorrowings = response.data.rows.map(item => {
						const dueDate = new Date(item.lb77_endtime);
						const now = new Date();
						// 注意：API未返回实际归还日期，这里的状态是基于应还日期的推测
						const isOverdue = now > dueDate;
						const statusText = isOverdue ? '已到期' : '借阅中';
						const statusClass = isOverdue ? 'overdue' : 'borrowing';
						
						return {
							billno: item.billno,
							title: item.lb77_name,
							author: item.lb77_author,
							cover: item.lb77_picturefield ? `/static/images/BookPicture/${item.lb77_picturefield.split('\\').pop()}` : '/static/images/book-placeholder.png',
							borrowDate: new Date(item.createtime).toLocaleDateString(),
							dueDate: dueDate.toLocaleDateString(),
							statusText: statusText,
							statusClass: statusClass
						};
					});
				} else {
					uni.showToast({ title: response.message || '获取借阅记录失败', icon: 'none' });
					this.myBorrowings = [];
				}
			} catch (error) {
				console.error("获取借阅记录失败:", error);
				uni.showToast({ title: '网络请求失败', icon: 'none' });
			} finally {
				this.isLoading = false;
				uni.hideLoading();
			}
		},
		
		// 借阅图书
		async borrowBook() {
			uni.showLoading({ title: '正在提交...' });
			
			try {
				// 注意：学生ID应从登录信息中动态获取，此处为测试用例
				const studentId = '645730151';
				
				// 自动生成一个唯一的单据编号
				const billno = `borrow-${Date.now()}`;
		
				const borrowingData = {
					billno: billno,
					lb77_day: this.borrowingDays, // 使用v-model绑定的天数
					lb77_books_number: this.selectedBook.isbn,
					lb77_students_number: studentId
				};
		
				const response = await KingdeeAgentService.createBookBorrowingRequest(borrowingData);
		
				if (response && response.status && response.data && response.data.successCount > 0) {
					uni.showToast({ title: '借阅成功!', icon: 'success' });
					this.hideBookDetail();
					// 借阅成功后刷新列表
					this.fetchBooks();
				} else {
					// 尝试获取更详细的错误信息
					const errorMsg = response?.data?.result?.[0]?.errors?.[0]?.msg || response.message || '借阅失败';
					uni.showToast({ title: errorMsg, icon: 'none', duration: 3000 });
				}
		
			} catch (error) {
				console.error('借阅请求失败:', error);
				uni.showToast({ title: '请求异常，请稍后重试', icon: 'none' });
			} finally {
				uni.hideLoading();
		}
	},
		
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
				...this.searchResults
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
			// 切换时按需加载数据
			if (tab === 'search' && this.recommendedBooks.length === 0) {
				this.fetchBooks();
			} else if (tab === 'history') {
				this.fetchMyBorrowings();
			}
		},
		
		// 查看图书详情
		viewBookDetail(book) {
			this.selectedBook = book;
			this.borrowingDays = 30; // 每次打开弹窗时重置为默认值
			this.showBookDetail = true;
		},
		
		// 隐藏图书详情
		hideBookDetail() {
			this.showBookDetail = false;
		},
		
		// 新增：显示/隐藏借阅详情
		viewBorrowingDetail(item) {
			this.selectedBorrowing = item;
			this.showBorrowDetail = true;
		},
		hideBorrowingDetail() {
			this.showBorrowDetail = false;
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
	padding-bottom: 20rpx; /* 为底部导航栏预留空间 */
	box-sizing: border-box;
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

.book-list-wrapper {
	flex: 1;
	position: relative;
}

.book-list {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
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
	padding-top: 12rpx;
	box-sizing: border-box;
}

.tab-item image {
	width: 48rpx;
	height: 48rpx;
	margin-bottom: 2rpx;
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

.detail-location, .detail-availability, .detail-duedate, .detail-borrow-days, .detail-borrow-date, .detail-due-date-calc, .detail-item {
	display: flex;
	align-items: center; /* 垂直居中对齐 */
	font-size: 26rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.location-label, .availability-label, .duedate-label, .borrow-days-label, .borrow-date-label, .due-date-label, .detail-label {
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

.empty-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 150rpx;
	color: #999;
}

.empty-icon {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 20rpx;
}

.book-status.overdue {
	color: #FF3B30;
	background-color: #FFEBEB;
}

.book-status.borrowing {
	color: #007AFF;
	background-color: #E6F2FF;
}

.book-status.returned {
	background-color: #6c757d; /* 灰色状态 */
}
</style> 