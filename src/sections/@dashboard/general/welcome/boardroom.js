import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function WelcomeBoardroom({onNextStep, data}) { 

    console.log(data);

    return (
    <div>
        <h1>This is the Third component</h1>
        <p>Data from first component: bo</p>
    </div>
    );
}
