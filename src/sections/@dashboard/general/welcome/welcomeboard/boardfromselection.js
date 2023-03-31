import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Typography, Button } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../../config-global';
// auth
import { useAuthContext } from '../../../../../auth/useAuthContext';
// hooks
import useResponsive from '../../../../../hooks/useResponsive';
// sections
import {DirectorCard} from '../../../directors/DirectorCard';
import { suggestDirectors } from '../../../../../utils/compromise';


// ----------------------------------------------------------------------

const BoardFromSelection = ({onNextStep, dataFromPrevStep}) => {

    const isDesktop = useResponsive('up', 'md');

    const [selectedDirectors, setSelectedDirectors] = useState([]);
    const [selectedDirectorObjects, setSelectedDirectorObjects] = useState([]);  
    // const suggestedDirectors = suggestDirectors(directorsData, dataFromPrevStep.question);

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    // Get directors and select three random directors
    useEffect(() => {
        const directorsRef = collection(db, 'directors');
        const unsubscribeDirectors = onSnapshot(directorsRef, (snapshot) => {
                const directorsData = [];
                snapshot.forEach((directorsDoc) => {
                directorsData.push({ id: directorsDoc.id, ...directorsDoc.data() });
            });

            // Select three directors based on the user's input
            const suggestedDirectors = suggestDirectors(directorsData, dataFromPrevStep.question);

            const suggestedDirectorIds = suggestedDirectors.map((director) => director.id);

            setSelectedDirectors(suggestedDirectorIds);
            setSelectedDirectorObjects(suggestedDirectors);
        });

        return () => {
            unsubscribeDirectors();
        };
    }, [db, dataFromPrevStep.question, user]);

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
                        Here is a recommended board who can provide you with personalized advice.
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
        <Grid container spacing={3} sx={{flexDirection: 'row', mb: 4 }}>
        {selectedDirectorObjects.length > 0 && (
            selectedDirectorObjects
            .map((director, index) => (
                <Grid item xs={12} sm={6} lg={4} key={director.id}>
                    <DirectorCard 
                        director={director} 
                        check={selectedDirectors.includes(director.id)}
                    />
                </Grid>
            ))
        )}
        </Grid>
        </>
        );
};
    
export default BoardFromSelection;

// ----------------------------------------------------------------------

BoardFromSelection.propTypes = {
        onNextStep: PropTypes.func.isRequired,
        dataFromPrevStep: PropTypes.object.isRequired,
    };  
    
// ----------------------------------------------------------------------