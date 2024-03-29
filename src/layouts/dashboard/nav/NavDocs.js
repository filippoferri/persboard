import { useState, useEffect } from 'react';
// @mui
import { Stack, Button, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
// Router
import { useRouter } from 'next/router';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { PATH_DASHBOARD } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
import { FIREBASE_API } from '../../../config-global';

// ----------------------------------------------------------------------

export default function NavDocs() {
  const { user } = useAuthContext();
  // const app = initializeApp(FIREBASE_API);
  // const db = getFirestore(app);

  const theme = useTheme();
  const PRIMARY_LIGHTER = theme.palette.primary.lighter;

  const [credits, setCredits] = useState(user.credits);

  const router = useRouter();
  const handleClick = () => {
    router.push({ pathname: PATH_DASHBOARD.billing.root });
  };

  useEffect(() => {
    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
  
    if (!user) {
      setCredits(null);
      return () => {};
    }
  
    const creditsRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(creditsRef, (snapshot) => {
      const data = snapshot.data();
      setCredits(data.credits);
    });
  
    return unsubscribe;
  }, [user, user.uid, setCredits]);  

  return (
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
        <Box sx={{ p: 3, backgroundColor: alpha(PRIMARY_LIGHTER, 0.4), borderRadius: 2 }}>
          <Typography variant="body2">Credits Remaining:</Typography>
          <Typography variant="h4" color="primary">
            {credits} credits
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Check out our credit packs to enjoy up to 1000 credits
          </Typography>
          <Button variant="outlined" onClick={handleClick}>
            Buy Credits
          </Button>
        </Box>
      </Stack>
  );
}
