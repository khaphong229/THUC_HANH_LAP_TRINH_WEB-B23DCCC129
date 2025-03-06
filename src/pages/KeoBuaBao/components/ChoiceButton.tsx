import React from 'react';
import { Button } from 'antd';

const ChoiceButton = ({ choice, onClick }) => {
    return (
        <Button type="primary" onClick={() => onClick(choice)}>
            {choice}
        </Button>
    );
};

export default ChoiceButton;
