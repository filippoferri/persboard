import * as React from 'react';
import { Paper, Stack, Box, Grid, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';

// sections
import AdvisoryBoard from '../../../../sections/@dashboard/projects/AdvisoryBoard';

// ----------------------------------------------------------------------

WelcomeBoardroom.propTypes = {
	dataFromPrevStep: PropTypes.object,
	onPrevStep: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function WelcomeBoardroom({dataFromPrevStep, onPrevStep}) { 

    const question = dataFromPrevStep[0].question;
    const directors = dataFromPrevStep[1].directors;

    console.log('directors', directors);

    return (
    <>
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                mt: 2,
                mb: 4,
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Boardroom
                </Typography>
                <Typography variant="p" gutterBottom>
                    Get guidance on your toughest question
                </Typography>
            </Box>
            <Box sx={{ flexShrink: 0 }}></Box>
        </Stack>

        <Paper variant="outlined" sx={{ flexGrow: 1 }}>
            <Grid container spacing={0} sx={{minHeight: '600px'}}>
                {/*/  Advisory Board */}
                <Grid item xs={3} sx={{borderRight: '1px solid #DFE3E8'}}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight: 'bold', color: '#637381',bgcolor: '#f4f6f8'}}>
                        Advisory Board
                    </Box>
                    <AdvisoryBoard directors={directors} />
                </Grid>

                <Grid container item xs={9} direction="column" sx={{flexGrow: 1}} >

                    <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight:'bold', color:'#637381', bgcolor: '#f4f6f8' }}>
                        Meaningful Discussion
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', p:2, pb: 4 }}>

                        {/*/  You */}
                        <Grid container justifyContent={'flex-end'}>
                        <Grid item sx={{ textAlign: 'right', mb: 2 }}>
                            <Typography 
                            variant='caption' 
                            sx={{ fontWeight:'bold', pr: 1 }}>
                                You
                            </Typography>
                            <Box sx={{
                                backgroundColor:"#d2e9fc", 
                                p: 2, 
                                borderRadius: 1, 
                                borderTopRightRadius: 0,
                                mb: 1,
                                maxWidth: '600px',
                            }}>
                                {question}
                            </Box>
                        </Grid>
                        </Grid>


                        {/*/  Limits */}  
                        <Grid container justifyContent={'center'}>
                            <Grid item justifyContent="center">
                                <Typography variant="body1" align="center" sx={{color: "#919EAB", pt: 4, pb: 5 }}>
                                {/* {remainingCredits > 0 ? `${remainingCredits} credits remaining.` : 'No credits remaining. Please upgrade your account.'} Need more? Upgrade now! */}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ flexGrow: 1 }}>
                                <Box sx={{display: 'flex', backgroundColor: "#D1E9FC", p: 2, borderRadius: 1, alignItems: "center"}}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant='h5'>Engage in a dynamic exchange of ideas</Typography>
                                    <Typography variant='h5' sx={{color: "#2065D1"}}>Achieve greater clarity and direction</Typography>
                                </Box>
                                <Box>
                                <Button variant="contained" size="large" >Upgrade Now</Button>
                                </Box>
                                </Box>
                            </Grid>
                        </Grid>

                    </Box>

                </Grid>
            </Grid>
        </Paper>
    </>
    );
}
