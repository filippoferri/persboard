import { withCache } from './responseCache';
import { requestBoardroomAi } from './boardroomAiClient';

const _generateScenariosLC = async (discussion, user) => {
    try {
        return await requestBoardroomAi('scenarios', {
            discussion,
            user,
        });
    } catch (error) {
        console.error('Error while generating scenarios: ', error);

        return [
            {
                text: 'No scenarios discovered in the discussion.',
            },
        ];
    }
};

export const generateScenariosLC = withCache(_generateScenariosLC, 'generateScenariosLC');
