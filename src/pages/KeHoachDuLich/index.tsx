import { useLocation } from 'umi';
import TrangChu from './TrangChu';
import LichTrinh from './LichTrinh';
import NganSach from './NganSach';
import Admin from './Admin';

export default function Trip() {
	const location = useLocation();
	const { pathname } = location;
	const renderComponent = () => {
		if (pathname.includes('/trang-chu')) {
			return <TrangChu />;
		}
		if (pathname.includes('/lich-trinh')) {
			return <LichTrinh />;
		}
		if (pathname.includes('/ngan-sach')) {
			return <NganSach />;
		}
		if (pathname.includes('/admin')) {
			return <Admin />;
		}

		return <TrangChu />;
	};

	return <div>{renderComponent()}</div>;
}
