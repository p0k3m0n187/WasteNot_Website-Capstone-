import React from 'react';
import { TextField } from '@mui/material';
import palette from '../../Pages/theme/palette.js';

const StyledTextField = ({ borderColor, borderWidth, borderRadius, ...props }) => {
    // Use inline styling for the outlined border color, width, and radius
    const outlinedStyle = {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColor || palette.primary.main,
            borderWidth: borderWidth || '1px',
            borderRadius: borderRadius || '8px', // Adjust the border radius as needed
        },
        '& .MuiInputBase-input': {
            paddingTop: '30px', // Adjust the padding top as needed
            borderRadius: borderRadius || '8px', // Adjust the border radius as needed
            boxShadow: '0 5px 5px rgba(0, 0, 0, 0.6)', 
            
        },
    };

    return (
        <TextField
            variant='outlined'
            fullWidth={true}
            sx={{
                ...outlinedStyle,
                
                color: palette.primary.main,
                borderRadius: borderRadius || '8px', // Adjust the border radius
            }}
            {...props}
        />
    );
};

export default StyledTextField;
