import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { List } from '@mui/material';
//
import BoardroomListItem from './boardroomListItem';
import FileDetailsDrawer from '../../directors/DirectorDetailsDrawer';

// ----------------------------------------------------------------------

BoardroomList.propTypes = {
    directors: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function BoardroomList({directors}) {

    const [openDetails, setOpenDetails] = useState(false);
    const [selectedDirector, setSelectedDirector] = useState({});

    const handleOpenDetails = (director) => {
        setSelectedDirector(director);
        setOpenDetails(true);
    };

    const handleCloseDetails = () => {
        setOpenDetails(false);
    };

    return (
    <>
        <List disablePadding >
            {directors.map((director, index) => (   
                <BoardroomListItem 
                    director={director}
                    key={index}
                    handleOpenDetails={handleOpenDetails}
                />
            ))}
        </List>

        <FileDetailsDrawer
            item={selectedDirector}
            open={openDetails}
            onClose={handleCloseDetails}
            boardroom
        />

    </>
    );
}
