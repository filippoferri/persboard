    import PropTypes from 'prop-types';
    import { Grid, Box, Typography } from '@mui/material';
    import Iconify from '../../../../components/iconify';

    // ----------------------------------------------------------------------

    QuestionOne.propTypes = {
        dataFromPrevStep: PropTypes.object,
        onNextStep: PropTypes.func,
        onPrevStep: PropTypes.func,
    };

    // ----------------------------------------------------------------------

    const styledBox = {
        display: 'flex',
        alignItems: 'flex-start',
        width: "100%",
        p: 1,
        pr: 2,
        backgroundColor: 'primary.lighter',
        color: 'primary.dark',
        '&:hover': {
            backgroundColor: 'primary.light',
            color: 'primary.darker',
        },
        border: 1,
        borderColor: 'primary.dark',
        borderRadius: 1,
        mb: 1,
        cursor: 'pointer',
    };

    const styledChip = {
        pl: 1,
        pr: 1,
        mr: 1,
        backgroundColor: 'white',
        color: 'primary.dark',
        '&:hover': {
            color: 'primarys.light',
        },
        border: 1,
        borderColor: 'primary.dark',
        borderRadius: 0.5,
    };

    const optionsOne = [
        {
            value: 'would advance to leadership position in current field/industry',
            label: 'Advancement - Seeking to advance to a leadership position within my field',
        },
        {
            value: 'would transition to career that aligns with passions/interests',
            label: 'Change - Transitioning into a new career aligned with my passions and interests',
        },
        {
            value: 'would start an own business/become entrepreneur',
            label: 'Entrepreneurship - Starting my own business or becoming an entrepreneur',
        },
        {
            value: 'would achieve specific degree/certification',
            label: 'Milestone - Achieving a milestone, such as earning a degree or certification',
        },
        {
            value: 'is still exploring career options',
            label: 'Exploration - Still exploring different options and paths right for me',
        },
    ];

export default function QuestionOne({ dataFromPrevStep, onNextStep, onPrevStep }) {

    const handleOptionClick = (optionValue) => {
        onNextStep({ optionOne: optionValue });
    };
    
    const optionOne = dataFromPrevStep?.optionOne;

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
                What are your long-term career goals?
            </Typography>
            {optionsOne.map((option, index) => (
                <Box
                    key={option.value}
                    sx={
                        optionOne === option.value
                        ? { ...styledBox, borderColor: 'primary.dark', border: 2 }
                        : styledBox
                    }
                    onClick={() => handleOptionClick(option.value)}
                >
                <Box 
                    sx={
                        optionOne === option.value
                        ? { ...styledChip, backgroundColor: 'primary.dark', color: 'white' }
                        : styledChip
                    }>{String.fromCharCode(65 + index)}</Box>
                    <Box sx={{ display: 'flex', flexGrow: 1 }}>{option.label}</Box>
                    {optionOne === option.value && (
                        <Iconify icon='eva:checkmark-outline' sx={{ ml: 1}} />
                    )}
                </Box>
            ))}
        </Grid>
        </Grid>
    );
        
}
