export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  json?: any
  sendToken?: boolean
  onUpdate?: (percent: number) => any
  useBackendApi?: boolean
}

export interface ApiResponse {
  res: Response
  ok: boolean
  json?: any
  statusCode: number
  statusMessage: string
}

export interface Admin {
  _id: string
  name: string
  email: string
}

export interface User {
  _id: string
  name: string
  age: number
  email: string
  emailVerified: boolean
  photo: string
  disabledTill: string | Date
  terminated: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Feedback {
  _id: string
  name: string
  email: string
  feedback: string
  status: 'pending' | 'resolved' | 'rejected'
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Course {
  _id: string
  title: string
  subtitle: string
  description: string
  price: number
  sections: Section[]
  image?: string
  duration?: number
  keywords: string[]
  published?: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Section {
  _id: string
  title: string
  description: string
  lectures: Lecture[]
}

export interface Lecture {
  _id: string
  title: string
  description: string
  video?: string
  resources: string[]
  preview?: boolean
}

export interface Coupon {
  _id: string
  discountType: 'percent' | 'fixed'
  discount: number
  limit?: number
  maxDiscount?: number
  used: number
  active?: boolean
  comments?: string
  minimumPurchase?: number
  expiry?: string | Date
  createdAt: string | Date
  updatedAt: string | Date
}

export interface Order {
  _id: string
  total: number
  finalAmount: number
  coupon?: string
  url?: string
  user: string | User
  courses: Course[]
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  razorpayCommission?: number
  razorpayMetaData?: RazorpayMetaData
  razorpayTax?: number
  receivedAmount?: number
  completedAt?: Date
  failedAt?: Date
  refundedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface RazorpayMetaData {
  order_id: string
  method: string
  contact?: string
  acquirer_data?: Record<string, any>
  payments: Payment[]
}

export interface Payment {
  amount: number
  created_at: number
  method: string
  payment_id: string
  status: 'captured' | 'failed'
}