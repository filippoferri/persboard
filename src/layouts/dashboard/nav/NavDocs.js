import { useState, useEffect } from 'react';
// @mui
import { Stack, Button, Typography, Box } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../config-global';

// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function NavDocs() {

  const { user } = useAuthContext();
  const app = initializeApp(FIREBASE_API);
  const db = getFirestore(app);

  const [credits, setCredits] = useState();

  const router = useRouter();
  const handleClick = () => {
    router.push({ pathname: PATH_DASHBOARD.billing.root });
  };

  // Get credits
  useEffect(() => {
    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);

    const creditsRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(creditsRef, (snapshot) => {
      const data = snapshot.data();
      setCredits(data.credits);
    });

    return unsubscribe;
  }, [user.uid]);
  

  return (
    <>
      <Stack
        spacing={3}
        sx={{
          px: 2,
          pb: 2,
          mt: 2,
          mb: 2,
          display: 'block',
        }}
      >
        <Box sx={{ p: 3, backgroundColor: '#eff3ff', borderRadius: 2 }}>
          <Typography variant="body2">Credits Remaining:</Typography>
          <Typography variant="h4" color="primary">
            {credits} credits
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Check out our credit packs to enjoy upto 1000 credits
          </Typography>
          <Button variant="outlined" onClick={handleClick}>
            Discover Plans
          </Button>
        </Box>
      </Stack>
    </>
  );
}
