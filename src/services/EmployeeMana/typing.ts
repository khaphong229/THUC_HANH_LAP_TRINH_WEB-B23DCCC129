export enum EmployeeStatus {
    Probation = "probation",
    ContractSigned = "contract_signed"
}

export interface Employee {
    employee_id: string;
    full_name: string;
    position: string;
    department: string;
    salary: number;
    status: EmployeeStatus;
}
