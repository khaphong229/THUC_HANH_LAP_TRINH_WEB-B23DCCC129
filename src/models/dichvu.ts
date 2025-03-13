import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import type { DichVu } from '@/services/DichVu/typing';
import type { NhanVien } from '@/services/NhanVien/typing';
import { API_URL, EMPLOYEE_API_URL } from '@/services/DichVu/constants';

export default () => {
  const [services, setServices] = useState<DichVu.Service[]>([]);
  const [employees, setEmployees] = useState<NhanVien.Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setServices(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', error);
      message.error('Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(EMPLOYEE_API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
      message.error('Không thể tải danh sách nhân viên');
    }
  };

  const addService = async (values: DichVu.Service) => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, values);
      setServices([...services, response.data]);
      message.success('Thêm dịch vụ thành công');
      return true;
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ:', error);
      message.error('Không thể thêm dịch vụ');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (values: DichVu.Service) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/${editId}`, values);
      setServices(services.map(srv => srv.id === editId ? response.data : srv));
      message.success('Cập nhật dịch vụ thành công');
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật dịch vụ:', error);
      message.error('Không thể cập nhật dịch vụ');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setServices(services.filter(srv => srv.id !== id));
      message.success('Xóa dịch vụ thành công');
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error);
      message.error('Không thể xóa dịch vụ');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: DichVu.Service) => {
    if (record.id) {
      setEditId(record.id);
    }
    
    return {
      name: record.name,
      cost: record.cost,
      process_time: record.process_time,
      employee_id: record.employee_id
    };
  };

  const resetForm = () => {
    setEditId(null);
  };

  const getEmployeeName = (employeeId: string): string => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Chưa phân công';
  };

  return {
    services,
    employees,
    loading,
    editId,
    fetchServices,
    fetchEmployees,
    addService,
    updateService,
    deleteService,
    handleEdit,
    resetForm,
    getEmployeeName
  };
}; 