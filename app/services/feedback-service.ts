import { apiService } from './api-service'

export interface FeedbackPayload {
  message: string
  type: string
  url: string
  images?: File[]
}

export class FeedbackService {
  async create(payload: FeedbackPayload) {
    const formData = new FormData()
    formData.append('message', payload.message)
    formData.append('type', payload.type)
    formData.append('url', payload.url)

    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append('images', file)
      })
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    const response = await apiService.client.post('/feedback', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
    return response.data
  }
}

export const feedbackService = new FeedbackService()
