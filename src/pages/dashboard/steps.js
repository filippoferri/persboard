// next
import Head from 'next/head';
//import { Container, Typography } from '@mui/material';
import React, { useState } from 'react';

import { Container, Grid, Box, Stack, Button } from '@mui/material';
import { m } from "framer-motion";
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';
// assets
import WelcomeIntro from '../../sections/@dashboard/general/welcome/intro';
import WelcomeQuestion from '../../sections/@dashboard/general/welcome/question';
import WelcomeBoard from '../../sections/@dashboard/general/welcome/board';
import WelcomeBoardroom from '../../sections/@dashboard/general/welcome/boardroom';
//
import { varFade } from '../../components/animate/variants';

// ----------------------------------------------------------------------

PageWelcome.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

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

export default function PageWelcome() {
  const { themeStretch } = useSettingsContext();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const handleNextStep = (stepData) => {
    setData((prevData) => ({ ...prevData, ...stepData }));
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleRestart = () => {
    setStep((prevStep) => prevStep - 2);
  };

  const handleData = (stepData) => {
    setData(stepData);
  };

  return (
    <>
      <Head>
        <title> Welcome | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>

        {step === 1 && 
        <m.div
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <WelcomeQuestion onNextStep={handleNextStep} onData={handleData}  />
        </m.div>
        }

        {step === 2 && (
        <m.div
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <WelcomeBoard
            dataFromPrevStep={data}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
          />
        </m.div>
        )}

        {step === 3 && (
        <m.div
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <WelcomeBoardroom
            dataFromPrevStep={data}
            onPrevStep={handlePrevStep}
            onRestart={handleRestart}
          />
        </m.div>
        )}

      </Container>
    </>
  );
}
