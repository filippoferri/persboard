// @mui
import { Stack, Chip, Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

BoardroomFooter.propTypes = {
    isNew: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function BoardroomFooter({isNew}) {

    const router = useRouter();
    const handleNewAdvice = () => {
        router.push({ pathname: PATH_DASHBOARD.welcome });
    };
    const handleUpgrade = () => {
        router.push({ pathname: PATH_DASHBOARD.billing.root });};

    const handleRequestFeature = () => {
        window.open('https://xmllse17mqf.typeform.com/to/tvBvCeiY', '_blank');
    };

    return (
        <Stack direction="row" spacing={1} 
            sx={{ 
                p: 2.5, 
                flexShrink: 0,
                borderTop: 1,
                borderColor: "grey.300"
            }}>
            { !isNew ? (
                <>
                <Chip label="Ask a new advice" color="primary" onClick={handleNewAdvice} />
                <Chip label="Request a new feature" color="primary" onClick={handleRequestFeature} />
                </>
            ) : (
                    <Box sx={{display: 'flex', width: "100%", backgroundColor: "primary.lighter", p: 2, borderRadius: 1, alignItems: "center"}}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant='h5' sx={{color: "primary.darker"}}>Engage in a dynamic exchange of ideas.</Typography>
                            <Typography variant='h5' sx={{color: "primary.main"}}>Achieve greater clarity and direction.</Typography>
                        </Box>
                        <Box>
                            <Button variant="outlined" size="large" onClick={handleUpgrade} >Upgrade Now</Button>
                        </Box>
                    </Box>
            )}
        </Stack>
    );
}


