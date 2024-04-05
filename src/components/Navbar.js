// import { Link } from "react-router-dom";
// import image from "../images/logo.png";
// import "../Pages/Design/navbar.css";

// export default function Navbar() {
//     return <nav className="navbar">
//         <a href="/" className="site-title"><img src={image} alt="NavBar logo"/>WasteNot</a>
//         <ul>
//             <li>
//             <Link to="/aboutus"><button type="button" className="aboutus">About Us</button></Link>
//             </li>
//         </ul> 
//     </nav>
// }

import * as React from 'react';
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import palette from '../Pages/theme/palette'
import typography from '../Pages/theme/typhography';
import { Avatar } from '@mui/material';
import Logo from '../images/dota2.png'

export default function Navbar({ children }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: palette.primary.main, borderBottom: '2px solid white', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.50)' }}>
                <Toolbar>
                    <Link to="/login">
                        <Avatar
                            alt="WasteNot Logo"
                            src={Logo}
                            sx={{
                                width: 50,
                                height: 50,
                                mr: 1,
                                border: '1px solid white' // Adding white border
                            }}
                        />
                    </Link>
                    <Typography
                        variant="h1"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontSize: typography.h1.fontSize,
                            fontWeight: typography.h1.fontWeight,
                            fontFamily: typography.h1.fontFamily,
                            WebkitTextStroke: '1px #073A16',
                        }}>
                        WASTENOT
                    </Typography>
                    <Link to="/aboutus">
                        <Button sx={{ color: palette.plain.main }}>About Us</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
}
