import PropTypes from 'prop-types';
// @mui
import { Typography, Stack, Button } from '@mui/material';

// ----------------------------------------------------------------------

WelcomeUpgrade.propTypes = {
  sx: PropTypes.object,
  img: PropTypes.node, 
  description: PropTypes.string,
  cta: PropTypes.string,
};

export default function WelcomeUpgrade({ img, sx, description, cta, ...other }) {
  return (
    <Stack
      alignItems="center"
      sx={{ p: 5, borderRadius: 2, bgcolor: 'background.neutral', ...sx }}
      {...other}
    >
      
      {img && img}

      <Button size="large" color="warning" variant="contained" sx={{ mt: 5, mb: 2 }}>
        {cta}
      </Button>

      <Typography variant="body" sx={{ color: 'text.disabled', textAlign: 'center' }}>
        {description}
      </Typography>
    </Stack>
  );
}
