import PropTypes from 'prop-types';
import { Box, Stack, Typography, Grid } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import CustomList from '../../../../components/list';
import PlusMinusList from '../../../../components/plus-minus-list';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

BoardroomReport.propTypes = {
    question: PropTypes.string,
    discussion: PropTypes.array,
    takeaways: PropTypes.array,
    swotAnalysis: PropTypes.array,
    soarAnalysis: PropTypes.array,
    scenarios: PropTypes.array,
    plusMinus: PropTypes.array,
    rationalConclusion: PropTypes.array,
};

// ----------------------------------------------------------------------
export default function BoardroomReport({ 
    question,
    discussion,
    takeaways,
    swotAnalysis,
    soarAnalysis,
    scenarios,
    plusMinus,
    rationalConclusion,
}) {

    const isDesktop = useResponsive('up', 'md');

    return (
        <Stack sx={{ p:2.5}}>

            <Box>
                <Typography variant="h4" sx={{ mb: 1, ml: 1 }}>
                    Objective
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, ml: 1 }}>
                    {question}
                </Typography>
            </Box>

            <Box sx={{mb:3}}>
                <Typography variant="h4" sx={{ mb: 1, ml: 1 }}>
                    Discussion
                </Typography>
                {discussion.length === 0 ? (
                    <Typography variant="body1" align="center" sx={{color: "#919EAB"}}>
                        The discussion is empty.
                    </Typography>
                ) : (
                    discussion.map((advice, index) => (
                        <Box key={index}>
                            <Box sx={{
                                backgroundColor: "#F4F6F8",
                                p: 3,
                                pl: isDesktop ? 8 : 3,
                                borderRadius: 1,
                                mb: 1,
                                position: "relative"
                            }}
                            >
                                <Box sx={isDesktop ? 
                                    {
                                        position: "absolute", 
                                        left: "16px", 
                                        top: 20
                                    } : null }>
                                    <Iconify width={32} icon="ic:baseline-format-quote" sx={{color: "grey.500"}} />
                                </Box>

                                <Stack    
                                    dangerouslySetInnerHTML={{
                                        __html: `<div>${advice.text.replace(/\n/g, "<br />")}</div>`,
                                    }}
                                />

                                <Typography
                                variant='caption'
                                component='div'
                                sx={{ 
                                    fontWeight: 'bold', mt: 2 }}
                            >
                                {advice.fullName} | {advice.role}
                            </Typography>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            {swotAnalysis.length !== 0 || soarAnalysis.length !== 0 || scenarios.length !== 0  || plusMinus.length !== 0 || rationalConclusion.length !== 0 ? (
            <Box>
                <Typography variant="h4" sx={{ mb: 1, ml: 1 }}>
                    Make a decision
                </Typography>
            </Box>
            ) : null}

            {swotAnalysis && swotAnalysis.length !== 0 ? (
            <Stack sx={{
                p: 4,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                color: 'grey.800',
                mb: 2, 
            }}>
                <Typography variant="body2" align="left" sx={{ textTransform: "uppercase", fontWeight: "bold", color: "grey.600", lineHeight:2, ml:1 }}>
                    SWOT Analysis
                </Typography>
                <Grid container sx={{ flexDirection: "row"}} spacing={4}>
                    {swotAnalysis.map((swot, indexSwot) => (
                    <Grid item xs={12} md={6} key={indexSwot} sx={{ display: "flex", flexDirection: "column" }}>
                        <PlusMinusList listSubheader={swot.title} plusMinus={swot.text} icon={swot.icon} />
                    </Grid>
                    ))}
                </Grid>
            </Stack>
            ) : null}

            {soarAnalysis && soarAnalysis.length !== 0 ? (
            <Stack sx={{
                p: 4,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                color: 'grey.800',
                mb: 2, 
            }}>
                <Typography variant="body2" align="left" sx={{ textTransform: "uppercase", fontWeight: "bold", color: "grey.600", lineHeight:2, ml:2 }}>
                    SOAR Analysis
                </Typography>
                <Grid container sx={{ flexDirection: "row"}} spacing={4}>
                    {soarAnalysis.map((soar, indexSoar) => (
                    <Grid item xs={12} md={6} key={indexSoar} sx={{ display: "flex", flexDirection: "column" }}>
                        <PlusMinusList listSubheader={soar.title} plusMinus={soar.text} icon={soar.icon} />
                    </Grid>
                    ))}
                </Grid>
            </Stack>
            ) : null}

            {scenarios && scenarios.length !== 0 ? (
            <Stack sx={{
                p: 4,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                color: 'grey.800',
                mb: 2, 
            }}>
                <Grid container sx={{ mb: 4, flexDirection: "row"}} spacing={6}>
                    {scenarios.map((scenario, indexScenario) => (
                    <Grid item xs={12} md={6} key={indexScenario} sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body2" align="left" sx={{ fontWeight: "bold", color: "grey.600", lineHeight:2, mb:2 }}>
                            {`${scenario.title} Scenario `}
                        </Typography>
                        <Typography variant="body1" align="left">
                            {scenario.text}
                        </Typography>
                    </Grid>
                    ))}
                </Grid>
            </Stack>
            ) : null}

            {plusMinus && plusMinus.length !== 0 ? (
            <Stack sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                color: 'grey.800',
                mb: 2, 
            }}>
                <Grid container sx={{ mb: 4, flexDirection: "row"}} spacing={6}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                        <PlusMinusList listSubheader="Pluses (+)" plusMinus={plusMinus[0].text} icon={plusMinus[0].icon} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
                        <PlusMinusList listSubheader="Minuses (-)" plusMinus={plusMinus[1].text} icon={plusMinus[1].icon} />
                    </Grid>
                </Grid> 
            </Stack>
            ) : null}

            {rationalConclusion && rationalConclusion.length !== 0 ? (
            <Stack sx={{
                p: 4,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                color: 'grey.800',
                mb: 2, 
            }}>
                <Typography variant="body2" align="left" sx={{ fontWeight: "bold", color: "grey.600", mb:2 }}>
                    Rational Conclusion
                </Typography>
                <Typography variant="body1" align="left" sx={{ fontWeight: "bold" }}>
                    {rationalConclusion.title}
                </Typography>
                <Typography variant="body1" align="left">
                    {rationalConclusion.desc}
                </Typography>
            </Stack>
            ) : null}

            {takeaways && takeaways.length !== 0 ? (
            <>
            <Box>
                <Typography variant="h4" sx={{ mb: 1, ml: 1 }}>
                    Next Steps
                </Typography>
            </Box>

            <Stack sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 1,
                color: 'grey.800',
                mb: 2, 
            }}>
                <Grid container sx={{ mb: 4, flexDirection: "row"}}>
                    <Grid item sx={{ display: "flex" }}>
                        <CustomList listSubheader="Action Items" takeaways={takeaways} />
                    </Grid>
                </Grid> 
            </Stack>
            </>
            ) : null }

        </Stack>
    );
}