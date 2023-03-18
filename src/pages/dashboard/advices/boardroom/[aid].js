import { useEffect, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Paper, Box, Container, Typography, Grid } from '@mui/material';
// firebase
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FIREBASE_API } from '../../../../config-global';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// Router
import { PATH_DASHBOARD } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import CustomList from '../../../../components/list';
// sections
import AdvisoryBoard from '../../../../sections/@dashboard/projects/AdvisoryBoard';
// Utils
import DownloadPdf from '../../../../utils/downloadPdf';

const app = initializeApp(FIREBASE_API);
const db = getFirestore(app);

// ----------------------------------------------------------------------

BoardroomView.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function BoardroomView() {
    const {
        query: { aid },
    } = useRouter();

    const [adviceData, setAdviceData] = useState({});
    const { user } = useAuthContext();

    const directors = adviceData.directors || [];
    const discussion = adviceData.discussion || [];
    const takeaways = adviceData.takeaways || [];

    // Retrieve data from Firestore using `aid`
    const generateDiscussion = useCallback(async () => {
        try {
            const adviceRef = doc(db, 'users', user.uid, 'myBoardrooms', aid);
            const adviceDoc = await getDoc(adviceRef);
        if (adviceDoc.exists()) {
            const adviceResult = adviceDoc.data();
            setAdviceData(adviceResult);
        } else {
            console.log(`No advice found with id ${aid}`);
        }
        } catch (error) {
            console.error(error);
        }
    }, [aid, user.uid]);

    useEffect(() => {
        generateDiscussion();
    }, [generateDiscussion]);

    const timestamp = adviceData.dateAdd;
    const date = timestamp ? timestamp.toDate() : null;
    const dateString = date ? `${date.toLocaleDateString()}` : '';
    const boardroomtitle = `Boardroom | ${dateString}`

    return (
    <>
        <Head>
            <title>{`${adviceData.question || 'Advice'} | Personal Board`}</title>
        </Head>

    <Container>
        <CustomBreadcrumbs
            heading={boardroomtitle}
            links={[
            {
                name: 'Dashboard',
                href: PATH_DASHBOARD.root,
            },
            {
                name: 'Advices',
                href: PATH_DASHBOARD.advices.root,
            },
            {
                name: boardroomtitle,
            },
        ]}
        />

        <Paper variant="outlined" sx={{ flexGrow: 1 }}>
            <Grid container spacing={0} sx={{minHeight: '600px'}}>

                <Grid item xs={3} sx={{borderRight: '1px solid #DFE3E8'}}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight: 'bold', color: '#637381',bgcolor: '#f4f6f8'}}>
                        Advisory Board
                    </Box>
                    <AdvisoryBoard directors={directors} />
                </Grid>

                <Grid container item xs={9} direction="column" sx={{flexGrow: 1}} >

                    <Box sx={{ display: 'flex', borderBottom: '1px solid #DFE3E8', height: '75px', alignItems: 'center', p: 2, fontWeight:'bold', color:'#637381', bgcolor: '#f4f6f8' }}>
                        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', }}>
                            Meaningful Discussion   
                        </Box>
                        <DownloadPdf directors={directors} question={adviceData.question} discussion={discussion} takeaways={takeaways} />
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', p:2, pb: 4 }}>

                        <Grid container sx={{ display: 'flex', flex: 1, }}>
                            <Grid item sx={{ mb: 2 }}>
                                <Typography 
                                variant='caption' 
                                sx={{ fontWeight:'bold', pr: 1 }}>
                                    Your Question
                                </Typography>
                                <Box sx={{
                                    backgroundColor:"#D1E9FC", 
                                    p: 2, 
                                    borderRadius: 1, 
                                    borderTopRightRadius: 0,
                                    display: 'block',
                                    width: '100%',
                                }}>
                                    {adviceData.question}
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container justifyContent='flex-start' sx={{flex: 1}}>
                            {discussion.length === 0 ? (
                                <Grid item justifyContent="center" sx={{mb: 6}}>
                                    <Typography variant="body1" align="center" sx={{color: "#919EAB"}}>
                                        The boardroom is empty.
                                    </Typography>
                                </Grid>
                            ) : (
                                discussion.map((advice, index) => (
                                <Grid item key={index}>
                                    <Typography
                                        variant='caption'
                                        sx={{ fontWeight: 'bold', pl: 1, mb: 2 }}
                                    >
                                        {advice.fullName} | {advice.role}
                                    </Typography>
                                    <Box sx={{
                                        backgroundColor: "#F4F6F8",
                                        p: 3,
                                        borderRadius: 1,
                                        borderTopLeftRadius: 0,
                                        mb: 1,
                                    }}
                                    >
                                        {advice.text}
                                    </Box>
                                </Grid>
                                ))
                            )}
                        </Grid>

                        {takeaways.length !== 0 ? (
                        <Grid container sx={{ mb: 4, flexDirection: "row"}}>
                            <Grid item sx={{ display: "flex" }}>
                                <CustomList listSubheader="Key Takeaways" takeaways={takeaways} />
                            </Grid>
                        </Grid> ) : null }

                    </Box>

                </Grid>
            </Grid>
        </Paper>

    </Container>
    </>
    );
}
