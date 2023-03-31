import PropTypes from 'prop-types';
import { Card, Stack } from '@mui/material';

// subsections
import BoardroomDrawer from './sections/boardroomDrawer';
import BoardroomHeader from './sections/boardroomHeader';
import BoardroomReport from './sections/boardroomReport';
import BoardroomFooter from './sections/boardroomFooter';


// ----------------------------------------------------------------------

Boardroom.propTypes = {
    directors: PropTypes.array,
    question: PropTypes.string,
    discussion: PropTypes.array,
    takeaways: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function Boardroom( {directors, question, discussion, takeaways} ) {

    return (
            <Card sx={{ minHeight: '75vh', display: 'flex' }}>

                <BoardroomDrawer directors={directors} />

                <Stack flexGrow={1} sx={{ overflow: 'hidden' }}>

                    <BoardroomHeader 
                        directors={directors}
                        question={question}
                        discussion={discussion}
                        takeaways={takeaways}
                    />
        
                    <Stack
                        direction="row"
                        flexGrow={1}
                        sx={{
                            overflow: 'hidden',
                        }}
                    >
                        <Stack flexGrow={1} sx={{ minWidth: 0 }}>
                            <BoardroomReport
                                question={question} 
                                discussion={discussion} 
                                takeaways={takeaways}
                            />
                            <BoardroomFooter />
                        </Stack>

                    </Stack>
                    
                </Stack>
            </Card>
    );
}