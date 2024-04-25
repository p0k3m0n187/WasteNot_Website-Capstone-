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
                name: selectedDish.dishName || '',
                description: selectedDish.dishDescription || '',
                category: selectedDish.dishCategory || '',
                ingredients: selectedDish.ingredientsList ? [...selectedDish.ingredientsList] : [],
            });
        }
    }, [selectedDish]);

    const handleSaveChanges = () => {
        console.log('Edited changes:', editedDishData);
        onClose(); // Close the modal after saving changes
    };

    const handleIngredientChange = (index, propName, value) => {
        setEditedDishData((prevData) => {
            const updatedIngredients = [...prevData.ingredients];
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [propName]: value,
            };
            return { ...prevData, ingredients: updatedIngredients };
        });
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
        overflowY: 'auto', // Enable vertical scrolling
        maxHeight: '80vh', // Limit the maximum height to 80% of the viewport height
    };

    return (
        <Modal
            open={open}
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
                        onChange={(e) => setEditedDishData({ ...editedDishData, name: e.target.value })}
                    />
                    <label style={{ fontSize: '1rem' }}>Dish Description</label>
                    <MultiLine
                        value={editedDishData.description}
                        onChange={(e) => setEditedDishData({ ...editedDishData, description: e.target.value })}
                    />
                    <label style={{ fontSize: '1rem' }}>Category</label>
                    <DropDown
                        value={editedDishData.category}
                        onChange={(e) => setEditedDishData({ ...editedDishData, category: e.target.value })}
                    />
                    {/* Display and edit category */}
                    <label style={{ fontSize: '1rem' }}>Edited Category</label>
                    <TextField
                        value={editedDishData.category}
                        onChange={(e) => setEditedDishData({ ...editedDishData, category: e.target.value })}
                    />
                    {/* End of category */}
                    <label style={{ fontSize: '1rem' }}>Array of Ingredients</label>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {editedDishData.ingredients.map((ingredient, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', marginBottom: '5px' }}>
                                    <TextField
                                        label="Ingredient"
                                        value={ingredient.ingredients}
                                        onChange={(e) =>
                                            handleIngredientChange(index, 'name', e.target.value)
                                        }
                                        style={{ marginRight: '10px', flex: 1 }}
                                    />
                                    <TextField
                                        label="Grams"
                                        value={ingredient.grams}
                                        onChange={(e) =>
                                            handleIngredientChange(index, 'grams', e.target.value)
                                        }
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </Box>
                </Box>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
                <Button onClick={onClose}>Cancel</Button>
            </Box>
        </Modal>
    );
};

export default CustomModal;
