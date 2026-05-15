import { requestBoardroomAi } from './boardroomAiClient';

export const generateSwotAnalysisLC = async (discussion) => {
    try {
        return await requestBoardroomAi('swot', {
            discussion,
        });
    } catch (error) {
        console.error('Error while generating SWOT analysis: ', error);

        return [
            {
                text: 'No SWOT analysis available for the discussion.',
            },
        ];
    }
};
