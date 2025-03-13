import { useLocation } from 'umi';
import NhanVien from './NhanVien';
import DichVu from './DichVu';
import LichHen from './LichHen';
import DanhGia from './DanhGia';
import ThongKe from './ThongKe';

export default function QuestionBankManagement() {
	const location = useLocation();
	const { pathname } = location;
	const renderComponent = () => {
		if (pathname.includes('/nhan-vien')) {
			return <NhanVien />;
		}
		if (pathname.includes('/dich-vu')) {
			return <DichVu />;
		}
		if (pathname.includes('/lich-hen')) {
			return <LichHen />;
		}
		if (pathname.includes('/danh-gia')) {
			return <DanhGia />;
		}
		if (pathname.includes('/thong-ke')) {
			return <ThongKe />;
		}

		return <NhanVien />;
	};

	return (
		<div>
			<h1 style={{ fontSize: 30 }}>Quản lý Tiệm Nail Của Minh</h1>
			{renderComponent()}
		</div>
	);
}
