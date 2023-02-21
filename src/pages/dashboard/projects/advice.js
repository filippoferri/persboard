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

import {generateAdvice} from '../../api/openai';


// ----------------------------------------------------------------------

Advice.getLayout = (page) => <StepperLayout step={2}>{page}</StepperLayout>;

// ----------------------------------------------------------------------

export default function Advice() {
  const { themeStretch } = useSettingsContext();
  const router = useRouter();
  const { d, q } = router.query;
  // decode the directorIds array from the base64 string
  const decodedIds = d ? JSON.parse(atob(d)) : [];

  // decode the text from the base64 string
  const decodedText = q ? atob(q) : '';

  // display the text in a box
  const [question, setQuestion] = useState(decodedText);
  const [advice, setAdvice] = useState('');

  useEffect(() => {
    setQuestion(decodedText);
  }, [decodedText]);

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
              Let's go
            </Typography>
            <Typography variant="p" gutterBottom>
            See the “big picture” whether it be trends, crafting a balanced life</Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <Button variant="contained" size="large">
              Save
            </Button>
          </Box>
        </Stack>
        <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1 }}>
          <Grid container spacing={0} sx={{minHeight: '600px'}}>
            <Grid item xs={3} sx={{borderRight: '1px solid #DFE3E8', background: '#f4f6f8'}}>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <List>
                {decodedIds.map((director) => (
                  <ListItem key={director.id} disablePadding>
                    <ListItemButton>
                    <ListItemAvatar>
                    <Avatar alt={director.name} src={director.image} />
                    </ListItemAvatar>
                      <ListItemText primary={director.name} secondary={director.type} />
                    </ListItemButton>
                  </ListItem>
                ))}
                </List>
              </List>
            </Grid>
            <Grid container item xs={9} direction="column" sx={{flexGrow: 1}} >
              <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2 }}>{question}</Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', p:2, pb: 4 }}>
              
          Thinking...

              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
    );
  }