import { requestBoardroomAi } from './boardroomAiClient';

export const generateAdvice = async (advisoryDirectors, question, user) => {
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
      text: 'Something went wrong!!',
    }));
  }
};
