
// src/pages/BudgetManagement/index.tsx
import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import BudgetOverview from './components/BudgetOverview';
import BudgetDistribution from './components/BudgetDistribution';
import BudgetAlerts from './components/BudgetAlerts';
import BudgetDetailsTable from './components/BudgetDetailsTable';
import { BudgetProvider } from './components/BudgetContext';

const { Title } = Typography;

const index: React.FC = () => {
  return (
	
    <BudgetProvider>
		<Card
			title='Ngân sách'
		/>
      <div className="budget-management-page">
        <Title level={2}>Quản lý ngân sách du lịch</Title>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={24}>
            <BudgetOverview />
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <Card title="Phân bổ ngân sách" bordered={false}>
              <BudgetDistribution />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Cảnh báo ngân sách" bordered={false}>
              <BudgetAlerts />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24}>
            <Card title="Chi tiết ngân sách" bordered={false}>
              <BudgetDetailsTable />
            </Card>
          </Col>
        </Row>
      </div>
    </BudgetProvider>
  );
};

export default index;