// API响应基础类型
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

// 分页响应类型
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  limit: number
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  limit?: number
}

// 搜索参数
export interface SearchParams {
  keyword?: string
  [key: string]: any
}

// 用户相关类型
export interface User {
  id: number
  userId: string
  userName: string
  email: string
  phone?: string
  displayName?: string
  studentId?: string
  status: 'active' | 'inactive' | 'banned'
  creditScore: number
  completedOrders: number
  createdTime: string
  updatedTime: string
}

export interface UserCreateParams {
  userId: string
  userName: string
  email: string
  password: string
  phone?: string
  displayName?: string
  studentId?: string
}

export interface UserUpdateParams {
  userName?: string
  email?: string
  phone?: string
  displayName?: string
  studentId?: string
  status?: 'active' | 'inactive' | 'banned'
}

// 课程相关类型
export interface Course {
  id: number
  courseCode: string
  courseName: string
  credits: number
  courseType: string
  department: string
  description?: string
  createdTime: string
  updatedTime: string
}

export interface CourseCreateParams {
  courseCode: string
  courseName: string
  credits: number
  courseType: string
  department: string
  description?: string
}

// 个人课程表类型
export interface PersonalSchedule {
  id: number
  userId: string
  courseId: number
  courseCode: string
  courseName: string
  teacher: string
  classroom: string
  dayOfWeek: number // 1-7 (周一到周日)
  startTime: string // HH:mm
  endTime: string // HH:mm
  semester: string
  academicYear: string
  createdTime: string
}

export interface ScheduleCreateParams {
  userId: string
  courseId: number
  teacher: string
  classroom: string
  dayOfWeek: number
  startTime: string
  endTime: string
  semester: string
  academicYear: string
}

// 教室相关类型
export interface Classroom {
  id: number
  code: string
  name: string
  building: string
  floor: string
  capacity: number
  status: 'available' | 'maintenance' | 'occupied'
  equipment?: string
  description?: string
  createdTime: string
  updatedTime: string
}

// 自习室相关类型
export interface StudyRoom {
  id: number
  name: string
  location: string
  totalSeats: number
  availableSeats: number
  status: 'active' | 'inactive'
  createdTime: string
  updatedTime: string
}

export interface StudySeat {
  id: number
  roomId: number
  seatNumber: string
  status: 'available' | 'occupied' | 'maintenance'
  createdTime: string
}

// 图书相关类型
export interface Book {
  id: number
  isbn: string
  title: string
  author: string
  publisher?: string
  publishDate?: string
  category?: string
  description?: string
  coverImage?: string
  location?: string
  totalCopies: number
  availableCopies: number
  borrowedCopies: number
  reservedCopies: number
  price?: number
  language?: string
  pages?: number
  format?: string
  status: 'active' | 'inactive' | 'maintenance'
  tags?: string[]
  createdTime: string
  updatedTime: string
}

// 食堂相关类型
export interface Canteen {
  id: number
  name: string
  location: string
  capacity: number
  status: 'active' | 'inactive'
  createdTime: string
  updatedTime: string
}

export interface Food {
  id: number
  canteenId: number
  name: string
  description?: string
  price: number
  category: string
  imageUrl?: string
  status: 'active' | 'inactive'
  createdTime: string
  updatedTime: string
}

// 快递相关类型
export interface ExpressStation {
  id: number
  stationName: string
  stationCode: string
  stationAddress: string
  contactPhone?: string
  contactPerson?: string
  operatingHours?: string
  latitude?: number
  longitude?: number
  capacity: number
  currentCount: number
  serviceTypes?: string[]
  facilities?: string[]
  status: 'active' | 'inactive' | 'maintenance'
  notes?: string
  createdTime: string
  updatedTime: string
}

// 共享设备相关类型
export interface SharedDevice {
  id: number
  deviceName: string
  deviceType: string
  location: string
  status: 'available' | 'busy' | 'maintenance'
  usageCount: number
  revenue: number
  createdTime: string
  updatedTime: string
}

// 医务室相关类型
export interface MedicalDepartment {
  id: number
  deptName: string
  deptNumber: string
  location: string
  status: 'active' | 'inactive'
  createdTime: string
  updatedTime: string
}

export interface MedicalDoctor {
  id: number
  deptId: number
  doctorName: string
  doctorNumber: string
  specialty: string
  experience: string
  status: 'active' | 'inactive'
  createdTime: string
  updatedTime: string
}

// 心理中心相关类型
export interface Counselor {
  id: number
  name: string
  specialty: string
  experience: string
  rating: number
  status: 'active' | 'inactive'
  createdTime: string
  updatedTime: string
}

// 社区相关类型
export interface Post {
  id: number
  title: string
  content: string
  author: string
  category: 'second_hand' | 'dating' | 'help' | 'part_time' | 'gossip'
  likeCount: number
  commentCount: number
  status: 'published' | 'pending' | 'deleted'
  images?: string[]
  createdTime: string
  updatedTime: string
}

// 跑腿服务相关类型
export interface ErrandOrder {
  id: number
  orderNumber: string
  customer: string
  runner?: string
  serviceType: string
  amount: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdTime: string
  updatedTime: string
}

// 社团相关类型
export interface Club {
  id: number
  name: string
  category: string
  leader: string
  memberCount: number
  activityCount: number
  level: 'A' | 'B' | 'C'
  status: 'active' | 'inactive'
  createdTime: string
  updatedTime: string
}

export interface Activity {
  id: number
  title: string
  description?: string
  imageUrl?: string
  clubId?: number
  clubName?: string
  startTime: string
  endTime: string
  location?: string
  maxParticipants: number
  currentParticipants: number
  pointsReward: number
  minCredibility: number
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  isFeatured: boolean
  createdBy: string
  createdTime: string
  updatedTime: string
}
