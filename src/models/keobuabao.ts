import { useState } from 'react';
import { message } from 'antd';
import { getRandomChoice, getResult } from '../pages/KeoBuaBao/components/LogicGame';

export default () => {
	const [history, setHistory] = useState([]);
	const [gameCount, setGameCount] = useState(1);

	const handleGuess = (userChoice: any) => {
		const computerChoice = getRandomChoice();
		const { message: resultMessage, type } = getResult(userChoice, computerChoice);

		message[type](resultMessage);
		setHistory((prevHistory) => [
			...prevHistory,
			`Game ${gameCount} Bạn chọn ${userChoice}, máy chọn ${computerChoice}. ${resultMessage}`,
		]);
		setGameCount((prevCount) => prevCount + 1);
	};

	const resetGame = () => {
		setHistory([]);
		setGameCount(1);
	};
	return {
		resetGame,
		handleGuess,
		history,
	};
};
