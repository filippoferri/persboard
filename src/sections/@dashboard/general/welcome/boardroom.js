import { useState, useEffect } from 'react';
import { Paper, Stack, Box, Grid, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../config-global';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// sections
import AdvisoryBoard from '../../../../sections/@dashboard/projects/AdvisoryBoard';
import {generateAdvice} from '../../../../utils/generateAdvice';


// ----------------------------------------------------------------------

WelcomeBoardroom.propTypes = {
	dataFromPrevStep: PropTypes.object,
	onPrevStep: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function WelcomeBoardroom({dataFromPrevStep, onPrevStep}) { 

    const question = dataFromPrevStep[0].question;
    const directors = dataFromPrevStep[1].directors;

    // use states
    const [remainingCredits, setRemainingCredits] = useState();
    const [loading, setLoading] = useState(false); 
    const [discussion, setDiscussion] = useState([]);
    const [hasSavedDiscussion, setHasSavedDiscussion] = useState(false);
    const [loadedDirectors, setLoadedDirectors] = useState([]);



    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const data = [
    {
        id: '1',
        fullName: 'John Doe',
        text: 'I think it is a great idea. I would love to be a part of it.',
        role: 'Mentor'
        }
    ];

    // fetch the directors
    async function fetchDirectors() {

        if (directors.some(director => director.fullName)) {
            setLoadedDirectors(directors);
            return;
        }

        const app = initializeApp(FIREBASE_API);
        const db = getFirestore(app);
    
        const loadedDirectors = await Promise.all(
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
            
        setLoadedDirectors(loadedDirectors);
    }

    useEffect(() => {
        fetchDirectors();
    }, [directors]);

    //Call fetchDiscussion whenever the user saves a discussion
    useEffect(() => {
        if (hasSavedDiscussion) {
        fetchDiscussion();
        setHasSavedDiscussion(false);
        }
    }, [hasSavedDiscussion]);

    // Generate the discussion
    useEffect(() => {
        async function generateDiscussion() {
            if (!user || !user.uid) {
                return;
            }
    
            const boardRoomRef = collection(db, 'users', user.uid, 'myBoardrooms');
            const querySnapshot = await getDocs(boardRoomRef);
            const remainingCredits = user.credits - (querySnapshot.size);

            setRemainingCredits(remainingCredits);
        
            if (remainingCredits <= 0) {
                setDiscussion('You have reached the limit of available credits. Please upgrade your account to receive more advices.');
                setLoading(false);
                return;
            }
        
            setLoading(true);
            //const prompt = await generateAdvice(loadedDirectors, question);
            //setDiscussion(prompt);
            setDiscussion(data);
            setLoading(false);
        }
    
        generateDiscussion();
        // handleSave();
    }, []);

    // save the discussion
    const handleSave = async () => {
        try {
        if (!user || !user.uid) {
            console.log("User is not logged in or user ID is undefined.");
            return;
        }
        console.log(discussion)
        const boardRoomRef = collection(db, "users", user && user.uid, "myBoardrooms");
        const docRef = await setDoc(doc(boardRoomRef), {
            question: question,
            directors: directors,
            discussion: discussion
        });
        console.log("Document written: ", docRef.question);
        setSaved(true);
        setHasSavedDiscussion(true); // set the flag to true after the discussion is saved
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
    <>
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                mt: 2,
                mb: 4,
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Board Advice
                </Typography>
                <Typography variant="p" gutterBottom>
                    Get guidance on your toughest question
                </Typography>
            </Box>
            <Box sx={{ flexShrink: 0 }}></Box>
        </Stack>

        <Paper variant="outlined" sx={{ flexGrow: 1 }}>
            <Grid container spacing={0} sx={{minHeight: '600px'}}>
                {/*/  Advisory Board */}
                <Grid item xs={3} sx={{borderRight: '1px solid #DFE3E8'}}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight: 'bold', color: '#637381',bgcolor: '#f4f6f8'}}>
                        Advisory Board
                    </Box>
                    <AdvisoryBoard directors={loadedDirectors} />
                </Grid>

                <Grid container item xs={9} direction="column" sx={{flexGrow: 1}} >

                    <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight:'bold', color:'#637381', bgcolor: '#f4f6f8' }}>
                        Meaningful Discussion
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', p:2, pb: 4 }}>

                        {/*/  You */}
                        <Grid container justifyContent={'flex-end'}>
                            <Grid item sx={{ textAlign: 'right', mb: 2 }}>
                                <Typography 
                                variant='caption' 
                                sx={{ fontWeight:'bold', pr: 1 }}>
                                    You
                                </Typography>
                                <Box sx={{
                                    backgroundColor:"#D1E9FC", 
                                    p: 2, 
                                    borderRadius: 1, 
                                    borderTopRightRadius: 0,
                                    mb: 1,
                                    maxWidth: '600px',
                                }}>
                                    {question}
                                </Box>
                            </Grid>
                        </Grid>

                        {/*/  Discussion */}  
                        <Grid container justifyContent={'flex-start'} sx={{flex: 1}}>
                            {discussion.length === 0 ? (
                                <Grid item justifyContent="center" sx={{mb: 6}}>
                                    <Typography variant="body1" align="center" sx={{color: "#919EAB"}}>
                                        We are thinking...
                                    </Typography>
                                </Grid>
                            ) : (
                                discussion.map((advice, index) => (
                                <Grid item key={index}>
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
                                        width: '600px',
                                    }}
                                    >
                                        {advice.text}
                                    </Box>
                                </Grid>
                                ))
                            )}
                        </Grid>

                        {/*/  Limits */}
                        {discussion.length !== 0 ? (
                        <Grid container justifyContent={'center'}>
                            <Grid item justifyContent="center">
                                <Typography variant="body1" align="center" sx={{color: "#919EAB", pt: 4, pb: 5 }}>
                                    {remainingCredits > 0 ? `${remainingCredits} credits remaining.` : 'No credits remaining. Please upgrade your account.'} Need more? Upgrade now!
                                </Typography>
                            </Grid>
                            <Grid item sx={{ flexGrow: 1 }}>
                                <Box sx={{display: 'flex', backgroundColor: "#D1E9FC", p: 2, borderRadius: 1, alignItems: "center"}}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant='h5'>Engage in a dynamic exchange of ideas</Typography>
                                        <Typography variant='h5' sx={{color: "#2065D1"}}>Achieve greater clarity and direction</Typography>
                                    </Box>
                                    <Box>
                                        <Button variant="contained" size="large" >Upgrade Now</Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid> ) : ( <></> )}

                    </Box>

                </Grid>
            </Grid>
        </Paper>
    </>
    );
}
