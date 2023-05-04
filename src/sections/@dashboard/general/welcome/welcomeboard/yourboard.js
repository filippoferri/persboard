import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Typography, Button, CircularProgress } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, doc, getDoc, getDocs } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../../config-global';
// auth
import { useAuthContext } from '../../../../../auth/useAuthContext';
// hooks
import useResponsive from '../../../../../hooks/useResponsive';
// sections
import {DirectorCard} from '../../../directors/DirectorCard';
import { suggestDirectors } from '../../../../../utils/compromise';


// ----------------------------------------------------------------------

const YourBoard = ({onNextStep, dataFromPrevStep}) => {

    const isDesktop = useResponsive('up', 'md');

    const [selectedDirectors, setSelectedDirectors] = useState([]);

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    // Get directors and select three random directors
    const fetchBoard = useCallback(async () => {
        const myBoardRef = collection(db, 'users', user && user.uid, 'myBoard');
        const myBoardQuery = query(myBoardRef);
        const myBoardSnapshot = await getDocs(myBoardQuery);

        if (myBoardSnapshot.empty) {
            console.log('myBoard document does not exist');
            return;
        }

        const myBoardData = myBoardSnapshot.docs[0].data();
        const directors = myBoardData.directors;

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

        setSelectedDirectors(loadedDirectorsRef)

    }, [db, user]);

    useEffect(() => {
        fetchBoard();
        // eslint-disable-next-line
    }, [fetchBoard]);

    const NextStep = () => {
        const directors = { directors: selectedDirectors };
        const boardDataArr = [
            dataFromPrevStep,
            directors,
        ];
        onNextStep(boardDataArr);
    };

    return (
        <>
            <Grid container spacing={3} sx={{flexDirection: 'row', mb: 6}}>
                <Grid item xs={12} sm={8} sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="p" gutterBottom>
                            Your Board is ready to provide you with personalized advice.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} sx={{display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={NextStep}
                        fullWidth={!isDesktop ? true : undefined}
                    >
                        Ask Your Board
                    </Button>
                </Grid>
            </Grid>
            {selectedDirectors.length > 0 ? (
                <Grid container spacing={3} sx={{flexDirection: 'row', mb: 4 }}>
                    {selectedDirectors.map((director, index) => (
                        <Grid item xs={12} sm={6} lg={4} key={director.id}>
                            <DirectorCard 
                                director={director}
                                check
                                isBoard
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
    
};
    
export default YourBoard;

// ----------------------------------------------------------------------

YourBoard.propTypes = {
        onNextStep: PropTypes.func.isRequired,
        dataFromPrevStep: PropTypes.object.isRequired,
    };  
    
// ----------------------------------------------------------------------