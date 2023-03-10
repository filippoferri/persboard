import React, { useState, useEffect } from 'react';
import axios from 'axios';
// next
import Head from 'next/head';
import { m } from "framer-motion";

import { Container, Grid, Stack, Card, Box, Typography, Chip, Divider, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
// import { varFade } from '../../../components/animate/variants';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// utils
import getStripe from '../../../utils/getStripe';


// ----------------------------------------------------------------------

PageBilling.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

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

const boxStyled = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "50%",
    border: "1px solid #E5E5E5",
    '&:hover': {
        borderColor: "#3366FF",
    },
    cursor: "pointer",
    fontWeight: "bold",
    width: 80,
    height: 80,
    mr: 2
}

// ----------------------------------------------------------------------

export default function PageBilling() {
    const { themeStretch } = useSettingsContext();
    
    // const router = useRouter();
    const { user } = useAuthContext();

    const [selectedBox, setSelectedBox] = useState(50);
    const [totalBilled, setTotalBilled] = useState(9.99);
    const [cpc, setCpc] = useState();

    const handleBoxClick = (amount) => {
        setSelectedBox(amount);
        switch(amount) {
        case 50:
            setTotalBilled(14.99);
            break;
        case 100:
            setTotalBilled(24.99);
            break;
        case 500:
            setTotalBilled(99.99);
            break;
        case 1000:
            setTotalBilled(149.99);
            break;
        default:
            setTotalBilled(0);
        }
    };

    // const handleCPC = () => {
    //     const cpc = totalBilled / selectedBox;
    //     setCpc(cpc.toFixed(2));
    // }

    useEffect(() => {
        // handleCPC();
        const cpc = totalBilled / selectedBox;
        setCpc(cpc.toFixed(2));
    }, [selectedBox, totalBilled]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const stripe = await getStripe(); // call getStripe here to get the promise
        const { data } = await axios.post('/api/checkout_sessions', { 
            name: selectedBox,
            price: totalBilled 
        });
        const session = data.sessionId;
        const result = await stripe.redirectToCheckout({ sessionId: session });
        if (result.error) {
            console.log(result.error.message);
        }
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
                            href: PATH_DASHBOARD.advices.root,
                        },
                    ]}
                />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Card sx={{mt: 3, mb: 5, p:4, backgroundColor: "default", borderRadius: 2}}>
                        <Typography variant="h4" gutterBottom>
                            Credits used
                        </Typography>
                        <Typography variant="body1" sx={{color: 'text.secondary'}}>
                            You have <b>{user.credits}</b> credits in total, <b>{user.remainingCredits}</b> credits remaining.
                        </Typography>
                        <Typography variant="body1" sx={{color: 'text.secondary', mb: 2}}>
                            Credit cost per board advice: 1
                        </Typography>
                        <Button variant="contained" color="primary" size="large">
                            Manage Billing
                        </Button>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <form onSubmit={handleSubmit}>
                    <Card sx={{mt: 3, mb: 5, p:4, backgroundColor: "#eff3ff", borderRadius: 2}}>
                        <Typography variant="h4">
                            Buy Credits <Chip label="Powered by Stripe" size="small" color="primary" />
                        </Typography>
                        <Box sx={{ display: "flex", mt:4, mb:2, justifyContent: "center" }}>
                            <Box sx={{ ...boxStyled, backgroundColor: selectedBox === 50 ? "#3366FF" : "white", color: selectedBox === 50 ? "white" : "inherit" }} onClick={() => handleBoxClick(50)}>
                            50
                            </Box>
                            <Box sx={{ ...boxStyled, backgroundColor: selectedBox === 100 ? "#3366FF" : "white", color: selectedBox === 100 ? "white" : "inherit" }} onClick={() => handleBoxClick(100)}>
                            100
                            </Box>
                            <Box sx={{ ...boxStyled, backgroundColor: selectedBox === 500 ? "#3366FF" : "white", color: selectedBox === 500 ? "white" : "inherit" }} onClick={() => handleBoxClick(500)}>
                            500
                            </Box>
                            <Box sx={{ ...boxStyled, backgroundColor: selectedBox === 1000 ? "#3366FF" : "white", color: selectedBox === 1000 ? "white" : "inherit" }} onClick={() => handleBoxClick(1000)}>
                            1000
                            </Box>
                        </Box>
                        <Stack spacing={2.5}>
                            <Stack spacing={1} direction="row" justifyContent="center">
                                <Typography variant="h5">$</Typography>
                                <Typography variant="h2">{totalBilled}</Typography>
                            </Stack>

                            <Divider sx={{ borderStyle: 'dashed' }} />

                            <Stack 
                                direction="row" 
                                alignItems="center" 
                                justifyContent="space-between">
                                <Typography variant="h6">Total Billed</Typography>
                                <Typography variant="h6">${totalBilled}</Typography>
                            </Stack>

                            <Divider sx={{ borderStyle: 'dashed' }} />
                        </Stack>
                            <Typography component="div" variant="caption" sx={{ color: 'text.secondary', mt: 1, textAlign: "right" }}>
                                ~${cpc} per board advice
                            </Typography>

                            <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ mt: 5, mb: 3 }}>
                                Upgrade
                            </LoadingButton>

                            <Stack alignItems="center" spacing={1}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify icon="eva:shield-fill" sx={{ color: 'primary.main' }} />
                                <Typography variant="subtitle2">Secure credit card payment</Typography>
                                </Stack>

                                <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                    All payments are secured and processed by Stripe. 
                                    <br />We do not store your credit card information.
                                </Typography>
                        </Stack>
                    </Card>
                    </form>
                </Grid>
            </Grid>
        </Container>
    </m.div>
    </>
    );
}
