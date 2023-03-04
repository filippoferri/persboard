// next
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
// @mui
import { Container, Stack, Box, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import Iconify from '../../../components/iconify';
// sections
import { AccountGeneral } from '../../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

BoardroomPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function BoardroomPage() {
    const { themeStretch } = useSettingsContext();

    return (
    <>
        <Head>
        <title>Boardroom | Personal Board</title>
        </Head>

        <Container maxWidth={themeStretch ? false : 'lg'}>

        <Stack
            direction="row"
            alignItems="center"
            sx={{
                mt: 2,
                mb: 4,
            }}
            >
            <Box sx={{ flexGrow: 1, pl: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Boardroom
                </Typography>
            </Box>
        </Stack>


        </Container>
    </>
    );
}
