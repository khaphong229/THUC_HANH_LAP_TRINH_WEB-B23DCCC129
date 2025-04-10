import { useState } from 'react';

export default () => {
	const [members, setMembers] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	return {
		members,
		setMembers,
		loading,
		setLoading,
	};
};
