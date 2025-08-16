import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { StructuredOutputParser } from "langchain/output_parsers";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const MAX_TOKENS = 300;
const TEMPERATURE = 0.2;

export const generateRationalConclusionLC = async (discussion) => {
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
            title: "define a short conclusion as a sentence.",
            desc: "define an explanation of that conclusion.",
        });

        const formatInstructions = parser.getFormatInstructions();

        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `As a director on the personal board, please provide a rational conclusion based on advice.`
            ),
            HumanMessagePromptTemplate.fromTemplate(
                `Here is the advice: "{discussion}". Please provide a conclusion that takes into account pluses and minuses to make a decision.\n\n{format_instructions}`
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

        const responseText = response.text.replace(/```json\n|\n```/g, '');
        const responseJson = JSON.parse(responseText);

        return responseJson;

    } catch (error) {
        console.log('Error while generating the rational conclusion: ', error);
        return [
            {
                text: 'No rational conclusion available for the discussion.',
            },
        ];
    }
};