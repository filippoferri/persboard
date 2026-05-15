import { requestBoardroomAi } from './boardroomAiClient';

export const generateRationalConclusionLC = async (discussion) => {
    try {
        return await requestBoardroomAi('rationalConclusion', {
            discussion,
        });
    } catch (error) {
        console.error('Error while generating the rational conclusion: ', error);

        return [
            {
                text: 'No rational conclusion available for the discussion.',
            },
        ];
    }
};
