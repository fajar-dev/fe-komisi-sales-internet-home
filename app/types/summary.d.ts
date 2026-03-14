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
