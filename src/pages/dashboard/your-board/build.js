// next
import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { m } from "framer-motion";
import { Box, Card, Divider, Container, Grid, Typography, IconButton, Skeleton, Button } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, onSnapshot, query, limit } from 'firebase/firestore';
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
import { useSnackbar } from '../../../components/snackbar';
// hooks
import useResponsive from '../../../hooks/useResponsive';
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
    const isDesktop = useResponsive('up', 'md');
    const [selectedDirectors, setSelectedDirectors] = useState([]);
    const [premiumDirectors, setPremiumDirectors] = useState([]);
    const [myDirectors, setMyDirectors] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const handleSelectDirector = (directorId) => {
        if (selectedDirectors.includes(directorId)) {
            setSelectedDirectors(selectedDirectors.filter((id) => id !== directorId));
        } else if (selectedDirectors.length < 3) {
            setSelectedDirectors([...selectedDirectors, directorId]);
        } else {
            enqueueSnackbar('You need to deselect one director!', { variant: 'warning' });
        }
    };

    const handleCreateDirector = () => {
        router.push({ pathname: PATH_DASHBOARD.directors.newDirector});
    };

    const handleCancel = () => {
        router.push({ pathname: PATH_DASHBOARD.yourBoard.root});
    };

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    // Get directors
    useEffect(() => {
        const directorsRef = collection(db, 'directors');
        const myDirectorsRef = collection(db, 'users', user && user.uid, 'myDirectors');
        const unsubscribeDirectors = onSnapshot(directorsRef, (snapshot) => {
            const directorsData = [];
            snapshot.forEach((directorsDoc) => {
                directorsData.push({ id: directorsDoc.id, ...directorsDoc.data() });
            });
            setPremiumDirectors(directorsData);
        });
        const unsubscribeMyDirectors = onSnapshot(myDirectorsRef, (snapshot) => {
            const myDirectorsData = [];
            snapshot.forEach((myDirectorsDoc) => {
                myDirectorsData.push({ id: myDirectorsDoc.id, ...myDirectorsDoc.data() });
            });
            setMyDirectors(myDirectorsData);
        });
        return () => {
            unsubscribeDirectors();
            unsubscribeMyDirectors();
        };
    }, [db, user]);

    // fetch the board
    const fetchBoard = useCallback(async () => {

        // Check if the user has a board document
        const myBoardRef = collection(db, 'users', user && user.uid, 'myBoard');
        const myBoardQuery = query(myBoardRef);
        const myBoardSnapshot = await getDocs(myBoardQuery);

        if (myBoardSnapshot.empty) {
            console.log('myBoard document does not exist');
            setSelectedDirectors([]);
            return;
        }
            
        const myBoardData = myBoardSnapshot.docs[0].data();
        const directors = myBoardData.directors;

        setSelectedDirectors(directors);
        setIsUpdate(true)

    }, [db, user]);

    // save the board
    const saveBoard = async () => {
        try {
            const boardRef = doc(collection(db, 'users', user && user.uid, 'myBoard'));
            await setDoc(boardRef, { 
                name: "My Personal Board",
                directors: selectedDirectors 
            });
            await push(PATH_DASHBOARD.yourBoard.root);
            enqueueSnackbar('Create success!');
        } catch (error) {
            console.error('Error adding director:', error);
            enqueueSnackbar('Ops, something went wrong!', { variant: 'error' });
        }
    };

    // update the board
    const updateBoard = async () => {
        try {
            const myBoardRef = collection(db, 'users', user && user.uid, 'myBoard');
            const myBoardQuery = query(myBoardRef);
            const myBoardSnapshot = await getDocs(myBoardQuery);
    
            if (myBoardSnapshot.empty) {
                console.log('myBoard collection is empty');
                return;
            }
    
            const firstDocId = myBoardSnapshot.docs[0].id;
            const firstDocRef = doc(myBoardRef, firstDocId);
            await updateDoc(firstDocRef, { 
                directors: selectedDirectors 
            });
            console.log('myBoard updated successfully');
            enqueueSnackbar('Update success!');
            router.push({ pathname: PATH_DASHBOARD.yourBoard.root});
        } catch (error) {
            console.error('Error updating myBoard:', error);
            enqueueSnackbar('Ops, something went wrong!', { variant: 'error' });
        }
    };
    
    // Use fetchDirectors to fetch directors from Firebase
    useEffect(() => {
        fetchBoard();
        // eslint-disable-next-line
    }, [fetchBoard]);

    return (
        <>
        <Head>
            <title>Build Your Board | Personal Board</title>
        </Head>

        <m.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Box sx={{pl: 2}}>
                    <CustomBreadcrumbs
                        heading="Build Your Board"
                        links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Your Board Of Directors',
                            href: PATH_DASHBOARD.yourBoard.root,
                        },
                        {
                            name: 'Build Your Board',
                            href: PATH_DASHBOARD.yourBoard.build,
                        },
                    ]}
                    />
                </Box> 
            </Container>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Grid container spacing={3} sx={{flexDirection: 'row', mb: 6}}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="p" sx={{ pl:2 }}>
                                Click to Select or Deselect Your Personal Directors ( {selectedDirectors.length} /3 )
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="default"
                            size="large"
                            sx={{mr:1}}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleCreateDirector}
                            sx={{mr:1}}
                        >
                            Add Your Director
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            disabled={selectedDirectors.length < 3}
                            onClick={isUpdate ? updateBoard : saveBoard}
                        >
                            {isUpdate ? "Update Your Board" : "Save Your Board" }
                        </Button>
                    </Grid>
                </Grid>
            </Container>

            {myDirectors.length > 0 && (
            <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mb: 4 }}>
                <Box xs={12} sx={{ pl:2 }}>
                    <Typography variant="h5" sx={{ mb: 2}} >
                        Your Directors
                    </Typography> 
                    <Divider sx={{ mb: 3 }} />
                </Box>
                <Grid container spacing={3} sx={{flexDirection: 'row' }}>
                        { myDirectors.map((myDirector, index) => (
                            <Grid sx={{ cursor: "pointer" }} item xs={12} sm={3} key={myDirector.id} onClick={() => handleSelectDirector(myDirector.id)}>
                                <DirectorCard 
                                    director={myDirector} 
                                    check={selectedDirectors.includes(myDirector.id)}   
                                    // onDelete={() => handleDeleteDirector(myDirector.id)}
                                />
                            </Grid>
                        ))}
                </Grid>
            </Container>
            )}

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Box xs={12} sx={{ pl:2 }}>
                    <Typography variant="h5" sx={{ mb: 2}} >
                        AI Directors
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                </Box>

                <Grid container spacing={3} sx={{flexDirection: 'row' }}>
                    {isLoading ? (
                        <Skeleton variant="rectangular" width="100%" height={180} />
                    ) : null}
                        {premiumDirectors.length > 0 && (
                        premiumDirectors.map((director) => (
                            <Grid sx={{ cursor: "pointer" }} item xs={12} sm={6} lg={3} key={director.id} onClick={() => handleSelectDirector(director.id)}>
                                <DirectorCard 
                                    director={director}
                                    check={selectedDirectors.includes(director.id)}
                                    boardroom
                                />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>

        </m.div>
        </>
    );
}


