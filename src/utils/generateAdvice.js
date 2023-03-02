import axiosInstance from './axiosOpenai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const generateAdvice = async (advisoryDirectors, question) => {
  try {
    const prompts = advisoryDirectors.map((advisoryDirector) => {
      return `Act as ${advisoryDirector.fullName}, an expert ${advisoryDirector.role}, and talk in first person. Reply to ${question}, considering that your key quality is ${advisoryDirector.quality} and your expertise area is ${advisoryDirector.area}. Start the advice in different ways with either "My advice is...", either "I think...", either "I would suggest to" either similar. Acting as ${advisoryDirector.fullName}, when available, close sharing your personal famous phrase. Make the advice short.`;
    });

    const { data } = await axiosInstance.post(`/engines/text-davinci-003/completions`, {
      prompt: prompts,
      max_tokens: 10,
      n: 1,
      temperature: 0.5
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}` 
      }
    });  
    
    if (data?.choices) {
      return data.choices.map((choice, index) => {
        if (choice?.text) {
          return {
            fullName: advisoryDirectors[index].fullName,
            role: advisoryDirectors[index].role,
            text: choice.text,
          };
        } else {
          throw new Error("No response found from API");
        }
      });
    } else {
      throw new Error("No response found from API");
    }
  } catch (error) {
    console.log("Error while generating advice: ", error);
    return advisoryDirectors.map((advisoryDirector) => ({ fullName: advisoryDirector.fullName, text: 'Something went wrong!! ☹️' }));
  }
};




// export const generateAdvice = async (advisoryDirector, question) => {
//   try {
//     const advice = `Act as ${advisoryDirector.fullName}$, an expert ${advisoryDirector.role}$ and reply to: ${question}$`;

//     const { data } = await axiosInstance.post(`/engines/text-davinci-003/completions`, {
//       prompt: advice,
//       max_tokens: 100,
//       n: 1,
//       temperature: 0.5
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${OPENAI_API_KEY}` 
//       }
//     });  
    
//     if (data?.choices?.[0]?.text) {
//       return data.choices[0].text;
//     } else {
//       throw new Error("No response found from API");
//     }
//   } catch (error) {
//     console.log("Error while generating advice: ", error);
//     return 'Something went wrong!! ☹️';
//   }
// }