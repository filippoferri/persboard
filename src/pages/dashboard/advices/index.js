// next
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { m } from "framer-motion";
import { Box, Grid, Card, Container, Typography, IconButton } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
// firebase API
import { FIREBASE_API } from '../../../config-global';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import Iconify from '../../../components/iconify';
// sections
import {AdviceCard} from '../../../sections/@dashboard/advices/AdviceCard';
// import Link from 'next/link';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';

// import { varFade } from '../../../components/animate/variants';

// ----------------------------------------------------------------------
const variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 80,
            damping: 20,
        },
    },
};
// ----------------------------------------------------------------------

PageBoardrooms.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageBoardrooms() {
    const { themeStretch } = useSettingsContext();

    const router = useRouter();

    const handleClick = () => {
        router.push({ pathname: PATH_DASHBOARD.welcome });};

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const [myBoardrooms, setMyBoardrooms] = useState([]);

    // Get directors
    useEffect(() => {
        const myBoardroomsRef = collection(db, 'users', user && user.uid, 'myBoardrooms');
        const unsubscribemyBoardrooms = onSnapshot(myBoardroomsRef, (snapshot) => {
            const myBoardroomsData = [];
            snapshot.forEach((item) => {
                myBoardroomsData.push({ id: item.id, ...item.data() });
            });
            setMyBoardrooms(myBoardroomsData);
        });
        return () => {
            unsubscribemyBoardrooms();
        };
    }, [db, user]);

    // Delete director
    const handleDelete = async (boardroomId) => {
        console.log('Delete folder with id:', boardroomId);
        try {
        const boardroomRef = doc(collection(db, 'users', user.uid, 'myBoardrooms'), boardroomId);
        await deleteDoc(boardroomRef);
            console.log(`Folder with id ${boardroomId} has been deleted`);
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };

    return (  
    <>
        <Head>
            <title> Advices | Personal Board</title>
        </Head>

        <m.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >
        <Container maxWidth={themeStretch ? false : 'lg'}>
            <Box sx={{pl: 2}}>
                <CustomBreadcrumbs
                        heading="Advices"
                        links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Advices',
                            href: PATH_DASHBOARD.advices.root,
                        },
                    ]}
                />
            </Box>

            <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                }}
                >            
                <Card onClick={handleClick} 
                    sx={{ 
                            bgcolor: '#3366FF', 
                            '&:hover': {
                                bgcolor: 'primary.darker',
                            },
                            color: 'white', 
                            cursor:'pointer', 
                            minHeight: 270 
                        }}>
                    <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'bold', 
                            height: "100%"
                        }}>
                        
                        <IconButton
                            size="small"
                            color="success"
                            sx={{
                                p: 0,
                                mb: 2,
                                width: 60,
                                height: 60,
                                color: 'common.white',
                                bgcolor: 'primary.light',
                            }}
                            onClick={handleClick} 
                        >
                            <Iconify icon="eva:plus-fill" />
                        </IconButton>
                        <Typography variant="h5" paragraph>
                            New Advice
                        </Typography>
                    </Box>
                </Card>
                {myBoardrooms.length > 0 ? (
                    myBoardrooms.map((myBoardroom, index) => (
                        <AdviceCard 
                            key={index} 
                            myBoardroom={myBoardroom}
                            onDelete={() => handleDelete(myBoardroom.id)}
                        />
                    ))
                ) : (
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        sx={{ minHeight: 265, justifyContent:"center", alignItems:"center" }}
                        >
                        <Grid item xs={3} p={4}>
                            <Typography variant="body1" component="p" paragraph sx={{textAlign:"center"}}>Your Boardrooms created will appear here.</Typography>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Container>
        </m.div>
        </>
    );
}
