import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // Import query and where for Firestore query
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import './Design/addstaffdesign.css';
import { Alert, Snackbar } from "@mui/material";
import MiniDrawer from "../components/Drawer";


export const AddStaff = () => {
    const history = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [formData, setFormData] = useState({
        idNumber: '',
        firstName: '',
        lastName: '',
        gender: '',
        strAddress: '',
        cityAddress: '',
        zipCode: '',
        email: '',
        position: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        idNumber: '',
        firstName: '',
        lastName: '',
        gender: '',
        strAddress: '',
        cityAddress: '',
        zipCode: '',
        email: '',
        position: '',
        password: '',
        confirmPassword: ''
    });
    const [adminId, setAdminId] = useState('');
    const [isIdNumberUnique, setIsIdNumberUnique] = useState(true); // State to store whether ID number is unique or not
    const genders = ['Male', 'Female'];
    const positions = ['Head Staff', 'Staff', 'Manager'];
    const auth = getAuth();

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
            newErrors.idNumber = '*';
        } else {
            // Check if ID number already exists
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
            newErrors.firstName = '*';
        }

        if (!formData.lastName) {
            newErrors.lastName = '*';
        }

        if (!formData.gender) {
            newErrors.gender = '*';
        }

        if (!formData.position) {
            newErrors.position = '*';
        }

        if (!formData.strAddress) {
            newErrors.strAddress = '*';
        }

        if (!formData.cityAddress) {
            newErrors.cityAddress = '*';
        }

        if (!formData.zipCode) {
            newErrors.zipCode = '*';
        }

        if (!formData.email) {
            newErrors.email = '*';
        }

        if (!formData.password) {
            newErrors.password = '*';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSubmit = async () => {
        try {
            const isValid = await validateForm(); // Check form validity

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
                strAddress: formData.strAddress,
                cityAddress: formData.cityAddress,
                zipCode: formData.zipCode,
                email: formData.email,
                position: formData.position,
                adminId: adminId,
                role: 'staff',
                userId: userId,
            });

            window.alert('Staff Added Successfully');
            console.log('Staff data saved to Firestore');
            // setSnackbarOpen(true);

            history('/staff');
        } catch (error) {
            console.error("Error adding user: ", error.message);
            setSnackbarMessage('Existing E-mail. Please use another E-mail!');
            setSnackbarOpen(true);
        }
    };


    // Snackbar close handler
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    return (
        <>
            <MiniDrawer />
            <div className="addstaff-container">
                <div className='scrollable-addstaff'>
                    <div className='thead'>Add Staff</div>
                    <form className='addstaff-info'>
                        <div className='form1'>
                            <div className="input-container">
                                <label htmlFor="idNumber">ID Number:</label>
                                <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="Sample ID Number " />
                                {errors.idNumber && <p className="error">{errors.idNumber}</p>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="firstName">First Name:</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter First Name" />{errors.firstName && <p className="error">{errors.firstName}</p>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="lastName">Last Name:</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter Last Name" />{errors.lastName && <p className="error">{errors.lastName}</p>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="gender">Gender:</label>
                                <select id="gender" name="gender" onChange={handleChange} value={formData.gender}>
                                    <option value="" disabled>Select Gender</option>
                                    {genders.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>{errors.gender && <p className="error">{errors.gender}</p>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="position">Position:</label>
                                <select id="position" name="position" onChange={handleChange} value={formData.position}>
                                    <option value="" disabled>Select Position</option>
                                    {positions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select> {errors.position && <p className="error">{errors.position}</p>}
                            </div>
                            <div className="input-container">
                                <label htmlFor="strAddress">Street Address:</label>
                                <input type="text" name="strAddress" value={formData.strAddress} onChange={handleChange} placeholder="Enter Street Address" />{errors.strAddress && <p className="error">{errors.strAddress}</p>}
                            </div>
                        </div>

                        <div className='form2'>
                            <div className="input-container">
                                <label htmlFor="cityAddress">City Address:</label>
                                <input type="text" name="cityAddress" value={formData.cityAddress} onChange={handleChange} placeholder="Enter City Address" />
                                {errors.cityAddress && <p className="error">{errors.cityAddress}</p>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="zipCode">Zip Code:</label>
                                <input type="number" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Enter Zip Code" />
                                {errors.zipCode && <p className="error">{errors.zipCode}</p>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="email">Email:</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" />
                                {errors.email && <p className="error">{errors.email}</p>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="password">Password:</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" />
                                {errors.password && <p className="error">{errors.password}</p>}
                            </div>

                            <div className="input-container">
                                <label htmlFor="confirmPassword">Confirm Password:</label>
                                <input
                                    type="Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                />
                                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                    </form>
                    <button onClick={handleSubmit} className='bttn-confirm'>Confirm</button>
                    <Link to="/staff"><button className='bttn-cancel'>Cancel</button></Link>
                </div>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    vairant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddStaff;
