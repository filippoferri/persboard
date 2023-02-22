import * as React from 'react';

import { useState, useEffect } from 'react';

import { m } from 'framer-motion';
// next
import Head from 'next/head';
import Link from 'next/link';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Container, Grid, Button, Stack, Box, Typography, CardActionArea, Paper, FormControl, TextField, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

// layouts
import StepperLayout from '../../../layouts/stepper';

// routes
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Image from '../../../components/image';

// components
import { useSettingsContext } from '../../../components/settings';

import { useScrollTrigger } from '@mui/material';
import { animated } from 'framer-motion';

// ----------------------------------------------------------------------

PageNewQuestion.getLayout = (page) => <StepperLayout step={1}>{page}</StepperLayout>;

// ----------------------------------------------------------------------

export default function PageNewQuestion() {
  const { themeStretch } = useSettingsContext();
  const router = useRouter();
  const { d } = router.query;

  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(100);

  const handleTextChange = (event) => {
    setText(event.target.value.slice(0, 100));
  };

  const handleListItemClick = (content) => {
    setText(content);
  };

  const handleContinue = () => {
    const encodedText = btoa(text);
    const nextPageUrl = `${PATH_DASHBOARD.projects.advice}?d=${d}&q=${encodedText}`;
    router.push(nextPageUrl);
  };

  return (
    <>
      <Head>
        <title> New Question | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ pt: 4, pb: 15 }}>
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
              Ask Your Board
            </Typography>
            <Typography variant="p" gutterBottom>
              Now that you’ve mapped out your Board of Directors, it’s time to engage them!
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <Button variant="contained" size="large" onClick={handleContinue}>
              Get Started
            </Button>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          <Stack
            direction="column"
            sx={{
              mt: 2,
              width: '100%',
            }}
          >
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <TextField
                label="Your life question starts here..."
                variant="outlined"
                multiline
                rows={5}
                onChange={handleTextChange}
                sx={{ fontSize: 30 }}
                value={text}
              />
            </FormControl>
            <Typography variant="p" sx={{ ml: 2 }}>
              Characters remaining: {charCount}
            </Typography>
          </Stack>
        </Grid>

        <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Button variant="contained" size="large" onClick={handleContinue}>
            Get Started
          </Button>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mt: 2,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">Ideas</Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
          </Box>
        </Stack>

        <Grid container spacing={2} direction="column">
          <Stack direction="column" sx={{ mt: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleListItemClick('What kind of job do you think I should be pursuing?')}>
                  <ListItemText primary="What kind of job do you think I should be pursuing?" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleListItemClick('How can I earn my first 500k?')}>
                  <ListItemText primary="How can I earn my first 500k?" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
              <ListItemButton onClick={() => handleListItemClick('What other industries/fields of work do you think I should consider given my skills and experience?')}>
              <ListItemText primary="What other industries/fields of work do you think I should consider given my skills and experience?" />
            </ListItemButton>
          </ListItem>
        </List>
        </Stack>
          </Grid>
        </Container>
      </>
    );
  }

