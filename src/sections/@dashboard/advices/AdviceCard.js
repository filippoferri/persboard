// 
import { useState } from 'react';
import PropTypes from 'prop-types';
// import { paramCase } from 'change-case';
import { m } from "framer-motion";
// @mui
import { Box, Card, Typography, IconButton, Button } from '@mui/material';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
// import { useSnackbar } from '../../../components/snackbar';
// import { textAlign } from '@mui/system';
//
// import { varFade } from '../../../components/animate/variants';

// ----------------------------------------------------------------------

const variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,

        transition: {
            type: 'spring',
            stiffness: 80,
            damping: 20,
        },
    },
};

// ----------------------------------------------------------------------

AdviceCard.propTypes = {
    myBoardroom: PropTypes.object,
    onDelete: PropTypes.func,
};

export function AdviceCard({myBoardroom, onDelete}) {

    // const { enqueueSnackbar } = useSnackbar();

    const [openConfirm, setOpenConfirm] = useState(false);

    const router = useRouter();

    const aid = myBoardroom.id;
    const linkTo = PATH_DASHBOARD.advices.view(aid);

    const timestamp = myBoardroom.dateAdd;
    const date = timestamp ? timestamp.toDate() : null;
    const dateString = date ? `${date.toLocaleDateString()}` : '';

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    return (
        <>
        <m.div 
            initial="hidden"
            animate="visible"
            variants={variants}>
            <Card sx={{cursor: "pointer"}}>
                <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
                    <Box 
                        sx={{
                            pt:1,
                            pr:2, 
                            display: "flex", 
                            flex: "1", 
                            flexDirection:"row", 
                            alignItems:"center",
                            justifyContent: "flex-end"
                        }}>
                            <IconButton 
                                color= 'default' 
                                onClick={() => {
                                    handleOpenConfirm();
                                }}>
                                <Iconify icon="eva:trash-2-outline" />
                            </IconButton>
                    </Box>
                    <Box 
                        sx={{ display: "flex", flexDirection: "column", height: "100%", p:4, pt: 2 }}
                        onClick={() => router.push(linkTo)}
                    >
                        <Typography variant='caption'sx={{mb: 1}}>{dateString}</Typography>
                        <Typography variant='body1'>{myBoardroom?.question}</Typography>
                    </Box>
                    <Box 
                        sx={{ display: "flex", alignItems: "center", p:4 }}
                        onClick={() => router.push(linkTo)}
                        >
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
        </m.div>

        <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content="Are you sure want to delete?"
            action={
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={onDelete}
                >
                    Delete
                </Button>
            }
        />
        </>
    );

}