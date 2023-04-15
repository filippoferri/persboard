// next
import Head from 'next/head';
import { Container, Typography } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

PageBoards.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageBoards() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Boards | Personal Board</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
      <Typography variant="h3" component="h1" paragraph>
          advice
        </Typography>

        <Typography gutterBottom> 

        for tests
          
        </Typography>

      </Container>
    </>
  );
}
