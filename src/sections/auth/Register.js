// next
import NextLink from 'next/link';
// @mui
import { Stack, Typography, Link } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <LoginLayout title="Discover a trusted advisor to turn to at every major decision.">
      <Stack spacing={2} sx={{ mb: 3, position: 'relative' }}>
        <Typography variant="h4">Get started absolutely free.</Typography>
      </Stack>

      <AuthRegisterForm />

      <Stack direction="row" spacing={0.5} sx={{mt:6, justifyContent: "center"}}>
          <Typography variant="body1"> Don't have an account yet? </Typography>

          <Link component={NextLink} href={PATH_AUTH.login} variant="body1">
            Sign in
          </Link>
        </Stack>

    </LoginLayout>
  );
}
