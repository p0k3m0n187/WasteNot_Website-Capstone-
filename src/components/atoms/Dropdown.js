import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

export function DropDown() {
    const [dishCategory, setDishCategory] = useState('');


    return (
        <Box>
            <FormControl fullWidth>
                <Select
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value)}
                >
                    <MenuItem value='meat'>Meat</MenuItem>
                    <MenuItem value='soup'>Soup</MenuItem>
                    <MenuItem value='appetizers'>Appetizers</MenuItem>
                    <MenuItem value='salads'>Salads</MenuItem>
                    <MenuItem value='main courses'>Main Courses</MenuItem>
                    <MenuItem value='pasta'>Pasta</MenuItem>
                    <MenuItem value='rice'>Rice Dishes</MenuItem>
                    <MenuItem value='sandwiches'>Sandwiches</MenuItem>
                    <MenuItem value='fries'>Fries</MenuItem>
                    <MenuItem value='grilled'>Grilled</MenuItem>
                    <MenuItem value='desserts'>Desserts</MenuItem>
                    <MenuItem value='fish'>Fish</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}