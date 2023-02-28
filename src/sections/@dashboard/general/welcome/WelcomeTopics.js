// title: WelcomeTopics

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import Head from 'next/head';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../config-global';
// uuid
import { v4 as uuidv4 } from 'uuid';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Grid } from '@mui/material';
import { bgGradient } from '../../../../utils/cssStyles';
// components
import Iconify from '../../../../components/iconify';
import { FilePanel, FileFolderCard, FileNewFolderDialog } from '../../../../components/topics';

// ----------------------------------------------------------------------

WelcomeTopics.propTypes = {
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function WelcomeTopics({ title, ...other }) {
  const app = initializeApp(FIREBASE_API);
  const db = getFirestore(app);
  const { user } = useAuthContext();

  const [folderName, setFolderName] = useState('');
  const [openNewFolder, setOpenNewFolder] = useState(false);
  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState('');

  const handleOpenNewFolder = () => {
    setOpenNewFolder(true);
  };

  const handleCloseNewFolder = () => {
    setOpenNewFolder(false);
  };

  const handleChangeFolderName = (folderId) => {
    setFolderName(event.target.value);
  };
  
  // Create new folder
  const handleCreateNewFolder = async () => {
    setFolderName(folderName);
    const uniqueFolderId = uuidv4();
    const userRef = doc(collection(db, 'users', user && user.uid, 'folders'), uniqueFolderId);
    try {
      // add folder to firestore
      await setDoc(userRef, {
        folderName: folderName,
        dateAdd: Timestamp.fromDate(new Date()),
        dateEdit: Timestamp.fromDate(new Date()),
      });
      console.log('New document added with ID:', uniqueFolderId);
    } catch (error) {
      console.error('Error adding document:', error);
    }
    handleCloseNewFolder();
  };
  // Update folder name
  const handleUpdateFolderName = (event, folderId) => {
    console.log('Update folder with id:', folderId);
  };
  // Delete folder
  const handleDeleteItem = async (folderId) => {
    console.log('Delete folder with id:', folderId);
    try {
      const folderRef = doc(collection(db, 'users', user.uid, 'folders'), folderId);
      await deleteDoc(folderRef);
      console.log(`Folder with id ${folderId} has been deleted`);
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  useEffect(() => {
    const foldersRef = collection(db, 'users', user && user.uid, 'folders');
    const unsubscribe = onSnapshot(foldersRef, (snapshot) => {
      const foldersData = [];
      snapshot.forEach((doc) => {
        foldersData.push({ id: doc.id, ...doc.data() });
      });
      setFolders(foldersData);
    });
    return unsubscribe;
  }, [db, user]);

  return (
    <>
      <FilePanel title={title} link="" onOpen={handleOpenNewFolder} sx={{ mt: 5 }} />

      <FileNewFolderDialog 
        open={openNewFolder} 
        onClose={handleCloseNewFolder} 
        title="New Topic" 
        folder={folderName} 
        onChangeFolderName={(event) => handleChangeFolderName(event, folderId)}
        onCreate={handleCreateNewFolder}
        onUpdate={handleUpdateFolderName}
    />

      <Grid container>
        <Stack direction="row" spacing={3} sx={{ pb: 3 }}>
          {folders.map((folder) => (
            <FileFolderCard 
              key={folder.id}
              folder={folder}
              sx={{ minWidth: 222 }} 
              selected={false}
              onDelete={() => handleDeleteItem(folder.id)}
            />
          ))}
        </Stack>
      </Grid>
    </>
  );
}
