import { useState } from 'react';

import { m } from 'framer-motion';
// next
import Head from 'next/head';
import Link from 'next/link';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Container, Grid, Button, Stack, Box, Typography, CardActionArea, Paper } from '@mui/material';

// layouts
import StepperLayout from '../../../layouts/stepper';

// routes
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Image from '../../../components/image';

// components
import { useSettingsContext } from '../../../components/settings';
 
// sections
import { varHover, varTranHover } from '../../../components/animate';

// data
import data from '../../../utils/data.json';

import { useScrollTrigger } from '@mui/material';
import { animated } from 'framer-motion';

// ----------------------------------------------------------------------

PageNewProject.getLayout = (page) => <StepperLayout step={0}>{page}</StepperLayout>;

// ----------------------------------------------------------------------

export default function PageNewProject() {
    const { themeStretch } = useSettingsContext();

    const [selectedDirectors, setSelectedDirectors] = useState([]);

    const router = useRouter();
  
    const handleSelectDirector = (directorId) => {
        if (selectedDirectors.includes(directorId)) {
          setSelectedDirectors(selectedDirectors.filter((id) => id !== directorId));
        } else {
          if (selectedDirectors.length < 5 && selectedDirectors.length < 3) {
            setSelectedDirectors([...selectedDirectors, directorId]);
          }
        }
      };
      

    const handleOpenModal = () => { null };

    const theme = useTheme();

    const directors = data.directors;
    const handleContinue = () => {
        const directorDetails = selectedDirectors.map(director => {
          return {
            id: director.id,
            name: director.fullName,
            image: director.imageUrl,
            type: director.type
          };
        });
        const encodedDetails = btoa(JSON.stringify(directorDetails));
        router.push({
          pathname: PATH_DASHBOARD.projects.question,
          query: { d: encodedDetails },
        });
      };

    return (
      <>
        <Head>
          <title> New Project | Personal Board</title>
        </Head>

        <Container maxWidth={themeStretch ? false : 'xl'} sx={{ pt: 4, pb: 15 }}>
          <Stack direction="row" alignItems="center" 
            sx={{ mt: 2, 
                  mb: 8,
            }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Create Your Board
              </Typography>
              <Typography variant="p" gutterBottom>
                Select Your virtual Coaches, Mentors and Sponsors (max 5)
              </Typography>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
            <Button
            variant="contained"
            size="large"
            disabled={selectedDirectors.length < 3}
            onClick={handleContinue}
            >
            Ask Your Board
            </Button>
            </Box>
          </Stack>

          <Grid container spacing={2}>
  {directors.map((director) => (
    <Grid item xs={3} md={3} key={director.id}>
      <Paper
        variant="outlined"
        sx={{
          borderColor: (theme) => alpha(theme.palette.grey[500], 0.12),
          cursor: "pointer",
          ...(selectedDirectors.includes(director) && {
            backgroundColor: "primary.main",
            color:"white"
          }),
        }}
        onClick={() => {
            if (selectedDirectors.length < 5) {
              selectedDirectors.includes(director)
                ? setSelectedDirectors(selectedDirectors.filter((d) => d !== director))
                : setSelectedDirectors([...selectedDirectors, director]);
            }
          }}
      >
                  <CardActionArea
                    component={m.div}
                    whileHover="hover"
                    sx={{
                      color: 'text.secondary',
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <m.div>
                      <Image src={director.imageUrl} alt={director.fullName} sx={{ height: 250 }} />
                    </m.div>
                  </CardActionArea>

                  <Typography variant="subtitle2" sx={{ p: 2, textAlign: 'center' }}>
                    {director.fullName}
                  </Typography>
                  </Paper>
    </Grid>
  ))}
</Grid>

          <Stack direction="row" alignItems="center" 
            sx={{ mt: 4, 
                  mb: 4,
            }}>
            <Box sx={{ flexGrow: 1 }}>
            Selected {selectedDirectors.length} of 5 directors
            </Box>
            <Button
            variant="contained"
            size="large"
            disabled={selectedDirectors.length < 3}
            onClick={handleContinue}
            >
            Ask Your Board
            </Button>
            
          </Stack>

        </Container>
      </>
    );
  }
