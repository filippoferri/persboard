import PropTypes from 'prop-types';
import { Card, Stack } from '@mui/material';

// subsections
import BoardroomDrawer from './sections/boardroomDrawer';
import BoardroomHeader from './sections/boardroomHeader';
import BoardroomReport from './sections/boardroomReport';
import BoardroomFooter from './sections/boardroomFooter';


// ----------------------------------------------------------------------

Boardroom.propTypes = {
    aid: PropTypes.string,
    directors: PropTypes.array,
    question: PropTypes.string,
    discussion: PropTypes.array,
    takeaways: PropTypes.array,
    scenarios: PropTypes.array,
    plusMinus: PropTypes.array,
    rationalConclusion: PropTypes.array,
    swotAnalysis: PropTypes.array,
    soarAnalysis: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function Boardroom( {
    aid, 
    directors, 
    question, 
    discussion, 
    takeaways,
    scenarios,
    plusMinus,
    rationalConclusion,
    swotAnalysis,
    soarAnalysis,
} ) {

    return (
            <Card sx={{ minHeight: '75vh', display: 'flex' }}>

                <BoardroomDrawer directors={directors} />

                <Stack flexGrow={1} sx={{ overflow: 'hidden' }}>

                    <BoardroomHeader 
                        directors={directors}
                        question={question}
                        discussion={discussion}
                        takeaways={takeaways}
                        scenarios={scenarios} 
                        plusMinus={plusMinus} 
                        rationalConclusion={rationalConclusion} 
                        swotAnalysis={swotAnalysis} 
                        soarAnalysis={soarAnalysis} 
                        aid={aid}
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
                                scenarios={scenarios} 
                                plusMinus={plusMinus} 
                                rationalConclusion={rationalConclusion} 
                                swotAnalysis={swotAnalysis} 
                                soarAnalysis={soarAnalysis} 
                            />
                        </Stack>

                    </Stack>
                    
                    <BoardroomFooter />
                    
                </Stack>
            </Card>
    );
}