import axiosInstance from './axiosOpenai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type Data = {
  result?: string | undefined;
  error?: string;
};

export const generateAdvice = async (dirs, question) => {

  const advice = `Check this array ${dirs}$.
  Take each name of the array and act exactly like those persons, replying to this question: ${question}$ and giving advice using I and me, keeping in mind Advocacy, Social Support, Career Advice, Expertise, Developmental Feedback, Network. 

  Start each advice with: "My advice is...", "I think...", "I would suggest to" and similar, 
  and add your personal quote correlated to the question. 
  
  Eventually, for each advice, create this <div style="background-color:#d2e9fc;padding:1rem;border-radius:8px;margin-bottom:1rem"></Box>, including the full name into this <div style="font-weight:bold"></div>.`;

  const { data } = await axiosInstance.post(`/engines/text-davinci-003/completions`, {
    prompt: advice,
    max_tokens: 2048,
    n: 1,
    stop: null,
    temperature: 0.8
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}` 
    }
  });  
  return data.choices[0].text;
}
