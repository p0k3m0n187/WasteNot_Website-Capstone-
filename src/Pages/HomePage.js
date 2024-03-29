import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar2 from '../components/NavBar2';
import SalesChart from '../components/Sample/SalesChart';
import MarketChart from '../components/Sample/MarketChart';
import { SampleData } from '../components/Sample/SampleData';
import { InventorySampleData } from '../components/Sample/InventorySampleData';
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

export const Homepage = (props) => {
    const [menuItems, setMenuData] = useState([]);
    const [staffData, setStaffData] = useState([]);
    const [adminId, setAdminId] = useState('');
    const [inventoryData, setInventoryData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup5, setShowPopup5] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [selectedYear, setSelectedYear] = useState(); // Default to the current year
    const [selectedMonth, setSelectedMonth] = useState();
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

    const [pieData] = useState({
        labels: ["Consumed", "Remaining"],
        datasets: [
            {
                label: "Consumed Ingredients",
                data: [InventorySampleData[0].marketConsumed, InventorySampleData[0].marketRemaining],
                backgroundColor: ["#57B961", "Red"],
                borderWidth: 5,
                borderColor: 'White',
            }
        ]
    });

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
            <Navbar2 />
            <Sidebar />
            <div className="container">
                <div>
                    <Link to="/staff"><button class="icon-button">
                        <div className="title"><h4>Total Staff</h4></div>
                        <br />
                        <FaUsers />
                        {staffData.length}
                    </button>
                    </Link>
                    <Link to="/menu"><button class="icon-button2">
                        <div className="title2"><h4>Total Dishes</h4></div>
                        <br />
                        <FaBookOpen />
                        {menuItems.length}
                    </button>
                    </Link>
                    <Link to="/inventory"><button class="icon-button3">
                        <div className="title3"><h4>Total Ingredients</h4></div>
                        <br />
                        <FaWarehouse />
                        {inventoryData.length}
                    </button>
                    </Link>

                    <Link to="/market"><button class="icon-button3">
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
                                <span className="close-popup" onClick={handlePopupToggle}>&times;</span>
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

                                <div className='sales-chart'>
                                    <div style={{ width: 1800, height: 750 }}>
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

                    {showBackdrop && <div className="backdrop" onClick={handlePopupToggle5}></div>}

                    {showPopup5 && (
                        <div className="popup-sales">
                            <div className="sales-content">
                                <span className="close-popup" onClick={handlePopupToggle5}>&times;</span>
                                <h2>Consumed Sales</h2>
                                <h2>Month of {selectedMonth}</h2>
                                <select
                                    id="monthSelect"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    <option value={'January'}>January</option>
                                    <option value={'February'}>February</option>
                                    <option value={'March'}>March</option>
                                    <option value={'April'}>April</option>
                                    <option value={'May'}>May</option>
                                    <option value={'June'}>June</option>
                                    <option value={'July'}>July</option>
                                    <option value={'August'}>August</option>
                                    <option value={'September'}>September</option>
                                    <option value={'October'}>October</option>
                                    <option value={'November'}>November</option>
                                    <option value={'December'}>December</option>
                                </select>
                                <div className='consumed-chart'>
                                    <div style={{ width: 1700, height: 750 }}>
                                        <MarketChart InventoryData={pieData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="notify">
                <h1>Notifications</h1>
                <div class="notify-container">
                    <div class="notify1"><img class='sample' src={staff} alt="staff1" /><h3>New Staff Have Been Added!</h3></div>
                    <div class="notify1"><img class='sample' src={image} alt="staff1" /><h3>New Dish has been Added!</h3></div>
                    <div class="notify1"><img class='sample' src={staff} alt="staff1" /><h3>New Staff Have Been Added!</h3></div>
                    <div class="notify1"><img class='sample' src={ingredient} alt="staff1" /><h3>Beef has been Added to Market!</h3></div>
                    <div class="notify1"><img class='sample' src={market} alt="staff1" /><h3>New Ingredient has been Added to Inventory!</h3></div>
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

                {inventoryData.length > 0 ? (
                    <>
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
                    </>
                ) : (
                    // Render a message or component when there is no data
                    <p></p>
                )}

                    {salesData.length > 0 ? (
                    <>
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
                    </>
                ) : (
                    // Render a message or component when there is no data
                    <p></p>
                )}

            </div>
        </>
    );
}; 
