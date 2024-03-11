// import React from 'react';
// import {
//     Box,
//     Button,
//     Grid,
// } from '@mui/material';
// import Navbar from '../components/Navbar';
// import PageTitle from './Design/pagetitle';
// import ColoredButton from '../components/atoms/Button.js';
// import StyledTextField from '../components/atoms/TextField.js';

// export const Register2 = () => {
//     return (
//         <>
//             <Navbar />
//             <Box sx={{ p: 2, mb: 4, width: '100%', }}>
//                 <PageTitle title="Registration" />
//                 <Box sx={{ p: 4, mt: 2 }}>
//                     <Box style={{ width: '35%', margin: '0 auto' }}>
//                         <Grid container spacing={2} sx={{ display: 'flex', pb: 5 }}>
//                             <Grid item xs={12} >
//                                 <StyledTextField label="Restaurant Name" color="success" />
//                             </Grid>
//                             <Grid item xs={12}>
//                                 <StyledTextField label="Email" color="success" />
//                             </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Restaurant Permi Number" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Select Restaurant Permit Image" color="success" />
// </Grid>
// <Grid item xs={12}>
//     <StyledTextField label="Restaurant Street Address" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Restaurant City/Municipality" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Province" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Zip Code" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Contact Number" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Longitude" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Latitude" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Password" color="success" />
// </Grid>
// <Grid item xs={12} sm={6}>
//     <StyledTextField label="Confirm Password" color="success" />
// </Grid>
//                         </Grid>
//                         <Box sx={{ width: '100%', alignContent: 'flex-end' }}>
//                             <Button variant='contained'>Hello powaszcs</Button>
//                             <ColoredButton colorKey="primary" label="Primary Button" hoverColor="#336699" />
//                         </Box>
//                     </Box>
//                 </Box>
//             </Box >
//         </>
//     )
// };

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PageTitle from './Design/pagetitle';
import confirmButton from '../components/atoms/confirmButton.js';
import StyledTextField from '../components/atoms/TextField.js';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
    getFirestore,
    collection,
    setDoc,
    doc,
} from 'firebase/firestore';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Register2 = () => {
    const [input, setInput] = useState({
        restaurantName: '',
        email: '',
        restaurantPermitNumber: '',
        selectedRestaurantPermitImage: null,
        restaurantStreetAddress: '',
        restaurantCity: '',
        province: '',
        zipCode: '',
        contactNumber: '',
        longitude: '',
        latitude: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState({
        restaurantName: '',
        email: '',
        restaurantPermitNumber: '',
        restaurantStreetAddress: '',
        restaurantCity: '',
        province: '',
        zipCode: '',
        contactNumber: '',
        longitude: '',
        latitude: '',
        password: '',
        confirmPassword: '',
    });

    const onInputChange = (name, value) => {
        setInput((prev) => {
            const updatedInput = { ...prev, [name]: value };
            validateInput({ target: { name, value } }); // Pass the updated input to validateInput
            return updatedInput;
        });
    };

    const handleImageChange = (image) => {
        setInput((prev) => ({ ...prev, selectedRestaurantPermitImage: image }));
    };

    const validateInput = (e) => {
        let { name, value } = e.target;
        setError((prev) => {
            const stateObj = { ...prev, [name]: '' };

            switch (name) {
                case 'restaurantName':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;

                case 'email':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    } else if (!isValidEmail(value)) {
                        stateObj[name] = 'Please enter a valid Email.';
                    }
                    break;

                case 'restaurantPermitNumber':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;

                case 'restaurantStreetAddress':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;
                case 'restaurantCity':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;
                case 'province':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;
                case 'zipCode':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;
                case 'contactNumber':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;
                case 'longitude':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;
                case 'latitude':
                    if (!value.trim()) {
                        stateObj[name] = '* Required';
                    }
                    break;
                case "password":
                    if (!value) {
                        stateObj[name] = "* Required";

                    } else if (input.confirmPassword && value !== input.confirmPassword) {
                        stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
                    } else {
                        stateObj["confirmPassword"] = input.confirmPassword ? "" : error.confirmPassword;
                    }
                    break;

                case "confirmPassword":
                    if (!value) {
                        stateObj[name] = "Please Confirm your Password.";
                    } else if (input.password && value !== input.password) {
                        stateObj[name] = "Password and Confirm Password does not match.";
                    }
                    break;

                case "longitude":
                    if (!value) {
                        stateObj[name] = "* Required";
                    }
                    break;

                case "Latitude":
                    if (!value) {
                        stateObj[name] = "* Required";
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const auth = getAuth(); // Initialize Firebase Authentication
    const db = getFirestore(); // Initialize Firestore
    const history = useNavigate(); // Initialize useHistory

    const registerUser = async (e) => {
        e.preventDefault();
        // Check if any required field is empty
        const isAnyFieldEmpty = Object.values(input).some((val) => val.trim() === '');
        if (isAnyFieldEmpty) {
            window.alert('Please fill up the fields.');
            return;
        }

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                input.email,
                input.password
            );

            const usersCollectionRef = collection(db, 'admin_users');
            console.log('before adding the firestore')

            // Add additional user data to Firestore
            await setDoc(doc(usersCollectionRef, userCredential.user.uid), {
                restaurantName: input.restaurantname,
                restaurantEmail: input.email,
                restaurantAddress: input.restoAdd,
                contactNum: input.contactnum,
                restaurantPermit: input.restoPermit,
                restaurantCity: input.restocity,
                zipCode: input.restocode,
                longitude: input.longitude,
                latitude: input.latitude,
                role: 'admin',
            });

            console.log('User registered successfully:', userCredential.user.uid);

            window.alert('Registered successfully!');

            history('/profile');

        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                window.alert('Email is already used.');
            } else {
                console.error('Error registering user:', error.code, error.message);
            }
        }
    };

    return (
        <>
            <Navbar />
            <form onSubmit={registerUser}>
                <Box sx={{ p: 2, mb: 4, width: '100%' }}>
                    <PageTitle title="Registration" />
                    <Box sx={{ p: 4, mt: 2 }}>
                        <Box style={{ width: '35%', margin: '0 auto' }}>
                            <Grid container spacing={2} sx={{ display: 'flex', pb: 5 }}>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        label="Restaurant Name"
                                        color="success"
                                        onChange={(e) => onInputChange('restaurantname', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.restaurantName}
                                        helperText={error.restaurantName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        label="Email"
                                        color="success"
                                        onChange={(e) => onInputChange('email', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.email}
                                        helperText={error.email}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Restaurant Permit Number"
                                        color="success"
                                        onChange={(e) => onInputChange('restaurantPermitNumber', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.restaurantPermitNumber}
                                        helperText={error.restaurantPermitNumber}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Select Restaurant Permit Image"
                                        color="success"
                                        onChange={(e) => onInputChange('selectedRestaurantPermitImage', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.selectedRestaurantPermitImage}
                                        helperText={error.selectedRestaurantPermitImage}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        label="Restaurant Street Address"
                                        color="success"
                                        onChange={(e) => onInputChange('restaurantStreetAddress', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.restaurantStreetAddress}
                                        helperText={error.restaurantStreetAddress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Restaurant City/Municipality"
                                        color="success"
                                        onChange={(e) => onInputChange('restaurantCity', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.restaurantCity}
                                        helperText={error.restaurantCity}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Province"
                                        color="success"
                                        onChange={(e) => onInputChange('province', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.province}
                                        helperText={error.province}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Zip Code"
                                        color="success"
                                        onChange={(e) => onInputChange('zipCode', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.zipCode}
                                        helperText={error.zipCode}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Contact Number"
                                        color="success"
                                        onChange={(e) => onInputChange('contactNumber', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.contactNumber}
                                        helperText={error.contactNumber}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Longitude"
                                        color="success"
                                        onChange={(e) => onInputChange('longitude', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.longitude}
                                        helperText={error.longitude}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Latitude"
                                        color="success"
                                        onChange={(e) => onInputChange('latitude', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.latitude}
                                        helperText={error.latitude}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Password"
                                        color="success"
                                        onChange={(e) => onInputChange('password', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.password}
                                        helperText={error.password}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Confirm Password"
                                        color="success"
                                        onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                                        onBlur={validateInput}
                                        error={!!error.confirmPassword}
                                        helperText={error.confirmPassword}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ width: '100%', alignContent: 'flex-end' }}>
                                <Button variant="contained">Hello powaszcs</Button>
                                <confirmButton colorKey="primary" label="Primary Button" hoverColor="#336699" />
                            </Box>
                        </Box>
                    </Box>
                </Box >
            </form>
        </>
    );
};
