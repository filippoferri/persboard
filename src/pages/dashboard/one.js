import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';
import {generateAdvice} from '../../utils/generateAdvice';


// ----------------------------------------------------------------------

PageOne.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageOne() {
  const { themeStretch } = useSettingsContext();
  const [story, setStory] = useState('');

  useEffect(() => {
    async function generateStory() {
      const prompts = await generateAdvice('Steve Jobs', 'How can I earn my first 500k?');
      setStory(prompts);
    }
    generateStory();
  }, []);

  return (
    <>
      <Head>
        <title>Page One | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Generated Story:
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {story}
        </Typography>
      </Container>
    </>
  );
}
