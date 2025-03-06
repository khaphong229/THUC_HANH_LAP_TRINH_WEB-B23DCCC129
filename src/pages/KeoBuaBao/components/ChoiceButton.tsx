import { Button } from 'antd';

const ChoiceButton = ({ choice, onClick }) => {
	return (
		<Button
			type='primary'
			onClick={() => onClick(choice)}
			style={{
				marginRight: '10px',
			}}
		>
			{choice}
		</Button>
	);
};

export default ChoiceButton;
