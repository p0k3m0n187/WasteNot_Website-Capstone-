import React, { useState, useEffect } from 'react';
import Navbar2 from '../components/NavBar2';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { imageDB, db } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Design/addDishDesign.css';


export const AddDish = (props) => {
    const [dishName, setDishName] = useState('');
    const [dishDescription, setDishDescription] = useState('');
    const [dishCategory, setDishCategory] = useState('');
    const [ingredientsList, setIngredientsList] = useState([{ ingredients: '', grams: '' }]);
    const [selectedImage, setSelectedImage] = useState(null);

    // Initialize authentication
    const auth = getAuth();
    const history = useNavigate();

    const handleAddIngredient = () => {
        // Check if any existing ingredient line has empty fields
        const hasEmptyFields = ingredientsList.some(
            (ingredient) => ingredient.ingredients.trim() === '' || ingredient.grams.trim() === ''
        );
        if (!hasEmptyFields) {
            setIngredientsList([...ingredientsList, { ingredients: '', grams: '' }]);
        } else {
            alert('Please fill in all Ingredients and Grams fields before adding another line.');
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredientsList = [...ingredientsList];
        updatedIngredientsList[index][field] = value;
        setIngredientsList(updatedIngredientsList);
    };

    // const handleAddIngredient = () => {
    //     setIngredientsList([...ingredientsList, { ingredients: '', grams: '' }]);
    // };

    const handleRemoveIngredient = (index) => {
        const updatedIngredientsList = [...ingredientsList];
        updatedIngredientsList.splice(index, 1);
        setIngredientsList(updatedIngredientsList);
    };

    // Use useEffect to get the user ID after authentication
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in.
            } else {
                // No user is signed in.
            }
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, [auth]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedImage(file);
        }
    };

    const handleSelectImageClick = () => {
        const fileInput = document.getElementById('dishImage');
        fileInput.click();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if required fields are empty
        if (
            !dishName.trim() ||
            !dishDescription.trim() ||
            ingredientsList.every((ingredient) => !ingredient.ingredients.trim() && !ingredient.grams.trim())
        ) {
            alert('Please fill up the form');
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;

        try {
            let imageUrl = null;

            if (selectedImage) {
                // Create a reference to the storage location
                const storageRef = ref(imageDB, `menu/${Date.now()}_${dishName}`);

                // Upload the image to storage
                await uploadBytes(storageRef, selectedImage);

                // Get the download URL of the uploaded image
                imageUrl = await getDownloadURL(storageRef);
            }

            const dishesQuery = query(collection(db, 'menu_dish'), where('dishName', '==', dishName), where('userId', '==', user.uid));
            const dishesSnapshot = await getDocs(dishesQuery);

            if (dishesSnapshot.empty) {
                const docRef = await addDoc(collection(db, 'menu_dish'), {
                    dishName,
                    dishDescription,
                    dishCategory,
                    ingredientsList, // Include ingredientsList in the document data
                    imageUrl,
                    userId: user.uid,
                });

                window.alert('Dish Added Successfully');
                console.log('Document written with ID: ', docRef.id);

                // Navigate to the "menu" route
                history('/menu');
            } else {
                alert('Dish Already Existed');
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <>
            <Navbar2 />
            <div className='addDish-container'>
                <div className='addDish-Title'>Add Dish</div>
                <div className='form-addDish'>
                    <div className='dishimg-holder'></div>
                    <img src={selectedImage} alt="" className="dish-image" />
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
                        className="bttn-imagedish-select"
                        onClick={handleSelectImageClick}
                    >
                        <FaPlusCircle />
                    </button>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='dishName'>Name</label>
                        <input
                            type="text"
                            id="dishName"
                            name="dishName"
                            placeholder="Dish Name"
                            value={dishName}
                            onChange={(e) => setDishName(e.target.value)}
                        />

                        <label htmlFor='dishDescription'>Description</label>
                        <input
                            type="text"
                            id="dishDescription"
                            name="dishDescription"
                            placeholder="Dish Description"
                            value={dishDescription}
                            onChange={(e) => setDishDescription(e.target.value)}
                        />

                        <label htmlFor='dishCategory'>Category</label>
                        <select
                            id="dishCategory"
                            name="dishCategory"
                            value={dishCategory}
                            onChange={(e) => setDishCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            <option value="meat">Meat</option>
                            <option value="soup">Soup</option>
                            {/* Add more options as needed */}
                        </select>


                        <label htmlFor="ingredients">Ingredients</label>
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
                                        name='input_grams'
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

                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                        <Link to="/menu"><div><button className='cancel-dish'>Cancel</button></div></Link>
                    </form>
                </div>
            </div>
        </>
    );
};
