import { Box, Typography } from '@mui/material';
import React from 'react'
import typography from '../../Pages/theme/typhography';
import palette from '../../Pages/theme/palette';

const BoxTotal = ({ title, icon, total }) => {
    return (
        <Box sx={{
            p: 0.5,
            width: '100%',  // Width set to 6 units
            height: '5.5rem', // Height set to 9 units
            border: '2px solid white',
            borderRadius: '5px',
            backgroundColor: palette.primary.main,
            boxShadow: '2px 2px 2px 2px rgba(0, 0, 0, 0.45)',
            mr: 10
        }}>
            <Box>
                <Box sx={{
                    width: '9rem',
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
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', }}>
                    <Box sx={{
                        fontSize: '2.5rem',
                        color: 'white',
                        mt: 0.5
                    }}>
                        {icon}
                    </Box>
                    <Box sx={{
                        color: 'white',
                        mt: -0.6
                    }}>
                        <Typography sx={{
                            fontSize: '2.5rem',
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