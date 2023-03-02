import { useState, useEffect } from 'react';

// next
import Head from 'next/head';
import Link from 'next/link';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Container, Grid, Button, Stack, Box, Typography, Paper } from '@mui/material';
// layouts
import StepperLayout from '../../../layouts/stepper';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../config-global';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Image from '../../../components/image';
// components
import { useSettingsContext } from '../../../components/settings';
import {generateAdvice} from '../../../utils/generateAdvice';
// sections
import AdvisoryBoard from '../../../sections/@dashboard/projects/AdvisoryBoard';

// ----------------------------------------------------------------------

Advice.getLayout = (page) => <StepperLayout step={2}>{page}</StepperLayout>;

// ----------------------------------------------------------------------

export default function Advice() {
  const { themeStretch } = useSettingsContext();
  const router = useRouter();
  const { d, q } = router.query;
  // decode the directorIds array from the base64 string
  const decodedDirs = d ? JSON.parse(atob(d)) : [];

  
  const [selectedDirector, setSelectedDirector] = useState(false);
  const [discussionReady, setDiscussionReady] = useState(false);
  const [saved, setSaved] = useState(false);

  // decode the text from the base64 string
  const decodedQuestion = q ? atob(q) : '';

  // display question
  const [question, setQuestion] = useState(decodedQuestion);


  const app = initializeApp(FIREBASE_API);
  const db = getFirestore(app);
  const { user } = useAuthContext();

  useEffect(() => {
    setQuestion(decodedQuestion);
  }, [decodedQuestion]);

  // display the discussion
  const [loading, setLoading] = useState(false); 
  const [discussion, setDiscussion] = useState('');
  const prompts = [];

  // Get the discussion
  useEffect(() => {
    async function generateDiscussion() {
      if (loading) {
        return;
      }
      setLoading(true);
      const prompt = await generateAdvice(decodedDirs, question);
      setDiscussion(prompt);
    }
    generateDiscussion();
    setLoading(false);
    setDiscussionReady(true);
  }, []);

  // save the discussion
  const handleSave = async () => {
    // try {
    //   if (!user || !user.uid) {
    //     console.log("User is not logged in or user ID is undefined.");
    //     return;
    //   }
  
    //   const boardRoomRef = collection(db, "users", user && user.uid, "boardRooms");
    //   const docRef = await setDoc(doc(boardRoomRef), {
    //     question: question,
    //     directors: decodedDirs,
    //     discussion: discussion
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    //   setSaved(true);
    //   push(PATH_DASHBOARD.root);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
  };
  
  const directorIds = decodedDirs.map((director) => director.id);
  
  return (
    <>
      <Head>
        <title> New Advice | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ pt: 2, pb: 15 }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{

            mb: 4,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              Boardroom
            </Typography>
            <Typography variant="p" gutterBottom>
              Get guidance on your toughest question
						</Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <Button variant="contained" size="large" onClick={handleSave} disabled={!discussionReady}>
              Save
            </Button>
          </Box>
        </Stack>
        <Paper variant="outlined" sx={{ flexGrow: 1 }}>
          <Grid container spacing={0} sx={{minHeight: '600px'}}>

            {/*/  Advisory Board */}
            <Grid item xs={3} sx={{borderRight: '1px solid #DFE3E8'}}>
              <AdvisoryBoard directors={directorIds} />
            </Grid>
            <Grid container item xs={9} direction="column" sx={{flexGrow: 1}} >
              <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight:'bold', color:'#637381', bgcolor: '#f4f6f8' }}>
                Meaningful Discussion
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', p:2, pb: 4 }}>

                {/*/  You */}
                <Grid container justifyContent={'flex-end'}>
                  <Grid item sx={{ textAlign: 'right', mb: 2 }}>
                    <Typography 
                      variant='caption' 
                      sx={{ fontWeight:'bold', pr: 1 }}>
                        You
                    </Typography>
                    <Box sx={{
                        backgroundColor:"#d2e9fc", 
                        p: 2, 
                        borderRadius: 1, 
                        borderTopRightRadius: 0,
                        mb: 1,
                        maxWidth: '600px',
                      }}>
                      {question}
                      </Box>
                  </Grid>
                </Grid>

                {/*/  Discussion */}  
                <Grid container justifyContent={'flex-start'}>
                  {discussion.length === 0 ? (
                    <Grid item justifyContent="center">
                      <Typography variant="body1" align="center" sx={{color: "#919EAB"}}>We are thinking...</Typography>
                    </Grid>
                  ) : (
                    discussion.map((advice, index) => (
                      <Grid item key={index}>
                        <Typography
                          variant='caption'
                          sx={{ fontWeight: 'bold', pl: 1, mb: 2 }}>
                          {advice.fullName} | {advice.role}
                        </Typography>
                        <Box sx={{
                          backgroundColor: "#F4F6F8",
                          p: 2,
                          borderRadius: 1,
                          borderTopLeftRadius: 0,
                          mb: 1,
                          width: '600px',
                        }}>
                          {advice.text}
                        </Box>
                      </Grid>
                    ))
                  )}
                </Grid>
                {/*/  Limits */}  
                <Grid container justifyContent={'center'}>
                  <Grid item justifyContent="center">
                    <Typography variant="body1" align="center" sx={{color: "#919EAB", pt: 4, pb: 5 }}>5 credits remaining. Need more? Upgrade now!</Typography>
                  </Grid>
                  <Grid item sx={{ flexGrow: 1 }}>
                    <Box sx={{display: 'flex', backgroundColor: "#D1E9FC", p: 2, borderRadius: 1, alignItems: "center"}}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant='h5'>Engage in a dynamic exchange of ideas</Typography>
                        <Typography variant='h5' sx={{color: "#2065D1"}}>Achieve greater clarity and direction</Typography>
                      </Box>
                      <Box>
                      <Button variant="contained" size="large" >Upgrade Now</Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
    );
  }