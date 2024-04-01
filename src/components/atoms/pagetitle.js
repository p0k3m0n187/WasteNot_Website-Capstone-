import React from 'react';
import { Typography } from '@mui/material';
import palette from '../../Pages/theme/palette';
import typography from '../../Pages/theme/typhography';

const PageTitle = ({ title }) => {
    return (
        <Typography
            variant="h1"
            mb={1}
            sx={{
                flexGrow: 1,
                fontSize: typography.h1.fontSize,
                fontWeight: typography.h1.fontWeight,
                fontFamily: typography.h1.fontFamily,
                color: palette.plain.main,
                WebkitTextStroke: '1px #073A16',
            }}
        >
            {title}
        </Typography>
    );
};

export default PageTitle;