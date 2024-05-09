import React, { useState, useEffect, useRef } from 'react';
import './Design/profiledesign.css';
// import { Link } from 'react-router-dom';
import { Box, Button, Grid, Snackbar, Alert, Avatar } from '@mui/material';
import StyledTextField from '../components/atoms/TextField.js';
import MultiLine from '../components/atoms/MultiLine.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MiniDrawer from '../components/Drawer.js';



export const Profile = () => {
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });
  const elementRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      profileImage: userData.restaurantLogo
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
          restaurantDesc: formData.restodescrip || '',
          restaurantLogo: formData.profileImage || userData.restaurantLogo || '' // Provide a default value when selectedImage is undefined
        };

        // Check if selectedImage is available, then include it in the updatedData
        if (formData.profileImage) {
          updatedData.restaurantLogo = formData.profileImage;
        }

        // Update the document in the 'admin_users' collection
        await setDoc(userDocRef, updatedData, { merge: true });

        // Fetch updated user data to reflect changes in the UI
        fetchUserData();

        setIsEditable(false);
        setSnackbarMessage('Profile Updated Successfully');
        console.log('Profile Updated Successfully');
        setSnackbarOpen(true);
      } else {
        console.log('User not logged in');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        profileImage: downloadURL, // Update selectedImage here
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };



  // const handleSelectImageClick = () => {
  //   document.getElementById('profileImage').click();
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateInput = e => {
    let { name, value } = e.target;
    let errorMessage = "";

    switch (name) {
      case "contactnum":
        if (!value || !/^09\d{9}$/.test(value) || value.length !== 11) {
          errorMessage = "Please enter a valid Philippine contact number starting with 09 and with 11 digits.";
        }
        break;

      default:
        break;
    }

    if (errorMessage) {
      // Display error message as a window alert
      window.alert(errorMessage);
    }
  };


  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setElementSize({ width, height });
      }
    });

    const currentElementRef = elementRef.current;

    if (currentElementRef) {
      observer.observe(currentElementRef);

      return () => {
        if (currentElementRef) {
          observer.unobserve(currentElementRef);
        }
      };
    }
  }, [elementRef]);


  return (
    <>
      <MiniDrawer />
      <Box sx={{ padding: 1, width: '100%', pt: '10vh' }}>
        <Box sx={{ p: 1, mb: 2, width: '100%' }}>
          <Box sx={{ p: 1, mt: 2, display: 'flex', gap: 3 }}>
            <Box sx={{ width: '23%', ml: '4%' }}>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isEditable ? (
                  <>
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      name="profileImage"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="profileImage">
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage}
                          alt="Selected Image"
                          style={{
                            borderRadius: '50%',
                            backgroundColor: '#ccc',
                            height: 250,
                            backgroundSize: 'cover',
                            border: '1px solid black',
                            objectFit: 'cover',
                            boxShadow: '-2px 3px 0px 0px rgba(0,0,0,0.3)',
                          }}
                        />
                      ) : (
                        <Avatar
                          alt="Remy Sharp"
                          style={{
                            border: '1px solid black',
                            backgroundColor: '#ccc',
                            boxShadow: '-2px 3px 0px 0px rgba(0,0,0,0.3)',
                            width: '100px', // Adjust width as needed
                            height: '250px', // Adjust height as needed
                          }}
                        />
                      )}
                    </label>
                  </>
                ) : (
                  <Avatar
                    alt="Remy Sharp"
                    src={formData.profileImage || undefined}
                    style={{
                      backgroundColor: '#ccc',
                      border: '1px solid black',
                      width: '70%', // Adjust as needed
                      height: 200, // Adjust as needed
                      boxShadow: '-2px 3px 0px 0px rgba(0,0,0,0.3)',
                    }}
                  />
                )}
              </Box>

              <div
                style={{ color: 'white' }}
                ref={elementRef}>
                <p>Element Width: {elementSize.width}</p>
                <p>Element Height: {elementSize.height}</p>
              </div>

              {/* <Box sx={{ p: 10, display: 'flex', justifyContent: 'center', height: '100px' }}> */}
              {isEditable ? (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant='contained'
                      color='success'
                      textDecoration='underline'
                      sx={{
                        borderColor: 'black',
                        border: '2px solid #57B961',
                        textDecoration: 'underline',
                        width: '140px',
                        height: '10%',
                        fontWeight: 'bold',
                        boxShadow: '-2px 4px 4px 3px rgba(0, 0, 0, 0.4)'
                      }}
                      onClick={handleSave}>Save</Button>
                    <Button
                      variant='contained'
                      color='error'
                      textDecoration='underline'
                      sx={{
                        borderColor: 'black',
                        border: '2px solid #B20D0D',
                        textDecoration: 'underline',
                        width: '140px',
                        fontWeight: 'bold',
                        boxShadow: '-2px 4px 4px 3px rgba(0, 0, 0, 0.4)',
                      }}
                      onClick={handleCancel}>Cancel</Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant='contained'
                      color='success'
                      textDecoration='underline'
                      sx={{
                        borderColor: 'black',
                        border: '2px solid white',
                        textDecoration: 'underline',
                        width: '170px',
                        fontWeight: 'bold',
                        boxShadow: '-2px 4px 4px 3px rgba(0, 0, 0, 0.4)',
                        '&:hover': {
                          borderColor: 'green',
                          backgroundColor: '#57B961',
                          color: 'black',
                          textDecoration: 'underline',
                          boxShadow: '-2px 4px 4px 3px rgba(0, 0, 0, 0.4)'
                        }
                      }}
                      onClick={toggleEdit}>Edit Profile</Button>
                  </Box>
                </>
              )}
              {/* </Box> */}
            </Box>
            <Box sx={{ width: '70%' }}>
              <Grid container spacing={2} sx={{ display: 'flex', pb: 2 }}>
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
                    disabled={!isEditable}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Restaurant Street Address"
                    name="restoStreetAdd"
                    value={formData.restoStreetAdd}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Restaurant Barangay"
                    name="restoBarangay"
                    value={formData.restoBarangay}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Restaurant City"
                    name="restocity"
                    value={formData.restocity}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Restaurant Province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    disabled={!isEditable}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditable}
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
                    disabled={!isEditable}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', width: '100%', pr: 5 }}>
            <Button
              variant='contained'
              color='success'
              textDecoration='underline'
              sx={{
                borderColor: 'black',
                border: '2px solid white',
                textDecoration: 'underline',
                width: '170px',
                fontWeight: 'bold',
                boxShadow: '-2px 4px 4px 3px rgba(0, 0, 0, 0.4)',
                '&:hover': {
                  borderColor: 'green',
                  backgroundColor: '#57B961',
                  color: 'black',
                  textDecoration: 'underline',
                  boxShadow: '-2px 4px 4px 3px rgba(0, 0, 0, 0.4)'
                }
              }}
              onClick={handleClick}>LOG OUT</Button>
          </Box>
        </Box>
      </Box >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          vairant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}