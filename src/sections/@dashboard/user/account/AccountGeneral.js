import * as Yup from 'yup';
import { useState, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Typography, Divider, Link, Button, FormGroup, FormControl, FormControlLabel, Checkbox, IconButton, InputAdornment, Switch } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
// Router
// import { useRouter } from 'next/router';
// import { PATH_AUTH } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// firebase API
import { FIREBASE_API } from '../../../../config-global';
// components
import ConfirmDialog from '../../../../components/confirm-dialog';
import FormProvider, {
    RHFTextField,
} from '../../../../components/hook-form';
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';

// ----------------------------------------------------------------------

export default function AccountGeneral() {

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user, logout } = useAuthContext();

    const [errorPassUpdate, setError] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const [mode, setMode] = useState({
        quality: true,
        toneCoincise: true
    });
    useEffect(() => {
        const savedMode = JSON.parse(localStorage.getItem('mode'));
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);
    const handleModeChange = (event) => {
        setMode({
            ...mode,
            [event.target.name]: event.target.checked,
        });
    };

    useEffect(() => {
        localStorage.setItem('mode', JSON.stringify(mode));
    }, [mode]);

    const UpdateUserSchema = Yup.object().shape({
        firstName: Yup.string().required('Name is required'),
        lastName: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    });

    const defaultValues = {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        isPublic: user?.isPublic || false,
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        // setValue,
        handleSubmit,
        watch,
        // formState: { isSubmitting },
    } = methods;

    const oldPasswordValue = watch("oldPassword");
    const newPasswordValue = watch("newPassword");

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    // Delete
    const handleDelete = async () => {
        try {
            // await logout();
            const myAccountRef = doc(db, 'users', user.uid);
            await deleteDoc(myAccountRef);
            await logout();
        } catch (error) {
            console.error(error);
        }
    };  

    // change password
    const handleSaveChanges = async () => {
        const oldPassword = methods.getValues("oldPassword");
        const newPassword = methods.getValues("newPassword");
        const email = user.email; // Replace this with the user's email
        const auth = getAuth();

        try {
        // Re-authenticate the user with their old password
        const userCredential = await signInWithEmailAndPassword(auth, email, oldPassword);
        const user = userCredential.user;

        // Update the user's password with the new one
        await updatePassword(user, newPassword);
            setError("");
            methods.reset();
            enqueueSnackbar("Password updated successfully!");
        } catch (error) {
            setError("Error updating password: " + error.message);
        }
    };

    const handleCheckboxChange = (event) => {
        setIsConfirmed(event.target.checked);
    }

    return (
        <>
        
            <Grid container spacing={3} sx={{ mb: 3 }}>

            <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                    <FormProvider methods={methods}>
                        <Typography variant='h5' sx={{ mb: 2, ml: 1 }}>Basic Details</Typography>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            sx={{ mb: 2 }}
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField name="firstName" label="First Name" disabled />
                            <RHFTextField name="lastName" label="Last Name" disabled />
                        </Box>
                        <Box sx={{ mb: 4 }}>
                            <RHFTextField fullWidth name="email" label="Email" disabled />
                        </Box>
                    </FormProvider>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Box sx={{pt: 4, pb: 4}}>
                            <Typography variant='h5' sx={{ mb: 2, ml: 1 }}>Preferences</Typography>
                            <FormControl component="fieldset" variant="standard" sx={{ pl: 1}}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={mode.quality} onChange={handleModeChange} name="quality" />
                                    }
                                    label= { mode.quality ? "Optimized for quality" : "Optimized for speed" }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch checked={mode.toneCoincise} onChange={handleModeChange} name="toneCoincise" />
                                    }
                                    label= { mode.toneCoincise ? "Coincise tone is used for advice" : "Professional tone is used for advice" }
                                />
                            </FormControl>
                    </Box>    

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Box sx={{textAlign: 'center', p: 4}}>
                        <Typography variant='body1'>Email <Link href='mailto: help@personalboard.ai'>help@personalboard.ai </Link>if you have any questions.</Typography>
                    </Box>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>

                <Card elevation={2} sx={{mb: 2}}>
                    <Box sx={{ p: 3, textAlign: 'left' }}>
                        <FormProvider methods={methods}>
                            <Typography variant='h5' sx={{ mb: 2 }}>Change Password</Typography>
                            <Box>
                                <FormGroup>
                                    <RHFTextField
                                        name="oldPassword"
                                        label="Old Password"
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                </IconButton>
                                            </InputAdornment>
                                            ),
                                        }}
                                        sx={{mb:1.5}}
                                    />
                                    <RHFTextField
                                        name="newPassword"
                                        label="New Password"
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                                </IconButton>
                                            </InputAdornment>
                                            ),
                                        }}
                                    />
                                </FormGroup>
                                {errorPassUpdate && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        {errorPassUpdate}
                                    </Typography>
                                )}
                                <Button
                                    variant="contained"
                                    color='primary'
                                    size='large'
                                    sx={{ mt: 2 }}
                                    onClick={handleSaveChanges}
                                    disabled={!oldPasswordValue || !newPasswordValue}
                                >
                                    Saves Changes
                                </Button>
                            </Box>
                        </FormProvider>
                    </Box>
                </Card>

                <Card elevation={2} >
                    <Box sx={{ p: 3, textAlign: 'left' }}>
                        <FormProvider methods={methods}>
                        <Typography variant='h5' sx={{ mb: 1 }}>Delete Account</Typography>
                        <FormGroup>
                            <FormControlLabel
                            control={<Checkbox checked={isConfirmed} onChange={handleCheckboxChange} />}
                            label="I confirm my account deactivation"
                            />
                        </FormGroup>
                        <Button
                            variant="contained"
                            color='error'
                            size='large'
                            sx={{ mt: 2 }}
                            onClick={handleOpenConfirm}
                            disabled={!isConfirmed}
                        >
                            Deactivate Account
                        </Button>
                        </FormProvider>
                    </Box>
                </Card>
            </Grid>

            </Grid>

        <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Are you sure?"
            content="Do you really want to delete your account? This action is irreversible and can not be undone."
            action={
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            }
            />
        </>
    );
}