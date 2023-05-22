import { useState, useEffect, useCallback } from 'react';
import { Card, Stack, Grid, Typography, Button, IconButton, Skeleton } from '@mui/material';
import Confetti from 'react-confetti';
import PropTypes from 'prop-types';

// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc, increment, onSnapshot } from 'firebase/firestore';
// import { increment } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../config-global';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import CustomList from '../../../../components/list';
import PlusMinusList from '../../../../components/plus-minus-list';
// sections
import BoardroomDrawer from '../../boardroom/sections/boardroomDrawer';
import BoardroomHeader from '../../boardroom/sections/boardroomHeader';
import BoardroomFooter from '../../boardroom/sections/boardroomFooter';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// Utils
import {generateAdviceLC} from '../../../../utils/generateAdviceLC';
import {generateTakeawaysLC} from '../../../../utils/generateTakeawaysLC';
import {generateScenariosLC} from '../../../../utils/generateScenariosLC';
import {generatePlusMinusLC} from '../../../../utils/generatePlusMinusLC';
import {generateRationalConclusionLC} from '../../../../utils/generateRationalConclusionLC';
import {generateSwotAnalysisLC} from '../../../../utils/generateSwotAnalysisLC';
import {generateSoarAnalysisLC} from '../../../../utils/generateSoarAnalysisLC';
import {generateTroubleshootLC} from '../../../../utils/generateTroubleshootLC';
import ThinkTime from '../../../../utils/thinkTime';

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
    const [swotAnalysis, setSwotAnalysis] = useState([]);
    const [soarAnalysis, setSoarAnalysis] = useState([]);
    const [scenarios, setScenarios] = useState([]);
    const [plusMinus, setPlusMinus] = useState([]);
    const [rationalConclusion, setRationalConclusion] = useState([]);
    const [troubleshoot, setTroubleshoot] = useState([]);
    const [isThinking, setThinking] = useState(false);

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
    
        const adviceReady = await generateAdviceLC(loadedDirectors, question, user);
        // Reducing 1 credit per advice
        if (!adviceReady.error) {
           await handleCredits(); // Call handleCredits if the prompt does not contain an error
        }
        setDiscussion(adviceReady);
        // setDiscussion(data); // for testing

        // eslint-disable-next-line
    }, [question, loadedDirectors, remainingCredits, user]);
    // }, [question, loadedDirectors, user]); // for testing without credits
    // }, [question, user]); // for testing

    const handleRefresh = () => {
        if (remainingCredits > 0) {
            setDiscussion([]);
            generateDiscussion();
            enqueueSnackbar('New advices created.');
        } else {
            enqueueSnackbar('You have reached the limit of available credits.', { variant: 'error' });
        }
    }

    const handleTakeaways = async () => {
        setThinking(true);
        // Generate takeaways after setting the discussion
        const discussionText = discussion
        .map(({ text }) => text)
        .join('\n');
        const generatedTakeaways = await generateTakeawaysLC(discussionText);
        setTakeaways(generatedTakeaways);
        // setTakeaways(keyTakeaways); // for testing
        setThinking(false); // hide the loading state
    };

    const handleScenarios = async () => {
        setThinking(true);
        // Generate scenarios after setting the discussion
        const discussionText = discussion
        .map(({ text }) => text) // extract the "text" property from each object
        .join('\n');
        const generatedScenarios = await generateScenariosLC(discussionText);
        setScenarios(generatedScenarios);
        setThinking(false); // hide the loading state
    };

    const handlePlusMinus = async () => {
        setThinking(true);
        // Generate scenarios after setting the discussion
        const discussionText = discussion
        .map(({ text }) => text) // extract the "text" property from each object
        .join('\n');
        const generatedPlusMinus = await generatePlusMinusLC(discussionText);
        setPlusMinus(generatedPlusMinus);
        setThinking(false); // hide the loading state
    };

    const handleRationalConclusion = async () => {
        setThinking(true);
        // Generate scenarios after setting the discussion
        const discussionText = discussion
        .map(({ text }) => text) // extract the "text" property from each object
        .join('\n');
        const generatedRationalConclusion = await generateRationalConclusionLC(discussionText);
        setRationalConclusion(generatedRationalConclusion);
        setThinking(false); // hide the loading state
    };

    const handleSwotAnalysis = async () => {
        setThinking(true);
        // Generate scenarios after setting the discussion
        const discussionText = discussion
        .map(({ text }) => text) // extract the "text" property from each object
        .join('\n');
        const generatedSwotAnalysis = await generateSwotAnalysisLC(discussionText);
        setSwotAnalysis(generatedSwotAnalysis);
        setThinking(false); // hide the loading state
    };

    const handleSoarAnalysis = async () => {
        setThinking(true);
        // Generate scenarios after setting the discussion
        const discussionText = discussion
        .map(({ text }) => text) // extract the "text" property from each object
        .join('\n');
        const generatedSoarAnalysis = await generateSoarAnalysisLC(discussionText);
        setSoarAnalysis(generatedSoarAnalysis);
        setThinking(false); // hide the loading state
    };

    const handleTroubleshoot = async () => {
        setThinking(true);
        // Generate scenarios after setting the discussion
        const discussionText = discussion
        .map(({ text }) => text) // extract the "text" property from each object
        .join('\n');
        const generatedTroubleshoot = await generateTroubleshootLC(discussionText);
        setTroubleshoot(generatedTroubleshoot);
        setThinking(false); // hide the loading state
    };

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

    useEffect(() => {
        if (!user) {
            setCredits(null);
            return () => {};
        }
        
        const creditsRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(creditsRef, (snapshot) => {
            const data = snapshot.data();
            setCredits(data.credits);
    });
        
        return unsubscribe;
    }, [user, user.uid, setCredits]);  

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
                    scenarios={scenarios}
                    plusMinus={plusMinus}
                    rationalConclusion={rationalConclusion}
                    swotAnalysis={swotAnalysis}
                    soarAnalysis={soarAnalysis}
                    troubleshoot={troubleshoot}
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
                                        <ThinkTime />
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
                                        
                                            dangerouslySetInnerHTML={{
                                                __html: `<div>${advice.text.replace(/\n/g, "<br />")}</div>`,
                                            }}
                                        />
                                    </Stack>
                                </Stack>
                            ))
                            )}

                            {takeaways.length !== 0 ? (
                            <Stack sx={{
                                p: 2,
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                color: 'grey.800',
                                mb: 2, 
                            }}>
                                <Grid container sx={{ mb: 4, flexDirection: "row"}}>
                                    <Grid item sx={{ display: "flex" }}>
                                        <CustomList listSubheader="Action Items" takeaways={takeaways} />
                                    </Grid>
                                </Grid> 
                            </Stack>
                            ) : null }

                            {swotAnalysis.length !== 0 ? (
                            <Stack sx={{
                                p: 4,
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                color: 'grey.800',
                                mb: 2, 
                            }}>
                                <Typography variant="body2" align="left" sx={{ fontWeight: "bold", color: "grey.600", lineHeight:2, ml:1 }}>
                                    SWOT Analysis
                                </Typography>
                                <Grid container sx={{ flexDirection: "row"}} spacing={4}>
                                    {swotAnalysis.map((swot, indexSwot) => (
                                    <Grid item xs={12} md={6} key={indexSwot} sx={{ display: "flex", flexDirection: "column" }}>
                                        <PlusMinusList listSubheader={swot.title} plusMinus={swot.text} icon={swot.icon} />
                                    </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                            ) : null }

                            {soarAnalysis.length !== 0 ? (
                            <Stack sx={{
                                p: 4,
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                color: 'grey.800',
                                mb: 2, 
                            }}>
                                <Typography variant="body2" align="left" sx={{ fontWeight: "bold", color: "grey.600", lineHeight:2, ml:2 }}>
                                    SOAR Analysis
                                </Typography>
                                <Grid container sx={{ flexDirection: "row"}} spacing={4}>
                                    {soarAnalysis.map((soar, indexSoar) => (
                                    <Grid item xs={12} md={6} key={indexSoar} sx={{ display: "flex", flexDirection: "column" }}>
                                        <PlusMinusList listSubheader={soar.title} plusMinus={soar.text} icon={soar.icon} />
                                    </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                            ) : null }

                            {scenarios.length !== 0 ? (
                            <Stack sx={{
                                p: 4,
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                color: 'grey.800',
                                mb: 2, 
                            }}>
                                <Grid container sx={{ mb: 4, flexDirection: "row"}} spacing={6}>
                                    {scenarios.map((scenario, indexScenario) => (
                                    <Grid item xs={12} md={6} key={indexScenario} sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="body2" align="left" sx={{ fontWeight: "bold", color: "grey.600", lineHeight:2 }}>
                                            {`${scenario.title} Scenario `}
                                        </Typography>
                                        <Typography variant="body1" align="left">
                                            {scenario.text}
                                        </Typography>
                                    </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                            ) : null }

                            {plusMinus.length !== 0 ? (
                            <Stack sx={{
                                p: 2,
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                color: 'grey.800',
                                mb: 2, 
                            }}>
                                <Grid container sx={{ mb: 4, flexDirection: "row"}} spacing={6}>
                                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                                        <PlusMinusList listSubheader="Pluses (+)" plusMinus={plusMinus[0].text} icon={plusMinus[0].icon} />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                                        <PlusMinusList listSubheader="Minuses (-)" plusMinus={plusMinus[1].text} icon={plusMinus[1].icon} />
                                    </Grid>
                                </Grid> 
                            </Stack>
                            ) : null }

                            {troubleshoot.length !== 0 ? (
                            <Stack sx={{
                                p: 2,
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                color: 'grey.800',
                                mb: 2, 
                            }}>
                                <Grid container sx={{ mb: 4, flexDirection: "row"}}>
                                    <Grid item sx={{ display: "flex" }}>
                                        <CustomList listSubheader="Troubleshoot" takeaways={troubleshoot} icon="eva:alert-triangle-outline" />
                                    </Grid>
                                </Grid> 
                            </Stack>
                            ) : null }

                            {rationalConclusion.length !== 0 ? (
                            <Stack sx={{
                                p: 4,
                                border: 1,
                                borderColor: "grey.300",
                                borderRadius: 2,
                                color: 'grey.800',
                                mb: 2, 
                            }}>
                                <Typography variant="body2" align="left" sx={{ fontWeight: "bold", color: "grey.600", mb:2 }}>
                                    Rational Conclusion
                                </Typography>
                                <Typography variant="body1" align="left" sx={{ fontWeight: "bold" }}>
                                    {rationalConclusion.title}
                                </Typography>
                                <Typography variant="body1" align="left">
                                    {rationalConclusion.desc}
                                </Typography>
                            </Stack>
                            ) : null }

                            {isThinking && (
                            <Stack direction="row" justifyContent='flex-start' sx={{ mb: 2, width: "100%" }}>
                                <Stack sx={{ textAlign: 'left', mb: 2, width: "100%" }}>
                                    <ThinkTime isHelp />
                                    <Skeleton variant="rounded" width="100%" height={60} sx={{ bgcolor: 'grey.200', mb: 1 }} />
                                </Stack>
                            </Stack>
                            )}

                        </Stack>

                    </Stack>
                </Stack>

                {discussion.length > 0 ? (
                <BoardroomFooter 
                    isNew 
                    isPaid={user.tier === "paid"} 
                    onGenerateTakeaways={handleTakeaways}
                    activeTakeways={takeaways.length !== 0} 
                    onGenerateScenarios={handleScenarios}
                    activeScenarios={scenarios.length !== 0}
                    onGeneratePlusMinus={handlePlusMinus}
                    activePlusMinus={plusMinus.length !== 0}
                    onGenerateRationalConclusion={handleRationalConclusion}
                    activeRationalConclusion={rationalConclusion.length !== 0}
                    onGenerateSwotAnalysis={handleSwotAnalysis}
                    activeSwotAnalysis={swotAnalysis.length !== 0}
                    onGenerateSoarAnalysis={handleSoarAnalysis}
                    activeSoarAnalysis={soarAnalysis.length !== 0}
                    onGenerateTroubleshoot={handleTroubleshoot}
                    activeTroubleshoot={troubleshoot.length !== 0}
                    />
                ) : null }
            </Stack>
        </Card>
    </>
    );
}
