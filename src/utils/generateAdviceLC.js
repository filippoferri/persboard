import { requestBoardroomAi } from './boardroomAiClient';

export const generateAdviceLC = async (advisoryDirectors, question, user) => {
    try {
        return await requestBoardroomAi('advice', {
            advisoryDirectors,
            question,
            user,
        });
    } catch (error) {
        console.error('Error while generating advice: ', error);

        return advisoryDirectors.map(({ fullName, role }) => ({
            fullName,
            role,
            text: 'Sorry, I have no idea now!',
        }));
    }
};
