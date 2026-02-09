import { apiService } from "./api-service"
import type { InternalMouthlyQueryParams, InternalMouthlyResponseData, InternalPeriodQueryParams, InternalPeriodResponseData } from "~/types/sales"
import type { ManagerMouthlyQueryParams, ManagerMouthlyResponseData } from "~/types/manager"

export class CommissionService {
    async salesCommission(employeeId: string, params?: InternalMouthlyQueryParams): Promise<InternalMouthlyResponseData> {
        try {
            const response = await apiService.client.get(`/sales/${employeeId}/commission`, {
                params,
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async salesCommissionPeriod(employeeId: string, params?: InternalPeriodQueryParams): Promise<InternalPeriodResponseData> {
        try {
            const response = await apiService.client.get(`/sales/${employeeId}/commission/period`, {
                params,
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async managerCommission(employeeId: string, params?: ManagerMouthlyQueryParams): Promise<ManagerMouthlyResponseData> {
        try {
            const response = await apiService.client.get(`/manager/${employeeId}/commission`, {
                params,
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