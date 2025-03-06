import { useLocation } from 'umi';
import KhoiKienThuc from './KhoiKienThuc';
import MonHoc from './MonHoc';
import CauHoi from './CauHoi';
import DeThi from './DeThi';

export default function QuestionBankManagement() {
	const location = useLocation();
	const { pathname } = location;
	const renderComponent = () => {
		if (pathname.includes('/khoi-kien-thuc')) {
			return <KhoiKienThuc />;
		}
		if (pathname.includes('/mon-hoc')) {
			return <MonHoc />;
		}
		if (pathname.includes('/cau-hoi')) {
			return <CauHoi />;
		}
		if (pathname.includes('/de-thi')) {
			return <DeThi />;
		}

		return <KhoiKienThuc />;
	};

	return (
		<div>
			<h1>Hệ thống ngân hàng câu hỏi</h1>
			{renderComponent()}
		</div>
	);
}
