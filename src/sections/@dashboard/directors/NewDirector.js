// title: WelcomeTopics

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, MenuItem, Avatar, Alert } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../config-global';
// uuid
import { v4 as uuidv4 } from 'uuid';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form';
// ----------------------------------------------------------------------

NewDirector.propTypes = {
  key: PropTypes.string,
};

export default function NewDirector({ isEdit = false, currentUser }) {

  const app = initializeApp(FIREBASE_API);
  const db = getFirestore(app);
  const { user } = useAuthContext();

  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const UpdateDirectorSchema = Yup.object().shape({
    fullName: Yup.string().required('Name is required'),
    role: Yup.string().required('Role is required'),
    area: Yup.string().required('Area is required'),
    quality: Yup.string().required('Quality is required'),
  });

  const defaultValues = {
    fullName: 'John Doe',
    role: 'Executive Coach',
    area: 'Advocacy',
    quality: 'Vision and Leadership',
    description: '',
  };

  const methods = useForm();

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const ROLE_DESCRIPTIONS = {
    "Life Coach": "I help and support you to achieve personal goals and achievements.",
    "Sport Coach": "I train and develop athletes' physical and mental abilities.",
    "Mentor": "I share my knowledge and provide guidance for personal and professional growth.",
    "Sponsor": "I provide support and resources for career development and advancement.",
    "Challenger": "I pushe you to overcome obstacles and reach new heights.",
    "Supporter": "I offers encouragement and assistance in achieving personal and professional goals.",
    "Senior-to-You Leader": "I serve you as a role model and provide guidance for personal and professional development.",
    "Adversary": "I present opposing views and challenges ideas to promote growth and progress."
  };
  

  const QUALITY_DESCRIPTIONS = {
    Passion: 'I have a deep interest in life and being motivated to work towards personal success and fulfillment.',
    Leadership: 'I have the courage to inspire and guide others towards a common goal or vision.',
    Vision: 'I can see the big picture and develop strategies to reach those goals.',
    Governance: 'I have the commitment to serve the interests of oneself, others, and the greater good, while maintaining the highest standards of integrity.',
    Knowledge: 'I possess a comprehensive understanding of oneself, others, and the world, as well as strong organizational and problem-solving skills.',
    Diligence: 'I demonstrate dedication and commitment to fulfilling personal goals and a willingness to put in the necessary effort to achieve them.',
    Collegiality: 'I have a sincere and respectful attitude towards others and their perspectives, and being able to work collaboratively towards shared goals.',
    Discretion: 'I maintain confidentiality and discretion in personal and professional interactions.'
  };  

  const AREA_DESCRIPTIONS = {
    "Advocacy": 'Empowering through representation',
    "Social Support": 'Offering care and connection',
    "Career Advice": 'Guiding toward professional success',
    "Expertise": 'Sharing specialized knowledge',
    "Developmental Feedback": 'Providing constructive critique',
    "Network": 'Connecting to valuable resources'
  };

  const areas = [
    {
      value: 'Advocacy',
      label: 'Advocacy',
    },
    {
      value: 'Social Support',
      label: 'Social Support',
    },
    {
      value: 'Career Advice',
      label: 'Career Advice',
    },
    {
      value: 'Expertise',
      label: 'Expertise',
    },
    {
      value: 'Network',
      label: 'Network',
    },
    {
      value: 'Feedback',
      label: 'Feedback',
    },
  ];

  const qualities = [
    {
      value: 'Leadership',
      label: 'Leadership',
    },
    {
      value: 'Vision',
      label: 'Vision',
    },
    {
      value: 'Diligence',
      label: 'Diligence',
    },
    {
      value: 'Passion',
      label: 'Passion',
    },
    {
      value: 'Knowledge',
      label: 'Knowledge',
    },
    {
      value: 'Discretion',
      label: 'Discretion',
    },
    {
      value: 'Governance',
      label: 'Governance',
    },
    {
      value: 'Collegiality',
      label: 'Collegiality',
    },
  ];

  const roles = [
    {
      value: 'Executive Coach',
      label: 'Executive Coach',
    },
    {
      value: 'Life Coach',
      label: 'Life Coach',
    },
    {
      value: 'Sport Coach',
      label: 'Sport Coach',
    },
    {
      value: 'Mentor',
      label: 'Mentor',
    },
    {
      value: 'Sponsor',
      label: 'Sponsor',
    },
    {
      value: 'Challenger',
      label: 'Challenger',
    },
    {
      value: 'Supporter',
      label: 'Supporter',
    },
    {
      value: 'Senior-to-You Leader',
      label: 'Senior-to-You Leader',
    },
    {
      value: 'Adversary',
      label: 'Adversary',
    },
  ];

  // Add new director
  const handleNewDirector = async () => {
    const uniqueDirectoryId = uuidv4();
    const fullName = watch('fullName');
    const role = watch('role');
    const area = watch('area');
    const quality = watch('quality');
    const description = watch('description');

    const data = {
      fullName: fullName || '',
      favorite: false,
      role: role || '',
      area: area || '',
      quality: quality || '',
      avatar: '', // add the base64 string of the image here if available
      desc: description || '',
      type: 'Personal',
      dateAdd: Timestamp.fromDate(new Date()),
      dateEdit: Timestamp.fromDate(new Date()),
    };

    try {
      // const directorRef = doc(collection(db, 'directors'), uniqueDirectoryId);
      const directorRef = doc(collection(db, 'users', user && user.uid, 'myDirectors'));
      await setDoc(directorRef, data);
      await push(PATH_DASHBOARD.directors.root);
      console.log('New director added with ID:', directorRef.id);
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    } catch (error) {
      console.error('Error adding director:', error);
      enqueueSnackbar('Ops, something went wrong!');
    }
  };

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await handleNewDirector(); // call handleNewDirector after the form is successfully submitted
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item xs={12} md={3} sx={{display: "flex", justifyContent: "center", textAlign:"end"}}>
          <Avatar
            alt={values.fullName}
            src=""
            sx={{
              width: 200,
              height: 200,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ backgroundColor: "#F4F6F8", minHeight: 270, borderRadius: 2 }}>
          <Box sx={{color: "#637381", p: "8px 16px 32px 16px "}}>
            <Typography variant='body2'>
              {values.fullName && values.fullName}
            </Typography>
            <Typography variant='h4'>
              {values.role && values.role}
            </Typography>
            <Typography variant='body' component="p">
              {values.role && `${ROLE_DESCRIPTIONS[values.role]}`}
            </Typography>
            <Typography variant='body' component="p">
              {values.area && values.quality && `${AREA_DESCRIPTIONS[values.area]}, ${QUALITY_DESCRIPTIONS[values.quality]}`}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
              <RHFTextField select name="role" helperText="Role Director">
                {roles.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFTextField>
            </Box>
            <Box sx={{ mb: 4 }}>
              <RHFTextField fullWidth name="fullName" label="Fake or Real Full Name (also famous)" />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              sx={{ mb: 4 }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField select name="area" helperText="Area Expertise">
                {areas.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFTextField>
              <RHFTextField select name="quality" helperText="Key Quality">
                {qualities.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFTextField>
            </Box>
            <Box sx={{ mb: 4 }}>
              <RHFTextField fullWidth name="description" label="Short profile description" multiline rows={4} />
            </Box>
  
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton size='large' type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create AI Director' : 'Save Changes'}
              </LoadingButton>
            </Stack>
  
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );  
}
