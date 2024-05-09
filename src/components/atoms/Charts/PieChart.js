// ConsumedPieChart.js
import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { PieChart } from 'react-minimal-pie-chart';
import palette from '../../../Pages/theme/palette';
import typography from '../../../Pages/theme/typhography';
import { Close } from '@mui/icons-material';

function ConsumedPieChart({ open, onClose }) {
    const [selectedMonth, setSelectedMonth] = useState('');


    useEffect(() => {
        // Get the current date
        const currentDate = new Date();
        // Get the current month as a string (e.g., 'January')
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        // Set the selected month to the current month
        setSelectedMonth(currentMonth);
    }, []);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const customStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        height: '90%',
        bgcolor: 'white',
        border: '2px solid black',
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
        <Modal open={open}>
            <Box sx={customStyle}>
                <Box sx={{ display: 'flex' }}>
                    <Typography sx={{
                        fontSize: typography.h7.fontSize,
                        fontWeight: typography.h1.fontWeight,
                        fontFamily: typography.h1.fontFamily,
                        color: palette.plain.main,
                        WebkitTextStroke: '2px #073A16',
                        textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                        textTransform: 'uppercase',
                    }} gutterBottom>
                        Inventory Report
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={onClose}
                            size='large'
                            sx={{
                                color: 'white',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid green', borderRadius: '100%', backgroundColor: palette.primary.main, padding: 0 }}>
                                <Close />
                            </Box>
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                    <Box>
                        <PieChart
                            data={[
                                { title: 'Consumed', value: 30, color: palette.primary.main },
                                { title: 'Remaining', value: 70, color: 'red' },
                            ]}
                            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                            labelStyle={{ ...labelStyle }}
                            style={{ height: 300, width: 300, }}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography sx={{
                                fontSize: typography.h7.fontSize,
                                fontWeight: typography.h1.fontWeight,
                                fontFamily: typography.h1.fontFamily,
                                color: palette.plain.main,
                                WebkitTextStroke: '1.5px #073A16',
                                textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                                textTransform: 'uppercase',
                            }}>
                                Month of
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 2 }}>
                                <Select
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    sx={{ color: 'green', width: '12rem', border: '2px solid' }}
                                >
                                    <MenuItem value="January">January</MenuItem>
                                    <MenuItem value="February">February</MenuItem>
                                    <MenuItem value="March">March</MenuItem>
                                    <MenuItem value="April">April</MenuItem>
                                    <MenuItem value="May">May</MenuItem>
                                    <MenuItem value="June">June</MenuItem>
                                    <MenuItem value="July">July</MenuItem>
                                    <MenuItem value="August">August</MenuItem>
                                    <MenuItem value="September">September</MenuItem>
                                    <MenuItem value="October">October</MenuItem>
                                    <MenuItem value="November">November</MenuItem>
                                    <MenuItem value="December">December</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                        <Box sx={{ height: '100%', p: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        border: '2px solid black',
                                        width: '3rem',
                                        height: '3rem',
                                        backgroundColor: 'red',
                                        borderRadius: '10px',
                                    }} />
                                <Typography sx={{
                                    fontSize: typography.h2.fontSize,
                                    fontWeight: typography.h1.fontWeight,
                                    fontFamily: typography.h1.fontFamily,
                                    color: palette.plain.main,
                                    WebkitTextStroke: '1.5px #073A16',
                                    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                                    textTransform: 'uppercase',
                                }}>
                                    Consumed
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        border: '2px solid black',
                                        width: '3rem',
                                        height: '3rem',
                                        backgroundColor: palette.primary.main,
                                        borderRadius: '10px',
                                    }} />
                                <Typography sx={{
                                    fontSize: typography.h2.fontSize,
                                    fontWeight: typography.h1.fontWeight,
                                    fontFamily: typography.h1.fontFamily,
                                    color: palette.plain.main,
                                    WebkitTextStroke: '1.5px #073A16',
                                    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                                    textTransform: 'uppercase',
                                }}>
                                    Remaining
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal >
    );
}

export default ConsumedPieChart;