import React, { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
// import palette from '../../Pages/theme/palette';
import ConfirmButton from './confirmButton';
import CancelButton from './cancelButton';

const customStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    bgcolor: 'white',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 1,
    maxHeight: '80vh', // Limit the maximum height to 80% of the viewport height
};

const ConfirmationModal = ({ open, onClose, selectedHistoryItem }) => {
    const [priceInput, setPriceInput] = useState('');

    console.log('Selected History Item:', selectedHistoryItem);

    const handleConfirm = async () => {
        console.log('Confirmed with price:', priceInput);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={customStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Typography variant="h3" component="h2">
                        Confirm Add to Market
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Typography variant="body1">
                        Quantity: {selectedHistoryItem ? selectedHistoryItem.item_quantity : 0}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <input
                        type="number"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        placeholder="Enter price"
                        style={{ padding: '8px', width: '80%' }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <ConfirmButton
                        label="Confirm"
                        onClick={handleConfirm}
                    />
                    <CancelButton onClick={onClose} />
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal;
