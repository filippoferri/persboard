import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';
// sections
// import { FilePanel } from '../../sections/@dashboard/general/welcome';


// ----------------------------------------------------------------------

WelcomeTopics.propTypes = {
  img: PropTypes.node,
  action: PropTypes.node,
  title: PropTypes.string,
  quote: PropTypes.string,
  author: PropTypes.string,
};

export default function WelcomeTopics({ title, ...other }) {
  return (
    <>
      {/* <FilePanel
        title="Folders"
        link={PATH_DASHBOARD.fileManager}
        onOpen={handleOpenNewFolder}
        sx={{ mt: 5 }}
      /> */}

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
