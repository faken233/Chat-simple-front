export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface User {
  username: string
  phone: string
  password?: string
}

export interface LoginResult {
  token: string
}

export interface Room {
  id: number
  name: string
  description?: string
  avatar?: string
}

export interface Message {
  id?: number
  messageType: number
  message: string
  fromUserId?: number
  targetId: number
  clientTime: number
  // ...其他字段按需添加
}
