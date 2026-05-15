import { requestBoardroomAi } from './boardroomAiClient';

export const generateTakeaways = async (discussion, user) => {
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
