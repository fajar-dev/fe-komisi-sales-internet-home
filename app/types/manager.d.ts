import type { CommissionLineItem, SalesCommissionData } from "./sales"

export interface ManagerCommissionQueryParams {
    period?: string;
    month?: number;
    year?: number;
}

export interface ManagerCommissionYearQueryParams {
    year: number;
}

export interface ManagerTeamMember {
    employeeId: string;
    name: string;
    photoProfile: string;
    status: string | null;
    activityCount: number;
    achievementStatus: string;
    motivation: string;
    newSubscription: number;
    newMrc: number;
    newCommission: number;
    recurringSubscription: number;
    recurringCommission: number;
    otherSubscription: number;
    otherCommission: number;
    bonus: number;
    totalCommission: number;
    managerNewCommission: number;
    managerRecurringCommission: number;
    newService: { name: string; count: number; mrc: number; subscription: number }[];
}

export interface ManagerTeamPerformance {
    totalCount: number;
    permanentCount: number;
    nonPermanentCount: number;
    activityCount: number;
    baseTarget: number;
    thresholdPercentage: number;
    finalTarget: number;
    achievementPercentage: number;
    isTargetAchieved: boolean;
}

export interface ManagerOverride {
    newCommissionRate: number;
    newCommission: number;
    recurringCommissionRate: number;
    recurringCommission: number;
    teamRecurringSubscriptionNet: number;
}

export interface ManagerCommissionData {
    period: string;
    startDate: string;
    endDate: string;
    managerId: string;
    team: ManagerTeamPerformance;
    override: ManagerOverride;
    teamTotals: {
        newCommission: number;
        recurringCommission: number;
        newSubscription: number;
        newMrc: number;
    };
    /** The manager's own personal-sales commission (KOMISI.md 6.F), invoice items included. */
    personal: SalesCommissionData & { items: CommissionLineItem[] };
    /** Customer Relation Officer recurring rows credited to this manager (KOMISI.md 6.D). */
    croRecurring: CommissionLineItem[];
    totalCommission: number;
    members: ManagerTeamMember[];
}

export interface ManagerCommissionResponseData {
    success: boolean;
    message: string;
    data: ManagerCommissionData;
}

export interface ManagerCommissionYearData {
    year: number;
    managerId: string;
    months: ManagerCommissionData[];
}

export interface ManagerCommissionYearResponseData {
    success: boolean;
    message: string;
    data: ManagerCommissionYearData;
}
