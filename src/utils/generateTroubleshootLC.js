import { requestBoardroomAi } from './boardroomAiClient';

export const generateTroubleshootLC = async (discussion) => {
    try {
        return await requestBoardroomAi('troubleshoot', {
            discussion,
        });
    } catch (error) {
        console.error('Error while generating a troubleshoot: ', error);

        return [
            {
                text: 'No troubleshoot found in the discussion.',
            },
        ];
    }
};
