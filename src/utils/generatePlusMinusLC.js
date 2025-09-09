import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";
import { OPENAI_MODELS } from '../config/openai-models';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const generatePlusMinusLC = async (discussion) => {
    try {

        // CHAT - using centralized configuration
        const { modelName, temperature, maxTokens, topP, compression } = OPENAI_MODELS.LANGCHAIN_DEFAULT;
        const chat = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY,
            modelName,
            temperature,
            maxTokens,
            topP,
            compression,
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