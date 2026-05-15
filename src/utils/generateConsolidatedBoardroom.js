import { withCache } from './responseCache';
import { requestBoardroomAi } from './boardroomAiClient';

const _generateConsolidatedBoardroom = async (discussion, user) => {
    try {
        return await requestBoardroomAi('consolidated', {
            discussion,
            user,
        });
    } catch (error) {
        console.error('Error in consolidated boardroom generation:', error);

        return {
            takeaways: [],
            scenarios: [],
        };
    }
};

export const generateConsolidatedBoardroom = withCache(_generateConsolidatedBoardroom, 'generateConsolidatedBoardroom');

export default generateConsolidatedBoardroom;
