export enum Statuss{
    'PENDING'= 'Chờ duyệt',
    'APPROVED'='Xác nhận',
    'COMPLETED'='Hoàn thành',
    'CANCELED'='Huỷ'
}

export interface Appointment{
    id:string,
    customer:string,
    day:string,
    time:string,
    hour:string,
    status:Statuss
}

export interface AppointmentFormProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (values: any) => void;
    initialValues: Appointment | null;
    subjects: string[];
}

export interface Customer {
   id:string,
   name:string,
   phone:string,
   max_customers:string,
}
