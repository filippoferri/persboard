import { useState } from 'react';
// next
import Head from 'next/head';
import { Container, Box, Card, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { m } from "framer-motion";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

PageFaq.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

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

    export default function PageFaq() {
    const { themeStretch } = useSettingsContext();

    const isDesktop = useResponsive('up', 'lg');

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
        <Head>
            <title> FAQ | Personal Board</title>
        </Head>

        <m.div
                initial="hidden"
                animate="visible"
                variants={variants}
            >

            <Container maxWidth={themeStretch ? false : 'lg'}>
            <Box sx={{pl: 2}}>
                <CustomBreadcrumbs
                        heading="Frequently Asked Questions"
                        links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'FAQ',
                            href: PATH_DASHBOARD.about,
                        },
                    ]}
                />
            </Box>
            <Card sx={ isDesktop ? { p: 4, backgroundColor: "grey.100" } : { p: 2, backgroundColor: "grey.100" }}>

                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>What is a Personal Board of Directors?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>A Personal Board of Directors is a group of trusted advisors that individuals assemble to provide support and guidance in achieving their personal and professional goals. This group typically consists of individuals with diverse backgrounds, expertise, and perspectives, who can offer insights and advice tailored to the individual's unique needs and aspirations.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                    <Typography>How do I build my Personal Board?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>Building a Personal Board requires careful consideration and selection of AI Directors who can offer insights, guidance, and support. Start by identifying those who have expertise and experience in areas that are relevant to your goals, and who share your values and vision. It's important to choose directors who are invested in your success and growth, and who can offer diverse perspectives and advice.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                    <Typography>How many directors should be on my Personal Board?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>The size of your Personal Board will depend on your individual needs and goals. Typically, a Personal Board consists of three to five carefully selected directors who can offer diverse perspectives and expertise.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                    <Typography>How often should I engage with my personal directors?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>The frequency of engagement with your Personal Board will depend on your individual needs and goals. It's important to stay in touch and provide regular updates on your progress, and to seek guidance and support as needed.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                    <Typography>How do I get the most out of my Personal Board?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>To get the most out of your Personal Board, it's important to approach the relationship with a spirit of openness and willingness to learn. Be receptive to feedback and advice, and be proactive in seeking out guidance and support. It's also important to be transparent and honest with your directors about your goals and challenges, and to seek their insights and expertise in overcoming obstacles and achieving your aspirations.</Typography>
                    </AccordionDetails>
                </Accordion>
                
            </Card>
            </Container>
        </m.div>
        </>
    );
}
