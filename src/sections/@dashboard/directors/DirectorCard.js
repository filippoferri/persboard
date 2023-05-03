// 
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
// import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Typography } from '@mui/material';
// components
// import Image from '../../../components/image';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import Label from '../../../components/label';
// import Iconify from '../../../components/iconify';

import SvgColor from '../../../components/svg-color';
// sections
import FileDetailsDrawer from './DirectorDetailsDrawer';

// ----------------------------------------------------------------------

DirectorCard.propTypes = {
  director: PropTypes.object,
  check: PropTypes.bool,
  onDelete: PropTypes.func,
  boardroom: PropTypes.bool,
  isList: PropTypes.bool,
  isBoard: PropTypes.bool,
};

export function DirectorCard({director, check, onDelete, boardroom, isList, isBoard }) {

  const [openDetails, setOpenDetails] = useState(false);

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  // Delete director
  const handleDelete = (directorId) => {
    handleCloseDetails();
    onDelete(directorId);
  };  

  const dirAvatar = director.avatar ? director.avatar : '/assets/illustrations/avatars/ai_default.svg';

  let bgColor;
  let topColor;
  let textColor;
  let borderColor;
  
  if (check) {
    bgColor = 'primary.main';
    topColor = 'primary.darker';
    textColor = 'white';
    borderColor = 'primary.main';
  } else {
    bgColor = 'white';
    topColor = 'grey.300';
    textColor = 'text.secondary';
    borderColor = 'grey.200';
  }
  


  return (
    <>
      <Card
        sx={{
          borderColor,
          backgroundColor: bgColor,
          color: textColor,
          minHeight: 180,
          cursor: "pointer",
        }}
        onClick={isList || isBoard ? handleOpenDetails : null}
      >
        <Box sx={{ position: 'relative', textAlign: "center" }}>
      
          <Label
            variant="filled"
            color = {(director.type === 'Premium' && 'warning' || 'info')}
            sx = {{
              top: 8,
              left: 8,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {director.type}
          </Label>
        

          <SvgColor
            src="/assets/shape_avatar.svg"
            sx={{
              width: 144,
              height: 62,
              zIndex: 10,
              left: 0,
              right: 0,
              bottom: -26,
              mx: 'auto',
              position: 'absolute',
              color: bgColor,
            }}
          />

          <Avatar
            alt={director.fullName}
            src={dirAvatar}
            sx={{
              width: 64,
              height: 64,
              zIndex: 11,
              left: 0,
              right: 0,
              bottom: -32,
              mx: 'auto',
              position: 'absolute',
            }}
          />

          <Box
            color="primary"
            size="medium"
            onClick={handleOpenDetails}
            sx={{
              right: 14,
              top: 8,
              zIndex: 100,
              position: 'absolute',
              cursor: 'pointer',
            }}
          >
            <MenuOpenRoundedIcon />
          </Box>

          <Box sx={{ backgroundColor: topColor, height: 40, w: "100%" }} />
        </Box>

        <Typography variant="h5" sx={{ mt: 6, mb: 0.5, textAlign: "center" }}>
          {director.role}
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: textColor, textTransform: "uppercase"   }}>
          {director.fullName}
        </Typography>
      </Card>

      <FileDetailsDrawer
        item={director}
        open={openDetails}
        onClose={handleCloseDetails}
        onDelete={() => handleDelete(director.id)}// pass the function to handle delete action
        boardroom={boardroom || isBoard}
      />
    </>
  );
}