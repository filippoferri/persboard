import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import {
    Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography
} from '@mui/material';
// Firebase/Firestore
import { initializeApp } from 'firebase/app';
import { FIREBASE_API } from '../../../config-global';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// sections
import FileDetailsDrawer from '../../../sections/@dashboard/directors/DirectorDetailsDrawer';

// ----------------------------------------------------------------------

AdvisoryBoard.propTypes = {
    directors: PropTypes.array,
};

// ----------------------------------------------------------------------


export default function AdvisoryBoard({
    directors,
}) {
    const { user } = useAuthContext();
    const [loadedDirectors, setLoadedDirectors] = useState([]);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedDirector, setSelectedDirector] = useState({});

    const handleOpenDetails = (director) => {
        setSelectedDirector(director);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
    };

    async function fetchDirectors() {

        if (!directors.id) {
            setLoadedDirectors(directors);
            return;
        }

        const app = initializeApp(FIREBASE_API);
        const db = getFirestore(app);
    
        const loadedDirectors = await Promise.all(
            directors.map(async (directorId) => {
                const directorDoc = await getDoc(doc(db, 'directors', directorId));
                const myDirectorDoc = await getDoc(doc(db, "users", user && user.uid, "myDirectors", directorId));
                
                const directorData = directorDoc.data() || {};
                const myDirectorData = myDirectorDoc.exists() ? myDirectorDoc.data() : {};
                
                return {
                    id: directorDoc.id,
                    ...directorData,
                    ...myDirectorData
                };
            })
        );
            
        setLoadedDirectors(loadedDirectors);
    }
    

    useEffect(() => {
        fetchDirectors();
    }, [directors]);
    

    return (
        <>
            <List sx={{ width: '100%' }}>
                <List>
                {loadedDirectors.map((director, index) => (
                    <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleOpenDetails(director)}>
                        <ListItemAvatar>
                        <Avatar alt={director.fullName} src={director.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={director.id ? director.role : director.fullName}
                            secondary={director.id ? director.fullName: director.role}
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
