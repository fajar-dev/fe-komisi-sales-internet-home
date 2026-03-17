import { apiService } from "./api-service"
import type { InternalMouthlyQueryParams, InternalMouthlyResponseData, InternalPeriodQueryParams, InternalPeriodResponseData, ChurnResponseData } from "~/types/sales"
import type { ManagerMouthlyQueryParams, ManagerMouthlyResponseData, ManagerPeriodQueryParams, ManagerPeriodResponseData } from "~/types/manager"
import type { SalesSummaryQueryParams, SalesSummaryResponseData, ManagerSummaryResponseData, InvoiceSummaryResponseData, ChurnSummaryResponseData } from "~/types/summary"

export class CommissionService {
    async salesSummary(params?: SalesSummaryQueryParams): Promise<SalesSummaryResponseData> {
        try {
            const response = await apiService.client.get(`/summary/sales`, {
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

    async managerSummary(params?: SalesSummaryQueryParams): Promise<ManagerSummaryResponseData> {
        try {
            const response = await apiService.client.get(`/summary/manager`, {
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

    async salesChurn(employeeId: string, params?: InternalPeriodQueryParams): Promise<ChurnResponseData> {
        try {
            const response = await apiService.client.get(`/sales/${employeeId}/churn`, {
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

    async managerCommissionPeriod(employeeId: string, params?: ManagerPeriodQueryParams): Promise<ManagerPeriodResponseData> {
        try {
            const response = await apiService.client.get(`/manager/${employeeId}/commission/period`, {
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

    async invoiceSummary(params?: SalesSummaryQueryParams): Promise<InvoiceSummaryResponseData> {
        try {
            const response = await apiService.client.get(`/summary/invoice`, {
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

    async churnSummary(params?: SalesSummaryQueryParams): Promise<ChurnSummaryResponseData> {
        try {
            const response = await apiService.client.get(`/summary/churn`, {
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

    async updateChurnStatus(id: number, isApproved: boolean): Promise<any> {
        try {
            const response = await apiService.client.post(`/summary/churn/${id}`, {
                isApproved
            }, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async updateInvoiceStatus(ai: number, isApproved: boolean): Promise<any> {
        try {
            const response = await apiService.client.post(`/summary/invoice/${ai}`, {
                isApproved
            }, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async updateReferralInvoice(ai: number, data: { referralFee: number, referralType: string }): Promise<any> {
        try {
            const response = await apiService.client.put(`/summary/invoice/${ai}`, data, {
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