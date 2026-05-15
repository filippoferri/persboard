import { requestBoardroomAi } from './boardroomAiClient';

export const generatePestelAnalysisLC = async (discussion) => {
    try {
        return await requestBoardroomAi('pestel', {
            discussion,
        });
    } catch (error) {
        console.error('Error while generating PESTEL analysis: ', error);

        return [
            {
                text: 'No PESTEL analysis available for the discussion.',
            },
        ];
    }
};
