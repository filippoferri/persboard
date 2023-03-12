// next
import NextLink from 'next/link';
// @mui
import { Link, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

export default function NavCreateNew() {

  return (
    <Link 
      component={NextLink}
      underline="none" 
      color="inherit"
      href={PATH_DASHBOARD.projects.new} 
      sx={{
        backgroundColor: '#3366ff', 
        color: "white",
        borderRadius: 1,
        padding: 4,
        textAlign: "center",
        fontWeight: "bold",
        cursor: "pointer",
        mt: 2,
      }}>
          <Typography variant="subtitle1" noWrap>
            Ask Your Board
          </Typography>
    </Link>
  );
}
