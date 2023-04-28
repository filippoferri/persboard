import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const thinkingVariations1 = [
    "That's a good question!",
    "Checking your profile...",
    "We are thinking...",
    "Just a moment more...",
    "Checking latest resources...",
    "Almost there...",
    "We were writing, be prepared...",
];

const thinkingVariations2 = [
    "Just a moment...",
    "Checking latest resources...",
    "We are analysing the discussion...",
    "Be patient...",
    "Almost there...",
    "We were writing, be prepared...",
];

export default function ThinkTime(isHelp) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [thinkingIndex, setThinkingIndex] = useState(0);

    console.log('isHelp', isHelp)

    const thinking = isHelp ? thinkingVariations1 : thinkingVariations2;

    useEffect(() => {
        const interval = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
        if (elapsedTime % 5 === 0) {
            setThinkingIndex((prevThinkingIndex) => (prevThinkingIndex + 1) % thinking.length);
        }
        }, 1000);
        return () => clearInterval(interval);
    }, [elapsedTime]);

    return (
        <Typography variant="body1" align="left" sx={{color: "grey.600", mb: 2 }}>
            {thinking[thinkingIndex]} <br />({elapsedTime} seconds)
        </Typography>
    );
};
