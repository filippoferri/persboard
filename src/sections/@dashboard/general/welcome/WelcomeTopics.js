import { useState } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import Head from 'next/head';
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
import { bgGradient } from '../../../../utils/cssStyles';
import Iconify from '../../../../components/iconify';
import { FilePanel } from '../../../../components/topics';

WelcomeTopics.propTypes = {
  img: PropTypes.node,
  action: PropTypes.node,
  title: PropTypes.string,
  quote: PropTypes.string,
  author: PropTypes.string,
};

export default function WelcomeTopics({ title, ...other }) {
  const [folderName, setFolderName] = useState('');
  const [openNewFolder, setOpenNewFolder] = useState(false);
  const [openUploadFile, setOpenUploadFile] = useState(false);

  const handleOpenNewFolder = () => {
    setOpenNewFolder(true);
  };

  const handleCloseNewFolder = () => {
    setOpenNewFolder(false);
  };

  const handleOpenUploadFile = () => {
    setOpenUploadFile(true);
  };

  const handleCloseUploadFile = () => {
    setOpenUploadFile(false);
  };

  const handleChangeFolderName = (event) => {
    setFolderName(event.target.value);
  };

  const handleCreateNewFolder = () => {
    handleCloseNewFolder();
    setFolderName('');
    console.log('CREATE NEW FOLDER', folderName);
  };

  return (
    <>
      <FilePanel
        title="Topics"
        link=""
        onOpen={handleOpenNewFolder}
        sx={{ mt: 5 }}
      />

      {/* <FileNewFolderDialog open={openUploadFile} onClose={handleCloseUploadFile} /> */}

      {/* <Stack direction="row" spacing={3} sx={{ pb: 3 }}>
        <FileFolderCard
          key={folder.id}
          folder={folder}
          onDelete={() => console.log('DELETE', folder.id)}
          sx={{ minWidth: 222 }}
        />
      </Stack>

      <FileNewFolderDialog
        open={openNewFolder}
        onClose={handleCloseNewFolder}
        title="New Folder"
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
        onCreate={handleCreateNewFolder}
      /> */}
    </>
  );
}
