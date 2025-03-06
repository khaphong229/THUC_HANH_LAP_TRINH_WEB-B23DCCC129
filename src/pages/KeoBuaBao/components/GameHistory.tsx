import React from 'react';
import { Card } from 'antd';

const GameHistory = ({ history }) => {
    return (
        <div>
            <h3>Lịch sử trò chơi:</h3>
            {history.length > 0 }
            {history.map((result, index) => (
                <Card key={index}>
                    <p>{result}</p>
                </Card>
            ))}
        </div>
    );
};

export default GameHistory;
