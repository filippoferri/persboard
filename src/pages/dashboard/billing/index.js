import React, { useState, useEffect } from 'react';
import axios from 'axios';
// next
import Head from 'next/head';
import { m } from "framer-motion";

import { 
    Container, Grid, Stack, Card, Box, Typography, Chip, Divider,
    TableContainer, Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// Router
// import { useRouter } from 'next/router';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
// Show right date in the payment table
import { format } from 'date-fns';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';

// utils
import getStripe from '../../../utils/getStripe';
import { FIREBASE_API } from '../../../config-global';

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
        borderColor: "primary.darker",
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
    const [totalBilled, setTotalBilled] = useState(14.99);
    const [cpc, setCpc] = useState();
    const [credits, setCredits] = useState(user.credits);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const cpcFinal = totalBilled / selectedBox;
        setCpc(cpcFinal.toFixed(2));
    }, [selectedBox, totalBilled]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading state to true
    
        try {
        const stripe = await getStripe();
        const response = await axios.post('/api/checkout_sessions', {
            quantity: selectedBox,
            price: totalBilled,
        });
        const { sessionId } = response.data;
        const result = await stripe.redirectToCheckout({ sessionId });
    
        if (result.error) {
            console.log(result.error.message);
        }
        } catch (error) {
        console.error('Error in handleSubmit:', error);
        } finally {
        setLoading(false); // Reset loading state to false
        }
    };
    
    

    useEffect(() => {
        const app = initializeApp(FIREBASE_API);
        const db = getFirestore(app);
        
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

    // Inside your PageBilling component, add this useState and useEffect
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                // Replace 'CUSTOMER_ID' with the actual customer ID that you saved during customer creation in Stripe
                const response = await axios.get(`/api/list_payments?customerId=${user.stripeCustomerId}`);
                setPayments(response.data.data);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };
    
        if (user.stripeCustomerId) {
            fetchPayments();
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.stripeCustomerId]);    


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

            <Grid container spacing={6}>
                <Grid item xs={12} md={5}>
                    <Card sx={{mt: 3, p: 2}}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Balance
                        </Typography>
                        <Typography variant="body1" sx={{color: 'text.secondary'}}>
                            You have <b>{credits}</b> remaining.
                        </Typography>
                        <Typography variant="body1" sx={{color: 'text.secondary'}}>
                            Credit cost per board advice: 1
                        </Typography>
                        <Typography variant="body1" sx={{color: 'text.secondary', mb: 1.5}}>
                            Time cost per board advice: 10 to 15 seconds
                        </Typography>
                    </Box>

                    {payments.length > 0 && (
                    <Box sx={{ p: 2}}>
                        <Typography variant="h4" gutterBottom>
                            Charge Overview
                        </Typography>

                        <TableContainer >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{w:40}}>Date</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                        { payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{format(new Date(payment.created * 1000), 'PPP')}</TableCell>
                                            <TableCell>${(payment.amount / 100).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Label color="success">{payment.status}</Label>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    )}
                    </Card>

                    {payments.length === 0 && (
                        <Box sx={{ p: 2, textAlign: "center", mt: 4, color: "grey.500" }}>
                            <Typography variant="body2" gutterBottom>Your payments will appear here.</Typography>
                        </Box>
                    )}
                </Grid>
                <Grid item xs={12} md={5}>
                    
                    <Card sx={{mt: 3, mb: 5, p:4, backgroundColor: "grey.200", borderRadius: 2}}>
                        <Typography variant="h4">
                            Buy Credits <Chip label="Powered by Stripe" size="small" color="primary" />
                        </Typography>
                        <Box sx={{ display: "flex", mt:4, mb:2, justifyContent: "center" }}>
                            <Box sx={{ ...boxStyled, backgroundColor: selectedBox === 50 ? "primary.main" : "white", color: selectedBox === 50 ? "white" : "inherit" }} onClick={() => handleBoxClick(50)}>
                            50
                            </Box>
                            <Box sx={{ ...boxStyled, backgroundColor: selectedBox === 100 ? "primary.main" : "white", color: selectedBox === 100 ? "white" : "inherit" }} onClick={() => handleBoxClick(100)}>
                            100
                            </Box>
                            <Box sx={{ ...boxStyled, backgroundColor: selectedBox === 500 ? "primary.main" : "white", color: selectedBox === 500 ? "white" : "inherit" }} onClick={() => handleBoxClick(500)}>
                            500
                            </Box>
                            <Box sx={{ ...boxStyled, backgroundColor: selectedBox === 1000 ? "primary.main" : "white", color: selectedBox === 1000 ? "white" : "inherit" }} onClick={() => handleBoxClick(1000)}>
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

                            <LoadingButton 
                                fullWidth size="large" 
                                type="submit" 
                                variant="contained" 
                                sx={{ mt: 5, mb: 3 }}
                                onClick={handleSubmit}
                                loading={loading} 
                            >
                                Buy Credits
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
                    
                </Grid>
            </Grid>
        </Container>
    </m.div>
    </>
    );
}
