declare namespace BieuMau {
  export type DataType = 'String' | 'Number' | 'Date';
  
  export interface FormField {
    id?: string;
    name: string;
    dataType: DataType;
    required: boolean;
    order: number;
    description?: string;
  }
} 