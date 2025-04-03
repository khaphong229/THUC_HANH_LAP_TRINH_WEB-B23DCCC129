import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import moment from 'moment';
import type { NhanVien } from '@/services/NhanVien/typing';

const API_URL = 'https://67d23b2f90e0670699bcba98.mockapi.io/api/v1/tiem-nail/nhan-vien';

export default () => {
  const [employees, setEmployees] = useState<NhanVien.Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (values: any) => {
    setLoading(true);
    try {
      const work_date_obj: Record<string, NhanVien.WorkTime> = {};
      selectedDays.forEach((day) => {
        if (values[`startTime_${day}`] && values[`endTime_${day}`]) {
          work_date_obj[day] = {
            start: values[`startTime_${day}`].format('HH:mm'),
            end: values[`endTime_${day}`].format('HH:mm'),
          };
        }
      });

      const work_date = Object.entries(work_date_obj).map(([day, times]) => ({
        day,
        start: times.start,
        end: times.end,
      }));

      const employeeData: NhanVien.Employee = {
        name: values.name,
        phone: values.phone || '',
        maxCustomers: values.maxCustomers,
        work_date: work_date,
      };

      const response = await axios.post(API_URL, employeeData);
      setEmployees([...employees, response.data]);
      message.success('Thêm nhân viên thành công');
      return true;
    } catch (error) {
      console.error('Error adding employee:', error);
      message.error('Không thể thêm nhân viên');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (values: any) => {
    setLoading(true);
    try {
      const work_date_obj: Record<string, NhanVien.WorkTime> = {};
      selectedDays.forEach((day) => {
        if (values[`startTime_${day}`] && values[`endTime_${day}`]) {
          work_date_obj[day] = {
            start: values[`startTime_${day}`].format('HH:mm'),
            end: values[`endTime_${day}`].format('HH:mm'),
          };
        }
      });

      const work_date = Object.entries(work_date_obj).map(([day, times]) => ({
        day,
        start: times.start,
        end: times.end,
      }));

      const employeeData: NhanVien.Employee = {
        name: values.name,
        phone: values.phone || '',
        maxCustomers: values.maxCustomers,
        work_date: work_date,
      };

      const response = await axios.put(`${API_URL}/${editId}`, employeeData);
      setEmployees(employees.map((emp) => (emp.id === editId ? response.data : emp)));
      message.success('Cập nhật nhân viên thành công');
      return true;
    } catch (error) {
      console.error('Error updating employee:', error);
      message.error('Không thể cập nhật nhân viên');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setEmployees(employees.filter((emp) => emp.id !== id));
      message.success('Xóa nhân viên thành công');
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      message.error('Không thể xóa nhân viên');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: NhanVien.Employee) => {
    if (record.id) {
      setEditId(record.id);
    }

    const formValues: any = {
      name: record.name,
      phone: record.phone || '',
      maxCustomers: record.maxCustomers,
    };

    let days: string[] = [];
    const work_date = record.work_date || [];

    if (Array.isArray(work_date)) {
      days = work_date.map(item => item.day);
      
      work_date.forEach((item) => {
        formValues[`startTime_${item.day}`] = moment(item.start, 'HH:mm');
        formValues[`endTime_${item.day}`] = moment(item.end, 'HH:mm');
      });
    }

    setSelectedDays(days);
    return formValues;
  };

  const resetForm = () => {
    setEditId(null);
    setSelectedDays([]);
  };

  const setWorkDays = (days: string[]) => {
    setSelectedDays(days);
  };

  return {
    employees,
    loading,
    editId,
    selectedDays,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    handleEdit,
    resetForm,
    setWorkDays,
  };
}; 