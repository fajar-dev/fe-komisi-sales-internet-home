import type { CommissionLineItem } from "./sales"

export interface SummaryQueryParams {
    period?: string;
    month?: number;
    year?: number;
}

export interface SalesSummaryItem {
    employeeId: string;
    name: string;
    photoProfile: string;
    status: string | null;
    achievementStatus: string;
    activityCount: number;
    newMrc: number;
    newSubscription: number;
    newCommission: number;
    recurringSubscription: number;
    recurringCommission: number;
    otherSubscription: number;
    otherCommission: number;
    bonus: number;
    totalCommission: number;
}

export interface SalesSummaryResponseData {
    success: boolean;
    message: string;
    data: SalesSummaryItem[];
}

export interface ManagerSummaryItem {
    employeeId: string;
    name: string;
    photoProfile: string;
    totalCount: number;
    achievementPercentage: number;
    activityCount: number;
    isTargetAchieved: boolean;
    newMrc: number;
    newSubscription: number;
    newCommission: number;
    recurringSubscription: number;
    recurringCommission: number;
    managerNewCommission: number;
    managerRecurringCommission: number;
    managerTotalCommission: number;
}

export interface ManagerSummaryResponseData {
    success: boolean;
    message: string;
    data: ManagerSummaryItem[];
}

export interface InvoiceSummaryItem extends CommissionLineItem {
    sales: { employeeId: string; name: string; photoProfile: string } | null;
}

export interface InvoiceSummaryResponseData {
    success: boolean;
    message: string;
    data: InvoiceSummaryItem[];
}

export interface InvoiceApprovalInput {
    isApproved: boolean;
}

export interface InvoiceReferralInput {
    referralFee: number;
    referralType: string | null;
}

export interface ChurnSummaryItem {
    customer_service_id: number;
    customer_id: string;
    customer_name: string | null;
    customer_service_account: string | null;
    service_id: string | null;
    service_name: string | null;
    registration_date: string | null;
    unregistration_date: string | null;
    reason: string | null;
    period: number;
    price: number | null;
    sales_id: string | null;
    manager_id: string | null;
    is_approved: boolean;
    employee_name: string | null;
    employee_eid: string | null;
    employee_photo: string | null;
}

export interface ChurnSummaryResponseData {
    success: boolean;
    message: string;
    data: ChurnSummaryItem[];
}
