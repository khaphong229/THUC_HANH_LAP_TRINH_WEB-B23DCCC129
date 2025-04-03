import React, {useEffect, useState} from "react";
import { Form, Input, InputNumber, Select, Button, Card } from "antd";
import { Employee } from "@/services/EmployeeMana/typing";

const {Option} = Select;

interface EmployeeFormProps{
    employee?:Employee;
    onSave:(employee:Employee)=>void;

}

const EmployeeForm: React.FC<EmployeeFormProps> = ({employee, onSave}) =>{
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(()=>{
        const storedEmployees = localStorage.getItem("employees");
        if(storedEmployees){
            setEmployees(JSON.parse(storedEmployees));
        }
    },[]);

    useEffect(()=>{
        if(employee){
            form.setFieldsValue(employee);
        } else{
            form.resetFields();
            form.setFieldsValue({employee_id:generateEmployeeId()})
        }
    },[employee])

    const generateEmployeeId = () :number =>{
      return (employees.length+1)
    }

    const handleFinish = (values:Employee) =>{
        const updatedEmployees = employee ? employees.map((emp)=>(emp.employee_id === values.employee_id ? values : emp)) :[...employees,values];
        setEmployees(updatedEmployees);
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
        onSave(values);
        form.resetFields();
    }


    return (
        <Card>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="employee_id" label="Mã NV" rules={[{ required: true, message: "Vui lòng nhập mã NV" }]}> 
            <Input disabled />
          </Form.Item>
          <Form.Item name="full_name" label="Họ tên" 
          rules={[
            { required: true, message: "Vui lòng nhập họ tên" },
            { max:50, message:"Không nhập quá 50 ký tự"},
            { pattern: /^[\p{L} ]+$/u, message: "Không được chứa ký tự đặc biệt hoặc số" },
            ]}> 
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ" rules={[{required:true,message:"Vui lòng chọn chức vụ"}]} > 
          <Select>
            <Option value="gd">Giám đốc</Option>
            <Option value="pgd">Phó giám đốc</Option>
            <Option value="tp">Trưởng phòng</Option>
            <Option value="pp">Phó phòng</Option>
            <Option value="nv">Nhân viên</Option>
          </Select>
        </Form.Item>
        <Form.Item name="department" label="Phòng ban" rules={[{required:true, message:"Vui lòng chọn phòng ban"}]}> 
          <Select>
            <Option value="hcns">Hành chính nhân sự</Option>
            <Option value="kt">Kế toán</Option>
            <Option value="kd">Kinh doanh</Option>
            <Option value="it">Công nghệ thông tin</Option>
            <Option value="sxvh">Sản xuất và vận hành</Option>
          </Select>
</Form.Item>
          <Form.Item name="salary" label="Lương"> 
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}> 
            <Select>
              <Option value="probation">Thử việc</Option>
              <Option value="contract_signed">Đã ký hợp đồng</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">{employee ? "Cập nhật" : "Thêm mới"}</Button>
        </Form>
      </Card>
    )


}

export default EmployeeForm;
