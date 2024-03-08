import React from 'react';
import { TextField } from '@mui/material';

const StyledTextField = ({ borderColor, borderWidth, ...props }) => {
    // Use inline styling for the outlined border color and width
    const outlinedStyle = {
        '& .MuiOutlinedInput-root': {
            borderColor: borderColor || '#4CAF50', // Default to green if borderColor is not provided
            borderWidth: borderWidth || '2px', // Default to 2px if borderWidth is not provided
        },
    };

    return (
        <TextField
            variant='outlined'
            color='primary'
            fullWidth={true}
            sx={outlinedStyle}
            borderColor='#4CAF50'
            {...props}
        />
    );
};

export default StyledTextField;
