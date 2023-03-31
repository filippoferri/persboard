import PropTypes from 'prop-types';
// @mui
import { Stack, Typography } from '@mui/material';
// Utils
import DownloadPdf from '../../../../utils/downloadPdf';

// ----------------------------------------------------------------------

BoardroomHeader.propTypes = {
    directors: PropTypes.array,
    question: PropTypes.string,
    discussion: PropTypes.array,
    takeaways: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function BoardroomHeader({directors, question, discussion, takeaways}) {

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
                    <Typography sx={{ fontWeight: "bold" , color: "grey.600"}}>Report</Typography>
                </Stack>

                <DownloadPdf 
                    directors={directors} 
                    question={question} 
                    discussion={discussion} 
                    takeaways={takeaways} />
        </Stack>
    );
}
