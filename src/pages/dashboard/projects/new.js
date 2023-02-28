import React, { useEffect, useState } from 'react';
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
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../config-global';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// Image
import Image from '../../../components/image';
// components
import { useSettingsContext } from '../../../components/settings';
import {DirectorCard} from '../../../sections/@dashboard/directors/DirectorCard';
// sections
import { varHover, varTranHover } from '../../../components/animate';
// data
import data from '../../../utils/data.json';

import { useScrollTrigger } from '@mui/material';
import { animated } from 'framer-motion';
import { textAlign } from '@mui/system';


// ----------------------------------------------------------------------

PageNewProject.getLayout = (page) => <StepperLayout step={0}>{page}</StepperLayout>;

// ----------------------------------------------------------------------

export default function PageNewProject() {
    const { themeStretch } = useSettingsContext();

    const router = useRouter();

    const [selectedDirectors, setSelectedDirectors] = useState([]);

    const handleClick = () => {
      router.push({ pathname: PATH_DASHBOARD.directors.newDirector});};
  
    const handleSelectDirector = (directorId) => {
      if (selectedDirectors.includes(directorId)) {
        setSelectedDirectors(selectedDirectors.filter((id) => id !== directorId));
      } else if (selectedDirectors.length < 5) {
        setSelectedDirectors([...selectedDirectors, directorId]);
      }
    };
  
    // const handleOpenModal = () => { null };

    // const handleNewDirector = () => {
    //  router.push({ pathname: PATH_DASHBOARD.directors.newDirector});};

    const theme = useTheme();

    const handleContinue = () => {
        const directorDetails = selectedDirectors.map(director => {
          return {
            id: director.id,
            fullName: director.fullName,
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

      const app = initializeApp(FIREBASE_API);
      const db = getFirestore(app);
      
      const { user } = useAuthContext();
      console.log (user)
  
      const [directors, setDirectors] = useState([]);
      const [myDirectors, setMyDirectors] = useState([]);

    const [checkedDirectors, setCheckedDirectors] = useState(Array(myDirectors.length).fill(false));

    const NewDirectorCard = ({ director, check, onClick, index }) => {
      const { fullName, imageUrl, type } = director;
      return (
        <DirectorCard key={director.id} director={director} check={checkedDirectors[index]} />
      );
    };

    // Get directors
    useEffect(() => {
      const directorsRef = collection(db, 'directors');
      const myDirectorsRef = collection(db, 'users', user && user.uid, 'myDirectors');
      const unsubscribeDirectors = onSnapshot(directorsRef, (snapshot) => {
          const directorsData = [];
          snapshot.forEach((doc) => {
          directorsData.push({ id: doc.id, ...doc.data() });
          });
          setDirectors(directorsData);
      });
      const unsubscribeMyDirectors = onSnapshot(myDirectorsRef, (snapshot) => {
          const myDirectorsData = [];
          snapshot.forEach((doc) => {
          myDirectorsData.push({ id: doc.id, ...doc.data() });
          });
          setMyDirectors(myDirectorsData);
      });
      return () => {
          unsubscribeDirectors();
          unsubscribeMyDirectors();
      };
      }, [db, user]);
    

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
                sx={{ mr: 1 }}
                color="info"
                //bonClick={handleNewDirector}
                >
                  Add New Director
                </Button>

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
    
          <Grid container spacing={3} sx={{flexDirection: 'row'}}>
          {myDirectors.length > 0 && (
            myDirectors.map((director, index) => (
              <Grid sx={{ cursor: "pointer" }} item xs={12} sm={4} lg={3} key={director.id} onClick={() => handleSelectDirector(director.id)}>
              <DirectorCard director={director} check={selectedDirectors.includes(director.id)} />
            </Grid>
            ))
          )}
          {directors.length > 0 && (
            directors.map((director, index) => (
              <Grid sx={{ cursor: "pointer" }} item xs={12} sm={4} lg={3} key={director.id} onClick={() => handleSelectDirector(director.id)}>
              <DirectorCard director={director} check={selectedDirectors.includes(director.id)} />
            </Grid>
            
            ))
          )}
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