// next
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Grid, Card, Stack, Avatar, Divider, Container, Typography, colors, IconButton } from '@mui/material';
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
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';


import { m } from "framer-motion";
import { varFade } from '../../../components/animate/variants';

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

    // Delete director
    const handleDelete = async (directorId) => {
        try {
            const myDirectorRef = doc(db, 'users', user.uid, 'myDirectors', directorId);
            await deleteDoc(myDirectorRef);
        } catch (error) {
            console.error(error);
        }
    };

    return (  
    <>
        <Head>
            <title>AI Directors | Personal Board</title>
        </Head>

        <m.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >
            <Container maxWidth={themeStretch ? false : 'lg'} sx={{mb: 6}}>
                <Box sx={{pl: 2}}>
                    <CustomBreadcrumbs
                        heading="AI Directors"
                        links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'AI Directors',
                            href: PATH_DASHBOARD.directors.root,
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
                    <Card 
                        onClick={handleClick} 
                        sx={{ 
                            textAlign: 'center', 
                            bgcolor: '#3366FF', 
                            '&:hover': {
                                bgcolor: 'primary.darker',
                            },
                            color: 'white', 
                            cursor:'pointer'
                            }}>
                        <Box 
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                fontWeight: 'bold'
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
                                Add Your <br /> Personal Director
                            </Typography>
                        </Box>
                    </Card>
                    {myDirectors.length > 0 ? (
                        myDirectors.map((myDirector) => (
                            <DirectorCard key={myDirector.id} director={myDirector} onDelete={() => handleDelete(myDirector.id)} />
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

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Box xs={12} sx={{ pl:2 }}>
                    <Typography variant="h5" sx={{ mb: 2}} >
                        Premium Directors
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
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
                    {directors.length > 0 ? (
                        directors.map((director) => (
                            <DirectorCard key={director.id} director={director} onDelete={() => handleDelete(director.id)}
                            />
                        ))
                    ) : (
                        <Typography variant="h5" component="h1" paragraph>Any Personal Directors created will appear here.</Typography>
                    )}
                </Box>
            </Container>
        </m.div>
        </>
    );
}
