import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Grid, Button } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';

// ----------------------------------------------------------------------

WelcomeIntro.propTypes = {
	onNextStep: PropTypes.func,
};

export default function WelcomeIntro({ onNextStep }) {
    return (
    <>
        <Grid container spacing={6}>
            <Grid item xs={12}  sx={{display: 'flex', justifyContent: "center", flexDirection:"column"}}>
                <Typography variant="h3" sx={{ mb: 5, textAlign: "center" }}>
                    Receive Your Advice
                </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{display: 'flex', justifyContent: "center", flexDirection:"column"}}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
                    1. Ask Your Question
                </Typography>
                <Typography variant="body1" sx={{ mb: 5, textAlign: "center" }}>
                    Connect your data source and destination apps
                </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{display: 'flex', justifyContent: "center", flexDirection:"column"}}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
                    2. Invite Your Board 
                </Typography>
                <Typography variant="body1" sx={{ mb: 5, textAlign: "center" }}>
                    Connect your data source and destination apps
                </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{display: 'flex', justifyContent: "center", flexDirection:"column"}}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
                    3. Receive Your Advice
                </Typography>
                <Typography variant="body1" sx={{ mb: 5, textAlign: "center" }}>
                    Connect your data source and destination apps
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: "center"}}>
                <Button variant="contained" size="large" onClick={onNextStep}>
                    Get started
                </Button>
            </Grid>
        </Grid>
  </>
  );
}
