// ConsumedPieChart.js
import React from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { PieChart } from 'react-minimal-pie-chart';
import palette from '../../../Pages/theme/palette';
import typography from '../../../Pages/theme/typhography';
import { DropDown } from '../Dropdown';

function ConsumedPieChart({ open, onClose }) {
    const customStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        height: '90%',
        bgcolor: 'white',
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        p: 1,
        overflowY: 'auto', // Enable vertical scrolling
        maxHeight: '90vh', // Limit the maximum height to 80% of the viewport height
    };

    const labelStyle = {
        fontSize: '10px', // Adjust font size as needed
        font: typography.fontFamily,
        fontWeight: 'bold', // Optionally, set font weight
        fill: '#ffff', // Change label color
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={customStyle}>
                <Box>
                    <Typography sx={{
                        fontSize: typography.h7.fontSize,
                        fontWeight: typography.h1.fontWeight,
                        fontFamily: typography.h1.fontFamily,
                        color: palette.plain.main,
                        WebkitTextStroke: '1.5px #073A16',
                        textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                        textTransform: 'uppercase',
                        mb: 1,
                    }} gutterBottom>
                        Inventory Report
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 5 }}>
                    <Box>
                        <PieChart
                            data={[
                                { title: 'Consumed', value: 30, color: palette.primary.main, label: 'A' },
                                { title: 'Remaining', value: 70, color: 'red', label: 'B' },
                            ]}
                            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                            labelStyle={{ ...labelStyle }}
                            style={{ height: 500, width: 500, }}
                        />
                    </Box>
                    <Box sx={{ width: 500 }}>
                        <Box>
                            <Typography sx={{
                                fontSize: typography.h7.fontSize,
                                fontWeight: typography.h1.fontWeight,
                                fontFamily: typography.h1.fontFamily,
                                color: palette.plain.main,
                                WebkitTextStroke: '1.5px #073A16',
                                textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                                textTransform: 'uppercase',
                                mb: 1,
                            }} gutterBottom>
                                Month of
                            </Typography>
                            <DropDown />
                        </Box>
                    </Box>
                </Box>
                {/* <Box sx={{ display: 'flex', }}>
                    <Box sx={{ width: '100%' }}>
                        <Typography sx={{
                            fontSize: typography.h7.fontSize,
                            fontWeight: typography.h1.fontWeight,
                            fontFamily: typography.h1.fontFamily,
                            color: palette.plain.main,
                            WebkitTextStroke: '1.5px #073A16',
                            textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                            textTransform: 'uppercase',
                            mb: 1,
                        }} gutterBottom>
                            Inventory Report
                        </Typography>
                    </Box>
                    <Box sx={{ height: '30rem' }}>
                        <PieChart
                            data={[
                                { title: 'Consumed', value: 30, color: palette.primary.main, label: 'A' },
                                { title: 'Remaining', value: 70, color: 'red', label: 'B' },
                            ]}
                            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                            labelStyle={{ ...labelStyle }}
                        />
                    </Box>
                </Box> */}
            </Box>
        </Modal >
    );
}

export default ConsumedPieChart;