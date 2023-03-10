import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Card, Stack, Button, Divider, MenuItem, Checkbox, IconButton } from '@mui/material';
// components
import Iconify from '../iconify';
import MenuPopover from '../menu-popover';
import TextMaxLine from '../text-max-line';
import { useSnackbar } from '../snackbar';
import ConfirmDialog from '../confirm-dialog';
//
import FileNewFolderDialog from './FileNewFolderDialog';

// ----------------------------------------------------------------------

FileFolderCard.propTypes = {
  folder: PropTypes.object,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  sx: PropTypes.object,
};


export default function FileFolderCard({ folder, selected, onSelect, onDelete, sx, ...other }) {
  //const { enqueueSnackbar } = useSnackbar();

  //const [inviteEmail, setInviteEmail] = useState('');

  const [showCheckbox, setShowCheckbox] = useState(false);

  //const [openShare, setOpenShare] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  //const [openDetails, setOpenDetails] = useState(false);

  const [folderName, setFolderName] = useState(folder.folderName);

  const [openEditFolder, setOpenEditFolder] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const [favorited, setFavorited] = useState(folder.isFavorited);

  const handleFavorite = () => {
    setFavorited(!favorited);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleShowCheckbox = () => {
    setShowCheckbox(true);
  };

  const handleHideCheckbox = () => {
    setShowCheckbox(false);
  };

  // const handleOpenShare = () => {
  //   setOpenShare(true);
  // };

  // const handleCloseShare = () => {
  //   setOpenShare(false);
  // };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  // const handleCloseDetails = () => {
  //   setOpenDetails(false);
  // };

  const handleOpenEditFolder = () => {
    setOpenEditFolder(true);
  };

  const handleCloseEditFolder = () => {
    setOpenEditFolder(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  
  
  return (
    <>
      <Card
        onMouseEnter={handleShowCheckbox}
        onMouseLeave={handleHideCheckbox}
        sx={{
          p: 2.5,
          width: 1,
          maxWidth: 222,
          boxShadow: 0,
          bgcolor: 'background.default',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...((showCheckbox || selected) && {
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorited}
            onChange={handleFavorite}
            sx={{ p: 0.75 }}
          />

          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>

        {(showCheckbox || selected) && onSelect ? (
          <Checkbox
            checked={selected}
            onClick={onSelect}
            icon={<Iconify icon="eva:radio-button-off-fill" />}
            checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          />
        ) : (
          <Box
            component="img"
            src="/assets/icons/files/ic_folder.svg"
            sx={{ width: 40, height: 40 }}
          />
        )}

        <TextMaxLine variant="h6" onClick={handleOpenDetails} sx={{ mt: 1, mb: 0.5 }}>
          {folderName}
        </TextMaxLine>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ typography: 'caption', color: 'text.disabled' }}
        >
          <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />
        </Stack>
      </Card>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >

        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleOpenEditFolder();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Rename
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <FileNewFolderDialog
        open={openEditFolder}
        onClose={handleCloseEditFolder}
        title="Rename Topic"
        onUpdate={() => {
          handleCloseEditFolder();
          setFolderName(folderName);
        }}
        folderName={folderName}
        onChangeFolderName={(event) => setFolderName(event.target.value)}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" 
          onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}