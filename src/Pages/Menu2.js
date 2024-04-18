import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import { CardMedia, Grid, Tooltip } from '@mui/material';
import { FaBookOpen, FaPlusCircle, FaTrash, FaPen } from 'react-icons/fa';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import palette from './theme/palette';
import typography from './theme/typhography';
import BoxTotal from '../components/atoms/boxtotal';
import CustomModal from '../components/atoms/Modal';
import MiniDrawer from '../components/Drawer';

export function Menu2() {
    const [flippedCardId, setFlippedCardId] = useState(null); // Track which card is flipped
    const [menuData, setMenuData] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const [hoveredIcons, setHoveredIcons] = useState({}); // Track hovered state for each card
    const [hover, setHover] = useState(false);
    const [selectedIconType, setSelectedIconType] = useState(null); // Track selected icon type ('edit' or 'delete')
    const [openModal, setOpenModal] = useState(false);
    const [selectedDishId, setSelectedDishId] = useState(null);

    const handleOpenModal = (id) => {
        // Check if the card is already flipped, and if so, do not flip it back
        if (flippedCardId === id) {
            setOpenModal(true); // Open the modal directly
        } else {
            setSelectedDishId(id); // Set the selected dish ID
            setOpenModal(true); // Open the modal
            setFlippedCardId(null); // Ensure the card is not flipped when opening the modal
        }
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleCardClick = (id) => {
        setFlippedCardId(id === flippedCardId ? null : id); // Flip the card if it's not already flipped, otherwise unflip it
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

    const handleIconHoverEdit = (id, isHovered, iconType) => {
        setHoveredIcons(prevState => ({
            ...prevState,
            [id]: isHovered,
        }));
        if (isHovered) {
            setSelectedIconType(iconType);
        } else {
            setSelectedIconType(null);
        }
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
                            <Link to="/addDish">
                                <Tooltip title="Add Dish" arrow>
                                    <button
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
                            </Link>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <BoxTotal title='Total Dishes'
                                icon={<FaBookOpen />}
                                total={menuData.length} />
                        </Box>
                    </Box>
                </Box>


                <Grid container spacing={2} sx={{ display: 'flex', pb: 2, pl: 5, pr: 10 }}>
                    {menuData.map((menuItem) => (
                        <Grid item key={menuItem.id} xs={12} sm={6} md={4} lg={4}>
                            <Card
                                onClick={() => handleCardClick(menuItem.id)}
                                sx={{
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.6s',
                                    height: 345,
                                    transform: flippedCardId === menuItem.id ? 'rotateY(180deg)' : 'rotateY(0deg)', // Apply rotation based on flippedCardId
                                    cursor: 'pointer',
                                    boxShadow: '2px 2px 5px 2px rgba(0, 0, 0, 0.25)',
                                    borderRadius: '10px',
                                    border: flippedCardId === menuItem.id ? '3px solid black' : '3px solid white',
                                    background: flippedCardId === menuItem.id ? 'white' : 'linear-gradient(0deg, #23ee48 0%, #bfffa1 30%)'
                                }}
                            >
                                <CardContent sx={{
                                    transform: flippedCardId === menuItem.id ? 'rotateY(180deg)' : 'rotateY(0deg)', // Apply rotation based on flippedCardId
                                }}>
                                    {!flippedCardId || flippedCardId !== menuItem.id ? (
                                        <>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 0.5 }}>
                                                <CustomModal open={openModal} onClose={handleCloseModal} selectedDish={menuData.find(item => item.id === selectedDishId)} />

                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleOpenModal(menuItem.id); // Call handleOpenModal to open the modal
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
                                                            color: hoveredIcons[menuItem.id] && selectedIconType === 'edit' ? '#12841D' : '#23ee48',
                                                            border: 'none',
                                                            background: 'none',
                                                        }}
                                                    />
                                                </button>
                                                <button
                                                    onClick={(event) => {
                                                        event.stopPropagation(); // Stop propagation to parent card
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
                                                    mb: 2,
                                                }} gutterBottom>
                                                    Ingredients
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
                    ))}
                </Grid>
            </Box>
        </>
    );
}
