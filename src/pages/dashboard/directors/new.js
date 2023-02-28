// next
import Head from 'next/head';
import { Container, Typography, Box } from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';

import UserNewDirectorForm from '../../../sections/@dashboard/directors/NewDirector';

// ----------------------------------------------------------------------

PageNewDirector.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageNewDirector() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Add Director | Personal Board</title>
      </Head>

      <Container>
        <CustomBreadcrumbs
          heading="Create Your Personal Director"
          links={[
            {
              name: 'AI Directors',
              href: PATH_DASHBOARD.directors.root,
            },
            { name: 'New Director' },
          ]}
        />
        <UserNewDirectorForm />
      </Container>
    </>
  );
}
