// next
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { m } from "framer-motion";
import { Box, Card, Divider, Container, Typography, IconButton, Skeleton } from '@mui/material';
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
import { useSnackbar } from '../../../components/snackbar';

// sections
import {DirectorCard} from '../../../sections/@dashboard/directors/DirectorCard';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';

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
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = () => {
        router.push({ pathname: PATH_DASHBOARD.directors.newDirector});
    };

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const [directors, setDirectors] = useState([]);
    const [myDirectors, setMyDirectors] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // Get directors
    useEffect(() => {
        setIsLoading(true);
        const directorsRef = collection(db, 'directors');
        const myDirectorsRef = collection(db, 'users', user && user.uid, 'myDirectors');
        const unsubscribeDirectors = onSnapshot(directorsRef, (snapshot) => {
            const directorsData = [];
            snapshot.forEach((item) => {
                directorsData.push({ id: item.id, ...item.data() });
            });
            setDirectors(directorsData);
            setIsLoading(false);
        });
        const unsubscribeMyDirectors = onSnapshot(myDirectorsRef, (snapshot) => {
            const myDirectorsData = [];
            snapshot.forEach((item) => {
            myDirectorsData.push({ id: item.id, ...item.data() });
            });
            setMyDirectors(myDirectorsData);
            setIsLoading(false);
        });
        return () => {
            unsubscribeDirectors();
            unsubscribeMyDirectors();
            setIsLoading(false);
        };
        }, [db, user]);

    // Delete director
    const handleDelete = async (directorId) => {
        try {
            const myDirectorRef = doc(db, 'users', user.uid, 'myDirectors', directorId);
            await deleteDoc(myDirectorRef);
            enqueueSnackbar('Director removed!');
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
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)',
                    }}
                    >            
                    <Card 
                        onClick={handleClick} 
                        sx={{ 
                            display: 'flex',
                            textAlign: 'center', 
                            height: 180,
                            bgcolor: 'primary.main', 
                            '&:hover': {
                                bgcolor: 'primary.darker',
                            },
                            color: 'white', 
                            cursor:'pointer',
                            alignItems: 'center',
                            justifyContent: 'center',
                            }}>
                        <Box 
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold'
                                }}>
                            
                            <IconButton
                                size="small"
                                color="success"
                                sx={{
                                    p: 0,
                                    mb: 1,
                                    width: 60,
                                    height: 60,
                                    color: 'common.white',
                                    bgcolor: 'primary.light',
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                    },
                                }}
                                onClick={handleClick} 
                            >
                                <Iconify icon="eva:plus-fill" />
                            </IconButton>
                            <Typography variant="h6">
                                Add Your <br /> Personal Director
                            </Typography>
                        </Box>
                    </Card>
                    {isLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 1 }} />
                    ) : null}
                    {myDirectors.length > 0 && (
                        myDirectors.map((myDirector) => (
                            <DirectorCard key={myDirector.id} director={myDirector} onDelete={() => handleDelete(myDirector.id)} isList />
                        ))
                    )}
                    {!isLoading && directors.length === 0 && (
                        <Typography variant="h5" component="body1" paragraph>
                            Your Personal Directors created will appear here.
                        </Typography>
                    )}
                </Box>
            </Container>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Box xs={12} sx={{ pl:2 }}>
                    <Typography variant="h5" sx={{ mb: 2}} >
                        AI Directors
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                </Box>
                <Box
                    gap={3}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)',
                    }}
                    >
                    {isLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={180} />
                    ) : null}
                        {directors.length > 0 && (
                        directors.map((director) => (
                            <DirectorCard key={director.id} director={director} onDelete={() => handleDelete(director.id)} isList 
                            />
                        ))
                    )}
                    {!isLoading && directors.length === 0 && (
                        <Typography variant="h5" component="body1" paragraph>
                            No AI Directors active now.
                        </Typography>
                    )}
                </Box>
            </Container>
        </m.div>
        </>
    );
}
