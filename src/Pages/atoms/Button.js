import React from 'react';
// import mytypography from '../theme/typhography';
import palette from '../theme/palette';
import { Button } from '@mui/material';

const ColoredButton = ({ colorKey, label }) => {
    // Check if the colorKey exists in the palette, otherwise default to a specific color
    const buttonColor = palette[colorKey] ? palette[colorKey].main : '#fff';
    const contrastText = palette[colorKey] ? palette[colorKey].contrastText : '#000';

    const buttonStyles = {
        width: '150px', // Set the desired width
        height: '50px', // Set the desired height
        fontSize: '0.875rem', // Set the desired font size
        padding: '6px 8px', // Set the desired padding
        borderRadius: '5px',
        color: contrastText,
        backgroundColor: buttonColor,
        cursor: 'pointer',
        transition: 'background-color 5s ease-in-out', // Add a smooth transition
        border: '2px solid red',

        '&:hover': {
            backgroundColor: '#fff',
            color: palette.primary.dark,
            border: `2px solid ${palette.primary.main}`, // Add a border stroke on hover
        },
    };

    return (
        <Button style={buttonStyles}>
            {label}
        </Button>
    );
};

export default ColoredButton;