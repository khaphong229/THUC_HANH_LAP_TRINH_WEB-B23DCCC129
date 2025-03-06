import React, { useState } from 'react';
import { Button, message } from 'antd';
import './index.less';
import ChoiceButton from './components/ChoiceButton';
import GameHistory from './components/GameHistory';
import { choices, getRandomChoice, getResult } from './components/LogicGame';


const KeoBuaBao = () => {
    const [history, setHistory] = useState([]);
    const [gameCount, setGameCount] = useState(1);

    const handleGuess = (userChoice) => {
        const computerChoice = getRandomChoice();
        const { message: resultMessage, type } = getResult(userChoice, computerChoice);

        message[type](resultMessage);
        setHistory(prevHistory => [...prevHistory, `Game ${gameCount} Bạn chọn ${userChoice}, máy chọn ${computerChoice}. ${resultMessage}`]);
        setGameCount(prevCount => prevCount + 1);
    };

    const resetGame = () => {
        setHistory([]);
        setGameCount(1);
    };

    return (
        <div>
            <div className='container'>
                <h3>Chọn của bạn:</h3>
                <div>
                    {choices.map(choice => (
                        <ChoiceButton className='choice-buttons' key={choice} choice={choice} onClick={handleGuess} />
                    ))}
                </div>
                <Button key="reset" onClick={resetGame} type="danger" className='reset-button'>
                    Reset
                </Button>
            </div>
           
            <GameHistory history={history} />
        </div>
    );
};

export default KeoBuaBao;
