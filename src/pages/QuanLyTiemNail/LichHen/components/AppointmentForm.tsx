import React, { useState, useEffect } from "react";
import { AppointmentFormProps, Appointment, Customer, Statuss } from "@/services/Appointment/typing";
import { Modal, Form, Input, Select, Button, DatePicker, TimePicker, message } from 'antd';
import axios from "axios";
import moment from "moment";
import { appointService } from '@/services/Appointment/api';

const { Option } = Select;
const { TextArea } = Input;
    
const AppointmentForm: React.FC<AppointmentFormProps> = ({ visible, onCancel, onSave, initialValues }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [customer, setCustomer] = useState<Customer[]>([]);
    const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://67d23b2f90e0670699bcba98.mockapi.io/api/v1/tiem-nail/nhan-vien');
            setCustomer(response.data);
        } catch (error) {
            console.error('Không thể tải danh sách nhân viên:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingAppointments = async () => {
        try {
            const data = await appointService.getAllAppointment();
            setExistingAppointments(data);
        } catch (error) {
            console.error('Không thể tải danh sách lịch hẹn:', error);
        }
    };

    useEffect(() => {
        if (visible) {
            form.resetFields();
            fetchCustomer();
            fetchExistingAppointments();
            
            if (initialValues) {
                // Convert string date/time values to moment objects for DatePicker and TimePicker
                const formValues = {
                    ...initialValues,
                    day: initialValues.day ? moment(initialValues.day) : null,
                    hour: initialValues.hour ? moment(initialValues.hour, "HH:mm") : null
                };
                
                // Set form values after a small delay to ensure form is ready
                setTimeout(() => {
                    form.setFieldsValue(formValues);
                }, 100);
            }
        }
    }, [visible, initialValues, form]);

    const checkAppointmentOverlap = (values: any): boolean => {
        const selectedDate = values.day.format("YYYY-MM-DD");
        const selectedTime = values.hour.format("HH:mm");
        const selectedCustomer = values.customer;
        
        const overlappingAppointment = existingAppointments.find(appointment => {
            // Skip checking the current appointment if we're updating
            if (initialValues && appointment.id === initialValues.id) {
                return false;
            }
            
            return (
                appointment.customer === selectedCustomer && 
                appointment.day === selectedDate && 
                appointment.hour === selectedTime
            );
        });
        
        return !!overlappingAppointment;
    };

    const handleSubmit = () => {
        setSubmitting(true);
        form.validateFields()
            .then((values) => {
                // Check for overlapping appointments
                if (checkAppointmentOverlap(values)) {
                    message.error('Lịch hẹn bị trùng! Nhân viên này đã có lịch hẹn vào thời gian này.');
                    setSubmitting(false);
                    return;
                }
                
                // If no overlap, proceed with saving
                const formattedValues = {
                    ...values,
                    day: values.day ? values.day.format("YYYY-MM-DD") : null,
                    hour: values.hour ? values.hour.format("HH:mm") : null
                };
                
                onSave(formattedValues);
                setSubmitting(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                setSubmitting(false);
            });
    };

    return (
        <Modal
            title={initialValues ? 'Sửa lịch hẹn' : 'Thêm lịch hẹn mới'}
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key='back' onClick={onCancel}>Hủy</Button>,
                <Button 
                    key='submit' 
                    type='primary' 
                    onClick={handleSubmit} 
                    loading={submitting}
                >
                    Lưu
                </Button>,
            ]}
            width={700}
        >
            <Form form={form} layout='vertical' name='appointmentForm'>
                <Form.Item name='customer' label='Nhân viên' rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
                    <Select placeholder='Chọn nhân viên' showSearch>
                        {customer.map((cus) => (
                            <Option key={cus.id} value={cus.name}>{cus.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name='day' label='Ngày' rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
                    <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
                </Form.Item>

                <Form.Item name='hour' label='Giờ' rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}>
                    <TimePicker style={{ width: '100%' }} format='HH:mm' />
                </Form.Item>

                <Form.Item name='status' label='Trạng thái' rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                    <Select placeholder='Chọn trạng thái'>
                        {Object.values(Statuss).map((status) => (
                            <Option key={status} value={status}>{status}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AppointmentForm;