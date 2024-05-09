import React, { useEffect, useState } from 'react';
import SalesChart from '../components/Sample/SalesChart';
import { SampleData } from '../components/Sample/SampleData';
// import { InventorySampleData } from '../components/Sample/InventorySampleData';
import './Design/homedesign.css';
import {
    FaUsers,
    FaBookOpen,
    FaWarehouse,
    FaChartBar,
    FaChartPie
} from 'react-icons/fa';
import { Link } from "react-router-dom";
import image from "../images/Ingredients.png";
import ingredient from "../images/Ingredients.png";
import staff from "../images/Staff_sample.png";
import market from "../images/Market.png";
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MiniDrawer from '../components/Drawer';
import ConsumedPieChart from '../components/atoms/Charts/PieChart';
import { Box, Button } from '@mui/material';
import Close from '@mui/icons-material/Close';
import palette from './theme/palette';

export const Homepage = () => {
    const [menuItems, setMenuData] = useState([]);
    const [staffData, setStaffData] = useState([]);
    const [adminId, setAdminId] = useState('');
    const [inventoryData, setInventoryData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup5, setShowPopup5] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [selectedYear, setSelectedYear] = useState(); // Default to the current year
    // const [open, setOpen] = useState(false);

    // const handleOpenModal = () => {
    //     setOpen(true);
    // };

    const handlePopupToggle5 = () => {
        setShowPopup5(!showPopup5);
        setShowBackdrop(!showPopup5); // Show backdrop when popup is opened
    };


    const [chartData] = useState({
        labels: SampleData.map((data) => data.month),
        datasets: [
            {
                label: "Market Sales",
                data: SampleData.map((data) => data.marketSale),
                backgroundColor: ["#57B961"],
                borderWidth: 2,
                borderColor: 'Black',
            },
        ]
    });

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

    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
        setShowBackdrop(!showPopup); // Show backdrop when popup is opened
    };

    const auth = getAuth();
    const user = auth.currentUser;



    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const menuCollection = collection(db, 'menu_dish');
                const menuSnapshot = await getDocs(menuCollection);
                const menuList = [];

                menuSnapshot.forEach((doc) => {
                    const menuData = doc.data();

                    // Check if the menu item belongs to the logged-in user
                    if (adminId && menuData.userId === adminId) {
                        menuList.push({ id: doc.id, ...menuData });
                    }
                });

                setMenuData(menuList);
            } catch (error) {
                console.error('Error fetching menu data: ', error);
            }
        };

        fetchMenuData();
    }, [adminId]);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const inventoryCollection = collection(db, 'inventory');
                const inventorySnapshot = await getDocs(inventoryCollection);
                const inventoryList = [];

                inventorySnapshot.forEach((doc) => {
                    const inventoryData = doc.data();

                    // Check if Restaurant_id matches user.uid
                    if (inventoryData.Restaurant_id === user?.uid) {
                        inventoryList.push({ id: doc.id, ...doc.data() });
                    }
                });

                setInventoryData(inventoryList);
            } catch (error) {
                console.error('Error fetching inventory data: ', error);
            }
        };

        fetchInventoryData();
    }, [user]);

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
                // Initialize selectedYear inside this useEffect
                setSelectedYear(new Date().getFullYear()); // Set default to the current year

                setStaffData(staffData);
            } catch (error) {
                console.error('Error fetching staff data: ', error.message);
            }
        };

        fetchData();
    }, [adminId]);
    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                // Assuming you have a 'sales_item' collection
                const salesCollection = collection(db, 'sale_items');

                // Add a where clause to filter based on adminId and Restaurant_Id
                const salesQuery = query(
                    salesCollection,
                    where('Restaurant_Id', '==', adminId),
                );

                const salesSnapshot = await getDocs(salesQuery);

                const salesList = salesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setSalesData(salesList);
            } catch (error) {
                console.error('Error fetching sales data: ', error);
            }
        };

        fetchSalesData();
    }, [adminId, user?.uid]);


    return (
        <>
            <MiniDrawer />
            <div className="container">
                <div>
                    <Link to="/staff"><button className="icon-button">
                        <div className="title"><h4>Total Staff</h4></div>
                        <br />
                        <FaUsers />
                        {staffData.length}
                    </button>
                    </Link>
                    <Link to="/menu"><button className="icon-button2">
                        <div className="title2"><h4>Total Dishes</h4></div>
                        <br />
                        <FaBookOpen />
                        {menuItems.length}
                    </button>
                    </Link>
                    <Link to="/inventory"><button className="icon-button3">
                        <div className="title3"><h4>Total Ingredients</h4></div>
                        <br />
                        <FaWarehouse />
                        {inventoryData.length}
                    </button>
                    </Link>

                    <Link to="/market"><button className="icon-button3">
                        <div className="title-market"><h4>Market</h4></div>
                        <br />
                        <FaWarehouse />
                        <p>{salesData.length}</p>
                    </button>
                    </Link>

                    <button className="icon-button4" onClick={handlePopupToggle}>
                        <div className="title4">
                            <h3>Sales</h3>
                        </div>
                        <br />
                        <FaChartBar />
                    </button>

                    {showBackdrop && <div className="backdrop" onClick={handlePopupToggle}></div>}

                    {showPopup && (
                        <div className="popup-sales">
                            <div className="sales-content">
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <h2>Market Sales</h2>
                                    <select
                                        id="yearSelect"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                                    >
                                        <option value={2029}>2029</option>
                                        <option value={2028}>2028</option>
                                        <option value={2027}>2027</option>
                                        <option value={2026}>2026</option>
                                        <option value={2025}>2025</option>
                                        <option value={2024}>2024</option>
                                        <option value={2023}>2023</option>
                                    </select>
                                    <Box sx={{ flex: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            onClick={handlePopupToggle}
                                            size='large'
                                            sx={{
                                                color: 'white',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid green', borderRadius: '100%', backgroundColor: palette.primary.main, padding: 0 }}>
                                                <Close />
                                            </Box>
                                        </Button>
                                    </Box>
                                    {/* <span className="close-popup" onClick={handlePopupToggle}>&times;</span> */}
                                </Box>
                                <div className='sales-chart'>
                                    <div style={{
                                        width: '100%'
                                    }}>
                                        <SalesChart salesData={chartData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    <button className="icon-button5" onClick={handlePopupToggle5}>
                        <div className="title4">
                            <h3>Consumed</h3>
                        </div>
                        <br />
                        <FaChartPie />
                    </button>

                    {showPopup5 && (
                        <ConsumedPieChart
                            open={showPopup5}
                            onClose={handlePopupToggle5}
                        />
                    )}
                </div>
            </div >

            <div className="notify">
                <h1>Notifications</h1>
                <div className="notify-container">
                    <div className="notify1"><img className='sample' src={image} alt="staff1" /><h3>New Dish has been Added!</h3></div>
                    <div className="notify1"><img className='sample' src={ingredient} alt="staff1" /><h3>Beef has been Added to Market!</h3></div>
                    <div className="notify1"><img className='sample' src={market} alt="staff1" /><h3>New Ingredient has been Added to Inventory!</h3></div>
                    <div className="notify1"><img className='sample' src={image} alt="staff1" /><h3>New Dish has been Added!</h3></div>
                    <div className="notify1"><img className='sample' src={ingredient} alt="staff1" /><h3>Beef has been Added to Market!</h3></div>
                    <div className="notify1"><img className='sample' src={market} alt="staff1" /><h3>New Ingredient has been Added to Inventory!</h3></div>
                </div>
            </div>

            <div className="scrollable-container">
                {/* Menu section */}
                <h1>Menu</h1>
                <Link to="/menu">
                    <button className="click">See All</button>
                </Link>
                <div className="menu-cont">
                    {menuItems.slice(0, 5).map((item, index) => (
                        <div key={index} className="item">
                            {/* Use the imageUrl to construct the image URL */}
                            <img className="sample" src={item.imageUrl} alt={`menuItems${index + 1}`} />
                            <h3>{item.dishName}</h3>
                            {/* <h4>₱{item.price}</h4> */}
                        </div>
                    ))}
                </div>
                <br />
                <h1>Staff</h1>
                <Link to="/staff">
                    <button className='click'>See All</button>
                </Link>
                <div className='staff-cont'>
                    {staffData.slice(0, 5).map((member, index) => (
                        <div key={index} className="item">
                            {/* Use your sample staff image */}
                            <img className="sample" src={staff} alt={`staff${index + 1}`} />
                            <h3>{`${member.firstName} ${member.lastName}`}</h3>
                        </div>
                    ))}
                </div>
                <br />

                {/* {inventoryData.length > 0 ? (
                    <> */}
                <h1>Inventory</h1>
                <Link to="/inventory"><button className='click'>See All</button></Link>
                <div className='invent-cont'>
                    {inventoryData.slice(0, 5).map((item, index) => (
                        <div key={index} className="item">
                            {/* Use the imageUrl to construct the image URL */}
                            <img className="sample" src={ingredient} alt={`inventory${index + 1}`} />
                            <h3>{item.Item_name}</h3>
                        </div>
                    ))}
                </div>
                <br />
                {/* </>
                ) : (
                    // Render a message or component when there is no data
                    <p></p>
                )} */}

                {/* {salesData.length > 0 ? (
                    <> */}
                <h1>Market</h1>
                <Link to="/market"><button className='click'>See All</button></Link>
                <div className='market-cont'>
                    {salesData.slice(0, 5).map((item, index) => (
                        <div key={index} className="item">
                            {/* Use the imageUrl to construct the image URL */}
                            <img className="sample" src={market} alt={`sale_items${index + 1}`} />
                            <h3>{item.Item_name}</h3>
                        </div>
                    ))}
                </div>
                <br />
                {/* </>
                ) : (
                    // Render a message or component when there is no data
                    <p></p>
                )} */}

            </div>
        </>
    );
}; 
