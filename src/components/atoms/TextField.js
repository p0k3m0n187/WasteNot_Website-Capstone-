import React from 'react';
import { TextField } from '@mui/material';
import palette from '../../Pages/theme/palette.js';

const StyledTextField = ({ borderColor, borderWidth, borderRadius, paddingTop, labelColor, fontColor, boxShadow, ...props }) => {
    // Use inline styling for the outlined border color, width, and radius
    const outlinedStyle = {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColor || palette.primary.main,
            borderWidth: borderWidth || '1.5px',
            borderRadius: borderRadius || '8px', // Adjust the border radius as needed
            boxShadow: boxShadow || '0 5px 5px rgba(0, 0, 0, 0.6)',
        },
        '& .MuiInputBase-input': {
            // paddingTop: '20px', // Adjust the padding top as needed
            borderRadius: borderRadius || '8px', // Adjust the border radius as needed
            // boxShadow: '0 5px 5px rgba(0, 0, 0, 0.6)',
            color: fontColor || 'black',
        },
        '& .MuiInputLabel-root': {
            color: labelColor || 'rgba(0, 0, 0, 0.99)', // Setting label color to black, or use the provided color
            marginTop: '-0.4px',
        },
    };

    return (
        <TextField
            variant='outlined'
            fullWidth={true}
            size='large'
            sx={{
                ...outlinedStyle,
                color: palette.primary.main,
                borderRadius: borderRadius || '8px', // Adjust the border radius
                size: 'large',
                marginBottom: '6px'
            }}
            {...props}
        />
    );
};

export default StyledTextField;
