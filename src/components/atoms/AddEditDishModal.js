import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import typography from '../../Pages/theme/typhography';
import palette from '../../Pages/theme/palette';
import StyledTextField from './TextField';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { storage, db } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';  // Updated imports for Firestore
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import MultiLine from './MultiLine';

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
    p: 5,
    overflowY: 'auto', // Enable vertical scrolling
    maxHeight: '90vh', // Limit the maximum height to 80% of the viewport height
};

export const AddEditDishModal = ({ open, handleClose, editMode, dishToEdit }) => {
    const [dishName, setDishName] = useState('');
    const [dishDescription, setDishDescription] = useState('');
    const [dishCategory, setDishCategory] = useState('');
    const [ingredientsList, setIngredientsList] = useState([{ ingredients: '', grams: '' }]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessageError, setSnackbarMessageError] = useState('');
    const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState('');
    // const history = useNavigate();

    const auth = getAuth();
    const [userId, setUserId] = useState(null);
    const user = auth.currentUser;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid); // Assuming user.uid is the user ID
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
            setIngredientsList(dishToEdit.ingredientsList || [{ ingredients: '', grams: '' }]);
            setSelectedImage(dishToEdit.imageUrl || null);
        } else {
            setDishName('');
            setDishDescription('');
            setDishCategory('');
            setIngredientsList([{ ingredients: '', grams: '' }]);
            setSelectedImage(null);
        }
    }, [editMode, dishToEdit]);

    const handleAddIngredient = () => {
        const hasEmptyFields = ingredientsList.some(
            (ingredient) => ingredient.ingredients.trim() === '' || ingredient.grams.trim() === ''
        );
        if (!hasEmptyFields) {
            setIngredientsList([...ingredientsList, { ingredients: '', grams: '' }]);
        } else {
            setSnackbarMessageError('Please fill in all Ingredients and Grams fields before adding another line.');
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
            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `images/${file.name}`);
            await uploadBytes(storageRef, file);

            // Get the download URL for the uploaded file
            const downloadURL = await getDownloadURL(storageRef);

            // Set the selectedImage state with the download URL
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
        const updatedIngredientsList = [...ingredientsList];
        updatedIngredientsList.splice(index, 1);
        setIngredientsList(updatedIngredientsList);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
                    console.log('Updating dishRef:', dishRef.path);
                    await updateDoc(dishRef, dishData);
                    setSnackbarMessageSuccess('Dish Updated Successfully');
                } else {
                    console.log('Adding new dishData:', dishData);
                    const newDishRef = await addDoc(collection(db, 'menu_dish'), dishData);
                    setSnackbarMessageSuccess('Dish Added Successfully with ID: ' + newDishRef.id);
                }
                setSnackbarOpen(true);
                handleClose();
            } else {
                setSnackbarMessageError('User not authenticated');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error adding/updating document: ', error);
            setSnackbarMessageError('Error processing dish: ' + error.message); // Display specific error message
            setSnackbarOpen(true);
        }
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
                                <input
                                    type="file"
                                    id="dishImage"
                                    accept="image/*"
                                    name="dishImage"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleSelectImageClick}
                                >
                                    <FaPlusCircle />
                                </button>
                            </Box>
                        </Box>
                        <Box sx={{ width: '60%', height: '50%' }}>
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ overflowY: 'auto', maxHeight: '470px', p: 2 }}>
                                    <StyledTextField
                                        label="Dish Name"
                                        name='dishname'
                                        value={dishName}
                                        onChange={(e) => setDishName(e.target.value)}
                                    />
                                    <MultiLine
                                        label="Dish Description"
                                        name='dishname'
                                        value={dishDescription}
                                        onChange={(e) => setDishDescription(e.target.value)}
                                    />
                                    <select
                                        style={{ mb: 2 }}
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
                                                    type="text"
                                                    placeholder="Ingredients"
                                                    value={ingredient.ingredients}
                                                    onChange={(e) => handleIngredientChange(index, 'ingredients', e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Grams"
                                                    value={ingredient.grams}
                                                    onChange={(e) => handleIngredientChange(index, 'grams', e.target.value)}
                                                />
                                                {index > 0 && (
                                                    <button className="remove_ingred" onClick={handleRemoveIngredient}>
                                                        <FaMinusCircle />
                                                    </button>
                                                )}
                                                {index === ingredientsList.length - 1 && (
                                                    <button className="add_ingred" onClick={handleAddIngredient}>
                                                        <FaPlusCircle />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Box>
                                <Button type="submit">{editMode ? 'Update' : 'Add'}</Button>
                                <Button onClick={handleClose}>Cancel</Button>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
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
