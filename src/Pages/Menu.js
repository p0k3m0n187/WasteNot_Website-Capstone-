import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Alert, CardMedia, Grid, Snackbar, Tooltip } from '@mui/material';
import { FaBookOpen, FaPlusCircle, FaTrash, FaPen } from 'react-icons/fa';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import palette from './theme/palette';
import typography from './theme/typhography';
import BoxTotal from '../components/atoms/boxtotal';
import MiniDrawer from '../components/Drawer';
import { AddEditDishModal } from '../components/atoms/AddEditDishModal';

export function Menu() {
    const [flippedCardId, setFlippedCardId] = useState(null); // Track which card is flipped
    const [menuData, setMenuData] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const [hoveredIcons, setHoveredIcons] = useState({}); // Track hovered state for each card
    const [hover, setHover] = useState(false);
    const [selectedIconType, setSelectedIconType] = useState(null); // Track selected icon type ('edit' or 'delete')
    const [openModal, setOpenModal] = useState(false);
    const [selectedDishId, setSelectedDishId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessageSuccess, setSnackbarMessageSuccess] = useState('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleOpenModal = (id) => {
        if (flippedCardId === id) {
            setOpenModal(true);
        } else {
            setSelectedDishId(id);
            setOpenModal(true);
            setFlippedCardId(null);
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleCardClick = (id, event) => {
        event.stopPropagation();
        setFlippedCardId(id === flippedCardId ? null : id);
    };

    const handleAddDishModal = () => {
        setSelectedDishId(null);
        setOpenModal(true);
    };

    const fetchMenuData = useCallback(async () => {
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
    }, [user]);

    useEffect(() => {
        fetchMenuData();
    }, [fetchMenuData]);

    const handleDelete = async (docId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this dish?");
        if (!confirmDelete) return;
        try {
            await deleteDoc(doc(db, 'menu_dish', docId));
            setMenuData((prevMenuData) => prevMenuData.filter((item) => item.id !== docId));
            setSnackbarMessageSuccess("Dish Deleted Successfully");
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };

    const handleIconHoverEdit = (id, isHovered, iconType) => {
        setHoveredIcons(prevState => ({ ...prevState, [id]: isHovered }));
        if (isHovered) setSelectedIconType(iconType);
        else setSelectedIconType(null);
    };

    return (
        <>
            <MiniDrawer />
            <Box sx={{ ml: 12, p: 2 }}>
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
                            Menu
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Tooltip title="Add Dish" arrow>
                                <button
                                    onClick={handleAddDishModal}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                >
                                    <FaPlusCircle
                                        style={{
                                            fontSize: '50px',
                                            color: hover ? '#12841D' : palette.primary.main,
                                            boxShadow: '2px 8px 5px rgba(0, 0, 0, 0.52)',
                                            border: hover ? '2px solid white' : '2px solid #12841D ',
                                            borderRadius: '50%',
                                        }}
                                    />
                                </button>
                            </Tooltip>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <BoxTotal title='Total Dishes' icon={<FaBookOpen />} total={menuData.length} />
                        </Box>
                    </Box>
                </Box>
                <AddEditDishModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    editMode={selectedDishId !== null}
                    dishToEdit={menuData.find(item => item.id === selectedDishId)}
                    fetchMenu={fetchMenuData}
                />
                <Grid container spacing={2} sx={{ display: 'flex', pb: 2, pl: 5, pr: 10 }}>
                    {menuData.length === 0 ? (
                        <Typography variant="h6" alignItems="center" align='center' color="textSecondary">
                            Seems like the menu is empty
                        </Typography>
                    ) : (
                        menuData.map((menuItem) => (
                            <Grid item key={menuItem.id} xs={12} sm={6} md={4} lg={4}>
                                <Card
                                    onClick={(event) => handleCardClick(menuItem.id, event)}
                                    sx={{
                                        transformStyle: 'preserve-3d',
                                        transition: 'transform 0.6s',
                                        height: 345,
                                        transform: flippedCardId === menuItem.id ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        cursor: 'pointer',
                                        boxShadow: '2px 2px 5px 2px rgba(0, 0, 0, 0.25)',
                                        borderRadius: '10px',
                                        border: flippedCardId === menuItem.id ? '3px solid black' : '3px solid white',
                                        background: flippedCardId === menuItem.id ? 'white' : 'linear-gradient(0deg, #03C04A 0%, #7CF072 30%)'
                                    }}
                                >
                                    <CardContent sx={{
                                        transform: flippedCardId === menuItem.id ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    }}>
                                        {!flippedCardId || flippedCardId !== menuItem.id ? (
                                            <>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 0.5 }}>
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleOpenModal(menuItem.id);
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: '1.2rem',
                                                            color: palette.error.main,
                                                        }}
                                                        onMouseEnter={() => handleIconHoverEdit(menuItem.id, true, 'edit')}
                                                        onMouseLeave={() => handleIconHoverEdit(menuItem.id, false, 'edit')}
                                                    >
                                                        <FaPen
                                                            style={{
                                                                color: hoveredIcons[menuItem.id] && selectedIconType === 'edit' ? '#034D0B' : '#047719',
                                                                border: 'none',
                                                                background: 'none',
                                                            }}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleDelete(menuItem.id);
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: '1.2rem',
                                                            color: palette.error.main,
                                                        }}
                                                        onMouseEnter={() => handleIconHoverEdit(menuItem.id, true, 'delete')}
                                                        onMouseLeave={() => handleIconHoverEdit(menuItem.id, false, 'delete')}
                                                    >
                                                        <FaTrash
                                                            style={{
                                                                color: hoveredIcons[menuItem.id] && selectedIconType === 'delete' ? '#AE0A0A' : '#FF6262',
                                                                border: 'none',
                                                                background: 'none',
                                                            }}
                                                        />
                                                    </button>
                                                </Box>
                                                <CardMedia
                                                    component="img"
                                                    height="150"
                                                    src={menuItem.imageUrl}
                                                    alt="dish"
                                                    sx={{
                                                        border: '2px solid white',
                                                        borderRadius: '10px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <Typography sx={{
                                                    fontSize: typography.h5.fontSize,
                                                    fontWeight: typography.h1.fontWeight,
                                                    fontFamily: typography.h1.fontFamily,
                                                    color: palette.plain.main,
                                                    WebkitTextStroke: '1px #073A16',
                                                    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                                                    textTransform: 'uppercase',
                                                }} gutterBottom>
                                                    {menuItem.dishName}
                                                </Typography>
                                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {menuItem.dishDescription}
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Box sx={{ p: 2 }}>
                                                    <Typography sx={{
                                                        fontSize: typography.h6.fontSize,
                                                        fontWeight: typography.h1.fontWeight,
                                                        fontFamily: typography.h1.fontFamily,
                                                        color: palette.plain.main,
                                                        WebkitTextStroke: '1px #073A16',
                                                        textShadow: '2px 2px 2px rgba(0, 0, 0, 0.52)',
                                                        textTransform: 'uppercase',
                                                        mb: 1,
                                                    }} gutterBottom>
                                                        Ingredients
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Category: {menuItem.dishCategory.toUpperCase()}
                                                    </Typography>
                                                    {Array.isArray(menuItem.ingredientsList) && menuItem.ingredientsList.length > 0 ? (
                                                        <ul>
                                                            {menuItem.ingredientsList.map((item, index) => (
                                                                <li key={index}>
                                                                    {`${item.ingredients}: ${item.grams} grams`}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : null}
                                                </Box>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessageSuccess}
                </Alert>
            </Snackbar>
        </>
    );
}
