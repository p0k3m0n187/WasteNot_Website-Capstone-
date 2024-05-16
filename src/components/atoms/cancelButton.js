import React from 'react';
// import mytypography from '../theme/typhography';
import palette from '../../Pages/theme/palette';
import { Button } from '@mui/material';

const CancelButton = ({ onClick }) => {

    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                bgcolor: palette.error.main,
                border: `1px solid red`,
                '&:hover': {
                    color: 'red',
                    bgcolor: 'white',
                    border: `1px solid red`,
                },
            }}>
            Cancel
        </Button>
    );
};

export default CancelButton;