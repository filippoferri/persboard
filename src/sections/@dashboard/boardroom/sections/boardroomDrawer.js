import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Drawer, Typography, IconButton } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
// subsections
import BoardroomList from './boardroomList.js';

// ----------------------------------------------------------------------

BoardroomDrawer.propTypes = {
    directors: PropTypes.array,
};

// ----------------------------------------------------------------------

const StyledToggleButton = styled((props) => <IconButton disableRipple {...props} />)(
    ({ theme }) => ({
        left: 0,
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        top: theme.spacing(6),
        borderRadius: `0 12px 12px 0`,
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        boxShadow: theme.customShadows.primary,
        '&:hover': {
        backgroundColor: theme.palette.primary.darker,
        },
    })
);

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

export default function BoardroomDrawer({directors}) {
    const theme = useTheme();

    const isDesktop = useResponsive('up', 'md');

    const [openNav, setOpenNav] = useState(false);

    useEffect(() => {
        if (!isDesktop) {
            handleCloseNav();
        } else {
            handleOpenNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDesktop]);

    const handleToggleNav = () => {
        setOpenNav(!openNav);
    };

    const handleOpenNav = () => {
        setOpenNav(true);
    };
    
    const handleCloseNav = () => {
        setOpenNav(false);
    };

    const renderContent = (
        <>
        <Box sx={{ height: 65, p: 2.5, backgroundColor:"grey.200", borderBottom:1, borderColor: "grey.300" }}>
            <Stack 
                direction="row" 
                alignItems="center" 
                justifyContent="center"
                >
                <>
                    <Typography sx={{ fontWeight: "bold" , color: "grey.600"}}>Advisory Board</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                </>

                {!isDesktop && (
                    <IconButton onClick={handleToggleNav}>
                    <Iconify icon={openNav ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} />
                    </IconButton>
                )}
            </Stack>
        </Box>
    
        <Scrollbar>
            <BoardroomList directors={directors} />
        </Scrollbar>
        </>
    );

    return (
        <>
        {!isDesktop && (
            <StyledToggleButton onClick={handleToggleNav}>
            <Iconify width={16} icon="eva:people-fill" />
            </StyledToggleButton>
        )}
    
        {isDesktop ? (
            <Drawer
                open={openNav}
                variant="persistent"
                PaperProps={{
                    sx: {
                    pb: 1,
                    width: 1,
                    position: 'static',
                    },
                }}
                sx={{
                    width: NAV_WIDTH,
                    transition: theme.transitions.create('width'),
                }}
            >
            {renderContent}
            </Drawer>
        ) : (
            <Drawer
            open={openNav}
            onClose={handleCloseNav}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                pb: 1,
                width: NAV_WIDTH,
                },
            }}
            >
            {renderContent}
            </Drawer>
        )}
        </>
    );
}
    
