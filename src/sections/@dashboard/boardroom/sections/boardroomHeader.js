import PropTypes from 'prop-types';
// @mui
import { Stack, Typography, IconButton, Tooltip } from '@mui/material';

// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, updateDoc, getDoc, Timestamp, increment } from 'firebase/firestore';
// import { increment } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../config-global';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// utils
import DownloadPdf from '../../../../utils/downloadPdf';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';

// ----------------------------------------------------------------------

BoardroomHeader.propTypes = {
    directors: PropTypes.array,
    question: PropTypes.string,
    discussion: PropTypes.array,
    takeaways: PropTypes.array,
    handleRefresh: PropTypes.func,
    isNew: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function BoardroomHeader({directors, question, discussion, takeaways, handleRefresh, isNew}) {

    const app = initializeApp(FIREBASE_API);
    const db = getFirestore(app);
    const { user } = useAuthContext();

    const { enqueueSnackbar } = useSnackbar();

    async function handleSave() {
        const myBoardroomsRef = doc(collection(db, "users", user.uid, "myBoardrooms"));
        try {
            // add discussion to firestore
            await setDoc (myBoardroomsRef,{
                question,
                directors,
                discussion,
                takeaways,
                dateAdd: Timestamp.fromDate(new Date()),
            });
            enqueueSnackbar('Discussion saved!');
        } catch (error) {
            console.error('Error adding discussion:', error);
        }
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

                { discussion.length > 1 ? (
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
                        takeaways={takeaways} />

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
                    ) : ( null )}
                </>
                ) : ( null ) }
        </Stack>
    );
}
