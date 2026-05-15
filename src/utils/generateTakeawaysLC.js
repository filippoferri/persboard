import { withCache } from './responseCache';
import { requestBoardroomAi } from './boardroomAiClient';

const _generateTakeawaysLC = async (discussion, user) => {
    try {
        return await requestBoardroomAi('takeaways', {
            discussion,
            user,
        });
    } catch (error) {
        console.error('Error while generating takeaways: ', error);

        return [
            {
                text: 'No important points covered in the discussion.',
            },
        ];
    }
};

export const generateTakeawaysLC = withCache(_generateTakeawaysLC, 'generateTakeawaysLC');
