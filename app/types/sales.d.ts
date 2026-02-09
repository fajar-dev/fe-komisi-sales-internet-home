export interface InternalMouthlyQueryParams {
    year: number;
}

export interface InternalPeriodQueryParams {
    start: string;
    end: string;
    status: string;
}

export interface CommissionDetailItem {
    count: number;
    commission: string;
    mrc: string;
    dpp: string;
}

export interface CommissionServiceItem extends CommissionDetailItem {
    name: string;
    detail: {
        new: CommissionDetailItem;
        prorate: CommissionDetailItem;
        recurring: CommissionDetailItem;
    };
}

export interface CommissionData {
    commission: string;
    mrc: string;
    dpp: string;
    count: number;
    detail: {
        new: CommissionDetailItem;
        prorate: CommissionDetailItem;
        recurring: CommissionDetailItem;
    };
    service: CommissionServiceItem[];
    monthly: Record<string, Omit<CommissionData, 'monthly'>>;
}

export interface CommissionPeriodData {
    commission: string;
    mrc: string;
    dpp: string;
    count: number;
    detail: {
        new: CommissionDetailItem;
        prorate: CommissionDetailItem;
        recurring: CommissionDetailItem;
    };
    service: CommissionServiceItem[];
    achievement: {
        status: string;
        motivation: string;
    }
}

export interface InternalMouthlyResponseData {
    success: boolean;
    message: string;
    data: CommissionData;
}

export interface InternalPeriodResponseData {
    success: boolean;
    message: string;
    data: CommissionPeriodData;
}

export interface SalesInvoiceQueryParams {
    start: string;
    end: string;
}

export interface InvoiceSalesResponseData {
    success: boolean;
    message: string;
    data: {
        data: InvoiceSalesData[];
        totalCommission: number;
        totalDpp: number;
    };
}

export interface InvoiceSalesShowResponseData {
    success: boolean;
    message: string;
    data: InvoiceSalesData;
}

export interface InvoiceSalesData {
    ai: number;
    invoiceNumber: number;
    invoiceOrder: number;
    invoiceDate: string;
    dpp: number;
    newSubscription: number;
    paidDate: string;
    month: number;
    customerServiceId: number;
    customerId: string;
    customerName: string;
    customerCompany: string;
    customerServiceAccount: string;
    customerGroupId: string;
    serviceId: string;
    serviceName: string;
    salesId: string;
    managerSalesId: string;
    referralId: string | null;
    isNew: boolean;
    isUpgrade: boolean;
    isTermin: boolean;
    salesCommission: number;
    isAdjustment: boolean;
    type: string;
    modal: number;
    typeSub: string;
    salesCommissionPercentage: number;
    isDeleted: boolean;
}
