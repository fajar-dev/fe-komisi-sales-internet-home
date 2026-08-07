export interface EmployeeResponseData {
    success: boolean;
    message: string;
    data: Employee
}

export interface Employee {
    id: number
    employee_id: string
    name: string
    email: string
    photo_profile: string
    job_position: string
    organization_name: string
    job_level: string
    branch: string
    status: string
    manager_id: number | null
    has_dashboard: boolean
    is_active: boolean
    is_admin: boolean
    managerName?: string | null
    managerEmployeeId?: string | null
    managerPhotoProfile?: string | null
}

export interface EmployeeHierarchyResponseData {
    success: boolean;
    message: string;
    data: Employee[]
}

