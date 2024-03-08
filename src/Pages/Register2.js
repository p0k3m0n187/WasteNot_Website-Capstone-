import React from 'react'
import {
    // Container,
    Box,
    Button,
    Grid,
} from '@mui/material';
// import Typography from '@mui/material/Typography';
import Navbar from '../components/Navbar';
import PageTitle from './Design/pagetitle';
import ColoredButton from '../Pages/atoms/Button.js';
import StyledTextField from './atoms/TextField.js';


export const Register2 = () => {
    return (
        <>
            <Navbar />
            <Box sx={{ p: 2, mb: 4, width: '100%', }}>
                <PageTitle title="Registration" />
                <Box sx={{ p: 4, mt: 1 }}>
                    <Box width={'100%'} >
                        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="Restaurant Name" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="Restaurant Permit" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="Email" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="First Name" borderColor="#00FF00" borderWidth="2px" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="First Name" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="First Name" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="First Name" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="First Name" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="First Name" />
                            </Grid>
                            <Grid item xs={5} sm={6}>
                                <StyledTextField label="First Name" />
                            </Grid>
                            {/* // {...register('first_name')}
                                // error={errors && errors.first_name ? true : false}
                                // helperText={errors ? errors?.first_name?.message : null} */}
                        </Grid>
                        <Box sx={{ justifyContent: 'space-between' }}>
                            <Button variant='contained'>Hello powaszcs</Button>
                            <ColoredButton colorKey="primary" label="Primary Button" hoverColor="#336699" />
                        </Box>
                    </Box>
                </Box>
            </Box >
        </>
    )
};