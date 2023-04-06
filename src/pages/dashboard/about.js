import Head from 'next/head';
import { Container, Grid, Box, Typography, Paper, Stack, Card, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { m } from "framer-motion";
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';


// ----------------------------------------------------------------------

PageAbout.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

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

export default function PageAbout() {
    const { themeStretch } = useSettingsContext();

    const isDesktop = useResponsive('up', 'lg');

    return (
    <>
        <Head>
            <title>About | Personal Board</title>
        </Head>

        <m.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Box sx={{pl: 2}}>
                    <CustomBreadcrumbs
                            heading="About Personal Board"
                            links={[
                            {
                                name: 'Dashboard',
                                href: PATH_DASHBOARD.root,
                            },
                            {
                                name: 'About',
                                href: PATH_DASHBOARD.about,
                            },
                        ]}
                    />
                </Box>
                <Card sx={ isDesktop ? { p: 4 } : { p: 2 }}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6}>
                            <Typography paragraph>To achieve success in your personal and professional life, it's important to seek out a broad range of experiences and perspectives. This means connecting with individuals who have more experience than you do, and who can provide honest advice and feedback on your career or personal goals. By embracing diverse viewpoints, you can gain a broader perspective on your own journey and be better equipped to make informed decisions. Remember, <Typography sx={{backgroundColor: "success.lighter", fontWeight: "bold"}} component="span">it's okay to seek guidance and support from others</Typography> - it's a sign of strength, not weakness. By recognizing that you can't do everything alone, and that you can benefit from the insights and expertise of others, <Typography sx={{backgroundColor: "success.lighter"}} component="span">you can empower yourself to reach new heights and achieve your aspirations.</Typography></Typography>
                            
                            <Typography variant="h4" component="h4">
                                What Is A Personal Board Of Directors?
                            </Typography>
                            <Typography paragraph>A Personal Board of Directors is a group of trusted advisors that individuals assemble to provide support and guidance in advancing their careers. Ideally, this group consists of individuals with a strong personal and professional interest in seeing the individual succeed. Although referred to as a "board of directors," the group doesn't physically meet around a conference table. Rather, <Typography sx={{backgroundColor: "success.lighter"}} component="span">it typically comprises three to five carefully selected individuals</Typography> to rely on for strategic guidance and support as they navigate the often complex career paths.</Typography>

                            <Typography variant="h4" component="h4">
                                Where this platfrom came from
                            </Typography>
                            <Typography paragraph>There have been several studies and articles written about the benefits of having a Personal Board of Directors.
                            <p>The concept of a Personal Board of Directors has gained popularity in recent years, with several articles and books written on the topic, including <Typography sx={{backgroundColor: "success.lighter"}} component="span">"Coach Me! Your Personal Board of Directors: Leadership Advice from the World's Greatest Coaches" by Ken Shelton</Typography>.</p>
                            Overall, there is a growing body of research and literature that supports the importance of having a Personal Board of Directors to help individuals achieve success and fulfillment in their personal and professional lives.</Typography>

                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center"}}>
                            <Stack sx={
                                isDesktop ? { borderLeft: 1, borderColor: "primary.light", p: 2, pl: 4, fontStyle: "italic" }
                                : { border: 1, borderColor: "primary.light", p: 2, fontStyle: "italic", borderRadius: 2, mb: 6 }}>
                                <Typography variant="h4" component="h4" gutterBottom>
                                    Inside Secret
                                </Typography>
                                <Typography sx={{ fontWeight: "bold"}}>A personal board of directors is …</Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Iconify icon="eva:checkmark-outline" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="3/5 diverse selected experts."
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Iconify icon="eva:checkmark-outline" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Accountability and motivation."
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Iconify icon="eva:checkmark-outline" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Advice, feedback, insights."
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Iconify icon="eva:checkmark-outline" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Trusted advisors for success."
                                        />
                                    </ListItem>
                                </List>
                                <Typography sx={{ fontWeight: "bold"}}>A board is not …</Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Iconify icon="eva:close-outline" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="One-size-fits-all solution."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Iconify icon="eva:close-outline" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Substitute for responsibility."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Iconify icon="eva:close-outline" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Responsible for your career success."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Iconify icon="eva:close-outline" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Replacement for relationships."
                                            />
                                        </ListItem>
                                    </List> 
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" component="h4">
                                Building Your Personal Board
                            </Typography>
                            <Typography paragraph>Personal Board AI allows you to choose from various AI-powered directors to create your own Personal Board. <Typography sx={{backgroundColor: "success.lighter"}} component="span">Whether you need a life coach, mentor, challenger, or supporter, our AI-powered directors can provide the guidance and support you need to achieve your goals.</Typography> Select the directors that align with your needs and objectives, and you'll be on your way to building your Personal Board tailored to your unique needs.</Typography>

                            <Typography variant="h4" component="h4">
                                What Can Personal Board Do For You?
                            </Typography>
                            <Typography paragraph>Personal Board AI, assembling a diverse group of AI-powered directors, can provide several benefits and support for you. <Typography sx={{backgroundColor: "success.lighter"}} component="span">The directors on the platform can provide guidance, support, and accountability, helping you achieve your goals and overcome challenges.</Typography> With access to a broader range of expertise, ideas, and perspectives, Personal Board can help you make better decisions and succeed tremendously in your personal and professional life. Additionally, AI-powered directors can offer personalized feedback and guidance tailored to your unique needs and goals. This can help you stay on track, progress toward your goals, and overcome obstacles more effectively.</Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "flex-end"}}>
                            <Stack sx={
                                isDesktop ? { borderLeft: 1, borderColor: "primary.light", p: 2, pl: 4, fontStyle: "italic" }
                                : { border: 1, borderColor: "primary.light", p: 2, fontStyle: "italic", borderRadius: 2, mb: 6 }}>
                                <Typography variant="h4" component="h4" gutterBottom>
                                    The Most Important "Do"
                                </Typography>
                                <List dense>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon>
                                            <Iconify icon="eva:arrow-forward-outline" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Focus on developing a personal or professional strategy: select directors who can help you build a realistic and ambitious plan for achieving your goals."
                                        />
                                    </ListItem>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon>
                                            <Iconify icon="eva:arrow-forward-outline" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Use your board as advisors, guides, and advocates: rely on your board for advice and guidance on your career journey, and enlist their support in advocating for your success."
                                        />
                                    </ListItem>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon>
                                            <Iconify icon="eva:arrow-forward-outline" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Embrace diversity: The more diverse perspectives and experiences represented on your board, the richer the insight and advice you'll receive."
                                        />
                                    </ListItem>
                                </List>
                            </Stack>
                        </Grid>
                    </Grid>
                </Card>
            </Container>
        </m.div>
    </>
    );
}
