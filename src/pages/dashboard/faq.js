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
                    <Typography>What is Personal Board AI?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography component="p" sx={{ mb: 1}}>The Personal Board AI is an innovative decision-making and goal achievement platform that leverages advanced artificial intelligence to provide personalized advice, insights, and guidance to users.</Typography><Typography component="p" sx={{ mb: 1}}> By assembling a virtual board of AI-powered directors with expertise in various fields and domains, the platform helps users make informed decisions and overcome challenges in their personal and professional lives.  Users interact with their personal board by asking questions or seeking advice on specific topics, goals, or situations. The AI-powered directors analyze the user&apos;s context, draw upon their expert knowledge, and deliver tailored recommendations, strategies, and support.</Typography><Typography component="p" sx={{ mb: 1}}> The platform empowers users to make better decisions, achieve their goals, and grow both personally and professionally. The Personal Board AI is designed to be user-friendly, with an intuitive interface that makes it easy for users to engage with their virtual board members, track their progress, and implement the advice provided.</Typography><Typography component="p" sx={{ mb: 1}}> By combining cutting-edge AI technology with a deep understanding of human needs and motivations, the Personal Board AI offers a unique and powerful tool for personal and professional growth.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                    <Typography>How does Personal Board AI works?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography component="p" sx={{ mb: 1}}>Personal Board AI is an advanced decision-making and goal achievement platform that leverages artificial intelligence to offer personalized advice, insights, and guidance to users through a virtual board of AI-powered directors. Each director has expertise in various fields and domains, providing a comprehensive support system for users to make informed decisions and overcome challenges in their personal and professional lives.</Typography><Typography component="p" sx={{ mb: 1}}> How does Personal Board AI works? </Typography><Typography component="p" sx={{ mb: 1}}><b>Create a personal board:</b> Users start by assembling a personal board composed of AI-powered directors with expertise in different areas, such as finance, career development, health, relationships, or personal growth. </Typography><Typography component="p" sx={{ mb: 1}}><b>Ask questions or seek advice:</b> Users interact with their personal board by asking questions or seeking advice on specific topics, goals, or situations they are facing. </Typography><Typography component="p" sx={{ mb: 1}}><b>AI-powered analysis and response:</b> The AI-powered directors analyze the user&apos;s context, draw upon their expert knowledge, and generate tailored recommendations, strategies, and support that address the user&apos;s needs. </Typography><Typography component="p" sx={{ mb: 1}}><b>Review and implement advice:</b> Users receive personalized advice from each director on their board, which they can review, compare, and implement in their lives to make better decisions and achieve their goals.</Typography><Typography component="p" sx={{ mb: 1}}> By combining cutting-edge AI technology with a deep understanding of human needs and motivations, the Personal Board AI offers a powerful and unique tool for personal and professional growth.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                    <Typography>What can Personal Board AI do for you?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography component="p" sx={{ mb: 1}}>Personal Board AI offers numerous benefits, providing personalized guidance and insights to help users navigate various aspects of their lives.</Typography><Typography component="p" sx={{ mb: 1}}><b>Personalized Advice:</b> Personal Board AI provides tailored advice based on your unique situation, helping you make informed decisions and achieve your goals.</Typography><Typography component="p" sx={{ mb: 1}}><b>Wide Range of Expertise:</b> Your virtual board consists of AI-powered directors with expertise in various fields, providing a comprehensive support system for diverse aspects of your life, such as career development, personal growth, financial management, and more.</Typography><Typography component="p" sx={{ mb: 1}}><b>24/7 Availability:</b> Personal Board AI is available round the clock, providing support and advice whenever you need it, regardless of your location or time zone.</Typography><Typography component="p" sx={{ mb: 1}}><b>Decision-making Support:</b> By analyzing your situation and presenting various perspectives, Personal Board AI enhances your decision-making process, helping you make choices that align with your objectives.</Typography><Typography component="p" sx={{ mb: 1}}><b>Goal Achievement:</b> Personal Board AI provides actionable steps and strategies to help you achieve your goals, whether they're short-term tasks or long-term objectives.</Typography><Typography component="p" sx={{ mb: 1}}><b>Confidentiality:</b> Your interactions with Personal Board AI are confidential, providing a safe space for you to explore sensitive topics or challenges.</Typography><Typography component="p" sx={{ mb: 1}}><b>Continuous Learning:</b> As an AI-based system, Personal Board AI learns from each interaction, improving its understanding of your needs and refining its advice over time.</Typography><Typography component="p" sx={{ mb: 1}}><b>Cost-Effective:</b> Compared to the cost of consulting with multiple human experts, Personal Board AI provides a cost-effective solution for accessing expert advice and insights.</Typography><Typography component="p" sx={{ mb: 1}}> 
                    By using Personal Board AI, you gain access to a powerful tool that supports your personal and professional growth, empowering you to make better decisions and achieve your goals.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                    <Typography>Can AI replace human directors?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography component="p" sx={{ mb: 1}}>AI has made significant strides and can now perform many tasks previously reserved for humans, including providing expert advice in a variety of fields. However, while AI can supplement and enhance human capabilities in many ways, it cannot entirely replace human directors or advisors. Why?</Typography><Typography component="p" sx={{ mb: 1}}><b>Human Insight:</b> Humans possess a depth of understanding and insight that AI does not. We draw on a vast array of experiences and emotions, which allows us to perceive nuances and complexities that AI might miss.</Typography><Typography component="p" sx={{ mb: 1}}><b>Emotional Intelligence:</b> While AI can mimic certain aspects of human interaction, it cannot fully replicate emotional intelligence. Human directors are capable of empathy, understanding emotions, and can adjust their responses based on subtle cues, which AI cannot replicate to the same degree.</Typography><Typography component="p" sx={{ mb: 1}}><b>Ethics and Judgment:</b> Certain situations require ethical considerations and judgment calls that AI is not equipped to handle. AI operates based on algorithms and data, and while it can make predictions based on this data, it cannot make ethical decisions or exercise judgment in the same way humans can.</Typography><Typography component="p" sx={{ mb: 1}}><b>Creativity and Innovation:</b> AI can generate ideas based on existing data, but human directors have the ability to think outside the box, imagine new possibilities, and innovate in ways that AI cannot.</Typography><Typography component="p" sx={{ mb: 1}}><b>Contextual Understanding:</b> While AI has improved in understanding context, it still struggles with tasks that require a deep understanding of context, especially in dynamic or complex situations. Humans excel at interpreting context and can adapt their advice or decisions based on changing circumstances.</Typography><Typography component="p" sx={{ mb: 1}}>In conclusion, while AI can serve as a powerful tool to augment human capabilities and provide valuable insights and recommendations, it is not a replacement for human directors. The ideal scenario is often a combination of both, where AI assists and enhances human decision-making and expertise.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    >
                    <Typography>Can I meet my Personal Directors in person?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography component="p" sx={{ mb: 1}}>While the term "meeting" traditionally refers to a face-to-face interaction, in the context of AI, it can be understood as interacting with the AI system. So, while you can't physically meet AI personal directors (as they are not human and don't possess a physical form), you can certainly interact with them via the Personal Board platform.</Typography><Typography component="p" sx={{ mb: 1}}>You can think of these interactions as a form of meeting, in which you present your challenges, goals, or questions to the AI directors and receive their guidance and advice in return. Just like a physical meeting, these interactions can be scheduled at your convenience, and the AI directors are available 24/7 to provide their expertise.</Typography><Typography component="p" sx={{ mb: 1}}>Remember that while AI personal directors are sophisticated algorithms capable of generating impressive and useful advice, they do not possess consciousness or subjective experiences. They do not "know" you in the human sense, but they analyze the data you provide to generate relevant and personalized advice.</Typography><Typography component="p" sx={{ mb: 1}}>In this sense, your "meeting" with AI personal directors is a unique interaction tailored to your specific needs, providing you with the benefit of diverse expertise at any time.</Typography>
                    </AccordionDetails>
                </Accordion>
                
            </Card>
            </Container>
        </m.div>
        </>
    );
}
