import PropTypes from 'prop-types';
// @mui
import { Stack, Typography, IconButton, Tooltip } from '@mui/material';

// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp, deleteDoc } from 'firebase/firestore';
// Router
import { useRouter } from 'next/router';
import { FIREBASE_API } from '../../../../config-global';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// utils
import DownloadPdf from '../../../../utils/downloadPdf';
// Router
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';

// ----------------------------------------------------------------------

BoardroomHeader.propTypes = {
    aid: PropTypes.string,
    directors: PropTypes.array,
    question: PropTypes.string,
    discussion: PropTypes.array,
    swotAnalysis: PropTypes.array,
    soarAnalysis: PropTypes.array,
    scenarios: PropTypes.array,
    plusMinus: PropTypes.array,
    rationalConclusion: PropTypes.array,
    takeaways: PropTypes.array,
    handleRefresh: PropTypes.func,
    isNew: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function BoardroomHeader({aid, directors, question, 
    discussion, 
    swotAnalysis,
    soarAnalysis,
    scenarios,
    plusMinus,
    rationalConclusion,
    takeaways,
    handleRefresh, isNew}) {

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();
    const { push } = useRouter();

    const { enqueueSnackbar } = useSnackbar();

    async function handleSave() {
        const myBoardroomsRef = doc(collection(db, "users", user.uid, "myBoardrooms"));
        try {
            // add discussion to firestore
            const data = {
                question,
                directors,
                discussion,
                dateAdd: Timestamp.fromDate(new Date())
            };
            if (swotAnalysis,length !== 0) {
                data.swotAnalysis = swotAnalysis;
            }
            if (soarAnalysis.length !== 0) {
                data.soarAnalysis = soarAnalysis;
            }
            if (scenarios.length !== 0) {
                data.scenarios = scenarios;
            }
            if (plusMinus.length !== 0) {
                data.plusMinus = plusMinus;
            }
            if (rationalConclusion.length !== 0) {
                data.rationalConclusion = rationalConclusion;
            }
            if (takeaways.length !== 0) {
                data.takeaways = takeaways;
            }
            await setDoc(myBoardroomsRef, data);
            enqueueSnackbar('Discussion saved!');
        } catch (error) {
            console.error('Error adding discussion:', error);
        }
    }

    const onDelete = async (boardroomId) => {
        try {
        const boardroomRef = doc(collection(db, 'users', user.uid, 'myBoardrooms'), boardroomId);
        await deleteDoc(boardroomRef);
            console.log(`Advice with id ${boardroomId} has been deleted`);
        } catch (error) {
            console.error('Error deleting the advice:', error);
        }
    };

    const handleDelete = () => {
        onDelete(aid);
        enqueueSnackbar('Advice deleted');
        push(PATH_DASHBOARD.advices.root);
    }

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                backgroundColor: "grey.200",
                height: 65,
                p: 2.5,
                borderBottom:1, 
                borderColor: "grey.300"
            }}
            >
                <Stack flexGrow={1}>
                    <Typography sx={{ fontWeight: "bold" , color: "grey.600"}}>
                        {isNew ? "Discussion" : "Report"}
                    </Typography>
                </Stack>

                { discussion.length > 0 ? (
                <>
                    { isNew ? (
                    <Tooltip title="Ask your board again to get different advices">
                        <IconButton 
                            color= 'default' 
                            onClick={() => {
                                handleRefresh();
                            }}>
                            <Iconify icon="eva:refresh-outline" />
                        </IconButton>
                    </Tooltip>
                    ) : ( null )}

                    <DownloadPdf 
                        directors={directors} 
                        question={question} 
                        discussion={discussion} 
                        takeaways={takeaways} 
                        scenarios={scenarios} 
                        plusMinus={plusMinus} 
                        rationalConclusion={rationalConclusion} 
                        swotAnalysis={swotAnalysis} 
                        soarAnalysis={soarAnalysis} 
                        />

                    { isNew ? (
                    <Tooltip title="Save this discussion for a future consult">
                        <IconButton 
                            color= 'default' 
                            onClick={() => {
                                handleSave();
                            }}>
                            <Iconify icon="eva:save-outline" />
                        </IconButton>
                    </Tooltip>
                    ) : ( 
                    <Tooltip title="Delete this discussion">
                        <IconButton 
                            color= 'default' 
                            onClick={() => {
                                handleDelete(aid);
                            }}>
                            <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                    </Tooltip>
                    )}
                </>
                ) : ( null ) }
        </Stack>
    );
}
