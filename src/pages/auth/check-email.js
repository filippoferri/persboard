import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function Cancel() {
const router = useRouter();

const handleGoBack = () => {
    // todo: Replace with the route you want to redirect to
    router.push('/dashboard/billing');
};

const emailRecovery =
    typeof window !== 'undefined' ? sessionStorage.getItem('email-recovery') : '';

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
            Request sent successfully!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, textAlign: "center" }}>
            We&apos;ve sent a link to <b>{emailRecovery}</b>.<br />
            Please follow that link to reset your password.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoBack}>
            Personal Board
        </Button>
    </Box>
    </Container>
);
}