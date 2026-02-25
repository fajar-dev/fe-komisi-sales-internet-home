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
    activity: number;
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
    activity: number;
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
    activity: number;
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