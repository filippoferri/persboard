// next
import Head from 'next/head';
import { Container, Box, Typography, Stack, Card, IconButton, Grid } from '@mui/material';
import { m } from "framer-motion";
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

PageBoards.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

const variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 80,
            damping: 20,
        },
    },
};

export default function PageBoards() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
        <Head>
            <title> Your Board | Personal Board</title>
        </Head>

        <m.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Box sx={{pl: 2}}>
                    <CustomBreadcrumbs
                            heading="Your Board"
                            links={[
                            {
                                name: 'Dashboard',
                                href: PATH_DASHBOARD.root,
                            },
                            {
                                name: 'Your Board',
                                href: PATH_DASHBOARD.about,
                            },
                        ]}
                    />
                </Box>

                <Grid container>
                    <Grid item xs={12} md={9}>
                        <Stack sx={{ p: 2, backgroundColor: "grey.100", border: 1, borderColor: "grey.300", borderRadius: 2 }}>
                            <Box
                                gap={3}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                }}
                                sx={{justifyContent: "center"}} >                      
                                <Card  
                                    sx={{ 
                                        display: 'flex',
                                        textAlign: 'center', 
                                        height: 180,
                                        bgcolor: 'white',
                                        color: 'grey.600', 
                                        cursor:'pointer',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderStyle: "dashed",
                                        borderColor: "grey.300",
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            bgcolor: 'primary.lighter',
                                        },
                                        }}>
                                    <Box 
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold'
                                            }}>
                                        
                                        <IconButton
                                            size="small"
                                            color="success"
                                            sx={{
                                                p: 0,
                                                mb: 1,
                                                width: 60,
                                                height: 60,
                                                color: 'common.white',
                                                bgcolor: 'primary.light',
                                                '&:hover': {
                                                    bgcolor: 'primary.light',
                                                },
                                            }}
                                        >
                                            <Iconify icon="eva:person-outline" />
                                        </IconButton>
                                        <Typography variant="h6">
                                            Add Your <br /> First Director
                                        </Typography>
                                    </Box>
                                </Card>
                                <Card  
                                    sx={{ 
                                        display: 'flex',
                                        textAlign: 'center', 
                                        height: 180,
                                        bgcolor: 'white', 
                                        color: 'grey.600', 
                                        cursor:'pointer',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderStyle: "dashed",
                                        borderColor: "grey.300",
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            bgcolor: 'primary.lighter',
                                        },
                                        }}>
                                    <Box 
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold'
                                            }}>
                                        
                                        <IconButton
                                            size="small"
                                            color="success"
                                            sx={{
                                                p: 0,
                                                mb: 1,
                                                width: 60,
                                                height: 60,
                                                color: 'common.white',
                                                bgcolor: 'primary.light',
                                                '&:hover': {
                                                    bgcolor: 'primary.light',
                                                },
                                            }}
                                        >
                                            <Iconify icon="eva:person-outline" />
                                        </IconButton>
                                        <Typography variant="h6">
                                            Add Your <br /> Second Director
                                        </Typography>
                                    </Box>
                                </Card>
                                <Card  
                                    sx={{ 
                                        display: 'flex',
                                        textAlign: 'center', 
                                        height: 180,
                                        bgcolor: 'white', 
                                        color: 'grey.600', 
                                        cursor:'pointer',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderStyle: "dashed",
                                        borderColor: "grey.300",
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            bgcolor: 'primary.lighter',
                                        },
                                        }}>
                                    <Box 
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold'
                                            }}>
                                        
                                        <IconButton
                                            size="small"
                                            color="success"
                                            sx={{
                                                p: 0,
                                                mb: 1,
                                                width: 60,
                                                height: 60,
                                                color: 'common.white',
                                                bgcolor: 'primary.light',
                                                '&:hover': {
                                                    bgcolor: 'primary.light',
                                                },
                                            }}
                                        >
                                            <Iconify icon="eva:person-outline" />
                                        </IconButton>
                                        <Typography variant="h6">
                                            Add Your <br /> Third Director
                                        </Typography>
                                    </Box>
                                </Card>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

            </Container>

        </m.div>
        </>
    );
}
