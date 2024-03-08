import React from 'react';
import { Typography } from '@mui/material';
import mytypography from '../theme/typhography';
import palette from '../theme/palette';

const PageTitle = ({ title }) => {
    return (
        <Typography
            variant="h1"
            align='center'
            mb={1}
            sx={{
                ...mytypography.h1,
                color: palette.primary.main,
                textShadow: '-3px 3px 1px rgba(0, 0, 0, 0.20)', // Drop shadow
            }}
        >
            {title}
        </Typography>
    );
};

export default PageTitle;