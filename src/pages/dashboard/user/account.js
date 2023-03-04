import { useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { Container, Tab, Tabs, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
// sections
import { AccountGeneral } from '../../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

UserAccountPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Account Settings | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>

        <AccountGeneral />

      </Container>
    </>
  );
}
