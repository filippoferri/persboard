import PropTypes from 'prop-types';
// @mui
import { Stack, Typography, IconButton, Tooltip } from '@mui/material';
// utils
import DownloadPdf from '../../../../utils/downloadPdf';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

BoardroomHeader.propTypes = {
    directors: PropTypes.array,
    question: PropTypes.string,
    discussion: PropTypes.array,
    takeaways: PropTypes.array,
    handleRefresh: PropTypes.func,
    handleSave: PropTypes.func,
    isNew: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function BoardroomHeader({directors, question, discussion, takeaways, handleRefresh, handleSave, isNew}) {

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
