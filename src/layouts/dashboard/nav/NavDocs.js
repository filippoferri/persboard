import { useState, useEffect } from 'react';
// @mui
import { Stack, Button, Typography, Box } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_API } from '../../../config-global';

// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';

import Slider from '@mui/material/Slider';

// ----------------------------------------------------------------------

export default function NavDocs() {
  const { user } = useAuthContext();
  const app = initializeApp(FIREBASE_API);
  const db = getFirestore(app);
  const [remainingCredits, setRemainingCredits] = useState(null);
  const [creditsUsed, setCreditsUsed] = useState(0); // Define creditsUsed as a state variable

  const router = useRouter();
  const handleClick = () => {
    router.push({ pathname: PATH_DASHBOARD.billing.root });};


  useEffect(() => {
    async function fetchRemainingCredits() {
      const boardRoomRef = collection(db, 'users', user.uid, 'myBoardrooms');
      const querySnapshot = await getDocs(boardRoomRef);
      const usedCredits = querySnapshot.size;
      const creditsRemaining = user.credits - usedCredits;
      setCreditsUsed(usedCredits); // Update the creditsUsed state variable
      setRemainingCredits(creditsRemaining);
    }

    fetchRemainingCredits();
  }, [user, db]);

  return (
    <>
    <Stack
      spacing={3}
      sx={{
        px: 2,
        pb: 2,
        mt: 2,
        display: 'block',
      }}
    >
      <Box sx={{p:3, backgroundColor: "#eff3ff", borderRadius: 2}}>
        <Typography variant="body2">
          Credits Remaining:
        </Typography>
        <Typography variant="h4" color="primary">
          {remainingCredits} credits
        </Typography>
        <Typography variant="body2" sx={{mb: 2}}>
          Check out other plans to enjoy upto 100 credits
        </Typography>
        <Button variant="outlined" onClick={handleClick}>Discover Plans</Button>
      </Box>
    </Stack>
    </>
  );
}
