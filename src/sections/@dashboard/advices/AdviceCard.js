// 
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, Avatar, Divider, Typography, Stack, IconButton, Fab } from '@mui/material';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

AdviceCard.propTypes = {
    myBoardroom: PropTypes.object,
};

export function AdviceCard({myBoardroom}) {

    const router = useRouter();
    const handleClick = () => {
        router.push({ pathname: PATH_DASHBOARD.advices.boardroom });};

    return (
        <>
        <Card onClick={handleClick} sx={{cursor: "pointer"}}>
            <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
                <Box sx={{p:4, display: "flex", flex: "1"}}>
                    <Typography variant='body1'>{myBoardroom?.question}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", p:4 }}>
                    <Typography variant='caption' sx={{mr: 1}}>Personal Board</Typography> 
                    {myBoardroom.directors.length > 0 ? (
                    myBoardroom.directors.map((director, index) => (
                        <Box 
                            sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                display: 'inline-block',
                                ml: index > 0 ? -1 : 0,
                                border: '2px solid white',
                                zIndex: index
                            }} />
                    ))
                    ) : (
                        <Typography>No Directors</Typography>
                    )}
                </Box>
            </Box>
        </Card>
        </>
    );

}