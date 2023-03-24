import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

CreateProfile.propTypes = {
    dataFromPrevStep: PropTypes.object,
    onGetStarted: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function CreateProfile({ dataFromPrevStep, onGetStarted }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulating progress by incrementing percentage every 1 second
        const progressInterval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 2));
        }, 80);

        return () => clearInterval(progressInterval);
    }, []);

    let text = '';
    if (progress < 24) {
        text = 'Creating your profile';
    } else if (progress < 50) {
        text = 'Selecting your AI Directors';
    } else if (progress < 74) {
        text = 'Defining areas you might like';
    } else if (progress < 98) {
        text = 'Adapting personal growth';
    } else {
        text = 'Success!'
    }

    return (
        <Grid container spacing={0} sx={{ justifyContent: 'center' }}>
            <Grid
                xs={4}
                item
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: `calc(100vh - 14vh)`,
                }}
            >
                <Box position="relative" display="inline-flex">
                    <CircularProgress variant="determinate" value={progress} size={160} thickness={2} />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            color: 'text.primary',
                        }}
                    >
                        {progress === 100 ? (
                            <Typography variant="h3" component="div" color="text.secondary">
                                100%
                            </Typography>
                        ) : (
                            <Typography variant="h3" component="div" color="text.secondary">{`${Math.round(
                                progress,
                            )}%`}</Typography>
                        )}
                    </Box>
                </Box>
                
                {progress === 100 ? (
                    <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}>
                        Your experience is ready!<br />The journey starts now.
                    </Typography>
                ) : (
                    <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}>
                        Just a moment while we personalize your experience
                    </Typography>
                )}

                <Box sx={{ height: 100}}>   
                {progress === 100 ? (
                    <Button variant="contained" size="large" onClick={() => onGetStarted(dataFromPrevStep)} sx={{ mt: 4, mb: 1 }}>
                        Let&apos;s go
                    </Button>
                ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                        {text}
                    </Typography>
                )}
                </Box>

            </Grid>
        </Grid>
    );
}
