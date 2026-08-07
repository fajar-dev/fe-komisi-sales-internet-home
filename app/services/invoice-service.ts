import type { SalesCommissionQueryParams, SalesInvoiceResponseData } from "~/types/sales"
import { apiService } from "./api-service"

export class InvoiceService {
    async getInvoiceSales(employeeId: string, params: SalesCommissionQueryParams): Promise<SalesInvoiceResponseData> {
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
}
