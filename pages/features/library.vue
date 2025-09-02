<template>
	<view class="library-page">
		<!-- 顶部英雄区 -->
		<view class="hero">
			<view class="hero-bg"></view>
			<view class="hero-content">
				<text class="hero-title">校园图书馆</text>
				<text class="hero-subtitle">发现 · 借阅 · 学习</text>
			</view>
		</view>
		<!-- 顶部搜索栏 -->
		<view class="search-container glass-card">
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
		
		<!-- 分类筛选器 -->
		<view class="category-filter glass-card" v-if="categories.length > 0">
			<scroll-view scroll-x="true" class="category-scroll">
				<view 
					class="category-item pill" 
					:class="{'active': selectedCategory === category}"
					v-for="category in categories" 
					:key="category"
					@tap="selectCategory(category)"
				>
					<text>{{category}}</text>
				</view>
			</scroll-view>
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
				<view class="grid">
					<view 
						class="grid-card glass-card" 
						v-for="(book, index) in displayBooks" 
						:key="index"
						@tap="viewBookDetail(book)"
					>
						<image :src="book.cover" mode="aspectFill" class="grid-cover"></image>
						<view class="grid-info">
							<text class="grid-title">{{book.title}}</text>
							<text class="grid-author">{{book.author}}</text>
							<view class="grid-tags">
								<text class="book-tag pill" v-for="(tag, tagIndex) in book.tags" :key="tagIndex">{{tag}}</text>
							</view>
						</view>
						<view class="grid-footer">
							<view class="book-status chip" :class="{'available': book.available}">
								<text>{{book.available ? '可借阅' : '已借出'}}</text>
							</view>
							<button class="mini-btn" @tap.stop="book.available ? borrowQuick(book) : reserveQuick(book)">{{book.available ? '借阅' : '预约'}}</button>
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
						class="book-item glass-card" 
						v-for="(item) in myBorrowings" 
						:key="item.billno"
						@tap="viewBorrowingDetail(item)"
					>
						<image :src="item.cover" mode="aspectFill" class="book-cover"></image>
						<view class="book-info">
							<text class="book-title">{{ item.title }}</text>
							<text class="book-author">借阅日期: {{ item.borrowDate }}</text>
							<text class="book-author">应还日期: {{ item.dueDate }}</text>
							<text class="book-location">馆藏位置: {{ item.location }}</text>
							<view class="book-status chip" :class="item.statusClass">
								<text>{{ item.statusText }}</text>
							</view>
						</view>
						<!-- 归还按钮：仅在未归还状态显示 -->
						<view class="borrow-actions" v-if="item.status !== 'returned'">
							<button class="btn subtle-danger" @tap.stop="openReturnConfirm(item)">归还图书</button>
						</view>
					</view>
					<view v-if="!myBorrowings.length && !isLoading" class="empty-list">
						<image src="/static/images/empty-box.png" class="empty-icon"></image>
						<text class="empty-text">您还没有借阅任何图书</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 自定义归还确认弹窗 -->
		<view class="return-confirm-popup" v-if="showReturnConfirm">
			<view class="popup-mask" @tap="closeReturnConfirm"></view>
			<view class="return-popup-content">
				<text class="return-title">归还提示</text>
				<text class="return-message">请手动归还到</text>
				<text class="return-location">{{ returnTargetLocation }}</text>
				<view class="return-actions">
					<button class="cancel-btn" @tap="closeReturnConfirm">取消</button>
					<button class="confirm-btn" @tap="performReturn">确认归还</button>
				</view>
			</view>
		</view>
		
		<!-- 底部导航栏 -->
		<view class="tab-bar glass-card">
			<view class="tab-item" @tap="switchTab('search')">
				<image :src="currentTab === 'search' ? '/static/images/search-active.png' : '/static/images/search.png'" mode="aspectFit"></image>
				<text :class="{'active': currentTab === 'search'}">图书</text>
			</view>
			<view class="tab-item" @tap="switchTab('history')">
				<image :src="currentTab === 'history' ? '/static/images/history-active.png' : '/static/images/history.png'" mode="aspectFit"></image>
				<text :class="{'active': currentTab === 'history'}">历史</text>
			</view>
		</view>
		
		<!-- 图书详情弹窗 -->
		<view class="book-detail-popup" v-if="showBookDetail">
			<view class="popup-mask" @tap="hideBookDetail"></view>
			<view class="popup-content elevated">
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
						<view class="detail-inventory" v-if="selectedBook.available">
							<text class="inventory-label">库存信息:</text>
							<text class="inventory-value">可借 {{selectedBook.availableCopies}} 册 / 总计 {{selectedBook.totalCopies}} 册</text>
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
			<view class="popup-content elevated">
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
			selectedBorrowing: {}, // 选中的借阅记录
			
			// 分类筛选器相关数据
			categories: [],
			selectedCategory: null,

			// 归还弹窗
			showReturnConfirm: false,
			returnTargetLocation: '',
			returnTargetBorrowingId: null
		}
	},
	onLoad(options) {
		if (options && options.billno) {
			// 来自借阅成功后的跳转链接，需要打开指定借阅记录的详情
			this.handleBorrowingDeepLink(options.billno);
		} else {
			// 正常加载
			this.fetchBooks();
			this.fetchCategories();
		}
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
		// 网格卡片的快捷操作（与现有借阅/预约API复用）
		borrowQuick(book) {
			this.selectedBook = book;
			this.borrowBook();
		},
		reserveQuick(book) {
			this.selectedBook = book;
			this.reserveBook();
		},
		async handleBorrowingDeepLink(billno) {
			// 1. 切换到历史记录标签页并等待数据加载
			await this.switchTab('history');
			
			// 2. 在加载完成的数据中查找对应的记录
			const targetBorrowing = this.myBorrowings.find(item => item.billno === billno);
			
			// 3. 如果找到，则显示详情弹窗
			if (targetBorrowing) {
				this.viewBorrowingDetail(targetBorrowing);
			} else {
				// 如果因为数据延迟等原因没找到，给个提示
				uni.showToast({
					title: '未找到单号为 ' + billno + ' 的借阅记录',
					icon: 'none',
					duration: 3000
				});
			}
		},
		// 获取图书列表
		async fetchBooks() {
			uni.showLoading({
				title: '加载中...'
			});
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/book/list',
					method: 'GET',
					header: {
						'Content-Type': 'application/json'
					}
				});
				
				if (response.statusCode === 200 && response.data.success) {
					// 映射API数据到页面格式
					this.recommendedBooks = response.data.data.map(book => {
						return {
							id: book.id,
							title: book.title,
							author: book.author,
							publisher: book.publisher,
							isbn: book.isbn,
							cover: book.coverImage || '/static/images/book-placeholder.png',
							tags: book.tags || ['综合'],
							available: book.availableCopies > 0,
							location: book.location,
							description: book.description || '暂无简介',
							availableCopies: book.availableCopies,
							totalCopies: book.totalCopies,
							category: book.category
						};
					});
				} else {
					uni.showToast({
						title: response.data.message || '获取图书列表失败',
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
			
			// 检查登录状态
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				this.isLoading = false;
				uni.hideLoading();
				return;
			}
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/book/borrowings/my',
					method: 'GET',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});
				
				if (response.statusCode === 200 && response.data.success) {
					this.myBorrowings = response.data.data.map(item => {
						const dueDate = new Date(item.dueDate);
						const now = new Date();
						const isOverdue = now > dueDate;
						const returned = item.status === 'returned';
						const statusText = returned ? '已归还' : (isOverdue ? '已到期' : '借阅中');
						const statusClass = returned ? 'returned' : (isOverdue ? 'overdue' : 'borrowing');
						
						return {
							id: item.id,
							billno: item.borrowingNumber,
							title: item.bookTitle,
							author: item.bookAuthor,
							cover: item.bookCover || '/static/images/book-placeholder.png',
							borrowDate: new Date(item.borrowDate).toLocaleDateString(),
							dueDate: dueDate.toLocaleDateString(),
							location: item.bookLocation || '馆内-待补充',
							status: item.status,
							statusText,
							statusClass
						};
					});
				} else {
					uni.showToast({ title: response.data.message || '获取借阅记录失败', icon: 'none' });
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
		
		// 获取图书分类
		async fetchCategories() {
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/book/categories/list',
					method: 'GET',
					header: {
						'Content-Type': 'application/json'
					}
				});
				
				if (response.statusCode === 200 && response.data.success) {
					this.categories = response.data.data;
				}
			} catch (error) {
				console.error('获取图书分类失败:', error);
			}
		},
		
		// 选择分类
		selectCategory(category) {
			if (this.selectedCategory === category) {
				this.selectedCategory = null; // 取消选择
			} else {
				this.selectedCategory = category;
			}
			this.fetchBooksByCategory();
		},
		
		// 根据分类获取图书
		async fetchBooksByCategory() {
			if (!this.selectedCategory) {
				this.fetchBooks(); // 如果没有选择分类，获取推荐图书
				return;
			}
			
			uni.showLoading({
				title: '加载中...'
			});
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/book/list',
					method: 'GET',
					header: {
						'Content-Type': 'application/json'
					},
					data: {
						category: this.selectedCategory
					}
				});
				
				if (response.statusCode === 200 && response.data.success) {
					this.recommendedBooks = response.data.data.map(book => ({
						id: book.id,
						title: book.title,
						author: book.author,
						publisher: book.publisher,
						isbn: book.isbn,
						cover: book.coverImage || '/static/images/book-placeholder.png',
						tags: book.tags || ['综合'],
						available: book.availableCopies > 0,
						location: book.location,
						description: book.description || '暂无简介',
						availableCopies: book.availableCopies,
						totalCopies: book.totalCopies,
						category: book.category
					}));
					this.isSearchMode = false;
				}
			} catch (error) {
				console.error('根据分类获取图书失败:', error);
				uni.showToast({
					title: '获取图书失败',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		},
		
		// 借阅图书
		async borrowBook() {
			// 检查登录状态
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return;
			}
			
			uni.showLoading({ title: '正在提交...' });
			
			try {
				const borrowingData = {
					bookId: this.selectedBook.id,
					borrowDays: this.borrowingDays,
					notes: ''
				};
		
				const response = await uni.request({
					url: 'http://localhost:3000/api/book/borrow',
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: borrowingData
				});
		
				if (response.statusCode === 200 && response.data.success) {
					uni.showToast({ title: '借阅成功!', icon: 'success' });
					this.hideBookDetail();
					// 借阅成功后刷新列表
					this.fetchBooks();
					// 刷新借阅记录
					this.fetchMyBorrowings();
				} else {
					const errorMsg = response.data.message || '借阅失败';
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
		async searchBooks() {
			if (!this.searchKeyword.trim()) {
				this.isSearchMode = false;
				return;
			}
			
			uni.showLoading({
				title: '搜索中...'
			});
			
			try {
				const response = await uni.request({
					url: 'http://localhost:3000/api/book/search',
					method: 'GET',
					header: {
						'Content-Type': 'application/json'
					},
					data: {
						keyword: this.searchKeyword.trim()
					}
				});
				
				if (response.statusCode === 200 && response.data.success) {
					this.searchResults = response.data.data.map(book => ({
						id: book.id,
						title: book.title,
						author: book.author,
						publisher: book.publisher,
						isbn: book.isbn,
						cover: book.coverImage || '/static/images/book-placeholder.png',
						tags: book.tags || ['综合'],
						available: book.availableCopies > 0,
						location: book.location,
						description: book.description || '暂无简介',
						availableCopies: book.availableCopies,
						totalCopies: book.totalCopies,
						category: book.category
					}));
					this.isSearchMode = true;
				} else {
					uni.showToast({
						title: response.data.message || '搜索失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('搜索图书失败:', error);
				uni.showToast({
					title: '搜索失败，请稍后重试',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
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
		async switchTab(tab) {
			this.currentTab = tab;
			this.isSearchMode = false;
			this.searchKeyword = '';
			// 切换时按需加载数据
			if (tab === 'search' && this.recommendedBooks.length === 0) {
				await this.fetchBooks();
			} else if (tab === 'history') {
				await this.fetchMyBorrowings();
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
		// 打开归还确认弹窗
		openReturnConfirm(item) {
			this.returnTargetLocation = item.location;
			this.returnTargetBorrowingId = item.id;
			this.showReturnConfirm = true;
		},
		// 关闭归还确认弹窗
		closeReturnConfirm() {
			this.showReturnConfirm = false;
			this.returnTargetBorrowingId = null;
			this.returnTargetLocation = '';
		},
		// 执行归还
		async performReturn() {
			const token = uni.getStorageSync('token');
			if (!token) {
				uni.showToast({ title: '请先登录', icon: 'none' });
				return;
			}
			if (!this.returnTargetBorrowingId) {
				this.closeReturnConfirm();
				return;
			}
			uni.showLoading({ title: '正在归还...' });
			try {
				const response = await uni.request({
					url: `http://localhost:3000/api/book/return/${this.returnTargetBorrowingId}`,
					method: 'PUT',
					header: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					data: { returnDate: new Date().toISOString().split('T')[0] }
				});
				if (response.statusCode === 200 && response.data.success) {
					uni.showToast({ title: '归还成功', icon: 'success' });
					this.closeReturnConfirm();
					// 刷新历史列表
					await this.fetchMyBorrowings();
				} else {
					uni.showToast({ title: response.data.message || '归还失败', icon: 'none' });
				}
			} catch (e) {
				console.error('归还失败:', e);
				uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
			} finally {
				uni.hideLoading();
			}
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
	background: linear-gradient(180deg, #f5f7ff 0%, #ffffff 40%);
	padding-bottom: 20rpx; /* 为底部导航栏预留空间 */
	box-sizing: border-box;
}

/* 英雄区 */
.hero {
	height: 240rpx;
	position: relative;
	margin-bottom: 16rpx;
}
.hero-bg {
	position: absolute;
	left: 0; right: 0; top: 0; bottom: 0;
	background: linear-gradient(135deg, #6a8dff 0%, #8e7dff 50%, #b26dff 100%);
	filter: saturate(110%);
	border-bottom-left-radius: 28rpx;
	border-bottom-right-radius: 28rpx;
}
.hero-content {
	position: relative;
	padding: 36rpx 28rpx 0;
	color: #ffffff;
}
.hero-title {
	font-size: 40rpx;
	font-weight: 700;
}
.hero-subtitle {
	margin-top: 8rpx;
	font-size: 24rpx;
	opacity: 0.9;
}

/* 搜索栏样式 */
.search-container {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: rgba(255,255,255,0.6);
	backdrop-filter: blur(10px);
	border-radius: 16rpx;
	margin: -60rpx 20rpx 10rpx;
	box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
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

/* 分类筛选器样式 */
.category-filter {
	padding: 16rpx 20rpx;
	background-color: rgba(255,255,255,0.7);
	backdrop-filter: blur(10px);
	border-radius: 16rpx;
	margin: 10rpx 20rpx 16rpx;
	border: 1rpx solid rgba(0,0,0,0.04);
}

.category-scroll {
	white-space: nowrap;
}

.category-item {
	display: inline-block;
	padding: 14rpx 28rpx;
	margin-right: 16rpx;
	background: rgba(255,255,255,0.8);
	border-radius: 999rpx;
	font-size: 26rpx;
	color: #555;
	border: 1rpx solid rgba(0,0,0,0.06);
	transition: all 0.25s ease;
}

.category-item.active {
	background: linear-gradient(135deg, #6a8dff, #8e7dff);
	color: #fff;
	border-color: transparent;
}

.category-item:last-child {
	margin-right: 0;
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

/* 两列网格布局 */
.grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 20rpx;
	padding-bottom: 20rpx;
}

.grid-card {
	background: rgba(255,255,255,0.7);
	border: 1rpx solid rgba(0,0,0,0.04);
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 12rpx 30rpx rgba(20,33,61,0.06);
	display: flex;
	flex-direction: column;
}

.grid-cover {
	width: 100%;
	height: 300rpx;
	object-fit: cover;
}

.grid-info {
	padding: 16rpx 16rpx 8rpx;
}
.grid-title {
	font-size: 26rpx;
	font-weight: 700;
	color: #2a2a2a;
	max-height: 76rpx;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.grid-author {
	margin-top: 6rpx;
	font-size: 22rpx;
	color: #6b6b6b;
}
.grid-tags {
	margin-top: 8rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.grid-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8rpx 16rpx 14rpx;
}

.mini-btn {
	border: 1rpx solid rgba(0,0,0,0.08);
	background: #ffffff;
	border-radius: 10rpx;
	height: 56rpx;
	line-height: 56rpx;
	padding: 0 22rpx;
	font-size: 24rpx;
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

.book-location {
	font-size: 24rpx;
	color: #aa2e25; /* 偏红色提醒 */
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
	color: #2bb673;
	background-color: #e9fbf2;
	border: 1rpx solid rgba(43,182,115,0.18);
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
	background-color: rgba(255,255,255,0.88);
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

.detail-inventory {
	margin-top: 20rpx;
}

.inventory-label {
	font-size: 28rpx;
	color: #666;
	margin-right: 20rpx;
}

.inventory-value {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
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

/* 借阅操作区域 */
.borrow-actions {
	display: flex;
	align-items: center;
	margin-left: 20rpx;
}

.return-btn {
	background-color: #ffecec;
	color: #d32f2f; /* 偏红色文字 */
	border: 1rpx solid #ffcdd2;
	border-radius: 8rpx;
	height: 64rpx;
	line-height: 64rpx;
	padding: 0 24rpx;
	font-size: 26rpx;
}

/* 归还确认弹窗样式 */
.return-confirm-popup .return-popup-content {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 80%;
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
}

.return-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 16rpx;
}

.return-message {
	font-size: 26rpx;
	color: #333;
}

.return-location {
	font-size: 28rpx;
	color: #d32f2f; /* 偏红色提醒 */
	font-weight: 600;
	display: block;
	margin: 12rpx 0 24rpx;
}

.return-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 10rpx;
}

.cancel-btn {
	background: #f5f5f5;
	color: #333;
	margin-right: 16rpx;
}

.confirm-btn {
	background: #d32f2f;
	color: #fff;
}
</style> 