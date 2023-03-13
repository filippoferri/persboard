import { useState, useEffect, useCallback } from 'react';
import { Paper, Stack, Box, Grid, Typography, Button, Link, IconButton, Tooltip } from '@mui/material';
// import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
// Router
import { useRouter } from 'next/router';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, Timestamp, increment, onSnapshot } from 'firebase/firestore';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// import { increment } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../config-global';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Iconify from '../../../../components/iconify';
// sections
import AdvisoryBoard from '../../projects/AdvisoryBoard';
import {generateAdvice} from '../../../../utils/generateAdvice';

// ----------------------------------------------------------------------

WelcomeBoardroom.propTypes = {
	dataFromPrevStep: PropTypes.object,
	onPrevStep: PropTypes.func,
    onRestart: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function WelcomeBoardroom({ dataFromPrevStep, onPrevStep, onRestart }) { 

    const { question } = dataFromPrevStep[0];
    const { directors } = dataFromPrevStep[1];

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    // use states
    const [remainingCredits, setCredits] = useState();
    const [loadedDirectors, setLoadedDirectors] = useState([]);
    const [discussion, setDiscussion] = useState([]);

    const router = useRouter();
    const handleUpgrade = () => {
        router.push({ pathname: PATH_DASHBOARD.billing.root });};

    // Get credits
    useEffect(() => {
        // const app = initializeApp(FIREBASE_API);
        // const db = getFirestore(app);

        const creditsRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(creditsRef, (snapshot) => {
            const data = snapshot.data();
            setCredits(data.credits);
        });

        console.log("remaining credits: ", remainingCredits);

        return unsubscribe;
    }, [user.uid, db, remainingCredits]);

    // const data = [
    // {
    //     id: '1',
    //     fullName: 'John Doe',
    //     text: 'I think it is a great idea. I would love to be a part of it.',
    //     role: 'Mentor'
    //     }
    // ]; 

    // fetch the directors
    const fetchDirectors = useCallback(async () => {

        if (directors.some(director => director.fullName)) {
            setLoadedDirectors(directors);
            return;
        }
    
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
            
        setLoadedDirectors(loadedDirectorsRef);
    }, [directors, db, user]); 

    // generate discussion
    const generateDiscussion = useCallback(async () => {
        if (!user || !user.uid) {
            return;
        }
    
        if (remainingCredits <= 0) {
            setDiscussion([
                {
                    id: '1',
                    fullName: 'Your Personal Board',
                    text: 'You have reached the limit of available credits. Please upgrade your account to receive more advices.',
                    role: 'Advisory'
                }
            ]);
            return;
        }
    
        const prompt = await generateAdvice(loadedDirectors, question);
        setDiscussion(prompt);
        // setDiscussion(data);

        // Decrease remaining credits by 1
        const remainingCreditsRef = doc(db, "users", user.uid);
        await updateDoc(remainingCreditsRef, { credits: increment(-1) });

        setCredits(prevCredits => prevCredits - 1); // update the remaining credits state variable
    }, [loadedDirectors, question, remainingCredits, db, user]);

    // save the discussion
    async function handleSave() {
        const myBoardroomsRef = doc(collection(db, "users", user.uid, "myBoardrooms"));
        try {
            // add folder to firestore
            await setDoc (myBoardroomsRef,{
                question,
                directors,
                discussion,
                dateAdd: Timestamp.fromDate(new Date()),
            });
            console.log('New discussion added:', question);
        } catch (error) {
            console.error('Error adding discussion:', error);
        }
    }

    // Use fetchDirectors to fetch directors from Firebase
    useEffect(() => {
        fetchDirectors();
    }, [directors, fetchDirectors]);
    
    // Use generateDiscussion to generate discussion from directors and question
    useEffect(() => {
        if (loadedDirectors.length > 0) {
            generateDiscussion();
        }
    }, [loadedDirectors, generateDiscussion]);

    return (
    <>
        <Stack
            direction="row"
            alignItems="flex-start"
            sx={{
                mt: 2,
                mb: 4,
            }}
        >
            <Grid container spacing={0}>
                <Grid item sx={{display: "flex", alignItems:"flex-start" }}>
                    <IconButton 
                        color= 'default' 
                        onClick={onPrevStep}>
                        <Iconify icon="eva:arrow-ios-back-fill" />
                    </IconButton>
                </Grid>
                <Grid item sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" gutterBottom>
                        Board Advice
                    </Typography>
                    <Typography variant="p" gutterBottom>
                        Get guidance on your toughest question
                    </Typography>
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <Button variant='contained' size="large" onClick={onRestart}>
                        New Board Advice
                    </Button>
                </Grid>
            </Grid>
        </Stack>

        <Paper variant="outlined" sx={{ flexGrow: 1 }}>
            <Grid container spacing={0} sx={{minHeight: '600px'}}>

                <Grid item xs={3} sx={{borderRight: '1px solid #DFE3E8'}}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight: 'bold', color: '#637381',bgcolor: '#f4f6f8'}}>
                        Advisory Board
                    </Box>
                    <AdvisoryBoard directors={loadedDirectors} />
                </Grid>

                <Grid container item xs={9} direction="column" sx={{flexGrow: 1}} >

                    <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight:'bold', color:'#637381', bgcolor: '#f4f6f8' }}>
                        <Box sx={{ display: "flex", flex: 1 }}>
                            Meaningful Discussion
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Tooltip title="Ask your board again to get different advices">
                                <IconButton 
                                    color= 'default' 
                                    onClick={() => {
                                        generateDiscussion();
                                    }}>
                                    <Iconify icon="eva:refresh-outline" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Save this discussion for a future consult">
                                <IconButton 
                                    color= 'default' 
                                    onClick={() => {
                                        handleSave();
                                    }}>
                                    <Iconify icon="eva:save-outline" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', p:2 }}>

                        <Grid container justifyContent='flex-end'>
                            <Grid item sx={{ textAlign: 'right', mb: 2 }}>
                                <Typography 
                                variant='caption' 
                                sx={{ fontWeight:'bold', pr: 1 }}>
                                    You
                                </Typography>
                                <Box sx={{
                                    backgroundColor:"#D6E4FF", 
                                    p: 2, 
                                    borderRadius: 1, 
                                    borderTopRightRadius: 0,
                                    mb: 1,
                                    maxWidth: '800px',
                                }}>
                                    {question}
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container justifyContent="flex-start" sx={{flex: 1}}>
                            {discussion.length === 0 ? (
                                <Grid item justifyContent="center" sx={{mb: 6}}>
                                    <Typography variant="body1" align="center" sx={{color: "#919EAB"}}>
                                        We are thinking...
                                    </Typography>
                                </Grid>
                            ) : (
                                discussion.map((advice, index) => (
                                <Grid item key={index} sx={{mb:2}}>
                                    <Typography
                                        variant='caption'
                                        sx={{ fontWeight: 'bold', pl: 1, mb: 2 }}
                                    >
                                        {advice.fullName} | {advice.role}
                                    </Typography>
                                    <Box sx={{
                                        backgroundColor: "#F4F6F8",
                                        p: 2,
                                        borderRadius: 1,
                                        borderTopLeftRadius: 0,
                                        mb: 1,
                                        width: '800px',
                                    }}
                                    >
                                        {advice.text}
                                    </Box>
                                </Grid>
                                ))
                            )}
                        </Grid>

                        {discussion.length !== 0 ? (
                        <Grid container justifyContent="center">
                            <Grid item justifyContent="center">
                                <Typography variant="body1" align="center" sx={{color: "#919EAB", pt: 4, pb: 5 }}>
                                    {remainingCredits > 0 ? `${remainingCredits} credits remaining.` : 'No credits remaining. Please upgrade your account.'} Need more? <Link underline="none" color="#3366FF" href={PATH_DASHBOARD.billing.root} >Upgrade now</Link>!
                                </Typography>
                            </Grid>
                            <Grid item sx={{ flexGrow: 1 }}>
                                <Box sx={{display: 'flex', backgroundColor: "#D6E4FF", p: 2, borderRadius: 1, alignItems: "center"}}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant='h5'>Engage in a dynamic exchange of ideas</Typography>
                                        <Typography variant='h5' sx={{color: "#3366FF"}}>Achieve greater clarity and direction</Typography>
                                    </Box>
                                    <Box>
                                        <Button variant="outlined" size="large" onClick={handleUpgrade} >Upgrade Now</Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid> ) : null }

                    </Box>

                </Grid>
            </Grid>
        </Paper>
    </>
    );
}
