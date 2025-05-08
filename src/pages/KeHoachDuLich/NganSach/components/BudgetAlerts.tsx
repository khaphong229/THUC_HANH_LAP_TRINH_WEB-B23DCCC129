import React from 'react';
import { Alert, List, Progress, Divider, Typography, Empty } from 'antd';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useBudget } from './BudgetContext';
import { BudgetCategory } from '@/services/DuLich/KeHoachDuLich/NganSach/typing';

const { Text } = Typography;

const BudgetAlerts: React.FC = () => {
	const { getOverBudgetCategories, totalBudget, totalSpent } = useBudget();

	const overBudgetCategories = getOverBudgetCategories();

	const isOverTotalBudget = totalSpent > totalBudget;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const calculatePercentage = (category: BudgetCategory) => {
		return Math.round((category.spent / category.budget) * 100);
	};

	return (
		<div className='budget-alerts'>
			{isOverTotalBudget ? (
				<Alert
					message='Cảnh báo ngân sách tổng'
					description={`Bạn đã vượt quá tổng ngân sách đã đặt ra ${formatCurrency(totalBudget - totalSpent)}`}
					type='error'
					showIcon
					icon={<WarningOutlined />}
					style={{ marginBottom: 16 }}
				/>
			) : (
				<Alert
					message='Ngân sách tổng ổn định'
					description={`Hiện tại bạn còn ${formatCurrency(totalBudget - totalSpent)} trong ngân sách`}
					type='success'
					showIcon
					icon={<CheckCircleOutlined />}
					style={{ marginBottom: 16 }}
				/>
			)}

			<Divider orientation='left'>Chi tiết cảnh báo</Divider>
			{overBudgetCategories.length > 0 ? (
				<List
					size='small'
					bordered
					dataSource={overBudgetCategories}
					renderItem={(category) => {
						const percentage = calculatePercentage(category);
						const overAmount = category.spent - category.budget;

						return (
							<List.Item>
								<div style={{ width: '100%' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<Text strong>{category.name}</Text>
										<Text type='danger'>
											+{formatCurrency(overAmount)} ({((overAmount / category.budget) * 100).toFixed(1)}%)
										</Text>
									</div>
									<Progress percent={percentage} status='exception' strokeColor='#f5222d' size='small' />
									<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
										<Text type='secondary'>Ngân sách: {formatCurrency(category.budget)}</Text>
										<Text type='secondary'>Đã chi: {formatCurrency(category.spent)}</Text>
									</div>
								</div>
							</List.Item>
						);
					}}
				/>
			) : (
				<Empty description='Không có hạng mục nào vượt ngân sách' image={Empty.PRESENTED_IMAGE_SIMPLE} />
			)}
		</div>
	);
};

export default BudgetAlerts;
