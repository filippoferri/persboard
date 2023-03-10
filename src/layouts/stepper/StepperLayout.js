import * as React from 'react';

import PropTypes from 'prop-types';
// next
import dynamic from 'next/dynamic';
// @mui
import { Stack, Container } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// auth
import AuthGuard from '../../auth/AuthGuard';
// config
import { HEADER } from '../../config-global';
//
const Header = dynamic(() => import('./Header'), { ssr: false });

// ----------------------------------------------------------------------

StepperLayout.propTypes = {
  children: PropTypes.node,
  step: PropTypes.number
};

export default function StepperLayout({ children, step }) {
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <AuthGuard> 
      <Header isOffset={isOffset} step={step} />

      <Container component="main">
        <Stack
          sx={{
            py: 12,
            m: 'auto',
          }}
        >
          {React.Children.map(children, (child) => 
            return React.cloneElement(child); // Pass step prop to children
          )}
        </Stack>
        </Container>
      </AuthGuard>
  );
}
