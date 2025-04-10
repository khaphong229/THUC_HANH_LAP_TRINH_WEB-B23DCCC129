export interface Member {
  id: number;
  avatar: string;
  name: string;
  joinDate: string;
  role: string;
  clubId: number;
  active: boolean;
}

export interface MemberTableParams {
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
  clubId: number;
}