import React, { useEffect, useCallback } from 'react';

import axios from 'axios';

import Head from 'next/head';
import { m } from "framer-motion";
import { Container, Grid, Card, Box, Typography, Button } from '@mui/material';
// next
import { useRouter } from 'next/router';
// Firebase/Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// config
import { FIREBASE_API } from '../../../config-global';
// stripe
import { getSessionDetails } from '../../api/stripe_api';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';

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
    const { session_id } = router.query;

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const createStripeCustomer = async (email, uid) => {
        try {
            await axios.post('/api/create_customer', {
                email,
                uid,
            });
        } catch (error) {
            console.error('Error creating Stripe customer:', error);
        }
    };

    const updateCredits = useCallback(async () => {
        try {
            const userRef = doc(db, 'users', user && user.uid);
        
            // Create Stripe customer
            await createStripeCustomer(user.email, user.uid);        
            // Retrieve the checkout session details from your server or Stripe directly
            const sessionData = await getSessionDetails(session_id);
            const purchasedCredits = parseInt(sessionData.metadata.credits, 10);
        
            // Increment the user's credits
            await updateDoc(userRef, {
                credits: increment(purchasedCredits),
            });
        } catch (error) {
            console.error('Error updating credits:', error);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, session_id]);
    
    useEffect(() => {
        if (session_id) {
            updateCredits();
        }
    }, [session_id, updateCredits]);

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
                        <Typography variant="subtitle1" sx={{ mb: 3, textAlign: "center" }}>Your payment was successful, and your credits have been updated.</Typography>
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
