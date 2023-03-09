// next
import Head from 'next/head';
import React, { useState } from 'react';
import { Container } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';
// assets
import WelcomeIntro from '../../sections/@dashboard/general/welcome/intro';

// ----------------------------------------------------------------------

PageWelcome.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageWelcome() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Welcome | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>

          <WelcomeIntro />

      </Container>
    </>
  );
}
