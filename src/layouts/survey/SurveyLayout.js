import * as React from 'react';

import PropTypes from 'prop-types';
// next
// import dynamic from 'next/dynamic';
// @mui
import { Stack, Container, Box } from '@mui/material';
// hooks
// import useOffSetTop from '../../hooks/useOffSetTop';
// auth
import AuthGuard from '../../auth/AuthGuard';
// config
// import { HEADER } from '../../config-global';
//
// const Header = dynamic(() => import('./Header'), { ssr: false });

// ----------------------------------------------------------------------

StepperLayout.propTypes = {
  children: PropTypes.node,
  step: PropTypes.number,
};

export default function StepperLayout({ children, step }) {
  // const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  const renderContent = () => (
      <>
        {/* <Header isOffset={isOffset} step={step} /> */}

        <Box sx={{ backgroundColor: "grey.200", minHeight: '100vh' }}>
        <Container component="main">
          <Stack
            sx={{
              m: 'auto',
            }}
          >
            {React.Children.map(
              children,
              (child) => React.cloneElement(child) // Pass step prop to children
            )}
          </Stack>
        </Container>
        </Box>
      </>
    );

  return <AuthGuard> {renderContent()} </AuthGuard>;
}
