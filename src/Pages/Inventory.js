import React, { useEffect, useState } from "react";
import "firebase/firestore";
import Sidebar from '../components/Sidebar';
import Navbar2 from '../components/NavBar2';
import './Design/inventdesign.css';
import { db } from '../config/firebase';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaWarehouse, FaArrowCircleDown } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import ingredient from "../images/Ingredients.png";


export const Inventory = (props) => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [inventoryHistory, setInventoryHistory] = useState([]);
    const [priceInput, setPriceInput] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const MAX_QUANTITY = 100; // Replace 100 with your actual maximum quantity

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                const inventoryCollection = collection(db, 'inventory');
                const inventorySnapshot = await getDocs(inventoryCollection);
                const inventoryList = inventorySnapshot.docs
                    .filter(doc => doc.data().Restaurant_id === user?.uid)
                    .map(doc => ({ id: doc.id, ...doc.data() }));

                setIngredients(inventoryList);
            } catch (error) {
                console.error('Error fetching inventory data: ', error);
            }
        };

        fetchInventoryData();
    }, [user]);

    useEffect(() => {
        const fetchInventoryHistory = async () => {
            if (selectedItem) {
                const historyQuery = query(
                    collection(db, 'ingredients_history'),
                    where('ItemId', '==', selectedItem.ItemId)
                );
                const historySnapshot = await getDocs(historyQuery);
                const historyList = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setInventoryHistory(historyList);
            }
        };

        fetchInventoryHistory();
    }, [selectedItem]);

    const openPopup = (item) => {
        setSelectedItem(item);
        // setShowConfirmation(true);
    };

    const closePopup = () => {
        setSelectedItem(null);
        setPriceInput('');
        setShowConfirmation(false);
    };

    const handleConfirm = async () => {
        try {
            const quantityValue = parseInt(priceInput, 10);

            if (isNaN(quantityValue) || quantityValue <= 0) {
                console.error('Invalid Quantity value');
                return;
            }

            // Ensure that selectedHistoryItem is defined
            if (!selectedItem || inventoryHistory.length === 0) {
                console.error('Selected item or history is undefined');
                return;
            }

            const selectedHistoryItem = inventoryHistory[0];

            const saleItemData = {
                Item_name: selectedItem.Item_name,
                Price: quantityValue,
                Quantity: selectedHistoryItem.item_quantity,
                ItemId: selectedItem.ItemId,
                Restaurant_Id: user?.uid,
            };

            const saleItemDocRef = await addDoc(collection(db, 'sale_items'), saleItemData);

            console.log('Sale item added with ID: ', saleItemDocRef.id);

            // Delete the document from 'ingredients_history'
            await deleteDoc(doc(db, 'ingredients_history', selectedHistoryItem.id));

            console.log('Ingredients history item deleted successfully.');
            window.alert("Inventory Item added to the Market Successfully");

            closePopup();
        } catch (error) {
            console.error('Error handling confirmation: ', error);
        }
    };



    return (
        <>
            <Navbar2 />
            <Sidebar />
            <div className="inventory-cont">
                <div className='invent-title'>
                    <h1>Ingredients</h1>
                </div>

                <div className='total-invent'>
                    <h2>Total Ingredient</h2>
                    <br />
                    <FaWarehouse />
                    <h1>{ingredients.length}</h1>
                </div>

                <div className='stock-title'><h1>Stocks</h1></div>

                <div className='scrollable-cont'>
                    {ingredients.map((item) => (
                        <div key={item.id} className='ingredient'>
                            <img className='ingred-sample' src={ingredient} alt="ingredient" />
                            <h2>{item.Item_name}</h2>
                            <div className="percent-bar">
                                <div
                                    className='percent-bar-fill'
                                    style={{ width: `${(item.quantity / MAX_QUANTITY) * 100}%` }}
                                ></div>
                            </div>
                            <button className="open-popup" onClick={() => openPopup(item)}>
                                <FaArrowCircleDown />
                            </button>
                        </div>
                    ))}
                </div>

                {selectedItem && (
                    <>
                        <div className="backdrop" onClick={closePopup}></div>
                        <div className="popup-inventory" id="myPopup">
                            <span className="close" onClick={closePopup}>&times;</span>
                            <div className='scrollable-approval'>
                                <table className='table-market'>
                                    <thead>
                                        <tr>
                                            <th>Date Added</th>
                                            <th>Expiration Date</th>
                                            <th><div className='Total'>Total</div></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryHistory.map((historyItem) => (
                                            <tr key={historyItem.id}>
                                                <td><h3>{historyItem.Date_added}</h3></td>
                                                <td><h3>{historyItem.Expiry_date}</h3></td>
                                                <td><div className='Total'><h3>{historyItem.item_quantity}</h3></div></td>
                                                <td className='bttns'>
                                                    <button className='bttn-addtomarket' onClick={() => setShowConfirmation(true)}>
                                                        Add to Market
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {selectedItem && showConfirmation && (
                                    <div className="popup-confirmation">
                                        <span className="close" onClick={closePopup}>&times;</span>
                                        <div>
                                            <label htmlFor="priceInput">Enter the price:</label>
                                            <input
                                                type="number"
                                                id="priceInput"
                                                value={priceInput}
                                                onChange={(e) => setPriceInput(e.target.value)}
                                            />
                                            <button onClick={handleConfirm}>Confirm</button>
                                            <button style={{ backgroundColor: '#f83535', color: '#ffffff', marginLeft: "1vw" }} onClick={closePopup}>Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Inventory;
