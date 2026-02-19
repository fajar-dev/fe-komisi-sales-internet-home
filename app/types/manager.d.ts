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
        total: number;
        data: ManagerMonthlyData[];
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
    managerNewCommission: string;
    managerRecurringCommission: string;
}

export interface ManagerPeriodAchievement {
    newCommission: string;
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