export const fakeDataReport = {
	totalClubs: 5,
	totalApplications: {
		pending: 12,
		approved: 34,
		rejected: 9,
	},
	applicationsByClub: [
		{
			clubName: 'CLB Tin học',
			pending: 5,
			approved: 10,
			rejected: 2,
		},
		{
			clubName: 'CLB Văn nghệ',
			pending: 2,
			approved: 8,
			rejected: 1,
		},
	],
};

export const approvedMembers = [
	{ fullName: 'Nguyễn Văn A', email: 'nguyenvana@example.com', clubName: 'CLB Tin học' },
	{ fullName: 'Trần Thị B', email: 'tranthib@example.com', clubName: 'CLB Văn nghệ' },
];
