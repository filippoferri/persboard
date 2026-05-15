import React from 'react';

import Head from 'next/head';
import { m } from "framer-motion";
import { Container, Grid, Card, Box, Typography, Button } from '@mui/material';
// next
import { useRouter } from 'next/router';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

SuccessPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

const variants = {
    hidden: {
        opacity: 0,
        y: 30,
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

export default function SuccessPage() {
    const { themeStretch } = useSettingsContext();
    const router = useRouter();

    const handleGoDashboard = () => {
        // todo: Replace with the route you want to redirect to
        router.push('/dashboard/');
    };

    return (
        <>
        <Head>
            <title>Billing | Personal Board</title>
        </Head>

        <m.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >
        <Container maxWidth={themeStretch ? false : 'lg'}>

            <Box sx={{pl: 2}}>
                <CustomBreadcrumbs
                        heading="Billing"
                        links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Billing',
                            href: PATH_DASHBOARD.billing.root,
                        },                        {
                            name: 'Success',
                            href: PATH_DASHBOARD.billing.success,
                        },
                    ]}
                />
            </Box>



            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: '60vh',
                        justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h4" gutterBottom>Payment Successful!</Typography>
                        <Typography variant="subtitle1" sx={{ mb: 3, textAlign: "center" }}>Your payment was successful. Your credits will update automatically.</Typography>
                        <Button variant="contained" color="primary" onClick={handleGoDashboard}>
                            Enjoy
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </Container>
        </m.div>
        </>
    );
}
