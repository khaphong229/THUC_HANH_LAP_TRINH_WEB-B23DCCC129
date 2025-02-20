import React, { useState, useEffect, useRef } from 'react';
import { Button, InputNumber, message } from 'antd';
import './index.less';
import 'antd/dist/antd.css';

const getRandomNumber = () => Math.floor(Math.random() * 100) + 1;

const RandomNumber = () => {
	const [initNumber, setInitNumber] = useState(getRandomNumber());
	const [userNumber, setUserNumber] = useState<number | null>(null);
	const [userAttempt, setUserAttempt] = useState(0);
	const [isGameOver, setIsGameOver] = useState(false);
	const [history, setHistory] = useState<string[]>([]);
	const maxAttempts = 10;

	const ResetGame = () => {
		setInitNumber(getRandomNumber());
		setUserAttempt(0);
		setUserNumber(null);
		setIsGameOver(false);
		setHistory([]);
	};

	const HandleGuess = () => {
		if (isGameOver) {
			message.error('You have already lost the game. Please restart the game to play again!');
			return;
		}

		if (userNumber === null) {
			message.error('Please enter a number to guess!');
			return;
		}

		setUserAttempt((prevAttempt) => prevAttempt + 1);

		if (userNumber === initNumber) {
			history.push(`You guessed ${userNumber} correctly!`);
			ResetGame();
		} else if (userNumber > initNumber) {
			history.push(`The number guessed is ${userNumber} and it is greater than the number to guess!`);
		} else {
			history.push(`The number guessed is ${userNumber} and it is less than the number to guess!`);
		}

		if (userAttempt + 1 >= maxAttempts) {
			setIsGameOver(true);
			message.error(` "You have lost! The correct number was ${initNumber}`);
		}
	};

	return (
		<div className='game-container'>
			<div className='game-card'>
				<h1 className='game-title'>Number Guessing Game</h1>
				<div className='game-instruction'>Guess a number between 1 and 100</div>

				<div className='input-section'>
					<InputNumber
						value={userNumber}
						min={1}
						max={100}
						onChange={(value) => setUserNumber(value)}
						disabled={isGameOver}
						className='number-input'
						placeholder='Enter your guess'
					/>
				</div>

				<div className='attempt-counter'>
					Attempt: <span className={userAttempt > maxAttempts / 2 ? 'attempt-warning' : ''}>{userAttempt}</span> /{' '}
					{maxAttempts}
				</div>

				<div className='button-group'>
					<Button onClick={HandleGuess} disabled={isGameOver} type='primary' className='guess-button'>
						Guess
					</Button>
					<Button onClick={ResetGame} type='default' className='reset-button'>
						Restart
					</Button>
				</div>

				<div className='history-section'>
					<h3 className='history-title'>Guess History</h3>
					<div className='history-container'>
						{history.length > 0 ? (
							history.map((guess, index) => (
								<div key={index} className='history-item'>
									<span className='attempt-number'>Attempt {index + 1}:</span> {guess}
								</div>
							))
						) : (
							<div className='no-history'>No attempts yet</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RandomNumber;
