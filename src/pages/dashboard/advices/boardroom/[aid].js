import { useEffect, useState, useCallback } from 'react';
// import PropTypes from 'prop-types';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// firebase
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// Router
import { PATH_DASHBOARD } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
// sections
import { Boardroom } from 'src/sections/@dashboard/boardroom';
// config
import { FIREBASE_API } from '../../../../config-global';

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

        <Boardroom 
            directors={directors} 
            question={adviceData.question} 
            discussion={discussion} 
            takeaways={takeaways}
        />

    </Container>
    </>
    );
}
