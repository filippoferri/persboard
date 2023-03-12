// next
import NextLink from 'next/link';
// @mui
// import { styled, alpha } from '@mui/material/styles';
import { Box, Link } from '@mui/material';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function NavAccount() {
  // const { user } = useAuthContext();

  return (
    <Link component={NextLink} href={PATH_DASHBOARD.projects.newProject} underline="none" color="inherit">
        <Box
            sx={{ 
                borderRadius: 1, 
                padding:2, 
                textAlign: "center", 
                backgroundColor: "#3366ff", 
                color: "white",
                fontWeight: "bold",
                marginTop: 2,
            }}>
            New Boardroom
        </Box>
    </Link>
  );
}