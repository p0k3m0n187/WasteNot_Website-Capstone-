import { Box, Typography } from '@mui/material';
import React from 'react'
import typography from '../../Pages/theme/typhography';
import palette from '../../Pages/theme/palette';

const BoxTotal = ({ title, icon, total }) => {
    return (
        <Box sx={{
            p: 0.5,
            alignItems: 'center',
            width: '100%',  // Width set to 6 units
            height: '6rem', // Height set to 9 units
            border: '2px solid white',
            borderRadius: '5px',
            backgroundColor: '#57B961',
            boxShadow: '2px 2px 2px 2px rgba(0, 0, 0, 0.45)',
        }}>
            <Box>
                <Box sx={{
                    width: '100%',
                    textAlign: 'center',
                }}>
                    <Typography sx={{
                        fontSize: typography.h6.fontSize,
                        fontWeight: typography.h6.fontWeight,
                        fontFamily: typography.h1.fontFamily,
                        color: palette.plain.main,
                        textShadow: '2px 8px 5px rgba(106, 217, 117, 0.52)',
                    }} >
                        {title}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
                    <Box sx={{
                        fontSize: '3.4rem',
                        color: 'white',
                        pl: 5
                    }}>
                        {icon}
                    </Box>
                    <Box sx={{
                        color: 'white',
                        pr: 7,
                    }}>
                        <Typography sx={{
                            fontSize: typography.h2.fontSize,
                            fontWeight: typography.h6.fontWeight,
                            fontFamily: typography.h1.fontFamily,
                            color: palette.plain.main,
                            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.52)',
                        }} >
                            {total}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box >

    )
}

export default BoxTotal;