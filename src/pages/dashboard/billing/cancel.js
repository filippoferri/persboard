import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function Cancel() {
const router = useRouter();

const handleGoBack = () => {
    // todo: Replace with the route you want to redirect to
    router.push('/dashboard/billing');
};

return (
    <Container maxWidth="sm">
    <Box
        sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        justifyContent: 'center',
        }}
    >
        <Typography variant="h4" gutterBottom>
        Payment Canceled
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, textAlign: "center" }}>
            It seems like you&apos;ve canceled the payment process. If you want to try again, please go back to the billing page.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoBack}>
        Go Back
        </Button>
    </Box>
    </Container>
);
}
