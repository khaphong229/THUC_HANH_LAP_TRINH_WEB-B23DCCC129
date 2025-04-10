export interface RegisterHistory {
    action: 'Approved' | 'Rejected' | 'Pending';
    timestamp: string; // ISO format
    by: string;
    note?: string;
  }

export interface Clubs{
    id:string,
    fullName:string

    
}
  
  export interface Register {
    id: number;
    fullName: string;
    phone: string;
    email: string;
    gender: string;
    address: string;
    strengths: string;
    clubId: number;
    clubName?: string; // optional
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    rejectionNote?: string;
    history?: RegisterHistory[];
  }
  
  export interface RegisterFormProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (values: any) => void;
    initialValues: Register | null;
    subjects: string[];
  }
  