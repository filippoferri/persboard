import Head from 'next/head';
import { useState } from 'react';
import { Container, Grid, Typography, Button } from '@mui/material';
import { m } from "framer-motion";
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
// routes
import { useRouter } from 'next/router';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// firebase api
import { FIREBASE_API } from '../../../config-global';
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import SurveyLayout from '../../../layouts/survey';
// import questions
import QuestionOne from './questions/one';
import QuestionTwo from './questions/two';
import QuestionThree from './questions/three';
import QuestionFour from './questions/four';
import CreateProfile from './questions/create';
// components
import { useSettingsContext } from '../../../components/settings';
// import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

SurveyOne.getLayout = (page) => <SurveyLayout>{page}</SurveyLayout>;

// ----------------------------------------------------------------------

const variants = {
    hidden: {
            opacity: 0,
            y: 50,
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

export default function SurveyOne() {
    const { themeStretch } = useSettingsContext();

    const router = useRouter();
    const handleGetStarted = (profileData) => {
        handleSaveProfile(profileData);
        router.push({ pathname: PATH_DASHBOARD.welcome });
    };

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const [step, setStep] = useState(1);
    const [data, setData] = useState({});

    const handleNextStep = (stepData) => {
        setData((prevData) => ({ ...prevData, ...stepData }));
        setStep((prevStep) => prevStep + 1);
    };

    const handlePrevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleData = (stepData) => {
        setData(stepData);
    };

    const handleSaveProfile = async (profileData) => {
        try {
            // const profileRef = doc(collection(db, 'users', user && user.uid, 'myProfile'));
            const userRef = doc(db, 'users', user && user.uid);
            const dataProfile = {
                // other user data
                myProfile: [profileData.optionOne, profileData.optionTwo, profileData.optionThree, profileData.optionFour]
            };            
            await setDoc(userRef, dataProfile);
            // await setDoc(profileRef, profileData);
            handleNextStep(profileData);
        } catch (error) {
            console.error('Error adding director:', error);
        }
    };

    return (
        <>
        <Head>
            <title>Survey | Personal Board</title>
        </Head>

        <Container maxWidth={themeStretch ? false : 'xl'}>
            {step === 1 && 
                <m.div
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                >
                    <Grid container spacing={0} sx={{ justifyContent: "center" }}>
                        <Grid xs={12} md={4} item sx={{display: "flex", flexDirection: "column", justifyContent:"center", alignItems:"center", height: `calc(100vh - 14vh)` }}>
                                <Typography variant='h3' sx={{ textAlign: "center", lineHeight: '1.3', mb: 2 }}>Your Personal Board begins with you. </Typography>
                                <Typography variant='body1' sx={{ textAlign: "center" }}>Let&apos;s start by exploring what makes you great.</Typography>
                                <Button     
                                    variant="contained" size="large" 
                                    onClick={() => handleNextStep({})}
                                    sx={{ mt: 4, mb: 1 }}>
                                    Start
                                </Button>
                                <Typography variant='body2'>Takes 1 minute</Typography>
                        </Grid>
                    </Grid>
                </m.div>
            }
            {step === 2 && (
                <m.div
                initial="hidden"
                animate="visible"
                variants={variants}
                >
                    <QuestionOne
                        dataFromPrevStep={data} 
                        onNextStep={handleNextStep} 
                        onPrevStep={handlePrevStep}
                        onData={handleData}
                    />
            </m.div>
            )}
            {step === 3 && (
                <m.div
                initial="hidden"
                animate="visible"
                variants={variants}
                >
                    <QuestionTwo
                        dataFromPrevStep={data} 
                        onNextStep={handleNextStep} 
                        onPrevStep={handlePrevStep}
                    />
            </m.div>
            )}
            {step === 4 && (
                <m.div
                initial="hidden"
                animate="visible"
                variants={variants}
                >
                    <QuestionThree
                        dataFromPrevStep={data} 
                        onNextStep={handleNextStep} 
                        onPrevStep={handlePrevStep}
                    />
            </m.div>
            )}
            {step === 5 && (
                <m.div
                initial="hidden"
                animate="visible"
                variants={variants}
                >
                    <QuestionFour
                        dataFromPrevStep={data} 
                        onNextStep={handleNextStep} 
                        onPrevStep={handlePrevStep}
                        onSaveProfile={handleSaveProfile} 
                    />
            </m.div>
            )}
            {step === 6 && (
                <m.div
                initial="hidden"
                animate="visible"
                variants={variants}
                >
                    <CreateProfile 
                        dataFromPrevStep={data} 
                        onGetStarted={handleGetStarted} 
                    />
            </m.div>
            )}
        </Container>
        </>
    );
}