import React, { useState, useEffect } from 'react'
import { Alert, Box, Grid, Modal, Snackbar, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../config/firebase';
// import { useNavigate } from 'react-router-dom';
import StyledTextField from '../atoms/TextField';
import CancelButton from '../atoms/cancelButton';
import ConfirmButton from '../atoms/confirmButton';
import typography from '../../Pages/theme/typhography';
import palette from '../../Pages/theme/palette';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'white',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 2,
    overflowY: 'auto',
    maxHeight: '90vh',
};

const AddStaffModal = ({ isOpen }) => {
    const [open, setOpen] = useState(false);
    const [adminId, setAdminId] = useState('');
    const [isIdNumberUnique, setIsIdNumberUnique] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSuccess, setSnackbarSuccess] = useState('');
    const auth = getAuth();

    const handleClose = () => {
        setOpen(false);
        setFormData({
            idNumber: '',
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            position: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({
            idNumber: '',
            firstName: '',
            lastName: '',
            gender: '',
            position: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    const [formData, setFormData] = useState({
        idNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        position: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        idNumber: '',
        firstName: '',
        lastName: '',
        gender: '',
        position: '',
        email: '',
        password: '',
        confirmPassword: ''
    });


    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const adminId = user.uid;
                setAdminId(adminId);
            } else {
                console.log("No user is signed in.");
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = async () => {
        const newErrors = {};

        if (!formData.idNumber) {
            newErrors.idNumber = 'ID number is required';
        } else {
            const q = query(collection(db, "users"), where("idNumber", "==", formData.idNumber));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setSnackbarMessage('Staff ID number already exists');
                setSnackbarOpen(true);
                setIsIdNumberUnique(false);
                return false;
            } else {
                setIsIdNumberUnique(true);
            }
        }

        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }

        if (!formData.position) {
            newErrors.position = 'Position is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSnackbarMessage('');
        setSnackbarSuccess('');

        try {
            const isValid = await validateForm();

            if (!isValid) {
                console.error('Please fill in all the required fields.');
                return;
            }

            const auth = getAuth();
            const { email, password } = formData;

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userId = user.uid;

            const usersCollection = collection(db, 'users');
            await addDoc(usersCollection, {
                idNumber: formData.idNumber,
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                position: formData.position,
                email: formData.email,
                adminId: adminId,
                role: 'staff',
                userId: userId,
            });

            setSnackbarSuccess('Staff Added Successfully');
            console.log('Staff data saved to Firestore');
            handleClose();
        } catch (error) {
            console.error("Error adding user: ", error.message);
            setSnackbarMessage('Existing E-mail. Please use another E-mail!');
            setSnackbarOpen(true); // Open Snackbar only on error
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <div>
                <Modal open={open}>
                    <Box sx={style}>
                        <Box>
                            <Typography sx={{
                                fontSize: typography.h2.fontSize,
                                fontWeight: typography.h1.fontWeight,
                                fontFamily: typography.h1.fontFamily,
                                color: palette.plain.main,
                                WebkitTextStroke: '1.5px #12841D',
                                textShadow: '2px 8px 5px rgba(106, 217, 117, 0.52)',
                                textTransform: 'uppercase',
                            }} gutterBottom>
                                Add Staff
                            </Typography>
                        </Box>
                        <Box>
                            <form>
                                <Box sx={{ flexGrow: 1, mb: 2 }}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item xs={6} md={5}>
                                            <StyledTextField
                                                name="idNumber"
                                                value={formData.idNumber}
                                                onChange={handleChange}
                                                label="Staff ID"
                                                error={!!errors.idNumber}
                                                helperText={errors.idNumber}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={5}>
                                            <StyledTextField
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                label="Email"
                                                error={!!errors.email}
                                                helperText={errors.email}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={5}>
                                            <StyledTextField
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                label="First Name"
                                                error={!!errors.firstName}
                                                helperText={errors.firstName}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={5}>
                                            <StyledTextField
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                label="Last Name"
                                                error={!!errors.lastName}
                                                helperText={errors.lastName}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={5}>
                                            <FormControl error={!!errors.gender} fullWidth>
                                                <InputLabel>Gender</InputLabel>
                                                <Select
                                                    sx={{ mb: 2, border: '1px solid #03C04A', borderRadius: 2, boxShadow: '0 5px 5px rgba(0, 0, 0, 0.6)' }}
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Gender</em>
                                                    </MenuItem>
                                                    <MenuItem value="Male">Male</MenuItem>
                                                    <MenuItem value="Female">Female</MenuItem>
                                                </Select>
                                                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={5}>
                                            <FormControl error={!!errors.position} fullWidth>
                                                <InputLabel>Position</InputLabel>
                                                <Select
                                                    sx={{ mb: 2, border: '1px solid #03C04A', borderRadius: 2, boxShadow: '0 5px 5px rgba(0, 0, 0, 0.6)' }}
                                                    name="position"
                                                    value={formData.position}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Position</em>
                                                    </MenuItem>
                                                    <MenuItem value="Head Staff">Head Staff</MenuItem>
                                                    <MenuItem value="Manager">Manager</MenuItem>
                                                    <MenuItem value="Staff">Staff</MenuItem>
                                                </Select>
                                                {errors.position && <FormHelperText>{errors.position}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} md={5}>
                                            <StyledTextField
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                label="Password"
                                                error={!!errors.password}
                                                helperText={errors.password}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={5}>
                                            <StyledTextField
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                label="Confirm Password"
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, gap: 2 }}>
                                    <ConfirmButton label="Confirm" onClick={handleSubmit} />
                                    <CancelButton label="Cancel" onClick={handleClose} />
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Modal>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at the top center
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarMessage ? 'error' : 'success'}
                >
                    {snackbarMessage || snackbarSuccess}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddStaffModal;
