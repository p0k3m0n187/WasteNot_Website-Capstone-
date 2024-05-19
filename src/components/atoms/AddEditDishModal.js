import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { storage, db } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Snackbar, Alert, Select, MenuItem, FormControl } from '@mui/material';
import StyledTextField from './TextField';
import MultiLine from './MultiLine';
import typography from '../../Pages/theme/typhography';
import palette from '../../Pages/theme/palette';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '75%',
    bgcolor: 'white',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 2,
    overflowY: 'auto',
    maxHeight: '90vh',
};

export const AddEditDishModal = ({ open, handleClose, editMode, dishToEdit, fetchMenu }) => {
    const [dishName, setDishName] = useState('');
    const [dishDescription, setDishDescription] = useState('');
    const [dishCategory, setDishCategory] = useState('');
    const [ingredientsList, setIngredientsList] = useState([{ ingredients: '', grams: '', classification: '' }]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessageError, setSnackbarMessageError] = useState('');
    const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const auth = getAuth();
    const [userId, setUserId] = useState(null);
    const user = auth.currentUser;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (editMode && dishToEdit) {
            setDishName(dishToEdit.dishName || '');
            setDishDescription(dishToEdit.dishDescription || '');
            setDishCategory(dishToEdit.dishCategory || '');
            setIngredientsList(dishToEdit.ingredientsList.map(ingredient => ({
                ingredients: ingredient.ingredients || '',
                grams: ingredient.grams || '',
                classification: ingredient.classification || ''
            })));
            setSelectedImage(dishToEdit.imageUrl || null);
        } else {
            setDishName('');
            setDishDescription('');
            setDishCategory('');
            setIngredientsList([{ ingredients: '', grams: '', classification: '' }]);
            setSelectedImage(null);
        }
    }, [editMode, dishToEdit]);

    const handleAddIngredient = () => {
        const hasEmptyFields = ingredientsList.some(
            (ingredient) => !ingredient.ingredients?.trim() || !ingredient.grams?.trim() || !ingredient.classification?.trim()
        );
        if (!hasEmptyFields) {
            setIngredientsList([...ingredientsList, { ingredients: '', grams: '', classification: '' }]);
        } else {
            setSnackbarMessageError('Please fill in all Ingredients, Grams, and Classification fields before adding another line.');
            setSnackbarOpen(true);
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredientsList = [...ingredientsList];
        updatedIngredientsList[index][field] = value;
        setIngredientsList(updatedIngredientsList);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(storage, `images/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setSelectedImage(downloadURL);
        }
    };

    const handleSelectImageClick = () => {
        const fileInput = document.getElementById('dishImage');
        fileInput.click();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleRemoveIngredient = (index) => {
        setIngredientsList(prevIngredientsList => {
            const updatedIngredientsList = [...prevIngredientsList];
            updatedIngredientsList.splice(index, 1);
            return updatedIngredientsList;
        });
    };

    const validateForm = () => {
        if (!dishName.trim() || !dishDescription.trim() || !dishCategory.trim() || !selectedImage) {
            setSnackbarMessageError('Please fill in all required fields.');
            setSnackbarOpen(true);
            return false;
        }
        const hasEmptyFields = ingredientsList.some(
            (ingredient) => !ingredient.ingredients?.trim() || !ingredient.grams?.trim() || !ingredient.classification?.trim()
        );
        if (hasEmptyFields) {
            setSnackbarMessageError('Please fill in all Ingredients, Grams, and Classification fields.');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSnackbarMessageError('');
        setSnackbarMessageSuccess('');

        if (!validateForm()) {
            return;
        }

        try {
            if (userId) {
                const dishData = {
                    dishName,
                    dishDescription,
                    dishCategory,
                    ingredientsList,
                    imageUrl: selectedImage,
                    userId: user.uid,
                };
                if (editMode && dishToEdit) {
                    const dishRef = doc(db, `menu_dish/${dishToEdit.id}`);
                    await updateDoc(dishRef, dishData);
                    setSnackbarMessageSuccess('Dish Updated Successfully');
                } else {
                    const newDishRef = await addDoc(collection(db, 'menu_dish'), dishData);
                    setSnackbarMessageSuccess('Dish Added Successfully with ID: ' + newDishRef.id);
                }
                setSnackbarOpen(true);
                handleClose();
                fetchMenu(); // Fetch the updated menu
            } else {
                setSnackbarMessageError('User not authenticated');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error adding/updating document: ', error);
            setSnackbarMessageError('Error processing dish: ' + error.message);
            setSnackbarOpen(true);
        }
    };

    const resetForm = () => {
        setDishName('');
        setDishDescription('');
        setDishCategory('');
        setIngredientsList([{ ingredients: '', grams: '', classification: '' }]);
        setSelectedImage(null);
    };

    const handleCancel = () => {
        resetForm();
        handleClose();
    };

    const styles = {
        backgroundColor: isHovered ? 'white' : 'white',
        color: isHovered ? 'green' : '#03C04A',
        borderRadius: 100,
        fontSize: 50,
        cursor: 'pointer' // Optional: to indicate it's clickable
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div>
            <Modal open={open}>
                <Box sx={style}>
                    <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%' }}>
                        <Typography sx={{
                            fontSize: typography.h7.fontSize,
                            fontWeight: typography.h1.fontWeight,
                            fontFamily: typography.h1.fontFamily,
                            color: palette.plain.main,
                            WebkitTextStroke: '1.5px #12841D',
                            textShadow: '2px 8px 5px rgba(106, 217, 117, 0.52)',
                            textTransform: 'uppercase',
                        }} >
                            {editMode ? 'Edit Dish' : 'Add Dish'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ width: '40%', p: 1 }}>
                            <Box>
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '450px',
                                        borderRadius: '5px',
                                        border: '1px solid black',
                                    }}
                                >
                                    {selectedImage ? (
                                        <img
                                            src={selectedImage}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                border: '1px solid black',
                                                borderRadius: '5px',
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}>
                                            Please Select An Image
                                        </Box>
                                    )}
                                </Box>
                                <Box
                                    sx={{ position: 'absolute', right: '60.2%', top: '76%' }}
                                >
                                    <input
                                        type="file"
                                        id="dishImage"
                                        accept="image/*"
                                        name="dishImage"
                                        onChange={handleImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <FaPlusCircle
                                        type="button"
                                        style={styles}
                                        onClick={handleSelectImageClick}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ width: '60%', height: '50%' }}>
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ overflowY: 'auto', height: '470px', p: 1, mb: 2 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <StyledTextField
                                            label="Dish Name"
                                            name='dishname'
                                            value={dishName}
                                            onChange={(e) => setDishName(e.target.value)}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <MultiLine
                                            label="Dish Description"
                                            name='dishname'
                                            value={dishDescription}
                                            onChange={(e) => setDishDescription(e.target.value)}
                                        />
                                    </Box>
                                    <select
                                        style={{ mb: 2, border: '1px solid #03C04A' }}
                                        id="dishCategory"
                                        name="dishCategory"
                                        value={dishCategory}
                                        onChange={(e) => setDishCategory(e.target.value)}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        <option value="meat">Meat</option>
                                        <option value="soup">Soup</option>
                                        <option value='appetizers'>Appetizers</option>
                                        <option value='salads'>Salads</option>
                                        <option value='main courses'>Main Courses</option>
                                        <option value='pasta'>Pasta</option>
                                        <option value='rice'>Rice Dishes</option>
                                        <option value='sandwiches'>Sandwiches</option>
                                        <option value='fries'>Fries</option>
                                        <option value='grilled'>Grilled</option>
                                        <option value='desserts'>Desserts</option>
                                        <option value='fish'>Fish</option>
                                    </select>

                                    <div className="ingredient-container">
                                        {ingredientsList.map((ingredient, index) => (
                                            <div key={index}>
                                                <input
                                                    style={{ mb: 2, border: '1px solid #03C04A', width: 200 }}
                                                    type="text"
                                                    placeholder="Ingredients"
                                                    value={ingredient.ingredients}
                                                    onChange={(e) => handleIngredientChange(index, 'ingredients', e.target.value)}
                                                />
                                                <input
                                                    style={{ mb: 2, border: '1px solid #03C04A', width: 200 }}
                                                    type="number"
                                                    placeholder="Grams"
                                                    value={ingredient.grams}
                                                    onChange={(e) => handleIngredientChange(index, 'grams', e.target.value)}
                                                />
                                                <FormControl
                                                    style={{ mb: 2, width: 200 }}>
                                                    <Select
                                                        sx={{ border: '1px solid #03C04A', height: 50, ml: 2 }}
                                                        labelId={`select-label-${index}`}
                                                        label="Select Category"
                                                        value={ingredient.classification}
                                                        onChange={(e) => handleIngredientChange(index, 'classification', e.target.value)}
                                                    >
                                                        <MenuItem value="" disabled>Select Category</MenuItem>
                                                        <MenuItem value="Main Ingredient">Main Ingredient</MenuItem>
                                                        <MenuItem value="Base Ingredient">Base Ingredient</MenuItem>
                                                        <MenuItem value='Secondary Ingredient'>Secondary Ingredient</MenuItem>
                                                        <MenuItem value='Seasonings'>Seasonings</MenuItem>
                                                        <MenuItem value='Accompaniments'>Accompaniments</MenuItem>
                                                        <MenuItem value='Binding Agents'>Binding Agents</MenuItem>
                                                        <MenuItem value='Aromatics'>Aromatics</MenuItem>
                                                        <MenuItem value='Fats'>Fats</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {index > 0 && (
                                                    <button type="button" className="remove_ingred" onClick={() => handleRemoveIngredient(index)}>
                                                        <FaMinusCircle />
                                                    </button>
                                                )}
                                                {index === ingredientsList.length - 1 && (
                                                    <button
                                                        type="button"
                                                        className="add_ingred"
                                                        onClick={handleAddIngredient}
                                                    >
                                                        <FaPlusCircle />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        sx={{
                                            mr: 2,
                                            width: 100,
                                            bgcolor: palette.primary.main,
                                            border: `1px solid #03A140`,
                                            '&:hover': {
                                                color: palette.primary.main,
                                                bgcolor: 'white',
                                                border: `1px solid ${palette.primary.main}`,
                                            },
                                        }}
                                        variant="contained"
                                        type="submit"
                                    >
                                        {editMode ? 'Update' : 'Add'}
                                    </Button>
                                    <Button
                                        sx={{
                                            width: 100,
                                            bgcolor: palette.error.main,
                                            border: `1px solid red`,
                                            '&:hover': {
                                                color: 'red',
                                                bgcolor: 'white',
                                                border: `1px solid red`,
                                            },
                                        }}
                                        variant="contained"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at the top center
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarMessageError ? 'error' : 'success'}
                >
                    {snackbarMessageError || snackbarMessageSuccess}
                </Alert>
            </Snackbar>
        </div>
    );
};