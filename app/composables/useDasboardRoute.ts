
export const useDashboardRoute = () => {
    const getRoute = (employee: { job_level: string; job_position: string; employee_id: string }) => {
        if (['C-Level', 'Manager'].includes(employee.job_level)) {
            return `/${employee.employee_id}/manager`
        } else if (employee.job_level === 'Staff' && employee.job_position === 'Account Manager') {
            return `/${employee.employee_id}/sales`
        }
        return '/'
    }

    return {
        getRoute
    }
}
