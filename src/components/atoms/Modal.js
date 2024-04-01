import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import typography from '../../Pages/theme/typhography';
import palette from '../../Pages/theme/palette';
import TextField from '../atoms/TextField';
import MultiLine from '../atoms/MultiLine';
import { DropDown } from './Dropdown';

const CustomModal = ({ buttonText, title, content }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const customStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'white',
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: 24,
        p: 1,
    };

    return (
        <div>
            <Button onClick={handleOpen}>{buttonText}</Button>
            <Modal
                open={open}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={customStyle}>
                    <Box>
                        <Typography sx={{
                            fontSize: '3rem',
                            fontWeight: typography.h1.fontWeight,
                            fontFamily: typography.h1.fontFamily,
                            color: palette.plain.main,
                            WebkitTextStroke: '1.5px #12841D',
                            textShadow: '2px 8px 5px rgba(106, 217, 117, 0.52)',
                            textTransform: 'uppercase',
                        }} gutterBottom>
                            Edit Dish
                        </Typography>
                    </Box>
                    <Box>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {content}
                        </Typography>
                        <TextField
                        label="DishName"
                        // value={dishName}
                        />
                        <MultiLine
                        label="Dish Description"
                        // value={dishName}
                        />
                        <DropDown/>
                    </Box>
                    <Box>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {content}
                        </Typography>
                        <TextField
                        label="DishName"
                        // value={dishName}
                        />
                        <MultiLine
                        label="Dish Description"
                        // value={dishName}
                        />
                        <DropDown/>
                    </Box>
                    
                </Box>
            </Modal>
        </div>
    );
}

export default CustomModal;
