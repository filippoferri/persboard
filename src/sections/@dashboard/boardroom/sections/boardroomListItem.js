import PropTypes from 'prop-types';
// @mui
import {
    Badge,
    Stack,
    Typography,
    ListItemText,
    ListItemButton,
    ListItemAvatar,
} from '@mui/material';
  // components
import { CustomAvatar, CustomAvatarGroup } from '../../../../components/custom-avatar';

// ----------------------------------------------------------------------

BoardroomListItem.propTypes = {
    director: PropTypes.object,
    handleOpenDetails: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function BoardroomListItem({director, handleOpenDetails, index} ) {

    return (
        <ListItemButton
            disableGutters
            sx={{
                py: 1.5,
                px: 2.5,
            }}
            key={index}
            onClick={() => handleOpenDetails(director)}>
            <ListItemAvatar>
                <CustomAvatar
                    alt={director.fullName}
                    src={director.avatar}
                    sx={{ width: 48, height: 48 }}
                />
            </ListItemAvatar>
        
                <ListItemText
                    primary={director.fullName ? director.role : director.fullName}
                    primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
                    secondary={director.fullName ? director.fullName: director.role}
                    secondaryTypographyProps={{
                        noWrap: true,
                        variant: 'body2',
                        color: 'text.secondary',
                    }}
                />
                
        </ListItemButton>
    );
}
