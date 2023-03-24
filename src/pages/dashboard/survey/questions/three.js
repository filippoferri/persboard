import PropTypes from 'prop-types';
import { Grid, Box, Typography } from '@mui/material';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

QuestionThree.propTypes = {
    dataFromPrevStep: PropTypes.object,
    onNextStep: PropTypes.func,
    onPrevStep: PropTypes.func,
};

// ----------------------------------------------------------------------

const styledBoxThree = {
display: 'flex',
alignItems: 'flex-start',
width: "100%",
p: 1,
pr: 2,
backgroundColor: 'success.lighter',
color: 'success.darker',
'&:hover': {
    backgroundColor: 'success.light',
    color: 'success.darker',
},
border: 1,
borderColor: 'success.dark',
borderRadius: 1,
mb: 1,
cursor: 'pointer',
};

const styledChipThree = {
    pl: 1,
    pr: 1,
    mr: 1,
    backgroundColor: 'white',
    color: 'success.dark',
    '&:hover': {
        color: 'success.light',
    },
    border: 1,
    borderColor: 'success.dark',
    borderRadius: 0.5,
};

const optionsThree = [
    {
        value: 'has a mostly inactive lifestyle',
        label: 'Sedentary - I have a mostly inactive lifestyle',
    },
    {
        value: 'engages in light physical activity occasionally',
        label: 'Light - I engage in light physical activity occasionally',
    },
    {
        value: 'engages in moderate physical activity a few times a week',
        label: 'Moderate - I engage in moderate physical activity a few times a week',
    },
    {
        value: 'engages in regular physical activity most days of the week',
        label: 'Active - I engage in regular physical activity most days of the week',
    },
    {
        value: "is not sure about the current level of physical activity",
        label: "Not sure - I'm not sure about my current level of physical activity",
    },
];

export default function QuestionThree({ dataFromPrevStep, onNextStep, onPrevStep }) {

const handleOptionClick = (optionValue) => {
    onNextStep({ optionThree: optionValue });
};   

const optionThree= dataFromPrevStep?.optionThree;

return (
    <Grid container spacing={0} sx={{ justifyContent: 'center' }}>
    <Grid
        xs={12}
        md={4}
        item
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100vh',
        }}
    >
        <Box
            sx={{ mb: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={onPrevStep}
        >
            <Iconify icon='eva:arrow-back-outline' /> Back
        </Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
            How would you describe your current level of fitness?
        </Typography>
        {optionsThree.map((option, index) => (
            <Box
                key={option.value}
                sx={
                    optionThree === option.value
                    ? { ...styledBoxThree, borderColor: 'success.dark', border: 2 }
                    : styledBoxThree
                }
                onClick={() => handleOptionClick(option.value)}
            >
                <Box sx={
                    optionThree === option.value
                    ? { ...styledChipThree, backgroundColor: 'success.dark', color: 'white' }
                    : styledChipThree
                }>{String.fromCharCode(65 + index)}</Box>
                <Box sx={{ display: 'flex', flexGrow: 1 }}>{option.label}</Box>
                {optionThree === option.value && (
                    <Iconify icon='eva:checkmark-outline' sx={{ ml: 1}} />
                )}
            </Box>
        ))}
    </Grid>
    </Grid>
);
    
}
