import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const MAX_TOKENS = 500;
const TEMPERATURE = 0.2;

export const generatePlusMinusLC = async (discussion) => {
    try {

        // CHAT
        const chat = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY, 
        modelName: 'gpt-4o-mini',
            temperature: TEMPERATURE,
            maxTokens: MAX_TOKENS,
            topP: 1,
            compression: true,
        });

        const parser = StructuredOutputParser.fromNamesAndDescriptions({
            plus: "define an array of four pluses.",
            minus: "define an array of four minuses.",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `As a director on the personal board, provide a list of pluses and minuses for a given advice.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Here is the advice: "{discussion}". Be concise.\n\n{format_instructions}`
            ),
        ]);

        const chain = new LLMChain({
            prompt: chatPrompt,
            stop: ". ",
            llm: chat,
        });

        const response = await chain.call({
            discussion,
            format_instructions: formatInstructions,
        });

        console.log('response', response);

        const responseText = response.text.replace(/```json\n|\n```/g, '');
        const responseJson = JSON.parse(responseText);

        const pluses = {
            number: 1,
            icon: "plus",
            text: responseJson.plus,
        };
            
        const minuses = {
            number: 2,
            icon: "minus",
            text: responseJson.minus,
        };

        console.log('pluses', pluses);
        console.log('minuses', minuses);

        return [pluses, minuses];

    } catch (error) {
        console.log('Error while generating pluses and minuses: ', error);
        return [
            {
                text: 'No relevant pluses and minuses discovered in the discussion.',
            },
        ];
    }
};