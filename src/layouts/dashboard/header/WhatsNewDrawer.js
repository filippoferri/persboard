import { useRef } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
    Box,
    Stack,
    Avatar,
    Drawer,
    Button,
    Typography,
    Card,
    Chip,
} from '@mui/material';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';


// ----------------------------------------------------------------------

FileDetailsDrawer.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};

export default function FileDetailsDrawer({ open, onClose, ...other }) {
    const headwayRef = useRef(null);

    const handleClick = () => {
        window.open('https://headwayapp.co/personal-board-news', '_blank');
    };

    return (
        <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        BackdropProps={{
            invisible: true,
        }}
        PaperProps={{
            sx: { width: 320 },
        }}
        {...other}
        >
        <Scrollbar sx={{ height: 1, backgroundColor: "grey.100" }}>
            <Stack 
                direction="row" 
                alignItems="center" 
                justifyContent="space-between" 
                sx={{ p: 2.5, borderBottom: 1, borderColor: "grey.300", backgroundColor: "white" }}>
                <Typography variant="h6">What's New</Typography>
                <Box sx={{ cursor:"pointer" }} onClick={onClose}>
                    <Iconify icon="eva:close-outline" />
                </Box>
            </Stack>
    
                <Stack sx={{ p: 3 }}>
                    <Card sx={{ p: 2.5, cursor: "pointer" }} onClick={handleClick}>
                        <Chip label="NEW" color="primary" size="small" sx={{ mb: 1 }} />
                        <Typography variant='body1' gutterBottom sx={{ fontWeight: "bold" }}>Your Personal Board Is Online</Typography>
                        <Typography variant='body2' paragraph>We are excited to introduce you to a new platform that we believe will revolutionize the way you make important decisions, navigate complex challenges, and achieve your goals.</Typography>
                        <Typography variant='body2' sx={{ color: "primary.dark" }}>Read the whole post</Typography>
                    </Card>
                </Stack>

        </Scrollbar>
    
    
        <Box sx={{ p: 2.5 }}>
            <Button
                fullWidth
                variant="soft"
                size="large"
                startIcon={<Iconify icon="eva:external-link-outline" />}
                onClick={handleClick}
            >
                View All
            </Button>
            </Box>
        </Drawer>
    );
    }