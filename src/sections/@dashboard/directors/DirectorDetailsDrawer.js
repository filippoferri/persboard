import PropTypes from 'prop-types';
// import { useState } from 'react';
// @mui
import {
  Box,
  Alert,
  Stack,
  Drawer,
  Button,
  Divider,
  Typography,
} from '@mui/material';

// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import Label from '../../../components/label';
import { CustomAvatar } from '../../../components/custom-avatar';


// ----------------------------------------------------------------------

FileDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  favorited: PropTypes.bool,
  onFavorite: PropTypes.func,
  boardroom: PropTypes.bool,
};

export default function FileDetailsDrawer({
    item,
    open,
    favorited,
    onFavorite,
    onClose,
    onDelete,
    boardroom,
    ...other
  }) {

  // const dirAvatar = item && item.avatar ? item.avatar : 'https://res.cloudinary.com/ddtdvms3g/image/upload/v1677442263/avatar_14_exfcsg.jpg';

  const QUALITY_DESCRIPTIONS = {
    Passion: 'I have a deep interest in life and being motivated to work towards personal success and fulfillment.',
    Leadership: 'I have the courage to inspire and guide others towards a common goal or vision.',
    Vision: 'I have the ability to see the big picture and set direction to achieve personal goals and aspirations.',
    Stewardship: 'I have the commitment to serve the interests of oneself, others, and the greater good, while maintaining the highest standards of integrity.',
    Knowledge: 'I possess a comprehensive understanding of oneself, others, and the world, as well as strong organizational and problem-solving skills.',
    Diligence: 'I demonstrate dedication and commitment to fulfilling personal goals and a willingness to put in the necessary effort to achieve them.',
    Collegiality: 'I have a sincere and respectful attitude towards others and their perspectives, and being able to work collaboratively towards shared goals.',
    Discretion: 'I maintain confidentiality and discretion in personal and professional interactions.'
  };  

  const AREA_DESCRIPTIONS = {
    "Advocacy": 'Empowering through representation',
    "Social Support": 'Offering care and connection',
    "Career Advice": 'Guiding toward professional success',
    "Expertise": 'Sharing specialized knowledge',
    "Developmental Feedback": 'Providing constructive critique',
    "Network": 'Connecting to valuable resources'
  };

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
          <Typography variant="h6">About</Typography>

          {/* <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorited}
            onChange={onFavorite}
            sx={{ p: 0.75 }}
          /> */}
        </Stack>

        <Stack
          spacing={3}
          justifyContent="center"
          sx={{ p: 4, bgcolor: 'background.neutral' }}
        >

        {/* <Avatar
          alt={item.fullName}
          src={dirAvatar}
          sx={{
            width: 150,
            height: 150,
            margin: 'auto',
          }}
        /> */}
        <CustomAvatar 
          src="" 
          alt={item.fullName} 
          name={item.fullName} 
          sx={{
            width: 150,
            height: 150,
            margin: 'auto',
          }}
        />

          <Typography variant="h6" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
            {item.role}
          </Typography>
          {item.desc && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Typography variant="body">{item.desc}</Typography>
            </>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mt:2, p: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Area of Expertise
          </Typography>
          <Label color="info">{item.area}</Label>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Key Quality
          </Typography>
          <Label color="info">{item.quality}</Label>
        </Stack>
        <Stack sx={{ p: 2.5 }}>
          <Alert icon={false} severity="info">{AREA_DESCRIPTIONS[item.area]}, {QUALITY_DESCRIPTIONS[item.quality]}</Alert>

        </Stack>
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