import { useState, useEffect } from 'react';

// next
import Head from 'next/head';
import Link from 'next/link';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Container, Grid, Button, Stack, Box, Typography, CardActionArea, Paper, FormControl, TextField, Drawer, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemButton } from '@mui/material';

// layouts
import StepperLayout from '../../../layouts/stepper';

// routes
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Image from '../../../components/image';

// components
import { useSettingsContext } from '../../../components/settings';

import {generateAdvice} from '../../../utils/generateAdvice';


// ----------------------------------------------------------------------

Advice.getLayout = (page) => <StepperLayout step={2}>{page}</StepperLayout>;

// ----------------------------------------------------------------------

export default function Advice() {
  const { themeStretch } = useSettingsContext();
  const router = useRouter();
  const { d, q } = router.query;
  // decode the directorIds array from the base64 string
  const decodedDirs = d ? JSON.parse(atob(d)) : [];

  // decode the text from the base64 string
  const decodedQuestion = q ? atob(q) : '';

  // display question
  const [question, setQuestion] = useState(decodedQuestion);

  useEffect(() => {
    setQuestion(decodedQuestion);
  }, [decodedQuestion]);

  // display the dicsussion
  const [loading, setLoading] = useState(false);
  const [discussion, setDiscussion] = useState('');

  // useEffect(() => {
  //   async function generateDiscussion() {
  //     if (loading) {
  //       return;
  //     }
  //     setLoading(true);
  //     const prompt = await generateAdvice(decodedDirs, question);
  //     setDiscussion(prompt);
  //   }
  //   generateDiscussion();
  //   setLoading(false);
  // }, []);

  console.log(decodedDirs)

  const handleContinue = () => {};

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
            mt: 2,
            mb: 4,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
            {question}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <Button variant="contained" size="large">
              Save
            </Button>
          </Box>
        </Stack>
        <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1 }}>
          <Grid container spacing={0} sx={{minHeight: '600px'}}>
            <Grid item xs={3} sx={{borderRight: '1px solid #DFE3E8'}}>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight: 'bold', color: '#637381',bgcolor: '#f4f6f8'}}>Your Board</Box>
              <List sx={{ width: '100%' }}>
                <List>
                {decodedDirs.map((director) => (
                  <ListItem key={director.id} disablePadding>
                    <ListItemButton>
                    <ListItemAvatar>
                    <Avatar alt={director.fullName} src={director.image} />
                    </ListItemAvatar>
                      <ListItemText primary={director.fullName} secondary={director.type} />
                    </ListItemButton>
                  </ListItem>
                ))}
                </List>
              </List>
            </Grid>
            <Grid container item xs={9} direction="column" sx={{flexGrow: 1}} >
              <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight:'bold', color:'#637381', bgcolor: '#f4f6f8' }}>Advices</Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', p:2, pb: 4 }}>
              
              {loading && (
                <Box>
                  We are thinking...
                </Box>
              )}

              <Box
                dangerouslySetInnerHTML={{ __html: discussion }}
              />

              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
    );
  }