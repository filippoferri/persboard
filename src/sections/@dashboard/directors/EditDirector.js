// title: WelcomeTopics

import {useState} from 'react';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, MenuItem, InputLabel, Avatar, Chip, Button } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, Timestamp } from 'firebase/firestore';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// config
import { FIREBASE_API } from '../../../config-global';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFTextField,
} from '../../../components/hook-form';
// ----------------------------------------------------------------------

export default function EditDirectorForm() {

  const app = initializeApp(FIREBASE_API);
  const db = getFirestore(app);
  const { user } = useAuthContext();

  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { query } = useRouter();
  const { d } = query;

  let item = null;
  if (d) {
    try {
      const decodedItem = atob(d);
      item = JSON.parse(decodedItem);
    } catch (error) {
      console.error('Error decoding or parsing item:', error);
    }
  }

  const handleChipClick = (chip) => {
    setSelectedChips((chips) => chips.filter((c) => c !== chip));
    setTextareaValue((value) =>
      value
        .replace(new RegExp(`\\s*${skills[chip]}\\s*`), '')
        .replace(/\n{2,}/g, '\n')
        .trim()
    );
  };
  console.log('item', item);

  const methods = useForm({
    defaultValues: {
      fullName: item.fullName,
      role: item.role,
    },
  });
    
  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [selectedChips, setSelectedChips] = useState([]);
  const editedDesc = item.desc.replace(ROLE_DESCRIPTIONS[values.role], '').replace('\n', '');
  const [textareaValue, setTextareaValue] = useState(editedDesc);

  // Add new director
  const handleEditDirector = async () => {
    const fullName = watch('fullName');
    const role = watch('role');

    const data = {
      fullName: fullName || '',
      role: role || '',
      avatar: '/assets/illustrations/avatars/ai_default.svg', // add the base64 string of the image here if available
      desc: `${ROLE_DESCRIPTIONS[values.role]}${textareaValue || ''}`,
      dateEdit: Timestamp.fromDate(new Date()),
    };

    try {
      // const directorRef = doc(collection(db, 'directors'), uniqueDirectoryId);
      const directorRef = doc(db, 'users', user && user.uid, 'myDirectors', item.id);
      await updateDoc(directorRef, data);
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
      await handleEditDirector(); // call handleNewDirector after the form is successfully submitted
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = async (data) => {
    push(PATH_DASHBOARD.directors.root);
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
  
            <Stack alignItems="center" sx={{ mt: 3, flexDirection: "row", justifyContent: "flex-end" }}>

              <Button onClick={onCancel} size="large" sx={{ mr: 2}}>Cancel</Button>

              <LoadingButton
                size='large'
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!textareaValue}
              >
                Save Changes
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
              <Typography variant='body' component="div" sx={{ mb: 2 }}>
                {values.role && `${ROLE_DESCRIPTIONS[values.role]}`}
              </Typography>
              <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: textareaValue.replace(/\n/g, '<br>') }} />
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
    value: 'Sport Coach',
    label: 'Sport Coach',
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
    value: 'Adversary',
    label: 'Adversary',
  },
];

const ROLE_DESCRIPTIONS = {
  "Life Coach": "I help and support you to achieve personal goals and achievements.",
  "Sport Coach": "I train and develop athletes' physical and mental abilities.",
  "Mentor": "I share my knowledge and provide guidance for personal and professional growth.",
  "Sponsor": "I provide support and resources for career development and advancement.",
  "Challenger": "I push you to overcome obstacles and reach new heights.",
  "Supporter": "I offers encouragement and assistance in achieving personal and professional goals.",
  "Contrarian": "I present opposing views and challenges ideas to promote growth and progress.",
  "Inspirer": "I introduce innovative ideas and stimulate creativity by connecting unexpected concepts, and expanding your thinking and inspire growth.",
  "Executive Coach": "I provide guidance and strategies for achieving professional success and leadership development.",
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

