import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import StyledTextField from '../components/atoms/TextField.js';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './Design/registerdesign.css';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import typography from './theme/typhography.js';
import palette from './theme/palette.js';
import ConfirmButton from '../components/atoms/confirmButton.js';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const [input, setInput] = useState({
    restaurantName: '',
    email: '',
    restaurantStreetAddress: '',
    restaurantBarangay: '',
    country: '',
    contactNumber: '',
    restaurantPermitNumber: '',
    password: '',
    confirmPassword: '',
    restaurantCity: '',
    province: '',
    zipCode: '',
  });

  const [error, setError] = useState({
    restaurantName: '',
    email: '',
    restaurantStreetAddress: '',
    restaurantBarangay: '',
    country: '',
    contactNumber: '',
    restaurantPermitNumber: '',
    password: '',
    confirmPassword: '',
    restaurantCity: '',
    province: '',
    zipCode: '',
  })

  const onInputChange = (name, value) => {
    setInput((prev) => {
      const updatedInput = { ...prev, [name]: value };
      validateInput({ target: { name, value } }); // Pass the updated input to validateInput
      return updatedInput;
    });
  };

  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };

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
          } else {
            checkPermitNumber(value.trim(), stateObj); // Await the function call
          }
          break;

        case 'restaurantStreetAddress':
          if (!value.trim()) {
            stateObj[name] = '* Required';
          }
          break;

        case 'restaurantBarangay':
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

        case 'country':
          if (!value.trim()) {
            stateObj[name] = '* Required';
          }
          break;

        case 'contactNumber':
          if (!value) {
            stateObj[name] = "* Required";
          } else if (!/^09\d{9}$/.test(value)) {
            stateObj[name] = "* Required";
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
            stateObj[name] = "Please match your Password.";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password and Confirm Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  }

  const checkPermitNumber = async (permitNumber) => {
    const db = getFirestore();
    const permitQuery = query(
      collection(db, 'admin_users'),
      where('restaurantPermit', '==', permitNumber)
    );

    const permitSnapshot = await getDocs(permitQuery);

    return !permitSnapshot.empty;
  };

  const isValidEmail = (email) => {
    // Use a regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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
      // Check if the permit number already exists
      const permitExists = await checkPermitNumber(input.restaurantPermitNumber);
      if (permitExists) {
        setError((prev) => ({
          ...prev,
          restaurantPermitNumber: 'Permit Already Taken!',
        }));
        return;
      }

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
        restaurantName: input.restaurantName,
        restaurantEmail: input.email,
        restaurantStreetAddress: input.restaurantStreetAddress,
        restaurantBarangay: input.restaurantBarangay,
        restaurantCity: input.restaurantCity,
        country: input.country,
        contactNum: input.contactNumber,
        restaurantPermit: input.restaurantPermitNumber,
        zipCode: input.zipCode,
        province: input.province,
        role: 'admin',
        approved: 'No',
        package: selectedPackage, // Add selectedPackage to the data sent to Firebase
      });

      console.log('User registered successfully:', userCredential.user.uid);

      window.alert('Registered successfully!');

      history('/login');

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}> {/* Added textAlign: 'center' */}
          <Typography sx={{
            fontSize: typography.h1.fontSize,
            fontWeight: typography.h1.fontWeight,
            fontFamily: typography.h1.fontFamily,
            color: palette.primary.main,
            textTransform: 'uppercase',
          }}>
            Registration
          </Typography>
        </Box>
      </Box>
      <form onSubmit={registerUser}>
        <Box sx={{ p: 1, mb: 4, width: '100%' }}>
          <Box sx={{ p: 1, mt: 2 }}>
            <Box style={{ width: '50%', margin: '0 auto' }}>
              <Grid container spacing={2} sx={{ display: 'flex', pb: 5 }}>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Restaurant Name"
                    color="success"
                    onChange={(e) => onInputChange('restaurantName', e.target.value)}
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
                    // type="number"
                    onChange={(e) => onInputChange('restaurantPermitNumber', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.restaurantPermitNumber}
                    helperText={error.restaurantPermitNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Select Restaurant Permit Image"
                    InputLabelProps={{ shrink: true }}
                    type="file"
                    accept="image/*"
                    color="success"
                    onChange={(e) => onInputChange('selectedRestaurantPermitImage', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.selectedRestaurantPermitImage}
                    helperText={error.selectedRestaurantPermitImage}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Restaurant Street"
                    color="success"
                    onChange={(e) => onInputChange('restaurantStreetAddress', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.restaurantStreetAddress}
                    helperText={error.restaurantStreetAddress}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Restaurant Barangay"
                    color="success"
                    onChange={(e) => onInputChange('restaurantBarangay', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.restaurantBarangay}
                    helperText={error.restaurantBarangay}
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
                    type="number"
                    onChange={(e) => onInputChange('zipCode', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.zipCode}
                    helperText={error.zipCode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Country"
                    color="success"
                    onChange={(e) => onInputChange('country', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.country}
                    helperText={error.country}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Contact Number"
                    color="success"
                    type="number"
                    onChange={(e) => onInputChange('contactNumber', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.contactNumber}
                    helperText={error.contactNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    color="success"
                    onChange={(e) => onInputChange('password', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.password}
                    helperText={error.password}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={togglePasswordVisibility}
                          sx={{ position: 'absolute', right: 0 }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    color="success"
                    onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                    onBlur={validateInput}
                    error={!!error.confirmPassword}
                    helperText={error.confirmPassword}
                    fullWidth={true}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          sx={{ position: 'absolute', right: 0 }}
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ width: '100%', height: 500, mb: 2, p: 2, }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                  <Typography sx={{
                    fontSize: typography.h5.fontSize,
                    fontWeight: typography.h1.fontWeight,
                    fontFamily: typography.h1.fontFamily,
                    mb: 3
                  }}>Subscription</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 250,
                      height: 400,
                      p: 2,
                      bgcolor: selectedPackage === 'Starter Pack' ? '#C3E8FF' : 'white',
                      boxShadow: '0px 0px 10px 0px rgba(0,0,0.01)',
                    }}
                  >
                    <Paper
                      sx={{
                        position: 'absolute',
                        bgcolor: palette.info.main,
                        height: 320,
                        width: 300,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: -1,
                        mt: 2.5,
                        ml: -5
                      }}
                      variant="outlined"
                      elevation={24} />
                    <Box gutterBottom>
                      <Typography sx={{
                        fontSize: typography.h1.fontSize,
                        fontWeight: typography.h1.fontWeight,
                        fontFamily: typography.h1.fontFamily,
                        color: palette.info.main,
                        textTransform: 'uppercase',
                      }}>
                        Starter
                      </Typography>
                      <Typography gutterBottom>Package</Typography>
                      <Box sx={{
                        borderBottom: '1px solid grey',
                        ml: 5,
                        mr: 5,
                        mb: 2,
                      }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CheckIcon sx={{ fontSize: 40, color: 'green' }} />
                        <Typography variant='h7'>Full Access</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ClearIcon sx={{ fontSize: 40, color: 'red' }} />
                        <Typography variant='h7'>Documentation</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                        <ClearIcon sx={{ fontSize: 40, color: 'red' }} />
                        <Typography variant='h7'>Free Updates</Typography>
                      </Box>
                    </Box>
                    <Box sx={{
                      borderBottom: '1px solid grey',
                      ml: 5,
                      mr: 5,
                      mb: 2,
                    }} />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={() => setSelectedPackage('Starter Pack')}
                        sx={{
                          bgcolor: palette.info.main,
                          border: `1px solid #023B5E`,
                          '&:hover': {
                            color: palette.info.main,
                            bgcolor: 'white',
                            border: `1px solid ${palette.info.main}`,
                          },
                        }}
                      >
                        {selectedPackage === 'Starter Pack' ? 'Selected' : 'Select'}
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        width: 250,
                        height: 400,
                        p: 2,
                        bgcolor: selectedPackage === 'Premium Pack' ? '#CAFFD9' : 'white',
                        boxShadow: '0px 0px 10px 0px rgba(0,0,0.01)',
                      }}
                    >
                      <Paper
                        sx={{
                          position: 'absolute',
                          bgcolor: palette.primary.main,
                          height: 320,
                          width: 300,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: -1,
                          mt: 2.5,
                          ml: -5
                        }}
                        variant="outlined"
                        elevation={24} />
                      <Box gutterBottom>
                        <Typography sx={{
                          fontSize: typography.h1.fontSize,
                          fontWeight: typography.h1.fontWeight,
                          fontFamily: typography.h1.fontFamily,
                          color: palette.primary.main,
                          textTransform: 'uppercase',
                        }}>
                          Premium
                        </Typography>
                        <Typography gutterBottom>Package</Typography>
                        <Box sx={{
                          borderBottom: '1px solid grey',
                          ml: 5,
                          mr: 5,
                          mb: 2,
                        }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CheckIcon sx={{ fontSize: 40, color: 'green' }} />
                          <Typography variant='h7'>Full Access</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CheckIcon sx={{ fontSize: 40, color: 'green' }} />
                          <Typography variant='h7'>Documentation</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                          <CheckIcon sx={{ fontSize: 40, color: 'green' }} />
                          <Typography variant='h7'>Free Updates</Typography>
                        </Box>
                      </Box>
                      <Box sx={{
                        borderBottom: '1px solid grey',
                        ml: 5,
                        mr: 5,
                        mb: 2,
                      }} />
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ConfirmButton
                          label={selectedPackage === 'Premium Pack' ? 'Selected' : 'Select'}
                          onClick={() => setSelectedPackage('Premium Pack')}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Link to="/login"><Button
                  variant='contained'
                  color='error'
                  textDecoration='underline'
                  sx={{
                    borderColor: 'black',
                    border: '2px solid #B20D0D',
                    textDecoration: 'underline',
                    width: '200px',
                    fontWeight: 'bold',
                    boxShadow: '-2px 4px 4px 3px rgba(0, 0, 0, 0.4)'
                  }}>Cancel</Button></Link>

                <Button
                  onClick={registerUser}
                  type="submit"
                  variant='contained'
                  color='success'
                  textDecoration='underline'
                  sx={{
                    borderColor: 'black',
                    border: '2px solid #025515',
                    textDecoration: 'underline',
                    width: '200px',
                    fontWeight: 'bold',
                    boxShadow: '-2px 4px 4px 3px rgba(0, 0, 0, 0.4)'
                  }}
                >Register</Button>
              </Box>
            </Box>
          </Box>
        </Box >
      </form >
    </>
  )
}