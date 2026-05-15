import { requestBoardroomAi } from './boardroomAiClient';

export const generateSoarAnalysisLC = async (discussion) => {
    try {
        return await requestBoardroomAi('soar', {
            discussion,
        });
    } catch (error) {
        console.error('Error while generating SOAR analysis: ', error);

        return [
            {
                text: 'No relevant SOAR analysis available for the discussion.',
            },
        ];
    }
};
