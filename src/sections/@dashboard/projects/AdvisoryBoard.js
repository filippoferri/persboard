import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import {
    Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography
} from '@mui/material';
// Firebase/Firestore
// import { initializeApp } from 'firebase/app';
// import { FIREBASE_API } from '../../../config-global';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// sections
import FileDetailsDrawer from '../../../sections/@dashboard/directors/DirectorDetailsDrawer';
import { CustomAvatar } from '../../../components/custom-avatar';


// ----------------------------------------------------------------------

AdvisoryBoard.propTypes = {
    directors: PropTypes.array,
};

// ----------------------------------------------------------------------


export default function AdvisoryBoard({
    directors,
}) {
    const { user } = useAuthContext();
    //const [loadedDirectors, setLoadedDirectors] = useState([]);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedDirector, setSelectedDirector] = useState({});

    console.log("directors", directors);

    const handleOpenDetails = (director) => {
        setSelectedDirector(director);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
    };

    return (
        <>
            <List sx={{ width: '100%' }}>
                <List>
                {directors.map((director, index) => (
                    <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleOpenDetails(director)}>
                        <ListItemAvatar>
                        <CustomAvatar src="" alt={director.fullName} name={director.fullName} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={director.fullName ? director.role : director.fullName}
                            secondary={director.fullName ? director.fullName: director.role}
                        />
                    </ListItemButton>
                    </ListItem>
                ))}
                </List>
            </List>

            <FileDetailsDrawer
                item={selectedDirector}
                open={openDetails}
                onClose={handleCloseDetails}
                boardroom={true}
                // onDelete={handleDelete} // pass the function to handle delete action
            />
        </>
    );
}
