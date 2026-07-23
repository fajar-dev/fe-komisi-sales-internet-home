export interface ManagerMouthlyQueryParams {
    year: number;
}

export interface ManagerMonthlyDetail {
    name: string;
    count: number;
    total: number;
}

export interface ManagerMonthlyData {
    month: string;
    detail: ManagerMonthlyDetail[];
    total: number;
}

export interface ManagerMouthlyResponseData {
    success: boolean;
    message: string;
    data: {
        yearlyNewMrc: string;
        yearlyNewSubscription: string;
        yearlyNewCommission: string;
        yearlyRecurringSubscription: string;
        yearlyRecurringCommission: string;
        monthly: Record<string, ManagerPeriodData>;
    };
}


export interface ManagerPeriodQueryParams {
    year: number;
    month: number;
}

export interface ManagerEmployeeAchievement {
    newAchievement: number;
    type: string;
    status: string;
}

export interface ManagerEmployeeNewService {
    name: string;
    count: number;
    mrc: string;
    subscription: string;
}

export interface CreateManagerEmployeeAchievement {
    newAchievement: number;
    type: string;
    status: string;
}

export interface ManagerEmployeeNewService {
    name: string;
    count: number;
    mrc: string;
    subscription: string;
}

export interface ManagerEmployeePerformance {
    name: string;
    employeeId: string;
    photoProfile: string;
    achievement: CreateManagerEmployeeAchievement;
    newService: ManagerEmployeeNewService[];
    newMrc: string;
    newSubscription: string;
    newCommission: string;
    recurringSubscription: string;
    recurringCommission: string;
    otherSubscription: string;
    otherCommission: string;
    bonus: string;
    totalCommission: string;
    managerRecurringCommission: string;
    managerRecurringCommissionPercentage: number;
    managerNewCommission: string;
    managerNewCommissionPercentage: number;
}

export interface ManagerPeriodAchievement {
    newCommissionPercentage: string;
    newCommission: string;
    recurringCommissionPercentage: string;
    recurringCommission: string;
    totalCommission: string;
}

export interface ManagerSalesSummary {
    Permanent: number;
    Probation: number;
    total: number;
    newAchievement: number;
    percentage: string;
    status: string;
    target: number;
}

export interface ManagerPeriodData {
    startDate: string;
    endDate: string;
    sales: ManagerSalesSummary;
    employee: ManagerEmployeePerformance[];
    monthlyNewMrc: string;
    monthlyNewSubscription: string;
    monthlyNewCommission: string;
    monthlyRecurringSubscription: string;
    monthlyRecurringCommission: string;
    achievement: ManagerPeriodAchievement;
}

export interface ManagerPeriodResponseData {
    success: boolean;
    message: string;
    data: ManagerPeriodData;
}
// Invoice langsung SM (CRO/CS/jualan SM sendiri) — SE-002
export interface ManagerInvoiceItem {
    ai: number;
    invoiceDate: string;
    invoiceDueDate: string;
    paidDate: string;
    lateMonth: number;
    month: number;
    dpp: string;
    mrc: string;
    lineRental: string;
    recurringRemainder: string;
    newSubscription: string;
    customerServiceId: number;
    customerId: string;
    customerName: string;
    customerCompany: string;
    customerServiceAccount: string;
    serviceId: string;
    serviceName: string;
    salesId: string;
    isAdjustment: number | boolean;
    type: string;
    smCommission: number;
    smCommissionPercentage: number;
}

export interface ManagerInvoiceGroup {
    count: number;
    commission: string;
    dpp: string;
    mrc: string;
    data: ManagerInvoiceItem[];
}

export interface ManagerInvoiceData {
    startPeriod: string;
    endPeriod: string;
    status: string;
    recurringRate: number;
    count: number;
    commission: string;
    dpp: string;
    mrc: string;
    new: ManagerInvoiceGroup;
    upgrade: ManagerInvoiceGroup;
    prorate: ManagerInvoiceGroup;
    recurring: ManagerInvoiceGroup;
    alat: ManagerInvoiceGroup;
    setup: ManagerInvoiceGroup;
}

export interface ManagerInvoiceResponseData {
    success: boolean;
    message: string;
    data: ManagerInvoiceData;
}
