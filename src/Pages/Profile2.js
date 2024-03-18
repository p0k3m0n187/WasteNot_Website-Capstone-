import React, { useState, useEffect } from 'react';
import './Design/profiledesign.css';
// import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar2 from '../components/NavBar2';
import { Box, Grid } from '@mui/material';
import StyledTextField from '../components/atoms/TextField.js';
import MultiLine from '../components/atoms/MultiLine.js';
import {
    FaPlusCircle
} from 'react-icons/fa';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PageTitle from './Design/pagetitle.js';



export const Profile2 = () => {

    const history = useNavigate()
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({

        restaurantname: '',
        email: '',
        restoStreetAdd: '',
        restoBarangay: '',
        restocity: '',
        country: '',
        province: '',
        contactnum: '',
        restoPermit: '',
        restocode: '',
        restodescrip: '',
        profileImage: '',
    });


    useEffect(() => {
        let signOutTriggered = false; // Local variable to track sign-out

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && !signOutTriggered) {
                history('/');
            } else {
                fetchUserData(user?.uid);
            }
        });

        return () => unsubscribe();
    }, [history]);
    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;

                // Check 'admin_users' collection
                const adminUserDoc = await getDoc(doc(db, 'admin_users', userId));
                if (adminUserDoc.exists()) {
                    const adminUserData = adminUserDoc.data();
                    setUserData(adminUserData);
                    setFormData({
                        restaurantname: adminUserData.restaurantName,
                        email: adminUserData.restaurantEmail,
                        restoStreetAdd: adminUserData.restaurantStreetAddress,
                        restoBarangay: adminUserData.restaurantBarangay,
                        country: adminUserData.country,
                        restocity: adminUserData.restaurantCity,
                        restocode: adminUserData.zipCode,
                        province: adminUserData.province,
                        contactnum: adminUserData.contactNum,
                        restoPermit: adminUserData.restaurantPermit,
                        restodescrip: adminUserData.restaurantDesc,
                        profileImage: adminUserData.restaurantLogo,
                    });
                } else {
                    console.log('Admin user not found');
                }
            } else {
                console.log('User not logged in');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };




    useEffect(() => {
        // Fetch user data when the component mounts
        fetchUserData();
    }, []);

    const handleClick = () => {
        signOut(auth).then(val => {
            console.log(val, "Log Out!");
            history('/');
        });
    }

    const [isEditable, setIsEditable] = useState(false);


    const handleCancel = () => {
        // Reset the form data
        setFormData({
            restaurantname: userData ? userData.restaurantName : '',
            email: userData ? userData.restaurantEmail : '',
            restoStreetAdd: userData ? userData.restaurantStreetAddress : '',
            restoBarangay: userData ? userData.restaurantBarangay : '',
            restocity: userData ? userData.restaurantCity : '',
            country: userData ? userData.country : '',
            restocode: userData ? userData.zipCode : '',
            province: userData ? userData.province : '',
            contactnum: userData ? userData.contactNum : '',
            restoPermit: userData ? userData.restaurantPermit : '',
            restodescrip: userData ? userData.restaurantDesc : '',
            profileImage: formData.selectedImage || userData.restaurantLogo
        });

        // Exit edit mode
        setIsEditable(false);
    };


    const toggleEdit = () => {
        setIsEditable(!isEditable);
    }

    const onInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        validateInput(e);
    }

    const [error, setError] = useState({
        password: '',
        confirmPassword: '',
    })

    const handleSave = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const userDocRef = doc(db, 'admin_users', userId);

                // Create an object with the updated profile information
                const updatedData = {
                    restaurantName: formData.restaurantname,
                    restaurantEmail: formData.email,
                    restaurantStreetAddress: formData.restoStreetAdd,
                    restaurantBarangay: formData.restoBarangay,
                    country: formData.country,
                    contactNum: formData.contactnum,
                    restaurantPermit: formData.restoPermit,
                    restaurantCity: formData.restocity,
                    province: formData.province,
                    zipCode: formData.restocode,
                    restaurantDesc: formData.restodescrip,
                    restaurantLogo: formData.selectedImage
                };

                // Check if selectedImage is available, then include it in the updatedData
                if (formData.selectedImage) {
                    updatedData.restaurantLogo = formData.selectedImage;
                }

                // Update the document in the 'admin_users' collection
                await setDoc(userDocRef, updatedData, { merge: true });

                // Fetch updated user data to reflect changes in the UI
                fetchUserData();

                // Exit edit mode
                setIsEditable(false);
                window.alert("Profile Updated")
            } else {
                console.log('User not logged in');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };


    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        // Generate a unique name for the file
        const fileName = `Admin_Profile/${auth.currentUser.uid}_${file.name}`;

        // Get a reference to the storage location
        const storage = getStorage();
        const storageRef = ref(storage, fileName);

        // Upload the file to Firebase Storage
        try {
            await uploadBytes(storageRef, file);

            // Update formData with the selected image URL
            const downloadURL = await getDownloadURL(storageRef);
            setFormData((prev) => ({
                ...prev,
                selectedImage: downloadURL, // Update selectedImage here
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };



    const handleSelectImageClick = () => {
        // Trigger the file input when the "Select Image" button is clicked
        document.getElementById('profileImage').click();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateInput = e => {
        let { name, value } = e.target;
        setError(prev => {
            const stateObj = { ...prev, [name]: "" };

            switch (name) {
                case "password":
                    if (!value) {
                        stateObj[name] = "Please enter new Password.";

                    } else if (formData.confirmPassword && value !== formData.confirmPassword) {
                        stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
                    } else {
                        stateObj["confirmPassword"] = formData.confirmPassword ? "" : error.confirmPassword;
                    }
                    break;

                case "confirmPassword":
                    if (!value) {
                        stateObj[name] = "Please enter Confirm new Password.";
                    } else if (formData.password && value !== formData.password) {
                        stateObj[name] = "Password and Confirm Password does not match.";
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    };


    return (
        <>
            <Navbar2 />
            <Sidebar />
            {/* <Box sx={{ p: 1, mb: 4, width: '100%' }}>
                <div className='profile'>
                    <form>
                        <img
                            src={formData.profileImage}
                            alt=""
                            className="profile-image"
                            onClick={isEditable ? handleSelectImageClick : undefined}
                        />

                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            name="profileImage"
                            onChange={handleImageUpload}
                            disabled={!isEditable}
                            style={{ display: 'none' }}
                        />
                        {isEditable && (
                            <button
                                type="button"
                                className="btn-select-image"
                                onClick={handleSelectImageClick}
                            >
                                <FaPlusCircle />
                            </button>
                        )}
                        <div className='form-prof'>
                            <label>Resturant Name</label>
                            <br />
                            <input
                                type="text"
                                name="restaurantname"
                                value={formData.restaurantname}
                                onChange={onInputChange}
                                disabled={!isEditable}
                            />
                            <br />
                            <br />

                            <label>Email</label>
                            <br />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onInputChange}
                                disabled={true} 
                            />
                            <br />
                            <br />

                            <label>Restaurant Street Address</label>
                            <br />
                            <input
                                type="text"
                                name="restoStreetAdd"
                                value={formData.restoStreetAdd}
                                onChange={handleInputChange}
                                disabled={!isEditable} 
                            />
                            <br />
                            <br />

                            <label>Restaurant City</label>
                            <br />

                            <input
                                type="text"
                                name="restocity"
                                value={formData.restocity}
                                onChange={handleInputChange}
                                disabled={!isEditable}
                            />
                            <br />
                            <br />

                            <label>Zip Code</label>
                            <br />

                            <input
                                type="number"
                                name="restocode"
                                value={formData.restocode}
                                onChange={handleInputChange}
                                disabled={!isEditable} 
                            />

                            <label>Contact number</label>
                            <br />
                            <input
                                type="tel"
                                name="contactnum"
                                value={formData.contactnum}
                                onChange={handleInputChange}
                                pattern="^09\d{9}$"
                                title="Please enter a valid Philippine contact number starting with 09"
                                disabled={!isEditable}
                            />
                            <br />
                            <br />




                            <label>Restaurant Description</label>
                            <br />

                            <div className='description'><input
                                type="text"
                                name="restodescrip"
                                value={formData.restodescrip}
                                onChange={handleInputChange}
                                placeholder="Update Restaurant Description"
                                disabled={!isEditable}
                            />
                            </div>
                            <br />
                        </div>
                    </form>
                </div>
            </Box > 

            <div>
                {isEditable ? (
                    <>
                        <button className="bttnsave" onClick={handleSave}>Save</button>
                        <button className="bttnedit2" onClick={handleCancel}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button className="bttnedit" onClick={toggleEdit}>Edit Profile</button>
                        <button onClick={handleClick} className="Backs">LOG OUT</button>
                        <button className="bttndeact">DEACTIVATE</button>
                    </>
                )}
            </div>*/}

            <Box sx={{ padding: 1, width: '100%' }}>
                <Box sx={{ p: 1, mb: 2, width: '100%' }}>
                    <PageTitle title='Profile' />
                    <Box sx={{ p: 1, mt: 2, display: 'flex' }}>
                        <Box sx={{ width: '30%' }}>
                            <img
                                src={formData.profileImage}

                                className="profile-image"
                                onClick={isEditable ? handleSelectImageClick : undefined}
                            />

                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                name="profileImage"
                                onChange={handleImageUpload}
                                disabled={!isEditable}
                                style={{ display: 'none' }}
                            />
                        </Box>
                        <Box sx={{ width: '70%' }}>
                            <Grid container spacing={2} sx={{ display: 'flex', pb: 5 }}>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Restaurant Name"
                                        name="restaurantname"
                                        value={formData.restaurantname}
                                        onChange={onInputChange}
                                        disabled={!isEditable}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Restaurant Permit No."
                                        type="email"
                                        name="restoPermit"
                                        value={formData.restoPermit}
                                        onChange={onInputChange}
                                        disabled={true}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={onInputChange}
                                        disabled={true}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Contact Number"
                                        name="contactnum"
                                        value={formData.contactnum}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Restaurant Street Address"
                                        name="restoStreetAdd"
                                        value={formData.restoStreetAdd}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Restaurant Barangay"
                                        name="restoBarangay"
                                        value={formData.restoBarangay}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Restaurant City"
                                        name="restocity"
                                        value={formData.restocity}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Restaurant Province"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Grid>


                                <Grid item xs={12} sm={6}>
                                    <MultiLine
                                        label='Restaurant Description'
                                        type="text"
                                        name="restodescrip"
                                        placeholder="Update Restaurant Description"
                                        value={formData.restodescrip}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Grid>

                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Box >
        </>
    )
}