import { withCache } from './responseCache';
import { requestBoardroomAi } from './boardroomAiClient';

const _generateDiscussionLC = async (advisoryDirectors, question, user) => {
    try {
        return await requestBoardroomAi('discussion', {
            advisoryDirectors,
            question,
            user,
        });
    } catch (error) {
        console.error('Error while generating advice: ', error);

        return advisoryDirectors.map(({ fullName, role }) => ({
            director: fullName,
            fullName,
            role,
            decisionMakingStrategy: 'Sorry, I have no idea now!',
            quote: '',
        }));
    }
};

export const generateDiscussionLC = withCache(_generateDiscussionLC, 'generateDiscussionLC');
