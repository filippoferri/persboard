// next
import Head from 'next/head';
//import { Container, Typography } from '@mui/material';
import { Container, Grid, Stack, Button } from '@mui/material';

// auth
import { useAuthContext } from '../../auth/useAuthContext';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';

import {
  AppWelcome,
} from '../../sections/@dashboard/general/app';

import { SeoIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

PageWelcome.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageWelcome() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();

  return (
    <>
      <Head>
        <title> Projects | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName}`}
              description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={<Button variant="contained" href={PATH_DASHBOARD.projects.newProject}>Create New Project</Button>}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
