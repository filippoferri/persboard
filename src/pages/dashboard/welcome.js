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
// assets
import { SeoIllustration } from '../../assets/illustrations';
import { UpgradeStorageIllustration } from '../../assets/illustrations';
import {
  WelcomeIntro,
  WelcomeUpgrade,
  WelcomeTopics
} from '../../sections/@dashboard/general/welcome';

// ----------------------------------------------------------------------

PageWelcome.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageWelcome() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();

  return (
    <>
      <Head>
        <title> Welcome | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <WelcomeIntro
              title={`Welcome back, \n ${user?.firstName}!`}
              quote="If you cannot do great things, do small things in a great way."
              author="Napoleon Hill"
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 600,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
              /> }
              action={<Button size="large"  variant="contained" href={PATH_DASHBOARD.projects.newProject}>Get Started</Button>}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <WelcomeUpgrade
              description="Upgrade your plan and get more advices"
              cta="Upgrade Plan"
              img={
                <UpgradeStorageIllustration
                  sx={{
                    p: 1,
                    width: 260,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                /> }
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            
            <WelcomeTopics title="Folders" />

          </Grid>
        </Grid>
      </Container>
    </>
  );
}
