declare namespace NhanVien {
  interface WorkTime {
    start: string;
    end: string;
  }

  interface WorkDay {
    day: string;
    start: string;
    end: string;
  }

  interface Employee {
    id?: string;
    name: string;
    phone?: string;
    maxCustomers: number;
    work_date: WorkDay[];
  }
}

export type { NhanVien }; 