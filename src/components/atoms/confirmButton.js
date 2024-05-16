import React from 'react';
import palette from '../../Pages/theme/palette';
import { Button } from '@mui/material';

const ConfirmButton = ({ label, onClick }) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                bgcolor: palette.primary.main,
                border: `1px solid #03A140`,
                '&:hover': {
                    color: palette.primary.main,
                    bgcolor: 'white',
                    border: `1px solid ${palette.primary.main}`,
                },
            }}>
            {label}
        </Button>
    );
};

export default ConfirmButton;