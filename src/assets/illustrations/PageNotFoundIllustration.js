import { memo } from 'react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

function PageNotFoundIllustration({ ...other }) {

  return (
    <Box sx={{ height: 300, m: "auto", mb: 4, mt: 4 }} component="img" src="/assets/illustrations/illustration_404.svg" />
  );
}

export default memo(PageNotFoundIllustration);
