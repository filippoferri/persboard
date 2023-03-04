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
import { SeoIllustration } from '../../assets/illustrations';
import { UpgradeStorageIllustration } from '../../assets/illustrations';
import {
  WelcomeIntro,
  WelcomeUpgrade,
  WelcomeTopics
} from '../../sections/@dashboard/general/welcome';
import WelcomeQuestion from '../../sections/@dashboard/general/welcome/question';
import WelcomeBoard from '../../sections/@dashboard/general/welcome/board';
import WelcomeBoardroom from '../../sections/@dashboard/general/welcome/boardroom';
//
import { varFade } from '../../components/animate/variants/';

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

  const handleData = (stepData) => {
    setData(stepData);
  };

  return (
    <>
      <Head>
        <title> Welcome | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>

        {step === 1 && <WelcomeQuestion onNextStep={handleNextStep} onData={handleData}  />}

        <m.div
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {step === 2 && (
          <WelcomeBoard
            dataFromPrevStep={data}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
          />
        )}

        {step === 3 && (
          <WelcomeBoardroom
            dataFromPrevSteps={data}
            onPrevStep={handlePrevStep}
          />
        )}
        </m.div>

      </Container>

      {/* <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <WelcomeIntro
              title={`Welcome back, \n ${user?.firstName}!`}
              quote="If you cannot do great things, do small things in a great way."
              author="Napoleon Hill"
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 600,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
              /> }
              action={<Button size="large"  variant="contained" href={PATH_DASHBOARD.projects.newProject}>Get Started</Button>}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <WelcomeUpgrade
              description="Upgrade your plan and get more advices"
              cta="Upgrade Plan"
              img={
                <UpgradeStorageIllustration
                  sx={{
                    p: 1,
                    width: 260,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                /> }
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            
            <WelcomeTopics title="Topics" />

          </Grid>
        </Grid>*/}
    </>
  );
}
