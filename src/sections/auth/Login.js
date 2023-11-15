// @mui
import { Stack, Typography, Link } from '@mui/material';
// auth
// import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

export default function Login() {
// const { method } = useAuthContext();

return (
    <LoginLayout>
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign In to your Personal Board</Typography>

        {/* <Tooltip title={method} placement="left">
        <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
        />
        </Tooltip> */}
    </Stack>

    <AuthLoginForm />

    <Stack direction="row" spacing={0.5} sx={{mt:6, justifyContent: "center"}}>
        <Typography variant="body1">Don&lsquo;t have an account yet?</Typography>
        <Link href={PATH_AUTH.register}  variant="body1">Sign Up</Link>
    </Stack>

    </LoginLayout>
);
}
