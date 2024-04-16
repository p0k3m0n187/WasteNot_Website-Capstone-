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
// import { TextField } from '@mui/material';

const CustomModal = ({ open, onClose, selectedDishId }) => {


    const handleOpen = () => open(true);
    const handleClose = () => onClose(true);

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
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={customStyle}>
                    <Box>
                        <Typography sx={{
                            fontSize: '1.5rem',
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
                        <label style={{ fontSize: '1rem' }}>Dish Name</label>
                        <TextField />
                        <label style={{ fontSize: '1rem' }}>Dish Description</label>
                        <MultiLine />
                        <label style={{ fontSize: '1rem' }}>Category</label>
                        <DropDown />
                        <label style={{ fontSize: '1rem' }}>Array of Ingredients</label>
                        <Box sx={{ display: 'flex' }}>
                            <TextField /> <TextField />
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default CustomModal;

// import React, { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import TextField from '../atoms/TextField';
// import MultiLine from '../atoms/MultiLine';
// import { DropDown } from './Dropdown';
// import { db } from '../../config/firebase';
// import { collection, getDocs } from 'firebase/firestore'; // Updated import

// const CustomModal = () => {
//     const [open, setOpen] = useState(false);
//     const [menuDishes, setMenuDishes] = useState([]); // State to store fetched menu dishes

//     useEffect(() => {
//         const fetchMenuDishes = async () => {
//             try {
//                 const menuDishesSnapshot = await getDocs(collection(db, 'menu_dish')); // Use getDocs to fetch data
//                 const dishesData = menuDishesSnapshot.docs.map(doc => doc.data()); // Map document data to an array
//                 setMenuDishes(dishesData); // Update state with fetched data
//             } catch (error) {
//                 console.error('Error fetching menu dishes:', error);
//             }
//         };

//         fetchMenuDishes();
//     }, []);

//     const handleOpen = () => setOpen(true);
//     const handleClose = () => setOpen(false);

//     const customStyle = {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: '60%',
//         bgcolor: 'white',
//         border: '2px solid #000',
//         borderRadius: '10px',
//         boxShadow: 24,
//         p: 1,
//     };

//     return (
//         <div>
//             <Button onClick={handleOpen}>Open Modal</Button>
//             <Modal
//                 open={open}
//                 onClose={handleClose}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//             >
//                 <Box sx={customStyle}>
//                     {menuDishes.map((dish, index) => ( // Loop through fetched dishes and display them
//                         <div key={index}>
//                             <Typography variant="h4" gutterBottom>{dish.dishName}</Typography>
//                             <Typography variant="body1" gutterBottom>{dish.dishCategory}</Typography>
//                             <Typography variant="body1" gutterBottom>{dish.dishDescription}</Typography>
//                             <ul>
//                                 {dish.ingredientsList.map((ingredient, i) => (
//                                     <li key={i}>{ingredient}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     ))}
//                 </Box>
//             </Modal>
//         </div>
//     );
// }

// export default CustomModal;

