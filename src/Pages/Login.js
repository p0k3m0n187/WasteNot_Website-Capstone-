import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase'; // Ensure Firestore is imported correctly
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import getDoc and doc from firestore
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { IconButton, Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import logo from '../images/logo.png';
import './Design/logindesign.css';

export const Login = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessageError, setSnackbarMessageError] = useState('');
  const history = useNavigate(); // Initialize useHistory

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const signIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, Email, Password);


      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, 'admin_users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.approved === 'Yes') {
          // Redirect to the homepage after successful login
          history('/homepage');
          console.log('Logged in:', userCredential.user);
        } else {
          // window.alert('Waiting for Approval.');
          setSnackbarMessageError('Waiting for Approval.');
          setSnackbarOpen(true);
          console.log('User Info:', userCredential.user);
        }
      } else {
        // Show an alert message when the user profile does not exist
        // window.alert('User profile not found.');
        setSnackbarMessageError('User profile not found.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log('Error logging in:', error.message);

      // Show an alert message when login fails
      // window.alert('Invalid email or password. Please try again.');
      setSnackbarMessageError('Invalid email or password. Please try again.');
        setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        <div className="containers">
          <div className="logo">
            <img alt="bodylogo" src={logo} />
          </div>
          <div className="word">
            <p>WELCOME</p>
          </div>
          <div className="login">
            <form onSubmit={signIn}>
              <label className="emailLabel" htmlFor="Email">Email</label>
              <br />
              <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                id="Email"
                name="Email"
                className="emailInput"
              />
              <br />
              <label htmlFor="Password">Password</label>
              <br />
              <input
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="**********"
                id="Password"
                name="Password"
                className="passwordInput"
              />
              {Password && ( // Show the visibility toggle icons only if password is entered
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  className="passwordToggleBtn"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )}
              <button type="submit" className="LogIn">Log In</button>
            </form>
            <Link to="/register"><button className="Register">Register</button></Link>
          </div>
        </div >
      </div >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position at the top center
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
        >
          {snackbarMessageError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
