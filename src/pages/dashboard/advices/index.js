// next
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { CustomBreadcrumbs, Box, Grid, Card, Stack, Avatar, Divider, Container, Typography, colors, IconButton } from '@mui/material';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../config-global';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import Iconify from '../../../components/iconify';
// sections
import {AdviceCard} from '../../../sections/@dashboard/advices/adviceCard';

// ----------------------------------------------------------------------

PageBoardrooms.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageBoardrooms() {
    const { themeStretch } = useSettingsContext();

    const router = useRouter();

    const handleClick = () => {
        router.push({ pathname: PATH_DASHBOARD.projects.newProject });};

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const [myBoardrooms, setMyBoardrooms] = useState([]);

    // Get directors
    useEffect(() => {
        const myBoardroomsRef = collection(db, 'users', user && user.uid, 'myBoardrooms');
        const unsubscribemyBoardrooms = onSnapshot(myBoardroomsRef, (snapshot) => {
            const myBoardroomsData = [];
            snapshot.forEach((doc) => {
                myBoardroomsData.push({ id: doc.id, ...doc.data() });
            });
            setMyBoardrooms(myBoardroomsData);
        });
        return () => {
            unsubscribemyBoardrooms();
        };
    }, [db, user]);

    console.log(myBoardrooms);

    // Delete director
    // const handleDelete = async (directorId) => {
    //     try {
    //         const directorRef = doc(db, 'directors', directorId);
    //         const myDirectorRef = doc(db, 'users', user.uid, 'myDirectors', directorId);
    //         await deleteDoc(directorRef);
    //         await deleteDoc(myDirectorRef);
    //     } catch (error) {
    //         console.error(error);
    //     }
    //     };

    return (  
    <>
        <Head>
            <title> Advices | Personal Board</title>
        </Head>

        <Container maxWidth={themeStretch ? false : 'lg'}>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    mt: 2,
                    mb: 4,
                }}
            >
                <Box sx={{ flexGrow: 1, pl: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Advices
                    </Typography>
                </Box>
            </Stack>

            <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                }}
                >            
                <Card onClick={handleClick} sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', bgcolor: '#3366FF', color: 'white', cursor:'pointer', minHeight: 200 }}>
                    <Box sx={{justifyContent: 'center', mt: '26%', fontWeight: 'bold'}}>
                        
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
                            '&:hover': {
                                bgcolor: 'primary.darker',
                            },
                            }}
                        >
                            <Iconify icon="eva:plus-fill" />
                        </IconButton>
                        <Typography variant="h5" paragraph>
                            New Boardroom
                        </Typography>
                    </Box>
                </Card>
                {myBoardrooms.length > 0 ? (
                    myBoardrooms.map((myBoardroom, index) => (
                        <AdviceCard key={index} myBoardroom={myBoardroom} />
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
        </>
    );
}
