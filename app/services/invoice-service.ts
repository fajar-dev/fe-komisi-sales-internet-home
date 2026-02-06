import type { InvoiceSalesResponseData, InvoiceSalesShowResponseData, SalesInvoiceQueryParams } from "~/types/sales"
import { apiService } from "./api-service"

export class InvoiceService {
    async getInvoiceSales(employeeId: string, params: SalesInvoiceQueryParams): Promise<InvoiceSalesResponseData> {
        try {
            const response = await apiService.client.get(`/sales/${employeeId}/invoice`, {
                headers: {
                    authorization: `Bearer ${useAuth().state.token}`
                },
                params
            })
            return response.data
        } catch (error: any) {
            handleServiceError(error)
        }
    }

    async getInvoiceById(employeeId: string, ai: string): Promise<InvoiceSalesShowResponseData> {
        try {
            const response = await apiService.client.get(`/sales/${employeeId}/invoice/${ai}`, {
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