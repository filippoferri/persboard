// next
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { CustomBreadcrumbs, Box, Grid, Card, Avatar, Divider, Container, Typography, colors, IconButton } from '@mui/material';
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
import {DirectorCard} from '../../../sections/@dashboard/directors/DirectorCard';

// ----------------------------------------------------------------------

PageDirectors.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageDirectors() {
    const { themeStretch } = useSettingsContext();

    const router = useRouter();

    const handleClick = () => {
    router.push({ pathname: PATH_DASHBOARD.directors.newDirector});};

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const [directors, setDirectors] = useState([]);
    const [myDirectors, setMyDirectors] = useState([]);

    // Get directors
    useEffect(() => {
        const directorsRef = collection(db, 'directors');
        const myDirectorsRef = collection(db, 'users', user && user.uid, 'myDirectors');
        const unsubscribeDirectors = onSnapshot(directorsRef, (snapshot) => {
            const directorsData = [];
            snapshot.forEach((doc) => {
            directorsData.push({ id: doc.id, ...doc.data() });
            });
            setDirectors(directorsData);
        });
        const unsubscribeMyDirectors = onSnapshot(myDirectorsRef, (snapshot) => {
            const myDirectorsData = [];
            snapshot.forEach((doc) => {
            myDirectorsData.push({ id: doc.id, ...doc.data() });
            });
            setMyDirectors(myDirectorsData);
        });
        return () => {
            unsubscribeDirectors();
            unsubscribeMyDirectors();
        };
        }, [db, user]);

    return (  
    <>
        <Head>
            <title> AI Directors | Personal Board</title>
        </Head>

        <Container maxWidth={themeStretch ? false : 'xl'} sx={{ mb: 6 }}>
            <Typography variant="h3" component="h1" paragraph>
                Personal AI Directors
            </Typography>

            <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                }}
                >            
                <Card onClick={handleClick} sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', bgcolor: '#3366FF', color: 'white', cursor:'pointer' }}>
                    <Box sx={{justifyContent: 'center', mt: '24%', fontWeight: 'bold'}}>
                        
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
                            Add AI Director
                        </Typography>
                    </Box>
                </Card>
                {myDirectors.length > 0 ? (
                    myDirectors.map((myDirector) => (
                        <DirectorCard key={myDirector.id} director={myDirector} />
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
                            <Typography variant="body1" component="p" paragraph sx={{textAlign:"center"}}>Your Personal Directors created will appear here.</Typography>

                        </Grid>
                    </Grid>
                )}
            </Box>
        </Container>
        <Container maxWidth={themeStretch ? false : 'xl'}>
            <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                }}
                >
                {directors.length > 0 ? (
                    directors.map((director) => (
                        <DirectorCard key={director.id} director={director} />
                    ))
                ) : (
                    <Typography variant="h5" component="h1" paragraph>Any AI Directors created will appear here.</Typography>
                )}
            </Box>
            <Box sx={{justifyContent: 'center', mt: '30%', fontWeight: 'bold'}}></Box>
        </Container>
        </>
    );
}
