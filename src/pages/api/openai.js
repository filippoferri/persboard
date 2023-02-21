import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const { dir1, lifeQuestion } = req.body;
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generateAdvice(dir1, lifeQuestion),
    temperature: 0.6,
    max_tokens: 2048,
  });
  const headers = {
    'Authorization': `Bearer ${ process.env.OPENAI_API_KEY}`,
  };
}
function generateAdvice(dir1, lifeQuestion) {
  return `As ${boarddirector1}$, ${lifeQuestion}?`;
}