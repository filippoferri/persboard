import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Stack,
  Avatar,
  Drawer,
  Button,
  Typography,
} from '@mui/material';

// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';


// ----------------------------------------------------------------------

FileDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  boardroom: PropTypes.bool,
};

export default function FileDetailsDrawer({
    item,
    open,
    onClose,
    onDelete,
    boardroom,
    ...other
  }) {

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      BackdropProps={{
        invisible: true,
      }}
      PaperProps={{
        sx: { width: 320 },
      }}
      {...other}
    >
      <Scrollbar sx={{ height: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6">Details</Typography>
        </Stack>

        <Stack
          justifyContent="center"
          sx={{ p: 4, bgcolor: 'background.neutral' }}
        >
        <Avatar 
          src={item.avatar}
          alt={item.fullName} 
          name={item.fullName} 
          sx={{
            width: 150,
            height: 150,
            margin: 'auto',
            mb: 2,
          }}
        />

          <Typography variant="h6" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
            {item.role}
          </Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
            {item.fullName}
          </Typography>
        </Stack>

        {item.desc && (
            <Stack sx={{ p: 3 }}>
              <Typography variant="h6">About Me</Typography>
              <Typography variant="body2">{item.desc}</Typography>
            </Stack>
          )}
      </Scrollbar>


      {item.type === 'Personal' && !boardroom && (      
      <Box sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="soft"
            color="error"
            size="large"
            startIcon={<Iconify icon="eva:trash-2-outline" />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Box>
      )}
    </Drawer>
  );
}