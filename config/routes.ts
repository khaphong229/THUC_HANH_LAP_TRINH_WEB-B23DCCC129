import component from "@/locales/en-US/component";
import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todolist',
		component: './Todolist',
		name: 'Todolist',
		icon: 'FormOutlined',
	},
	{
		path: '/subject-management',
		component: './SubjectManagement',
		name: 'Quản lý môn học',
		icon: 'HeatMapOutlined',
	},
	{
		path: '/RandomNumber',
		component: './RandomNumber',
		name: 'Đoán số',
		icon: 'FieldBinaryOutlined',
	},
	{
		path: '/KeoBuaBao',
		component: './KeoBuaBao',
		name: 'Kéo Búa Bao',
		icon: 'DislikeOutlined',
	},
	{
		path: '/ngan-hang-de-thi',
		component: './QuestionBankManagement',
		name: 'Ngân hàng đề thi',
		icon: 'BankOutlined',
		routes: [
			{
				name: 'Khối kiến thức',
				path: 'khoi-kien-thuc',
				component: './QuestionBankManagement/KhoiKienThuc',
			},
			{
				name: 'Môn học',
				path: 'mon-hoc',
				component: './QuestionBankManagement/MonHoc',
			},
			{
				name: 'Câu hỏi',
				path: 'cau-hoi',
				component: './QuestionBankManagement/CauHoi',
			},
			{
				name: 'Đề thi',
				path: 'de-thi ',
				component: './QuestionBankManagement/DeThi',
			},
		],
	},
	{
		path: '/tiem-nail',
		component: './QuanLyTiemNail',
		name: 'Quản lý tiệm nail',
		icon: 'HighlightOutlined',
		routes: [
			{
				name: 'Nhân viên',
				path: 'nhan-vien',
				component: './QuanLyTiemNail/NhanVien',
			},
			{
				name: 'Dịch vụ',
				path: 'dich-vu',
				component: './QuanLyTiemNail/DichVu',
			},
			{
				name: 'Lịch hẹn',
				path: 'lich-hen',
				component: './QuanLyTiemNail/LichHen',
			},
			{
				name: 'Đánh giá',
				path: 'danh-gia',
				component: './QuanLyTiemNail/DanhGia',
			},
			{
				name: 'Thống kê',
				path: 'thong-ke',
				component: './QuanLyTiemNail/ThongKe',
			},
		],
	},
	{
		path: '/van-bang',
		component: './QuanLyVanBang',
		name: 'Quản Lý Văn Bằng',
		icon: 'ReconciliationOutlined',
		routes: [
			{
				name: 'Quảnlý sổ văn bằng',
				path: 'quan-ly-so-van-bang',
				component: './QuanLyVanBang/SoVanBang',
			},
			{
				name: 'Quyết định tốt nghiệp',
				path: 'quyet-dinh-tot-nghiep',
				component: './QuanLyVanBang/QuyetDinhTotNghiep',
			},
			{
				name: 'Cấu hình biểu mẫu',
				path: 'cau-hinh-bieu-mau',
				component: './QuanLyVanBang/CauHinhBieuMau',
			},
			{
				name: 'Thông tin văn bằng',
				path: 'thong-tin-van-bang',
				component: './QuanLyVanBang/ThongTinVanBang',
			},
			{
				name: 'Tra cứu văn bằng',
				path: 'tra-cuu-van-bang',
				component: './QuanLyVanBang/TraCuuVanBang',
			},
			
			
		],
	},


	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
