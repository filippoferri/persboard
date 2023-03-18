import axiosInstance from './axiosOpenai';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const generateTakeaways = async (discussion) => {
  try {
    const takeaways = `Given the following discussion, provide a list of takeaways:\n\n${discussion}\n\nTakeaways:\n1.`;

    const { data } = await axiosInstance.post(
      '/completions',
      {
        model: 'text-davinci-003',
        prompt: takeaways,
        max_tokens: 500,
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
      const choice = data.choices[0];
      if (choice?.text) {
        const takeawaysText = choice.text.trim();
        const takeaways = takeawaysText.split('\n');
        return takeaways.map((takeaway) => {
          // Remove the number and the period from the takeaway
          const text = takeaway.replace(/^\d+\.\s*/, '');
          return { text };
        });
      } else {
        throw new Error('No response found from API');
      }
    } else {
      throw new Error('No response found from API');
    }
  } catch (error) {
    console.log('Error while generating takeaways: ', error);
    return [
      {
        text: 'Something went wrong!!',
      },
    ];
  }
};
