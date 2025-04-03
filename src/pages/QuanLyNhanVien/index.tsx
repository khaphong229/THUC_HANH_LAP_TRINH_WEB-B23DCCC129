import React, { useState, useEffect } from "react";
import { Employee } from "@/services/EmployeeMana/typing";
import EmployeeForm from "../../components/Employee/EmployeeForm";
import EmployeeList from "../../components/Employee/EmployeeList";
import { Modal, Button, Select, Space,Input,message } from "antd";
import { v4 as uuidv4 } from "uuid";


const { Option } = Select;

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(() =>
    JSON.parse(localStorage.getItem("employees") || "[]")
  );
  
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Lấy bộ lọc từ localStorage khi tải lại trang
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    localStorage.getItem("selectedPosition") || undefined
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(
    localStorage.getItem("selectedDepartment") || undefined
  );

  const [searchTerm,setSearchTerm] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("selectedPosition", selectedPosition || "");
    localStorage.setItem("selectedDepartment", selectedDepartment || "");
  }, [selectedPosition, selectedDepartment]);

    // In EmployeeManagement.tsx, ensure the handleSave function is correctly implemented:
  const handleSave = (employee: Employee) => {
    const updatedEmployees = editingEmployee
      ? employees.map((emp) => (emp.employee_id === employee.employee_id ? employee : emp))
      : [...employees, employee];

    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    setEditingEmployee(undefined);
    setIsModalVisible(false);
    message.success(editingEmployee ? "Cập nhật nhân viên thành công!" : "Thêm nhân viên mới thành công!");
  };

  const handleDelete = (id: string) => {
    const employee = employees.find((emp) => emp.employee_id === id);
    if (!employee) return;
  
    if (employee.status == "contract_signed") {
      message.warning("Nhân viên đang này đang có hợp đồng! Chỉ có thể xóa nhân viên đang thử việc hoặc đã thôi việc");
      return;
    }
  
    Modal.confirm({
      title: "Xác nhận xoá",
      content: `Bạn có chắc muốn xoá nhân viên ${employee.full_name}?`,
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () => {
        const filteredEmployees = employees.filter((emp) => emp.employee_id !== id);
        setEmployees(filteredEmployees);
        localStorage.setItem("employees", JSON.stringify(filteredEmployees));
        message.success("Xoá nhân viên thành công!");
      },
    });
  };
  
  

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);
  };

  // Lọc nhân viên theo chức vụ và phòng ban
  const filteredEmployees = employees.filter(emp =>
    (!selectedPosition || emp.position === selectedPosition) &&
    (!selectedDepartment || emp.department === selectedDepartment) &&
    (!searchTerm || 
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
        placeholder="Tìm kiếm theo mã hoặc họ tên"
        style={{width:200}}
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        allowClear
        />

      <Select
        placeholder="Chọn chức vụ"
        allowClear
        style={{ width: 200 }}
        value={selectedPosition || undefined}
        onChange={(value) => setSelectedPosition(value)}
      >
        <Option value="gd">Giám đốc</Option>
        <Option value="pgd">Phó giám đốc</Option>
        <Option value="tp">Trưởng phòng</Option>
        <Option value="pp">Phó phòng</Option>
        <Option value="nv">Nhân viên</Option>
      </Select>

      <Select
        placeholder="Chọn phòng ban"
        allowClear
        style={{ width: 200 }}
        value={selectedDepartment || undefined}
        onChange={(value) => setSelectedDepartment(value)}
      >
        <Option value="hcns">Hành chính nhân sự</Option>
        <Option value="kt">Kế toán</Option>
        <Option value="kd">Kinh doanh</Option>
        <Option value="it">Công nghệ thông tin</Option>
        <Option value="sxvh">Sản xuất và vận hành</Option>
      </Select>
      </Space>

      <Button type="primary" onClick={() => setIsModalVisible(true)}>Thêm Nhân Viên</Button>

      <Modal
        title={editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <EmployeeForm employee={editingEmployee} onSave={handleSave} />
      </Modal>

      <EmployeeList employees={filteredEmployees} onDelete={handleDelete} onEdit={handleEdit} loading={false} />
    </div>
  );
};

export default EmployeeManagement;
