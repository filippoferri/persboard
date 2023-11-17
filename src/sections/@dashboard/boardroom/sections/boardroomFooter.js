// @mui
import { Stack, Chip, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
// import useResponsive from '../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

BoardroomFooter.propTypes = {
    isNew: PropTypes.bool,
    isPaid: PropTypes.bool,
    onGenerateTakeaways: PropTypes.func,
    activeTakeways: PropTypes.bool,
    onGenerateSwotAnalysis: PropTypes.func,
    activeSwotAnalysis: PropTypes.bool,    
    onGenerateSoarAnalysis: PropTypes.func,
    activeSoarAnalysis: PropTypes.bool,
    onGenerateScenarios: PropTypes.func,
    activeScenarios: PropTypes.bool,
    onGeneratePlusMinus: PropTypes.func,
    activePlusMinus: PropTypes.bool,
    onGenerateTroubleshoot: PropTypes.func,
    activeTroubleshoot: PropTypes.bool,
    onGenerateRationalConclusion: PropTypes.func,
    activeRationalConclusion: PropTypes.bool,
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
    onGenerateTroubleshoot,
    activeTroubleshoot,
}) {

    // const isDesktop = useResponsive('up', 'md');

    const router = useRouter();
    const handleNewAdvice = () => {
        router.push({ pathname: PATH_DASHBOARD.welcome });
    };

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
                <>
                <Tooltip title="Suggest action ttems" placement="top">
                    <div>
                    <Chip label="Action Items" color="primary" onClick={onGenerateTakeaways} disabled={activeTakeways} />
                    </div>
                </Tooltip>
                <Tooltip title={ isPaid ? "Provide SWOT analysis" : "Buy credits to unlock" } placement="top">
                    <div>
                    <Chip label="SWOT Analysis" color="primary" onClick={onGenerateSwotAnalysis} disabled={activeSwotAnalysis || !isPaid} title="Buy credits to unlock" />
                    </div>
                </Tooltip>
                {/* <Tooltip title={ isPaid ? "Provide SOAR analysis" : "Buy credits to unlock" } placement="top">
                    <div>
                    <Chip label="SOAR" color="primary" onClick={onGenerateSoarAnalysis} disabled={activeSoarAnalysis || !isPaid} />
                    </div>
                </Tooltip> */}
                <Tooltip title={ isPaid ? "Define best-case and worst-case scenarios" : "Buy credits to unlock" } placement="top">
                    <div>
                    <Chip label="Best/Worst Scenarios" color="primary" onClick={onGenerateScenarios} disabled={activeScenarios || !isPaid} />
                    </div>
                </Tooltip>
                <Tooltip title={ isPaid ? "Collect pluses and minuses" : "Buy credits to unlock" } placement="top">
                    <div>
                    <Chip label="Pluses vs Minuses" color="primary" onClick={onGeneratePlusMinus} disabled={activePlusMinus || !isPaid} />
                    </div>
                </Tooltip>
                <Tooltip title={ isPaid ? "Identify the barriers to success" : "Buy credits to unlock" } placement="top">
                    <div>
                    <Chip label="Troubleshoot" color="primary" onClick={onGenerateTroubleshoot} disabled={activeTroubleshoot || !isPaid} />
                    </div>
                </Tooltip>
                <Tooltip title={ isPaid ? "Find a rational conclusion" : "Buy credits to unlock" } placement="top">
                    <div>
                    <Chip label="Rational Conclusion" color="primary" onClick={onGenerateRationalConclusion} disabled={activeRationalConclusion || !isPaid} />
                    </div>
                </Tooltip>
                </>
            )}
        </Stack>
    );
}


