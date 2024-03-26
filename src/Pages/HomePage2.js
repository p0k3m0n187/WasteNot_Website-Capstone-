import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar2 from '../components/NavBar2';
import { Container } from '@mui/material';

export const Homepage2 = () => {
    // const [menuItems, setMenuData] = useState([]);
    // const [staffData, setStaffData] = useState([]);
    // const [adminId, setAdminId] = useState('');
    // const [inventoryData, setInventoryData] = useState([]);
    // const [salesData, setSalesData] = useState([]);
    // const [showPopup, setShowPopup] = useState(false);
    // const [showPopup5, setShowPopup5] = useState(false);
    // const [showBackdrop, setShowBackdrop] = useState(false);
    // const [selectedYear, setSelectedYear] = useState(); // Default to the current year
    // const [selectedMonth, setSelectedMonth] = useState();
    // const handlePopupToggle5 = () => {
    //     setShowPopup5(!showPopup5);
    //     setShowBackdrop(!showPopup5); // Show backdrop when popup is opened
    // };


    // const [chartData] = useState({
    //     labels: SampleData.map((data) => data.month),
    //     datasets: [
    //         {
    //             label: "Market Sales",
    //             data: SampleData.map((data) => data.marketSale),
    //             backgroundColor: ["#57B961"],
    //             borderWidth: 2,
    //             borderColor: 'Black',
    //         },
    //     ]
    // });

    // const [pieData] = useState({
    //     labels: ["Consumed", "Remaining"],
    //     datasets: [
    //         {
    //             label: "Consumed Ingredients",
    //             data: [InventorySampleData[0].marketConsumed, InventorySampleData[0].marketRemaining],
    //             backgroundColor: ["#57B961", "Red"],
    //             borderWidth: 5,
    //             borderColor: 'White',
    //         }
    //     ]
    // });

    // const handlePopupToggle = () => {
    //     setShowPopup(!showPopup);
    //     setShowBackdrop(!showPopup); // Show backdrop when popup is opened
    // };

    // const auth = getAuth();
    // const user = auth.currentUser;



    // useEffect(() => {
    //     const fetchMenuData = async () => {
    //         try {
    //             const menuCollection = collection(db, 'menu_dish');
    //             const menuSnapshot = await getDocs(menuCollection);
    //             const menuList = [];

    //             menuSnapshot.forEach((doc) => {
    //                 const menuData = doc.data();

    //                 // Check if the menu item belongs to the logged-in user
    //                 if (adminId && menuData.userId === adminId) {
    //                     menuList.push({ id: doc.id, ...menuData });
    //                 }
    //             });

    //             setMenuData(menuList);
    //         } catch (error) {
    //             console.error('Error fetching menu data: ', error);
    //         }
    //     };

    //     fetchMenuData();
    // }, [adminId]);

    // useEffect(() => {
    //     const fetchInventoryData = async () => {
    //         try {
    //             const inventoryCollection = collection(db, 'inventory');
    //             const inventorySnapshot = await getDocs(inventoryCollection);
    //             const inventoryList = [];

    //             inventorySnapshot.forEach((doc) => {
    //                 const inventoryData = doc.data();

    //                 // Check if Restaurant_id matches user.uid
    //                 if (inventoryData.Restaurant_id === user?.uid) {
    //                     inventoryList.push({ id: doc.id, ...doc.data() });
    //                 }
    //             });

    //             setInventoryData(inventoryList);
    //         } catch (error) {
    //             console.error('Error fetching inventory data: ', error);
    //         }
    //     };

    //     fetchInventoryData();
    // }, [user]);

    // useEffect(() => {
    //     const auth = getAuth();

    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             // User is signed in.
    //             // Access the UID of the currently authenticated admin user
    //             const adminId = user.uid;
    //             setAdminId(adminId); // Set adminId in state for later use
    //         } else {
    //             console.log('No user is signed in.');
    //         }
    //     });

    //     return () => unsubscribe();
    // }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!adminId) {
    //             // Admin is not authenticated, do not fetch data
    //             return;
    //         }

    //         try {
    //             // Fetch staff data only for the authenticated admin
    //             const staffCollection = collection(db, 'users');
    //             const q = query(staffCollection, where('adminId', '==', adminId));
    //             const staffSnapshot = await getDocs(q);

    //             const staffData = staffSnapshot.docs.map((doc) => ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             }));
    //             // Initialize selectedYear inside this useEffect
    //             setSelectedYear(new Date().getFullYear()); // Set default to the current year

    //             setStaffData(staffData);
    //         } catch (error) {
    //             console.error('Error fetching staff data: ', error.message);
    //         }
    //     };

    //     fetchData();
    // }, [adminId]);
    // useEffect(() => {
    //     const fetchSalesData = async () => {
    //         try {
    //             // Assuming you have a 'sales_item' collection
    //             const salesCollection = collection(db, 'sale_items');

    //             // Add a where clause to filter based on adminId and Restaurant_Id
    //             const salesQuery = query(
    //                 salesCollection,
    //                 where('Restaurant_Id', '==', adminId),
    //             );

    //             const salesSnapshot = await getDocs(salesQuery);

    //             const salesList = salesSnapshot.docs.map((doc) => ({
    //                 id: doc.id,
    //                 ...doc.data(),
    //             }));

    //             setSalesData(salesList);
    //         } catch (error) {
    //             console.error('Error fetching sales data: ', error);
    //         }
    //     };

    //     fetchSalesData();
    // }, [adminId, user?.uid]);


    return (
        <>
            <Navbar2 />
            <Sidebar />
            <Container disableGutters sx={{ p: 2 }}>

            </Container>
        </>
    );
}; 
