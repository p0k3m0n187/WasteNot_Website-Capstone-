import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '../atoms/TextField';
import MultiLine from '../atoms/MultiLine';
import { DropDown } from './Dropdown';
import typography from '../../Pages/theme/typhography';
import palette from '../../Pages/theme/palette';

const CustomModal = ({ open, onClose, selectedDish }) => {
    const [editedDishData, setEditedDishData] = useState({
        name: '',
        description: '',
        category: '',
        ingredients: [],
    });

    // Update edited data when selectedDish changes
    useEffect(() => {
        if (selectedDish) {
            setEditedDishData({
                name: selectedDish.dishName || '', // Provide default value ''
                description: selectedDish.dishDescription || '', // Provide default value ''
                category: selectedDish.dishCategory || '', // Provide default value ''
                ingredients: selectedDish.ingredientsList ? [...selectedDish.ingredientsList] : [],
            });
        }
    }, [selectedDish]);

    const handleSaveChanges = () => {
        // Implement logic to save changes to the dish data
        console.log('Edited changes:', editedDishData);
        onClose(); // Close the modal after saving changes
    };

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
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={customStyle}>
                <Typography
                    sx={{
                        fontSize: '1.5rem',
                        fontWeight: typography.h1.fontWeight,
                        fontFamily: typography.h1.fontFamily,
                        color: palette.plain.main,
                        WebkitTextStroke: '1.5px #12841D',
                        textShadow: '2px 8px 5px rgba(106, 217, 117, 0.52)',
                        textTransform: 'uppercase',
                    }}
                    gutterBottom
                >
                    Edit Dish
                </Typography>
                <Box>
                    <label style={{ fontSize: '1rem' }}>Dish Name</label>
                    <TextField
                        value={editedDishData.name}
                    // onChange={(e) => setEditedDishData({ ...editedDishData, name: e.target.value })}
                    />
                    <label style={{ fontSize: '1rem' }}>Dish Description</label>
                    <MultiLine
                        value={editedDishData.description}
                    // onChange={(e) => setEditedDishData({ ...editedDishData, description: e.target.value })}
                    />
                    <label style={{ fontSize: '1rem' }}>Category</label>
                    <DropDown
                        value={editedDishData.category}
                    // onChange={(e) => setEditedDishData({ ...editedDishData, category: e.target.value })}
                    />
                    {/* <label style={{ fontSize: '1rem' }}>Array of Ingredients</label>
                    <Box sx={{ display: 'flex' }}>
                        {editedDishData.ingredients.map((ingredient, index) => (
                            <TextField
                                key={index}
                                value={ingredient}
                                onChange={(e) =>
                                    setEditedDishData((prevData) => {
                                        const updatedIngredients = [...prevData.ingredients];
                                        updatedIngredients[index] = e.target.value;
                                        return { ...prevData, ingredients: updatedIngredients };
                                    })
                                }
                            />
                        ))}
                    </Box> */}
                </Box>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </Box>
        </Modal>
    );
};

export default CustomModal;
