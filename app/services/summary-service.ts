import { apiService } from "./api-service"
import type {
    ChurnSummaryResponseData,
    InvoiceApprovalInput,
    InvoiceAdjustmentInput,
    InvoiceReferralInput,
    InvoiceSummaryResponseData,
    ManagerSummaryResponseData,
    SalesSummaryResponseData,
    SalesTargetResponseData,
    SalesTargetUpdateInput,
    SnapshotAdjustmentResponseData,
    SnapshotDetailResponseData,
    SummaryQueryParams
} from "~/types/summary"

export class SummaryService {
    async salesSummary(params: SummaryQueryParams): Promise<SalesSummaryResponseData> {
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

    async managerSummary(params: SummaryQueryParams): Promise<ManagerSummaryResponseData> {
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

    async invoiceSummary(params: SummaryQueryParams): Promise<InvoiceSummaryResponseData> {
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

    async approveInvoice(aiInvoice: number, data: InvoiceApprovalInput): Promise<any> {
        try {
            const response = await apiService.client.post(`/summary/invoice/${aiInvoice}/approve`, data, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async updateInvoiceReferral(aiInvoice: number, data: InvoiceReferralInput): Promise<any> {
        try {
            const response = await apiService.client.put(`/summary/invoice/${aiInvoice}`, data, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async invoiceDetail(aiInvoice: number): Promise<SnapshotDetailResponseData> {
        try {
            const response = await apiService.client.get(`/summary/invoice/${aiInvoice}`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async adjustInvoice(aiInvoice: number, data: InvoiceAdjustmentInput): Promise<any> {
        try {
            const response = await apiService.client.put(`/summary/invoice/${aiInvoice}/adjust`, data, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async invoiceAdjustments(aiInvoice: number): Promise<SnapshotAdjustmentResponseData> {
        try {
            const response = await apiService.client.get(`/summary/invoice/${aiInvoice}/adjustments`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async churnSummary(params: SummaryQueryParams): Promise<ChurnSummaryResponseData> {
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

    async approveChurn(customerServiceId: number, data: InvoiceApprovalInput): Promise<any> {
        try {
            const response = await apiService.client.post(`/summary/churn/${customerServiceId}/approve`, data, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                }
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async salesTarget(params: SummaryQueryParams): Promise<SalesTargetResponseData> {
        try {
            const response = await apiService.client.get(`/summary/target`, {
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

    async updateSalesTarget(employeeId: string, params: SummaryQueryParams, data: SalesTargetUpdateInput): Promise<any> {
        try {
            const response = await apiService.client.put(`/summary/target/${employeeId}`, data, {
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
