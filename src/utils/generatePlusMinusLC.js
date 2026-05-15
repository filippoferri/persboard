import { requestBoardroomAi } from './boardroomAiClient';

export const generatePlusMinusLC = async (discussion) => {
    try {
        return await requestBoardroomAi('plusMinus', {
            discussion,
        });
    } catch (error) {
        console.error('Error while generating pluses and minuses: ', error);

        return [
            {
                text: 'No relevant pluses and minuses discovered in the discussion.',
            },
        ];
    }
};
