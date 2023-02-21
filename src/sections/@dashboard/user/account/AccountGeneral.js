import * as Yup from 'yup';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Divider, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// assets
import { countries } from '../../../../assets/data';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFTextField,
} from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || null,
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    about: user?.about || '',
    isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
          direction="row"
          alignItems="center"
          sx={{
            mt: 2,
            mb: 4,
          }}
        >
          <Box sx={{ flexGrow: 1, pl: 2 }}>
            <Typography variant="h4" gutterBottom>
              Account Settings
            </Typography>
          </Box>
        </Stack>
      <Grid container spacing={3}>

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
              <RHFTextField name="displayName" label="First Name" disabled />

              <RHFTextField name="displaySurname" label="Last Name" disabled />
              </Box>
              <Box sx={{ mb: 4 }}>

              <RHFTextField fullWidth name="email" label="Email" disabled />

            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{textAlign: 'center', p: 4}}>
            <Typography variant='p'>Email <Link >help@personalboard.ai </Link>if you have any questions.</Typography>

            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
