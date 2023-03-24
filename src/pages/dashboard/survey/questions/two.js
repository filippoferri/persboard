import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, Button } from '@mui/material';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

QuestionTwo.propTypes = {
    onNextStep: PropTypes.func,
    onPrevStep: PropTypes.func,
};

// ----------------------------------------------------------------------

const variants = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
        },
    },
};

const styledBoxTwo = {
    display: 'flex',
    alignItems: 'flex-start',
    width: "100%",
    p: 1,
    pr: 2,
    backgroundColor: 'secondary.lighter',
    color: 'secondary.dark',
    '&:hover': {
        backgroundColor: 'secondary.light',
        color: 'secondary.darker',
    },
    border: 1,
    borderColor: 'secondary.dark',
    borderRadius: 1,
    mb: 1,
    cursor: 'pointer',
};

const styledChipTwo = {
    pl: 1,
    pr: 1,
    mr: 1,
    backgroundColor: 'white',
    color: 'secondary.dark',
    '&:hover': {
        color: 'primarys.light',
    },
    border: 1,
    borderColor: 'secondary.dark',
    borderRadius: 0.5,
};

const optionsTwo = [
    {
        value: 'weighs the pros and cons, and makes a logical decision based on the facts.',
        label: 'Analytical - I weigh the pros and cons, and make decisions based on the facts',
    },
    {
        value: 'relies on the instincts and gut feelings to guide decisions',
        label: 'Intuitive - I rely on my instincts and gut feelings to guide my decisions',
    },
    {
        value: "seeks input and advice from others before making a decision.",
        label: "Collaborative -  I seek input and advice from others before making a decision",
    },
    {
        value: 'tends to make decisions quickly without much thought.',
        label: 'Impulsive - I tend to make decisions quickly without much thought',
    },
    {
        value: 'tends to delay making decisions until the last minute.',
        label: 'Procrastinating - I tend to delay making decisions until the last minute',
    },
];

export default function QuestionTwo({ dataFromPrevStep, onNextStep, onPrevStep }) {

const handleOptionClick = (optionValue) => {
    onNextStep({ optionTwo: optionValue });
};   

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
            <Iconify icon={'eva:arrow-back-outline'} /> Back
        </Box>
        <Typography variant="h5" sx={{ mb: 3 }}>
            What is your decision-making style?
        </Typography>
        {optionsTwo.map((option, index) => (
            <Box
                key={option.value}
                sx={
                dataFromPrevStep.optionTwo === option.value
                    ? { ...styledBoxTwo, borderColor: 'secondary.dark', border: 2  }
                    : styledBoxTwo
                }
                onClick={() => handleOptionClick(option.value)}
            >
                <Box sx={
                    dataFromPrevStep.optionTwo === option.value
                    ? { ...styledChipTwo, backgroundColor: 'secondary.dark', color: 'white' }
                    : styledChipTwo
                }>{String.fromCharCode(65 + index)}</Box>
                <Box sx={{ display: 'flex', flexGrow: 1 }}>{option.label}</Box>
                {dataFromPrevStep.optionTwo === option.value && (
                    <Iconify icon={'eva:checkmark-outline'} sx={{ ml: 1}} />
                )}
            </Box>
        ))}
    </Grid>
    </Grid>
);
    
}
