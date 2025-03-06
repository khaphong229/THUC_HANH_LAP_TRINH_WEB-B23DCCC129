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
		name: 'RandomNumber',
		icon: 'FieldBinaryOutlined',
	},
	{
		path: '/ngan-hang-de-thi',
		component: './QuestionBankManagement',
		name: 'Quản lý ngân hàng câu hỏi',
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
		path: '/KeoBuaBao',
		component: './KeoBuaBao',
		name: 'KeoBuaBao',
		icon: 'FieldBinaryOutlined',
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
