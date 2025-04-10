export interface Club {
    id: number;
    avatar: string;
    name: string;
    foundedDate: string;
    description: string;
    leader: string;
    active: boolean;
  }
  
  export interface ClubFormValues {
    id?: number;
    avatar?: string;
    name: string;
    foundedDate: string;
    description: string;
    leader: string;
    active: boolean;
  }
  
  export interface ClubTableParams {
    pagination: {
      current: number;
      pageSize: number;
      total?: number;
    };
    sorter?: {
      field: string;
      order: 'ascend' | 'descend' | null;
    };
    filters?: Record<string, any>;
    search?: string;
  }