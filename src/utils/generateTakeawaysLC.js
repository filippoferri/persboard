import { OpenAI } from "langchain/llms/openai";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const MODEL = "text-curie-001"
const MAX_TOKENS = 200;
const TEMPERATURE = 0;

export const generateTakeawaysLC = async (discussion) => {
    try {

        // CHAT
        const model = new OpenAI({
            modelName: MODEL,
            openAIApiKey: OPENAI_API_KEY, 
            temperature: TEMPERATURE,
            maxTokens: MAX_TOKENS,
            topP: 1,
            compression: true,
            stop: ". ",
        });

        const takeawaysPrompt = `Given the following discussion, provide a list of action items:\n\n${discussion}\n\nAction Items:\n1.`;

        const res = await model.call(takeawaysPrompt)
        const takeawaysText = res.trim();
        const takeawaysList = takeawaysText.split('\n');

        return takeawaysList.map((takeaway) => {
            // Remove the number and the period from the takeaway
            const text = takeaway.replace(/^\d+\.\s*/, '');
            return { text };
        });

    } catch (error) {
        console.log('Error while generating takeaways: ', error);
        return [
            {
                text: 'No important points covered in the discussion.',
            },
        ];
    }
};