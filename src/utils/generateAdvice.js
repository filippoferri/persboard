import axiosInstance from './axiosOpenai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const generateAdvice = async (advisoryDirectors, question) => {
  console.log('advisoryDirector', advisoryDirectors);
  try {
    const prompt = advisoryDirectors.map(({ fullName, role, quality, area }) => (
      `Act as ${fullName}, an expert ${role}, and talk in first person. Reply to ${question}, considering that your key quality is ${quality} and your expertise area is ${area}. Start the advice in different ways with either "My advice is...", either "I think...", either "I would suggest to" either similar. Acting as ${fullName}, when available, close sharing your personal famous phrase.`
    ));

    const { data } = await axiosInstance.post(
      '/completions',
      {
        model: 'text-davinci-003',
        prompt,
        max_tokens: 10,
        n: 1,
        temperature: 0.2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (data?.choices) {
      return data.choices.map((choice, index) => {
        if (choice?.text) {
          const { fullName, role } = advisoryDirectors[index];
          return {
            fullName,
            role,
            text: choice.text,
          };
        }
        throw new Error('No response found from API');
      });
    }
    throw new Error('No response found from API');
  } catch (error) {
    console.log('Error while generating advice: ', error);
    return advisoryDirectors.map(({ fullName, role }) => ({
      fullName,
      role,
      text: 'Something went wrong!! ☹️',
    }));
  }
};