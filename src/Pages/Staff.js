import React, { useEffect, useState } from 'react';
import './Design/staffdesign.css';
import staff from '../images/Staff_sample.png';
import { FaPlusCircle, FaSearch, FaTrash, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import MiniDrawer from '../components/Drawer';
// import { Box, Typography } from '@mui/material';
// import typography from './theme/typhography';
// import palette from './theme/palette';
// import BoxTotal from '../components/atoms/boxtotal';


export const Staff = (props) => {
  const [staffData, setStaffData] = useState([]);
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        // Access the UID of the currently authenticated admin user
        const adminId = user.uid;
        setAdminId(adminId); // Set adminId in state for later use
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!adminId) {
        // Admin is not authenticated, do not fetch data
        return;
      }

      try {
        // Fetch staff data only for the authenticated admin
        const staffCollection = collection(db, 'users');
        const q = query(staffCollection, where('adminId', '==', adminId));
        const staffSnapshot = await getDocs(q);

        const staffData = staffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStaffData(staffData);
      } catch (error) {
        console.error('Error fetching staff data: ', error.message);
      }
    };

    fetchData();
  }, [adminId]);

  const handleDelete = async (staffId, userId) => {
    const confirmation = window.confirm('Confirm delete?');

    if (!confirmation) {
      return;
    }

    try {
      // Delete the staff member from Firestore
      const staffDocRef = doc(db, 'users', staffId);
      await deleteDoc(staffDocRef);

      // Disable the authentication of the staff member
      const auth = getAuth();

      // Only attempt to delete user if the current user is the one being deleted
      if (auth.currentUser && auth.currentUser.uid === userId) {
        await deleteUser(auth.currentUser);
      }

      // Update the staffData state after deletion
      setStaffData((prevStaffData) =>
        prevStaffData.filter((staffMember) => staffMember.id !== staffId)
      );

      alert('Staff member deleted successfully');
    } catch (error) {
      console.error('Error deleting staff member: ', error.message);
    }
  };


  return (
    <>
      <MiniDrawer />
      {/* <Box sx={{ ml: 10, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '7rem', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'start' }}>
            <Typography
              sx={{
                fontSize: typography.h7.fontSize,
                fontWeight: typography.h1.fontWeight,
                fontFamily: typography.h1.fontFamily,
                color: palette.plain.main,
                WebkitTextStroke: '1.5px #12841D',
                textShadow: '2px 8px 5px rgba(106, 217, 117, 0.52)',
                textTransform: 'uppercase',
              }} gutterBottom>
              Staff
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BoxTotal
              title='Personel'
              icon={<FaUser />}
              total={staffData.length} />
          </Box>
        </Box>
      </Box> */}

      <div className="staff-container">
        <div class="staff-title">Staff</div>
        <div class="total-staff">
          <h2>Total Staff</h2>
          <br />
          <FaUser />
          <h1>{staffData.length}</h1>
        </div>
        <div>
          <Link to="/addstaff">
            <button class="bttn-addstaff">
              <FaPlusCircle />
            </button>
          </Link>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>
            <FaSearch />
          </button>
        </div>
        <div class="staff-scrollable">

          <table>
            <thead>
              <tr>
                <th></th>
                <th>Information</th>
              </tr>
            </thead>
            <tbody>
              {staffData.map((staffMember) => (
                <tr key={staffMember.id}>
                  <td class="profile">
                    <img class="staff-img" src={staff} alt="ingredient" />
                  </td>
                  <td>
                    <form class="staff-info">
                      <label htmlFor="idNumber">ID Number:</label>
                      <input
                        type="text"
                        id="idNumber"
                        name="idNumber"
                        value={staffMember.idNumber}
                        placeholder="Sample ID Number"
                        disabled
                      />
                      <label htmlFor="firstName">First Name:</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={staffMember.firstName}
                        placeholder="Enter First Name"
                        disabled
                      />

                      <label htmlFor="lastName">Last Name:</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={staffMember.lastName}
                        placeholder="Enter Last Name"
                        disabled
                      />

                      <label htmlFor="address">Address:</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={`${staffMember.strAddress}, ${staffMember.cityAddress} ${staffMember.zipCode}`}
                        placeholder="Combined Address"
                        disabled
                      />

                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={staffMember.email}
                        placeholder="Enter Email"
                        disabled
                      />
                    </form>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(staffMember.id, staffMember.userId)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
