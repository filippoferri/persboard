import PropTypes from 'prop-types';
import { Grid, Box, Typography } from '@mui/material';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

QuestionFour.propTypes = {
    dataFromPrevStep: PropTypes.object,
    onNextStep: PropTypes.func,
    onPrevStep: PropTypes.func,
};

// ----------------------------------------------------------------------

const styledBoxFour = {
    display: 'flex',
    alignItems: 'flex-start',
    width: "100%",
    p: 1,
    backgroundColor: 'info.lighter',
    color: 'info.dark',
    '&:hover': {
        backgroundColor: 'info.light',
        color: 'info.darker',
    },
    border: 1,
    borderColor: 'info.dark',
    borderRadius: 1,
    mb: 1,
    cursor: 'pointer',
};

const styledChipFour = {
    pl: 1,
    pr: 1,
    mr: 1,
    backgroundColor: 'white',
    color: 'info.dark',
    '&:hover': {
        color: 'info.light',
    },
    border: 1,
    borderColor: 'info.dark',
    borderRadius: 0.5,
};

const optionsFour = [
{
    value: 'loves hearing kind, encourage, or supporte words from the partner',
    label: 'Words of Affirmation - Hearing kind, encouraging, or supportive words',
},
{
    value: 'loves when the partner does things that help out or make their life easier',
    label: 'Acts of Service - Having your partner taking care of making your life easier',
},
{
    value: 'loves getting thoughtful or meaningful gifts from the partner',
    label: 'Receiving Gifts - Getting thoughtful or meaningful gifts from your partner',
},
{
    value: 'loves spending undivided, focused time with the partner, doing things together',
    label: 'Quality Time - Spending time with your partner, doing things together',
},
{
    value: 'loves feeling connected and loved through physical touch, like holding hands, hugging, or cuddling',
    label: 'Physical Touch - Feeling connected and loved through physical touch',
},
];

export default function QuestionFour({ onNextStep, onPrevStep }) {

const handleOptionClick = (optionValue) => {
    onNextStep({ optionFour: optionValue });
}; 

return (
    <Grid container spacing={0} sx={{ justifyContent: 'center' }}>
    <Grid
        xs={4}
        item
        sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        }}
    >
        <Box
            sx={{ mb: 2, pr: 3, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={onPrevStep}
        >
            <Iconify icon='eva:arrow-back-outline' /> Back
        </Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
            Last question, which of these best represents your ideal love language?
        </Typography>
        {optionsFour.map((option, index) => (
        <Box
            key={option.value}
            sx={styledBoxFour}
            onClick={() => handleOptionClick(option.value)}
        >
            <Box sx={styledChipFour}>{String.fromCharCode(65 + index)}</Box>
            <Box sx={{ display: 'flex', flexGrow: 1 }}>{option.label}</Box>
        </Box>
        ))}
    </Grid>
    </Grid>
);
    
}
