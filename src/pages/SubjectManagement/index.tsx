import { Button, Card, Col, Form, Input, Row } from 'antd';
import styles from './index.less';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SubjectInfor from './components/SubjectInfor';

export default function SubjectManagement() {
  const [form] = Form.useForm();
  const { 
    subs, 
    currentSubs, 
    getSubsList, 
    addSub, 
    updateSubStatus, 
    startEdit, 
    editSub, 
    finishEdit, 
    deleteSub 
  } = useModel('subject-management');
  
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);

  useEffect(() => {
    if (currentSubs) {
      form.setFieldsValue({ name: currentSubs.name });
    } else {
      form.resetFields();
    }
  }, [currentSubs, form]);

  useEffect(() => {
    getSubsList();
  }, []);

  const handleSubmit = (values: { name: string }) => {
    if (currentSubs) {
      finishEdit();
    } else {
      addSub(values.name);
    }
    form.resetFields();
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentSubs) {
      editSub(e.target.value);
    }
  };

  const handleCardClick = () => {
    setOpenForm(true);
  };

  const handleCloseDetails = () => {
    setOpenForm(false);
  };

  const handleEditFromTable = (id) => {
    startEdit(id);
    setOpenForm(false);
  };

  const handleDeleteFromTable = (id) => {
    deleteSub(id);
    setOpenForm(false);
  };

  return (
    <div className={styles.SubjectContainer}>
      <div className={styles.inputContainer}>
        <h1 className={styles.title}>Subject Management</h1>
        <Form form={form} onFinish={handleSubmit} className={styles.form}>
          <Form.Item
            name='name'
            rules={[
              {
                required: true,
                message: 'Please input subject name!',
              },
            ]}
          >
            <Input placeholder='Enter subject name' onChange={onChangeInput} />
          </Form.Item>
          <Button type='primary' htmlType='submit' className={styles.buttonInput}>
            <PlusOutlined />
          </Button>
        </Form>
      </div>
      
      <div className='subjectListContainer'>
        <Row gutter={[16, 16]}>
          {subs.map((sub) => (
            <Col span={6} key={sub.id}>
              <Card 
                title={sub.name}  
                className={styles.cardSub} 
                style={{
                  cursor: 'po'
                }}
                onClick={handleCardClick}
              >
                <div className={styles.actionButton}>
                  <Button 
                    type='text' 
                    icon={<EditOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(sub.id);
                    }} 
                  />
                  <Button 
                    type='text' 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSub(sub.id);
                    }} 
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {openForm && (
        <SubjectInfor 
          sub={subs} 
          isOpen={openForm}
          onClose={handleCloseDetails}
          onEdit={handleEditFromTable}
          onDelete={handleDeleteFromTable}
        />
      )}
    </div>
  );
}