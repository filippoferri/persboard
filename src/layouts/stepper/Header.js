import * as React from 'react';

import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Box, Button, Stepper, Step, StepLabel } from '@mui/material';
// config
import { HEADER } from '../../config-global';
// utils
import { bgBlur } from '../../utils/cssStyles';
// components
import Logo from '../../components/logo';

import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

Header.propTypes = {
  isOffset: PropTypes.bool,
  step: PropTypes.number
};

const steps = ['Board Of Directors', 'Your Life Question', 'Board Advices'];

export default function Header({ isOffset, step }) {
  const theme = useTheme();
  
  return (
    <AppBar color="inherit" sx={{ boxShadow: 0, borderBottom: 1, borderColor: '#DFE3E8' }}>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_MAIN_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(isOffset && {
            ...bgBlur({ color: theme.palette.background.default }),
            height: {
              md: HEADER.H_MAIN_DESKTOP - 16,
            },
          }),
        }}
      >
        <Logo />
        <Stepper activeStep={step}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Button variant="text" href={PATH_DASHBOARD.welcome}>Close Project</Button>
      </Toolbar>

      {isOffset && <Shadow />}
    </AppBar>
  );
}

// ----------------------------------------------------------------------

Shadow.propTypes = {
  sx: PropTypes.object,
};

function Shadow({ sx, ...other }) {

  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        width: `calc(100% - 48px)`,
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
