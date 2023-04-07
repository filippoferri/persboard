import { useState, useEffect, useCallback } from 'react';
import { Card, Stack, Grid, Typography, Button, IconButton, Skeleton } from '@mui/material';
import Confetti from 'react-confetti';
import PropTypes from 'prop-types';

// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, increment } from 'firebase/firestore';
// import { increment } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../config-global';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import CustomList from '../../../../components/list';
// sections
import {generateAdvice} from '../../../../utils/generateAdvice';
import BoardroomDrawer from '../../boardroom/sections/boardroomDrawer';
import BoardroomHeader from '../../boardroom/sections/boardroomHeader';
import BoardroomFooter from '../../boardroom/sections/boardroomFooter';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// Utils
import {generateTakeaways} from '../../../../utils/generateTakeaways';

// ----------------------------------------------------------------------

WelcomeBoardroom.propTypes = {
	dataFromPrevStep: PropTypes.object,
	onPrevStep: PropTypes.func,
    onRestart: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function WelcomeBoardroom({ dataFromPrevStep, onPrevStep, onRestart }) { 

    const isDesktop = useResponsive('up', 'md');

    const { enqueueSnackbar } = useSnackbar();

    const { question } = dataFromPrevStep[0];
    const { directors } = dataFromPrevStep[1];

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    // use states
    // eslint-disable-next-line
    const [remainingCredits, setCredits] = useState(user.credits);
    const [loadedDirectors, setLoadedDirectors] = useState([]);
    const [discussion, setDiscussion] = useState([]);
    const [takeaways, setTakeaways] = useState([]);

    // const data = [
    // {
    //     id: '1',
    //     fullName: 'John Doe',
    //     text: 'I think it is a great idea. I would love to be a part of it.',
    //     role: 'Mentor'
    //     }
    // ]; 

    // const keyTakeaways = [
    //     {
    //         text: 'Think big, but start small.',
    //     },
    //     {
    //         text: 'Less is more.',
    //     }
    // ]; 

    // Decrease remaining credits by 1
    async function handleCredits() {
        if (remainingCredits > 0) {
            const remainingCreditsRef = doc(db, "users", user.uid);
            try {
                await updateDoc(remainingCreditsRef, { credits: increment(-1) });
            } catch (error) {
                console.error('Error decreasing credits:', error);
            } 
        }           
    };

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
    
        const prompt = await generateAdvice(loadedDirectors, question, user);
        // Assuming `generateAdvice` returns an object with an `error` property when an error occurs
        if (!prompt.error) {
            await handleCredits(); // Call handleCredits if the prompt does not contain an error
        }
        setDiscussion(prompt);
        // setDiscussion(data); // for testing

        // Generate takeaways after setting the discussion
        const discussionText = prompt
        .map(({ fullName, role, text }) => `${fullName} (${role}): ${text}`)
        .join('\n');
        const generatedTakeaways = await generateTakeaways(discussionText);
        setTakeaways(generatedTakeaways);
        // setTakeaways(keyTakeaways); // for testing

        // eslint-disable-next-line
    }, [question, loadedDirectors, remainingCredits, user]);
    // }, [question, user]); // for testing

    const handleRefresh = () => {
        if (remainingCredits > 0) {
            setDiscussion([]);
            setTakeaways([]);
            generateDiscussion();
            enqueueSnackbar('New advices created.');
        } else {
            enqueueSnackbar('You have reached the limit of available credits.', { variant: 'error' });
        }
    }

    const confettiProps = {
        width: window.innerWidth,
        height: window.innerHeight,
        recycle: false,
        numberOfPieces: 1000,
        gravity: 0.1,
        colors: ['#8973D9', '#FFAF33', '#75A7FF', '#4ED857', '#EAD219', '#FF7E42'],
    };

    // Use fetchDirectors to fetch directors from Firebase
    useEffect(() => {
        fetchDirectors();
        // eslint-disable-next-line
    }, [directors, fetchDirectors]);
    
    // Use generateDiscussion to generate the discussion
    useEffect(() => {
        if (loadedDirectors.length > 0) {
            generateDiscussion();
        }
        // eslint-disable-next-line
    }, [loadedDirectors]);

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
                <Grid item sx={{display: "flex", alignItems: isDesktop ? "flex-start" : "center", flexDirection: isDesktop ? "row" : "column" }}>
                    <IconButton 
                        color= 'default' 
                        onClick={onPrevStep}>
                        <Iconify icon="eva:arrow-ios-back-fill" />
                    </IconButton>
                    {isDesktop ? null : <Typography>Back</Typography>}
                </Grid>
                <Grid item sx={{ flexGrow: 1, mb: isDesktop ? 0 : 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Boardroom
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

        {discussion.length > 1 ? (
            <Confetti {...confettiProps} />
        ) : null }

        <Card sx={{ minHeight: '74vh', display: 'flex' }}>

            <BoardroomDrawer directors={loadedDirectors} />

            <Stack flexGrow={1} sx={{ overflow: 'hidden' }}>

                <BoardroomHeader 
                    directors={loadedDirectors}
                    question={question}
                    discussion={discussion}
                    takeaways={takeaways}
                    handleRefresh={handleRefresh}
                    isNew
                />

                <Stack
                    direction="row"
                    flexGrow={1}
                    sx={{
                        overflow: 'hidden',
                    }}
                >
                    <Stack flexGrow={1} sx={{ minWidth: 0 }}>
                        <Stack sx={{ p:2.5}}>

                            <Stack direction="row" justifyContent='flex-end' sx={{ mb: 2 }}>  
                                <Stack sx={{ textAlign: 'right' }}>
                                    <Typography 
                                    variant='caption' 
                                    sx={{ fontWeight:'bold', pr: 1 }}>
                                        You
                                    </Typography>
                                    <Stack sx={{
                                        backgroundColor:"primary.lighter", 
                                        p: 2, 
                                        borderRadius: 1, 
                                        borderTopRightRadius: 0,
                                        mb: 1,
                                        minWidth: 48,
                                        maxWidth: '650px',
                                        overflow: 'hidden',
                                        color: 'grey.800',
                                    }}>
                                        {question}
                                    </Stack>
                                </Stack>
                            </Stack>
                            
                            {discussion.length === 0 ? (
                                <Stack direction="row" justifyContent='flex-start' sx={{ mb: 2 }}>  
                                    <Stack sx={{ textAlign: 'left', mb: 2 }}>
                                        <Typography variant="body1" align="left" sx={{color: "grey.600", mb: 2 }}>
                                            We are thinking...
                                        </Typography>
                                        <Skeleton variant="rounded" width={600} height={60} sx={{ bgcolor: 'grey.200', mb: 1 }} />
                                        <Skeleton variant="rounded" width={600} height={60} animation="wave" sx={{ bgcolor: 'grey.200', mb: 1  }}  />
                                        <Skeleton variant="rounded" width={600} height={60} sx={{ bgcolor: 'grey.200', mb: 1  }}  />
                                    </Stack>
                                </Stack>
                            ) : (
                            discussion.map((advice, index) => (
                                <Stack key={index} direction="row" justifyContent='flex-start' sx={{ mb: 2 }}>  
                                    <Stack sx={{ textAlign: 'left' }}>
                                        <Typography 
                                            variant='caption' 
                                            sx={{ fontWeight:'bold', pl: 1 }}>
                                            {advice.fullName} | {advice.role}
                                        </Typography>
                                        <Stack sx={{
                                            backgroundColor: "grey.200",
                                            p: 2,
                                            borderRadius: 1,
                                            borderTopLeftRadius: 0,
                                            mb: 1,
                                            minWidth: 48,
                                            maxWidth: '650px',
                                            color: 'grey.800',
                                        }}
                                        >
                                            {advice.text}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            ))
                            )}

                            {takeaways.length !== 0 ? (
                            <Grid container sx={{ mb: 4, flexDirection: "row"}}>
                                <Grid item sx={{ display: "flex" }}>
                                    <CustomList listSubheader="Action Items" takeaways={takeaways} />
                                </Grid>
                            </Grid> ) : null }
                        </Stack>

                    </Stack>
                </Stack>

                <BoardroomFooter isNew />
            </Stack>
        </Card>
    </>
    );
}
