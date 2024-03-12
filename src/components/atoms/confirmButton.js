import React from 'react';
// import mytypography from '../theme/typhography';
import palette from '../../Pages/theme/palette';
import { Button } from '@mui/material';

const ConfirmButton = ({ colorKey, label }) => {
    // Check if the colorKey exists in the palette, otherwise default to a specific color
    const buttonColor = palette[colorKey] ? palette[colorKey].primary : '#fff';


    const buttonStyles = {
        width: '100%', // Set the desired width
        height: '50px', // Set the desired height
        fontSize: '0.875rem', // Set the desired font size
        padding: '6px 8px', // Set the desired padding
        borderRadius: '5px',
        color: "black",
        backgroundColor: buttonColor,
        cursor: 'pointer',
        transition: 'background-color 5s ease-in-out', // Add a smooth transition
        border: '2px solid green',
        textDecoration: 'underline',
        fontWeight: 'bold',

        '&:hover': {
            backgroundColor: '#fff',
            color: palette.primary.main,
            border: `2px solid ${palette.secondary.main}`, // Add a border stroke on hover
            fontWeight: 'normal',
        },
    };

    return (
        <Button style={buttonStyles}>
            {label}
        </Button>
    );
};

export default ConfirmButton;