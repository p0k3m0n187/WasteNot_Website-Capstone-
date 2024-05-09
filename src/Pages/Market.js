import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { FaWarehouse } from 'react-icons/fa';
import MiniDrawer from "../components/Drawer";
import BoxTotal from "../components/atoms/boxtotal";
import { Avatar, Box, Typography } from "@mui/material";
import typography from "./theme/typhography";
import palette from "./theme/palette";
import SampleImage from './../images/deanprofile.jpg'
import { alignProperty } from '@mui/material/styles/cssUtils';

export const Market = () => {
    const [saleItems, setSaleItems] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10); // Initial page size
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchSaleItems = async () => {
            try {
                const saleItemsSnapshot = await getDocs(collection(db, 'sale_items'));
                const saleItemsData = saleItemsSnapshot.docs
                    .filter(doc => doc.data().Restaurant_Id === user?.uid)
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                setSaleItems(saleItemsData);
            } catch (error) {
                console.error('Error fetching sale items:', error);
            }
        };

        fetchSaleItems();
    }, [user]);

    const columns = [
        {
            width: 250,
            headerAlign: 'center',
            alignItems: 'right',
            renderCell: () => (
                <Avatar
                    src={SampleImage}
                    alt={SampleImage}
                    style={{ width: '3rem', height: '3rem' }}
                />
            ),
        },
        { field: 'Item_name', headerName: 'Name', width: 300 },
        { field: 'Price', headerName: 'Price', width: 300 },
        { field: 'Quantity', headerName: 'Total Grams', width: 300 },
    ];

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
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
                            Market
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <BoxTotal title='Total Items'
                            icon={<FaWarehouse />}
                            total={saleItems.length} />
                    </Box>
                </Box>
                <div style={{ height: 350, width: '100%' }}>
                    {saleItems.length === 0 ? (
                        <Typography variant="h6" align="center" color="textSecondary">
                            Seems like the Market is empty
                        </Typography>
                    ) : (
                        <div style={{ height: 350, width: '100%' }}>
                            <DataGrid
                                rows={saleItems.slice(page * pageSize, page * pageSize + pageSize)}
                                columns={columns}
                                pagination
                                pageSize={pageSize}
                                rowCount={saleItems.length}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                pageSizeOptions={[10, 25]}
                            />
                        </div>
                    )}
                </div>
            </Box>
        </>
    );
};