export interface SalesSummaryItem {
    name: string;
    employeeId: string;
    photoProfile: string;
    achievement: string;
    newService: number;
    newMrc: string;
    newSubscription: string;
    newCommission: string;
    recurringSubscription: string;
    recurringCommission: string;
    otherSubscription: string;
    otherCommission: string;
    bonus: string;
    totalCommission: string;
}

export interface SalesSummaryResponseData {
    success: boolean;
    message: string;
    data: SalesSummaryItem[];
}

export interface SalesSummaryQueryParams {
    month: number;
    year: number;
    hide?: boolean;
}

export interface ManagerSummaryItem {
    name: string;
    employeeId: string;
    photoProfile: string;
    team: number;
    percentage: string;
    newService: number;
    status: string;
    monthlyNewMrc: string;
    monthlyNewSubscription: string;
    monthlyNewCommission: string;
    monthlyRecurringSubscription: string;
    monthlyRecurringCommission: string;
    monthlyOtherSubscription: string;
    monthlyOtherCommission: string;
    monthlyTotalCommission: string;
    managerNewCommission: string;
    managerRecurringCommission: string;
    managerTotalCommission: string;
}

export interface ManagerSummaryResponseData {
    success: boolean;
    message: string;
    data: ManagerSummaryItem[];
}

export interface InvoiceSummaryItem {
    sales: {
        name: string | null;
        employeeId: string | null;
        photoProfile: string | null;
    };
    ai: number;
    invoiceDate: string;
    invoiceDueDate: string;
    paidDate: string | null;
    lateMonth: number;
    month: number;
    dpp: string;
    mrc: string;
    newSubscription: string;
    customerServiceId: number;
    customerId: string;
    customerName: string;
    customerCompany: string;
    customerServiceAccount: string;
    serviceId: string;
    serviceName: string;
    salesId: string;
    type: string;
    category: string;
    referralType: string;
    referralFee: string;
    isApproved: number;
}

export interface InvoiceSummaryResponseData {
    success: boolean;
    message: string;
    data: InvoiceSummaryItem[];
}
export interface ChurnSummaryItem {
    sales: {
        name: string | null;
        employeeId: string | null;
        photoProfile: string | null;
    };
    customerServiceId: number;
    customerId: string;
    customerName: string;
    customerServiceAccount: string;
    serviceId: string;
    serviceName: string;
    registrationDate: string;
    unregistrationDate: string;
    subscriptionPeriod: string;
    reason: string;
    period: number;
    price: string;
    salesId: string;
    managerId: string;
    mrc: string;
    baseCommission: string;
    commission: string;
    commissionPercentage: number;
    isApproved: number;
}

export interface ChurnSummaryResponseData {
    success: boolean;
    message: string;
    data: ChurnSummaryItem[];
}
