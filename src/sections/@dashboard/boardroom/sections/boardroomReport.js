import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import CustomList from '../../../../components/list';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

BoardroomReport.propTypes = {
    question: PropTypes.string,
    discussion: PropTypes.array,
    takeaways: PropTypes.array,
};

// ----------------------------------------------------------------------
export default function BoardroomReport({ question,discussion,takeaways }) {

    const isDesktop = useResponsive('up', 'md');

    return (
        <Stack sx={{ p:2.5}}>

            <Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                    Objective
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    {question}
                </Typography>
            </Box>

            <Box sx={{mb:3}}>
                <Typography variant="h4" sx={{ mb: 1 }}>
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

                                {advice.text}

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



            {takeaways.length !== 0 ? (
            <Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                    Action Items
                </Typography>
                <CustomList takeaways={takeaways} />
            </Box> ) : null }

        </Stack>
    );
}