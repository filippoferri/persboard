import React, { useState } from 'react';

import { Box, Link, Typography } from '@mui/material';

// sections
import WhatsNewDrawer from './WhatsNewDrawer';

export default function WhatsNew() {

    const [openNews, setOpenNews] = useState(false);

    const handleOpenNews = () => {
        setOpenNews(true);
    }; 

    const handleCloseNews = () => {
        setOpenNews(false);
    };


    return (
        <>
        <Box sx={{color: 'black', mr: 2, cursor: "pointer"}} onClick={handleOpenNews}>
            <Typography sx={{ color: "primary-main" }}>What’s New?</Typography>
        </Box>

        <WhatsNewDrawer
            open={openNews}
            onClose={handleCloseNews}
        />
        </>
    );
}