import React, { useState, useEffect } from "react";
import { Employee } from "@/services/EmployeeMana/typing";
import EmployeeForm from "../../components/Employee/EmployeeForm";
import EmployeeList from "../../components/Employee/EmployeeList";
import { Modal, Button, Select, Space,Input,message } from "antd";

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

  const handleSave = (employee: Employee) => {
    const updatedEmployees = editingEmployee
      ? employees.map((emp) => (emp.employee_id === employee.employee_id ? employee : emp))
      : [...employees, employee];

    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    setEditingEmployee(undefined);
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    const employee = employees.find((emp) => emp.employee_id === id);
    if (!employee) return;
  
    if (employee.status !== "probation") {
      message.warning("Chỉ có thể xoá nhân viên đang thử việc!");
      return;
    }
  
    // Chỉ hiển thị confirm khi xoá nhân viên thử việc
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
          <Option value="Nhân viên">Nhân viên</Option>
          <Option value="Trưởng phòng">Trưởng phòng</Option>
        </Select>

        <Select
          placeholder="Chọn phòng ban"
          allowClear
          style={{ width: 200 }}
          value={selectedDepartment || undefined}
          onChange={(value) => setSelectedDepartment(value)}
        >
          <Option value="IT">IT</Option>
          <Option value="HR">HR</Option>
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
