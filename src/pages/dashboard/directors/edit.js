// next
import Head from 'next/head';
import { Container } from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// Router
// import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
// import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';

import EditDirectorForm from '../../../sections/@dashboard/directors/EditDirector';

// ----------------------------------------------------------------------

PageEditDirector.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PageEditDirector() {
  // const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Edit Director | Personal Board</title>
      </Head>

      <Container>
        <CustomBreadcrumbs
          heading="Edit Your Personal Director"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'AI Directors',
              href: PATH_DASHBOARD.directors.root,
            },
            { name: 'Edit Director' },
          ]}
        />
        <EditDirectorForm />
      </Container>
    </>
  );
}
