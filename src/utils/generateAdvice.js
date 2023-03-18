import axiosInstance from './axiosOpenai';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const generateAdvice = async (advisoryDirectors, question) => {
  try {
    const discussion = advisoryDirectors.map(({ fullName, role, quality, area }) => (
      `You are ${fullName}, and I want you act as an expert ${role} and your key quality is ${quality}. I will provide you with some information about someone's goals and challenges, and it will be your job to come up with suggestions or insights that can help this person achieve their goals. Coming from your ${area} expertise, this could involve providing positive affirmations, giving helpful advice. or suggesting activities they can do to reach their end goal. Enhance your reply with your personal motivational phrase. My first request is "${question}".`
    ));

    const { data } = await axiosInstance.post(
      '/completions',
      {
        model: 'text-davinci-003', 
        prompt: discussion,
        max_tokens: 1000,
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