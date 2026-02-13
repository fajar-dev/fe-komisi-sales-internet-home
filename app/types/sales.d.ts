export interface InternalMouthlyQueryParams {
    year: number;
}

export interface InternalPeriodQueryParams {
    month: number;
    year: number;
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
        upgrade: CommissionDetailItem;
        alat: CommissionDetailItem;
        setup: CommissionDetailItem;
    };
}

export interface CommissionData {
    commission: string;
    bonus: string;
    totalCommission: string;
    mrc: string;
    dpp: string;
    count: number;
    detail: {
        new: CommissionDetailItem;
        prorate: CommissionDetailItem;
        recurring: CommissionDetailItem;
        upgrade: CommissionDetailItem;
        alat: CommissionDetailItem;
        setup: CommissionDetailItem;
    };
    startPeriod?: string;
    endPeriod?: string;
    service: CommissionServiceItem[];
    monthly: Record<string, Omit<CommissionData, 'monthly'>>;
    achievement: {
        status: string;
        motivation: string;
        activity: number;
        type?: string;
    }
}

export interface CommissionPeriodData {
    startPeriod: string;
    endPeriod: string;
    commission: string;
    bonus: string;
    totalCommission: string;
    mrc: string;
    dpp: string;
    count: number;
    detail: {
        new: CommissionDetailItem;
        prorate: CommissionDetailItem;
        recurring: CommissionDetailItem;
        upgrade: CommissionDetailItem;
        alat: CommissionDetailItem;
        setup: CommissionDetailItem;
    };
    service: CommissionServiceItem[];
    achievement: {
        status: string;
        motivation: string;
        activity: number;
        type?: string;
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
    month: number;
    year: number;
}

export interface InvoiceSalesData {
    ai: number;
    invoiceNumber?: number;
    invoiceOrder?: number;
    invoiceDate: string;
    dpp: number | string;
    newSubscription: number | string;
    paidDate: string;
    month: number;
    customerServiceId: number;
    customerId: string;
    customerName: string;
    customerCompany: string;
    customerServiceAccount: string;
    customerGroupId?: string;
    serviceId: string;
    serviceName: string;
    salesId: string;
    managerSalesId?: string;
    referralId?: string | null;
    isNew?: boolean;
    isUpgrade: number | boolean;
    isTermin?: boolean;
    salesCommission: number;
    isAdjustment: number | boolean;
    category?: string;
    type: string;
    modal?: number;
    typeSub?: string;
    salesCommissionPercentage: number;
    isDeleted?: boolean;
}

export interface InvoiceSalesResponseData {
    success: boolean;
    message: string;
    data: {
        startPeriod: string;
        endPeriod: string;
        count: number;
        commission: string;
        dpp: string;
        mrc: string;
        new: { count?: number; commission?: string; dpp?: string; mrc?: string; data?: InvoiceSalesData[] };
        upgrade: { count?: number; commission?: string; dpp?: string; mrc?: string; data?: InvoiceSalesData[] };
        prorate: { count?: number; commission?: string; dpp?: string; mrc?: string; data?: InvoiceSalesData[] };
        recurring: { count?: number; commission?: string; dpp?: string; mrc?: string; data?: InvoiceSalesData[] };
        alat: { count?: number; commission?: string; dpp?: string; mrc?: string; data?: InvoiceSalesData[] };
        setup: { count?: number; commission?: string; dpp?: string; mrc?: string; data?: InvoiceSalesData[] };
    };
}

export interface InvoiceSalesShowResponseData {
    success: boolean;
    message: string;
    data: InvoiceSalesData;
}
