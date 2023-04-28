// @mui
import { Stack, Chip, Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useResponsive from '../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

BoardroomFooter.propTypes = {
    isNew: PropTypes.bool,
    isPaid: PropTypes.bool,
    onGenerateTakeaways: PropTypes.func,
    activeTakeways: PropTypes.bool,
    onGenerateScenarios: PropTypes.func,
    activeScenarios: PropTypes.bool,
    onGeneratePlusMinus: PropTypes.func,
    activePlusMinus: PropTypes.bool,
    onGenerateRationalConclusion: PropTypes.func,
    activeRationalConclusion: PropTypes.bool,
    onGenerateSwotAnalysis: PropTypes.func,
    activeSwotAnalysis: PropTypes.bool,    
    onGenerateSoarAnalysis: PropTypes.func,
    activeSoarAnalysis: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function BoardroomFooter({
    isNew, isPaid, 
    onGenerateTakeaways, 
    activeTakeways,
    onGenerateScenarios,
    activeScenarios,
    onGeneratePlusMinus,
    activePlusMinus,
    onGenerateRationalConclusion,
    activeRationalConclusion,
    onGenerateSwotAnalysis,
    activeSwotAnalysis,
    onGenerateSoarAnalysis,
    activeSoarAnalysis,
}) {

    const isDesktop = useResponsive('up', 'md');

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
                !isPaid ? (
                    <Stack direction="column" sx={{ width: "100%" }}>
                        <Stack direction="row" sx={{ mb:4, width: "100%", justifyContent: "space-between" }}>
                            <Chip label="Action Items" color="primary" onClick={onGenerateTakeaways} disabled={activeTakeways} />
                            <Chip label="SWOT Analysis" color="primary" disabled />
                            <Chip label="SOAR Analysis" color="primary" disabled />
                            <Chip label="Best/Worst Scenarios" color="primary" disabled />
                            <Chip label="Pluses (+) and Minuses (-)" color="primary" disabled />
                            <Chip label="Rational Conclusion" color="primary" disabled />
                        </Stack>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: isDesktop ? "row" : "column",  
                            width: "100%", 
                            backgroundColor: "primary.lighter", 
                            p: 2, 
                            borderRadius: 1, 
                            alignItems: "center" }}>
                            <Box sx={{ flexGrow: 1, mb: isDesktop ? 0 : 2 }}>
                                <Typography variant='h5' sx={{ color: "primary.darker", textAlign: isDesktop ? "left" : "center"}}>Engage in a dynamic exchange of solutions.</Typography>
                                <Typography variant='h5' sx={{ color: "primary.main", textAlign: isDesktop ? "left" : "center" }}>Achieve greater clarity and direction.</Typography>
                            </Box>
                            <Box>
                                <Button variant="outlined" size="large" onClick={handleUpgrade} >Upgrade Now</Button>
                            </Box>
                        </Box>
                    </Stack>
                ) : (
                    <>
                    <Chip label="Action Items" color="primary" onClick={onGenerateTakeaways} disabled={activeTakeways} />
                    <Chip label="SWOT" color="primary" onClick={onGenerateSwotAnalysis} disabled={activeSwotAnalysis} />
                    <Chip label="SOAR" color="primary" onClick={onGenerateSoarAnalysis} disabled={activeSoarAnalysis} />
                    <Chip label="Best/Worst Scenarios" color="primary" onClick={onGenerateScenarios} disabled={activeScenarios} />
                    <Chip label="Pluses (+) and Minuses (-)" color="primary" onClick={onGeneratePlusMinus} disabled={activePlusMinus} />
                    <Chip label="Rational Conclusion" color="primary" onClick={onGenerateRationalConclusion} disabled={activeRationalConclusion} />
                    </>
                )
            )}
        </Stack>
    );
}


