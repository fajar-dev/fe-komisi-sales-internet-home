export interface AdjustmentResponseShowData {
    success: boolean
    message: string
    data: AdjustmentData
}

export interface AdjustmentResponseData {
    success: boolean
    message: string
    data: AdjustmentData[]
}

export interface AdjustmentData {
    id: number
    ai: number
    employeeId: string
    approvedId: string
    oldValue: JSON
    newValue: JSON
    note:string
    createdAt: string
    updatedAt: string
    action: 'insert' | 'update' | 'delete'
    status: 'pending' | 'approved' | 'decline'
    requestName: string
    requestPhotoProfile: string
    companyName: string
    customerId: string
    serviceGroupId: string
    serviceName: string
    invoiceNumber: number
    position: number
}


export interface AdjustmentRequestData {
    ai: number
    oldValue: any
    newValue: any
    note:string
    action: 'insert' | 'update' | 'delete'
}