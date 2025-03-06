import React, { useState } from 'react';
import { Button, Card, message } from 'antd';
import 'antd/dist/antd.css';

const choices = ['Búa', 'Bao', 'Kéo'];
const dictionaryChoices = {
    'Búa': {
        'Thắng': 'Kéo',
        'Thua': 'Bao',
        'Hòa': 'Búa'
    },
    'Bao': {
        'Thắng': 'Búa',
        'Thua': 'Kéo',
        'Hòa': 'Bao'
    },
    'Kéo': {
        'Thắng': 'Bao',
        'Thua': 'Búa',
        'Hòa': 'Kéo'
    }
};

const getRandomChoice = () => choices[Math.floor(Math.random() * choices.length)];

const KeoBuaBao = () => {
    const [history, setHistory] = useState([]);
    const [gameCount, setGameCount] = useState(1);

    const handleGuess = (userChoice) => {
        const randomChoice = getRandomChoice();
        let result = '';

        if (dictionaryChoices[userChoice]["Thắng"] === randomChoice) {
            result = `Bạn thắng! Lựa chọn của bạn là ${userChoice}, của máy là ${randomChoice}`;
            message.success("Bạn đã thắng!");
        } else if (dictionaryChoices[userChoice]["Hòa"] === randomChoice) {
            result = `Hòa! Lựa chọn của bạn là ${userChoice}, của máy là ${randomChoice}`;
            message.info("Bạn đã hòa!");
        } else {
            result = `Bạn thua! Lựa chọn của bạn là ${userChoice}, của máy là ${randomChoice}`;
            message.warning("Bạn đã thua!");
        }

        setHistory(prevHistory => [...prevHistory, result]);
        setGameCount(prevCount => prevCount + 1);
    };

    const resetGame = () => {
        setHistory([]);
        setGameCount(1);
    };

    return (
        <div>
            <h3>Chọn của bạn:</h3>
            <div>
                {choices.map(choice => (
                    <Button
                        key={choice}
                        type='primary'
                        onClick={() => handleGuess(choice)}
                    >
                        {choice}
                    </Button>
                ))}
            </div>
            <Button
                key="reset"
                onClick={resetGame}
                type='danger'
            >
                Reset
            </Button>
            <div>
                {history.length > 0 && <h3>Lịch sử trò chơi:</h3>}
                {history.map((result, index) => (
                    <Card key={index}>
                        <p>{result}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default KeoBuaBao;