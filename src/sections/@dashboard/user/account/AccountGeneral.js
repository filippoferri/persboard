import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Typography, Divider, Link, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
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

// ----------------------------------------------------------------------

export default function AccountGeneral() {

  const app = initializeApp(FIREBASE_API);
  const db = getFirestore(app);
  const { user, logout } = useAuthContext();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

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
    // formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // enqueueSnackbar('Update success!');
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // Delete director
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
  
  const handleCheckboxChange = (event) => {
    setIsConfirmed(event.target.checked);
  }


  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ mb: 3 }}>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
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

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Box sx={{textAlign: 'center', p: 4}}>
                <Typography variant='body1'>Email <Link href='mailto: help@personalboard.ai'>help@personalboard.ai </Link>if you have any questions.</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={2} >
              <Box sx={{ p: 3, textAlign: 'left' }}>
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
              </Box>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Are you sure?"
          content="Do you really want to delete your account? This action is irreversible and can not be undone?"
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