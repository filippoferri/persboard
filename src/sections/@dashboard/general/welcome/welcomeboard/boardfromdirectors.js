import React, { useEffect, useState } from 'react';
import { Grid, Stack, Box, Typography, Button } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../../config-global';
// auth
import { useAuthContext } from '../../../../../auth/useAuthContext';
// sections
import {DirectorCard} from '../../../../../sections/@dashboard/directors/DirectorCard';


// ----------------------------------------------------------------------


const BoardFromDirectors = ({onNextStep, dataFromPrevStep}) => {

    const [selectedDirectors, setSelectedDirectors] = useState([]);

    const handleSelectDirector = (directorId) => {
        if (selectedDirectors.includes(directorId)) {
            setSelectedDirectors(selectedDirectors.filter((id) => id !== directorId));
        } else if (selectedDirectors.length < 5) {
            setSelectedDirectors([...selectedDirectors, directorId]);
        }
    };

    const app = initializeApp(FIREBASE_API);
const db = getFirestore(app);

const { user } = useAuthContext();

const [directors, setDirectors] = useState([]);
const [myDirectors, setMyDirectors] = useState([]);

const [checkedDirectors, setCheckedDirectors] = useState(Array(myDirectors.length).fill(false));

const [boardData, setBoardData] = useState([]);

const NextStep = () => {
    const directors = { directors: selectedDirectors };
    const boardData = [
        dataFromPrevStep,
    directors,
    ];
    setBoardData(boardData);
    onNextStep(boardData);
};

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
            <Grid container spacing={3} sx={{flexDirection: 'row', mb: 6}}>
                <Grid item xs={12} sm={8} sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="p" gutterBottom>
                            Select Your virtual Coaches, Mentors and Sponsors (max 5)
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} sx={{display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        size="large"
                        disabled={selectedDirectors.length < 3}
                        onClick={NextStep} 
                    >
                        Ask Your Board
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{flexDirection: 'row' }}>
            {myDirectors.length > 0 && (
                myDirectors.map((myDirector, index) => (
                    <Grid sx={{ cursor: "pointer" }} item xs={12} sm={4} lg={3} key={myDirector.id} onClick={() => handleSelectDirector(myDirector.id)}>
                        <DirectorCard 
                            director={myDirector} 
                            check={selectedDirectors.includes(myDirector.id)}   
                            onDelete={() => handleDeleteDirector(myDirector.id)}
                        />
                    </Grid>
                ))
            )}
            {directors.length > 0 && (
                directors.map((director, index) => (
                    <Grid sx={{ cursor: "pointer" }} item xs={12} sm={4} lg={3} key={director.id} onClick={() => handleSelectDirector(director.id)}>
                        <DirectorCard 
                            director={director} 
                            check={selectedDirectors.includes(director.id)}   
                            onDelete={() => handleDeleteDirector(director.id)}
                        />
                    </Grid>
                ))
            )}
            </Grid>
        </>
        );
    };
    
    export default BoardFromDirectors;