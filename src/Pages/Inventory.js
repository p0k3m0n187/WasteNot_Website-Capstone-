import React, { useEffect, useState } from "react";
import "firebase/firestore";
import { db } from '../config/firebase';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaWarehouse, FaArrowCircleDown } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
// import ingredient from "../images/Ingredients.png";
import MiniDrawer from "../components/Drawer";
import { Box, Button, Typography } from "@mui/material";
import typography from "./theme/typhography";
import palette from "./theme/palette";
import BoxTotal from "../components/atoms/boxtotal";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Typography as MuiTypography } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const Inventory = () => {
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
                console.log('Fetching history for ItemId:', selectedItem.id);
                const historyQuery = query(
                    collection(db, 'ingredients_history'),
                    where('ItemId', '==', selectedItem.id)
                );
                try {
                    const historySnapshot = await getDocs(historyQuery);
                    const historyList = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log('History List:', historyList);
                    setInventoryHistory(historyList);
                } catch (error) {
                    console.error('Error fetching inventory history: ', error);
                }
            }
        };

        fetchInventoryHistory();
    }, [selectedItem]);


    const openPopup = (item) => {
        setSelectedItem(item);
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

            await deleteDoc(doc(db, 'ingredients_history', selectedHistoryItem.id));

            console.log('Ingredients history item deleted successfully.');
            window.alert("Inventory Item added to the Market Successfully");

            closePopup();
        } catch (error) {
            console.error('Error handling confirmation: ', error);
        }
    };

    const CollapsibleTableRow = ({ item }) => {
        const [open, setOpen] = useState(false);
        const [itemHistory, setItemHistory] = useState([]);

        const handleExpandClick = async () => {
            setOpen(!open);

            if (!open) {
                try {
                    const historyQuery = query(
                        collection(db, 'ingredients_history'),
                        where('ItemId', '==', item.ItemId)
                    );
                    const historySnapshot = await getDocs(historyQuery);
                    const historyList = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setItemHistory(historyList);
                } catch (error) {
                    console.error('Error fetching item history: ', error);
                }
            }
        };

        return (
            <>
                <TableRow key={item.id}>
                    <TableCell>{item.Item_name}</TableCell>
                    <TableCell>{item.quantity_left}/{item.total_quantity}</TableCell>
                    <TableCell align="right">
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={handleExpandClick}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1, backgroundColor: 'red' }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    History
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead sx={{ backgroundColor: 'orange' }}>
                                        <TableRow>
                                            <TableCell>Date Added</TableCell>
                                            <TableCell>Expiration Date</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {itemHistory.map((historyItem) => (
                                            <TableRow key={historyItem.ItemId}>
                                                <TableCell>{historyItem.Date_added}</TableCell>
                                                <TableCell>{historyItem.Expiry_date}</TableCell>
                                                <TableCell>{historyItem.item_quantity}</TableCell>
                                                <TableCell>
                                                    <Button>AddToMarket</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };



    return (
        <>
            <MiniDrawer />
            <Box sx={{ ml: 10, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '7rem', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'start' }}>
                        <Typography sx={{
                            fontSize: typography.h7.fontSize,
                            fontWeight: typography.h1.fontWeight,
                            fontFamily: typography.h1.fontFamily,
                            color: palette.plain.main,
                            WebkitTextStroke: '1.5px #12841D',
                            textShadow: '2px 8px 5px rgba(106, 217, 117, 0.52)',
                            textTransform: 'uppercase',
                        }} gutterBottom>
                            Inventory
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <BoxTotal title='Total Items'
                            icon={<FaWarehouse />}
                            total={ingredients.length} />
                    </Box>
                </Box>
                <TableContainer sx={{ width: '100%', height: 360, border: '1px solid black', borderRadius: 1 }}>
                    <Table>
                        <TableHead
                            sx={{
                                border: '2px solid white',
                                backgroundColor: palette.primary.main,
                            }}>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Quantity / Total</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody
                            sx={{ backgroundColor: '#CECECE' }}
                        >
                            {ingredients.map((item) => (
                                <CollapsibleTableRow
                                    key={item.id}
                                    item={item}
                                    inventoryHistory={inventoryHistory.filter(historyItem => historyItem.ItemId === item.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default Inventory;
