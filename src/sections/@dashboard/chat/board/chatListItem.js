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

export default function ChatListItem() {

    return (
        <ListItemButton
            disableGutters
            sx={{
                py: 1.5,
                px: 2.5,
            }}
            >
            <ListItemAvatar>
                <CustomAvatar
                    key=""
                    alt=""
                    src=""
                    sx={{ width: 48, height: 48 }}
                />
            </ListItemAvatar>
        
                <ListItemText
                    primary="first name"
                    primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
                    secondary="coach"
                    secondaryTypographyProps={{
                        noWrap: true,
                        variant: 'body2',
                        color: 'text.secondary',
                    }}
                />
                
            </ListItemButton>
        );
}
