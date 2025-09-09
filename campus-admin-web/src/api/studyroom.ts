import request from '@/utils/request'

// 自习室 Rooms
export function getStudyRoomList() {
  return request({ url: '/studyroom/list', method: 'GET' })
}

export function createStudyRoom(data: any) {
  return request({ url: '/studyroom', method: 'POST', data })
}

export function updateStudyRoom(id: number, data: any) {
  return request({ url: `/studyroom/${id}`, method: 'PUT', data })
}

export function deleteStudyRoom(id: number) {
  return request({ url: `/studyroom/${id}`, method: 'DELETE' })
}

// 座位 Seats
export function getSeatsByRoom(roomId: number) {
  return request({ url: `/studyroom/${roomId}/seats`, method: 'GET' })
}

export function saveSeats(roomId: number, seats: any | any[]) {
  return request({ url: `/studyroom/${roomId}/seats`, method: 'POST', data: seats })
}

export function updateSeat(seatId: number, data: any) {
  return request({ url: `/studyroom/seat/${seatId}`, method: 'PUT', data })
}

export function deleteSeat(seatId: number) {
  return request({ url: `/studyroom/seat/${seatId}`, method: 'DELETE' })
}

// 预约 Bookings
export function getRoomBookingsByDate(roomId: number, date: string) {
  return request({ url: `/studyroom/${roomId}/bookings/date/${date}` , method: 'GET' })
}

export function getAllBookingsByDate(date: string) {
  return request({ url: `/studyroom/bookings/date/${date}`, method: 'GET' })
}

export function bookSeat(data: { roomId: number; seatId: number; date: string; startTimeSec: number; endTimeSec: number }) {
  return request({ url: '/studyroom/book', method: 'POST', data })
}

export function cancelBooking(id: number) {
  return request({ url: `/studyroom/cancel/${id}`, method: 'PUT' })
}


