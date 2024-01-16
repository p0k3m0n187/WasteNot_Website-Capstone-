import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar';
import Navbar2 from '../components/NavBar2';
import './Design/menudesign.css';
import { Link } from "react-router-dom";
import { FaWarehouse, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';

export const Menu = (props) => {
    const [menuData, setMenuData] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    const handleDelete = async (docId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this dish?");
        
        if (!confirmDelete) {
            return; // If the user clicks Cancel, do nothing
        }

        try {
            await deleteDoc(doc(db, 'menu_dish', docId));
            setMenuData((prevMenuData) =>
                prevMenuData.filter((item) => item.id !== docId)
            );
            window.alert("Dish Deleted Successfully")
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const menuCollection = collection(db, 'menu_dish');
                const menuSnapshot = await getDocs(menuCollection);
                const menuList = [];

                menuSnapshot.forEach((doc) => {
                    const menuData = doc.data();

                    if (user && menuData.userId === user.uid) {
                        menuList.push({ id: doc.id, ...menuData });
                    }
                });

                setMenuData(menuList);
            } catch (error) {
                console.error('Error fetching menu data: ', error);
            }
        };

        fetchMenuData();
    }, [user]);

    return (
        <>
            <Navbar2 />
            <Sidebar />
            <div className="menu-container">
                <div className='menu-title'><h1>Menu</h1></div>
                <div className='total-menu'>
                    <h2>Total Dishes</h2>
                    <FaWarehouse />
                    <br />
                    <h1>{menuData.length}</h1>
                </div>
                <Link to="/addDish"><div><button className='bttn-add'><FaPlusCircle /></button></div></Link>
                <div className="scrollable-menu">
                    <table className='menu-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Ingredients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuData.map((menuItem) => {
                                return (
                                    <tr key={menuItem.id}>
                                        <td>
                                            <div className="dish_name">
                                                {menuItem.imageUrl && (
                                                    <img className='menu-img' src={menuItem.imageUrl} alt="dish" />
                                                )}
                                                <div className="selected-dish">
                                                    {menuItem.dishName}
                                                </div>
                                                <div>
                                                    <button
                                                        className="del-button"
                                                        onClick={() => handleDelete(menuItem.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="scrollable-decsrip">
                                                <p>{menuItem.dishDescription}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="scrollable-ingredients">
                                                {typeof menuItem.ingredientsList === 'object' &&
                                                    Array.isArray(menuItem.ingredientsList) ? (
                                                    <p>
                                                        {menuItem.ingredientsList.map((item, index) => (
                                                            <span key={index}>
                                                                {`${item.ingredients}: ${item.grams} grams`} <br/>
                                                                {index < menuItem.ingredientsList.length - 1 && ''}
                                                            </span>
                                                        ))}
                                                    </p>
                                                ) : (
                                                    <p>{JSON.stringify(menuItem.ingredientsList)}</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
