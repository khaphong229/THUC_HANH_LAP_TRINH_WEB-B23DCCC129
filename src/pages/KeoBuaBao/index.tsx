import { Button } from 'antd';
import './index.less';
import ChoiceButton from './components/ChoiceButton';
import GameHistory from './components/GameHistory';
import { choices } from './components/LogicGame';
import { useModel } from 'umi';

const KeoBuaBao = () => {
	const { handleGuess, resetGame, history } = useModel('keobuabao');

	return (
		<div>
			<div className='container'>
				<h3>Bạn chọn:</h3>
				<div>
					{choices.map((choice) => (
						<ChoiceButton className='choice-buttons' key={choice} choice={choice} onClick={handleGuess} />
					))}
				</div>
				<Button key='reset' onClick={resetGame} type='danger' className='reset-button'>
					Reset Game
				</Button>
			</div>

			<GameHistory history={history} />
		</div>
	);
};

export default KeoBuaBao;
