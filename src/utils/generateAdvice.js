import axiosInstance from './axiosOpenai';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const generateAdvice = async (advisoryDirectors, question, user) => {

  const { firstName, myProfile } = user;
  const firstNameCapitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const openingSentences = [
    'My advice to you is to',
    'In my experience, it is helpful to',
    'Have you considered',
    'One strategy you could try is',
    'To achieve your goals, you may want to',
    'I suggest that you',
    'When facing a challenge like this, I recommend',
    'From what I understand, it may be helpful to',
    'What has worked for me in the past is',
    'If I were in your position, I would',
  ];

  const motivationalPhrases = [
    "A mantra I live by is...",
    "One thing that keeps me going is...",
    "A quote that inspires me is...",
    "A saying I often think of is...",
    "Something I remind myself daily is...",
    "A phrase that helps me push through tough times is...",
    "A message I hold close is...",
    "A thought that drives me forward is...",
    "A maxim I believe in is...",
    "An idea that motivates me is..."
  ];
  

  try {
    const advice = await Promise.all(advisoryDirectors.map(async ({ fullName, role, desc }) => {

      let profile = '';
      if (myProfile) { 
        profile = `People tell that I am a person who ${myProfile[0]}, ${myProfile[1]}, ${myProfile[2]}, and ${myProfile[3]}.`;
      }

      const openingSentence = openingSentences[Math.floor(Math.random() * openingSentences.length)];
      const motivationalPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

      // Generate a new prompt for this advisory director
      const prompt = `You are ${fullName}, and I want you to act as an expert ${role}. You are part of my personal Board of Directors and my name is ${firstNameCapitalized}. ${profile}\n\nActually, I'm looking for advice. I will provide you with some information about my goals and challenges, and it will be your goal to come up with suggestions or insights that can help me achieve my goals.\n\nThis could involve providing positive affirmations, giving helpful advice, or suggesting activities I can do to reach my end goal. Enhance your reply with your personal motivational phrase starting with "${motivationalPhrase}". My request is "${question}" and you can start with "${openingSentence}...".\n`;

      // Generate response from OpenAI API
      const { data } = await axiosInstance.post(
        '/completions',
        {
          model: 'text-curie-001',
          prompt,
          max_tokens: 700,
          top_p: 1,
          temperature: 0,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      if (!data?.choices || !data.choices[0]?.text) {
        throw new Error('No response found from API');
      }

      // Save the generated advice for this director
      return {
        fullName,
        role,
        text: data.choices[0].text,
      };
    }));

    // Return the generated advice for each advisory director
    return advice;
  } catch (error) {
    console.log('Error while generating advice: ', error);

    return advisoryDirectors.map(({ fullName, role }) => ({
      fullName,
      role,
      text: 'Something went wrong!! ☹️',
    }));
  }
};