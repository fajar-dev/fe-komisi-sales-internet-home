import type { AdjustmentRequestData, AdjustmentResponseData } from "~/types/adjustment"
import { apiService } from "./api-service"


export class AdjustmentService {
    async getAdjustment(): Promise<AdjustmentResponseData> {
        try {
            const response = await apiService.client.get(`/adjustment`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async createAdjustment(data: AdjustmentRequestData): Promise<any> {
        try {
            const response = await apiService.client.post(`/adjustment`, data, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async adjustmentAccept(id: number): Promise<any> {
        try {
            const response = await apiService.client.post(`/adjustment/${id}/accept`, {}, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async adjustmentDecline(id: number): Promise<any> {
        try {
            const response = await apiService.client.post(`/adjustment/${id}/decline`, {}, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }
}