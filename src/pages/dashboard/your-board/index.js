// next
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Container, Box, Typography, Stack, IconButton, Grid, Skeleton } from '@mui/material';
import { m } from "framer-motion";
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, doc, getDocs, query } from 'firebase/firestore';
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
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
// sections
import {DirectorCard} from '../../../sections/@dashboard/directors/DirectorCard';

// ----------------------------------------------------------------------

PageBoards.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

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

export default function PageBoards() {
    const { themeStretch } = useSettingsContext();

    const router = useRouter();

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const [myBoard, setMyBoard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleClick = () => {
        router.push({ pathname: PATH_DASHBOARD.yourBoard.build});
    };

    // fetch the directors
    const fetchBoard = useCallback(async () => {

        // Step 1: Get the myBoard document for the current user
        const myBoardRef = collection(db, 'users', user && user.uid, 'myBoard');
        const myBoardQuery = query(myBoardRef);
        const myBoardSnapshot = await getDocs(myBoardQuery);

        if (myBoardSnapshot.empty) {
            console.log('myBoard document does not exist');
            return;
        }
            
        const myBoardData = myBoardSnapshot.docs[0].data();
        const { directors } = myBoardData;

        const loadedDirectorsRef = await Promise.all(
            directors.map(async (directorId) => {
                const directorDoc = await getDoc(doc(db, 'directors', directorId));
                const myDirectorDoc = await getDoc(doc(db, "users", user && user.uid, "myDirectors", directorId));
                
                const directorData = directorDoc.data() || {};
                const myDirectorData = myDirectorDoc.exists() ? myDirectorDoc.data() : {};
                
                return {
                    id: directorDoc.id,
                    ...directorData,
                    ...myDirectorData
                };
            })
        );
        setMyBoard(loadedDirectorsRef);
        setIsLoading(false)

    }, [db, user]);

    // Use fetchDirectors to fetch directors from Firebase
    useEffect(() => {
        fetchBoard();
        // eslint-disable-next-line
    }, [fetchBoard]);

    return (
        <>
        <Head>
            <title> Your Board Of Directors | Personal Board</title>
        </Head>

        <m.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Box sx={{pl: 2}}>
                    <CustomBreadcrumbs
                            heading="Your Board Of Directors"
                            links={[
                            {
                                name: 'Dashboard',
                                href: PATH_DASHBOARD.root,
                            },
                            {
                                name: 'Your Board Of Directors',
                                href: PATH_DASHBOARD.about,
                            },
                        ]}
                    />
                </Box>
                <Grid container>
                    <Grid item xs={12} md={10}>
                    {!isLoading ? (
                        <Stack 
                            sx={{ p: 4, backgroundColor: "grey.100", border: 1, borderColor: "grey.300", borderRadius: 2 }}
                            onClick={myBoard.length === 0 ? handleClick : null}>
                            <Grid container sx={{ justifyContent: "center"}} spacing={4}>
                                {myBoard.length > 0 || !isLoading ? (
                                    myBoard.map((myDirector, myDirectorIndex) => ( 
                                    <Grid item key={myDirectorIndex} xs={12} md={4} >
                                        <DirectorCard director={myDirector} isBoard />
                                    </Grid>
                                    ))
                                ) : (
                                    <Box 
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold',
                                            minHeight: "246px"
                                        }}
                                    >
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
                                        >
                                            <Iconify icon="mdi:users-group" />
                                        </IconButton>
                                        <Typography variant="h6" sx={{color: "grey.600"}}>
                                            Build your Personal Board
                                        </Typography>
                                        <Typography variant="caption" sx={{color: "grey.600", fontWeight: 'normal'}}>
                                            Limited to 3 directors
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Stack>
                        ) : 
                        <Skeleton variant="rectangular" width="100%" height={246} sx={{ borderRadius: 1 }} /> }

                        {myBoard.length > 0 || !isLoading ? (
                        <Box sx={{ width: "100%", textAlign: "center", p: 2 }}>
                            <Typography variant="body1" onClick={handleClick} sx={{color: "primary.main", fontWeight: 'normal', cursor: "pointer"}}>Edit Your Board</Typography>
                        </Box>
                        ) : null }
                    </Grid>
                </Grid>
            </Container>

        </m.div>
        </>
    );
}
