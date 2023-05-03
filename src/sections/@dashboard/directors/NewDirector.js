// title: WelcomeTopics

import {useState} from 'react';
// import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, MenuItem, InputLabel, Avatar, Chip } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// config
import { FIREBASE_API } from '../../../config-global';
// uuid
// import { v4 as uuidv4 } from 'uuid';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
// import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFTextField,
} from '../../../components/hook-form';
// ----------------------------------------------------------------------

export default function NewDirector() {

  const app = initializeApp(FIREBASE_API);
  const db = getFirestore(app);
  const { user } = useAuthContext();

  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedChips, setSelectedChips] = useState([]);
  const [textareaValue, setTextareaValue] = useState('');

  const handleChipClick = (chip) => {
    setSelectedChips((chips) => chips.filter((c) => c !== chip));
    setTextareaValue((value) =>
      value
        .replace(new RegExp(`\\s*${skills[chip]}\\s*`), '')
        .replace(/\n{2,}/g, '\n')
        .trim()
    );
  };

  const methods = useForm({
    defaultValues: {
      fullName: 'John Doe',
      role: 'Inspirer',
      description: '',
    },
  });
    
  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Add new director
  const handleNewDirector = async () => {
    // const uniqueDirectoryId = uuidv4();
    const fullName = watch('fullName');
    const role = watch('role');
    // const area = watch('area');
    // const quality = watch('quality');
    // const description = watch('description');

    const data = {
      fullName: fullName || '',
      role: role || '',
      avatar: '/assets/illustrations/avatars/ai_default.svg', // add the base64 string of the image here if available
      desc: `${ROLE_DESCRIPTIONS[values.role]}\n${textareaValue || ''}`,
      type: 'Personal',
      dateAdd: Timestamp.fromDate(new Date()),
      dateEdit: Timestamp.fromDate(new Date()),
    };

    try {
      // const directorRef = doc(collection(db, 'directors'), uniqueDirectoryId);
      const directorRef = doc(collection(db, 'users', user && user.uid, 'myDirectors'));
      await setDoc(directorRef, data);
      await push(PATH_DASHBOARD.yourBoard.build);
      enqueueSnackbar('Create success!');
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
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <InputLabel shrink sx={{pl: 2}}>
                Full Name (also famous)
              </InputLabel>
              <RHFTextField fullWidth name="fullName" />
            </Box>
            <Box sx={{ mb: 3 }}>
              <InputLabel shrink sx={{pl: 2}}>
                Role Director
              </InputLabel>
              <RHFTextField select name="role">
                {roles.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFTextField>
            </Box>
            <Box sx={{ mb: 3, position: "relative" }}>
              <InputLabel shrink sx={{pl: 2}}>
                Customize your director personality
              </InputLabel>
              <RHFTextField 
                fullWidth 
                name="description" 
                placeholder={
  `Share 3-4 facts about your director:
    • I have a deep interest in life
    • I inspire and guide you.
    • I'm optimistic
    • I provide constructive critique
  etc.`} 
                multiline 
                rows={6} 
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                sx={{ 
                  whiteSpace: "pre-line",
                  }}/>

              <Box sx={{ p: 1, pb: 1 }}>
              {selectedChips.map((chip) => (
                <Chip 
                  key={chip} 
                  label={chip}   
                  onDelete={() => handleChipClick(chip)}
                  sx={{ mr: 0.5, mb: 1 }} />
              ))}
              {Object.keys(skills).map((skill) => {
                if (selectedChips.includes(skill)) return null;
                return (
                  <Chip
                    label={skill}
                    key={skill}
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      const skillValue = skills[skill];
                      setSelectedChips((chips) => [...chips, skill]);
                      setTextareaValue((value) =>
                        `${value}${value.length > 0 ? '\n' : ''}${skillValue}`
                      );
                    }}
                    sx={{ mr: 0.5, mb: 1 }}
                  />
                );
              })}
              </Box>

            </Box>
  
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                size='large'
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!textareaValue}
              >
                Create AI Director
              </LoadingButton>
            </Stack>
  
          </Card>
        </Grid>
        <Grid item 
          xs={12} 
          md={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
          >
          <Avatar
            alt={values.fullName}
            src="/assets/illustrations/avatars/ai_default.svg"
            sx={{
              width: 200,
              height: 200,
              mb: 3,
            }}
          />

          <Box sx={{  
            color: "grey.600", 
            backgroundColor: "grey.200",
            p: 2,
            borderRadius: 2
            }}>
            <Box sx={{  mb: 2 }}>
              <Typography variant='body2'>
                <b>{values.fullName && values.fullName}</b>
              </Typography>
              <Typography variant='h5'>
                {values.role && values.role}
              </Typography>
              <Typography variant='body' component="p">
                {values.role && `${ROLE_DESCRIPTIONS[values.role]}`}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );  
}

const roles = [
  {
    value: 'Inspirer',
    label: 'Inspirer',
  },
  {
    value: 'Mentor',
    label: 'Mentor',
  },
  {
    value: 'Executive Coach',
    label: 'Executive Coach',
  },
  {
    value: 'Life Coach',
    label: 'Life Coach',
  },
  {
    value: 'Philosopher',
    label: 'Philosopher',
  },
  {
    value: 'Sport Coach',
    label: 'Sport Coach',
  },
  {
    value: 'Financial Advisor',
    label: 'Financial Advisor',
  },
  {
    value: 'Entrepreneur',
    label: 'Entrepreneur',
  },
  {
    value: 'Advocate',
    label: 'Advocate',
  },
  {
    value: 'Market Expert',
    label: 'Market Expert',
  },
];

const ROLE_DESCRIPTIONS = {
  "Life Coach": "I help and support you to achieve personal goals and achievements.",
  "Sport Coach": "I train and develop athletes' physical and mental abilities.",
  "Mentor": "I share my knowledge and provide guidance for personal and professional growth.",
  "Financial Advisor": "I identify your financial goals and develop a plan to achieve them.",
  "Challenger": "I push you to overcome obstacles and reach new heights.",
  "Supporter": "I offers encouragement and assistance in achieving personal and professional goals.",
  "Market Expert": "I help you identify new business opportunities and navigate the complexities of the market.",
  "Inspirer": "I stimulate creativity by connecting unexpected concepts, and expanding your thinking and growth.",
  "Executive Coach": "I provide guidance and strategies for achieving professional success and leadership development.",
  "Philosopher": "I develop a deeper understanding of the world and our place in it.",
  "Advocate": "I help you express your views and wishes, and stand up for your rights.",
  "Entrepreneur": "I help you take on the adventure and risk of starting a new business.",
};

const skills = {
  "Career Advice": 'I guide toward professional success.',
  "Expertise": 'I share specialized knowledge.',
  "Passion": 'I have a deep interest in life.',
  "Leadership": 'I inspire and guide you.',
  "Vision": 'I can see the big picture and develop strategies.',
  "Feedback": 'Providing a constructive critique',
  "Problem Solving": 'I have strong organizational and problem-solving skills.',
  "Enthusiastic": "I approach tasks with excitement and energy.",
  "Encouraging": "I provide positive feedback and support.",
  "Empathetic": "I have a deep understanding and sensitivity.",
  "Optimistic": "I maintain a positive outlook and focus.",
  "Motivated": " I am driven and dedicated to making progress.",
  "Persuasive": "I persuade others to take action.",
  "Sarcastic": "I use irony and sarcasm to convey humor and wit.",  
}

